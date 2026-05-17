import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { pool } from "../config/db.js";
import crypto from "crypto";

// Token creation helper
const createToken = (id, email) => {
  return jwt.sign({ id, email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY || "1d",
  });
};

// 🔐 Register new customer
export const registerUser = async (req, res) => {
  const { password, name, email, phone } = req.body;

  if (!email || !password || !name || !phone) {
    return res.status(400).json({
      success: false,
      message: "Email, name, password, and phone are required",
    });
  }

  try {
    const [existing] = await pool.query(
      "SELECT id FROM customers WHERE (email = ? OR phone = ?) AND tenant_id = 18",
      [email, phone]
    );

    if (existing.length > 0) {
      return res
        .status(409)
        .json({ success: false, message: "Email or phone already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO customers (name, email, password, phone, tenant_id) VALUES (?, ?, ?, ?, 18)`,
      [name, email, hashedPassword, phone]
    );

    res.json({ success: true, message: "Customer registered successfully" });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🔓 Login customer
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await pool.query(
      "SELECT * FROM customers WHERE email = ? AND tenant_id = 18",
      [email]
    );

    if (rows.length === 0)
      return res.status(401).json({ message: "Invalid email or password" });

    const customer = rows[0];
    const match = await bcrypt.compare(password, customer.password);
    if (!match)
      return res.status(401).json({ message: "Invalid email or password" });

    const token = createToken(customer.id, customer.email);
    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

// 📩 Request password reset
export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  const token = crypto.randomBytes(32).toString("hex");
  const expiry = new Date(Date.now() + 3600000); // 1 hour

  try {
    const [rows] = await pool.query(
      "SELECT * FROM customers WHERE email = ? AND tenant_id = 18",
      [email]
    );
    if (rows.length === 0)
      return res.status(404).json({ message: "Email not found" });

    await pool.query(
      "UPDATE customers SET reset_token = ?, reset_token_expiry = ? WHERE email = ? AND tenant_id = 18",
      [token, expiry, email]
    );

    res.json({ message: "Password reset token generated", token }); // Send this via email in production
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

// 🔁 Reset password
export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const [rows] = await pool.query(
      "SELECT * FROM customers WHERE reset_token = ? AND reset_token_expiry > NOW() AND tenant_id = 18",
      [token]
    );

    if (rows.length === 0)
      return res.status(400).json({ message: "Invalid or expired token" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query(
      "UPDATE customers SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?",
      [hashedPassword, rows[0].id]
    );

    res.json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};
