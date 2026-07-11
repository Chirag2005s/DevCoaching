const { Exam } = require('../models/exam.models.js');
const pdfParse = require('pdf-parse');
const { GoogleGenerativeAI } = require('@google/generative-ai');

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

// Generate questions from PDF using Gemini
const generateFromPdf = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No PDF file uploaded" });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ message: "GEMINI_API_KEY is not configured on the server." });
        }

        // Extract text from PDF
        const data = await pdfParse(req.file.buffer);
        const text = data.text;

        if (!text || text.trim().length === 0) {
            return res.status(400).json({ message: "Could not extract text from the PDF." });
        }

        // Initialize Gemini
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
Analyze the following text extracted from a PDF and generate 5 to 10 multiple-choice questions based on its content.
Return ONLY a valid JSON array of objects. Do not include any markdown formatting like \`\`\`json.
Each object MUST have the following structure:
{
    "questionText": "The question string",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctOptionIndex": 0, // integer representing the correct option (0-3)
    "explanation": "A short explanation of why this is the correct answer"
}

Here is the text:
${text.substring(0, 20000)}
        `;

        const result = await model.generateContent(prompt);
        let responseText = result.response.text();
        
        // Clean up response if it contains markdown formatting
        responseText = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
        
        const questions = JSON.parse(responseText);

        res.status(200).json({ questions });
    } catch (error) {
        console.error("PDF Generation Error:", error);
        res.status(500).json({ message: "Error generating questions: " + (error.message || "Unknown error") });
    }
};

// Generate questions from Image using Gemini
const generateFromImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No image file uploaded" });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ message: "GEMINI_API_KEY is not configured on the server." });
        }

        const mimeType = req.file.mimetype;
        if (!mimeType.startsWith('image/')) {
            return res.status(400).json({ message: "Uploaded file is not a valid image." });
        }

        const base64Image = req.file.buffer.toString("base64");

        // Initialize Gemini
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
Analyze this educational image (which may contain notes, diagrams, text, or infographics) and generate 5 to 10 multiple-choice questions based on the visual and text information present.
Return ONLY a valid JSON array of objects. Do not include any markdown formatting like \`\`\`json.
Each object MUST have the following structure:
{
    "questionText": "The question string",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctOptionIndex": 0, // integer representing the correct option (0-3)
    "explanation": "A short explanation of why this is the correct answer"
}
        `;

        const imagePart = {
            inlineData: {
                data: base64Image,
                mimeType: mimeType
            },
        };

        const result = await model.generateContent([prompt, imagePart]);
        let responseText = result.response.text();
        
        // Clean up response if it contains markdown formatting
        responseText = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
        
        const questions = JSON.parse(responseText);

        res.status(200).json({ questions });
    } catch (error) {
        console.error("Image Generation Error:", error);
        res.status(500).json({ message: "Error generating questions: " + (error.message || "Unknown error") });
    }
};

module.exports = {
    getExams,
    getExamById,
    createExam,
    deleteExam,
    generateFromPdf,
    generateFromImage
};
