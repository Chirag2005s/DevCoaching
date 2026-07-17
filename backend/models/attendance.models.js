const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
    batchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Batch",
        required: true
    },
    instructorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher",
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    records: [{
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        status: {
            type: String,
            enum: ["Present", "Absent", "Late"],
            default: "Present"
        }
    }],
    notes: {
        type: String,
        default: "",
        trim: true
    }
}, { timestamps: true });

const Attendance = mongoose.model("Attendance", attendanceSchema);
module.exports = { Attendance };
