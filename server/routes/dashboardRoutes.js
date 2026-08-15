const express = require("express");

const router = express.Router();

const {
  getDashboard,
  getDashboardWidgetSettings,
  updateDashboardWidgetSettings,
} = require("../controllers/dashboardController");


// ==========================================
// DASHBOARD WIDGET SETTINGS
// ==========================================

router.get(
  "/widgets",
  getDashboardWidgetSettings
);

router.put(
  "/widgets",
  updateDashboardWidgetSettings
);


// ==========================================
// DASHBOARD
// ==========================================

router.get(
  "/",
  getDashboard
);


module.exports = router;