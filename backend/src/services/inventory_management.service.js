const { getMySqlPromiseConnection } = require("../config/mysql.db");

const SCHEMA_TABLES = [
  "inventory_movements",
  "recipes",
  "recipe_ingredients",
  "inventory_item_settings",
];

function uniqueNumbers(values) {
  return [...new Set(values.map(Number).filter((v) => Number.isInteger(v) && v > 0))];
}

async function tableExists(conn, tableName) {
  const [rows] = await conn.query(
    `
    SELECT COUNT(*) AS total
    FROM information_schema.tables
    WHERE table_schema = DATABASE()
      AND table_name = ?;
    `,
    [tableName]
  );
  return Number(rows[0]?.total || 0) > 0;
}

async function hasInventoryManagementSchema(conn) {
  const checks = await Promise.all(SCHEMA_TABLES.map((table) => tableExists(conn, table)));
  return checks.every(Boolean);
}

async function insertInventoryMovement(conn, movement) {
  await conn.query(
    `
    INSERT INTO inventory_movements
    (
      tenant_id, inventory_item_id, batch_id, location_id, movement_type,
      quantity_delta, unit_id, unit_cost, reference_type, reference_id,
      order_id, order_item_id, reason, created_by
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `,
    [
      movement.tenantId,
      movement.inventoryItemId,
      movement.batchId || null,
      movement.locationId || null,
      movement.movementType,
      movement.quantityDelta,
      movement.unitId || null,
      movement.unitCost || null,
      movement.referenceType || null,
      movement.referenceId || null,
      movement.orderId || null,
      movement.orderItemId || null,
      movement.reason || null,
      movement.createdBy || null,
    ]
  );
}

async function applyInventoryDelta(conn, {
  tenantId,
  inventoryItemId,
  quantityDelta,
  movementType,
  unitId,
  unitCost,
  referenceType,
  referenceId,
  orderId,
  orderItemId,
  reason,
  createdBy,
}) {
  await conn.query(
    `
    UPDATE inventory_items
    SET quantity = quantity + ?, inventory_changed_time = NOW()
    WHERE id = ? AND tenant_id = ?;
    `,
    [quantityDelta, inventoryItemId, tenantId]
  );

  await insertInventoryMovement(conn, {
    tenantId,
    inventoryItemId,
    quantityDelta,
    movementType,
    unitId,
    unitCost,
    referenceType,
    referenceId,
    orderId,
    orderItemId,
    reason,
    createdBy,
  });
}

async function legacyDeductOrderInventory(conn, orderIds, tenantId) {
  const safeOrderIds = uniqueNumbers(orderIds);
  if (safeOrderIds.length === 0) return [];

  const [items] = await conn.query(
    `
    SELECT oi.quantity, mi.inventory_id
    FROM order_items oi
    LEFT JOIN menu_items mi ON mi.id = oi.item_id
    WHERE oi.order_id IN (?)
      AND oi.tenant_id = ?
      AND oi.status <> 'cancelled';
    `,
    [safeOrderIds, tenantId]
  );

  const changedInventoryIds = [];
  for (const item of items) {
    const quantity = Number(item.quantity || 0);
    const inventoryId = Number(item.inventory_id || 0);

    if (quantity > 0 && inventoryId > 0) {
      await conn.query(
        `
        UPDATE inventory_items
        SET quantity = quantity - ?, inventory_changed_time = NOW()
        WHERE id = ? AND tenant_id = ?;
        `,
        [quantity, inventoryId, tenantId]
      );
      changedInventoryIds.push(inventoryId);
    }
  }

  return uniqueNumbers(changedInventoryIds);
}

