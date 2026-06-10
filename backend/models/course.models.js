// const mongoose = require("mongoose");
import mongoose from "mongoose";
const courseSchema = new mongoose.Schema({
    Language: {
        type: String,
        required: true,
        eum: ['FRONTEND', 'PYTHON', 'BACKEND', 'UI/UX', 'FULL STACK', 'ROBOTICS'],
        unique: true
    },
    courseName: {
        type: String,
        required: true,
        unique: true,
    },
    Disp: {
        type: String,
        required: true,
        unique: true
    },
    Price: {
        type: Number,
        required: true,
        unique: true
    },
    CourseStatus: {
        type: String,
        eum: ['Free', 'Paid']
    }
}, { timestamps: true });

export const Course = mongoose.model("Course", courseSchema);