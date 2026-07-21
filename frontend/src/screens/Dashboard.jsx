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

    return (
        <div className="dashboard-page">
            <div className="container">
                <div className="dashboard-header">
                    <h1 className="dashboard-title">
                        My <span>Dashboard</span>
                    </h1>
                    <p className="dashboard-subtitle">Manage your learning journey and access your resources.</p>
                </div>

                <div className="profile-card">
                    <div className="profile-avatar">
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="profile-info">
                        <h2>{user.name}</h2>
                        <p>{user.email}</p>
                        {user.hasPurchasedCourse && (
                            <span className="dashboard-pro-badge">PRO MEMBER</span>
                        )}
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
