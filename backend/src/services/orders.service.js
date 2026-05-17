const { getMySqlPromiseConnection } = require("../config/mysql.db");
const { mailTransport } = require("../config/mailTransport");
const {
  deductInventoryForCompletedOrders,
  getStockAlertItemsDB,
} = require("./inventory_management.service");

exports.getOrdersDB = async (tenantId) => {
  const conn = await getMySqlPromiseConnection();
  try {
    const sql = `
    SELECT
      o.id,
      o.date,
      o.delivery_type,
      o.customer_type,
      o.customer_id,
      c. \`name\` AS customer_name,
      o.table_id,
      st.table_title,
      st. \`floor\`,
      o.status,
      o.payment_status,
      o.token_no
    FROM
      orders o
      LEFT JOIN customers c ON o.customer_id = c.id AND c.tenant_id = o.tenant_id
      LEFT JOIN store_tables st ON o.table_id = st.id
    WHERE
      date >= DATE_SUB(NOW(), INTERVAL 1 DAY)
      AND date <= DATE_ADD(NOW(), INTERVAL 1 DAY)
      AND o.status NOT IN ('completed', 'cancelled')
      AND o.tenant_id = ?
    `;

    const [kitchenOrders] = await conn.query(sql, [tenantId]);

    let kitchenOrdersItems = [];
    let addons = [];

    if (kitchenOrders.length > 0) {
      const orderIds = kitchenOrders.map((o) => o.id).join(",");
      const sql2 = `
      SELECT
        oi.id,
        oi.order_id,
        oi.item_id,
        mi.title AS item_title,
        oi.variant_id,
        miv.title as variant_title,
        oi.price,
        oi.quantity,
        oi.status,
        oi.date,
        oi.addons,
        oi.notes
      FROM
        order_items oi
        LEFT JOIN menu_items mi ON oi.item_id = mi.id
        LEFT join menu_item_variants miv ON oi.item_id = miv.item_id AND oi.variant_id = miv.id
        
      WHERE oi.order_id IN (${orderIds})
      `;
      const [kitchenOrdersItemsResult] = await conn.query(sql2);
      kitchenOrdersItems = kitchenOrdersItemsResult;

      const addonIds = [
        ...new Set([
          ...kitchenOrdersItems.flatMap((o) =>
            o.addons ? JSON.parse(o?.addons) : []
          ),
        ]),
      ].join(",");
      const [addonsResult] = addonIds
        ? await conn.query(
            `SELECT id, item_id, title FROM menu_item_addons WHERE id IN (${addonIds});`
          )
        : [];
      addons = addonsResult;
    }
    return {
      kitchenOrders,
      kitchenOrdersItems,
      addons,
    };
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    conn.release();
  }
};

exports.updateOrderItemStatusDB = async (orderItemId, status, tenantId) => {
  const conn = await getMySqlPromiseConnection();
  try {
    const sql = `
    UPDATE order_items SET
    status = ?
    WHERE id = ? AND tenant_id = ?;
    `;

    await conn.query(sql, [status, orderItemId, tenantId]);

    return;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    conn.release();
  }
};

exports.updateOrderStatusDB = async (orderId, status, invoiceId, tenantId) => {
  const conn = await getMySqlPromiseConnection();
  try {
    const sql = `
    UPDATE orders SET
    payment_status = ? , invoice_id = ?
    WHERE id = ? AND tenant_id = ?;
    `;

    await conn.query(sql, [status, invoiceId, orderId, tenantId]);
    return;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    conn.release();
  }
};

exports.cancelOrderDB = async (orderIds, tenantId) => {
  const conn = await getMySqlPromiseConnection();
  try {
    const orderIdsText = orderIds.join(",");

    const sql = `
    UPDATE orders SET
    status = 'cancelled'
    WHERE id IN (${orderIdsText}) AND tenant_id = ?;
    `;

    await conn.query(sql, [tenantId]);
    return;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    conn.release();
  }
};

