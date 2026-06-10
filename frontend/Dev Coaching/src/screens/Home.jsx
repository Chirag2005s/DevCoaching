import "./Home.css";
import axios from "axios";
import { useEffect, useState } from "react";
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
    "React components, props & state",
    "Hooks, routing & context API",
    "Node.js & Express backend APIs",
    "MongoDB database integration",
    "Full MERN stack project builds",
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

function Home() {
    const [course, setCourse] = useState([]);
    const navigate = useNavigate();

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

    return (
        <>
            {/* Hero */}
            <section className="header_section">
                <div className="container text-center">
                    <p className="header_Signal hero-animate mb-4">
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

                    {/* Info cards */}
                    <div className="row g-4 mt-2">
                        <div className="col-md-4 reveal reveal-delay-1">
                            <div className="Information_live">
                                <FaCode className="info-icon" />
                                <h5 className="info-card-title">Developers Only</h5>
                                <p className="info-card-text">
                                    React, Python, Node, Backend (MERN), AI Tools — no other subjects.
                                </p>
                            </div>
                        </div>
                        <div className="col-md-4 reveal reveal-delay-2">
                            <div className="Information_live">
                                <HiSignal className="info-icon" />
                                <h5 className="info-card-title">Live Classes</h5>
                                <p className="info-card-text">
                                    Attend live on Google Meet or watch back recordings anytime.
                                </p>
                            </div>
                        </div>
                        <div className="col-md-4 reveal reveal-delay-3">
                            <div className="Information_live">
                                <FiUsers className="info-icon" />
                                <h5 className="info-card-title">Talk to Teachers</h5>
                                <p className="info-card-text">
                                    Realtime chat for doubts, dues, and 1:1 help from mentors.
                                </p>
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

            {/* Python Information Section */}
            <section className="tech-info-section" style={{paddingBottom: 160 }}>
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
                </div>
            </section>

                    <section>
                        <div className="container Technology_section">
                            <marquee direction="right">
                                <div
                                    style={{
                                        display: "flex",
                                        gap: 50,
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                    }}
                                >
                                    <div className="Techno">
                                        <FaGithub style={{ fontSize: 100, color: "white" }} />
                                    </div>

                                    <div className="Techno">
                                        <FaGitAlt style={{ fontSize: 100, color: "white" }} />
                                    </div>

                                    <div className="Techno">
                                        <FaNodeJs style={{ fontSize: 100, color: "white" }} />
                                    </div>

                                    <div className="Techno">
                                        <DiMongodb style={{ fontSize: 100, color: "white" }} />
                                    </div>

                                    <div className="Techno">
                                        <SiExpress style={{ fontSize: 100, color: "white" }} />
                                    </div>

                                    <div className="Techno">
                                        <SiPostman style={{ fontSize: 100, color: "white" }} />
                                    </div>

                                    <div className="Techno">
                                        <FaReact style={{ fontSize: 100, color: "white" }} />
                                    </div>
                                    <h2 style={{ color: "white" }}>MERN STACK</h2>
                                </div>
                            </marquee>
                        </div>
                    </section>

            {/* Featured Courses */}
            <section className="tech-info-section" style={{ paddingTop: 60,paddingBottom: 160 }}>
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
                            course.slice(0, 3).map((cor, i) => (
                                <div className={`col-md-6 col-lg-4 reveal reveal-delay-${i + 1}`} key={cor._id}>
                                    <div className="Course_section">
                                        <p className="course_tag">{cor.title}</p>
                                        <h4 className="CourseName mt-3">{cor.courseName}</h4>
                                        <p className="text-secondary mt-2 flex-grow-1">{cor.Disp}</p>
                                        <div className="course-price-row">
                                            <h6 className="text-white mb-0 d-flex align-items-center gap-1">
                                                <LiaRupeeSignSolid />
                                                {cor.Price}
                                            </h6>
                                            <p className="text-white mb-0 fw-bold">{cor.CourseStatus}</p>
                                        </div>
                                        <button className="enroll_btn mt-3">Buy Now</button>
                                    </div>
                                </div>
                            ))}
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

            {/* CTA */}
            <section className="cta-section reveal">
                <IoSchool className="cta-icon" />
                <h2 className="cta-title">Start learning today</h2>
                <p className="cta-text">
                    Create an account, verify your email, and enroll in your first course.
                </p>
                <button className="started_btn">Get Started — it's free to join</button>
            </section>
        </>
    );
}

export default Home;
