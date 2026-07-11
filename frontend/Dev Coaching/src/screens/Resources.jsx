import { useState } from "react";
import Note from "./Note.jsx";
import Exam from "./Exam.jsx";
import "./Resources.css";
import { MdBook, MdAssignment } from "react-icons/md";

function Resources() {
    const [activeTab, setActiveTab] = useState("notes");

    return (
        <div className="resources-page">
            {/* Page Header */}
            <div className="resources-hero">
                <div className="container">
                    <h1 className="resources-hero__title">
                        Learning <span>Resources</span>
                    </h1>
                    <p className="resources-hero__sub">
                        Access study notes, PDFs, and take mock exams — all in one place.
                    </p>

                    {/* Tab Switcher */}
                    <div className="resources-tab-switcher">
                        <button
                            className={`resources-tab ${activeTab === "notes" ? "resources-tab--active" : ""}`}
                            onClick={() => setActiveTab("notes")}
                            id="tab-notes"
                        >
                            <MdBook className="resources-tab__icon" />
                            Study Notes
                            {activeTab === "notes" && <span className="resources-tab__indicator" />}
                        </button>
                        <button
                            className={`resources-tab ${activeTab === "exams" ? "resources-tab--active" : ""}`}
                            onClick={() => setActiveTab("exams")}
                            id="tab-exams"
                        >
                            <MdAssignment className="resources-tab__icon" />
                            Exams &amp; Quizzes
                            {activeTab === "exams" && <span className="resources-tab__indicator" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Panel Content */}
            <div className={`resources-panel ${activeTab === "notes" ? "panel-visible" : "panel-hidden"}`}>
                <Note />
            </div>
            <div className={`resources-panel ${activeTab === "exams" ? "panel-visible" : "panel-hidden"}`}>
                <Exam />
            </div>
        </div>
    );
}

export default Resources;