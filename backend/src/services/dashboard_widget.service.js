const { getMySqlPromiseConnection } = require("../config/mysql.db");
const { ROLES } = require("../config/user.config");

const DEFAULT_LAYOUTS = {
  revenue_today: { x: 0, y: 0, w: 3, h: 2, minW: 2, minH: 2 },
  orders_today: { x: 3, y: 0, w: 3, h: 2, minW: 2, minH: 2 },
  open_orders: { x: 6, y: 0, w: 3, h: 2, minW: 2, minH: 2 },
  low_stock: { x: 9, y: 0, w: 3, h: 2, minW: 2, minH: 2 },
  sales_trend_7d: { x: 0, y: 2, w: 6, h: 4, minW: 4, minH: 3 },
  top_items_today: { x: 6, y: 2, w: 6, h: 4, minW: 4, minH: 3 },
  sales_by_payment_status: { x: 0, y: 6, w: 4, h: 4, minW: 3, minH: 3 },
  inventory_value: { x: 4, y: 6, w: 4, h: 2, minW: 3, minH: 2 },
  hal_ai_insights: { x: 8, y: 6, w: 4, h: 3, minW: 3, minH: 2 },
};

const DEFAULT_WIDGETS = [
  ["revenue_today", "Today's Revenue", "Sales", "number", "revenue_today", "REPORTS", 1],
  ["orders_today", "Today's Orders", "Sales", "number", "orders_today", "DASHBOARD", 1],
  ["open_orders", "Open Orders", "Operations", "number", "open_orders", "ORDERS", 1],
  ["low_stock", "Low Stock Items", "Inventory", "number", "low_stock", "INVENTORY", 1],
  ["sales_trend_7d", "Sales Trend", "Sales", "line_chart", "sales_trend_7d", "REPORTS", 1],
  ["top_items_today", "Top Items Today", "Sales", "bar_chart", "top_items_today", "REPORTS", 1],
  ["sales_by_payment_status", "Payment Status Mix", "Finance", "pie_chart", "sales_by_payment_status", "REPORTS", 1],
  ["inventory_value", "Estimated Inventory Value", "Inventory", "number", "inventory_value", "INVENTORY", 1],
  ["hal_ai_insights", "HAL AI Insights", "AI", "hal_ai", "hal_ai_insights", "DASHBOARD", 0],
];

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

async function dashboardTablesExist(conn) {
  const [widgets, preferences] = await Promise.all([
    tableExists(conn, "dashboard_widgets"),
    tableExists(conn, "user_dashboard_preferences"),
  ]);
  return widgets && preferences;
}

