const express = require("express");

const { createTeacher, getTeachers } = require('../controller/teacer.controller.js');
const router = express.Router();


router.use(express.json());

router.post("/Teacher", createTeacher);
router.get("/Teacher", getTeachers);

module.exports = router;
