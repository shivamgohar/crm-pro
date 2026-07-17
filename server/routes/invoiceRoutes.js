const express = require("express");

const router = express.Router();

const { getInvoices ,downloadInvoicePDF} = require("../controllers/invoiceController");

router.get("/", getInvoices);
router.get("/pdf/:id", downloadInvoicePDF);

module.exports = router;