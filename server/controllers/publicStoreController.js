import { pool } from "../config/db.js";

export const getPublicStoreDetails = async (req, res) => {
  const tenantId = req.params.tenantId;

  try {
    const sql = `
      SELECT store_name, address, phone, email 
      FROM store_details 
      WHERE tenant_id = ?
    `;

    const [rows] = await pool.query(sql, [tenantId]);

    if (!rows.length) {
      return res.status(404).json({ success: false, message: "Store not found" });
    }

    const { store_name, address, phone, email } = rows[0];

    return res.status(200).json({
      success: true,
      data: {
        storeName: store_name || "",
        address: address || "",
        phone: phone || "",
        email: email || ""
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};