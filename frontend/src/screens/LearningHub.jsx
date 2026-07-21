import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Note from './Note';
import Exam from './Exam';
import { FaBookOpen, FaClipboardList, FaLock } from 'react-icons/fa';
import './LearningHub.css';

function LearningHub() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    // Read initial tab from state (if passed via navigate) or default to notes
    const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'notes');

    useEffect(() => {
        if (location.state?.activeTab) {
            setActiveTab(location.state.activeTab);
        }
    }, [location.state]);

    return (
        <div className="learning-hub-page">
            <div className="learning-hub-header text-center">
                <h1 className="hub-title">Learning <span>Hub</span></h1>
                <p className="hub-subtitle">Your central repository for study materials and assessments</p>
            </div>

            <div className="hub-tabs-container">
                <div className="hub-tabs">
                    <button 
                        className={`hub-tab ${activeTab === 'notes' ? 'active' : ''}`}
                        onClick={() => setActiveTab('notes')}
                    >
                        <FaBookOpen /> Study Notes
                    </button>
                    <button 
                        className={`hub-tab ${activeTab === 'exams' ? 'active' : ''}`}
                        onClick={() => setActiveTab('exams')}
                    >
                        <FaClipboardList /> Mock Exams
                    </button>
                </div>
            </div>

            <div className="hub-content">
                {activeTab === 'notes' && <Note isEmbedded={true} />}
                
                {activeTab === 'exams' && (
                    user ? (
                        <Exam isEmbedded={true} />
                    ) : (
                        <div className="hub-auth-required">
                            <FaLock className="lock-icon" />
                            <h2>Login Required</h2>
                            <p>You must be logged in to access the Mock Exams section.</p>
                            <button className="btn-primary-hub" onClick={() => navigate('/login')}>
                                Login Now
                            </button>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}

export default LearningHub;
