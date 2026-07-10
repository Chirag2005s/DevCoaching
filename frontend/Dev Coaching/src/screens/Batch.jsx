import "./Batch.css";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { IoSearchOutline } from "react-icons/io5";
import { MdAdd, MdDeleteOutline, MdOutlineClose, MdVideoCall, MdPeople, MdCalendarToday, MdAccessTime, MdPerson, MdSchool } from "react-icons/md";
import { FiExternalLink } from "react-icons/fi";
import { AuthContext } from "../context/AuthContext";

const API = "http://localhost:9000/api";

const STATUS_TABS = ["ALL", "Upcoming", "Ongoing", "Completed"];

const TRACKS = ["FRONTEND", "PYTHON", "BACKEND", "UI/UX", "FULL STACK", "ROBOTICS"];

function getStatusClass(status) {
    switch (status) {
        case "Upcoming":  return "upcoming";
        case "Ongoing":   return "ongoing";
        case "Completed": return "completed";
        default:          return "upcoming";
    }
}

function formatDate(dateStr) {
    if (!dateStr) return "TBD";
    return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "numeric", month: "short", year: "numeric"
    });
}

const EMPTY_FORM = {
    batchName: "",
    courseId: "",
    track: "FRONTEND",
    instructor: "",
    startDate: "",
    endDate: "",
    timings: "",
    maxSeats: 30,
    status: "Upcoming",
    meetLink: "",
    description: ""
};

