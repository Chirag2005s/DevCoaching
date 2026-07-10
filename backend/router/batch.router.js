const express = require("express");
const {
    getBatches, getBatchById, createBatch,
    updateBatch, deleteBatch, enrollBatch
} = require("../controller/batch.controller.js");

const router = express.Router();
router.use(express.json());

router.get("/batches", getBatches);
router.get("/batches/:id", getBatchById);
router.post("/batches", createBatch);
router.put("/batches/:id", updateBatch);
router.delete("/batches/:id", deleteBatch);
router.patch("/batches/:id/enroll", enrollBatch);

module.exports = router;
