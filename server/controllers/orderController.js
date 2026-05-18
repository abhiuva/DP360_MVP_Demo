import dotenv from "dotenv";
dotenv.config();

import { pool } from "../config/db.js";
import Stripe from "stripe";
import jwt from "jsonwebtoken";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const currency = process.env.CURRENCY || "gbp";
const deliveryCharge = parseFloat(process.env.DELIVERY_CHARGE || "4");
const frontend_URL = process.env.FRONTEND_URL || "https://dp360-mvp.netlify.app";

export const placeOrder = async (req, res) => {
  const { items, amount, address, orderType, name, email: bodyEmail } = req.body;

  try {
    const tenantId = parseInt(process.env.TENANT_ID || "18");
    const orderCode = Math.floor(100000 + Math.random() * 900000);

    let email = bodyEmail;
    if (req.headers.authorization?.startsWith("Bearer ")) {
      try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        email = decoded.email;
      } catch (err) {
        console.warn("Invalid JWT token, falling back to request email.");
      }
    }

    const [orderResult] = await pool.query(
      `INSERT INTO orders (delivery_type, customer_type, customer_id, token_no, tenant_id, payment_status, status)
       VALUES (?, 'CUSTOMER', ?, ?, ?, ?, 'created')`,
      [
        orderType,
        email,
        orderCode,
        tenantId,
        orderType === "pickup" ? "pending" : "paid",
      ]
    );

    const orderId = orderResult.insertId;

    for (const item of items) {
      await pool.query(
        `INSERT INTO order_items (order_id, item_id, item_name, price, quantity, tenant_id)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [orderId, item.id, item.name, item.price, item.quantity, tenantId]
      );
    }

    if (orderType === "pickup") {
      return res.json({
        success: true,
        receipt: {
          orderCode,
          name,
          email,
          amount,
          items,
        },
        orderId,
      });
    }

    return res.json({ success: true, orderId });
  } catch (error) {
    console.error("Order error:", error);
    res.status(500).json({ success: false, message: "Failed to place order" });
  }
};


export const getMyOrders = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    // Get orders
    const [orders] = await pool.query(
      `SELECT id, token_no, delivery_type, status, date FROM orders
       WHERE customer_id = ? ORDER BY date DESC`,
      [email]
    );

    // Attach items and totals for each order
    for (let order of orders) {
      const [items] = await pool.query(
        `SELECT item_name, quantity, price FROM order_items WHERE order_id = ?`,
        [order.id]
      );
      order.items = items;
      order.total = items.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);
    }

    res.json({ success: true, orders });
  } catch (err) {
    console.error("Get orders error:", err);
    res.status(401).json({ success: false, message: "Unauthorized" });
  }
};


export const verifyOrder = async (req, res) => {
  const { success, orderId } = req.body;

  if (success !== "true" || !orderId) {
    return res.status(400).json({ success: false, message: "Invalid verification" });
  }

  try {
    // Optionally, validate order status here
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Verification error:", err);
    res.status(500).json({ success: false, message: "Verification failed" });
  }
};
