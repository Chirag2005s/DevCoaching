import './coursedetails.css';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LiaRupeeSignSolid } from "react-icons/lia";
import { IoChevronBackOutline } from "react-icons/io5";
import { FcRating } from "react-icons/fc";
import { IoSchool } from "react-icons/io5";
import { FaBookOpen, FaUser, FaStar, FaRegStar } from "react-icons/fa";

function isFreeCourse(course) {
    const status = course.CourseStatus?.toLowerCase?.();
    if (status === 'free') return true;
    if (status === 'paid') return false;
    return Number(course.Price) === 0;
}

const getFallbackInstructorAndTopics = (course) => {
    const lang = course.Language?.toUpperCase() || '';
    if (lang.includes('PYTHON') || lang.includes('DATA')) {
        return {
            instructor: "Johan Gao",
            topics: [
                "Python fundamentals & OOP concepts",
                "Web development with Flask & Django APIs",
                "Data analysis using Pandas & NumPy",
                "File handling, Web Scraping & Automation",
                "Real-world projects & exam preparation"
            ]
        };
    } else if (lang.includes('FRONTEND') || lang.includes('REACT')) {
        return {
            instructor: "Aria Patel",
            topics: [
                "JavaScript ES6+ fundamentals & DOM manipulation",
                "Frontend component architecture with React",
                "Vite, React Router, Hooks & Context API",
                "Responsive CSS Layout systems & UI design",
                "Full application deployment & portfolio creation"
            ]
        };
    } else if (lang.includes('BACKEND') || lang.includes('NODE') || lang.includes('MERN')) {
        return {
            instructor: "Marcus Vance",
            topics: [
                "Server-side development with Node.js & Express",
                "RESTful API design and route parameters",
                "Database integration and schemas with MongoDB",
                "JWT authentication & route protection",
                "API deployment & testing with Postman"
            ]
        };
    } else if (lang.includes('UI/UX') || lang.includes('FIGMA') || lang.includes('DESIGN')) {
        return {
            instructor: "Johan Gao",
            topics: [
                "User research, UX workflows & wireframes",
                "High-fidelity prototyping & design systems in Figma",
                "Figma components, Auto-layout & variables",
                "Mobile layout design (iOS & Android)",
                "Developer handoff & design specification guides"
            ]
        };
    } else {
        return {
            instructor: "Suresh Suthar",
            topics: [
                "Core programming concepts & structures",
                "Real-world application implementation",
                "Testing, debugging & quality standards",
                "Deployment best practices & DevOps",
                "Direct code reviews & 1:1 mentor sync sessions"
            ]
        };
    }
};

function CourseDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Form states
    const [studentName, setStudentName] = useState('');
    const [rating, setRating] = useState(5);
    const [reviewText, setReviewText] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);
    const [reviewMessage, setReviewMessage] = useState(null);

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                setLoading(true);
                // Fetch single course
                const courseRes = await axios.get(`http://localhost:9000/api/Course/${id}`);
                setCourse(courseRes.data?.course);

                // Fetch reviews for course
                const reviewsRes = await axios.get(`http://localhost:9000/api/reviews/${id}`);
                setReviews(reviewsRes.data?.reviews || []);

                setLoading(false);
            } catch (err) {
                console.error("Error fetching course details:", err);
                setError(err.response?.data?.message || "Failed to load course details. Ensure the backend server is running.");
                setLoading(false);
            }
        };

        fetchCourseData();
    }, [id]);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!studentName || !reviewText) {
            setReviewMessage({ type: 'error', text: 'Please fill in all review fields.' });
            return;
        }

        try {
            setSubmittingReview(true);
            const res = await axios.post('http://localhost:9000/api/reviews', {
                courseId: id,
                studentName,
                rating,
                reviewText
            });

            setReviewMessage({ type: 'success', text: 'Thank you! Your review has been submitted.' });
            setStudentName('');
            setReviewText('');
            setRating(5);

            // Reload reviews list
            const reviewsRes = await axios.get(`http://localhost:9000/api/reviews/${id}`);
            setReviews(reviewsRes.data?.reviews || []);
            setSubmittingReview(false);
        } catch (err) {
            console.error("Error submitting review:", err);
            setReviewMessage({ type: 'error', text: 'Failed to submit review. Try again later.' });
            setSubmittingReview(false);
        }
    };

    if (loading) {
        return (
            <div className="course-details-loading-container">
                <div className="loading-spinner"></div>
                <p>Loading course details...</p>
            </div>
        );
    }

    if (error || !course) {
        return (
            <div className="course-details-error-container">
                <h2>Error loading course</h2>
                <p>{error || "Course not found."}</p>
                <button className="back-btn" onClick={() => navigate('/course')}>
                    <IoChevronBackOutline /> Back to Courses
                </button>
            </div>
        );
    }

    const free = isFreeCourse(course);
    const { instructor, topics } = getFallbackInstructorAndTopics(course);
    const avgRating = reviews.length > 0
        ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
        : null;

    return (
        <div className="course-details-page">
            <div className="container">
                {/* Back Button */}
                <button className="back-btn mb-4" onClick={() => navigate('/course')}>
                    <IoChevronBackOutline /> Back to Courses
                </button>

                {/* Course Header Section */}
                <div className="course-details-header-card reveal-visible">
                    <div className="header-card-glow" />
                    <div className="row g-4 align-items-center">
                        <div className="col-lg-8">
                            <div className="d-flex flex-wrap gap-2 mb-3 align-items-center">
                                <span className="course-details__tag">{course.Language}</span>
                                <span className={`course-details__status ${free ? 'status--free' : 'status--paid'}`}>
                                    {free ? 'Free Trial' : 'Premium Course'}
                                </span>
                            </div>
                            <h1 className="course-details__title text-white">{course.courseName}</h1>
                            <p className="course-details__disp text-secondary mt-3">{course.Disp}</p>

                            <div className="course-meta-row mt-4">
                                <div className="meta-item">
                                    <FaUser className="meta-icon text-info" />
                                    <div>
                                        <span className="meta-label">Instructor</span>
                                        <span className="meta-val text-white">{course.Instructor || instructor}</span>
                                    </div>
                                </div>
                                {avgRating && (
                                    <div className="meta-item">
                                        <FcRating className="meta-icon" />
                                        <div>
                                            <span className="meta-label">Rating</span>
                                            <span className="meta-val text-white">{avgRating} / 5.0 ({reviews.length} reviews)</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="col-lg-4 text-center text-lg-end">
                            <div className="pricing-box">
                                <span className="pricing-title">Pricing & Access</span>
                                <div className="price-tag-wrap my-3">
                                    {free ? (
                                        <span className="price-free">Free</span>
                                    ) : (
                                        <span className="price-val">
                                            <LiaRupeeSignSolid />
                                            {course.Price}
                                        </span>
                                    )}
                                </div>
                                <button className={`enroll-action-btn ${free ? 'enroll-action-btn--free' : 'enroll-action-btn--premium'}`}>
                                    {free ? 'Start Free Trial' : 'Buy & Enroll Now'}
                                </button>
                                <p className="pricing-note text-secondary mt-2">
                                    {free ? 'Instant access to first 3 modules' : '30-day money-back guarantee'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row g-5 mt-2">
                    {/* Left Column: Topics & Description */}
                    <div className="col-lg-7">
                        <div className="details-card-panel">
                            <h3 className="panel-title">
                                <FaBookOpen className="panel-icon text-info" />
                                What you will learn
                            </h3>
                            <p className="panel-desc text-secondary">
                                This syllabus is structured by senior developers to ensure you get hands-on coding experience with modern industry standards.
                            </p>
                            <ul className="syllabus-list mt-3">
                                {(course.Topics && course.Topics.length > 0 ? course.Topics : topics).map((topic, i) => (
                                    <li key={i} className="syllabus-item">
                                        <span className="syllabus-number">0{i + 1}</span>
                                        <span className="syllabus-text text-white">{topic}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Interactive Instructor card */}
                        <div className="details-card-panel mt-4">
                            <h3 className="panel-title">
                                <IoSchool className="panel-icon text-info" />
                                Your Instructor
                            </h3>
                            <div className="d-flex align-items-center gap-3 mt-3">
                                <div className="instructor-avatar">
                                    {instructor.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                    <h5 className="instructor-name text-white mb-1">{course.Instructor || instructor}</h5>
                                    <p className="instructor-title text-info mb-0">Senior Software Mentor</p>
                                </div>
                            </div>
                            <p className="instructor-bio text-secondary mt-3">
                                Dedicated programming instructor and software engineer at Dev Coaching. Providing 1:1 chat support and live sessions to help code production-grade applications.
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Reviews */}
                    <div className="col-lg-5">
                        {/* Review Form */}
                        <div className="details-card-panel review-form-panel">
                            <h3 className="panel-title mb-4">Leave a Review</h3>

                            {reviewMessage && (
                                <div className={`alert-pill alert-pill--${reviewMessage.type} mb-3`}>
                                    {reviewMessage.text}
                                </div>
                            )}

                            <form onSubmit={handleReviewSubmit}>
                                <div className="form-group mb-3">
                                    <label htmlFor="studentName" className="form-label">Full Name</label>
                                    <input
                                        type="text"
                                        id="studentName"
                                        className="form-input"
                                        placeholder="e.g. John Doe"
                                        value={studentName}
                                        onChange={(e) => setStudentName(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="form-group mb-3">
                                    <label className="form-label">Rating</label>
                                    <div className="rating-select">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                type="button"
                                                key={star}
                                                className={`star-select-btn ${star <= rating ? 'star-selected' : ''}`}
                                                onClick={() => setRating(star)}
                                            >
                                                {star <= rating ? <FaStar /> : <FaRegStar />}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="form-group mb-3">
                                    <label htmlFor="reviewText" className="form-label">Review</label>
                                    <textarea
                                        id="reviewText"
                                        className="form-textarea"
                                        rows="4"
                                        placeholder="What did you like about this course?"
                                        value={reviewText}
                                        onChange={(e) => setReviewText(e.target.value)}
                                        required
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="submit-review-btn"
                                    disabled={submittingReview}
                                >
                                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                                </button>
                            </form>
                        </div>

                        {/* Submitted Reviews List */}
                        <div className="details-card-panel mt-4">
                            <h3 className="panel-title mb-4">Student Feedback</h3>
                            <div className="reviews-list">
                                {reviews.length > 0 ? (
                                    reviews.map((rev) => (
                                        <div className="student-review-item" key={rev._id}>
                                            <div className="review-header-row">
                                                <span className="student-initial">
                                                    {rev.studentName.split(' ').map(n => n[0]).join('')}
                                                </span>
                                                <div className="student-info">
                                                    <span className="student-name text-white">{rev.studentName}</span>
                                                    <div className="star-rating">
                                                        {Array.from({ length: 5 }).map((_, idx) => (
                                                            <span key={idx} className={`star-icon ${idx < rev.rating ? 'star--filled' : 'star--empty'}`}>★</span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <span className="review-date text-secondary">
                                                    {new Date(rev.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="review-body text-secondary mt-2">{rev.reviewText}</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="no-reviews text-center text-secondary py-4">
                                        <p className="mb-0">No reviews yet. Be the first to share your thoughts!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CourseDetails;