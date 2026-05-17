// backend/src/controllers/ceo.controller.js
const pool = require("../config/mysql.db");

/** Always return an array of rows regardless of pool wrapper */
async function q(sql, params = []) {
  const res = await pool.query(sql, params);
  // mysql2/promise: [rows, fields]
  if (Array.isArray(res) && Array.isArray(res[0])) return res[0];
  // custom wrapper returning rows directly
  if (Array.isArray(res)) return res;
  // pg-like { rows: [...] }
  if (res && Array.isArray(res.rows)) return res.rows;
  return [];
}

// --------------------- helpers ---------------------
function clampDate(s) {
  return /^\d{4}-\d{2}-\d{2}$/.test(String(s || "")) ? s : null;
}

/**
 * LEGACY-style params() – prefers req.user.tenant_id, then numeric ?tenantId.
 * Accepts from/to OR start/end; otherwise defaults to last 30 days.
 */
function params(req) {
  const tenantFromAuth = req.user?.tenant_id ?? req.user?.tenantId;
  const tenantFromQuery = req.query?.tenantId;
  const TENANT_ID = Number(tenantFromAuth ?? tenantFromQuery ?? 1);

  const startQ = clampDate(req.query?.from) || clampDate(req.query?.start);
  const endQ   = clampDate(req.query?.to)   || clampDate(req.query?.end);

  const today = new Date();
  const endDefault = today.toISOString().slice(0, 10);
  const startDefault = new Date(today.getTime() - 29 * 86400000).toISOString().slice(0, 10);

  const start = startQ || startDefault;
  const end   = endQ   || endDefault;

  const TZ = (req.query?.tz && String(req.query.tz)) || "UTC"; // e.g., "Asia/Kolkata"
  return { TENANT_ID, start, end, TZ };
}

function ok(res, data) { res.status(200).json({ success: true, data }); }
function bad(res, msg) { res.status(400).json({ success: false, message: msg }); }

function groupExpr(alias, period) {
  if (period === "daily") return `DATE(${alias})`;
  if (period === "weekly") return `DATE_FORMAT(${alias}, '%x-%v')`;
  if (period === "monthly") return `DATE_FORMAT(${alias}, '%Y-%m')`;
  if (period === "quarterly") return `CONCAT(YEAR(${alias}), '-Q', QUARTER(${alias}))`;
  return `DATE_FORMAT(${alias}, '%Y')`; // yearly
}

// --------------------- controllers ---------------------

// 1) KPI tiles
exports.getKpis = async (req, res) => {
  try {
    const { TENANT_ID, start, end } = params(req);
    const sql = `
      WITH
      range_dates AS (SELECT ? AS start_date, ? AS end_date),
      invoice_agg AS (
        SELECT COALESCE(SUM(total),0) AS revenue,
               COALESCE(SUM(tax_total),0) AS tax,
               COALESCE(SUM(charges),0) AS charges
        FROM invoices i
        JOIN range_dates r ON DATE(i.created_at) BETWEEN r.start_date AND r.end_date
        WHERE i.tenant_id = ?
      ),
      order_agg AS (
        SELECT COALESCE(COUNT(*),0) AS orders_completed
        FROM orders o
        JOIN range_dates r ON DATE(o.\`date\`) BETWEEN r.start_date AND r.end_date
        WHERE o.tenant_id = ? AND o.status = 'completed'
      ),
      items_agg AS (
        SELECT COALESCE(SUM(oi.quantity),0) AS items_sold
        FROM order_items oi
        JOIN orders o ON o.id = oi.order_id AND o.tenant_id = oi.tenant_id
        JOIN range_dates r ON DATE(o.\`date\`) BETWEEN r.start_date AND r.end_date
        WHERE oi.tenant_id = ? AND o.status = 'completed'
      ),
      customer_agg AS (
        SELECT COALESCE(COUNT(DISTINCT o.customer_id),0) AS unique_customers
        FROM orders o
        JOIN range_dates r ON DATE(o.\`date\`) BETWEEN r.start_date AND r.end_date
        WHERE o.tenant_id = ? AND o.status = 'completed' AND o.customer_id IS NOT NULL
      )
      SELECT ia.revenue,
             oa.orders_completed,
             CASE WHEN oa.orders_completed=0 THEN 0 ELSE ROUND(ia.revenue/oa.orders_completed,2) END AS aov,
             it.items_sold,
             ca.unique_customers,
             ia.tax,
             ia.charges
      FROM invoice_agg ia, order_agg oa, items_agg it, customer_agg ca;
    `;
    const rows = await q(sql, [start, end, TENANT_ID, TENANT_ID, TENANT_ID, TENANT_ID]);
    ok(res, rows[0] || { revenue: 0, orders_completed: 0, aov: 0, items_sold: 0, unique_customers: 0, tax: 0, charges: 0 });
  } catch (err) {
    console.error("getKpis error:", err);
    bad(res, "Failed to fetch KPIs");
  }
};

