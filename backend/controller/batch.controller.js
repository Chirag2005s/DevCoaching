const { Batch } = require("../models/batch.models.js");

// GET all batches (with course name populated)
const getBatches = async (req, res) => {
    try {
        const batches = await Batch.find()
            .populate("courseId", "courseName Language")
            .sort({ createdAt: -1 });
        res.status(200).json({ batches });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET single batch by ID
const getBatchById = async (req, res) => {
    try {
        const batch = await Batch.findById(req.params.id)
            .populate("courseId", "courseName Language");
        if (!batch) {
            return res.status(404).json({ message: "Batch not found" });
        }
        res.status(200).json({ batch });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST create a new batch
const createBatch = async (req, res) => {
    try {
        const {
            batchName, courseId, track, instructor,
            startDate, endDate, timings, maxSeats,
            status, meetLink, description
        } = req.body;

        if (!batchName || !courseId || !track || !instructor || !startDate || !timings) {
            return res.status(400).json({
                message: "batchName, courseId, track, instructor, startDate, and timings are required"
            });
        }

        const existing = await Batch.findOne({ batchName });
        if (existing) {
            return res.status(409).json({ message: `Batch "${batchName}" already exists` });
        }

        const newBatch = new Batch({
            batchName, courseId, track, instructor,
            startDate, endDate, timings,
            maxSeats: maxSeats || 30,
            status: status || "Upcoming",
            meetLink: meetLink || "",
            description: description || ""
        });

        await newBatch.save();
        const populated = await newBatch.populate("courseId", "courseName Language");
        res.status(201).json({ message: "Batch created successfully", batch: populated });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// PUT update a batch
const updateBatch = async (req, res) => {
    try {
        const updated = await Batch.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        ).populate("courseId", "courseName Language");

        if (!updated) {
            return res.status(404).json({ message: "Batch not found" });
        }

        res.status(200).json({ message: "Batch updated successfully", batch: updated });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE a batch
const deleteBatch = async (req, res) => {
    try {
        const deleted = await Batch.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: "Batch not found" });
        }
        res.status(200).json({ message: "Batch deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// PATCH enroll into a batch (increment enrolledCount)
const enrollBatch = async (req, res) => {
    try {
        const batch = await Batch.findById(req.params.id);
        if (!batch) {
            return res.status(404).json({ message: "Batch not found" });
        }
        if (batch.enrolledCount >= batch.maxSeats) {
            return res.status(400).json({ message: "Batch is full" });
        }
        batch.enrolledCount += 1;
        await batch.save();
        res.status(200).json({ message: "Enrolled successfully", enrolledCount: batch.enrolledCount });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getBatches, getBatchById, createBatch, updateBatch, deleteBatch, enrollBatch };
