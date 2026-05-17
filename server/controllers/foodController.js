import { pool } from "../config/db.js";
import fs from "fs";
import path from "path";

// List all food items from menu_items with category names
export const listFood = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT m.*, c.title AS category_name 
      FROM menu_items m 
      LEFT JOIN categories c ON m.category = c.id 
      WHERE m.tenant_id = 18
    `);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error("Error listing food:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Add new food item to menu_items
export const addFood = async (req, res) => {
  try {
    const { title, price, net_price, category, discount, tax } = req.body;
    const image_filename = req.file?.filename || null;

    const [result] = await pool.query(
      `INSERT INTO menu_items (title, price, net_price, category, tenant_id, image, discount, tax) 
       VALUES (?, ?, ?, ?, 18, ?, ?, ?)`,
      [title, price, net_price, category, image_filename, discount || 0.0, tax || 0.0]
    );

    res.json({ success: true, message: "Food item added", id: result.insertId });
  } catch (error) {
    console.error("Error adding food:", error);
    res.status(500).json({ success: false, message: "Failed to add food item" });
  }
};

// Delete a food item by ID
export const removeFood = async (req, res) => {
  try {
    const { id } = req.params;

    // Optional: remove image from uploads if necessary
    const [[item]] = await pool.query("SELECT image FROM menu_items WHERE id = ? AND tenant_id = 18", [id]);
    if (item?.image) {
      const imagePath = path.join("uploads", item.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await pool.query("DELETE FROM menu_items WHERE id = ? AND tenant_id = 18", [id]);
    res.json({ success: true, message: "Food item deleted" });
  } catch (error) {
    console.error("Error deleting food:", error);
    res.status(500).json({ success: false, message: "Failed to delete food item" });
  }
};
