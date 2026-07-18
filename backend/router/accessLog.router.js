const express = require('express');
const router = express.Router();
const accessLogController = require('../controller/accessLog.controller');
const { verifyToken, verifyAdmin, verifySuperAdmin } = require('../middleware/auth.middleware');

// GET access logs (requires admin / superadmin)
router.get('/access-logs', verifyToken, verifyAdmin, accessLogController.getAccessLogs);

// DELETE logs older than N days (requires superadmin)
router.delete('/access-logs/cleanup', verifyToken, verifySuperAdmin, accessLogController.cleanupLogs);

module.exports = router;
