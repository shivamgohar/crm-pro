const express = require("express");

const router = express.Router();


const {
    getStatuses,
    createStatus,
    updateStatus,
    deleteStatus,
    restoreStatus,
    archiveStatus,
    reorderStatus,
} = require("../controllers/companyStatusController");

router.get("/", getStatuses);
router.post("/", createStatus);

router.put("/reorder", reorderStatus);   // ✅ Sabse pehle

router.put("/:id/archive", archiveStatus);
router.put("/:id/restore", restoreStatus);

router.put("/:id", updateStatus);

router.delete("/:id", deleteStatus);


module.exports = router;