exports.deductInventoryForCompletedOrders = async (conn, orderIds, tenantId, createdBy = null) => {
  const safeOrderIds = uniqueNumbers(orderIds);
  if (safeOrderIds.length === 0) return [];

  const hasSchema = await hasInventoryManagementSchema(conn);
  if (!hasSchema) {
    return legacyDeductOrderInventory(conn, safeOrderIds, tenantId);
  }

  const [orderItems] = await conn.query(
    `
    SELECT
      oi.id AS order_item_id,
      oi.order_id,
      oi.item_id,
      oi.quantity AS order_quantity,
      mi.inventory_id
    FROM order_items oi
    LEFT JOIN menu_items mi ON mi.id = oi.item_id AND mi.tenant_id = oi.tenant_id
    WHERE oi.order_id IN (?)
      AND oi.tenant_id = ?
      AND oi.status <> 'cancelled';
    `,
    [safeOrderIds, tenantId]
  );

  const changedInventoryIds = [];

  for (const orderItem of orderItems) {
    const orderItemId = Number(orderItem.order_item_id);
    const orderQuantity = Number(orderItem.order_quantity || 0);
    if (!orderItemId || orderQuantity <= 0) continue;

    const [existingMovement] = await conn.query(
      `
      SELECT id
      FROM inventory_movements
      WHERE tenant_id = ?
        AND order_item_id = ?
        AND movement_type = 'sale'
      LIMIT 1;
      `,
      [tenantId, orderItemId]
    );
    if (existingMovement.length > 0) continue;

    const [ingredients] = await conn.query(
      `
      SELECT
        r.id AS recipe_id,
        r.yield_quantity,
        ri.inventory_item_id,
        ri.quantity_per_yield,
        ri.unit_id,
        ri.wastage_percent
      FROM recipes r
      JOIN recipe_ingredients ri ON ri.recipe_id = r.id AND ri.tenant_id = r.tenant_id
      WHERE r.tenant_id = ?
        AND r.menu_item_id = ?
        AND r.is_active = 1;
      `,
      [tenantId, orderItem.item_id]
    );

    if (ingredients.length > 0) {
      for (const ingredient of ingredients) {
        const yieldQuantity = Number(ingredient.yield_quantity || 1) || 1;
        const recipeQuantity = Number(ingredient.quantity_per_yield || 0);
        const wastageMultiplier = 1 + Number(ingredient.wastage_percent || 0) / 100;
        const deductQuantity = (orderQuantity * recipeQuantity * wastageMultiplier) / yieldQuantity;

        if (deductQuantity <= 0) continue;

        await applyInventoryDelta(conn, {
          tenantId,
          inventoryItemId: ingredient.inventory_item_id,
          quantityDelta: -deductQuantity,
          movementType: "sale",
          unitId: ingredient.unit_id,
          referenceType: "recipes",
          referenceId: ingredient.recipe_id,
          orderId: orderItem.order_id,
          orderItemId,
          reason: "Recipe ingredient deduction",
          createdBy,
        });
        changedInventoryIds.push(ingredient.inventory_item_id);
      }
      continue;
    }

    const inventoryId = Number(orderItem.inventory_id || 0);
    if (inventoryId > 0) {
      await applyInventoryDelta(conn, {
        tenantId,
        inventoryItemId: inventoryId,
        quantityDelta: -orderQuantity,
        movementType: "sale",
        referenceType: "menu_items",
        referenceId: orderItem.item_id,
        orderId: orderItem.order_id,
        orderItemId,
        reason: "Legacy menu item inventory deduction",
        createdBy,
      });
      changedInventoryIds.push(inventoryId);
    }
  }

  return uniqueNumbers(changedInventoryIds);
};

exports.getStockAlertItemsDB = async (conn, inventoryIds, tenantId) => {
  const safeInventoryIds = uniqueNumbers(inventoryIds);
  if (safeInventoryIds.length === 0) return [];

  const [rows] = await conn.query(
    `
    SELECT id, title, quantity, stock_alert_quantity, last_ordered_date, inventory_changed_time
    FROM inventory_items
    WHERE tenant_id = ?
      AND id IN (?)
      AND stock_alert_quantity IS NOT NULL
      AND quantity <= stock_alert_quantity
    ORDER BY quantity ASC, title ASC;
    `,
    [tenantId, safeInventoryIds]
  );
  return rows;
};

exports.getInventoryUnitsDB = async () => {
  const conn = await getMySqlPromiseConnection();
  try {
    const [rows] = await conn.query("SELECT * FROM inventory_units ORDER BY unit_type, name;");
    return rows;
  } finally {
    conn.release();
  }
};

exports.getRecipeByMenuItemDB = async (menuItemId, tenantId) => {
  const conn = await getMySqlPromiseConnection();
  try {
    const [recipes] = await conn.query(
      `
      SELECT *
      FROM recipes
      WHERE menu_item_id = ? AND tenant_id = ? AND is_active = 1
      ORDER BY id DESC
      LIMIT 1;
      `,
      [menuItemId, tenantId]
    );

    if (recipes.length === 0) return null;

    const [ingredients] = await conn.query(
      `
      SELECT
        ri.*,
        ii.title AS inventory_title,
        u.code AS unit_code,
        u.name AS unit_name
      FROM recipe_ingredients ri
      LEFT JOIN inventory_items ii ON ii.id = ri.inventory_item_id
      LEFT JOIN inventory_units u ON u.id = ri.unit_id
      WHERE ri.recipe_id = ? AND ri.tenant_id = ?
      ORDER BY ri.id;
      `,
      [recipes[0].id, tenantId]
    );

    return { ...recipes[0], ingredients };
  } finally {
    conn.release();
  }
};

