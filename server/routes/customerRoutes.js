const express = require("express");

const router = express.Router();

const {
  addCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  importCustomersLegacy,
  importCustomers,
  getTrashedCustomers,
  moveCustomersToTrash,
  restoreCustomers,
  permanentlyDeleteCustomers,
  getActiveCustomersForTrash,
} = require("../controllers/customerController");

const authenticateToken = require("../middleware/authMiddleware");

// ------------------------------------
// Customers
// ------------------------------------

router.post(
  "/",
  authenticateToken,
  addCustomer
);

router.post(
  "/import",
  authenticateToken,
  importCustomers
);

router.get(
  "/",
  authenticateToken,
  getCustomers
);

// ------------------------------------
// Trash
// ------------------------------------

router.get(
  "/trash",
  authenticateToken,
  getTrashedCustomers
);

router.get(
  "/trash/active",
  authenticateToken,
  getActiveCustomersForTrash
);

router.post(
  "/trash",
  authenticateToken,
  moveCustomersToTrash
);

router.put(
  "/trash/restore",
  authenticateToken,
  restoreCustomers
);

router.delete(
  "/trash/permanent",
  authenticateToken,
  permanentlyDeleteCustomers
);

// ------------------------------------
// Customer by ID
// ------------------------------------

router.get(
  "/code/:customerCode",
  authenticateToken,
  getCustomerById
);

router.get(
  "/:id",
  authenticateToken,
  getCustomerById
);

router.put(
  "/:id",
  authenticateToken,
  updateCustomer
);

router.delete(
  "/:id",
  authenticateToken,
  deleteCustomer
);

module.exports = router;