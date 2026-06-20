const express = require("express");
const { getExams, getExamById, createExam, deleteExam } = require('../controller/exam.controller.js');
const router = express.Router();

router.use(express.json());

router.get("/exams", getExams);
router.get("/exams/:id", getExamById);
router.post("/exams", createExam);
router.delete("/exams/:id", deleteExam);

module.exports = router;
