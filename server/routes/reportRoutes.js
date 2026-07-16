const express = require("express");

const router = express.Router();

const {

    getReportSummary,
    downloadReportPDF,
    downloadReportExcel,

} = require("../controllers/reportController");

router.get("/", getReportSummary);

router.get("/pdf", downloadReportPDF);
router.get("/excel", downloadReportExcel);


module.exports = router;