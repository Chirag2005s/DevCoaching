const express = require("express");
const { createReview, getReviewsForCourse } = require('../controller/review.controller.js');
const router = express.Router();

router.use(express.json());

router.post("/reviews", createReview);
router.get("/reviews/:courseId", getReviewsForCourse);

module.exports = router;