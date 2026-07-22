import './joinLive.css';
import { useState, useEffect, useRef, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    HiSignal,
    HiChevronDown,
    HiChevronUp,
    HiOutlineAcademicCap,
    HiOutlineClock,
    HiOutlineCalendar,
    HiOutlineArrowRight,
    HiOutlinePlay,
    HiArrowDownTray,
    HiOutlineBookOpen,
    HiOutlineMagnifyingGlass,
    HiOutlineXMark
} from "react-icons/hi2";
import { FaGoogle, FaLaptopCode, FaCheckCircle, FaUser, FaClipboardList } from 'react-icons/fa';
import { MdVideoCall } from 'react-icons/md';

function toTrackClass(track) {
    return track.toLowerCase().replace(/\s+/g, '-').replace(/\//g, '-');
}

// Active live class details
const ACTIVE_LIVE_CLASS = {
    isLive: true,
    title: "MERN Full Stack Live: Redux Toolkit Integration & Global State",
    mentor: "Johan Gao",
    timeStarted: "Started 15 mins ago (7:30 PM IST)",
    duration: "Scheduled: 2 hours",
    meetingLink: "https://meet.google.com/abc-defg-hij",
    description: "Learn how to configure Redux Toolkit from scratch, manage asynchronous state with createAsyncThunk, and wire up React UI components to backend database values.",
    prerequisites: [
        "Node.js installed (v18+ recommended)",
        "Starter code cloned locally",
        "Basic understanding of React Context API"
    ],
    materials: {
        github: "https://github.com/Chirag2005s/DevCoaching",
        notes: "#"
    }
};

// Weekly Live Class Schedule
const WEEKLY_SCHEDULE = {
    "Monday": [
        { time: "7:00 PM - 9:00 PM", topic: "Python: Object-Oriented Programming (OOP) Deep Dive", mentor: "Johan Gao", track: "Python", type: "Core Lecture" }
    ],
    "Tuesday": [
        { time: "7:00 PM - 9:00 PM", topic: "MERN Stack: React Router & Single Page Application Routing", mentor: "Johan Gao", track: "MERN Stack", type: "Core Lecture" }
    ],
    "Wednesday": [
        { time: "7:00 PM - 9:00 PM", topic: "Backend: Express.js Routing & Middleware Design Patterns", mentor: "Johan Gao", track: "MERN Stack", type: "Core Lecture" }
    ],
    "Thursday": [
        { time: "7:00 PM - 9:00 PM", topic: "UI/UX: Figma Design Systems, Auto-Layout & Variables", mentor: "Johan Gao", track: "UI/UX Design", type: "Hands-on Workshop" }
    ],
    "Friday": [
        { time: "7:00 PM - 9:00 PM", topic: "Full Stack: Axios HTTP Requests & CORS Handshake Config", mentor: "Johan Gao", track: "MERN Stack", type: "Coding Practice" }
    ],
    "Saturday": [
        { time: "11:00 AM - 1:00 PM", topic: "Database: MongoDB Aggregation Pipelines & Relationships", mentor: "Johan Gao", track: "MERN Stack", type: "Advanced Topic" },
        { time: "3:00 PM - 5:00 PM", topic: "Weekly Exam Review & 1:1 Live Doubt-Clearing Session", mentor: "Johan Gao", track: "All Tracks", type: "Interactive Office Hours" }
    ],
    "Sunday": [
        { time: "All Day", topic: "No scheduled live classes. Focus on assignments, review recordings, or take rest.", mentor: "Self-paced", track: "Rest Day", type: "Study Day" }
    ]
};

// Past Recorded Live Classes
const PAST_RECORDINGS = [
    {
        id: 1,
        title: "Intro to React Components & State Hook Fundamentals",
        track: "MERN Stack",
        date: "June 10, 2026",
        duration: "1h 50m",
        mentor: "Johan Gao",
        videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-person-writing-code-on-laptop-4908-large.mp4",
        notes: "#",
        github: "#"
    },
    {
        id: 2,
        title: "Python Web Scraping with BeautifulSoup & Request APIs",
        track: "Python",
        date: "June 08, 2026",
        duration: "1h 40m",
        mentor: "Johan Gao",
        videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-person-writing-code-on-laptop-4908-large.mp4",
        notes: "#",
        github: "#"
    },
    {
        id: 3,
        title: "Figma High-Fidelity UI Prototyping & Micro-Interactions",
        track: "UI/UX Design",
        date: "June 05, 2026",
        duration: "2h 05m",
        mentor: "Johan Gao",
        videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-person-writing-code-on-laptop-4908-large.mp4",
        notes: "#",
        github: "#"
    },
    {
        id: 4,
        title: "Express.js API Creation, REST Standards & Postman Testing",
        track: "MERN Stack",
        date: "June 03, 2026",
        duration: "1h 30m",
        mentor: "Johan Gao",
        videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-person-writing-code-on-laptop-4908-large.mp4",
        notes: "#",
        github: "#"
    },
    {
        id: 5,
        title: "Python Data Analysis: Mastering Pandas DataFrames",
        track: "Python",
        date: "June 01, 2026",
        duration: "1h 55m",
        mentor: "Johan Gao",
        videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-person-writing-code-on-laptop-4908-large.mp4",
        notes: "#",
        github: "#"
    },
    {
        id: 6,
        title: "MongoDB Schema Design & Basic CRUD Operations",
        track: "MERN Stack",
        date: "May 29, 2026",
        duration: "1h 45m",
        mentor: "Johan Gao",
        videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-person-writing-code-on-laptop-4908-large.mp4",
        notes: "#",
        github: "#"
    }
];

// FAQs about Live Classes
const FAQS = [
    {
        id: 1,
        question: "How do I attend the live classes?",
        answer: "Live classes are hosted via Google Meet. When a class is active, an indicator and 'Join Meeting' link will appear at the top of this page. Simply click that link to enter the virtual classroom. Ensure you are signed into your student account."
    },
    {
        id: 2,
        question: "What if I miss a live session?",
        answer: "No worries! Every live session is recorded and uploaded to this portal within 2 hours after the session concludes. You can search and watch them under the 'Recorded Classes Archive' section of this page at any time."
    },
    {
        id: 3,
        question: "Where can I download the class code repositories and slides?",
        answer: "For both active and past classes, resources such as GitHub repository links, starter code files, and lecture notes are linked directly on the cards. Just click the download or code icons to access them."
    },
    {
        id: 4,
        question: "Can I ask questions and clear doubts in real-time?",
        answer: "Absolutely! Our live sessions are highly interactive. You can ask doubts directly by unmuting yourself during designated QA intervals or by typing in the chat. You can also use the Chat Widget on the bottom right of the screen for offline mentor support."
    }
];

function JoinLive() {
    const [activeDay, setActiveDay] = useState("Monday");
    const [selectedTrack, setSelectedTrack] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [openFaq, setOpenFaq] = useState(null);
    const [playingVideo, setPlayingVideo] = useState(null);
    const [weeklySchedule, setWeeklySchedule] = useState({});
    const [activeLiveClass, setActiveLiveClass] = useState(null);
    const [loading, setLoading] = useState(true);
    const modalVideoRef = useRef(null);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const res = await axios.get('http://localhost:9000/api/live-classes');
                if (res.data.success) {
                    const classes = res.data.liveClasses;
                    
                    const schedule = {
                        "Monday": [], "Tuesday": [], "Wednesday": [], 
                        "Thursday": [], "Friday": [], "Saturday": [], "Sunday": []
                    };
                    
                    let active = null;
                    
                    classes.forEach(cls => {
                        if (schedule[cls.dayOfWeek]) {
                            schedule[cls.dayOfWeek].push(cls);
                        }
                        if (cls.isActiveNow) {
                            active = cls;
                        }
                    });
                    
                    setWeeklySchedule(schedule);
                    setActiveLiveClass(active);

                    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                    const today = days[new Date().getDay()];
                    if (schedule[today] && schedule[today].length > 0) {
                        setActiveDay(today);
                    }
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchClasses();
    }, []);

    // Filter past recordings based on track and search query
    const filteredRecordings = PAST_RECORDINGS.filter(rec => {
        const matchesTrack = selectedTrack === "All" || rec.track === selectedTrack;
        const matchesSearch = rec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            rec.track.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTrack && matchesSearch;
    });

    const toggleFaq = (id) => {
        setOpenFaq(openFaq === id ? null : id);
    };

    const handlePlayRecording = (video) => {
        setPlayingVideo(video);
    };

    const closeVideoModal = () => {
        setPlayingVideo(null);
    };

    // Play video inside modal when opened
    useEffect(() => {
        if (playingVideo && modalVideoRef.current) {
            modalVideoRef.current.play().catch(() => { });
        }
    }, [playingVideo]);

    if (!user) {
        return (
            <div className="join-live-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
                <div className="bg-glow bg-glow--top" />
                <div className="glass-panel text-center p-5 mx-3" style={{ maxWidth: '600px', zIndex: 1 }}>
                    <div style={{ fontSize: '4rem', color: '#ff6b6b', marginBottom: '1rem' }}>
                        <HiOutlineXMark />
                    </div>
                    <h2 className="text-white mb-3">Access Restricted</h2>
                    <p className="text-secondary mb-4">
                        You need to be logged in to access the Live Classes portal. Please log in or create an account to continue.
                    </p>
                    <button className="btn-join-meet px-5 py-3" onClick={() => navigate('/login')}>
                        Log In Now
                    </button>
                </div>
            </div>
        );
    }

    if (!user.hasPurchasedCourse) {
        return (
            <div className="join-live-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
                <div className="bg-glow bg-glow--top" />
                <div className="glass-panel text-center p-5 mx-3" style={{ maxWidth: '600px', zIndex: 1 }}>
                    <div style={{ fontSize: '4rem', color: '#ffd93d', marginBottom: '1rem' }}>
                        <HiOutlineAcademicCap />
                    </div>
                    <h2 className="text-white mb-3">Premium Content</h2>
                    <p className="text-secondary mb-4">
                        Live classes are exclusively available to enrolled students. Browse our premium courses to gain full access to daily live streams, QA sessions, and recorded archives.
                    </p>
                    <button className="btn-join-meet px-5 py-3" onClick={() => navigate('/course')}>
                        Browse Courses
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="join-live-page">
            {/* Background visual effects */}
            <div className="bg-glow bg-glow--top" />
            <div className="bg-glow bg-glow--bottom" />

            <div className="container py-5">
                {/* Page Hero */}
                <header className="live-hero text-center mb-5">
                    <div className="live-badge-wrap">
                        <span className="live-status-pulse">
                            <HiSignal className="pulse-icon" />
                            LIVE CLASS PORTAL
                        </span>
                    </div>
                    <h1 className="live-title mt-3">
                        Interact Live, <span>Learn Coding</span> in Real Time
                    </h1>
                    <p className="live-subtitle">
                        Access daily Google Meet streams, follow along with source code material,
                        ask real-time questions, or review recorded files from the archives.
                    </p>
                </header>

                {/* Current Active Live Class Section */}
                {activeLiveClass && (
                <section className="active-live-section mb-5">
                    <div className="active-class-card glass-panel">
                        <div className="active-class-card__glow" />
                        <div className="row g-4 align-items-center">
                            <div className="col-lg-8">
                                <div className="active-status-row">
                                    <span className="badge-live">LIVE NOW</span>
                                    <span className="active-time-meta">
                                        <HiOutlineClock className="icon-meta" />
                                        {activeLiveClass.time}
                                    </span>
                                </div>

                                <h2 className="active-class-title mt-3">{activeLiveClass.topic}</h2>
                                <p className="active-class-desc">{activeLiveClass.description || "Join the live session to learn more."}</p>

                                <div className="active-meta-grid">
                                    <div className="meta-box">
                                        <span className="meta-label">INSTRUCTOR</span>
                                        <span className="meta-val">
                                            <FaUser className="me-1 text-info" /> {activeLiveClass.mentor}
                                        </span>
                                    </div>
                                    <div className="meta-box">
                                        <span className="meta-label">TRACK</span>
                                        <span className="meta-val">
                                            <HiOutlineClock className="me-1 text-warning" /> {activeLiveClass.track}
                                        </span>
                                    </div>
                                </div>

                                {activeLiveClass.prerequisites && activeLiveClass.prerequisites.length > 0 && (
                                <div className="prerequisites-box mt-4">
                                    <h5 className="prereq-title">
                                        <FaClipboardList className="me-2 text-info" />
                                        Session Preparation Checklist:
                                    </h5>
                                    <ul className="prereq-list">
                                        {activeLiveClass.prerequisites.map((pre, idx) => (
                                            <li key={idx}>
                                                <FaCheckCircle className="check-icon" />
                                                <span>{pre}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                )}
                            </div>

                            <div className="col-lg-4 text-center">
                                <div className="meet-action-box">
                                    <div className="google-meet-icon-wrap">
                                        <MdVideoCall className="g-meet-icon" />
                                    </div>
                                    <h4 className="meet-heading text-white">Join via Google Meet</h4>
                                    <p className="meet-subtext">Click the link below to enter the classroom. Ensure your mic is muted on arrival.</p>

                                    <a
                                        href={activeLiveClass.meetingLink || "#"}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="btn-join-meet"
                                    >
                                        <FaGoogle className="google-logo" />
                                        <span>Enter Live Classroom</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                )}

                {/* Weekly Live Class Schedule */}
                <section className="weekly-schedule-section mb-5">
                    <div className="section-header mb-4">
                        <span className="section-tag section-tag--purple">Weekly Planner</span>
                        <h3 className="section-heading">Weekly Live Classes Schedule</h3>
                        <p className="section-subtext">Plan your week accordingly. All sessions start at 7:00 PM IST unless otherwise specified.</p>
                    </div>

                    <div className="schedule-panel glass-panel">
                        {/* Weekday Selector Tabs */}
                        <div className="weekday-tabs-row">
                            {Object.keys(weeklySchedule).length > 0 ? Object.keys(weeklySchedule).map((day) => (
                                <button
                                    key={day}
                                    className={`weekday-tab ${activeDay === day ? 'weekday-tab--active' : ''}`}
                                    onClick={() => setActiveDay(day)}
                                >
                                    {day}
                                </button>
                            )) : ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => (
                                <button key={day} className={`weekday-tab ${activeDay === day ? 'weekday-tab--active' : ''}`} onClick={() => setActiveDay(day)}>{day}</button>
                            ))}
                        </div>

                        {/* Schedule Details Area */}
                        <div className="schedule-details-content py-4">
                            <div className="row g-4">
                                {weeklySchedule[activeDay]?.map((slot, index) => (
                                    <div className="col-md-6" key={index}>
                                        <div className="schedule-slot-card">
                                            <div className="slot-badge-row">
                                                <span className={`slot-badge ${toTrackClass(slot.track)}`}>
                                                    {slot.track}
                                                </span>
                                                <span className="slot-type">{slot.type}</span>
                                            </div>
                                            <h4 className="slot-title mt-3">{slot.topic}</h4>

                                            <div className="slot-meta-row mt-4">
                                                <div className="slot-meta-item">
                                                    <HiOutlineClock className="slot-icon" />
                                                    <span>{slot.time}</span>
                                                </div>
                                                {slot.mentor && (
                                                    <div className="slot-meta-item">
                                                        <FaUser className="slot-icon" />
                                                        <span>{slot.mentor}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {slot.meetingLink && (
                                                <div className="slot-action-row mt-3 pt-3">
                                                    <span className={`slot-link-status ${slot.isActiveNow ? 'live' : ''}`}>
                                                        {slot.isActiveNow ? '🔴 Live Session Active' : '📅 Scheduled Session'}
                                                    </span>
                                                    <a
                                                        href={slot.meetingLink}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="btn-slot-join"
                                                    >
                                                        <FaGoogle /> Join Class
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Recorded Classes Archive */}
                <section className="recordings-section mb-5">
                    <div className="section-header d-flex flex-wrap align-items-end justify-content-between mb-4">
                        <div>
                            <span className="section-tag section-tag--blue">Archives</span>
                            <h3 className="section-heading">Recorded Live Classes</h3>
                            <p className="section-subtext">Browse past recordings, get slides, code files, and review teachings at your own pace.</p>
                        </div>

                        {/* Search inputs */}
                        <div className="archive-search-wrap">
                            <HiOutlineMagnifyingGlass className="search-icon" />
                            <input
                                type="text"
                                placeholder="Search recordings..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="search-input"
                            />
                        </div>
                    </div>

                    {/* Filters and Recordings Grid */}
                    <div className="recordings-panel">
                        {/* Filter Tabs */}
                        <div className="track-filters-row mb-4">
                            {["All", "MERN Stack", "Python", "UI/UX Design"].map((track) => (
                                <button
                                    key={track}
                                    className={`track-filter-btn ${selectedTrack === track ? 'track-filter-btn--active' : ''}`}
                                    onClick={() => setSelectedTrack(track)}
                                >
                                    {track}
                                </button>
                            ))}
                        </div>

                        {/* Grid */}
                        <div className="row g-4">
                            {filteredRecordings.length > 0 ? (
                                filteredRecordings.map((rec) => (
                                    <div className="col-md-6 col-lg-4" key={rec.id}>
                                        <div className="recording-card glass-panel h-100 d-flex flex-column">
                                            <div
                                                className="recording-thumbnail-wrap"
                                                onClick={() => handlePlayRecording(rec)}
                                            >
                                                <div className="thumbnail-placeholder">
                                                    {/* We display a nice dark visual placeholder with a play button overlay */}
                                                    <div className="play-button-overlay">
                                                        <HiOutlinePlay className="play-icon-symbol" />
                                                    </div>
                                                    <span className="rec-duration-badge">
                                                        <HiOutlineClock className="me-1" /> {rec.duration}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="recording-body p-4 flex-grow-1 d-flex flex-column justify-content-between">
                                                <div>
                                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                                        <span className={`rec-track-badge ${toTrackClass(rec.track)}`}>
                                                            {rec.track}
                                                        </span>
                                                        <span className="rec-date">{rec.date}</span>
                                                    </div>
                                                    <h4 className="rec-title">{rec.title}</h4>
                                                </div>

                                                <div className="rec-footer-row mt-4 pt-3">
                                                    <button
                                                        className="btn-watch-rec"
                                                        onClick={() => handlePlayRecording(rec)}
                                                    >
                                                        <HiOutlinePlay className="me-1" /> Watch Recording
                                                    </button>

                                                    <div className="rec-resources-buttons">
                                                        <a href={rec.github} className="btn-resource-icon" title="View Source Code">
                                                            <FaLaptopCode />
                                                        </a>
                                                        <a href={rec.notes} className="btn-resource-icon" title="Download Notes">
                                                            <HiArrowDownTray />
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-12 text-center py-5">
                                    <div className="no-recordings-box glass-panel py-5">
                                        <HiOutlineMagnifyingGlass className="fs-1 text-secondary mb-3" />
                                        <h4 className="text-white">No Recordings Found</h4>
                                        <p className="text-secondary">Try adjusting your filters or search keywords.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Live Class FAQ Section */}
                <section className="faq-section mb-5">
                    <div className="section-header text-center mb-4">
                        <span className="section-tag section-tag--cyan">FAQs</span>
                        <h3 className="section-heading">Frequently Asked Questions</h3>
                        <p className="section-subtext">Everything you need to know about joining, viewing, and participating in Dev Coaching live classes.</p>
                    </div>

                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <div className="faq-accordion-wrap">
                                {FAQS.map((faq) => {
                                    const isOpen = openFaq === faq.id;
                                    return (
                                        <div key={faq.id} className="faq-item-card glass-panel mb-3">
                                            <button
                                                className="faq-question-btn"
                                                onClick={() => toggleFaq(faq.id)}
                                                aria-expanded={isOpen}
                                            >
                                                <span className="faq-q-text">{faq.question}</span>
                                                {isOpen ? <HiChevronUp className="faq-arrow" /> : <HiChevronDown className="faq-arrow" />}
                                            </button>

                                            <div className={`faq-answer-collapse ${isOpen ? 'faq-answer-collapse--open' : ''}`}>
                                                <div className="faq-answer-content">
                                                    <p className="faq-a-text">{faq.answer}</p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* Video Modal Player Overlay */}
            {playingVideo && (
                <div className="video-player-modal" onClick={closeVideoModal}>
                    <div className="video-modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
                        <div className="video-modal-header">
                            <div>
                                <span className="badge-modal-track">{playingVideo.track}</span>
                                <h4 className="modal-title mt-2 text-white">{playingVideo.title}</h4>
                            </div>
                            <button className="btn-close-modal" onClick={closeVideoModal}>
                                <HiOutlineXMark />
                            </button>
                        </div>

                        <div className="video-modal-body">
                            <video
                                ref={modalVideoRef}
                                className="modal-video-player"
                                controls
                                src={playingVideo.videoSrc}
                            />
                        </div>

                        <div className="video-modal-footer">
                            <div className="d-flex align-items-center justify-content-between w-100">
                                <span className="modal-meta-date text-secondary">Recorded on: {playingVideo.date}</span>
                                <div className="modal-actions d-flex gap-3">
                                    <a href={playingVideo.github} className="btn-modal-action">
                                        <FaLaptopCode className="me-2" /> Code Repo
                                    </a>
                                    <a href={playingVideo.notes} className="btn-modal-action btn-modal-action--highlight">
                                        <HiArrowDownTray className="me-2" /> Lecture Notes
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default JoinLive;