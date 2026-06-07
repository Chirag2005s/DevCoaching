import "./Home.css";
import axios from "axios";
// React icons
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
import { useEffect, useState } from "react";

// Python Tools
import { FaGithub } from "react-icons/fa";
import { FaGitAlt } from "react-icons/fa6";
import { VscVscode } from "react-icons/vsc";
import { FaPython } from "react-icons/fa";
import { BiLogoFlask } from "react-icons/bi";
import { SiPandas } from "react-icons/si";
import { SiPycharm } from "react-icons/si";

// MERN STACK
import { FaNodeJs } from "react-icons/fa";
import { SiExpress } from "react-icons/si";
import { DiMongodb } from "react-icons/di";
import { SiPostman } from "react-icons/si";
import { FaReact } from "react-icons/fa";





function Home() {
    const [course, setCourse] = useState([]);

    useEffect(() => {
        axios
            .get("http://localhost:9000/api/Course")
            .then((res) => setCourse(res.data?.course || []));
        // .catch((err) => console.log(err));
    }, []);

    return (
        <>
            <section>
                <div className="header_section">
                    <div style={{ justifyContent: "center", display: "flex" }}>
                        <p className="header_Signal">
                            <HiSignal style={{ color: "green", fontSize: 20 }} /> 1 live class
                            happening now
                        </p>
                    </div>
                    <h1 style={{ color: "white", textAlign: "center", fontSize: 80 }}>
                        Level up your{" "}
                        <span style={{ color: "#14daff" }}>developer career</span>
                        <br /> with senior mentors.
                    </h1>
                    <p
                        style={{
                            textAlign: "center",
                            color: "#979fab",
                            marginTop: 20,
                            fontSize: 30,
                        }}
                    >
                        Dev Coaching is exclusively for developer subjects. Live classes
                        over <br />
                        Google Meet, real exam papers, and direct chat with your teacher
                    </p>

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            gap: 30,
                            marginTop: 50,
                        }}
                    >
                        <button className="header_btn">
                            Explore Course
                            <FaArrowRightLong style={{ marginLeft: 20, fontSize: 25 }} />
                        </button>
                        <button className="header_btn">Meet The Teacher</button>
                    </div>

                    <hr style={{ color: "white", marginTop: 140 }} />

                    <section>
                        <div
                            style={{
                                marginTop: 90,
                                display: "flex",
                                justifyContent: "center",
                                gap: 50,
                            }}
                        >
                            <div className="Information_live">
                                <div>
                                    <FaCode style={{ color: "#6c9eff", fontSize: 30 }} />
                                </div>
                                <div>
                                    <h5 style={{ color: "white", marginTop: 30, fontSize: 25 }}>
                                        Developers Only
                                    </h5>
                                </div>
                                <div>
                                    <p
                                        style={{ color: "#777777ff", marginTop: 20, fontSize: 20 }}
                                    >
                                        React, Python, Node, Backend(MERN), AI Tools
                                        <br /> — no other subjects.
                                    </p>
                                </div>
                            </div>

                            <div className="Information_live">
                                <div>
                                    <HiSignal style={{ color: "#6c9eff", fontSize: 30 }} />
                                </div>
                                <div>
                                    <h5 style={{ color: "white", marginTop: 30, fontSize: 25 }}>
                                        Live Classes
                                    </h5>
                                </div>
                                <div>
                                    <p
                                        style={{ color: "#777777ff", marginTop: 20, fontSize: 20 }}
                                    >
                                        Attend live on Google Meet or watch back.
                                    </p>
                                </div>
                            </div>

                            <div className="Information_live">
                                <div>
                                    <FiUsers style={{ color: "#6c9eff", fontSize: 30 }} />
                                </div>
                                <div>
                                    <h5 style={{ color: "white", marginTop: 30, fontSize: 25 }}>
                                        Talk to teachers
                                    </h5>
                                </div>
                                <div>
                                    <p
                                        style={{ color: "#777777ff", marginTop: 20, fontSize: 20 }}
                                    >
                                        Realtime chat for doubts, dues, and 1:1 help.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section>
                        <div className="container Technology_section">
                            {/* marquee */}
                            <marquee>
                                <div
                                    style={{
                                        display: "flex",
                                        gap: 50,
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                    }}
                                >
                                    <h2 style={{ color: "white" }}>PYTHON TOOLS</h2>
                                    <div className="Techno">
                                        <FaGithub style={{ fontSize: 100, color: "white" }} />
                                    </div>

                                    <div className="Techno">
                                        <FaGitAlt style={{ fontSize: 100, color: "white" }} />
                                    </div>

                                    <div className="Techno">
                                        <VscVscode style={{ fontSize: 100, color: "white" }} />
                                    </div>

                                    <div className="Techno">
                                        <FaPython style={{ fontSize: 100, color: "white" }} />
                                    </div>

                                    <div className="Techno">
                                        <BiLogoFlask style={{ fontSize: 100, color: "white" }} />
                                    </div>

                                    <div className="Techno">
                                        <SiPandas style={{ fontSize: 100, color: "white" }} />
                                    </div>

                                    <div className="Techno">
                                        <SiPycharm style={{ fontSize: 100, color: "white" }} />
                                    </div>
                                </div>
                            </marquee>
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

                    <section style={{ paddingBottom: 100 }}>
                        <h2
                            style={{
                                color: "white",
                                marginLeft: 40,
                                marginTop: 100,
                                fontSize: 35,
                            }}
                        >
                            Featured courses{" "}
                            <span>
                                <button className="view_btn">View All</button>
                            </span>
                        </h2>
                        <span style={{ color: "#777777ff", marginLeft: 40 }}>
                            Hand-picked, taught live.
                        </span>

                        <div className="container">
                            <div className="row">
                                {course?.length > 0 &&
                                    course?.slice(0, 3).map((cor) => (
                                        <div className="col-md-4" key={cor._id}>
                                            <div className="Course_section">
                                                <div>
                                                    <p className="course_tag">{cor.title}</p>
                                                </div>
                                                <h4 style={{ color: "white" }}>{cor.courseName}</h4>
                                                <p style={{ color: "#919191ff" }}>{cor.Disp}</p>
                                                <h6 style={{ color: "white", fontSize: 20 }}>
                                                    <LiaRupeeSignSolid />
                                                    {cor.Price}
                                                </h6>
                                                <button className="enroll_btn">Buy Now</button>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </section>

                    <h2 className="title">Why Elite Dev?</h2>

                    <div className="row">
                        <div className="col-md-6">
                            <div className="cards">
                                <div className="Tag">
                                    <p
                                        style={{
                                            color: "#45c7ec",
                                            fontSize: 10,
                                            fontWeight: "bold",
                                        }}
                                    >
                                        TEACHER
                                    </p>
                                </div>

                                <div style={{ marginTop: 30, marginLeft: 20 }}>
                                    <div style={{ display: "flex", justifyContent: "center" }}>
                                        <div className="oneline">
                                            <h4 style={{ color: "white", fontSize: 40 }}>
                                                Johan Gao
                                                <MdVerified className="verification" />
                                            </h4>
                                            <p style={{ color: "#3253b3", fontWeight: "bold" }}>
                                                Senior Python Teacher
                                            </p>
                                            <p style={{ color: "#c9c9c9ff", fontWeight: "bold" }}>
                                                Passlonate educator with a strong communicaton to <br />
                                                student growth and academic excellence.
                                            </p>
                                        </div>
                                        <div className="Active">
                                            <h5 style={{ color: "green" }}>Active</h5>
                                            <hr style={{ color: "white", width: 100 }} />
                                            <p style={{ color: "white" }}>
                                                Teacher ID : TCR-2026-6345
                                            </p>
                                            <p style={{ color: "white" }}>
                                                Joining Date :<br />{" "}
                                                <SlCalender
                                                    style={{
                                                        fontSize: 20,
                                                        marginRight: 5,
                                                        color: "#762ccfff",
                                                    }}
                                                />
                                                12-5-2026
                                            </p>
                                        </div>
                                    </div>

                                    <div className="Two_section">
                                        <div style={{ display: "flex" }}>
                                            <div className="Years_Exp">
                                                <div style={{ display: "flex" }}>
                                                    <div className="Year_1">
                                                        <PiBagSimpleFill className="Year" />
                                                    </div>
                                                    <div style={{ marginLeft: 20 }}>
                                                        <h4 style={{ color: "white" }}>8+</h4>
                                                        <span style={{ color: "white" }}>
                                                            Year Experince
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div style={{ display: "flex", marginLeft: 50 }}>
                                                <div>
                                                    <FcRating style={{ fontSize: 50 }} />
                                                </div>
                                                <div style={{ marginLeft: 20 }}>
                                                    <h4 style={{ color: "white" }}>4.5</h4>
                                                    <span style={{ color: "white" }}>Rating</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="thead_section">
                                    <div className="Persanal_info">
                                        <div style={{ display: "flex" }}>
                                            <div style={{ display: "flex" }}>
                                                <div>
                                                    <IoSchool
                                                        style={{
                                                            fontSize: 30,
                                                            color: "white",
                                                            marginTop: 5,
                                                        }}
                                                    />
                                                </div>
                                                <div style={{ marginLeft: 20 }}>
                                                    <p style={{ color: "white" }}>
                                                        <b style={{ color: "white" }}>Qualification</b>
                                                        <br />
                                                        BCA
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="Persanal_info">
                                                <div style={{ display: "flex", marginLeft: 130 }}>
                                                    <div>
                                                        <MdEmail
                                                            style={{
                                                                fontSize: 30,
                                                                color: "white",
                                                                marginTop: 5,
                                                            }}
                                                        />
                                                    </div>
                                                    <div style={{ marginLeft: 20 }}>
                                                        <p style={{ color: "white" }}>
                                                            <b style={{ color: "white" }}>Email ID</b>
                                                            <br />
                                                            Johan@gmail.com
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div style={{ display: "flex" }}>
                                            <div className="Persanal_info">
                                                <div style={{ display: "flex" }}>
                                                    <div>
                                                        <FaPhoneAlt
                                                            style={{
                                                                fontSize: 30,
                                                                color: "white",
                                                                marginTop: 5,
                                                            }}
                                                        />
                                                    </div>
                                                    <div style={{ marginLeft: 20 }}>
                                                        <p style={{ color: "white" }}>
                                                            <b style={{ color: "white" }}>PHONE</b>
                                                            <br />
                                                            +91 8248359976
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="Persanal_info">
                                                <div style={{ display: "flex", marginLeft: 100 }}>
                                                    <div>
                                                        <CgGenderFemale
                                                            style={{
                                                                fontSize: 30,
                                                                color: "white",
                                                                marginTop: 5,
                                                            }}
                                                        />
                                                    </div>
                                                    <div style={{ marginLeft: 20 }}>
                                                        <p style={{ color: "white" }}>
                                                            <b style={{ color: "white" }}>GENDER</b>
                                                            <br />
                                                            Male
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="btns">
                                    <button className="btn_1">Message</button>
                                    <button type="tel" className="btn_2">
                                        Call{" "}
                                    </button>
                                    <button className="btn_3">Email</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section
                style={{
                    backgroundColor: "#090d16",
                    textAlign: "center",
                    paddingBottom: 50,
                    paddingTop: 50,
                }}
            >
                <div>
                    <h1>
                        <IoSchool style={{ color: "#6c9eff", fontSize: 60 }} />
                    </h1>
                    <h1 style={{ color: "white" }}>Start learning today</h1>
                    <p style={{ color: "#999999ff", fontSize: 20 }}>
                        Create an account, verify your email, and enroll in your first
                        course.
                    </p>

                    <button className="started_btn">Get Started-it's free to join</button>
                </div>

                {/* <hr style={{ color: '#898989ff', marginTop: 250 }} /> */}
            </section>
        </>
    );
}

export default Home;
