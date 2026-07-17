const { Attendance } = require("../models/attendance.models");
const User = require("../models/user.models");
const { Batch } = require("../models/batch.models");
const { Teacher } = require("../models/teacher.models");
const mongoose = require("mongoose");

// Mark or update attendance for a batch
const markAttendance = async (req, res) => {
    try {
        const { batchId, instructorId, date, records, notes } = req.body;

        if (!batchId || !instructorId || !date || !records) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        // Check if attendance already exists for this batch on this date
        const startOfDay = new Date(date);
        startOfDay.setUTCHours(0, 0, 0, 0);
        
        const endOfDay = new Date(date);
        endOfDay.setUTCHours(23, 59, 59, 999);

        let attendance = await Attendance.findOne({
            batchId,
            date: { $gte: startOfDay, $lte: endOfDay }
        });

        if (attendance) {
            // Update existing attendance
            attendance.records = records;
            attendance.instructorId = instructorId; // Update instructor if changed
            if (notes !== undefined) attendance.notes = notes;
            await attendance.save();
            return res.status(200).json({ success: true, message: "Attendance updated successfully", attendance });
        } else {
            // Create new attendance
            attendance = new Attendance({
                batchId,
                instructorId,
                date: new Date(date),
                records,
                notes
            });
            await attendance.save();
            return res.status(201).json({ success: true, message: "Attendance marked successfully", attendance });
        }
    } catch (error) {
        console.error("Error marking attendance:", error);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// Get students enrolled in a batch for marking attendance
const getBatchStudents = async (req, res) => {
    try {
        const { batchId } = req.params;
        const students = await User.find({ enrolledBatches: batchId }).select('name email enrollmentNumber');
        res.status(200).json({ success: true, students });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// Get attendance history for a batch
const getBatchAttendance = async (req, res) => {
    try {
        const { batchId } = req.params;
        const attendance = await Attendance.find({ batchId })
            .populate('instructorId', 'Name')
            .populate('records.studentId', 'name email enrollmentNumber')
            .sort({ date: -1 });
            
        res.status(200).json({ success: true, attendance });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// Check instructors (stats on their classes)
const getInstructorStats = async (req, res) => {
    try {
        // Aggregate attendance data grouped by instructor
        const stats = await Attendance.aggregate([
            {
                $group: {
                    _id: "$instructorId",
                    totalClassesTaken: { $sum: 1 },
                    recentClasses: { $push: { batchId: "$batchId", date: "$date" } }
                }
            },
            {
                $lookup: {
                    from: "teachers",
                    localField: "_id",
                    foreignField: "_id",
                    as: "instructor"
                }
            },
            { $unwind: "$instructor" },
            {
                $project: {
                    instructorId: "$_id",
                    instructorName: "$instructor.Name",
                    totalClassesTaken: 1,
                    // Keep only the latest 5 classes
                    recentClasses: { $slice: ["$recentClasses", -5] }
                }
            }
        ]);

        // Populate batch details for recent classes
        const populatedStats = await Promise.all(stats.map(async (stat) => {
            const recentClassesWithBatch = await Promise.all(stat.recentClasses.map(async (rc) => {
                const batch = await Batch.findById(rc.batchId).select('batchName track');
                return {
                    date: rc.date,
                    batchName: batch ? batch.batchName : 'Unknown Batch',
                    track: batch ? batch.track : ''
                };
            }));
            return {
                ...stat,
                recentClasses: recentClassesWithBatch
            };
        }));

        res.status(200).json({ success: true, stats: populatedStats });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// Get attendance history for a specific student
const getStudentAttendance = async (req, res) => {
    try {
        const { studentId } = req.params;
        
        // Find all attendance records where the student is in the records array
        const attendanceDocs = await Attendance.find({
            "records.studentId": studentId
        })
        .populate('batchId', 'batchName track')
        .populate('instructorId', 'Name')
        .sort({ date: -1 });

        // Map over the documents to extract only the relevant data for the specific student
        const studentAttendance = attendanceDocs.map(doc => {
            const studentRecord = doc.records.find(r => r.studentId.toString() === studentId);
            return {
                _id: doc._id,
                date: doc.date,
                batchName: doc.batchId ? doc.batchId.batchName : 'Unknown',
                track: doc.batchId ? doc.batchId.track : '',
                instructorName: doc.instructorId ? doc.instructorId.Name : 'Unknown',
                status: studentRecord ? studentRecord.status : 'Unknown',
                notes: doc.notes
            };
        });

        res.status(200).json({ success: true, attendance: studentAttendance });
    } catch (error) {
        console.error("Error fetching student attendance:", error);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

module.exports = {
    markAttendance,
    getBatchStudents,
    getBatchAttendance,
    getInstructorStats,
    getStudentAttendance
};
