const { getMySqlPromiseConnection } = require("../config/mysql.db");

function toMySQLDateTime(input) {
  const d = new Date(input);
  const yyyy = d.getFullYear();
  const MM = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  return `${yyyy}-${MM}-${dd} ${hh}:${mm}:${ss}`;
}


exports.addReservationDB = async (
  customerId,
  date,
  tableId,
  status,
  notes,
  peopleCount,
  uniqueCode,
  tenantId
) => {
  const conn = await getMySqlPromiseConnection();
  try {
    const sql = `
      INSERT INTO reservations 
      (customer_id, date, table_id, status, notes, people_count, unique_code, tenant_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const formattedDate = toMySQLDateTime(date); 

    const [result] = await conn.query(sql, [
      customerId,
      formattedDate,
      tableId,
      status,
      notes,
      peopleCount,
      uniqueCode,
      tenantId,
    ]);

    return result.insertId;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    conn.release();
  }
};

exports.updateReservationDB = async (
  reservationId,
  date,
  tableId,
  status,
  notes,
  peopleCount,
  tenantId
) => {
  const conn = await getMySqlPromiseConnection();
  try {
    const formattedDate = toMySQLDateTime(date);

    console.log("🔧 Final formatted date for MySQL:", formattedDate);

    const [result] = await conn.query(
      `
      UPDATE reservations 
      SET date = ?, table_id = ?, status = ?, notes = ?, people_count = ?, updated_at = NOW()
      WHERE id = ? AND tenant_id = ?
    `,
      [
        formattedDate,
        tableId,
        status,
        notes,
        peopleCount,
        reservationId,
        tenantId,
      ]
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    conn.release();
  }
};

exports.cancelReservationDB = async (reservationId, status, tenantId) => {
  const conn = await getMySqlPromiseConnection();
  try {
    const sql = `UPDATE reservations SET status = ? WHERE id = ? AND tenant_id = ?`;
    await conn.query(sql, [status, reservationId, tenantId]);
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    conn.release();
  }
};

exports.deleteReservationDB = async (reservationId, tenantId) => {
  const conn = await getMySqlPromiseConnection();
  try {
    const sql = `DELETE FROM reservations WHERE id = ? AND tenant_id = ?`;
    await conn.query(sql, [reservationId, tenantId]);
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    conn.release();
  }
};

exports.getReservationByIdDB = async (reservationId, tenantId) => {
  const conn = await getMySqlPromiseConnection();
  try {
    const sql = `SELECT * FROM reservations WHERE id = ? AND tenant_id = ?`;
    const [result] = await conn.query(sql, [reservationId, tenantId]);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    conn.release();
  }
};

exports.searchReservationsDB = async (search, tenant_id) => {
  const conn = await getMySqlPromiseConnection();
  try {
    const sql = `
      SELECT r.id, customer_id, c.name as customer_name, r.date, table_id, st.table_title, status, notes, people_count, unique_code, r.created_at, r.updated_at
      FROM reservations r
      INNER JOIN customers c ON r.customer_id = c.id AND r.tenant_id = c.tenant_id
      LEFT JOIN store_tables st ON r.table_id = st.id
      WHERE r.tenant_id = ? AND (r.id = ? OR customer_id = ? OR unique_code = ?)
      ORDER BY r.created_at DESC
      LIMIT 20
    `;
    const [results] = await conn.query(sql, [
      tenant_id,
      search,
      search,
      search,
    ]);
    return results;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    conn.release();
  }
};

exports.getReservationsDB = async (type, from, to, tenantId) => {
  const conn = await getMySqlPromiseConnection();
  try {
    const { filter, params } = getFilterConditionForReservationSearch(
      type,
      from,
      to,
      tenantId
    );
    const sql = `
      SELECT r.id, customer_id, c.name as customer_name, r.date, table_id, st.table_title, status, notes, people_count, unique_code, r.created_at, r.updated_at
      FROM reservations r
      INNER JOIN customers c ON r.customer_id = c.id AND r.tenant_id = c.tenant_id
      LEFT JOIN store_tables st ON r.table_id = st.id
      WHERE ${filter}
    `;
    const [results] = await conn.query(sql, params);
    return results;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    conn.release();
  }
};

function getFilterConditionForReservationSearch(type, from, to, tenantId) {
  const params = [];
  let filter = "";

  switch (type) {
    case "custom":
      params.push(`${from} 00:00:00`, `${to} 23:59:59`, tenantId);
      filter = `(r.date BETWEEN ? AND ?) AND r.tenant_id = ?`;
      break;
    case "today": {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const end = new Date();
      end.setHours(23, 59, 59, 999);

      params.push(start.toISOString().slice(0, 19).replace("T", " "));
      params.push(end.toISOString().slice(0, 19).replace("T", " "));
      params.push(tenantId);
      filter = `r.date BETWEEN ? AND ? AND r.tenant_id = ?`;
      break;
    }

    case "this_month":
      params.push(tenantId);
      filter = `YEAR(date) = YEAR(NOW()) AND MONTH(date) = MONTH(NOW()) AND r.tenant_id = ?`;
      break;
    case "last_month":
      params.push(tenantId);
      filter = `DATE(date) >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH) AND DATE(date) <= CURDATE() AND r.tenant_id = ?`;
      break;
    case "last_7days":
      params.push(tenantId);
      filter = `DATE(date) >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND DATE(date) <= CURDATE() AND r.tenant_id = ?`;
      break;
    case "yesterday":
      params.push(tenantId);
      filter = `DATE(date) = DATE_SUB(CURDATE(), INTERVAL 1 DAY) AND r.tenant_id = ?`;
      break;
    case "tomorrow":
      params.push(tenantId);
      filter = `DATE(date) = DATE_ADD(CURDATE(), INTERVAL 1 DAY) AND r.tenant_id = ?`;
      break;
    default:
      params.push(tenantId);
      filter = `r.tenant_id = ?`;
  }

  return { filter, params };
}
