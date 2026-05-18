import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const requiredDbEnv = ["DB_HOST", "DB_USER", "DB_PASSWORD", "DB_NAME"];
const missingDbEnv = requiredDbEnv.filter((key) => !process.env[key]);

if (missingDbEnv.length) {
  console.error("[DB config] Missing required environment variables:", missingDbEnv.join(", "));
}

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});


console.log("[DB config] MySQL pool created", {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
});
