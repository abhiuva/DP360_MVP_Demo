const { Router } = require("express");
const {
  isLoggedIn,
  isAuthenticated,
  authorize,
  isSubscriptionActive,
} = require("../middlewares/auth.middleware");
const { SCOPES } = require("../config/user.config");

// Import controllers (to be created)
const {
  createCheckoutSession,
  verifyPayment,
  completeOrder,
  CreateConnectionToken,
  CreatePaymentIntent
} = require("../controllers/payments.controller");

const router = Router();

// Stripe payment routes
router.post(
  "/stripe/create-checkout-session",
  isLoggedIn,
  isAuthenticated,
  isSubscriptionActive,
  authorize([SCOPES.POS]),
  createCheckoutSession
);

router.get(
  "/stripe/verify-payment/:sessionId",
  isLoggedIn,
  isAuthenticated,
  isSubscriptionActive,
  authorize([SCOPES.POS]),
  verifyPayment
);

router.post(
  "/complete-order",
  isLoggedIn,
  isAuthenticated,
  isSubscriptionActive,
  authorize([SCOPES.POS]),
  completeOrder
);

router.post(
  "/stripe/create-connection-token",
  isLoggedIn,
  isAuthenticated,
  isSubscriptionActive,
  authorize([SCOPES.POS]),
  CreateConnectionToken
);

router.post(
  "/stripe/create-payment-intent",
  isLoggedIn,
  isAuthenticated,
  isSubscriptionActive,
  authorize([SCOPES.POS]),
  CreatePaymentIntent
);

module.exports = router; 