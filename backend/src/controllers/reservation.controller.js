const { nanoid } = require("nanoid");
const { getMySqlPromiseConnection } = require("../config/mysql.db");
const {
  addReservationDB,
  updateReservationDB,
  cancelReservationDB,
  deleteReservationDB,
  searchReservationsDB,
  getReservationsDB,
  getReservationByIdDB,
} = require("../services/reservation.service");
const {
  getStoreTablesDB,
  updateTableOccupancyDB,
} = require("../services/settings.service");

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



exports.initReservation = async (req, res) => {
  try {
    const tenantId = req.user.tenant_id;
    const [storeTables] = await Promise.all([getStoreTablesDB(tenantId)]);
    return res.status(200).json({ storeTables });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong! Please try later!",
    });
  }
};

exports.addReservation = async (req, res) => {
  const conn = await getMySqlPromiseConnection();
  try {
    const tenantId = req.user.tenant_id;
    const { customerId, date, tableId, status, notes, peopleCount } = req.body;

    console.log("➡️ Reservation Add Request Body:", req.body);

    if (!customerId || !date || !peopleCount) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide required details: Customer, Date, People Count!",
      });
    }

    const [customerRows] = await conn.query(
      `SELECT id FROM customers WHERE phone = ? AND tenant_id = ? LIMIT 1`,
      [customerId, tenantId]
    );

    if (!customerRows || customerRows.length === 0) {
      console.warn("⚠️ No customer found for phone:", customerId);
      return res.status(404).json({
        success: false,
        message: "Customer not found!",
      });
    }

    const numericCustomerId = customerRows[0].id;
    const uniqueCode = nanoid(10);

    const formattedDate = toMySQLDateTime(date); // raw string from frontend
    const startTime = new Date(date); // only for logic/overlap checking

    const now = new Date();

    const roundToMinute = (d) =>
      new Date(Math.floor(d.getTime() / 60000) * 60000);
    const nowRounded = roundToMinute(new Date());
    const startRounded = roundToMinute(new Date(date));

    if (startRounded <= nowRounded) {
      return res.status(400).json({
        success: false,
        message: "Cannot set reservation to past or current time!",
      });
    }

    const blockMinutes = parseInt(
      process.env.RESERVATION_BLOCK_DURATION_MINUTES || "120",
      10
    );
    const endTime = new Date(startTime.getTime() + blockMinutes * 60000);

    const [overlaps] = await conn.query(
      `SELECT id FROM reservations
   WHERE tenant_id = ? AND table_id = ?
   AND (
     (? BETWEEN date AND DATE_ADD(date, INTERVAL ? MINUTE)) OR
     (? BETWEEN date AND DATE_ADD(date, INTERVAL ? MINUTE)) OR
     (date BETWEEN ? AND ?)
   )`,
      [
        tenantId,
        tableId,
        toMySQLDateTime(startTime),
        blockMinutes,
        toMySQLDateTime(endTime),
        blockMinutes,
        toMySQLDateTime(startTime),
        toMySQLDateTime(endTime),
      ]
    );

    if (overlaps.length > 0) {
      console.warn("⚠️ Overlapping reservation found:", overlaps);
      return res.status(409).json({
        success: false,
        message: "This table is already reserved for this time window!",
      });
    }

    const reservationId = await addReservationDB(
      numericCustomerId,
      formattedDate,
      tableId,
      status,
      notes,
      peopleCount,
      uniqueCode,
      tenantId
    );

    console.log("✅ Reservation successfully inserted with ID:", reservationId);

    return res.status(200).json({
      success: true,
      message: "Reservation Done.",
      reservationId,
      uniqueCode,
    });
  } catch (error) {
    console.error("❌ Error in addReservation controller:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong! Please try later!",
    });
  } finally {
    conn.release();
  }
};

