const mysql = require('mysql2');

const requiredDbEnv = ["DB_HOST", "DB_USER", "DB_PASSWORD", "DB_NAME"];
const missingDbEnv = requiredDbEnv.filter((key) => !process.env[key]);

if (missingDbEnv.length) {
  console.error("[DB config] Missing required environment variables:", missingDbEnv.join(", "));
}

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 3306,
  multipleStatements: true,  // Allow multiple queries in a single request
  dateStrings: true,  // Handle date fields as strings
  waitForConnections: true,  // Wait for available connection if pool is full
  connectionLimit: 200,  // Maximum number of connections in the pool
  enableKeepAlive: true,  // Keep connections alive
  keepAliveInitialDelay: 20000  // Delay before starting to keep connections alive
});

console.log("[DB config] MySQL pool created", {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
});

exports.getMySqlPromiseConnection = async () => {
  try {
    // Getting a connection from the pool
    const connection = await pool.promise().getConnection();
    return connection;
  } catch (error) {
    console.error("[DB connection error]", {
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      message: error.message,
    });
    throw error;  // Re-throw the error to propagate it
  }
};

exports.query = async (sql, params) => {
  try {
    const connection = await this.getMySqlPromiseConnection();
    const [rows] = await connection.execute(sql, params);
    connection.release();  // Don't forget to release the connection back to the pool
    return rows;
  } catch (error) {
    console.error("[DB query error]", {
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      message: error.message,
    });
    throw error;  // Re-throw the error for further handling
  }
};
