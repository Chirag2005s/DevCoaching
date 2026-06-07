// const mongoose = require("mongoose");
import mongoose from "mongoose";
const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
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
    }
}, { timestamps: true });

export const Course = mongoose.model("Course", courseSchema);