const express = require('express');
const router = express.Router();
const attendanceController = require('../controller/attendance.controller');

// Mark or update attendance
router.post('/attendance', attendanceController.markAttendance);

// Get students for a batch (useful for marking attendance UI)
router.get('/attendance/batch/:batchId/students', attendanceController.getBatchStudents);

// Get attendance history for a batch
router.get('/attendance/batch/:batchId', attendanceController.getBatchAttendance);

// Get stats for all instructors (checking instructors)
router.get('/attendance/instructors/stats', attendanceController.getInstructorStats);

// Get student attendance history
router.get('/attendance/student/:studentId', attendanceController.getStudentAttendance);

module.exports = router;
