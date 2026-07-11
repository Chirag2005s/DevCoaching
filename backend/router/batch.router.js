const express = require("express");
const {
    getBatches, getBatchById, createBatch,
    updateBatch, deleteBatch, enrollBatch, getMyBatches
} = require("../controller/batch.controller.js");
const { verifyToken } = require("../middleware/auth.middleware.js");

const router = express.Router();
router.use(express.json());

router.get("/batches", getBatches);
router.get("/batches/my", verifyToken, getMyBatches);   // must be before /:id
router.get("/batches/:id", getBatchById);
router.post("/batches", createBatch);
router.put("/batches/:id", updateBatch);
router.delete("/batches/:id", deleteBatch);
router.patch("/batches/:id/enroll", verifyToken, enrollBatch); // protected

module.exports = router;
