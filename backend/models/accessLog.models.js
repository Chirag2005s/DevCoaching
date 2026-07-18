const mongoose = require('mongoose');

const accessLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        index: true
    },
    name: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        index: true
    },
    status: {
        type: String,
        enum: ['success', 'failed'],
        required: true,
        index: true
    },
    action: {
        type: String,
        enum: ['login', 'registration', 'logout'],
        required: true,
        index: true
    },
    reason: {
        type: String,
        trim: true
    },
    ipAddress: {
        type: String,
        trim: true
    },
    userAgent: {
        type: String,
        trim: true
    },
    deviceType: {
        type: String,
        enum: ['Mobile', 'Desktop', 'Tablet', 'Bot/Unknown'],
        required: true
    }
}, { 
    timestamps: true 
});

// Compound index or individual indices for fast filtering and sorting
accessLogSchema.index({ createdAt: -1 });
accessLogSchema.index({ email: 1, createdAt: -1 });
accessLogSchema.index({ action: 1, createdAt: -1 });
accessLogSchema.index({ status: 1, createdAt: -1 });

const AccessLog = mongoose.model('AccessLog', accessLogSchema);

module.exports = AccessLog;
