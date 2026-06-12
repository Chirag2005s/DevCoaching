import "./Home.css";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowRightLong } from "react-icons/fa6";
import { HiSignal } from "react-icons/hi2";
import { MdVerified } from "react-icons/md";
import { SlCalender } from "react-icons/sl";
import { PiBagSimpleFill } from "react-icons/pi";
import { FcRating } from "react-icons/fc";
import { IoSchool } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import { CgGenderFemale } from "react-icons/cg";
import { FaCode } from "react-icons/fa6";
import { FiUsers } from "react-icons/fi";
import { LiaRupeeSignSolid } from "react-icons/lia";
import { FaGithub } from "react-icons/fa";
import { FaGitAlt } from "react-icons/fa6";
import { VscVscode } from "react-icons/vsc";
import { FaPython } from "react-icons/fa";
import { BiLogoFlask } from "react-icons/bi";
import { SiPandas } from "react-icons/si";
import { SiPycharm } from "react-icons/si";
import { FaNodeJs } from "react-icons/fa";
import { SiExpress } from "react-icons/si";
import { DiMongodb } from "react-icons/di";
import { SiPostman } from "react-icons/si";
import { FaReact } from "react-icons/fa";
import { SiJavascript } from "react-icons/si";
import { TbBrandFigma, TbBrandAdobeXd, TbBrandSketch, TbBrandAdobePhotoshop, TbBrandAdobeIllustrator, TbBrandGithub } from "react-icons/tb";

const LANGUAGES = [
    {
        name: "Python",
        tag: "Backend & Data",
        tagClass: "language-card__tag--python",
        iconClass: "language-card__icon--python",
        icon: FaPython,
        description: "Build apps, automate tasks, and analyze data with the world's most beginner-friendly language.",
    },
    {
        name: "JavaScript & React",
        tag: "Frontend",
        tagClass: "language-card__tag--javascript",
        iconClass: "language-card__icon--javascript",
        icon: SiJavascript,
        description: "Create dynamic UIs and modern single-page applications used by top tech companies.",
    },
    {
        name: "Node.js & Backend",
        tag: "Server Side",
        tagClass: "language-card__tag--backend",
        iconClass: "language-card__icon--backend",
        icon: FaNodeJs,
        description: "Power APIs, databases, and full-stack MERN applications with scalable backend skills.",
    },
];

const PYTHON_TOPICS = [
    "Python fundamentals & OOP concepts",
    "Web development with Flask",
    "Data analysis using Pandas & NumPy",
    "File handling, APIs & automation scripts",
    "Real-world projects & exam preparation",
];

const REACT_TOPICS = [
    " MERN stack fundamentals & JavaScript concepts",
    "Frontend development with React",
    "Backend development with Node.js & Express",
    "Database management with MongoDB",
    "Real-world full-stack projects & interview preparation"
];

const PYTHON_TOOLS = [
    { icon: FaPython, label: "Python" },
    { icon: FaGithub, label: "GitHub" },
    { icon: FaGitAlt, label: "Git" },
    { icon: VscVscode, label: "VS Code" },
    { icon: BiLogoFlask, label: "Flask" },
    { icon: SiPandas, label: "Pandas" },
    { icon: SiPycharm, label: "PyCharm" },
];

const REACT_TOOLS = [
    { icon: FaReact, label: "React" },
    { icon: FaNodeJs, label: "Node.js" },
    { icon: SiExpress, label: "Express" },
    { icon: DiMongodb, label: "MongoDB" },
    { icon: FaGithub, label: "GitHub" },
    { icon: FaGitAlt, label: "Git" },
    { icon: SiPostman, label: "Postman" },
];

const UIUX_TOPICS = [
    "User Research, Wireframes & Interaction Flows",
    "High-Fidelity Prototyping & Design Systems",
    "Web App Layouts & Mobile App Design (iOS/Android)",
    "Figma components, auto-layout & variables",
    "Micro-interactions, animation & dev handoff"
];

