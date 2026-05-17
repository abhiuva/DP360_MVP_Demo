const db = require("../config/mysql.db");

// Utility to build date filter SQL clauses
function buildDateFilter({ startDate, endDate, month, year }, dateColumn = "i.created_at") {
  const conditions = [];
  const values = [];

  if (startDate && endDate) {
    conditions.push(`${dateColumn} BETWEEN ? AND ?`);
    values.push(startDate, endDate);
  } else if (month && year) {
    conditions.push(`MONTH(${dateColumn}) = ? AND YEAR(${dateColumn}) = ?`);
    values.push(parseInt(month), parseInt(year));
  } else if (year) {
    conditions.push(`YEAR(${dateColumn}) = ?`);
    values.push(parseInt(year));
  }

  return {
    clause: conditions.length ? `AND ${conditions.join(" AND ")}` : "",
    values,
  };
}

// Total Sales & Orders (with filters)
exports.getSalesSummary = async (req, res) => {
  const { tenant_id, startDate, endDate, month, year } = req.query;
  if (!tenant_id) return res.status(400).json({ error: "tenant_id is required" });

  try {
    const { clause, values } = buildDateFilter({ startDate, endDate, month, year });

    const result = await db.query(
      `
      SELECT COUNT(*) AS totalOrders, COALESCE(SUM(i.total), 0) AS totalSales
      FROM orders o
      JOIN invoices i ON o.invoice_id = i.id AND o.tenant_id = i.tenant_id
      WHERE o.tenant_id = ? AND o.payment_status = 'paid' ${clause}
    `,
      [tenant_id, ...values]
    );

    res.json(result[0] || { totalOrders: 0, totalSales: 0 });
  } catch (err) {
    console.error("Sales Summary Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Daily Sales Chart
exports.getSalesByDay = async (req, res) => {
  const { tenant_id, startDate, endDate, month, year } = req.query;
  if (!tenant_id) return res.status(400).json({ error: "tenant_id is required" });

  try {
    const { clause, values } = buildDateFilter({ startDate, endDate, month, year });

    const result = await db.query(
      `
      SELECT DATE(i.created_at) AS order_date, SUM(i.total) AS dailySales
      FROM orders o
      JOIN invoices i ON o.invoice_id = i.id AND o.tenant_id = i.tenant_id
      WHERE o.tenant_id = ? AND o.payment_status = 'paid' ${clause}
      GROUP BY DATE(i.created_at)
      ORDER BY order_date
    `,
      [tenant_id, ...values]
    );

    res.json(result);
  } catch (err) {
    console.error("Sales By Day Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Top 5 Items
exports.getTopItems = async (req, res) => {
  const { tenant_id, startDate, endDate, month, year } = req.query;
  if (!tenant_id) return res.status(400).json({ error: "tenant_id is required" });

  try {
    const { clause, values } = buildDateFilter({ startDate, endDate, month, year }, "oi.created_at");

    const result = await db.query(
      `
      SELECT item_name AS itemName, SUM(quantity) AS totalQuantity
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.id AND oi.tenant_id = o.tenant_id
      WHERE oi.tenant_id = ? ${clause}
      GROUP BY item_name
      ORDER BY totalQuantity DESC
      LIMIT 5
    `,
      [tenant_id, ...values]
    );

    res.json(result);
  } catch (err) {
    console.error("Top Items Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Stock by Category (no filter)
exports.getStockByCategory = async (req, res) => {
  const tenantId = req.query.tenant_id;
  if (!tenantId) return res.status(400).json({ error: "tenant_id is required" });

  try {
    const result = await db.query(
      `
      SELECT c.title AS category, SUM(ii.quantity) AS totalStock
      FROM menu_items mi
      JOIN inventory_items ii ON mi.inventory_id = ii.id
      JOIN categories c ON mi.category = c.id AND mi.tenant_id = c.tenant_id
      WHERE mi.tenant_id = ?
      GROUP BY c.title
    `,
      [tenantId]
    );

    res.json(result);
  } catch (err) {
    console.error("Stock By Category Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Sales by Category
exports.getSalesByCategory = async (req, res) => {
  const { tenant_id, startDate, endDate, month, year } = req.query;
  if (!tenant_id) return res.status(400).json({ error: "tenant_id is required" });

  try {
    const { clause, values } = buildDateFilter({ startDate, endDate, month, year }, "oi.created_at");

    const result = await db.query(
      `
      SELECT c.title AS categoryName, SUM(oi.price * oi.quantity) AS totalSales
      FROM order_items oi
      JOIN menu_items m ON oi.item_id = m.id AND oi.tenant_id = m.tenant_id
      JOIN categories c ON m.category = c.id AND m.tenant_id = c.tenant_id
      JOIN orders o ON oi.order_id = o.id AND oi.tenant_id = o.tenant_id
      WHERE oi.tenant_id = ? AND o.payment_status = 'paid' ${clause}
      GROUP BY c.title
      ORDER BY totalSales DESC
    `,
      [tenant_id, ...values]
    );

    res.json(result);
  } catch (err) {
    console.error("Sales By Category Error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Sales by Payment Mode
exports.getSalesByPaymentMode = async (req, res) => {
  const { tenant_id, startDate, endDate, month, year } = req.query;
  if (!tenant_id) return res.status(400).json({ error: "tenant_id is required" });

  try {
    const { clause, values } = buildDateFilter({ startDate, endDate, month, year });

    const result = await db.query(
      `
      SELECT pt.title AS paymentMode, SUM(i.total) AS totalSales
      FROM invoices i
      JOIN payment_types pt ON i.payment_type_id = pt.id
      JOIN orders o ON o.invoice_id = i.id AND o.tenant_id = i.tenant_id
      WHERE i.tenant_id = ? AND o.payment_status = 'paid' ${clause}
      GROUP BY pt.title
      ORDER BY totalSales DESC
    `,
      [tenant_id, ...values]
    );

    res.json(result);
  } catch (err) {
    console.error("Sales By Payment Mode Error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Sales Per Hour
exports.getSalesPerHour = async (req, res) => {
  const { tenant_id, startDate, endDate, month, year } = req.query;
  if (!tenant_id) return res.status(400).json({ error: "tenant_id is required" });

  try {
    const { clause, values } = buildDateFilter({ startDate, endDate, month, year });

    const result = await db.query(
      `
      SELECT HOUR(i.created_at) AS hour, SUM(i.total) AS totalSales
      FROM orders o
      JOIN invoices i ON o.invoice_id = i.id AND o.tenant_id = i.tenant_id
      WHERE o.tenant_id = ? AND o.payment_status = 'paid' ${clause}
      GROUP BY hour
      ORDER BY hour
    `,
      [tenant_id, ...values]
    );

    res.json(result);
  } catch (err) {
    console.error("Sales Per Hour Error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Monthly Revenue
exports.getMonthlyRevenueStats = async (req, res) => {
  const { tenant_id, startDate, endDate, month, year } = req.query;
  if (!tenant_id) return res.status(400).json({ error: "tenant_id is required" });

  try {
    const { clause, values } = buildDateFilter({ startDate, endDate, month, year });

    const result = await db.query(
      `
      SELECT 
        DATE_FORMAT(i.created_at, '%Y-%m') AS month,
        COUNT(DISTINCT o.id) AS transactions,
        SUM(i.total) AS totalRevenue,
        AVG(i.total) AS avgOrderValue
      FROM orders o
      JOIN invoices i ON o.invoice_id = i.id AND o.tenant_id = i.tenant_id
      WHERE o.tenant_id = ? AND o.payment_status = 'paid' ${clause}
      GROUP BY month
      ORDER BY month
    `,
      [tenant_id, ...values]
    );

    res.json(result);
  } catch (err) {
    console.error("Monthly Revenue Error:", err);
    res.status(500).json({ error: err.message });
  }
};
