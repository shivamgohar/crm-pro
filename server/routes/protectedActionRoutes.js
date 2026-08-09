const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const db = require("../config/db");
const authenticateToken = require("../middleware/authMiddleware");
const authenticateCleanupToken = require("../middleware/cleanupAuthMiddleware");

const router = express.Router();

router.post(
  "/verify-password",
  authenticateToken,
  async (req, res) => {
    try {
      const { password } = req.body;

      if (!password) {
        return res.status(400).json({
          success: false,
          message: "Password is required",
        });
      }

      const result = await db.query(
        "SELECT password FROM users WHERE id=$1",
        [req.user.id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const user = result.rows[0];

      const isMatch = await bcrypt.compare(
        password,
        user.password
      );

      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid Password",
        });
      }

   const cleanupToken = jwt.sign(
  {
    id: req.user.id,
    email: req.user.email,
    purpose: "cleanup-imported-data",
  },
  process.env.JWT_SECRET,
  {
    expiresIn: "5m",
  }
);

return res.json({
  success: true,
  message: "Password verified successfully",
  cleanupToken,
});
    } catch (error) {
      console.error("Password verification error:", error);

      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  }
);

router.post(
  "/cleanup-imported-data",
  authenticateCleanupToken,
  async (req, res) => {
    const client = await db.connect();

    try {
      await client.query("BEGIN");

      const importedCustomers = await client.query(`
        SELECT c.id
        FROM customers c
        WHERE c.source IN ('excel', 'google_sheet')
          AND NOT EXISTS (
            SELECT 1
            FROM orders o
            WHERE o.customer_id = c.id
          )
        FOR UPDATE
      `);

      const customerIds = importedCustomers.rows.map(
        (row) => row.id
      );

      let deletedCount = 0;

      if (customerIds.length > 0) {
        const deleteResult = await client.query(
          `
          DELETE FROM customers
          WHERE id = ANY($1::int[])
          `,
          [customerIds]
        );

        deletedCount = deleteResult.rowCount;
      }

      const skippedResult = await client.query(`
        SELECT COUNT(*) AS count
        FROM customers c
        WHERE c.source IN ('excel', 'google_sheet')
          AND EXISTS (
            SELECT 1
            FROM orders o
            WHERE o.customer_id = c.id
          )
      `);

      const skippedCount = Number(
        skippedResult.rows[0].count
      );

      await client.query("COMMIT");

      return res.json({
        success: true,
        message: "Imported data cleanup completed",
        deletedCustomers: deletedCount,
        skippedCustomersWithOrders: skippedCount,
      });
    } catch (error) {
      await client.query("ROLLBACK");

      console.error(
        "Imported data cleanup error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Cleanup failed",
      });
    } finally {
      client.release();
    }
  }
);

module.exports = router;