const UIUX_TOOLS = [
    { icon: TbBrandFigma, label: "Figma" },
    { icon: TbBrandAdobeXd, label: "Adobe XD" },
    { icon: TbBrandSketch, label: "Sketch" },
    { icon: TbBrandAdobePhotoshop, label: "Photoshop" },
    { icon: TbBrandAdobeIllustrator, label: "Illustrator" },
    { icon: TbBrandGithub, label: "Handoff" }
];

const DEMO_VIDEO_SRC =
    "https://assets.mixkit.co/videos/preview/mixkit-person-writing-code-on-laptop-4908-large.mp4";

const REVIEWS = [
    {
        name: "Arjun Sharma",
        course: "Python Track",
        avatar: "AS",
        rating: 5,
        text: "Johan sir explains every concept so clearly! I went from zero Python knowledge to building Flask APIs in just 2 months. The live sessions on Google Meet are incredibly interactive.",
        color: "#fbbf24",
    },
    {
        name: "Priya Patel",
        course: "React + JavaScript",
        avatar: "PP",
        rating: 5,
        text: "The React course is absolutely top-notch. I built my first full SPA in week 3! The mentor is patient and always available for doubts. Highly recommend to anyone serious about frontend.",
        color: "#61dafb",
    },
    {
        name: "Rohit Verma",
        course: "Full-Stack MERN",
        avatar: "RV",
        rating: 5,
        text: "Best investment I made this year. The MERN course gave me everything — Node, Express, MongoDB, React. I landed a job within 3 months of completing it. Thank you Dev Coaching!",
        color: "#4ade80",
    },
    {
        name: "Sneha Iyer",
        course: "Python Track",
        avatar: "SI",
        rating: 5,
        text: "The Pandas & NumPy module alone was worth it for my data science interviews. Real exam papers are a game-changer. I cleared 2 university exams with top marks!",
        color: "#fbbf24",
    },
    {
        name: "Karan Mehta",
        course: "React + JavaScript",
        avatar: "KM",
        rating: 5,
        text: "I was skeptical about online coaching but Dev Coaching proved me wrong. Live coding sessions feel like sitting next to a senior dev. The recordings are a lifesaver for revision.",
        color: "#61dafb",
    },
    {
        name: "Divya Nair",
        course: "Full-Stack MERN",
        avatar: "DN",
        rating: 4,
        text: "Completed the MERN stack course and built 3 full projects for my portfolio. The teacher's communication style is amazing — never felt lost even in complex topics like MongoDB aggregation.",
        color: "#4ade80",
    },
    {
        name: "Aditya Singh",
        course: "Python Track",
        avatar: "AD",
        rating: 5,
        text: "Started with zero coding background. Now I can automate tasks, scrape websites and build web apps with Flask. The 1:1 doubt sessions make all the difference!",
        color: "#fbbf24",
    },
    {
        name: "Meera Krishnan",
        course: "React + JavaScript",
        avatar: "MK",
        rating: 5,
        text: "The free trial convinced me immediately. By week 2 I was hooked. Johan sir's teaching style is clear, structured, and genuinely engaging. Worth every rupee!",
        color: "#61dafb",
    },
];

function StarRating({ count }) {
    return (
        <div className="review-stars">
            {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={i < count ? "star star--filled" : "star star--empty"}>★</span>
            ))}
        </div>
    );
}

function isFreeCourse(course) {
    const status = course.CourseStatus?.toLowerCase?.();
    if (status === "free") return true;
    if (status === "paid") return false;
    return Number(course.Price) === 0;
}

