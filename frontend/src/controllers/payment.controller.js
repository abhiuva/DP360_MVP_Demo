import ApiClient from "../helpers/ApiClient";

/**
 * Creates a Stripe payment session for the current order
 * @param {Object} orderData - Contains all order data needed for checkout
 * @param {number} orderData.amount - The total amount to charge
 * @param {string} orderData.orderId - The ID of the order
 * @param {string} orderData.currency - The currency code (default: USD)
 * @param {string} orderData.customerEmail - Optional customer email
 * @param {string} orderData.successUrl - URL to redirect after successful payment
 * @param {string} orderData.cancelUrl - URL to redirect if payment is cancelled
 * @returns {Promise<Object>} - The Stripe session data with redirect URL
 */
export async function createStripeCheckoutSession(orderData) {
  try {
    console.log("Payment Controller: Creating Stripe checkout session with data:", orderData);
    const response = await ApiClient.post("/payments/stripe/create-checkout-session", orderData);
    console.log("Payment Controller: Stripe checkout response:", response);
    return response;
  } catch (error) {
    console.error("Payment Controller: Stripe checkout error:", error);
    if (error.response) {
      console.error("Payment Controller: API response data:", error.response.data);
      console.error("Payment Controller: API response status:", error.response.status);
    }
    throw error;
  }
}

/**
 * Verify a Stripe payment session
 * @param {string} sessionId - The Stripe session ID to verify
 * @returns {Promise<Object>} - The payment verification result
 */
export async function verifyStripePayment(sessionId) {
  try {
    console.log("Payment Controller: Verifying Stripe payment with session ID:", sessionId);
    const response = await ApiClient.get(`/payments/stripe/verify-payment/${sessionId}`);
    console.log("Payment Controller: Stripe verification response:", response);
    return response;
  } catch (error) {
    console.error("Payment Controller: Stripe verification error:", error);
    if (error.response) {
      console.error("Payment Controller: API response data:", error.response.data);
    }
    throw error;
  }
}

/**
 * Completes an order after successful payment
 * @param {string} orderId - The order ID to complete
 * @param {string} paymentId - The payment ID from Stripe
 * @returns {Promise<Object>} - The order completion result
 */
export async function completeOrderAfterPayment(orderId, paymentId) {
  try {
    console.log("Payment Controller: Completing order after payment:", { orderId, paymentId });
    const response = await ApiClient.post("/payments/complete-order", {
      orderId,
      paymentId
    });
    console.log("Payment Controller: Order completion response:", response);
    return response;
  } catch (error) {
    console.error("Payment Controller: Order completion error:", error);
    if (error.response) {
      console.error("Payment Controller: API response data:", error.response.data);
    }
    throw error;
  }
} 