const express = require("express");
const multer = require("multer");
const { getExams, getExamById, createExam, deleteExam, generateFromPdf, generateFromImage } = require('../controller/exam.controller.js');

const router = express.Router();

// Set up multer for memory storage (for processing PDF before saving/discarding)
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

router.use(express.json());

router.get("/exams", getExams);
router.get("/exams/:id", getExamById);
router.post("/exams", createExam);
router.delete("/exams/:id", deleteExam);

// New endpoint for PDF generation
router.post("/exams/generate-from-pdf", upload.single('pdf'), generateFromPdf);

// New endpoint for Image generation
router.post("/exams/generate-from-image", upload.single('image'), generateFromImage);

module.exports = router;