async function ensureDashboardSchema(conn) {
  await conn.query(`
    CREATE TABLE IF NOT EXISTS dashboard_widgets (
      id int NOT NULL AUTO_INCREMENT,
      widget_key varchar(100) NOT NULL,
      title varchar(150) NOT NULL,
      category varchar(80) NOT NULL,
      visualization enum('number','line_chart','bar_chart','pie_chart','table','hal_ai') NOT NULL,
      data_key varchar(100) NOT NULL,
      required_scope varchar(80) DEFAULT NULL,
      default_enabled tinyint(1) NOT NULL DEFAULT 1,
      default_layout json NOT NULL,
      config json DEFAULT NULL,
      sort_order int NOT NULL DEFAULT 0,
      is_active tinyint(1) NOT NULL DEFAULT 1,
      created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY uq_dashboard_widgets_key (widget_key),
      KEY idx_dashboard_widgets_category (category),
      KEY idx_dashboard_widgets_scope (required_scope),
      KEY idx_dashboard_widgets_active (is_active, sort_order)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await conn.query(`
    CREATE TABLE IF NOT EXISTS user_dashboard_preferences (
      id int NOT NULL AUTO_INCREMENT,
      tenant_id int NOT NULL,
      username varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
      selected_widget_keys json NOT NULL,
      layout json NOT NULL,
      created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY uq_user_dashboard_preferences_user (tenant_id, username),
      KEY idx_user_dashboard_preferences_tenant (tenant_id),
      CONSTRAINT fk_user_dashboard_preferences_tenant
        FOREIGN KEY (tenant_id) REFERENCES tenants (id)
        ON DELETE CASCADE ON UPDATE CASCADE,
      CONSTRAINT fk_user_dashboard_preferences_user
        FOREIGN KEY (username) REFERENCES users (username)
        ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await conn.query(`
    INSERT INTO dashboard_widgets
    (widget_key, title, category, visualization, data_key, required_scope, default_enabled, default_layout, config, sort_order, is_active)
    VALUES
    ('revenue_today', 'Today''s Revenue', 'Sales', 'number', 'revenue_today', 'REPORTS', 1, JSON_OBJECT('x',0,'y',0,'w',3,'h',2,'minW',2,'minH',2), JSON_OBJECT('format','currency'), 10, 1),
    ('orders_today', 'Today''s Orders', 'Sales', 'number', 'orders_today', 'DASHBOARD', 1, JSON_OBJECT('x',3,'y',0,'w',3,'h',2,'minW',2,'minH',2), JSON_OBJECT('format','number'), 20, 1),
    ('open_orders', 'Open Orders', 'Operations', 'number', 'open_orders', 'ORDERS', 1, JSON_OBJECT('x',6,'y',0,'w',3,'h',2,'minW',2,'minH',2), JSON_OBJECT('format','number'), 30, 1),
    ('low_stock', 'Low Stock Items', 'Inventory', 'number', 'low_stock', 'INVENTORY', 1, JSON_OBJECT('x',9,'y',0,'w',3,'h',2,'minW',2,'minH',2), JSON_OBJECT('format','number'), 40, 1),
    ('sales_trend_7d', 'Sales Trend', 'Sales', 'line_chart', 'sales_trend_7d', 'REPORTS', 1, JSON_OBJECT('x',0,'y',2,'w',6,'h',4,'minW',4,'minH',3), JSON_OBJECT('subtitle','Last 7 days'), 50, 1),
    ('top_items_today', 'Top Items Today', 'Sales', 'bar_chart', 'top_items_today', 'REPORTS', 1, JSON_OBJECT('x',6,'y',2,'w',6,'h',4,'minW',4,'minH',3), JSON_OBJECT('subtitle','By quantity sold'), 60, 1),
    ('sales_by_payment_status', 'Payment Status Mix', 'Finance', 'pie_chart', 'sales_by_payment_status', 'REPORTS', 1, JSON_OBJECT('x',0,'y',6,'w',4,'h',4,'minW',3,'minH',3), JSON_OBJECT(), 70, 1),
    ('inventory_value', 'Estimated Inventory Value', 'Inventory', 'number', 'inventory_value', 'INVENTORY', 1, JSON_OBJECT('x',4,'y',6,'w',4,'h',2,'minW',3,'minH',2), JSON_OBJECT('format','currency'), 80, 1),
    ('hal_ai_insights', 'HAL AI Insights', 'AI', 'hal_ai', 'hal_ai_insights', 'DASHBOARD', 0, JSON_OBJECT('x',8,'y',6,'w',4,'h',3,'minW',3,'minH',2), JSON_OBJECT('provider','future_hal'), 90, 1)
    ON DUPLICATE KEY UPDATE
      title = VALUES(title),
      category = VALUES(category),
      visualization = VALUES(visualization),
      data_key = VALUES(data_key),
      required_scope = VALUES(required_scope),
      default_enabled = VALUES(default_enabled),
      default_layout = VALUES(default_layout),
      config = VALUES(config),
      sort_order = VALUES(sort_order),
      is_active = VALUES(is_active),
      updated_at = CURRENT_TIMESTAMP;
  `);
}

function parseJson(value, fallback) {
  if (!value) return fallback;
  if (typeof value === "object") return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function userHasWidgetAccess(widget, user) {
  if (!widget.required_scope) return true;
  if (user?.role === ROLES.ADMIN) return true;

  const scopes = new String(user?.scope || "")
    .split(",")
    .map((scope) => scope.trim())
    .filter(Boolean);

  return scopes.includes(widget.required_scope);
}

function normalizeWidget(row) {
  return {
    id: row.id || row.widget_key,
    widgetKey: row.widget_key,
    title: row.title,
    category: row.category,
    visualization: row.visualization,
    dataKey: row.data_key,
    requiredScope: row.required_scope,
    defaultEnabled: Boolean(row.default_enabled),
    defaultLayout: parseJson(row.default_layout, DEFAULT_LAYOUTS[row.widget_key] || { x: 0, y: 0, w: 4, h: 3 }),
    config: parseJson(row.config, {}),
  };
}

async function getAvailableWidgets(conn, user) {
  let hasTables = await dashboardTablesExist(conn);

  if (!hasTables) {
    await ensureDashboardSchema(conn);
    hasTables = true;
  }

  const [rows] = await conn.query(
    `
    SELECT *
    FROM dashboard_widgets
    WHERE is_active = 1
    ORDER BY sort_order ASC, category ASC, title ASC;
    `
  );

  return rows
    .filter((row) => userHasWidgetAccess(row, user))
    .map(normalizeWidget);
}

function buildDefaultPreference(widgets) {
  const selectedWidgetKeys = widgets
    .filter((widget) => widget.defaultEnabled)
    .map((widget) => widget.widgetKey);

  const layout = widgets.reduce((acc, widget) => {
    if (widget.defaultEnabled) {
      acc[widget.widgetKey] = widget.defaultLayout;
    }
    return acc;
  }, {});

  return { selectedWidgetKeys, layout };
}

async function getPreference(conn, username, tenantId, widgets) {
  const hasTables = await dashboardTablesExist(conn);
  const fallback = buildDefaultPreference(widgets);
  if (!hasTables) return fallback;

  const [rows] = await conn.query(
    `
    SELECT selected_widget_keys, layout
    FROM user_dashboard_preferences
    WHERE tenant_id = ? AND username = ?
    LIMIT 1;
    `,
    [tenantId, username]
  );

  if (rows.length === 0) return fallback;

  return {
    selectedWidgetKeys: parseJson(rows[0].selected_widget_keys, fallback.selectedWidgetKeys),
    layout: parseJson(rows[0].layout, fallback.layout),
  };
}

exports.getDashboardEngineDB = async (tenantId, user) => {
  const conn = await getMySqlPromiseConnection();
  try {
    const widgets = await getAvailableWidgets(conn, user);
    const preferences = await getPreference(conn, user.username, tenantId, widgets);
    const data = await exports.getDashboardWidgetDataDB(
      tenantId,
      user,
      preferences.selectedWidgetKeys
    );

    return { widgets, preferences, data };
  } finally {
    conn.release();
  }
};

exports.getDashboardWidgetsDB = async (tenantId, user) => {
  const conn = await getMySqlPromiseConnection();
  try {
    const widgets = await getAvailableWidgets(conn, user);
    const preferences = await getPreference(conn, user.username, tenantId, widgets);
    return { widgets, preferences };
  } finally {
    conn.release();
  }
};

exports.saveDashboardPreferenceDB = async (tenantId, username, selectedWidgetKeys, layout) => {
  const conn = await getMySqlPromiseConnection();
  try {
    const hasTables = await dashboardTablesExist(conn);
    if (!hasTables) {
      await ensureDashboardSchema(conn);
    }

    await conn.query(
      `
      INSERT INTO user_dashboard_preferences
      (tenant_id, username, selected_widget_keys, layout)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        selected_widget_keys = VALUES(selected_widget_keys),
        layout = VALUES(layout),
        updated_at = CURRENT_TIMESTAMP;
      `,
      [tenantId, username, JSON.stringify(selectedWidgetKeys || []), JSON.stringify(layout || {})]
    );
  } finally {
    conn.release();
  }
};

async function getInventoryValue(conn, tenantId) {
  const hasSettings = await tableExists(conn, "inventory_item_settings");
  if (!hasSettings) return 0;

  const [rows] = await conn.query(
    `
    SELECT COALESCE(SUM(ii.quantity * COALESCE(iis.standard_cost, iis.last_purchase_cost, 0)), 0) AS value
    FROM inventory_items ii
    LEFT JOIN inventory_item_settings iis ON iis.inventory_item_id = ii.id
    WHERE ii.tenant_id = ?;
    `,
    [tenantId]
  );
  return Number(rows[0]?.value || 0);
}

const DATA_LOADERS = {
  revenue_today: async (conn, tenantId) => {
    const [rows] = await conn.query(
      `
      SELECT COALESCE(SUM(total), 0) AS value
      FROM invoices
      WHERE tenant_id = ? AND DATE(created_at) = CURDATE();
      `,
      [tenantId]
    );
    return { value: Number(rows[0]?.value || 0), format: "currency" };
  },

  orders_today: async (conn, tenantId) => {
    const [rows] = await conn.query(
      `
      SELECT COUNT(*) AS value
      FROM orders
      WHERE tenant_id = ? AND DATE(date) = CURDATE();
      `,
      [tenantId]
    );
    return { value: Number(rows[0]?.value || 0), format: "number" };
  },

  open_orders: async (conn, tenantId) => {
    const [rows] = await conn.query(
      `
      SELECT COUNT(*) AS value
      FROM orders
      WHERE tenant_id = ? AND status NOT IN ('completed', 'cancelled');
      `,
      [tenantId]
    );
    return { value: Number(rows[0]?.value || 0), format: "number" };
  },

  low_stock: async (conn, tenantId) => {
    const [rows] = await conn.query(
      `
      SELECT COUNT(*) AS value
      FROM inventory_items
      WHERE tenant_id = ?
        AND stock_alert_quantity IS NOT NULL
        AND quantity <= stock_alert_quantity;
      `,
      [tenantId]
    );
    return { value: Number(rows[0]?.value || 0), format: "number" };
  },

  inventory_value: async (conn, tenantId) => ({
    value: await getInventoryValue(conn, tenantId),
    format: "currency",
  }),

  sales_trend_7d: async (conn, tenantId) => {
    const [rows] = await conn.query(
      `
      SELECT DATE(created_at) AS label, COALESCE(SUM(total), 0) AS value
      FROM invoices
      WHERE tenant_id = ?
        AND created_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
      GROUP BY DATE(created_at)
      ORDER BY DATE(created_at);
      `,
      [tenantId]
    );
    return rows.map((row) => ({ label: row.label, value: Number(row.value || 0) }));
  },

  top_items_today: async (conn, tenantId) => {
    const [rows] = await conn.query(
      `
      SELECT COALESCE(mi.title, oi.item_name, CONCAT('Item #', oi.item_id)) AS label,
             SUM(oi.quantity) AS value
      FROM order_items oi
      LEFT JOIN menu_items mi ON mi.id = oi.item_id AND mi.tenant_id = oi.tenant_id
      WHERE oi.tenant_id = ?
        AND oi.status <> 'cancelled'
        AND DATE(oi.date) = CURDATE()
      GROUP BY label
      ORDER BY value DESC
      LIMIT 8;
      `,
      [tenantId]
    );
    return rows.map((row) => ({ label: row.label, value: Number(row.value || 0) }));
  },

  sales_by_payment_status: async (conn, tenantId) => {
    const [rows] = await conn.query(
      `
      SELECT payment_status AS label, COUNT(*) AS value
      FROM orders
      WHERE tenant_id = ?
      GROUP BY payment_status;
      `,
      [tenantId]
    );
    return rows.map((row) => ({ label: row.label || "unknown", value: Number(row.value || 0) }));
  },

  hal_ai_insights: async () => ({
    value: "HAL widgets are reserved for AI insights.",
    status: "coming_soon",
  }),
};

exports.getDashboardWidgetDataDB = async (tenantId, user, widgetKeys = []) => {
  const conn = await getMySqlPromiseConnection();
  try {
    const widgets = await getAvailableWidgets(conn, user);
    const allowedKeys = new Set(widgets.map((widget) => widget.widgetKey));
    const keys = (widgetKeys.length > 0 ? widgetKeys : widgets.map((widget) => widget.widgetKey))
      .filter((key) => allowedKeys.has(key));

    const data = {};
    for (const key of keys) {
      const loader = DATA_LOADERS[key];
      if (loader) {
        data[key] = await loader(conn, tenantId);
      }
    }
    return data;
  } finally {
    conn.release();
  }
};
