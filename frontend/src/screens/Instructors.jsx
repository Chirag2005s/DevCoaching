import './Instructors.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { FiUsers, FiMessageSquare, FiSearch } from 'react-icons/fi';
import { FaPhoneAlt } from 'react-icons/fa';
import { MdEmail, MdVerified } from 'react-icons/md';
import { FcRating } from 'react-icons/fc';
import { IoSchool } from 'react-icons/io5';
import { SlCalender } from 'react-icons/sl';
import { PiBagSimpleFill } from 'react-icons/pi';
import { CgGenderFemale } from 'react-icons/cg';
import { HiSignal } from 'react-icons/hi2';
import { FaArrowRightLong } from 'react-icons/fa6';

const CARD_GRADIENTS = [
    'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
    'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
    'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    'linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)',
    'linear-gradient(135deg, #f43f5e 0%, #be123c 100%)',
    'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
];

function Instructors() {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const [activeModal, setActiveModal] = useState(null);
    const navigate = useNavigate();

    /* ── Fetch teachers ── */
    useEffect(() => {
        axios
            .get(`${import.meta.env.VITE_API_URL}/api/Teacher`)
            .then((res) => {
                const raw = res.data?.teachers || [];
                const formatted = raw.map((t, i) => ({
                    id: t._id || t.ID,
                    name: t.Name,
                    role: t.Title,
                    bio: t.Discprition || '',
                    avatar: t.Logo || t.Name?.substring(0, 2).toUpperCase() || 'T',
                    experience: t.Exprience,
                    rating: t.Rating,
                    qualification: t.Qualification,
                    email: t.Email,
                    phone: t.PhoneNo,
                    gender: t.Gender,
                    joiningDate: t.JoinDate,
                    isActive: t.Status === 'active',
                    gradient: CARD_GRADIENTS[i % CARD_GRADIENTS.length],
                }));
                setTeachers(formatted);
            })
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    /* ── Scroll-reveal observer ── */
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('reveal-visible');
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
        );
        const tid = setTimeout(() => {
            document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
        }, 50);
        return () => {
            clearTimeout(tid);
            observer.disconnect();
        };
    }, [teachers, search, filter]);

    /* ── Close modal on Escape ── */
    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') setActiveModal(null); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);

    /* ── Derived data ── */
    const filtered = teachers.filter((t) => {
        const matchSearch =
            t.name?.toLowerCase().includes(search.toLowerCase()) ||
            t.role?.toLowerCase().includes(search.toLowerCase());
        const matchFilter =
            filter === 'all' ||
            (filter === 'active' && t.isActive) ||
            (filter === 'inactive' && !t.isActive);
        return matchSearch && matchFilter;
    });

    const activeCount = teachers.filter((t) => t.isActive).length;
    const avgRating =
        teachers.length > 0
            ? (teachers.reduce((s, t) => s + Number(t.rating || 0), 0) / teachers.length).toFixed(1)
            : '—';

    return (
        <div className="instructors-page">

            {/* ── Hero ── */}
            <section className="instr-hero">
                <div className="instr-hero__glow" aria-hidden="true" />
                <div className="container text-center">
                    <span className="instr-hero__label hero-animate">
                        <FiUsers style={{ marginRight: 6, verticalAlign: 'middle' }} />
                        Our Instructors
                    </span>

                    <h1 className="instr-hero__title hero-animate hero-animate-delay-1">
                        Learn from the <span>Best Mentors</span>
                        <br className="d-none d-md-block" />
                        in the Industry
                    </h1>

                    <p className="instr-hero__subtitle hero-animate hero-animate-delay-2">
                        Every Dev Coaching instructor is a working software professional with
                        real-world experience — teaching live, building with you, and available
                        for 1:1 support.
                    </p>

                    {/* Stats bar */}
                    <div className="instr-hero__stats hero-animate hero-animate-delay-3">
                        <div className="instr-hero-stat">
                            <span className="instr-hero-stat__num">
                                {loading ? '…' : teachers.length}
                            </span>
                            <span className="instr-hero-stat__lbl">Total Mentors</span>
                        </div>
                        <div className="instr-hero-stat__divider" />
                        <div className="instr-hero-stat">
                            <span className="instr-hero-stat__num">
                                {loading ? '…' : activeCount}
                            </span>
                            <span className="instr-hero-stat__lbl">
                                <HiSignal style={{ color: '#4ade80', marginRight: 4 }} />
                                Active Now
                            </span>
                        </div>
                        <div className="instr-hero-stat__divider" />
                        <div className="instr-hero-stat">
                            <span className="instr-hero-stat__num">
                                {loading ? '…' : avgRating}
                            </span>
                            <span className="instr-hero-stat__lbl">Avg Rating</span>
                        </div>
                        <div className="instr-hero-stat__divider" />
                        <div className="instr-hero-stat">
                            <span className="instr-hero-stat__num">10,000+</span>
                            <span className="instr-hero-stat__lbl">Hours Taught</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Search & Filter ── */}
            <section className="instr-controls">
                <div className="container">
                    <div className="instr-controls__inner reveal">
                        <div className="instr-search-wrap">
                            <FiSearch className="instr-search-icon" />
                            <input
                                id="instructor-search"
                                type="text"
                                className="instr-search-input"
                                placeholder="Search by name or specialisation…"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="instr-filter-tabs">
                            {['all', 'active', 'inactive'].map((f) => (
                                <button
                                    key={f}
                                    id={`filter-${f}`}
                                    className={`instr-filter-tab ${filter === f ? 'instr-filter-tab--active' : ''}`}
                                    onClick={() => setFilter(f)}
                                >
                                    {f === 'all' && <><FiUsers style={{ marginRight: 6 }} />All</>}
                                    {f === 'active' && <><HiSignal style={{ marginRight: 6, color: '#4ade80' }} />Active</>}
                                    {f === 'inactive' && <>Offline</>}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Cards Grid — same design as Home teacher section ── */}
            <section className="tech-info-section tech-info-section--alt teacher-3d-section">
                <div className="container">

                    {/* Section header */}
                    <div className="teacher-section-header text-center mb-5 reveal">
                        <span className="section-label section-label--video">Our Mentors</span>
                        <h2 className="tech-info-title text-center mt-2">
                            Meet Every Senior Mentor
                        </h2>
                        <p className="tech-info-desc text-center mx-auto" style={{ maxWidth: '600px' }}>
                            Learn directly from industry experts who teach live, support you 1:1,
                            and help build your developer profile.
                        </p>
                    </div>

                    {/* Loading */}
                    {loading && (
                        <div className="instr-loading">
                            <div className="instr-loading__spinner" />
                            <p>Loading mentors…</p>
                        </div>
                    )}

                    {/* Empty state */}
                    {!loading && filtered.length === 0 && (
                        <div className="instr-empty reveal">
                            <FiUsers className="instr-empty__icon" />
                            <h3>No instructors found</h3>
                            <p>Try adjusting your search or filter.</p>
                        </div>
                    )}

                    {/* ── Cards — exact same markup as Home.jsx teacher cards ── */}
                    {!loading && filtered.length > 0 && (
                        <div className="row g-4 justify-content-center">
                            {filtered.map((teacher, i) => (
                                <div
                                    className={`col-lg-4 col-md-6 col-sm-12 reveal reveal-delay-${(i % 3) + 1}`}
                                    key={teacher.id}
                                >
                                    <div className="teacher-3d-card-wrapper">
                                        <div className="teacher-3d-card">

                                            {/* Status Badge */}
                                            <div className="teacher-status-badge">
                                                <span className={`status-dot ${teacher.isActive ? 'status-dot--active' : 'status-dot--inactive'}`} />
                                                <span className="status-text">
                                                    {teacher.isActive ? 'Active' : 'Offline'}
                                                </span>
                                            </div>

                                            {/* Card content */}
                                            <div className="teacher-card-content">

                                                {/* Avatar */}
                                                <div className="teacher-avatar-wrap" style={{ background: teacher.gradient }}>
                                                    <span className="teacher-avatar-text">{teacher.avatar}</span>
                                                </div>

                                                {/* Teacher Header */}
                                                <h4 className="teacher-name mt-3">
                                                    {teacher.name}
                                                    {teacher.isActive && (
                                                        <MdVerified className="verification-icon ms-2" />
                                                    )}
                                                </h4>
                                                <p className="teacher-role">{teacher.role}</p>

                                                {/* Bio Preview */}
                                                <p className="teacher-bio-preview">
                                                    {teacher.bio.substring(0, 95)}...
                                                </p>

                                                {/* Stats row */}
                                                <div className="teacher-stats-row my-3">
                                                    <div className="teacher-stat">
                                                        <span className="stat-label">Experience</span>
                                                        <span className="stat-val">{teacher.experience}</span>
                                                    </div>
                                                    <div className="teacher-stat-divider" />
                                                    <div className="teacher-stat">
                                                        <span className="stat-label">Rating</span>
                                                        <span className="stat-val">
                                                            <FcRating className="me-1" style={{ fontSize: '1.1rem' }} />
                                                            {teacher.rating}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Action buttons */}
                                                <div className="teacher-action-buttons">
                                                    <button
                                                        className="action-btn action-btn--msg"
                                                        onClick={() => {
                                                            const bubble = document.querySelector('#chat-bubble-btn');
                                                            if (bubble) bubble.click();
                                                        }}
                                                        title="Message Mentor"
                                                    >
                                                        <FiMessageSquare /> Message
                                                    </button>
                                                    <a
                                                        href={`tel:${teacher.phone}`}
                                                        className="action-btn action-btn--call"
                                                        title="Call Mentor"
                                                    >
                                                        <FaPhoneAlt /> Call
                                                    </a>
                                                    <a
                                                        href={`mailto:${teacher.email}`}
                                                        className="action-btn action-btn--email"
                                                        title="Email Mentor"
                                                    >
                                                        <MdEmail /> Email
                                                    </a>
                                                </div>

                                                {/* View Details button */}
                                                <button
                                                    className="view-details-btn mt-3"
                                                    onClick={() => setActiveModal(teacher)}
                                                >
                                                    View Details
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* ── CTA ── */}
            <div className="container">
                <section className="instr-cta reveal">
                    <div className="instr-cta__glow" aria-hidden="true" />
                    <IoSchool className="instr-cta__icon" />
                    <h2 className="instr-cta__title">Ready to start learning?</h2>
                    <p className="instr-cta__text">
                        Enrol in a course and get direct access to your chosen mentor — live classes,
                        1:1 chat support, and real exam papers included.
                    </p>
                    <div className="d-flex flex-wrap justify-content-center gap-3">
                        <button className="header_btn" onClick={() => navigate('/course')}>
                            Explore Courses <FaArrowRightLong />
                        </button>
                        <button
                            className="header_btn header_btn-outline"
                            onClick={() => navigate('/join-live')}
                        >
                            <HiSignal style={{ color: '#4ade80', marginRight: 6 }} />
                            Join a Live Class
                        </button>
                    </div>
                </section>
            </div>

            {/* ── Details Modal — exact same markup as Home.jsx ── */}
            {activeModal && createPortal(
                <div className="teacher-modal-overlay" onClick={() => setActiveModal(null)}>
                    <div className="teacher-modal-card" onClick={(e) => e.stopPropagation()}>
                        <button
                            className="teacher-modal-close"
                            onClick={() => setActiveModal(null)}
                        >
                            &times;
                        </button>

                        <div
                            className="teacher-modal-header"
                            style={{ background: activeModal.gradient }}
                        >
                            <div className="teacher-modal-avatar">{activeModal.avatar}</div>
                            <div className="teacher-modal-header-info">
                                <h3 className="modal-teacher-name text-white mb-0">
                                    {activeModal.name}
                                    {activeModal.isActive && (
                                        <MdVerified className="verification-icon ms-2" />
                                    )}
                                </h3>
                                <p className="modal-teacher-role text-light mb-0">
                                    {activeModal.role}
                                </p>
                            </div>
                        </div>

                        <div className="teacher-modal-body">
                            <div className="modal-status-section mb-4">
                                <span
                                    className={`status-badge-pill ${activeModal.isActive
                                        ? 'status-badge-pill--active'
                                        : 'status-badge-pill--inactive'
                                        }`}
                                >
                                    <span className={`status-dot ${activeModal.isActive
                                        ? 'status-dot--active'
                                        : 'status-dot--inactive'
                                        }`}
                                    />
                                    {activeModal.isActive ? 'Currently Active' : 'Offline'}
                                </span>
                                <span className="modal-teacher-id text-secondary">
                                    ID: {activeModal.id}
                                </span>
                            </div>

                            <h5 className="modal-section-title">Biography</h5>
                            <p className="modal-bio text-secondary mb-4">{activeModal.bio}</p>

                            <h5 className="modal-section-title">Professional Profile</h5>
                            <div className="modal-info-grid mb-4">
                                <div className="modal-info-item">
                                    <IoSchool className="modal-info-icon" />
                                    <div>
                                        <span className="info-title">Qualification</span>
                                        <span className="info-value text-white">
                                            {activeModal.qualification}
                                        </span>
                                    </div>
                                </div>
                                <div className="modal-info-item">
                                    <SlCalender className="modal-info-icon" />
                                    <div>
                                        <span className="info-title">Joining Date</span>
                                        <span className="info-value text-white">
                                            {activeModal.joiningDate
                                                ? new Date(activeModal.joiningDate).toLocaleDateString('en-IN', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })
                                                : '—'}
                                        </span>
                                    </div>
                                </div>
                                <div className="modal-info-item">
                                    <CgGenderFemale className="modal-info-icon" />
                                    <div>
                                        <span className="info-title">Gender</span>
                                        <span className="info-value text-white">
                                            {activeModal.gender}
                                        </span>
                                    </div>
                                </div>
                                <div className="modal-info-item">
                                    <PiBagSimpleFill className="modal-info-icon" />
                                    <div>
                                        <span className="info-title">Experience</span>
                                        <span className="info-value text-white">
                                            {activeModal.experience}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <h5 className="modal-section-title">Contact & Actions</h5>
                            <div className="modal-contact-grid mb-4">
                                <a
                                    href={`tel:${activeModal.phone}`}
                                    className="modal-contact-item"
                                >
                                    <FaPhoneAlt
                                        className="modal-contact-icon"
                                        style={{ color: '#378ed5' }}
                                    />
                                    <div>
                                        <span className="contact-title">Phone</span>
                                        <span className="contact-value text-white">
                                            {activeModal.phone}
                                        </span>
                                    </div>
                                </a>
                                <a
                                    href={`mailto:${activeModal.email}`}
                                    className="modal-contact-item"
                                >
                                    <MdEmail
                                        className="modal-contact-icon"
                                        style={{ color: '#5baf6e' }}
                                    />
                                    <div>
                                        <span className="contact-title">Email</span>
                                        <span className="contact-value text-white">
                                            {activeModal.email}
                                        </span>
                                    </div>
                                </a>
                            </div>

                            <div className="modal-footer-actions">
                                <button
                                    className="modal-action-btn modal-action-btn--msg"
                                    onClick={() => {
                                        setActiveModal(null);
                                        const bubble = document.querySelector('#chat-bubble-btn');
                                        if (bubble) bubble.click();
                                    }}
                                >
                                    <FiMessageSquare className="me-2" /> Send Message
                                </button>
                                <button
                                    className="modal-action-btn modal-action-btn--close"
                                    onClick={() => setActiveModal(null)}
                                >
                                    Close Profile
                                </button>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}

export default Instructors;