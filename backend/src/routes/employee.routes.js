const { Router } = require("express");
const {
  addEmployees,
  getEmployeesList,
  getEmployeeById,
  updateEmployeesList,
  deleteEmployeesList,
  updateProfilePicture,
  addEmployeeFeedback,
  getFeedbackByEmployeeId
} = require("../controllers/employee.controller");

const {
  isLoggedIn,
  isAuthenticated,
  isSubscriptionActive,
  authorize
} = require("../middlewares/auth.middleware");

const { ensureTenant } = require("../middlewares/tenant.middleware");
const { SCOPES } = require("../config/user.config");

const router = Router();

// --- Non-param routes FIRST (very important) ---

// Create (tenant-scoped)
router.post(
  "/add",
  isLoggedIn, isAuthenticated, isSubscriptionActive, authorize([SCOPES.HRM]),
  ensureTenant,
  addEmployees
);

// List (tenant-scoped)
router.get(
  "/",
  isLoggedIn, isAuthenticated, isSubscriptionActive, authorize([SCOPES.HRM]),
  ensureTenant,
  getEmployeesList
);

// Feedback ADD (tenant-scoped)  <-- MUST be before "/:employeeId"
router.post(
  "/feedback",
  isLoggedIn, isAuthenticated, isSubscriptionActive, authorize([SCOPES.HRM]),
  ensureTenant,
  addEmployeeFeedback
);

// --- Param routes AFTER ---

// Feedback LIST by employee (tenant-scoped)
router.get(
  "/:employeeId/feedback",
  isLoggedIn, isAuthenticated, isSubscriptionActive, authorize([SCOPES.HRM]),
  ensureTenant,
  getFeedbackByEmployeeId
);

// Read one (tenant-scoped)
router.get(
  "/:employeeId",
  isLoggedIn, isAuthenticated, isSubscriptionActive, authorize([SCOPES.HRM]),
  ensureTenant,
  getEmployeeById
);

// Update (tenant-scoped)
router.put(
  "/:employeeId",
  isLoggedIn, isAuthenticated, isSubscriptionActive, authorize([SCOPES.HRM]),
  ensureTenant,
  updateEmployeesList
);

// Delete (tenant-scoped)
router.delete(
  "/:employeeId",
  isLoggedIn, isAuthenticated, isSubscriptionActive, authorize([SCOPES.HRM]),
  ensureTenant,
  deleteEmployeesList
);

// Update image (kept for compatibility)
router.post(
  "/:employeeId/update-image",
  isLoggedIn, isAuthenticated, isSubscriptionActive, authorize([SCOPES.HRM]),
  ensureTenant,
  updateProfilePicture
);

module.exports = router;
