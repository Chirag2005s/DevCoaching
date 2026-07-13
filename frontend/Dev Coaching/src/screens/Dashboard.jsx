import { useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaLaptopCode, FaBookOpen, FaClipboardList, FaVideo } from 'react-icons/fa';
import './Dashboard.css';

function Dashboard() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    // Redirect to login if user is not authenticated or hasn't purchased
    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else if (!user.hasPurchasedCourse) {
            navigate('/course');
        }
    }, [user, navigate]);

    if (!user) return null;

    // Compute overall course progress from completedTopics
    const totalTopicsPerCourse = 5; // each course has 5 topics by default
    const purchasedCount = user.purchasedCourses?.length || (user.hasPurchasedCourse ? 1 : 0);
    const totalTopics = purchasedCount * totalTopicsPerCourse;
    const totalCompleted = (user.completedTopics || []).reduce((sum, cp) => sum + (cp.topics?.length || 0), 0);
    const overallPct = totalTopics > 0 ? Math.round((totalCompleted / totalTopics) * 100) : 0;
    const overallLabel = `${totalCompleted}/${totalTopics}`;

    return (
        <div className="dashboard-page">
            <div className="container">
                <div className="dashboard-header">
                    <h1 className="dashboard-title">
                        My <span>Dashboard</span>
                    </h1>
                    <p className="dashboard-subtitle">Manage your learning journey and access your resources.</p>
                </div>

                <div className="dashboard-content-layout">
                    {/* Left Column: ID Card */}
                    <div className="dashboard-left-col">
                        <div className="student-id-card">
                            <div className="id-card-header">
                                <div className="id-logo-text">DEV COACHING</div>
                                <div className="id-title">STUDENT ID</div>
                            </div>
                            <div className="id-card-body">
                                <div className="id-avatar-wrap">
                                    <div className="id-avatar">
                                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                    {user.hasPurchasedCourse && (
                                        <span className="id-pro-badge">PRO</span>
                                    )}
                                </div>
                                <div className="id-details">
                                    <h2 className="id-name">{user.name}</h2>
                                    <p className="id-email">{user.email}</p>
                                    
                                    <div className="id-enrollment-box">
                                        <span className="enrollment-label">ENROLLMENT NO.</span>
                                        <span className="enrollment-value">{user.enrollmentNumber || 'PENDING'}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="id-card-footer">
                                <div className="id-barcode">
                                    || |||| | ||| || |||| | | ||
                                </div>
                                <span className="id-validity">Valid: 2026-2027</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Progress Report */}
                    <div className="dashboard-right-col">
                        <div className="progress-report-card">
                            <h3 className="progress-title">Academic Progress</h3>
                            
                            <div className="progress-item">
                                <div className="progress-meta">
                                    <span className="progress-label">Overall Course Completion</span>
                                    <span className="progress-percent">{overallPct}% ({overallLabel} topics)</span>
                                </div>
                                <div className="progress-track">
                                    <div className="progress-fill fill-blue" style={{ width: `${overallPct}%` }}></div>
                                </div>
                            </div>

                            <div className="progress-item">
                                <div className="progress-meta">
                                    <span className="progress-label">Assignments Completed</span>
                                    <span className="progress-percent">8/12</span>
                                </div>
                                <div className="progress-track">
                                    <div className="progress-fill fill-green" style={{ width: '75%' }}></div>
                                </div>
                            </div>

                            <div className="progress-item">
                                <div className="progress-meta">
                                    <span className="progress-label">Live Classes Attended</span>
                                    <span className="progress-percent">14/20</span>
                                </div>
                                <div className="progress-track">
                                    <div className="progress-fill fill-purple" style={{ width: '70%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="dashboard-grid">
                    <Link to="/course" className="dashboard-card">
                        <div className="dashboard-card-icon icon-courses">
                            <FaLaptopCode />
                        </div>
                        <h3>My Courses</h3>
                        <p>Access your purchased and free courses.</p>
                    </Link>

                    <Link to="/notes" className="dashboard-card">
                        <div className="dashboard-card-icon icon-notes">
                            <FaBookOpen />
                        </div>
                        <h3>Notes</h3>
                        <p>Review comprehensive study materials.</p>
                    </Link>

                    <Link to="/exams" className="dashboard-card">
                        <div className="dashboard-card-icon icon-exams">
                            <FaClipboardList />
                        </div>
                        <h3>Exams & Quizzes</h3>
                        <p>Test your knowledge with practice exams.</p>
                    </Link>

                    <Link to="/join-live" className="dashboard-card">
                        <div className="dashboard-card-icon icon-live">
                            <FaVideo />
                        </div>
                        <h3>Live Classes</h3>
                        <p>Join interactive live sessions with instructors.</p>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
