const mongoose = require("mongoose");

const batchSchema = new mongoose.Schema({
    batchName: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    track: {
        type: String,
        required: true,
        enum: ["FRONTEND", "PYTHON", "BACKEND", "UI/UX", "FULL STACK", "ROBOTICS"]
    },
    instructor: {
        type: String,
        required: true,
        trim: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date
    },
    timings: {
        type: String,
        required: true,
        trim: true
    },
    maxSeats: {
        type: Number,
        default: 30,
        min: 1
    },
    enrolledCount: {
        type: Number,
        default: 0,
        min: 0
    },
    status: {
        type: String,
        enum: ["Upcoming", "Ongoing", "Completed"],
        default: "Upcoming"
    },
    meetLink: {
        type: String,
        trim: true,
        default: ""
    },
    description: {
        type: String,
        trim: true,
        default: ""
    }
}, { timestamps: true });

const Batch = mongoose.model("Batch", batchSchema);
module.exports = { Batch };