exports.completeOrderDB = async (orderIds, tenantId) => {
  const conn = await getMySqlPromiseConnection();
  try {
    const orderIdsText = orderIds.join(",");
    await conn.beginTransaction();
    const inv_ids = await deductInventoryForCompletedOrders(conn, orderIds, tenantId);

    const sql = `
    UPDATE orders SET
    status = 'completed'
    WHERE id IN (${orderIdsText}) AND tenant_id = ?;
    `;

    await conn.query(sql, [tenantId]);
    await conn.commit();

    if (inv_ids.length > 0) {
      const stockalert = await getStockAlertItemsDB(conn, inv_ids, tenantId);
      if (stockalert.length > 0) {
        let subject = "Stock alert items list";
        let body = `
          <html>
            <div>
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Quantity</th>
                    <th>StockAlert</th>
                  </tr>
                </thead>
                <tbody>
                  ${stockalert
                    .map((record) => {
                      return `
                      <tr key="${record.id}">
                        <td>${record.title}</td>
                        <td>${record.quantity}</td>
                        <td>${record.stock_alert_quantity}</td>
                      </tr>
                    `;
                    })
                    .join("")}
                </tbody>
              </table>
            </div>
          </html>
        `;

        const options = {
          subject: subject,
          html: body,
        };

        // Call your mail function to send the email
        try {
          await mailTransport(options);
        } catch (mailError) {
          console.error("Failed to send stock alert email:", mailError);
        }
      }
    }

    return;
  } catch (error) {
    console.error(error);
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};

exports.getOrdersPaymentSummaryDB = async (orderIdsToFindSummary, tenantId) => {
  const conn = await getMySqlPromiseConnection();
  try {
    const sql = `
    SELECT
      o.id,
      o.date,
      o.delivery_type,
      o.customer_type,
      o.customer_id,
      c. \`name\` AS customer_name,
      o.table_id,
      st.table_title,
      st. \`floor\`,
      o.status,
      o.payment_status,
      o.token_no
    FROM
      orders o
      LEFT JOIN customers c ON o.customer_id = c.id AND c.tenant_id = o.tenant_id
      LEFT JOIN store_tables st ON o.table_id = st.id
    WHERE
      date >= DATE_SUB(NOW(), INTERVAL 1 DAY)
      AND date <= DATE_ADD(NOW(), INTERVAL 1 DAY)
      AND o.status NOT IN ('completed', 'cancelled')
      AND o.id IN (${orderIdsToFindSummary}) AND o.tenant_id = ?
    `;

    const [kitchenOrders] = await conn.query(sql, [tenantId]);

    let kitchenOrdersItems = [];
    let addons = [];

    if (kitchenOrders.length > 0) {
      const orderIds = kitchenOrders.map((o) => o.id).join(",");
      const sql2 = `
      SELECT
        oi.id,
        oi.order_id,
        oi.item_id,
        mi.title AS item_title,
        oi.variant_id,
        miv.title as variant_title,
        miv.price as variant_price,
        mi.price,
        mi.tax_id,
        mi.discount as discount,
        t.title as tax_title,
        t.rate as tax_rate,
        t.type as tax_type,
        oi.quantity,
        oi.status,
        oi.date,
        oi.addons,
        oi.notes
      FROM
        order_items oi
        LEFT JOIN menu_items mi ON oi.item_id = mi.id
        LEFT JOIN menu_item_variants miv ON oi.item_id = miv.item_id AND oi.variant_id = miv.id
        LEFT JOIN taxes t ON mi.tax_id = t.id
        
      WHERE oi.order_id IN (${orderIds}) AND oi.status NOT IN ('cancelled')
      `;
      const [kitchenOrdersItemsResult] = await conn.query(sql2);
      kitchenOrdersItems = kitchenOrdersItemsResult;

      const addonIds = [
        ...new Set([
          ...kitchenOrdersItems.flatMap((o) =>
            o.addons ? JSON.parse(o?.addons) : []
          ),
        ]),
      ].join(",");
      const [addonsResult] = addonIds
        ? await conn.query(
            `SELECT id, item_id, title, price FROM menu_item_addons WHERE id IN (${addonIds});`
          )
        : [];
      addons = addonsResult;
    }

    return {
      kitchenOrders,
      kitchenOrdersItems,
      addons,
    };
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    conn.release();
  }
};

exports.createInvoiceDB = async (
  subtotal,
  taxTotal,
  total,
  discount,
  date,
  selectedPaymentType,
  tenantId
) => {
  const conn = await getMySqlPromiseConnection();
  try {
    await conn.beginTransaction();

    let invoiceId = 0;

    const [invoiceSequence] = await conn.query(
      "SELECT sequence_no FROM invoice_sequences WHERE tenant_id = ? LIMIT 1 FOR UPDATE",
      [tenantId]
    );
    invoiceId = invoiceSequence[0]?.sequence_no || 0;

    invoiceId += 1;

    const sql = `
    INSERT INTO invoices 
    (id, sub_total, tax_total, total, created_at, payment_type_id, tenant_id) 
    VALUES
    (?, ?, ?, ?, ?, ?, ?)
    `;

    await conn.query(sql, [
      invoiceId,
      subtotal,
      taxTotal,
      total,
      date,
      selectedPaymentType,
      tenantId,
    ]);

    await conn.query(
      "INSERT INTO invoice_sequences ( sequence_no, tenant_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE sequence_no = VALUES(sequence_no);",
      [invoiceId, tenantId]
    );

    await conn.commit();

    return invoiceId;
  } catch (error) {
    console.error(error);
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};

exports.completeOrdersAndSaveInvoiceIdDB = async (
  orderIds,
  invoiceId,
  tenantId
) => {
  const conn = await getMySqlPromiseConnection();
  try {
    const orderIdsText = orderIds.join(",");
    await conn.beginTransaction();
    const inv_ids = await deductInventoryForCompletedOrders(conn, orderIds, tenantId);

    const sql = `
    UPDATE orders SET
    status = 'completed', payment_status = 'paid', invoice_id = ?
    WHERE id IN (${orderIdsText}) AND tenant_id = ?;
    `;

    await conn.query(sql, [invoiceId, tenantId]);
    await conn.commit();

    if (inv_ids.length > 0) {
      const stockalert = await getStockAlertItemsDB(conn, inv_ids, tenantId);
      if (stockalert.length > 0) {
        let subject = "Stock alert items list";
        let body = `
          <html>
            <div>
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Quantity</th>
                    <th>StockAlert</th>
                  </tr>
                </thead>
                <tbody>
                  ${stockalert
                    .map((record) => {
                      return `
                      <tr key="${record.id}">
                        <td>${record.title}</td>
                        <td>${record.quantity}</td>
                        <td>${record.stock_alert_quantity}</td>
                      </tr>
                    `;
                    })
                    .join("")}
                </tbody>
              </table>
            </div>
          </html>
        `;

        const options = {
          subject: subject,
          html: body,
        };

        // Call your mail function to send the email
        try {
          await mailTransport(options);
        } catch (mailError) {
          console.error("Failed to send stock alert email:", mailError);
        }
      }
    }
    return;
  } catch (error) {
    console.error(error);
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};
