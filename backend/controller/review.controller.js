const { Review } = require('../models/review.models.js');

// Create Review
const createReview = async (req, res) => {
    try {
        const { courseId, studentName, rating, reviewText } = req.body;

        if (!courseId || !studentName || !rating || !reviewText) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newReview = new Review({
            courseId,
            studentName,
            rating: Number(rating),
            reviewText
        });

        await newReview.save();

        res.status(201).json({ review: newReview, message: "Review submitted successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get Reviews for a specific course
const getReviewsForCourse = async (req, res) => {
    try {
        const reviews = await Review.find({ courseId: req.params.courseId }).sort({ createdAt: -1 });
        res.status(200).json({ reviews });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete 
const deleteReview = async (res, req) => {
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ messge: `Please Provide ID` });
        }

        const review = await Review.findByIdAndDelete({ _id: id });

        if (!review) {
            return res.status(404).json({ message: `Review Not Found` });
        }

        return res.status(200).json({ message: `Review Deleted` });
    }
    catch (err) {
        res.status(400).json({ message: `${err.message}` });
    }
}

module.exports = {
    createReview,
    getReviewsForCourse,
    deleteReview
};