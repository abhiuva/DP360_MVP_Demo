import Stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createConnectionToken = async (req, res) => {
  try {
    const connectionToken = await stripe.terminal.connectionTokens.create();
    res.json({ success: true, secret: connectionToken.secret });
  } catch (error) {
    console.error("Connection token error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createPaymentIntent = async (req, res) => {
  const { amount, currency, tenant_id } = req.body;

  if (!amount || !currency || !tenant_id) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method_types: ['card_present'],
      capture_method: 'manual',
      metadata: {
        tenant_id: tenant_id.toString()
      }
    });

    res.json({ success: true, client_secret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Payment Intent error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
