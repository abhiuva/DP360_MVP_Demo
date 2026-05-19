const { query } = require("../config/mysql.db");
const { getPublicStoreDetails } = require("./settings.controller");

const getTenantId = (req) => {
  const tenantId =
    req.query.tenantId ||
    req.query.tenant_id ||
    req.headers["x-tenant-id"] ||
    process.env.DEFAULT_TENANT_ID ||
    process.env.TENANT_ID ||
    18;

  const parsedTenantId = Number(tenantId);
  return Number.isFinite(parsedTenantId) ? parsedTenantId : 18;
};

exports.listFood = async (req, res) => {
  const tenantId = getTenantId(req);

  try {
    const rows = await query(
      `
        SELECT
          m.*,
          c.title AS category_name,
          COALESCE(m.image, '') AS image
        FROM menu_items m
        LEFT JOIN categories c ON m.category = c.id
        WHERE m.tenant_id = ?
          AND COALESCE(m.status, 'Available') = 'Available'
        ORDER BY m.id DESC
      `,
      [tenantId]
    );

    return res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("[client compat] Failed to list food", {
      tenantId,
      code: error.code,
      sqlState: error.sqlState,
      message: error.message,
    });

    return res.status(500).json({
      success: false,
      message: "Unable to load menu items.",
    });
  }
};

exports.getPublicStoreDetails = getPublicStoreDetails;
