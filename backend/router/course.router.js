const express = require("express");

const { createCourse, getCourse, deleteCourse, getCourseById } = require('../controller/course.controller.js');
const router = express.Router();


router.use(express.json());

router.post("/Course", createCourse);
router.get("/Course", getCourse);
router.get("/Course/:id", getCourseById);
router.delete("/Course/:id", deleteCourse);

module.exports = router;