exports.saveRecipeDB = async ({
  menuItemId,
  name,
  yieldQuantity = 1,
  yieldUnitId = null,
  prepWastagePercent = 0,
  ingredients = [],
  tenantId,
}) => {
  const conn = await getMySqlPromiseConnection();
  try {
    await conn.beginTransaction();

    await conn.query(
      "UPDATE recipes SET is_active = 0 WHERE menu_item_id = ? AND tenant_id = ?;",
      [menuItemId, tenantId]
    );

    const [result] = await conn.query(
      `
      INSERT INTO recipes
      (tenant_id, menu_item_id, name, yield_quantity, yield_unit_id, prep_wastage_percent, is_active)
      VALUES (?, ?, ?, ?, ?, ?, 1);
      `,
      [tenantId, menuItemId, name || null, yieldQuantity || 1, yieldUnitId || null, prepWastagePercent || 0]
    );

    const recipeId = result.insertId;
    for (const ingredient of ingredients) {
      await conn.query(
        `
        INSERT INTO recipe_ingredients
        (tenant_id, recipe_id, inventory_item_id, quantity_per_yield, unit_id, wastage_percent, is_optional)
        VALUES (?, ?, ?, ?, ?, ?, ?);
        `,
        [
          tenantId,
          recipeId,
          ingredient.inventoryItemId,
          ingredient.quantityPerYield,
          ingredient.unitId || null,
          ingredient.wastagePercent || 0,
          ingredient.isOptional ? 1 : 0,
        ]
      );
    }

    await conn.commit();
    return recipeId;
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};

exports.deleteRecipeDB = async (recipeId, tenantId) => {
  const conn = await getMySqlPromiseConnection();
  try {
    await conn.query("UPDATE recipes SET is_active = 0 WHERE id = ? AND tenant_id = ?;", [
      recipeId,
      tenantId,
    ]);
  } finally {
    conn.release();
  }
};

exports.adjustInventoryStockDB = async ({
  inventoryItemId,
  quantityDelta,
  movementType = "manual_adjustment",
  reason,
  unitId = null,
  tenantId,
  createdBy = null,
}) => {
  const conn = await getMySqlPromiseConnection();
  try {
    await conn.beginTransaction();
    await applyInventoryDelta(conn, {
      tenantId,
      inventoryItemId,
      quantityDelta,
      movementType,
      unitId,
      referenceType: "manual",
      referenceId: inventoryItemId,
      reason,
      createdBy,
    });
    await conn.commit();
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};

exports.receivePurchaseDB = async ({
  supplierId = null,
  supplierOrderId = null,
  receiptNo = null,
  invoiceNo = null,
  notes = null,
  items = [],
  tenantId,
  createdBy = null,
}) => {
  const conn = await getMySqlPromiseConnection();
  try {
    await conn.beginTransaction();

    const [receipt] = await conn.query(
      `
      INSERT INTO inventory_purchase_receipts
      (tenant_id, supplier_id, supplier_order_id, receipt_no, invoice_no, status, notes, created_by)
      VALUES (?, ?, ?, ?, ?, 'received', ?, ?);
      `,
      [tenantId, supplierId, supplierOrderId, receiptNo, invoiceNo, notes, createdBy]
    );

    const receiptId = receipt.insertId;
    for (const item of items) {
      let batchId = item.batchId || null;

      if (!batchId && (item.batchNo || item.expiryDate)) {
        const [batch] = await conn.query(
          `
          INSERT INTO inventory_batches
          (tenant_id, inventory_item_id, location_id, batch_no, received_date, expiry_date, quantity_on_hand, unit_cost)
          VALUES (?, ?, ?, ?, CURDATE(), ?, ?, ?);
          `,
          [
            tenantId,
            item.inventoryItemId,
            item.locationId || null,
            item.batchNo || null,
            item.expiryDate || null,
            item.quantityReceived,
            item.unitCost || null,
          ]
        );
        batchId = batch.insertId;
      }

      await conn.query(
        `
        INSERT INTO inventory_purchase_receipt_items
        (receipt_id, tenant_id, inventory_item_id, batch_id, location_id, quantity_received, unit_id, unit_cost, expiry_date, batch_no)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        `,
        [
          receiptId,
          tenantId,
          item.inventoryItemId,
          batchId,
          item.locationId || null,
          item.quantityReceived,
          item.unitId || null,
          item.unitCost || null,
          item.expiryDate || null,
          item.batchNo || null,
        ]
      );

      await applyInventoryDelta(conn, {
        tenantId,
        inventoryItemId: item.inventoryItemId,
        batchId,
        locationId: item.locationId || null,
        quantityDelta: item.quantityReceived,
        movementType: "purchase_receive",
        unitId: item.unitId || null,
        unitCost: item.unitCost || null,
        referenceType: "inventory_purchase_receipts",
        referenceId: receiptId,
        reason: "Purchase received",
        createdBy,
      });
    }

    await conn.commit();
    return receiptId;
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};
