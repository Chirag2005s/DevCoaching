const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    hasPurchasedCourse: {
        type: Boolean,
        default: false
    },
    purchasedCourses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }],
    enrolledBatches: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Batch'
    }],
    enrollmentNumber: {
        type: String,
        sparse: true
    },
    completedTopics: [{
        courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
        topics: [String]
    }],
    role: {
        type: String,
        enum: ['student', 'admin', 'superadmin'],
        default: 'student'
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
