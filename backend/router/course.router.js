const express = require("express");

const { createCourse } = require('../controller/course.controller.js');
const { getCourse } = require('../controller/course.controller.js');
const router = express.Router();


router.use(express.json());

router.post("/Course", createCourse);
router.get("/Course", getCourse);

module.exports = router;