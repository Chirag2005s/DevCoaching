const express = require('express');
const router = express.Router();
const authController = require('../controller/auth.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// Register route
router.post('/register', authController.register);

// Login route
router.post('/login', authController.login);

// Purchase course route (Mock)
router.post('/purchase', verifyToken, authController.purchaseCourse);

module.exports = router;
