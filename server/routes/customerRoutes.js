const express = require("express");

const router = express.Router();

const { addCustomer,getCustomers,updateCustomer,deleteCustomer } = require("../controllers/customerController");

router.post("/", addCustomer);
router.get("/", getCustomers);
router.put("/:id", updateCustomer);
router.delete("/:id", deleteCustomer);

module.exports = router;