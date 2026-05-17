const express = require("express");
const { createConnectionToken, createPaymentIntent } = require("../controllers/terminal.controller");

const router = express.Router();

router.post("/connection-token", createConnectionToken);
router.post("/create-payment-intent", createPaymentIntent);

module.exports = router;
