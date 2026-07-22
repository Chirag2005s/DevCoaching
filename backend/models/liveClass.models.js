const mongoose = require('mongoose');

const liveClassSchema = new mongoose.Schema({
    topic: {
        type: String,
        required: true,
        trim: true
    },
    mentor: {
        type: String,
        required: true,
        trim: true
    },
    track: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String, // Core Lecture, Hands-on Workshop, Advanced Topic, etc.
        required: true
    },
    dayOfWeek: {
        type: String,
        enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        required: true
    },
    time: {
        type: String, // e.g., "7:00 PM - 9:00 PM"
        required: true
    },
    meetingLink: {
        type: String,
        required: false
    },
    status: {
        type: String,
        enum: ["Scheduled", "Live", "Completed", "Cancelled"],
        default: "Scheduled"
    },
    isActiveNow: {
        type: Boolean,
        default: false
    },
    description: {
        type: String,
        required: false
    },
    prerequisites: [{
        type: String
    }],
    materials: {
        github: { type: String },
        notes: { type: String }
    }
}, { timestamps: true });

const LiveClass = mongoose.model('LiveClass', liveClassSchema);
module.exports = { LiveClass };
