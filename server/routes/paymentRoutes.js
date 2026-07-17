const express = require("express");

const router = express.Router();

const { getPayments,addPayment } = require("../controllers/paymentController");

// Get All Payments
router.get("/", getPayments);
router.post("/", addPayment);

module.exports = router;