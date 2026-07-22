const { Notification } = require("../models/notification.models");

// GET /api/notifications
// Gets notifications for the logged-in user and global notifications
const getNotifications = async (req, res) => {
    try {
        const userId = req.user ? req.user.id : null;
        
        const query = userId ? { $or: [{ userId }, { userId: null }] } : { userId: null };
        
        const notifications = await Notification.find(query)
            .sort({ createdAt: -1 })
            .limit(50); // Get latest 50 notifications
            
        // Get unread count
        const unreadCount = await Notification.countDocuments({ ...query, isRead: false });

        res.status(200).json({ success: true, notifications, unreadCount });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// PUT /api/notifications/:id/read
// Mark a notification as read
const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findByIdAndUpdate(
            req.params.id,
            { isRead: true },
            { new: true }
        );
        if (!notification) {
            return res.status(404).json({ success: false, message: "Notification not found" });
        }
        res.status(200).json({ success: true, notification });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// PUT /api/notifications/read-all
// Mark all notifications for a user as read
const markAllAsRead = async (req, res) => {
    try {
        const userId = req.user ? req.user.id : null;
        const query = userId ? { $or: [{ userId }, { userId: null }], isRead: false } : { userId: null, isRead: false };
        
        await Notification.updateMany(query, { isRead: true });
        res.status(200).json({ success: true, message: "All notifications marked as read" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// POST /api/notifications (Admin only)
// Create a new notification
const createNotification = async (req, res) => {
    try {
        const { userId, title, message, type } = req.body;
        const notification = new Notification({
            userId: userId || null,
            title,
            message,
            type: type || 'info'
        });
        await notification.save();
        res.status(201).json({ success: true, notification });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

module.exports = {
    getNotifications,
    markAsRead,
    markAllAsRead,
    createNotification
};
