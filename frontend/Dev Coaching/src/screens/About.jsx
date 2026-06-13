import './About.css';
import { useEffect } from 'react';
import { MdVerified } from 'react-icons/md';
import { FaCode } from 'react-icons/fa6';
import { FaBriefcase, FaGraduationCap } from 'react-icons/fa';
import { HiLightningBolt } from 'react-icons/hi';
import { IoSchool } from 'react-icons/io5';

const LEADERSHIP = [
    {
        name: "Chirag Vishawkarma",
        role: "Founder & CEO",
        bio: "Visionary developer and educational leader dedicated to transforming how computer science and web development are taught. Built DevCoaching to bridge the gap between academic theory and real-world software engineering.",
        avatar: "CV",
        type: "founder",
        stats: [
            { label: "Courses Created", value: "10+" },
            { label: "Students Mentored", value: "5,000+" }
        ]
    },
    {
        name: "Suresh Suthar",
        role: "Co-Founder & CTO",
        bio: "Former Senior Software Engineer at Google and tech architect. Sarah drives the curriculum quality and technical infrastructure at DevCoaching, ensuring students learn production-grade standards.",
        avatar: "SS",
        type: "cofounder",
        stats: [
            { label: "Industry Exp", value: "12+ Yrs" },
            { label: "Open Source Contrib", value: "50+" }
        ]
    }
];

const TEACHERS = [
    {
        name: "Johan Gao",
        role: "Senior Python & Data Science Teacher",
        bio: "An industry veteran with over 8 years of Python backend and machine learning experience. Tutors students on building robust APIs, pandas data models, and Flask architectures.",
        avatar: "JG",
        type: "teacher",
        stats: [
            { label: "Rating", value: "4.8/5" },
            { label: "Experience", value: "8+ Yrs" }
        ]
    },
    {
        name: "Aria Patel",
        role: "Senior Frontend & React Specialist",
        bio: "Frontend enthusiast and user experience advocate. Aria specializes in teaching JavaScript fundamentals, CSS layout architecture, and single-page applications built with React.",
        avatar: "AP",
        type: "teacher",
        stats: [
            { label: "Rating", value: "4.9/5" },
            { label: "Experience", value: "6+ Yrs" }
        ]
    },
    {
        name: "Marcus Vance",
        role: "Backend Architect & Database Lead",
        bio: "Database administrator and server-side expert. Marcus covers Node.js, Express APIs, MongoDB optimization, and security practices required for enterprise systems.",
        avatar: "MV",
        type: "teacher",
        stats: [
            { label: "Rating", value: "4.7/5" },
            { label: "Experience", value: "10 Yrs" }
        ]
    }
];

const PILLARS = [
    {
        icon: FaCode,
        title: "Developer Only Focus",
        desc: "We don't teach generic subjects. DevCoaching is laser-focused on programming languages, frontend/backend frameworks, and UI/UX design tools."
    },
    {
        icon: HiLightningBolt,
        title: "Interactive Live Classes",
        desc: "We stream our classes live over Google Meet. You write code alongside the instructor, ask doubts in real-time, and get immediate feedback."
    },
    {
        icon: IoSchool,
        title: "Doubt Solving & Support",
        desc: "Students have direct 1:1 chat support with teachers to debug their code, work through course assignments, and review exam prep materials."
    }
];

const STATS = [
    { number: "98%", label: "Student Satisfaction" },
    { number: "10,000+", label: "Live Hours Taught" },
    { number: "15+", label: "Hands-on Projects" },
    { number: "24/7", label: "Mentor Doubt Support" }
];

