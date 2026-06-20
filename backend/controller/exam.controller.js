const { Exam } = require('../models/exam.models.js');

// Get all exams
const getExams = async (req, res) => {
    try {
        const exams = await Exam.find().sort({ createdAt: -1 });
        res.status(200).json({ exams });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single exam by ID
const getExamById = async (req, res) => {
    try {
        const exam = await Exam.findById(req.params.id);
        if (!exam) {
            return res.status(404).json({ message: "Exam not found" });
        }
        res.status(200).json({ exam });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Create a new exam
const createExam = async (req, res) => {
    try {
        const { title, subject, duration, questions, totalMarks } = req.body;

        if (!title || !subject || !duration || !questions || !questions.length) {
            return res.status(400).json({ message: "Title, subject, duration, and at least one question are required" });
        }

        const newExam = new Exam({
            title,
            subject,
            duration,
            questions,
            totalMarks: totalMarks || (questions.length * 10)
        });

        await newExam.save();
        res.status(201).json({ message: "Exam created successfully", exam: newExam });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete an exam by ID
const deleteExam = async (req, res) => {
    try {
        const deletedExam = await Exam.findByIdAndDelete(req.params.id);
        if (!deletedExam) {
            return res.status(404).json({ message: "Exam not found" });
        }
        res.status(200).json({ message: "Exam deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getExams,
    getExamById,
    createExam,
    deleteExam
};
