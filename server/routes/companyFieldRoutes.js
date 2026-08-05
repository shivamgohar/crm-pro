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
      getImportCustomerFields,
      getDialogCustomerFields,
      getListCustomerFields,
} = require("../controllers/companyFieldController");

router.get("/all", getAllCustomerFields);

router.get("/import", getImportCustomerFields);

router.get(
    "/dialog",
    getDialogCustomerFields
);

router.get("/", getCustomerFields);

router.post("/", addCustomerField);

router.put("/reorder", reorderCustomerFields);

router.put("/:id", updateCustomerField);

router.put("/:id/restore", restoreCustomerField);

router.delete("/:id", hideCustomerField);

router.get("/list", getListCustomerFields);

module.exports = router;