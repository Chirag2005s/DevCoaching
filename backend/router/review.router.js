const express = require("express");
const { createReview, getReviewsForCourse, deleteReview } = require('../controller/review.controller.js');
const router = express.Router();

router.use(express.json());

router.post("/reviews", createReview);
router.get("/reviews/:courseId", getReviewsForCourse);
router.delete("/reviews/:id", deleteReview);

module.exports = router;