import express from "express";
import cors from "cors";
import { pool } from "./config/db.js";
import userRoutes from "./routes/userRoute.js";
import foodRouter from "./routes/foodRoute.js";
import orderRouter from "./routes/orderRoute.js";
import imageRoute from "./routes/imageRoute.js";
import publicStoreRoute from "./routes/publicStoreRoute.js";
import stripeWebhook from "./routes/stripeWebhook.js";
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import checkoutRoutes from "./routes/checkout.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = process.env.PORT || 4000;

// Enable CORS (before routes!)
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3001"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// Enable JSON body parsing (before routes!)
app.use(express.json());

// Stripe webhook must use raw body parser for signature verification
import bodyParser from "body-parser";
app.use(
  "/api/stripe/webhook",
  bodyParser.raw({ type: "application/json" }),
  stripeWebhook
);

// Static image hosting
app.use("/images", express.static(path.join(__dirname, "uploads")));
app.use("/public", express.static(path.join(__dirname, "../backend/public")));

// Regular JSON API routes (after CORS and JSON middleware)
app.use("/", imageRoute);
app.use("/api/users", userRoutes);
app.use("/api/food", foodRouter);
app.use("/api/order", orderRouter);
app.use("/api/settings", publicStoreRoute);
app.use("/api/stripe", stripeWebhook); // For /api/stripe/finalize
app.use("/api", checkoutRoutes);

// Basic test route
app.get("/", (req, res) => {
  res.send("API Working");
});

app.listen(port, () =>
  console.log(`Server started on http://localhost:${port}`)
);
