const { Router } = require("express");

const {
  isLoggedIn,
  isAuthenticated,
  authorize,
  isSubscriptionActive,
} = require("../middlewares/auth.middleware");
const { SCOPES } = require("../config/user.config");
const {
  getDashboardData,
  getDashboardEngine,
  getDashboardWidgets,
  getDashboardWidgetData,
  saveDashboardPreferences,
} = require("../controllers/dashboard.controller");

const router = Router();

router.get(
  "/",
  isLoggedIn,
  isAuthenticated,
  isSubscriptionActive,
  authorize([SCOPES.DASHBOARD]),
  getDashboardData
);

router.get(
  "/engine",
  isLoggedIn,
  isAuthenticated,
  isSubscriptionActive,
  authorize([SCOPES.DASHBOARD, SCOPES.REPORTS]),
  getDashboardEngine
);

router.get(
  "/widgets",
  isLoggedIn,
  isAuthenticated,
  isSubscriptionActive,
  authorize([SCOPES.DASHBOARD, SCOPES.REPORTS]),
  getDashboardWidgets
);

router.get(
  "/widget-data",
  isLoggedIn,
  isAuthenticated,
  isSubscriptionActive,
  authorize([SCOPES.DASHBOARD, SCOPES.REPORTS]),
  getDashboardWidgetData
);

router.put(
  "/preferences",
  isLoggedIn,
  isAuthenticated,
  isSubscriptionActive,
  authorize([SCOPES.DASHBOARD, SCOPES.REPORTS]),
  saveDashboardPreferences
);

module.exports = router;
