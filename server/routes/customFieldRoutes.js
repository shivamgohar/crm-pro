const express = require("express");

const router = express.Router();

const {
  getCustomFields,
  addCustomField,
  updateCustomField,
  archiveCustomField,
  restoreCustomField,
  reorderCustomFields,
   getCustomFieldValues,
  saveCustomFieldValues,
} = require("../controllers/customFieldController");


router.get("/", getCustomFields);

router.get(
  "/values/:module/:recordId",
  getCustomFieldValues
);

router.put(
  "/values/:module/:recordId",
  saveCustomFieldValues
);

router.post("/", addCustomField);

router.put("/:id", updateCustomField);

router.patch("/:id/archive", archiveCustomField);

router.patch("/:id/restore", restoreCustomField);

router.patch("/reorder", reorderCustomFields);


module.exports = router;