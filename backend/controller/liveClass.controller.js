const { LiveClass } = require('../models/liveClass.models');

// GET /api/live-classes
const getLiveClasses = async (req, res) => {
    try {
        const classes = await LiveClass.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, liveClasses: classes });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch live classes", error: error.message });
    }
};

// POST /api/live-classes
const createLiveClass = async (req, res) => {
    try {
        const { topic, mentor, track, type, dayOfWeek, time, meetingLink, description, prerequisites, status, isActiveNow } = req.body;
        
        const newClass = new LiveClass({
            topic, mentor, track, type, dayOfWeek, time, meetingLink, description, prerequisites, status, isActiveNow
        });
        
        await newClass.save();
        res.status(201).json({ success: true, liveClass: newClass });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to create live class", error: error.message });
    }
};

// PUT /api/live-classes/:id
const updateLiveClass = async (req, res) => {
    try {
        const updatedClass = await LiveClass.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedClass) return res.status(404).json({ success: false, message: "Live class not found" });
        res.status(200).json({ success: true, liveClass: updatedClass });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to update live class", error: error.message });
    }
};

// DELETE /api/live-classes/:id
const deleteLiveClass = async (req, res) => {
    try {
        const deletedClass = await LiveClass.findByIdAndDelete(req.params.id);
        if (!deletedClass) return res.status(404).json({ success: false, message: "Live class not found" });
        res.status(200).json({ success: true, message: "Live class deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to delete live class", error: error.message });
    }
};

module.exports = {
    getLiveClasses,
    createLiveClass,
    updateLiveClass,
    deleteLiveClass
};
