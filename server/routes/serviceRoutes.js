const express = require("express");
const router = express.Router();
const db = require("../config/db");


const {
  addService,
  getCustomerSummary,
  updateService,
} = require("../controllers/serviceController");


router.get("/customer-code/:customerCode", async (req, res) => {
  try {
    const { customerCode } = req.params;
    //  console.log("Customer Code:", customerCode);

    const result = await db.query(
      `
     SELECT
    id,
    customer_code,
    service_date,
    service,
    engineer,
    remark,
    amount,
    received_amount,
    pending_amount,
    status,
    'CRM' AS source
FROM services
WHERE customer_code = $1

UNION ALL

SELECT
    id,
    customer_code,
    service_date,
    service,
    engineer,
    remark,
    amount,

    0 AS received_amount,
    0 AS pending_amount,
    'Imported' AS status,

    'EXCEL' AS source
FROM customers
WHERE customer_code = $1

ORDER BY service_date DESC;
      `,
      [customerCode]
    );

    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});


router.get(
    "/customer-summary/:customerCode",
    getCustomerSummary
);
router.put("/:id", updateService);

router.post("/", addService);

module.exports = router;
