const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false // If null, it's a global notification
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        enum: ["info", "success", "warning", "error", "attendance", "system"],
        default: "info"
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// Create a compound index to quickly find unread notifications for a user
notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = { Notification };