// 2) Revenue by day (zero-filled)
exports.getRevenueDaily = async (req, res) => {
  try {
    const { TENANT_ID, start, end } = params(req);
    const sql = `
      WITH RECURSIVE days AS (
        SELECT DATE(?) AS d
        UNION ALL
        SELECT DATE_ADD(d, INTERVAL 1 DAY) FROM days WHERE d < DATE(?)
      )
      SELECT d AS \`date\`, COALESCE(SUM(i.total),0) AS revenue
      FROM days
      LEFT JOIN invoices i ON DATE(i.created_at) = d AND i.tenant_id = ?
      GROUP BY d ORDER BY d;
    `;
    const rows = await q(sql, [start, end, TENANT_ID]);
    ok(res, rows);
  } catch (err) {
    console.error("getRevenueDaily error:", err);
    bad(res, "Failed to fetch daily revenue");
  }
};

// 3) Sales by category
exports.getSalesByCategory = async (req, res) => {
  try {
    const { TENANT_ID, start, end } = params(req);
    const sql = `
      SELECT COALESCE(c.title,'Uncategorized') AS category,
             ROUND(SUM(oi.price * oi.quantity),2) AS sales,
             SUM(oi.quantity) AS qty
      FROM order_items oi
      JOIN orders o ON o.id = oi.order_id AND o.tenant_id = oi.tenant_id
      LEFT JOIN menu_items mi ON mi.id = oi.item_id
      LEFT JOIN categories c ON c.id = mi.category
      WHERE oi.tenant_id = ? AND o.status = 'completed'
        AND DATE(o.\`date\`) BETWEEN ? AND ?
      GROUP BY c.title
      ORDER BY sales DESC;
    `;
    const rows = await q(sql, [TENANT_ID, start, end]);
    ok(res, rows);
  } catch (err) {
    console.error("getSalesByCategory error:", err);
    bad(res, "Failed to fetch sales by category");
  }
};

// 4) Top items
exports.getTopItems = async (req, res) => {
  try {
    const { TENANT_ID, start, end } = params(req);
    const sql = `
      SELECT COALESCE(mi.title, oi.item_name, CONCAT('Item#', oi.item_id)) AS item,
             SUM(oi.quantity) AS qty,
             ROUND(SUM(oi.price * oi.quantity),2) AS revenue
      FROM order_items oi
      JOIN orders o ON o.id = oi.order_id AND o.tenant_id = oi.tenant_id
      LEFT JOIN menu_items mi ON mi.id = oi.item_id
      WHERE oi.tenant_id = ? AND o.status='completed'
        AND DATE(o.\`date\`) BETWEEN ? AND ?
      GROUP BY item
      ORDER BY revenue DESC
      LIMIT 10;
    `;
    const rows = await q(sql, [TENANT_ID, start, end]);
    ok(res, rows);
  } catch (err) {
    console.error("getTopItems error:", err);
    bad(res, "Failed to fetch top items");
  }
};

// 5) Payment mix
exports.getPaymentMix = async (req, res) => {
  try {
    const { TENANT_ID, start, end } = params(req);
    const sql = `
      SELECT COALESCE(CAST(payment_type_id AS CHAR),'Unknown') AS method,
             COUNT(*) AS cnt,
             ROUND(SUM(total),2) AS revenue
      FROM invoices
      WHERE tenant_id = ? AND DATE(created_at) BETWEEN ? AND ?
      GROUP BY payment_type_id
      ORDER BY revenue DESC;
    `;
    const rows = await q(sql, [TENANT_ID, start, end]);
    ok(res, rows);
  } catch (err) {
    console.error("getPaymentMix error:", err);
    bad(res, "Failed to fetch payment mix");
  }
};

