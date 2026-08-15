const db = require("../config/db");

// ==========================================
// CHECK LOW STOCK NOTIFICATIONS
// ==========================================

const generateLowStockNotifications = async () => {
  try {

    // --------------------------------------
    // GET LOW STOCK SETTINGS
    // --------------------------------------

    const settingsResult = await db.query(`
      SELECT
        nt.id AS notification_type_id,
        ns.enabled,
        ns.threshold,
        ns.priority
      FROM notification_types nt
      JOIN notification_settings ns
        ON ns.notification_type_id = nt.id
      WHERE nt.key = 'low_stock'
      LIMIT 1
    `);

    if (settingsResult.rows.length === 0) {
      return;
    }

    const settings = settingsResult.rows[0];

    // --------------------------------------
    // DISABLED
    // --------------------------------------

    if (!settings.enabled) {
      return;
    }

    // --------------------------------------
    // VALIDATE THRESHOLD
    // --------------------------------------

    if (
      settings.threshold === null ||
      settings.threshold === undefined
    ) {
      return;
    }

    const threshold = Number(
      settings.threshold
    );

    // --------------------------------------
    // GET ALL PRODUCTS
    // --------------------------------------

    const productsResult = await db.query(`
      SELECT
        id,
        name,
        stock
      FROM products
    `);

    // --------------------------------------
    // PROCESS PRODUCTS
    // --------------------------------------

    for (const product of productsResult.rows) {

      const isLowStock =
        Number(product.stock) <= threshold;

      // ====================================
      // LOW STOCK
      // ====================================

      if (isLowStock) {

        // Find existing ACTIVE alert
        const existingResult = await db.query(
          `
          SELECT id
          FROM notifications
          WHERE notification_type_id = $1
            AND reference_type = 'product'
            AND reference_id = $2
            AND is_active = true
          LIMIT 1
          `,
          [
            settings.notification_type_id,
            product.id,
          ]
        );

        // Already active
        if (existingResult.rows.length > 0) {
          continue;
        }

        // ----------------------------------
        // CREATE NEW ALERT
        // ----------------------------------

        await db.query(
          `
          INSERT INTO notifications (
            notification_type_id,
            title,
            message,
            priority,
            is_read,
            reference_type,
            reference_id,
            is_active
          )
          VALUES (
            $1,
            $2,
            $3,
            $4,
            false,
            $5,
            $6,
            true
          )
          `,
          [
            settings.notification_type_id,

            "Low Stock",

            `${product.name} stock is low. Current stock: ${product.stock}.`,

            settings.priority || "normal",

            "product",

            product.id,
          ]
        );

        continue;
      }

      // ====================================
      // STOCK RECOVERED
      // ====================================

      await db.query(
        `
        UPDATE notifications
        SET
          is_active = false,
          resolved_at = CURRENT_TIMESTAMP
        WHERE notification_type_id = $1
          AND reference_type = 'product'
          AND reference_id = $2
          AND is_active = true
        `,
        [
          settings.notification_type_id,
          product.id,
        ]
      );
    }

  } catch (error) {

    console.error(
      "Low Stock Notification Error:",
      error
    );

    throw error;
  }
};


module.exports = {
  generateLowStockNotifications,
};