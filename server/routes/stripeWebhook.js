import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { pool } from "../config/db.js";

dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Shared logic to create invoice
export const handleStripeEvent = async (event, res) => {
  if (event.type !== "checkout.session.completed") {
    return res.status(400).send("Unsupported event");
  }

  const session = event.data.object;
  const orderId = parseInt(session.metadata?.order_id);
  const tenantId = parseInt(session.metadata?.tenant_id);
  const total = parseFloat(session.metadata?.amount || 0);

  if (!orderId || !tenantId || isNaN(total)) {
    return res.status(400).send("Missing metadata");
  }

  const tax = parseFloat((total * 0.1).toFixed(2));
  const subTotal = parseFloat((total - tax).toFixed(2));

  try {
    await pool.query(`UPDATE orders SET payment_status = 'paid' WHERE id = ?`, [orderId]);

    const [[row]] = await pool.query(
      `SELECT sequence_no FROM invoice_sequences WHERE tenant_id = ?`,
      [tenantId]
    );
    const invoiceId = row ? row.sequence_no + 1 : 1;

    const [[paymentTypeRow]] = await pool.query(
      `SELECT id FROM payment_types WHERE title = 'Stripe' AND tenant_id = ?`,
      [tenantId]
    );
    const paymentTypeId = paymentTypeRow?.id;
    if (!paymentTypeId) return res.status(500).send("Stripe payment type not found");

    await pool.query(
      `INSERT INTO invoices (id, sub_total, tax_total, total, tenant_id, payment_type_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [invoiceId, subTotal, tax, total, tenantId, paymentTypeId]
    );

    if (row) {
      await pool.query(
        `UPDATE invoice_sequences SET sequence_no = ? WHERE tenant_id = ?`,
        [invoiceId, tenantId]
      );
    } else {
      await pool.query(
        `INSERT INTO invoice_sequences (tenant_id, sequence_no) VALUES (?, ?)`,
        [tenantId, invoiceId]
      );
    }

    await pool.query(
      `UPDATE orders SET invoice_id = ? WHERE id = ?`,
      [invoiceId, orderId]
    );

    console.log("✅ Invoice created for order:", orderId);
    return res.status(200).send("Invoice recorded");
  } catch (err) {
    console.error("❌ Error in handleStripeEvent:", err);
    return res.status(500).send("Invoice creation failed");
  }
};

// Actual webhook (optional)
router.post("/webhook", bodyParser.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    return await handleStripeEvent(event, res);
  } catch (err) {
    console.error("❌ Webhook error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

// ✅ New endpoint for client to finalize Stripe payment (no webhook needed)
router.post("/finalize", express.json(), async (req, res) => {
  const { order_id, tenant_id, amount } = req.body;

  const fakeEvent = {
    type: "checkout.session.completed",
    data: {
      object: {
        metadata: {
          order_id: String(order_id),
          tenant_id: String(tenant_id),
          amount: String(amount),
        },
      },
    },
  };

  return await handleStripeEvent(fakeEvent, res);
});

export default router;
