import './Exam.css';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { MdAdd, MdDeleteOutline, MdOutlineClose, MdTimer, MdAssignment, MdCheckCircle, MdCancel, MdChevronLeft, MdChevronRight } from "react-icons/md";
import { FiAward } from "react-icons/fi";

function Exam() {
    const [exams, setExams] = useState([]);
    const [search, setSearch] = useState('');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    // Quiz Player State
    const [isQuizMode, setIsQuizMode] = useState(false);
    const [activeExam, setActiveExam] = useState(null);
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({}); // { [qIndex]: optionIndex }
    const [timeLeft, setTimeLeft] = useState(0); // in seconds
    const timerRef = useRef(null);

    // Results State
    const [isResultsMode, setIsResultsMode] = useState(false);
    const [score, setScore] = useState(0);

    // Create Exam Form State
    const [title, setTitle] = useState('');
    const [subject, setSubject] = useState('');
    const [duration, setDuration] = useState(15);
    const [questions, setQuestions] = useState([
        {
            questionText: '',
            options: ['', '', '', ''],
            correctOptionIndex: 0,
            explanation: ''
        }
    ]);

    // Fetch exams
    const fetchExams = () => {
        axios.get('http://localhost:9000/api/exams')
            .then((res) => {
                setExams(res.data?.exams || []);
            })
            .catch((err) => {
                console.error("Error fetching exams:", err);
            });
    };

    useEffect(() => {
        fetchExams();
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    // Timer implementation for active quiz
    useEffect(() => {
        if (isQuizMode && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current);
                        // Auto-submit
                        handleQuizSubmit(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isQuizMode, timeLeft]);

    // Format seconds to MM:SS
    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    // Start taking an exam
    const handleStartExam = (exam) => {
        setActiveExam(exam);
        setSelectedAnswers({});
        setCurrentQIndex(0);
        setTimeLeft(exam.duration * 60);
        setIsQuizMode(true);
        setIsResultsMode(false);
    };

    // Handle Option Select
    const handleSelectOption = (optionIndex) => {
        setSelectedAnswers((prev) => ({
            ...prev,
            [currentQIndex]: optionIndex
        }));
    };

    // Submit Quiz Answers
    const handleQuizSubmit = (auto = false) => {
        if (!auto && !window.confirm("Are you sure you want to submit your exam answers?")) {
            return;
        }

        if (timerRef.current) clearInterval(timerRef.current);

        // Calculate score based on totalQuestions and weighting
        let correctCount = 0;
        activeExam.questions.forEach((q, idx) => {
            if (selectedAnswers[idx] === q.correctOptionIndex) {
                correctCount++;
            }
        });

        // 10 marks per question matching controller defaults
        const marksPerQ = Math.round(activeExam.totalMarks / activeExam.questions.length);
        const finalScore = correctCount * marksPerQ;

        setScore(finalScore);
        setIsQuizMode(false);
        setIsResultsMode(true);
        if (auto) {
            alert("Time's up! Your exam has been auto-submitted.");
        }
    };

    // Add another blank question fields in creation form
    const handleAddQuestionField = () => {
        setQuestions((prev) => [
            ...prev,
            {
                questionText: '',
                options: ['', '', '', ''],
                correctOptionIndex: 0,
                explanation: ''
            }
        ]);
    };

    // Remove a question field in creation form
    const handleRemoveQuestionField = (idx) => {
        if (questions.length === 1) return;
        setQuestions((prev) => prev.filter((_, i) => i !== idx));
    };

    // Update specific question field
    const handleUpdateQuestion = (qIdx, field, val, optionIdx = null) => {
        setQuestions((prev) => {
            const copy = [...prev];
            if (optionIdx !== null) {
                // Updating option value
                const opts = [...copy[qIdx].options];
                opts[optionIdx] = val;
                copy[qIdx].options = opts;
            } else {
                copy[qIdx][field] = val;
            }
            return copy;
        });
    };

    // Create Exam API Call
    const handleCreateExamSubmit = (e) => {
        e.preventDefault();
        setErrorMsg('');

        if (!title || !subject || !duration) {
            setErrorMsg("General fields are required.");
            return;
        }

        // Validate that all questions and options are filled out
        for (let i = 0; i < questions.length; i++) {
            const q = questions[i];
            if (!q.questionText.trim()) {
                setErrorMsg(`Question ${i + 1} text cannot be empty.`);
                return;
            }
            for (let o = 0; o < q.options.length; o++) {
                if (!q.options[o].trim()) {
                    setErrorMsg(`Question ${i + 1}, Option ${o + 1} cannot be empty.`);
                    return;
                }
            }
        }

        // 10 marks per question
        const totalMarks = questions.length * 10;
        const newExam = { title, subject, duration: Number(duration), questions, totalMarks };

        axios.post('http://localhost:9000/api/exams', newExam)
            .then(() => {
                setTitle('');
                setSubject('');
                setDuration(15);
                setQuestions([
                    {
                        questionText: '',
                        options: ['', '', '', ''],
                        correctOptionIndex: 0,
                        explanation: ''
                    }
                ]);
                setIsCreateOpen(false);
                fetchExams();
            })
            .catch((err) => {
                setErrorMsg(err.response?.data?.message || "Failed to create exam.");
            });
    };

    // Delete Exam API Call
    const handleDeleteExam = (id) => {
        if (window.confirm("Are you sure you want to delete this mock exam?")) {
            axios.delete(`http://localhost:9000/api/exams/${id}`)
                .then(() => {
                    fetchExams();
                })
                .catch((err) => {
                    console.error("Error deleting exam:", err);
                });
        }
    };

    // Filter local list
    const filteredExams = exams.filter((exam) => {
        const searchLower = search.toLowerCase();
        return (
            exam.title?.toLowerCase().includes(searchLower) ||
            exam.subject?.toLowerCase().includes(searchLower)
        );
    });

    return (
        <div className="exam-page">
            <div className="container">
                {/* Header */}
                <div className="exam-header text-center text-md-start">
                    <h1 className="exam-title">Mock <span>Exams</span></h1>
                    <p className="exam-subtitle">Evaluate your development skills with our interactive, timed assessment tests</p>
                </div>

                {/* Controls */}
                <div className="exam-controls flex-column flex-md-row gap-3">
                    <div className="note-search-wrap">
                        {/* <IoSearchOutline className="note-search-icon" /> */}
                        <input
                            type="text"
                            className="note-search-input"
                            placeholder="Search by exam or subject..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    {/* <button
                        type="button"
                        className="btn-create-exam"
                        onClick={() => setIsCreateOpen(true)}
                    >
                        <MdAdd size={20} /> Create Mock Exam
                    </button> */}
                </div>

                {/* Exams List Grid */}
                <div className="row exam-grid">
                    {filteredExams.length > 0 ? (
                        filteredExams.map((exam) => (
                            <div className="col-lg-4 col-md-6 exam-card-col" key={exam._id}>
                                <div className="exam-card">
                                    <div>
                                        <div className="exam-card-header">
                                            <span className="exam-subject">{exam.subject}</span>
                                            <button
                                                type="button"
                                                className="btn-delete-exam"
                                                title="Delete Exam"
                                                onClick={() => handleDeleteExam(exam._id)}
                                            >
                                                <MdDeleteOutline size={20} />
                                            </button>
                                        </div>

                                        <div className="exam-card-body">
                                            <h4 className="exam-card-title">{exam.title}</h4>
                                            <div className="exam-info-row">
                                                <div className="exam-info-item">
                                                    <MdTimer className="exam-info-icon" />
                                                    <span>{exam.duration} mins</span>
                                                </div>
                                                <div className="exam-info-item">
                                                    <MdAssignment className="exam-info-icon" />
                                                    <span>{exam.questions?.length} Questions</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="exam-card-footer">
                                        <div className="exam-marks">Marks: <span>{exam.totalMarks}</span></div>
                                        <button
                                            type="button"
                                            className="btn-start-exam"
                                            onClick={() => handleStartExam(exam)}
                                        >
                                            Start Exam
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-12">
                            <div className="empty-state">
                                <MdAssignment size={64} style={{ color: '#10b981' }} />
                                <h3>No Mock Exams Available</h3>
                                <p>Create a test pattern to evaluate and mock-test knowledge base topics.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal: Create Mock Exam Form */}
            {isCreateOpen && (
                <div className="neon-modal-overlay" onClick={() => setIsCreateOpen(false)}>
                    <div className="neon-modal" style={{ maxWidth: '680px' }} onClick={(e) => e.stopPropagation()}>
                        <button
                            type="button"
                            className="btn-modal-close"
                            onClick={() => setIsCreateOpen(false)}
                        >
                            <MdOutlineClose />
                        </button>
                        <h3 className="modal-title">Create Mock <span>Exam</span></h3>

                        {errorMsg && <div className="alert alert-danger py-2">{errorMsg}</div>}

                        <form onSubmit={handleCreateExamSubmit}>
                            <div className="row">
                                <div className="col-md-6 form-group">
                                    <label className="form-label">Exam Title</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="e.g. Python Basics Quiz"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="col-md-6 form-group">
                                    <label className="form-label">Subject</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="e.g. Python Core"
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Duration (Minutes)</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="180"
                                    className="form-control"
                                    value={duration}
                                    onChange={(e) => setDuration(e.target.value)}
                                    required
                                />
                            </div>

                            <label className="form-label">Questions Builder</label>
                            <div className="questions-builder-list">
                                {questions.map((q, qIdx) => (
                                    <div className="builder-question-card" key={qIdx}>
                                        <button
                                            type="button"
                                            className="btn-remove-builder-q"
                                            onClick={() => handleRemoveQuestionField(qIdx)}
                                            disabled={questions.length === 1}
                                        >
                                            Remove
                                        </button>
                                        <span className="question-num" style={{ fontSize: '0.85rem' }}>Question {qIdx + 1}</span>

                                        <div className="form-group mt-2">
                                            <input
                                                type="text"
                                                className="form-control form-control-sm"
                                                placeholder="Question description text"
                                                value={q.questionText}
                                                onChange={(e) => handleUpdateQuestion(qIdx, 'questionText', e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className="row">
                                            {q.options.map((opt, optIdx) => (
                                                <div className="col-md-6 form-group mb-2" key={optIdx}>
                                                    <input
                                                        type="text"
                                                        className="form-control form-control-sm"
                                                        placeholder={`Option ${optIdx + 1}`}
                                                        value={opt}
                                                        onChange={(e) => handleUpdateQuestion(qIdx, 'options', e.target.value, optIdx)}
                                                        required
                                                    />
                                                </div>
                                            ))}
                                        </div>

                                        <div className="row mt-2">
                                            <div className="col-md-6 form-group">
                                                <label className="form-label" style={{ fontSize: '0.75rem' }}>Correct Answer Option</label>
                                                <select
                                                    className="form-select form-select-sm"
                                                    value={q.correctOptionIndex}
                                                    onChange={(e) => handleUpdateQuestion(qIdx, 'correctOptionIndex', Number(e.target.value))}
                                                >
                                                    <option value={0}>Option 1</option>
                                                    <option value={1}>Option 2</option>
                                                    <option value={2}>Option 3</option>
                                                    <option value={3}>Option 4</option>
                                                </select>
                                            </div>
                                            <div className="col-md-6 form-group">
                                                <label className="form-label" style={{ fontSize: '0.75rem' }}>Explanation (Optional)</label>
                                                <input
                                                    type="text"
                                                    className="form-control form-control-sm"
                                                    placeholder="Explanation shown in results"
                                                    value={q.explanation}
                                                    onChange={(e) => handleUpdateQuestion(qIdx, 'explanation', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button
                                type="button"
                                className="btn-add-builder-q mb-3"
                                onClick={handleAddQuestionField}
                            >
                                + Add Another Question
                            </button>

                            <div className="form-actions mt-2">
                                <button
                                    type="button"
                                    className="btn-cancel"
                                    onClick={() => setIsCreateOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn-submit">
                                    Create Mock Exam
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Timed Quiz Player View Mode overlay */}
            {isQuizMode && activeExam && (
                <div className="quiz-overlay">
                    {/* Navigation bar */}
                    <div className="quiz-navbar">
                        <div className="container d-flex justify-content-between align-items-center">
                            <div>
                                <h4 className="mb-0 text-white font-weight-bold">{activeExam.title}</h4>
                                <small style={{ color: '#94a3b8' }}>Subject: {activeExam.subject}</small>
                            </div>
                            <div className={`quiz-timer-wrap ${timeLeft < 60 ? 'warning' : ''}`}>
                                <MdTimer size={20} />
                                <span>{formatTime(timeLeft)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Question body */}
                    <div className="quiz-container">
                        <div className="quiz-card">
                            <div className="quiz-card-header">
                                <span className="question-num">Question {currentQIndex + 1} of {activeExam.questions?.length}</span>
                                <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Marks: {Math.round(activeExam.totalMarks / activeExam.questions.length)}</span>
                            </div>

                            <h3 className="quiz-question">
                                {activeExam.questions[currentQIndex]?.questionText}
                            </h3>

                            <div className="options-list">
                                {activeExam.questions[currentQIndex]?.options.map((opt, optIdx) => {
                                    const isSelected = selectedAnswers[currentQIndex] === optIdx;
                                    return (
                                        <div
                                            key={optIdx}
                                            className={`option-item ${isSelected ? 'selected' : ''}`}
                                            onClick={() => handleSelectOption(optIdx)}
                                        >
                                            <div className="option-circle">
                                                {String.fromCharCode(65 + optIdx)}
                                            </div>
                                            <div className="option-text">{opt}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Quiz Navigation controls */}
                        <div className="quiz-nav-row">
                            <button
                                type="button"
                                className="btn-quiz-nav"
                                disabled={currentQIndex === 0}
                                onClick={() => setCurrentQIndex(currentQIndex - 1)}
                            >
                                <MdChevronLeft size={20} /> Previous
                            </button>

                            {currentQIndex === activeExam.questions.length - 1 ? (
                                <button
                                    type="button"
                                    className="btn-quiz-nav btn-quiz-submit"
                                    onClick={() => handleQuizSubmit(false)}
                                >
                                    Submit Exam
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    className="btn-quiz-nav"
                                    onClick={() => setCurrentQIndex(currentQIndex + 1)}
                                >
                                    Next <MdChevronRight size={20} />
                                </button>
                            )}
                        </div>

                        {/* Pagination indexes */}
                        <div className="quiz-progress-grid">
                            {activeExam.questions.map((_, idx) => {
                                const isCurrent = currentQIndex === idx;
                                const isAnswered = selectedAnswers[idx] !== undefined;
                                return (
                                    <div
                                        key={idx}
                                        className={`progress-num ${isCurrent ? 'active' : ''} ${isAnswered ? 'answered' : ''}`}
                                        onClick={() => setCurrentQIndex(idx)}
                                    >
                                        {idx + 1}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Quiz Results Screen */}
            {isResultsMode && activeExam && (
                <div className="quiz-overlay">
                    <div className="quiz-navbar">
                        <div className="container d-flex justify-content-between align-items-center">
                            <div>
                                <h4 className="mb-0 text-white font-weight-bold">Exam Results</h4>
                                <small style={{ color: '#94a3b8' }}>{activeExam.title}</small>
                            </div>
                            <button
                                type="button"
                                className="btn-quiz-nav btn-quiz-submit py-1"
                                onClick={() => setIsResultsMode(false)}
                            >
                                Back to Hub
                            </button>
                        </div>
                    </div>

                    <div className="quiz-container my-5">
                        <div className="quiz-card results-card">
                            <div className="results-score-circle">
                                <span className="score-num">{score}</span>
                                <span className="score-lbl">Score</span>
                            </div>

                            {score >= (activeExam.totalMarks * 0.8) ? (
                                <h2 className="results-feedback" style={{ color: '#10b981' }}>
                                    <FiAward className="me-2" /> Excellent Performance!
                                </h2>
                            ) : score >= (activeExam.totalMarks * 0.5) ? (
                                <h2 className="results-feedback" style={{ color: '#14daff' }}>
                                    Good effort, keep learning!
                                </h2>
                            ) : (
                                <h2 className="results-feedback" style={{ color: '#ef4444' }}>
                                    Need improvement. Try again!
                                </h2>
                            )}

                            <p className="results-percentage">
                                Score: {score} / {activeExam.totalMarks} marks ({Math.round((score / activeExam.totalMarks) * 100)}%)
                            </p>

                            <button
                                type="button"
                                className="btn-quiz-nav btn-quiz-submit w-100 justify-content-center"
                                style={{ maxWidth: '300px', margin: '0 auto' }}
                                onClick={() => setIsResultsMode(false)}
                            >
                                Return to Dashboard
                            </button>
                        </div>

                        {/* Review breakdown details */}
                        <div className="results-review-title mt-4">Review Questions</div>
                        {activeExam.questions.map((q, idx) => {
                            const userAns = selectedAnswers[idx];
                            const isCorrect = userAns === q.correctOptionIndex;
                            return (
                                <div className="review-item" key={idx}>
                                    <div className="review-question-header">
                                        <span className="question-num">Question {idx + 1}</span>
                                        <span className={`review-badge ${isCorrect ? 'correct' : 'incorrect'}`}>
                                            {isCorrect ? 'Correct' : 'Incorrect'}
                                        </span>
                                    </div>
                                    <h4 className="review-question-text">{q.questionText}</h4>

                                    <div className="review-options-list">
                                        {q.options.map((opt, optIdx) => {
                                            const isSelected = userAns === optIdx;
                                            const isCorrectAns = q.correctOptionIndex === optIdx;
                                            let classes = 'review-option';
                                            if (isCorrectAns) classes += ' correct';
                                            else if (isSelected && !isCorrectAns) classes += ' incorrect';

                                            return (
                                                <div className={classes} key={optIdx}>
                                                    <span className="me-2 font-weight-bold">{String.fromCharCode(65 + optIdx)}.</span> {opt}
                                                    {isCorrectAns && ' (Correct Answer)'}
                                                    {isSelected && !isCorrectAns && ' (Your Selection)'}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {q.explanation && (
                                        <div className="review-explanation">
                                            <strong>Explanation:</strong> {q.explanation}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Exam;
