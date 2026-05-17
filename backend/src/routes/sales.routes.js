const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesReport.controller');

// Routes
router.get('/sales-summary', salesController.getSalesSummary);
router.get('/sales-by-day', salesController.getSalesByDay);
router.get('/top-items', salesController.getTopItems);
router.get('/stock-by-category', salesController.getStockByCategory);

// New routes
// router.get('/monthly-transactions', salesController.getMonthlyTransactions);
router.get('/monthly-revenue', salesController.getMonthlyRevenueStats);
router.get('/sales-by-category', salesController.getSalesByCategory);
router.get('/sales-by-payment-mode', salesController.getSalesByPaymentMode);
router.get('/sales-per-hour', salesController.getSalesPerHour);
// router.get("/average-order-value", salesController.getAverageOrderValue);






module.exports = router;
