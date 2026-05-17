// backend/src/routes/ceo.routes.js
const router = require("express").Router();
const ctrl = require("../controllers/ceo.controller");

// All endpoints accept: ?tenantId=&start=&end=&tz=&period=
router.get("/kpis", ctrl.getKpis);
router.get("/revenue-daily", ctrl.getRevenueDaily);
router.get("/sales-by-category", ctrl.getSalesByCategory);
router.get("/top-items", ctrl.getTopItems);
router.get("/payment-mix", ctrl.getPaymentMix);
router.get("/order-funnel", ctrl.getOrderFunnel);
router.get("/hourly-today", ctrl.getHourlyToday);
router.get("/customer-metrics", ctrl.getCustomerMetrics);
router.get("/feedback", ctrl.getFeedback);
router.get("/inventory/low-stock", ctrl.getLowStock);
router.get("/employee/attendance", ctrl.getAttendance);

// 4.4 CEO additions — use **ctrl** (not controller)
router.get("/revenue-expenses", ctrl.revenueExpenses);
router.get("/profit-margins", ctrl.profitMarginsByCategory);
router.get("/employee-performance", ctrl.employeePerformanceDetailed);
router.get("/financial-summaries", ctrl.financialSummaries);
router.get("/customer-feedback", ctrl.customerFeedbackList);
router.get("/operational-efficiency", ctrl.operationalEfficiency);

module.exports = router;
