const express = require("express");

const router = express.Router();

const {
  getInventory,
  updateStock,
  addStock,
  removeStock,
} = require("../controllers/inventoryController");

router.get("/", getInventory);
router.put("/:id", updateStock);
router.put("/add/:id", addStock);
router.put("/remove/:id", removeStock);

module.exports = router;