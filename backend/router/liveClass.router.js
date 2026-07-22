const express = require('express');
const router = express.Router();
const liveClassController = require('../controller/liveClass.controller');

router.get('/live-classes', liveClassController.getLiveClasses);
router.post('/live-classes', liveClassController.createLiveClass);
router.put('/live-classes/:id', liveClassController.updateLiveClass);
router.delete('/live-classes/:id', liveClassController.deleteLiveClass);

module.exports = router;