exports.updateReservation = async (req, res) => {
  const conn = await getMySqlPromiseConnection();
  try {
    const tenantId = req.user.tenant_id;
    const reservationId = parseInt(req.params.id);
    const { date, tableId, status, notes, peopleCount } = req.body;

    if (!reservationId || !date || !peopleCount) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields!",
      });
    }

    const formattedDate = toMySQLDateTime(date); // raw string from frontend
    const startTime = new Date(date); // only for logic/overlap checking

    if (isNaN(startTime.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date provided!",
      });
    }

    const now = new Date();
    const roundToMinute = (d) =>
      new Date(Math.floor(d.getTime() / 60000) * 60000);
    const nowRounded = roundToMinute(new Date());
    const startRounded = roundToMinute(startTime);

    if (startRounded <= nowRounded) {
      return res.status(400).json({
        success: false,
        message: "Cannot set reservation to past or current time!",
      });
    }

    const blockMinutes = parseInt(
      process.env.RESERVATION_BLOCK_DURATION_MINUTES || "120",
      10
    );
    const endTime = new Date(startTime.getTime() + blockMinutes * 60000);

    const [overlaps] = await conn.query(
      `SELECT id FROM reservations
      WHERE tenant_id = ? AND table_id = ? AND id != ?
      AND (
        (? BETWEEN date AND DATE_ADD(date, INTERVAL ? MINUTE)) OR
        (? BETWEEN date AND DATE_ADD(date, INTERVAL ? MINUTE)) OR
        (date BETWEEN ? AND ?)
      )`,
      [
        tenantId,
        tableId,
        reservationId,
        toMySQLDateTime(startTime),
        blockMinutes,
        toMySQLDateTime(endTime),
        blockMinutes,
        toMySQLDateTime(startTime),
        toMySQLDateTime(endTime),
      ]
    );

    if (overlaps.length > 0) {
      return res.status(409).json({
        success: false,
        message:
          "This table is already reserved during the selected time window. Please choose a different time or table.",
      });
    }

    await updateReservationDB(
      reservationId,
      formattedDate,
      tableId,
      status,
      notes,
      peopleCount,
      tenantId
    );

    return res.status(200).json({
      success: true,
      message: "Reservation Details Updated.",
    });
  } catch (error) {
    console.error("Error in updateReservation:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong! Please try later!",
    });
  } finally {
    conn.release();
  }
};

exports.cancelReservation = async (req, res) => {
  try {
    const tenantId = req.user.tenant_id;
    const reservationId = req.params.id;

    await cancelReservationDB(reservationId, "CANCELLED", tenantId);

    const [reservation] = await getReservationByIdDB(reservationId, tenantId);
    if (reservation?.table_id) {
      await updateTableOccupancyDB(reservation.table_id, "vacant", tenantId);
    }

    return res
      .status(200)
      .json({ success: true, message: "Reservation Cancelled." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong! Please try later!",
    });
  }
};

exports.deleteReservation = async (req, res) => {
  try {
    const tenantId = req.user.tenant_id;
    const reservationId = req.params.id;

    await deleteReservationDB(reservationId, tenantId);
    return res
      .status(200)
      .json({ success: true, message: "Reservation Deleted." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong! Please try later!",
    });
  }
};

exports.searchReservation = async (req, res) => {
  try {
    const tenantId = req.user.tenant_id;
    const searchString = req.query.q;

    if (!searchString) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide required details!" });
    }

    const result = await searchReservationsDB(searchString, tenantId);
    return res
      .status(result.length > 0 ? 200 : 404)
      .json(
        result.length > 0
          ? result
          : { success: false, message: "No results found!" }
      );
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong! Please try later!",
    });
  }
};

exports.getReservations = async (req, res) => {
  try {
    const tenantId = req.user.tenant_id;
    const from = req.query.from || null;
    const to = req.query.to || null;
    const type = req.query.type;

    if (!type) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide required details!" });
    }

    if (type === "custom" && !(from && to)) {
      return res.status(400).json({
        success: false,
        message: "Please provide required details from & to dates!",
      });
    }

    const result = await getReservationsDB(type, from, to, tenantId);
    return res.status(200).json(result.length > 0 ? result : []);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong! Please try later!",
    });
  }
};
