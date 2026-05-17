// server/routes/checkout.js
import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/create-checkout-session", async (req, res) => {
  const { orderId, tenantId, amount, success_url, cancel_url } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [{
        price_data: {
          currency: "usd",
          product_data: {
            name: `Order #${orderId}`,
          },
          unit_amount: Math.round(amount * 100),
        },
        quantity: 1,
      }],
      success_url,
      cancel_url,
      metadata: {
        order_id: orderId.toString(),
        tenant_id: tenantId.toString(),
        amount: amount.toString()
      }
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe session error:", err.message);
    res.status(500).send("Failed to create session");
  }
});

export default router;
