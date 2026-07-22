const express = require('express');
const router = express.Router();
const notificationController = require('../controller/notification.controller');
// We could add an auth middleware here if there is one available, e.g. verifyToken
// For now, we will assume req.user might be available or handle it gracefully in the controller.

// Get all notifications for the current user
router.get('/notifications', notificationController.getNotifications);

// Mark all as read
router.put('/notifications/read-all', notificationController.markAllAsRead);

// Mark single as read
router.put('/notifications/:id/read', notificationController.markAsRead);

// Create a new notification (Admin)
router.post('/notifications', notificationController.createNotification);

module.exports = router;