function Batch() {
    const { user } = useContext(AuthContext);

    const [batches, setBatches]           = useState([]);
    const [courses, setCourses]           = useState([]);
    const [activeTab, setActiveTab]       = useState("ALL");
    const [search, setSearch]             = useState("");
    const [isModalOpen, setIsModalOpen]   = useState(false);
    const [form, setForm]                 = useState(EMPTY_FORM);
    const [formError, setFormError]       = useState("");
    const [submitting, setSubmitting]     = useState(false);
    const [enrollingId, setEnrollingId]   = useState(null);

    // Fetch batches
    const fetchBatches = async () => {
        try {
            const res = await axios.get(`${API}/batches`);
            setBatches(res.data?.batches || []);
        } catch (err) {
            console.error("Error fetching batches:", err);
        }
    };

    // Fetch courses for dropdown
    const fetchCourses = async () => {
        try {
            const res = await axios.get(`${API}/Course`);
            setCourses(res.data?.course || []);
        } catch (err) {
            console.error("Error fetching courses:", err);
        }
    };

    useEffect(() => {
        fetchBatches();
        fetchCourses();
    }, []);

    // Filter batches
    const filtered = batches.filter((b) => {
        const matchTab    = activeTab === "ALL" || b.status === activeTab;
        const q           = search.toLowerCase();
        const matchSearch = !q ||
            b.batchName?.toLowerCase().includes(q) ||
            b.track?.toLowerCase().includes(q) ||
            b.instructor?.toLowerCase().includes(q) ||
            b.courseId?.courseName?.toLowerCase().includes(q);
        return matchTab && matchSearch;
    });

    // Stats
    const stats = {
        total:     batches.length,
        upcoming:  batches.filter(b => b.status === "Upcoming").length,
        ongoing:   batches.filter(b => b.status === "Ongoing").length,
        completed: batches.filter(b => b.status === "Completed").length,
    };

    // Form input change
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    // Submit create batch
    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError("");

        if (!form.batchName || !form.courseId || !form.instructor || !form.startDate || !form.timings) {
            setFormError("Batch Name, Course, Instructor, Start Date, and Timings are required.");
            return;
        }

        try {
            setSubmitting(true);
            await axios.post(`${API}/batches`, {
                ...form,
                maxSeats: Number(form.maxSeats)
            });
            setIsModalOpen(false);
            setForm(EMPTY_FORM);
            fetchBatches();
        } catch (err) {
            setFormError(err.response?.data?.message || "Failed to create batch. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    // Delete batch
    const handleDelete = async (id) => {
        if (!window.confirm("Delete this batch?")) return;
        try {
            await axios.delete(`${API}/batches/${id}`);
            fetchBatches();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to delete batch.");
        }
    };

    // Enroll into batch
    const handleEnroll = async (id) => {
        try {
            setEnrollingId(id);
            await axios.patch(`${API}/batches/${id}/enroll`);
            fetchBatches();
        } catch (err) {
            alert(err.response?.data?.message || "Could not enroll. Try again.");
        } finally {
            setEnrollingId(null);
        }
    };

    const openModal = () => {
        setForm({ ...EMPTY_FORM, courseId: courses[0]?._id || "" });
        setFormError("");
        setIsModalOpen(true);
    };

    return (
        <div className="batch-page">
            <div className="container">

                {/* Header */}
                <div className="batch-header">
                    <h1 className="batch-title">Course <span>Batches</span></h1>
                    <p className="batch-subtitle">Browse scheduled batches and enroll to start your learning journey.</p>
                </div>

                {/* Stats Row */}
                <div className="batch-stats">
                    <div className="batch-stat-card">
                        <span className="batch-stat-card__value">{stats.total}</span>
                        <span className="batch-stat-card__label">Total Batches</span>
                    </div>
                    <div className="batch-stat-card">
                        <span className="batch-stat-card__value" style={{ color: "#fbbf24" }}>{stats.upcoming}</span>
                        <span className="batch-stat-card__label">Upcoming</span>
                    </div>
                    <div className="batch-stat-card">
                        <span className="batch-stat-card__value" style={{ color: "#22c55e" }}>{stats.ongoing}</span>
                        <span className="batch-stat-card__label">Ongoing</span>
                    </div>
                    <div className="batch-stat-card">
                        <span className="batch-stat-card__value" style={{ color: "#64748b" }}>{stats.completed}</span>
                        <span className="batch-stat-card__label">Completed</span>
                    </div>
                </div>

                {/* Controls */}
                <div className="batch-controls">
                    <div className="batch-filter-tabs">
                        {STATUS_TABS.map(tab => (
                            <button
                                key={tab}
                                className={`batch-tab ${activeTab === tab ? "active" : ""}`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="batch-search-wrap">
                        <IoSearchOutline className="batch-search-icon" />
                        <input
                            type="text"
                            className="batch-search-input"
                            placeholder="Search batch, track, instructor..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>

                    <button className="btn-create-batch" onClick={openModal}>
                        <MdAdd size={18} /> Create Batch
                    </button>
                </div>

                {/* Grid */}
                <div className="batch-grid">
                    {filtered.length > 0 ? (
                        filtered.map(batch => {
                            const isFull  = batch.enrolledCount >= batch.maxSeats;
                            const fillPct = Math.min(100, Math.round((batch.enrolledCount / batch.maxSeats) * 100));
                            return (
                                <div className="batch-card" key={batch._id}>
                                    {/* Badges */}
                                    <div className="batch-card__badges">
                                        <span className="batch-track-badge">{batch.track}</span>
                                        <span className={`batch-status-badge ${getStatusClass(batch.status)}`}>
                                            {batch.status === "Ongoing" && "?? "}{batch.status}
                                        </span>
                                    </div>

                                    {/* Name */}
                                    <h3 className="batch-card__name">{batch.batchName}</h3>

                                    {/* Meta */}
                                    <div className="batch-card__meta">
                                        {batch.courseId?.courseName && (
                                            <div className="batch-meta-row">
                                                <MdSchool className="batch-meta-icon" />
                                                <span>{batch.courseId.courseName}</span>
                                            </div>
                                        )}
                                        <div className="batch-meta-row">
                                            <MdPerson className="batch-meta-icon" />
                                            <span>{batch.instructor}</span>
                                        </div>
                                        <div className="batch-meta-row">
                                            <MdCalendarToday className="batch-meta-icon" />
                                            <span>Starts {formatDate(batch.startDate)}</span>
                                        </div>
                                        <div className="batch-meta-row">
                                            <MdAccessTime className="batch-meta-icon" />
                                            <span>{batch.timings}</span>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    {batch.description && (
                                        <p className="batch-card__desc">{batch.description}</p>
                                    )}

                                    {/* Seat Capacity */}
                                    <div className="batch-capacity">
                                        <div className="batch-capacity__label">
                                            <span className="batch-capacity__text">
                                                <MdPeople style={{ marginRight: 4, verticalAlign: "middle" }} />
                                                Seats
                                            </span>
                                            <span className="batch-capacity__count">
                                                {batch.enrolledCount} / {batch.maxSeats}
                                                {isFull && <span style={{ color: "#ef4444", marginLeft: 6 }}>FULL</span>}
                                            </span>
                                        </div>
                                        <div className="batch-capacity__bar">
                                            <div
                                                className={`batch-capacity__fill ${isFull ? "full" : ""}`}
                                                style={{ width: `${fillPct}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="batch-card__actions">
                                        <button
                                            className="btn-enroll"
                                            disabled={isFull || batch.status === "Completed" || enrollingId === batch._id}
                                            onClick={() => handleEnroll(batch._id)}
                                        >
                                            {enrollingId === batch._id
                                                ? "Enrolling..."
                                                : isFull
                                                    ? "Batch Full"
                                                    : batch.status === "Completed"
                                                        ? "Completed"
                                                        : "Enroll Now"}
                                        </button>

                                        {batch.meetLink && (
                                            <a
                                                href={batch.meetLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn-meet"
                                            >
                                                <MdVideoCall /> Meet
                                            </a>
                                        )}

                                        {user && (
                                            <button
                                                className="btn-delete-batch"
                                                onClick={() => handleDelete(batch._id)}
                                                title="Delete batch"
                                            >
                                                <MdDeleteOutline />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="batch-empty">
                            <div className="batch-empty__icon">??</div>
                            <h3 className="batch-empty__title">No Batches Found</h3>
                            <p className="batch-empty__sub">
                                {search || activeTab !== "ALL"
                                    ? "Try a different filter or search term."
                                    : "Click \"Create Batch\" to add the first batch!"}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Create Batch Modal */}
            {isModalOpen && (
                <div className="batch-modal-overlay" onClick={e => { if (e.target === e.currentTarget) setIsModalOpen(false); }}>
                    <div className="batch-modal">
                        <div className="batch-modal__header">
                            <h2 className="batch-modal__title">Create New Batch</h2>
                            <button className="batch-modal__close" onClick={() => setIsModalOpen(false)}>
                                <MdOutlineClose />
                            </button>
                        </div>

                        <form className="batch-form" onSubmit={handleSubmit}>
                            {/* Batch Name */}
                            <div className="batch-form-group">
                                <label className="batch-form-label">BATCH NAME *</label>
                                <input
                                    type="text"
                                    name="batchName"
                                    className="batch-form-input"
                                    placeholder="e.g. Python Batch — July 2026"
                                    value={form.batchName}
                                    onChange={handleFormChange}
                                    required
                                />
                            </div>

                            {/* Course + Track */}
                            <div className="batch-form-row">
                                <div className="batch-form-group">
                                    <label className="batch-form-label">COURSE *</label>
                                    <select
                                        name="courseId"
                                        className="batch-form-select"
                                        value={form.courseId}
                                        onChange={handleFormChange}
                                        required
                                    >
                                        <option value="" disabled>Select course...</option>
                                        {courses.map(c => (
                                            <option key={c._id} value={c._id}>{c.courseName}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="batch-form-group">
                                    <label className="batch-form-label">TRACK *</label>
                                    <select
                                        name="track"
                                        className="batch-form-select"
                                        value={form.track}
                                        onChange={handleFormChange}
                                    >
                                        {TRACKS.map(t => (
                                            <option key={t} value={t}>{t}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Instructor + Status */}
                            <div className="batch-form-row">
                                <div className="batch-form-group">
                                    <label className="batch-form-label">INSTRUCTOR *</label>
                                    <input
                                        type="text"
                                        name="instructor"
                                        className="batch-form-input"
                                        placeholder="e.g. Johan Gao"
                                        value={form.instructor}
                                        onChange={handleFormChange}
                                        required
                                    />
                                </div>
                                <div className="batch-form-group">
                                    <label className="batch-form-label">STATUS</label>
                                    <select
                                        name="status"
                                        className="batch-form-select"
                                        value={form.status}
                                        onChange={handleFormChange}
                                    >
                                        <option value="Upcoming">Upcoming</option>
                                        <option value="Ongoing">Ongoing</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                </div>
                            </div>

                            {/* Start Date + End Date */}
                            <div className="batch-form-row">
                                <div className="batch-form-group">
                                    <label className="batch-form-label">START DATE *</label>
                                    <input
                                        type="date"
                                        name="startDate"
                                        className="batch-form-input"
                                        value={form.startDate}
                                        onChange={handleFormChange}
                                        required
                                    />
                                </div>
                                <div className="batch-form-group">
                                    <label className="batch-form-label">END DATE</label>
                                    <input
                                        type="date"
                                        name="endDate"
                                        className="batch-form-input"
                                        value={form.endDate}
                                        onChange={handleFormChange}
                                    />
                                </div>
                            </div>

                            {/* Timings + Max Seats */}
                            <div className="batch-form-row">
                                <div className="batch-form-group">
                                    <label className="batch-form-label">TIMINGS *</label>
                                    <input
                                        type="text"
                                        name="timings"
                                        className="batch-form-input"
                                        placeholder="e.g. Mon-Fri 8:00PM – 9:30PM"
                                        value={form.timings}
                                        onChange={handleFormChange}
                                        required
                                    />
                                </div>
                                <div className="batch-form-group">
                                    <label className="batch-form-label">MAX SEATS</label>
                                    <input
                                        type="number"
                                        name="maxSeats"
                                        className="batch-form-input"
                                        min="1"
                                        value={form.maxSeats}
                                        onChange={handleFormChange}
                                    />
                                </div>
                            </div>

                            {/* Google Meet Link */}
                            <div className="batch-form-group">
                                <label className="batch-form-label">GOOGLE MEET LINK</label>
                                <input
                                    type="url"
                                    name="meetLink"
                                    className="batch-form-input"
                                    placeholder="https://meet.google.com/..."
                                    value={form.meetLink}
                                    onChange={handleFormChange}
                                />
                            </div>

                            {/* Description */}
                            <div className="batch-form-group">
                                <label className="batch-form-label">DESCRIPTION</label>
                                <textarea
                                    name="description"
                                    className="batch-form-textarea"
                                    placeholder="Brief info about this batch..."
                                    value={form.description}
                                    onChange={handleFormChange}
                                    rows={3}
                                />
                            </div>

                            {/* Error */}
                            {formError && <div className="batch-form__error">{formError}</div>}

                            {/* Actions */}
                            <div className="batch-form__actions">
                                <button type="button" className="btn-modal-cancel" onClick={() => setIsModalOpen(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn-modal-submit" disabled={submitting}>
                                    {submitting ? "Creating..." : "Create Batch"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Batch;
