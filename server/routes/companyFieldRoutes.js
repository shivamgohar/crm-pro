const express = require("express");

const router = express.Router();

const {
    getCustomerFields,
     addCustomerField,
     updateCustomerField,
      hideCustomerField,
      reorderCustomerFields,
      getAllCustomerFields,
      restoreCustomerField,
} = require("../controllers/companyFieldController");

router.get("/all", getAllCustomerFields);

router.get("/", getCustomerFields);

router.post("/", addCustomerField);

router.put("/reorder", reorderCustomerFields);

router.put("/:id", updateCustomerField);

router.put("/:id/restore", restoreCustomerField);

router.delete("/:id", hideCustomerField);

module.exports = router;