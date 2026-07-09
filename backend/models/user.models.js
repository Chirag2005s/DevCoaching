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
    role: {
        type: String,
        enum: ['superadmin', 'admin', 'teacher', 'student'],
        default: 'student'
    },
    avatar: {
        type: String,
        default: ''
    },
    phone: {
        type: String,
        default: ''
    },
    location: {
        type: String,
        default: ''
    },
    bio: {
        type: String,
        default: ''
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    hasPurchasedCourse: {
        type: Boolean,
        default: false
    },
    purchasedCourses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }],
    lastLogin: {
        type: Date
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
