const mysql = require('mysql2');

// MySQL connection pool for Local Environment
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  //cd /Users/abhishekkola/Documents/DP360_local/salespulseport: 3306,  // Default MySQL port
  port: process.env.DB_PORT,
  multipleStatements: true,  // Allow multiple queries in a single request
  dateStrings: true,  // Handle date fields as strings
  waitForConnections: true,  // Wait for available connection if pool is full
  connectionLimit: 200,  // Maximum number of connections in the pool
  enableKeepAlive: true,  // Keep connections alive
  keepAliveInitialDelay: 20000  // Delay before starting to keep connections alive
});

// Old values for Local ENV
  // host: 'localhost',  // RDS endpoint
  // user: 'root',  // Database user
  // password: '$2b$10$zzWH9YDVSBnOSnSo5LhMlu.kGOOT94kruj43xVKbK4iooExrqML1q',  // Use the correct password here
  // database: 'salespulse',  // Database name

// Create MySQL connection pool without SSL
// const pool = mysql.createPool({
//   host: '20.193.128.146',  // RDS endpoint
//   user: 'salespulse',  // Database user
//   password: 'VosZQGA6dJREteWeYvQm!',  // Use the correct password here
//   database: 'salespulse',  // Database name
//   port: 3306,  // Default MySQL port
//   multipleStatements: true,  // Allow multiple queries in a single request
//   dateStrings: true,  // Handle date fields as strings
//   waitForConnections: true,  // Wait for available connection if pool is full
//   connectionLimit: 200,  // Maximum number of connections in the pool
//   enableKeepAlive: true,  // Keep connections alive
//   keepAliveInitialDelay: 20000  // Delay before starting to keep connections alive
// });

console.log('DB Pool Created.');

exports.getMySqlPromiseConnection = async () => {
  try {
    // Getting a connection from the pool
    const connection = await pool.promise().getConnection();
    return connection;
  } catch (error) {
    console.error('Error getting MySQL connection: ', error.code, error.message);
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
    console.error('Error executing query: ', error.code, error.message);
    throw error;  // Re-throw the error for further handling
  }
};

