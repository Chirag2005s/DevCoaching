const express = require("express");

const { createTeacher, getTeachers, deleteTeacher, UpdateTeacher } = require('../controller/teacer.controller.js');
const router = express.Router();


router.use(express.json());

router.post("/Teacher", createTeacher);
router.get("/Teacher", getTeachers);
router.delete("/Teacher/:id", deleteTeacher);
router.patch("/Teacher/:id", UpdateTeacher);

module.exports = router;
