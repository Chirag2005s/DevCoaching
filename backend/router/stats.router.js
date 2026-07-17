const express = require('express');
const router = express.Router();
const { getStats, getStudents, deleteStudent } = require('../controller/stats.controller');

router.get('/stats', getStats);
router.get('/students', getStudents);
router.delete('/students/:id', deleteStudent);

module.exports = router;
