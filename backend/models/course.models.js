const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    Language: {
        type: String,
        required: true,
        enum: ['FRONTEND', 'PYTHON', 'BACKEND', 'UI/UX', 'FULL STACK', 'ROBOTICS']
    },
    courseName: {
        type: String,
        required: true,
        unique: true,
    },
    Disp: {
        type: String,
        required: true
    },
    Price: {
        type: Number,
        required: true
    },
    CourseStatus: {
        type: String,
        enum: ['Free', 'Paid']
    },
    Topics: {
        type: [String],
        default: []
    }
}, { timestamps: true });

const Course = mongoose.model("Course", courseSchema);
module.exports = { Course };