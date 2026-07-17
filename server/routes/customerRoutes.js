const express = require("express");

const router = express.Router();

const {
    addCustomer,
    getCustomers,
    updateCustomer,
    deleteCustomer,
    importCustomers
} = require("../controllers/customerController");

const upload = require("../middleware/upload");

router.post("/", addCustomer);

router.post(
    "/import",
    upload.single("file"),
    importCustomers
);


router.get("/", getCustomers);
router.put("/:id", updateCustomer);
router.delete("/:id", deleteCustomer);


module.exports = router;