// 6) Order funnel
exports.getOrderFunnel = async (req, res) => {
  try {
    const { TENANT_ID, start, end } = params(req);
    const sql = `
      SELECT status, COUNT(*) AS cnt
      FROM orders
      WHERE tenant_id = ? AND DATE(\`date\`) BETWEEN ? AND ?
      GROUP BY status;
    `;
    const rows = await q(sql, [TENANT_ID, start, end]);
    ok(res, rows);
  } catch (err) {
    console.error("getOrderFunnel error:", err);
    bad(res, "Failed to fetch order funnel");
  }
};

// 7) Hourly revenue (today, localized)
exports.getHourlyToday = async (req, res) => {
  try {
    const { TENANT_ID, TZ } = params(req);
    const sql = `
      WITH RECURSIVE hrs AS (SELECT 0 h UNION ALL SELECT h+1 FROM hrs WHERE h < 23)
      SELECT h AS hour, COALESCE(SUM(i.total),0) AS revenue
      FROM hrs
      LEFT JOIN invoices i
        ON HOUR(CONVERT_TZ(i.created_at,'UTC',?)) = h
       AND DATE(CONVERT_TZ(i.created_at,'UTC',?)) = DATE(CONVERT_TZ(UTC_TIMESTAMP(),'UTC',?))
       AND i.tenant_id = ?
      GROUP BY h ORDER BY h;
    `;
    const rows = await q(sql, [TZ, TZ, TZ, TENANT_ID]);
    ok(res, rows);
  } catch (err) {
    console.error("getHourlyToday error:", err);
    bad(res, "Failed to fetch hourly revenue");
  }
};

// 8) Customer metrics
exports.getCustomerMetrics = async (req, res) => {
  try {
    const { TENANT_ID, start, end } = params(req);
    const sql = `
      WITH range AS (SELECT ? AS start_date, ? AS end_date),
      cust_orders AS (
        SELECT o.customer_id, MIN(DATE(o.\`date\`)) AS first_order_date
        FROM orders o
        WHERE o.tenant_id = ? AND o.customer_id IS NOT NULL
        GROUP BY o.customer_id
      ),
      orders_in_range AS (
        SELECT o.customer_id
        FROM orders o, range r
        WHERE o.tenant_id = ?
          AND o.status = 'completed'
          AND o.customer_id IS NOT NULL
          AND DATE(o.\`date\`) BETWEEN r.start_date AND r.end_date
      )
      SELECT
        SUM(CASE WHEN co.first_order_date BETWEEN r.start_date AND r.end_date THEN 1 ELSE 0 END) AS new_customers,
        SUM(CASE WHEN co.first_order_date < r.start_date THEN 1 ELSE 0 END) AS returning_customers
      FROM range r
      JOIN cust_orders co ON TRUE
      JOIN orders_in_range oir ON oir.customer_id = co.customer_id;
    `;
    const rows = await q(sql, [start, end, TENANT_ID, TENANT_ID]);
    ok(res, rows[0] || { new_customers: 0, returning_customers: 0 });
  } catch (err) {
    console.error("getCustomerMetrics error:", err);
    bad(res, "Failed to fetch customer metrics");
  }
};

// 9) Feedback snapshot (avg rating + sentiment counts)
exports.getFeedback = async (req, res) => {
  try {
    const { TENANT_ID, start, end } = params(req);
    const sql = `
      SELECT ROUND(COALESCE(AVG(rating),0),2) AS avg_rating,
             SUM(review_result='POSITIVE') AS positive,
             SUM(review_result='NEUTRAL')  AS neutral,
             SUM(review_result='NEGATIVE') AS negative,
             COUNT(*) AS total
      FROM customer_feedbacks
      WHERE tenant_id = ? AND DATE(created_at) BETWEEN ? AND ?;
    `;
    const rows = await q(sql, [TENANT_ID, start, end]);
    ok(res, rows[0] || { avg_rating: 0, positive: 0, neutral: 0, negative: 0, total: 0 });
  } catch (err) {
    console.error("getFeedback error:", err);
    bad(res, "Failed to fetch feedback snapshot");
  }
};

// 10) Inventory low-stock & negatives
exports.getLowStock = async (req, res) => {
  try {
    const { TENANT_ID } = params(req);
    const sql = `
      SELECT ii.id, ii.title, ii.quantity, ii.stock_alert_quantity,
             GREATEST(0, COALESCE(ii.stock_alert_quantity, 0) - ii.quantity) AS shortage
      FROM inventory_items ii
      WHERE ii.tenant_id = ?
        AND ((ii.stock_alert_quantity IS NOT NULL AND ii.quantity <= ii.stock_alert_quantity) OR ii.quantity < 0)
      ORDER BY (ii.quantity <= COALESCE(ii.stock_alert_quantity, -1)) DESC, ii.quantity ASC;
    `;
    const rows = await q(sql, [TENANT_ID]);
    ok(res, rows);
  } catch (err) {
    console.error("getLowStock error:", err);
    bad(res, "Failed to fetch low stock");
  }
};