function Home() {
    const [course, setCourse] = useState([]);
    const navigate = useNavigate();
    const videoRef = useRef(null);

    useEffect(() => {
        axios
            .get("http://localhost:9000/api/Course")
            .then((res) => setCourse(res.data?.course || []));
    }, []);

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
    }, [course]);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const videoObserver = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    video.play().catch(() => { });
                } else {
                    video.pause();
                }
            },
            { threshold: 0.35 }
        );

        videoObserver.observe(video);
        return () => videoObserver.disconnect();
    }, []);

    return (
        <div className="home-page">
            {/* Hero */}
            <section className="header_section">
                <div className="container text-center">
                    <p 
                        className="header_Signal hero-animate mb-4" 
                        onClick={() => navigate("/join-live")}
                        style={{ cursor: "pointer" }}
                    >
                        <HiSignal style={{ color: "green", fontSize: 18 }} />
                        1 live class happening now
                    </p>

                    <h1 className="hero-title hero-animate hero-animate-delay-1">
                        Level up your <span>developer career</span>
                        <br className="d-none d-md-block" /> with senior mentors.
                    </h1>

                    <p className="hero-subtitle hero-animate hero-animate-delay-2 mt-4">
                        Dev Coaching is exclusively for developer subjects. Live classes
                        over Google Meet, real exam papers, and direct chat with your teacher.
                    </p>

                    <div className="d-flex flex-wrap justify-content-center gap-3 mt-5 hero-animate hero-animate-delay-3 hero-btns">
                        <button className="header_btn" onClick={() => navigate("/course")}>
                            Explore Course
                            <FaArrowRightLong />
                        </button>
                        <button className="header_btn header_btn-outline">
                            Meet The Teacher
                        </button>
                    </div>

                    <hr className="text-secondary mt-5 pt-4" />

                    {/* Why Elite Dev? Section */}
                    <div className="why-elite-section mt-5 pt-4 text-start">
                        <h3 className="why-elite-title mb-4 reveal" style={{ color: "white", fontWeight: 800, fontSize: "1.8rem" }}>
                            Why Elite Dev?
                        </h3>
                        <div className="row g-4">
                            <div className="col-md-4 reveal reveal-delay-1">
                                <div className="Information_live">
                                    <div>
                                        <FaCode className="info-icon" />
                                        <h5 className="info-card-title">Developers Only</h5>
                                        <p className="info-card-text">
                                            React, Python, Node, Backend (MERN), AI Tools — no other subjects.
                                        </p>
                                    </div>
                                    <button className="info-card-btn" onClick={() => navigate("/course")}>
                                        Explore Stack
                                        <FaArrowRightLong className="ms-2" />
                                    </button>
                                </div>
                            </div>
                            <div className="col-md-4 reveal reveal-delay-2">
                                <div className="Information_live">
                                    <div>
                                        <HiSignal className="info-icon" />
                                        <h5 className="info-card-title">Live Classes</h5>
                                        <p className="info-card-text">
                                            Attend live on Google Meet or watch back recordings anytime.
                                        </p>
                                    </div>
                                    <button className="info-card-btn" onClick={() => {
                                        const sec = document.querySelector(".video-showcase-section");
                                        sec?.scrollIntoView({ behavior: "smooth" });
                                    }}>
                                        Watch Demo
                                        <HiSignal className="ms-2" />
                                    </button>
                                </div>
                            </div>
                            <div className="col-md-4 reveal reveal-delay-3">
                                <div className="Information_live">
                                    <div>
                                        <FiUsers className="info-icon" />
                                        <h5 className="info-card-title">Talk to Teachers</h5>
                                        <p className="info-card-text">
                                            Realtime chat for doubts, dues, and 1:1 help from mentors.
                                        </p>
                                    </div>
                                    <button className="info-card-btn" onClick={() => {
                                        const bubble = document.querySelector("#chat-bubble-btn");
                                        if (bubble) bubble.click();
                                    }}>
                                        Chat Now
                                        <FiUsers className="ms-2" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Languages Section */}
            <section className="languages-section">
                <div className="container">
                    <div className="languages-header reveal">
                        <span className="section-label section-label--languages">Programming Languages</span>
                        <h2 className="languages-title">
                            Learn the Languages <span style={{ color: "#14daff" }}>Developers Use</span>
                        </h2>
                        <p className="languages-subtitle">
                            From Python to React and Node.js — master the programming languages
                            that power modern software, taught live by senior mentors.
                        </p>
                    </div>

                    <div className="row g-4 justify-content-center">
                        {LANGUAGES.map((lang, i) => {
                            const Icon = lang.icon;
                            return (
                                <div className={`col-md-6 col-lg-4 reveal reveal-delay-${i + 1}`} key={lang.name}>
                                    <div className="language-card">
                                        <div className={`language-card__icon ${lang.iconClass}`}>
                                            <Icon />
                                        </div>
                                        <span className={`language-card__tag ${lang.tagClass}`}>{lang.tag}</span>
                                        <h4 className="language-card__name">{lang.name}</h4>
                                        <p className="language-card__desc">{lang.description}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Live Class Video Section */}
            <section className="video-showcase-section">
                <div className="container">
                    <div className="row align-items-center g-5">
                        <div className="col-lg-5 reveal">
                            <span className="section-label section-label--video">Live Experience</span>
                            <h2 className="video-showcase__title">
                                Watch How <span>Live Dev Classes</span> Work
                            </h2>
                            <p className="video-showcase__desc">
                                Join real-time coding sessions on Google Meet. Follow along as mentors
                                build projects, debug code, and explain concepts step by step —
                                just like sitting next to a senior developer.
                            </p>
                            <ul className="video-showcase__list">
                                <li>Screen-shared live coding demos</li>
                                <li>Recorded sessions to rewatch anytime</li>
                                <li>Ask doubts directly during class</li>
                            </ul>
                            <button className="header_btn mt-3" onClick={() => navigate("/join-live")}>
                                Join a Live Class
                                <FaArrowRightLong />
                            </button>
                        </div>

                        <div className="col-lg-7 reveal reveal-delay-2">
                            <div className="video-showcase__frame">
                                <div className="video-showcase__glow" />
                                <video
                                    ref={videoRef}
                                    className="video-showcase__player"
                                    muted
                                    loop
                                    playsInline
                                    preload="metadata"
                                >
                                    <source src={DEMO_VIDEO_SRC} type="video/mp4" />
                                </video>
                                <div className="video-showcase__badge">
                                    <HiSignal style={{ color: "#4ade80", fontSize: 14 }} />
                                    Live Coding Session
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Python Information Section */}
            <section className="tech-info-section" style={{ paddingBottom: 160 }}>
                <div className="container">
                    <div className="row align-items-center g-5">
                        <div className="col-lg-6 reveal">
                            <span className="section-label section-label--python">Python Track</span>
                            <h2 className="tech-info-title">Master Python Development</h2>
                            <p className="tech-info-desc">
                                Learn Python from scratch with live mentorship. Build real projects
                                in web development, data science, and automation — taught by senior
                                developers with industry experience.
                            </p>
                            <ul className="tech-topic-list">
                                {PYTHON_TOPICS.map((topic) => (
                                    <li key={topic}>{topic}</li>
                                ))}
                            </ul>
                            <div>
                                <span className="tech-stat-badge">Live Google Meet Classes</span>
                                <span className="tech-stat-badge">Exam Papers Included</span>
                                <span className="tech-stat-badge">1:1 Mentor Support</span>
                            </div>
                        </div>
                        <div className="col-lg-6 reveal reveal-delay-2">
                            <div className="tech-info-card">
                                <div className="tech-icon-wrap tech-icon-wrap--python">
                                    <FaPython style={{ fontSize: 36 }} />
                                </div>
                                <h4 className="text-white mb-3">Python Tools & Stack</h4>
                                <p className="tech-info-desc mb-4">
                                    Industry-standard tools you'll use throughout the course.
                                </p>
                                <div className="tech-tools-grid">
                                    {PYTHON_TOOLS.map(({ icon: Icon, label }) => (
                                        <div className="tech-tool-item" key={label}>
                                            <Icon className="tech-tool-icon" />
                                            <span>{label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row align-items-center g-5" style={{ paddingTop: 150 }}>
                        <div className="col-lg-6 reveal reveal-delay-2">
                            <div className="tech-info-card">
                                <div className="tech-icon-wrap tech-icon-wrap--python">
                                    <FaReact style={{ fontSize: 36 }} />
                                </div>
                                <h4 className="text-white mb-3">MERN Tools & Stack</h4>
                                <p className="tech-info-desc mb-4">
                                    Industry-standard tools you'll use throughout the course.
                                </p>
                                <div className="tech-tools-grid">
                                    {REACT_TOOLS.map(({ icon: Icon, label }) => (
                                        <div className="tech-tool-item" key={label}>
                                            <Icon className="tech-tool-icon" />
                                            <span>{label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 reveal">
                            <span className="section-label section-label--python">MERN Track</span>
                            <h2 className="tech-info-title">Master The MERN Stack</h2>
                            <p className="tech-info-desc">
                                Learn MERN stack from scratch with live mentorship.
                                Build real projects in full-stack web development, REST
                                APIs, React apps, and database-driven
                                automation — taught by senior developers with industry
                                experience.
                            </p>
                            <ul className="tech-topic-list">
                                {REACT_TOPICS.map((topic) => (
                                    <li key={topic}>{topic}</li>
                                ))}
                            </ul>
                            <div>
                                <span className="tech-stat-badge">Live Google Meet Classes</span>
                                <span className="tech-stat-badge">Exam Papers Included</span>
                                <span className="tech-stat-badge">1:1 Mentor Support</span>
                            </div>
                        </div>
                    </div>

                    <div className="row align-items-center g-5" style={{ paddingTop: 150 }}>
                        <div className="col-lg-6 reveal">
                            <span className="section-label section-label--uiux">UI/UX Design Track</span>
                            <h2 className="tech-info-title">Master UI/UX Design</h2>
                            <p className="tech-info-desc">
                                Learn the principles of modern user interface and user experience design. 
                                Design beautiful, responsive web pages and interactive mobile apps, 
                                and build an outstanding design portfolio from scratch.
                            </p>
                            <ul className="tech-topic-list">
                                {UIUX_TOPICS.map((topic) => (
                                    <li key={topic}>{topic}</li>
                                ))}
                            </ul>
                            <div>
                                <span className="tech-stat-badge">Figma Prototyping</span>
                                <span className="tech-stat-badge">Mobile & Web Design</span>
                                <span className="tech-stat-badge">Design Systems</span>
                            </div>
                        </div>
                        <div className="col-lg-6 reveal reveal-delay-2">
                            <div className="uiux-canvas-card">
                                <div className="canvas-header">
                                    <div className="canvas-dots">
                                        <span className="dot dot--red"></span>
                                        <span className="dot dot--yellow"></span>
                                        <span className="dot dot--green"></span>
                                    </div>
                                    <span className="canvas-title">Figma - Mobile & Web Workspace</span>
                                </div>
                                <div className="canvas-body">
                                    {/* Web Page Mockup */}
                                    <div className="canvas-mockup mockup-web">
                                        <div className="mockup-web__header">
                                            <div className="mockup-web__dots">
                                                <span></span><span></span><span></span>
                                            </div>
                                            <div className="mockup-web__url">devcoaching.com</div>
                                        </div>
                                        <div className="mockup-web__content">
                                            <div className="mockup-web__sidebar">
                                                <div className="mockup-web__avatar"></div>
                                                <div className="mockup-web__nav-line"></div>
                                                <div className="mockup-web__nav-line"></div>
                                                <div className="mockup-web__nav-line"></div>
                                            </div>
                                            <div className="mockup-web__main">
                                                <div className="mockup-web__hero-box"></div>
                                                <div className="mockup-web__cards-grid">
                                                    <div></div>
                                                    <div></div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Figma blue active selection frame */}
                                        <div className="figma-active-border">
                                            <span className="figma-label">Web Frame</span>
                                        </div>
                                    </div>
                                    
                                    {/* Mobile Page Mockup */}
                                    <div className="canvas-mockup mockup-mobile">
                                        <div className="mockup-mobile__notch"></div>
                                        <div className="mockup-mobile__screen">
                                            <div className="mockup-mobile__header">
                                                <span className="mockup-mobile__title">DevCoach App</span>
                                                <span className="mockup-mobile__bell">🔔</span>
                                            </div>
                                            <div className="mockup-mobile__stat-ring">
                                                <div className="mockup-mobile__ring-inner">
                                                    <span>85%</span>
                                                </div>
                                            </div>
                                            <div className="mockup-mobile__list">
                                                <div className="mockup-mobile__item"></div>
                                                <div className="mockup-mobile__item"></div>
                                                <div className="mockup-mobile__item"></div>
                                            </div>
                                        </div>
                                        {/* Figma blue active selection frame */}
                                        <div className="figma-active-border">
                                            <span className="figma-label">Mobile Frame</span>
                                        </div>
                                    </div>

                                    {/* Dynamic Designer Cursor */}
                                    <div className="figma-cursor">
                                        <svg width="14" height="17" viewBox="0 0 14 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M0 0V16.03L4.66 11.37H11.02L0 0Z" fill="#14daff"/>
                                        </svg>
                                        <span className="figma-cursor__label">Johan (Designer)</span>
                                    </div>
                                </div>
                                <div className="canvas-footer">
                                    <h5 className="canvas-footer-title">UI/UX Industry Tools</h5>
                                    <div className="tech-tools-grid">
                                        {UIUX_TOOLS.map(({ icon: Icon, label }) => (
                                            <div className="tech-tool-item" key={label}>
                                                <Icon className="tech-tool-icon" />
                                                <span>{label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Courses */}
            <section className="tech-info-section" style={{ paddingTop: 60, paddingBottom: 160 }}>
                <div className="container">
                    <div className="featured-header reveal">
                        <div>
                            <h2 className="featured-title">Featured courses</h2>
                            <p className="featured-subtitle">Hand-picked, taught live.</p>
                        </div>
                        <button className="view_btn" onClick={() => navigate("/course")}>
                            View All
                        </button>
                    </div>

                    <div className="row g-4">
                        {course?.length > 0 &&
                            course.slice(0, 3).map((cor, i) => {
                                const free = isFreeCourse(cor);
                                return (
                                    <div className={`col-md-6 col-lg-4 reveal reveal-delay-${i + 1}`} key={cor._id}>
                                        <div className="Course_section">
                                            <p className="course_tag">{cor.Language}</p>
                                            <h4 className="CourseName mt-3">{cor.courseName}</h4>
                                            <p className="text-secondary mt-2 flex-grow-1">{cor.Disp}</p>
                                            <div className="course-price-row">
                                                {free ? (
                                                    <h6 className="course-price-free mb-0">Free</h6>
                                                ) : (
                                                    <h6 className="text-white mb-0 d-flex align-items-center gap-1">
                                                        <LiaRupeeSignSolid />
                                                        {cor.Price}
                                                    </h6>
                                                )}
                                                <p className={`mb-0 fw-bold ${free ? "course-badge-free" : "course-badge-paid"}`}>
                                                    {free ? "Free" : "Paid"}
                                                </p>
                                            </div>
                                            <button className={`enroll_btn mt-3${free ? " enroll_btn--trial" : " enroll_btn--buy"}`}>
                                                {free ? "Free Trial" : "Buy Now"}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                </div>
            </section>

            {/* Teacher Section */}
            <section className="tech-info-section tech-info-section--alt">
                <div className="container">
                    <h2 className="title reveal">Why Elite Dev?</h2>

                    <div className="row justify-content-center">
                        <div className="col-lg-10 reveal reveal-delay-1">
                            <div className="cards">
                                <div className="Tag">
                                    <p className="mb-0 text-info fw-bold" style={{ fontSize: 10 }}>TEACHER</p>
                                </div>

                                <div className="mt-4 px-2">
                                    <div className="row align-items-start">
                                        <div className="col-md-7">
                                            <div className="oneline">
                                                <h4 className="text-white fs-3">
                                                    Johan Gao
                                                    <MdVerified className="verification" />
                                                </h4>
                                                <p className="text-primary fw-bold">Senior Python Teacher</p>
                                                <p className="text-secondary">
                                                    Passionate educator with strong communication and dedication
                                                    to student growth and academic excellence.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="col-md-5">
                                            <div className="Active">
                                                <h5 className="text-success">Active</h5>
                                                <hr className="text-white" />
                                                <p className="text-white mb-2">Teacher ID : TCR-2026-6345</p>
                                                <p className="text-white mb-0">
                                                    Joining Date :{" "}
                                                    <SlCalender className="text-primary me-1" />
                                                    12-5-2026
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="Two_section mt-3">
                                        <div className="d-flex flex-wrap teacher-stats gap-4">
                                            <div className="d-flex align-items-center Years_Exp">
                                                <div className="Year_1 me-3">
                                                    <PiBagSimpleFill className="Year" />
                                                </div>
                                                <div>
                                                    <h4 className="text-white mb-0">8+</h4>
                                                    <span className="text-white">Years Experience</span>
                                                </div>
                                            </div>
                                            <div className="d-flex align-items-center">
                                                <FcRating style={{ fontSize: 40 }} />
                                                <div className="ms-3">
                                                    <h4 className="text-white mb-0">4.5</h4>
                                                    <span className="text-white">Rating</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="thead_section">
                                    <div className="row g-3">
                                        <div className="col-sm-6">
                                            <div className="d-flex align-items-start">
                                                <IoSchool className="text-white fs-4 me-3 mt-1" />
                                                <p className="text-white mb-0">
                                                    <b>Qualification</b><br />BCA
                                                </p>
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="d-flex align-items-start">
                                                <MdEmail className="text-white fs-4 me-3 mt-1" />
                                                <p className="text-white mb-0">
                                                    <b>Email ID</b><br />Johan@gmail.com
                                                </p>
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="d-flex align-items-start">
                                                <FaPhoneAlt className="text-white fs-4 me-3 mt-1" />
                                                <p className="text-white mb-0">
                                                    <b>Phone</b><br />+91 8248359976
                                                </p>
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="d-flex align-items-start">
                                                <CgGenderFemale className="text-white fs-4 me-3 mt-1" />
                                                <p className="text-white mb-0">
                                                    <b>Gender</b><br />Male
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="btns">
                                    <button className="btn_1">Message</button>
                                    <button type="button" className="btn_2">Call</button>
                                    <button className="btn_3">Email</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Student Reviews ── */}
            <section className="reviews-section">
                <div className="reviews-header reveal">
                    <span className="section-label section-label--reviews">Student Reviews</span>
                    <h2 className="reviews-title">
                        What Our <span style={{ color: "#14daff" }}>Students Say</span>
                    </h2>
                    <p className="reviews-subtitle">
                        Real feedback from students who levelled up their careers with Dev Coaching.
                    </p>
                </div>

                {/* Auto-scrolling track — duplicated for seamless loop */}
                <div className="reviews-marquee">
                    <div className="reviews-track">
                        {[...REVIEWS, ...REVIEWS].map((r, i) => (
                            <div className="review-card" key={i}>
                                <div className="review-card__top">
                                    <div
                                        className="review-card__avatar"
                                        style={{ background: `linear-gradient(135deg, ${r.color}33 0%, ${r.color}11 100%)`, border: `1.5px solid ${r.color}44`, color: r.color }}
                                    >
                                        {r.avatar}
                                    </div>
                                    <div>
                                        <p className="review-card__name">{r.name}</p>
                                        <p className="review-card__course" style={{ color: r.color }}>{r.course}</p>
                                    </div>
                                </div>
                                <StarRating count={r.rating} />
                                <p className="review-card__text">&ldquo;{r.text}&rdquo;</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="cta-section reveal">
                <IoSchool className="cta-icon" />
                <h2 className="cta-title">Start learning today</h2>
                <p className="cta-text">
                    Create an account, verify your email, and enroll in your first course.
                </p>
                <button className="started_btn">Get Started — it's free to join</button>
            </section>
        </div>
    );
}

export default Home;
