const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
    questionText: {
        type: String,
        required: true
    },
    options: {
        type: [String],
        required: true
    },
    correctOptionIndex: {
        type: Number,
        required: true
    },
    explanation: {
        type: String,
        default: ""
    }
});

const examSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    questions: {
        type: [questionSchema],
        required: true
    },
    totalMarks: {
        type: Number,
        default: 100
    }
}, { timestamps: true });

const Exam = mongoose.model("Exam", examSchema);

module.exports = { Exam };