// 11) Employee attendance (today)
exports.getAttendance = async (_req, res) => {
  try {
    const sql = `
      SELECT COUNT(*) AS present_today, ROUND(COALESCE(AVG(workHours),0),2) AS avg_hours
      FROM employee_attendance
      WHERE DATE(attendanceDate) = CURDATE() AND status = 'Present';
    `;
    const rows = await q(sql);
    ok(res, rows[0] || { present_today: 0, avg_hours: 0 });
  } catch (err) {
    console.error("getAttendance error:", err);
    bad(res, "Failed to fetch attendance summary");
  }
};

// ----------- CEO 4.4 additions -----------

// Employee performance (radar/table)  ✅ (missing in your last paste)
exports.employeePerformanceDetailed = async (_req, res) => {
  try {
    const rows = await q(
      `SELECT employee_name,
              AVG(service) AS service,
              AVG(punchuality) AS punctuality,
              AVG(customer_feedback_on_staff) AS customerCare,
              AVG(manager_behaviour_feedback_on_employee) AS managerFeedback,
              AVG(rating) AS rating,
              COUNT(*) AS reviews
       FROM employee_feedback
       GROUP BY employee_name
       ORDER BY rating DESC, reviews DESC
       LIMIT 50`
    );
    ok(res, rows);
  } catch (err) {
    console.error("employeePerformanceDetailed:", err);
    bad(res, "Failed to load employee performance");
  }
};

// Customer feedback (detailed list)  ✅ (missing in your last paste)
exports.customerFeedbackList = async (req, res) => {
  try {
    const { TENANT_ID, start, end } = params(req);
    const rows = await q(
      `SELECT customer_name, rating, review, review_result, created_at
       FROM customer_feedbacks
       WHERE tenant_id = ? AND created_at BETWEEN CONCAT(?, ' 00:00:00') AND CONCAT(?, ' 23:59:59')
       ORDER BY created_at DESC
       LIMIT 500`,
      [TENANT_ID, start, end]
    );
    ok(res, rows);
  } catch (err) {
    console.error("customerFeedbackList:", err);
    bad(res, "Failed to load customer feedback");
  }
};

// Revenue vs Expenses (COGS from order_items × menu_items.net_price)
exports.revenueExpenses = async (req, res) => {
  try {
    const { TENANT_ID, start, end } = params(req); // legacy
    const period = String(req.query?.period || "monthly");
    const gR = groupExpr("i.created_at", period);
    const gE = groupExpr("oi.date", period);

    const rev = await q(
      `SELECT ${gR} AS bucket, SUM(i.total) AS revenue
       FROM invoices i
       WHERE i.tenant_id = ? AND i.created_at BETWEEN CONCAT(?, ' 00:00:00') AND CONCAT(?, ' 23:59:59')
       GROUP BY bucket ORDER BY bucket`,
      [TENANT_ID, start, end]
    );

    const exp = await q(
      `SELECT ${gE} AS bucket,
              SUM(COALESCE(m.net_price,0) * COALESCE(oi.quantity,0)) AS expense
       FROM order_items oi
       LEFT JOIN menu_items m ON m.id = oi.item_id
       WHERE oi.tenant_id = ? AND oi.date BETWEEN CONCAT(?, ' 00:00:00') AND CONCAT(?, ' 23:59:59')
       GROUP BY bucket ORDER BY bucket`,
      [TENANT_ID, start, end]
    );

    const map = new Map();
    rev.forEach(r => map.set(String(r.bucket), { bucket: String(r.bucket), revenue: Number(r.revenue||0), expense: 0 }));
    exp.forEach(e => {
      const b = String(e.bucket);
      map.set(b, { ...(map.get(b) || { bucket: b, revenue: 0, expense: 0 }), expense: Number(e.expense||0) });
    });

    ok(res, Array.from(map.values()).sort((a,b)=>a.bucket.localeCompare(b.bucket)));
  } catch (err) {
    console.error("revenueExpenses:", err);
    bad(res, "Failed to load revenue/expenses");
  }
};

