const db = require("../config/db");

// ==========================================
// GET NOTIFICATION SETTINGS
// ==========================================

const getNotificationSettings = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        nt.key,
        nt.name,
        nt.description,
        nt.category,
        ns.enabled,
        ns.threshold,
        ns.days_before,
        ns.priority
      FROM notification_types nt
      LEFT JOIN notification_settings ns
        ON ns.notification_type_id = nt.id
      ORDER BY nt.id
    `);

    return res.json({
      success: true,
      settings: result.rows,
    });

  } catch (error) {
    console.error(
      "Get Notification Settings Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to load notification settings.",
      error: error.message,
    });
  }
};


// ==========================================
// UPDATE NOTIFICATION SETTINGS
// ==========================================

const updateNotificationSettings = async (req, res) => {
  try {
    const { settings } = req.body;

    if (!Array.isArray(settings)) {
      return res.status(400).json({
        success: false,
        message: "Notification settings are required.",
      });
    }

    for (const setting of settings) {

      if (!setting.key) {
        continue;
      }

      await db.query(
        `
        UPDATE notification_settings ns
        SET
          enabled = COALESCE($2, ns.enabled),
          threshold = $3,
          days_before = $4,
          priority = COALESCE($5, ns.priority),
          updated_at = CURRENT_TIMESTAMP
        FROM notification_types nt
        WHERE ns.notification_type_id = nt.id
          AND nt.key = $1
        `,
        [
          setting.key,
          typeof setting.enabled === "boolean"
            ? setting.enabled
            : null,
          setting.threshold ?? null,
          setting.days_before ?? null,
          setting.priority ?? null,
        ]
      );
    }

    return res.json({
      success: true,
      message:
        "Notification settings updated successfully.",
    });

  } catch (error) {
    console.error(
      "Update Notification Settings Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update notification settings.",
      error: error.message,
    });
  }
};
// ==========================================
// GET NOTIFICATIONS
// ==========================================

const getNotifications = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        n.id,
        n.title,
        n.message,
        n.priority,
        n.is_read,
        n.reference_type,
        n.reference_id,
        n.created_at,
        nt.key AS notification_key,
        nt.name AS notification_type
      FROM notifications n
      LEFT JOIN notification_types nt
        ON nt.id = n.notification_type_id
      ORDER BY n.created_at DESC
      LIMIT 20
    `);

    const unreadResult = await db.query(`
      SELECT COUNT(*) AS count
      FROM notifications
      WHERE is_read = false
    `);

    return res.json({
      success: true,
      notifications: result.rows,
      unreadCount: Number(
        unreadResult.rows[0].count
      ),
    });

  } catch (error) {
    console.error(
      "Get Notifications Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to load notifications.",
      error: error.message,
    });
  }
};


// ==========================================
// MARK NOTIFICATION AS READ
// ==========================================

const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(
      `
      UPDATE notifications
      SET is_read = true
      WHERE id = $1
      `,
      [id]
    );

    return res.json({
      success: true,
      message: "Notification marked as read.",
    });

  } catch (error) {
    console.error(
      "Mark Notification Read Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update notification.",
      error: error.message,
    });
  }
};

module.exports = {
  getNotificationSettings,
  updateNotificationSettings,
  getNotifications,
  markNotificationAsRead,
};