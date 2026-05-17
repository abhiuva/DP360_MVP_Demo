const { Router } = require("express");

const {
  isLoggedIn,
  isAuthenticated,
  authorize,
  isSubscriptionActive,
} = require("../middlewares/auth.middleware");

const router = Router();

const ordersController = require("../controllers/orders.controller");
const {
  getOrders,
  getOrdersInit,
  updateKitchenOrderItemStatus,
  cancelKitchenOrder,
  completeKitchenOrder,
  getOrdersPaymentSummary,
  payAndCompleteKitchenOrder,
  initiateStripePayment,
} = ordersController;

const { SCOPES } = require("../config/user.config");

router.get(
  "/",
  isLoggedIn,
  isAuthenticated,
  isSubscriptionActive,
  authorize([
    SCOPES.POS,
    SCOPES.ORDERS,
    SCOPES.ORDER_STATUS,
    SCOPES.ORDER_STATUS_DISPLAY,
  ]),
  getOrders
);

router.get(
  "/init",
  isLoggedIn,
  isAuthenticated,
  isSubscriptionActive,
  authorize([
    SCOPES.POS,
    SCOPES.ORDERS,
    SCOPES.ORDER_STATUS,
    SCOPES.ORDER_STATUS_DISPLAY,
  ]),
  getOrdersInit
);

router.post(
  "/update-status/:id",
  isLoggedIn,
  isAuthenticated,
  isSubscriptionActive,
  authorize([
    SCOPES.POS,
    SCOPES.ORDERS,
    SCOPES.ORDER_STATUS,
    SCOPES.ORDER_STATUS_DISPLAY,
  ]),
  updateKitchenOrderItemStatus
);

router.post(
  "/cancel",
  isLoggedIn,
  isAuthenticated,
  isSubscriptionActive,
  authorize([
    SCOPES.POS,
    SCOPES.ORDERS,
    SCOPES.ORDER_STATUS,
    SCOPES.ORDER_STATUS_DISPLAY,
  ]),
  cancelKitchenOrder
);

router.post(
  "/complete",
  isLoggedIn,
  isAuthenticated,
  isSubscriptionActive,
  authorize([
    SCOPES.POS,
    SCOPES.ORDERS,
    SCOPES.ORDER_STATUS,
    SCOPES.ORDER_STATUS_DISPLAY,
  ]),
  completeKitchenOrder
);

router.post(
  "/complete-order-payment-summary",
  isLoggedIn,
  isAuthenticated,
  isSubscriptionActive,
  authorize([
    SCOPES.POS,
    SCOPES.ORDERS,
    SCOPES.ORDER_STATUS,
    SCOPES.ORDER_STATUS_DISPLAY,
  ]),
  getOrdersPaymentSummary
);

router.post(
  "/complete-and-pay-order",
  isLoggedIn,
  isAuthenticated,
  isSubscriptionActive,
  authorize([
    SCOPES.POS,
    SCOPES.ORDERS,
    SCOPES.ORDER_STATUS,
    SCOPES.ORDER_STATUS_DISPLAY,
  ]),
  payAndCompleteKitchenOrder
);


router.post(
  "/public/complete-and-pay-order",
  ordersController.payAndCompleteKitchenOrder
);

router.post("/stripe-checkout", ordersController.initiateStripePayment);
router.post("/stripe-success-complete", ordersController.payAndCompleteKitchenOrder);

module.exports = router;