// Profit margins by category
exports.profitMarginsByCategory = async (req, res) => {
  try {
    const { TENANT_ID, start, end } = params(req); // legacy
    const rows = await q(
      `SELECT COALESCE(c.title,'Uncategorized') AS category,
              SUM(COALESCE(oi.price,0) * COALESCE(oi.quantity,0)) AS revenue,
              SUM(COALESCE(m.net_price,0) * COALESCE(oi.quantity,0)) AS cost
       FROM order_items oi
       LEFT JOIN menu_items m ON m.id = oi.item_id
       LEFT JOIN categories c ON c.id = m.category
       WHERE oi.tenant_id = ? AND oi.date BETWEEN CONCAT(?, ' 00:00:00') AND CONCAT(?, ' 23:59:59')
       GROUP BY category
       ORDER BY revenue DESC`,
      [TENANT_ID, start, end]
    );

    const out = rows.map(r => {
      const rev = Number(r.revenue||0), cost = Number(r.cost||0);
      const marginPercent = rev > 0 ? ((rev - cost) / rev) * 100 : 0;
      return { category: r.category, revenue: rev, cost, marginPercent: Number(marginPercent.toFixed(2)) };
    });

    ok(res, out);
  } catch (err) {
    console.error("profitMarginsByCategory:", err);
    bad(res, "Failed to compute margins");
  }
};

// Financial summaries (monthly/quarterly/yearly)
exports.financialSummaries = async (req, res) => {
  try {
    const { TENANT_ID, start, end } = params(req); // legacy

    async function collect(period) {
      const gR = groupExpr("i.created_at", period);
      const gE = groupExpr("oi.date", period);

      const rev = await q(
        `SELECT ${gR} AS period, SUM(i.total) AS revenue
         FROM invoices i
         WHERE i.tenant_id = ? AND i.created_at BETWEEN CONCAT(?, ' 00:00:00') AND CONCAT(?, ' 23:59:59')
         GROUP BY period ORDER BY period`,
        [TENANT_ID, start, end]
      );

      const exp = await q(
        `SELECT ${gE} AS period,
                SUM(COALESCE(m.net_price,0) * COALESCE(oi.quantity,0)) AS expense
         FROM order_items oi
         LEFT JOIN menu_items m ON m.id = oi.item_id
         WHERE oi.tenant_id = ? AND oi.date BETWEEN CONCAT(?, ' 00:00:00') AND CONCAT(?, ' 23:59:59')
         GROUP BY period ORDER BY period`,
        [TENANT_ID, start, end]
      );

      const map = new Map();
      rev.forEach(r => map.set(String(r.period), { period: String(r.period), revenue: Number(r.revenue||0), expense: 0 }));
      exp.forEach(e => {
        const p = String(e.period);
        map.set(p, { ...(map.get(p) || { period: p, revenue: 0, expense: 0 }), expense: Number(e.expense||0) });
      });

      return Array.from(map.values()).map(x => ({
        ...x,
        profit: x.revenue - x.expense,
        margin: x.revenue > 0 ? ((x.revenue - x.expense) / x.revenue) * 100 : 0,
      }));
    }

    const [monthly, quarterly, yearly] = await Promise.all([
      collect("monthly"),
      collect("quarterly"),
      collect("yearly"),
    ]);

    ok(res, { monthly, quarterly, yearly });
  } catch (err) {
    console.error("financialSummaries:", err);
    bad(res, "Failed to load financial summaries");
  }
};

// Operational efficiency (completed / total orders)
exports.operationalEfficiency = async (req, res) => {
  try {
    const { TENANT_ID, start, end } = params(req); // legacy
    const rows = await q(
      `SELECT
         SUM(CASE WHEN status='completed' THEN 1 ELSE 0 END) AS completed,
         COUNT(*) AS total
       FROM orders
       WHERE tenant_id = ? AND date BETWEEN CONCAT(?, ' 00:00:00') AND CONCAT(?, ' 23:59:59')`,
      [TENANT_ID, start, end]
    );
    const agg = rows[0] || {};
    const completed = Number(agg.completed || 0);
    const total = Number(agg.total || 0);
    const efficiencyPercent = total ? (completed / total) * 100 : 0;
    ok(res, { completed, total, efficiencyPercent });
  } catch (err) {
    console.error("operationalEfficiency:", err);
    bad(res, "Failed to compute operational efficiency");
  }
};
