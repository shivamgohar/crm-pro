const express = require("express");
const router = express.Router();
const db = require("../config/db");


const {
  addService,
  getCustomerSummary,
  updateService,
  syncGoogleSheet
} = require("../controllers/serviceController");

const {
    saveGoogleSheetMapping,
    getGoogleSheetMapping,
} = require("../controllers/googleSheetController");


router.get("/customer-code/:customerCode", async (req, res) => {
  try {
    const { customerCode } = req.params;

    const result = await db.query(
      `
      SELECT
        s.id,
        s.customer_code,
        s.service_date,
        s.service,
        s.engineer,
        s.remark,
        s.amount,
        s.received_amount,
        s.pending_amount,
        s.status,

        CASE
          WHEN ces.service_id IS NOT NULL
            AND ces.source_type = 'google_sheet'
          THEN 'EXCEL'
          ELSE 'CRM'
        END AS source

      FROM services s

      LEFT JOIN customer_external_sources ces
        ON ces.service_id = s.id
        AND ces.source_type = 'google_sheet'

      WHERE s.customer_code = $1

      ORDER BY s.service_date DESC, s.id DESC;
      `,
      [customerCode]
    );

    res.json(result.rows);

  } catch (error) {
    console.error("Get customer services error:", error);
    res.status(500).json({
      message: "Server Error",
    });
  }
});

router.get(
  "/customer-summary/:customerCode",
  getCustomerSummary
);

router.post("/google-sync", syncGoogleSheet);

router.post(
    "/google-mapping",
    saveGoogleSheetMapping
);

router.get(
    "/google-mapping",
    getGoogleSheetMapping
);

router.put("/:id", updateService);

router.post("/", addService);

module.exports = router;