function About() {
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("reveal-visible");
                    }
                });
            },
            { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
        );

        document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    return (
        <div className="about-page">
            <div className="container">
                {/* Hero Header */}
                <section className="about-hero reveal">
                    <div className="about-hero__shapes" aria-hidden="true" />
                    <span className="about-hero__label">About Us</span>
                    <h1 className="about-hero__title">
                        Empowering Developers to <span>Build the Future</span>
                    </h1>
                    <p className="about-hero__subtitle">
                        At DevCoaching, we provide interactive live-mentored courses on programming,
                        architecture, and design, helping you level up your career.
                    </p>
                </section>

                {/* Our Story / Mission */}
                <section className="about-story reveal reveal-delay-1">
                    <div className="about-story__card">
                        <h2 className="about-story__title">Our Story & Mission</h2>
                        <p className="about-story__text">
                            DevCoaching was founded with a single mission: to provide the highest-quality, most practical educational platform for aspiring and professional software developers alike. Traditional coding tutorials are passive; we believe in interactive, hands-on learning.
                        </p>
                        <p className="about-story__text">
                            By teaching exclusively computer science and design stacks (React, Python, Node.js, and Figma UI/UX) through live video sessions, real assignment papers, and direct communication lines with teachers, we ensure you gain the confidence to code and design production-level applications.
                        </p>
                    </div>
                </section>

                {/* Pillars Section */}
                <section className="about-pillars">
                    <h2 className="about-section-title reveal">The DevCoaching Core</h2>
                    <p className="about-section-subtitle reveal">What makes our educational platform uniquely effective.</p>
                    <div className="row g-4">
                        {PILLARS.map((pillar, i) => {
                            const Icon = pillar.icon;
                            return (
                                <div className={`col-md-4 reveal reveal-delay-${i + 1}`} key={pillar.title}>
                                    <div className="pillar-card">
                                        <div className="pillar-card__icon">
                                            <Icon />
                                        </div>
                                        <h4 className="pillar-card__title">{pillar.title}</h4>
                                        <p className="pillar-card__desc">{pillar.desc}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Leadership Section */}
                <section className="about-grid">
                    <h2 className="about-section-title reveal">Leadership Team</h2>
                    <p className="about-section-subtitle reveal">Meet the visionaries guiding our curriculum and mission.</p>
                    <div className="row g-4 justify-content-center">
                        {LEADERSHIP.map((member, i) => (
                            <div className={`col-md-6 col-lg-5 reveal reveal-delay-${i + 1}`} key={member.name}>
                                <div className="profile-card">
                                    <div className="profile-card__avatar-wrap">
                                        <div className={`profile-card__avatar profile-card__avatar--${member.type}`}>
                                            {member.avatar}
                                        </div>
                                        <span className={`profile-card__badge profile-card__badge--${member.type}`}>
                                            {member.type}
                                        </span>
                                    </div>
                                    <h3 className="profile-card__name">
                                        {member.name}
                                        <MdVerified className="text-info" />
                                    </h3>
                                    <span className="profile-card__role">{member.role}</span>
                                    <p className="profile-card__bio">{member.bio}</p>
                                    <div className="profile-card__stats">
                                        {member.stats.map((st) => (
                                            <div className="profile-card__stat-item text-center" key={st.label}>
                                                <span className="profile-card__stat-val">{st.value}</span>
                                                <span className="profile-card__stat-lbl">{st.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Teachers Section */}
                <section className="about-grid">
                    <h2 className="about-section-title reveal">Our Senior Mentors</h2>
                    <p className="about-section-subtitle reveal">Learn directly from engineers with years of production experience.</p>
                    <div className="row g-4 justify-content-center">
                        {TEACHERS.map((teacher, i) => (
                            <div className={`col-md-6 col-lg-4 reveal reveal-delay-${i + 1}`} key={teacher.name}>
                                <div className="profile-card">
                                    <div className="profile-card__avatar-wrap">
                                        <div className="profile-card__avatar profile-card__avatar--teacher">
                                            {teacher.avatar}
                                        </div>
                                        <span className="profile-card__badge profile-card__badge--teacher">
                                            Mentor
                                        </span>
                                    </div>
                                    <h3 className="profile-card__name">{teacher.name}</h3>
                                    <span className="profile-card__role">{teacher.role}</span>
                                    <p className="profile-card__bio">{teacher.bio}</p>
                                    <div className="profile-card__stats">
                                        {teacher.stats.map((st) => (
                                            <div className="profile-card__stat-item text-center" key={st.label}>
                                                <span className="profile-card__stat-val">{st.value}</span>
                                                <span className="profile-card__stat-lbl">{st.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Stats Row */}
                <section className="about-stats-row reveal">
                    {STATS.map((stat) => (
                        <div className="about-stat-counter" key={stat.label}>
                            <div className="about-stat-counter__number">{stat.number}</div>
                            <div className="about-stat-counter__label">{stat.label}</div>
                        </div>
                    ))}
                </section>
            </div>
        </div>
    );
}

export default About;