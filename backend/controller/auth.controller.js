const User = require('../models/user.models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendLoginEmail } = require('../utils/email');
const AccessLog = require('../models/accessLog.models');

function getDeviceType(userAgentString) {
    if (!userAgentString) return 'Bot/Unknown';
    const ua = userAgentString.toLowerCase();
    if (ua.includes('bot') || ua.includes('crawler') || ua.includes('spider')) {
        return 'Bot/Unknown';
    }
    if (ua.includes('ipad') || (ua.includes('android') && !ua.includes('mobile'))) {
        return 'Tablet';
    }
    if (ua.includes('iphone') || ua.includes('mobile') || ua.includes('ipod')) {
        return 'Mobile';
    }
    return 'Desktop';
}

async function recordAccessLog({ req, email, name, userId, action, status, reason }) {
    try {
        const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress || '127.0.0.1';
        const userAgent = req.headers['user-agent'] || 'Unknown';
        const deviceType = getDeviceType(userAgent);
        
        await AccessLog.create({
            userId,
            name,
            email,
            status,
            action,
            reason,
            ipAddress,
            userAgent,
            deviceType
        });
    } catch (error) {
        console.error("Failed to record access log:", error);
    }
}

// Register a new user
exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this email" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: role || 'student'
        });

        await newUser.save();

        // Create JWT token
        const token = jwt.sign(
            { id: newUser._id, email: newUser.email, hasPurchasedCourse: newUser.hasPurchasedCourse, purchasedCourses: newUser.purchasedCourses || [], enrollmentNumber: newUser.enrollmentNumber, completedTopics: [], role: newUser.role },
            process.env.JWT_SECRET || 'devcoaching_secret_key',
            { expiresIn: '7d' }
        );

        // Record successful registration log
        await recordAccessLog({
            req,
            email: newUser.email,
            name: newUser.name,
            userId: newUser._id,
            action: 'registration',
            status: 'success'
        });

        res.status(201).json({
            message: "User registered successfully",
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                hasPurchasedCourse: newUser.hasPurchasedCourse,
                purchasedCourses: newUser.purchasedCourses || [],
                enrollmentNumber: newUser.enrollmentNumber,
                completedTopics: [],
                role: newUser.role
            }
        });

    } catch (error) {
        console.error("Register Error:", error);
        // Record failed registration
        await recordAccessLog({
            req,
            email: req.body.email || 'unknown',
            name: req.body.name || 'Unknown',
            userId: null,
            action: 'registration',
            status: 'failed',
            reason: error.message || 'unknown_error'
        });
        res.status(500).json({ message: "Server error during registration", error: error.message });
    }
};

// Login user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ message: "Please provide email and password" });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            await recordAccessLog({
                req,
                email,
                name: 'Unknown',
                userId: null,
                action: 'login',
                status: 'failed',
                reason: 'user_not_found'
            });
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            await recordAccessLog({
                req,
                email: user.email,
                name: user.name,
                userId: user._id,
                action: 'login',
                status: 'failed',
                reason: 'invalid_password'
            });
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Create JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email, hasPurchasedCourse: user.hasPurchasedCourse, purchasedCourses: user.purchasedCourses || [], enrollmentNumber: user.enrollmentNumber, completedTopics: user.completedTopics || [], role: user.role },
            process.env.JWT_SECRET || 'devcoaching_secret_key',
            { expiresIn: '7d' }
        );

        // Send login notification email (non-blocking)
        sendLoginEmail(user.email, user.name);

        // Record successful login
        await recordAccessLog({
            req,
            email: user.email,
            name: user.name,
            userId: user._id,
            action: 'login',
            status: 'success'
        });

        res.status(200).json({
            message: "Logged in successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                hasPurchasedCourse: user.hasPurchasedCourse,
                purchasedCourses: user.purchasedCourses || [],
                enrollmentNumber: user.enrollmentNumber,
                completedTopics: user.completedTopics || [],
                role: user.role
            }
        });

    } catch (error) {
        console.error("Login Error:", error);
        await recordAccessLog({
            req,
            email: req.body.email || 'unknown',
            name: 'Unknown',
            userId: null,
            action: 'login',
            status: 'failed',
            reason: error.message || 'unknown_error'
        });
        res.status(500).json({ message: "Server error during login", error: error.message });
    }
};

// Purchase course (Mock)
exports.purchaseCourse = async (req, res) => {
    try {
        const userId = req.user.id;
        const { courseId } = req.body;
        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        user.hasPurchasedCourse = true;
        
        if (!user.enrollmentNumber) {
            // Auto-generate an enrollment number: DEV + 6 random digits
            user.enrollmentNumber = "DEV" + Math.floor(100000 + Math.random() * 900000).toString();
        }
        
        if (courseId) {
            if (!user.purchasedCourses) {
                user.purchasedCourses = [];
            }
            if (!user.purchasedCourses.includes(courseId)) {
                user.purchasedCourses.push(courseId);
            }
        }
        
        await user.save();
        
        // Return new token
        const token = jwt.sign(
            { id: user._id, email: user.email, hasPurchasedCourse: user.hasPurchasedCourse, purchasedCourses: user.purchasedCourses, enrollmentNumber: user.enrollmentNumber, completedTopics: user.completedTopics || [], role: user.role },
            process.env.JWT_SECRET || 'devcoaching_secret_key',
            { expiresIn: '7d' }
        );
        
        res.status(200).json({
            message: "Course purchased successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                hasPurchasedCourse: user.hasPurchasedCourse,
                purchasedCourses: user.purchasedCourses,
                enrollmentNumber: user.enrollmentNumber,
                completedTopics: user.completedTopics || []
            }
        });
    } catch (error) {
        console.error("Purchase Error:", error);
        res.status(500).json({ message: "Server error during purchase", error: error.message });
    }
};

// Toggle Topic completion progress
exports.updateProgress = async (req, res) => {
    try {
        const userId = req.user.id;
        const { courseId, topic } = req.body;

        if (!courseId || !topic) {
            return res.status(400).json({ message: "Course ID and Topic are required" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.completedTopics) {
            user.completedTopics = [];
        }

        let courseProgress = user.completedTopics.find(cp => cp.courseId.toString() === courseId.toString());
        if (!courseProgress) {
            courseProgress = { courseId, topics: [] };
            user.completedTopics.push(courseProgress);
        }

        const topicIndex = courseProgress.topics.indexOf(topic);
        if (topicIndex > -1) {
            courseProgress.topics.splice(topicIndex, 1);
        } else {
            courseProgress.topics.push(topic);
        }

        await user.save();

        const token = jwt.sign(
            { id: user._id, email: user.email, hasPurchasedCourse: user.hasPurchasedCourse, purchasedCourses: user.purchasedCourses, enrollmentNumber: user.enrollmentNumber, completedTopics: user.completedTopics, role: user.role },
            process.env.JWT_SECRET || 'devcoaching_secret_key',
            { expiresIn: '7d' }
        );

        res.status(200).json({
            message: "Progress updated successfully",
            token,
            completedTopics: user.completedTopics
        });
    } catch (error) {
        console.error("Update Progress Error:", error);
        res.status(500).json({ message: "Server error during progress update", error: error.message });
    }
};
