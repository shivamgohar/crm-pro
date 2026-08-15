const express = require("express");

const router = express.Router();

const {
  getNotificationSettings,
  updateNotificationSettings,
  getNotifications,
  markNotificationAsRead
} = require("../controllers/notificationController");




const {
  generateLowStockNotifications,
} = require("../services/notificationService");


// ==========================================
// TEST / RUN NOTIFICATION ENGINE
// ==========================================

router.post(
  "/check",
  async (req, res) => {
    try {
      await generateLowStockNotifications();

      return res.json({
        success: true,
        message: "Notification check completed.",
      });

    } catch (error) {
      console.error(
        "Notification Check Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Notification check failed.",
        error: error.message,
      });
    }
  }
);

// GET NOTIFICATIONS
router.get(
  "/",
  getNotifications
);


// GET SETTINGS
router.get(
  "/settings",
  getNotificationSettings
);


// UPDATE SETTINGS
router.put(
  "/settings",
  updateNotificationSettings
);

// MARK AS READ
router.put(
  "/:id/read",
  markNotificationAsRead
);


module.exports = router;