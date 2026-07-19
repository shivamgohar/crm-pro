const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Get all services of one customer
// router.get("/customer/:customerId", async (req, res) => {

//     console.log("Service Route Hit");
//     try {

//         const { customerId } = req.params;

//         const result = await db.query(
//             `
//             SELECT *
//             FROM services
//             WHERE customer_id = $1
//             ORDER BY service_date DESC, id DESC
//             `,
//             [customerId]
//         );

//         res.json(result.rows);

//     } catch (error) {

//         console.error(error);

//         res.status(500).json({
//             message: "Failed to fetch services"
//         });

//     }
// });

router.get("/customer-code/:customerCode", async (req, res) => {
  try {
    const { customerCode } = req.params;

    const result = await db.query(
      `
      SELECT *
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

router.post("/", async (req, res) => {
  try {
    const {
      customer_id,
      service_date,
      service_type,
      engineer,
      remark,
      amount,
    } = req.body;

    const result = await db.query(
      `
      INSERT INTO services
      (
        customer_id,
        service_date,
        service_type,
        engineer,
        remark,
        amount
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
      `,
      [
        customer_id,
        service_date,
        service_type,
        engineer,
        remark,
        amount,
      ]
    );

    res.status(201).json({
      message: "Service added successfully",
      service: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to add service",
    });
  }
});

module.exports = router;
