import express from 'express';
import { placeOrder } from '../controllers/orderController.js';
import { getMyOrders } from '../controllers/orderController.js';
import { verifyOrder } from "../controllers/orderController.js";

const orderRouter = express.Router();

// Place order using Stripe
orderRouter.post("/place", placeOrder);
orderRouter.get("/myorders", getMyOrders);
orderRouter.post("/verify", verifyOrder);

export default orderRouter;
