const User = require('../models/user.models');
const { Teacher } = require('../models/teacher.models');
const { Course } = require('../models/course.models');
const { Batch } = require('../models/batch.models');
const { Attendance } = require('../models/attendance.models');
const { Review } = require('../models/review.models');

const getStats = async (req, res) => {
    try {
        const [
            totalStudents,
            totalTeachers,
            totalCourses,
            totalBatches,
            activeBatches,
            upcomingBatches,
            completedBatches,
            totalAttendanceRecords,
            recentStudents,
            recentBatches,
            reviews,
            teachers
        ] = await Promise.all([
            User.countDocuments(),
            Teacher.countDocuments(),
            Course.countDocuments(),
            Batch.countDocuments(),
            Batch.countDocuments({ status: 'Ongoing' }),
            Batch.countDocuments({ status: 'Upcoming' }),
            Batch.countDocuments({ status: 'Completed' }),
            Attendance.countDocuments(),
            User.find().sort({ createdAt: -1 }).limit(5).select('name email createdAt enrollmentNumber hasPurchasedCourse'),
            Batch.find().sort({ createdAt: -1 }).limit(5).populate('courseId', 'courseName').select('batchName track status instructor createdAt'),
            Review.find().select('rating'),
            Teacher.find().select('Name Status Rating').limit(5)
        ]);

        const avgRating = reviews.length > 0
            ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
            : 0;

        res.status(200).json({
            success: true,
            stats: {
                totalStudents,
                totalTeachers,
                totalCourses,
                totalBatches,
                activeBatches,
                upcomingBatches,
                completedBatches,
                totalAttendanceRecords,
                avgRating: parseFloat(avgRating),
                totalReviews: reviews.length
            },
            recentStudents,
            recentBatches,
            teachers
        });
    } catch (error) {
        console.error('Stats Error:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

const getStudents = async (req, res) => {
    try {
        const students = await User.find().sort({ createdAt: -1 }).select('-password');
        res.status(200).json({ success: true, students });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteStudent = async (req, res) => {
    try {
        const deleted = await User.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ success: false, message: 'Student not found' });
        res.status(200).json({ success: true, message: 'Student deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getStats, getStudents, deleteStudent };
