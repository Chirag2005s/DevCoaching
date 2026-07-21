import { useContext, useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaLaptopCode, FaBookOpen, FaClipboardList, FaVideo } from 'react-icons/fa';
import StreakWidget from './component/StreakWidget';
import './Dashboard.css';

const DEFAULT_CARDS = [
    { id: 'courses', to: '/course', icon: <FaLaptopCode />, label: 'My Courses', desc: 'Access your purchased and free courses.', className: 'icon-courses' },
    { id: 'notes', to: '/learning-hub', state: { activeTab: 'notes' }, icon: <FaBookOpen />, label: 'Study Notes', desc: 'Review comprehensive study materials.', className: 'icon-notes' },
    { id: 'exams', to: '/learning-hub', state: { activeTab: 'exams' }, icon: <FaClipboardList />, label: 'Exams & Quizzes', desc: 'Test your knowledge with practice exams.', className: 'icon-exams' },
    { id: 'live', to: '/join-live', icon: <FaVideo />, label: 'Live Classes', desc: 'Join interactive live sessions with instructors.', className: 'icon-live' },
];

function Dashboard() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [cards, setCards] = useState(() => {
        const saved = localStorage.getItem('dashboard_cards');
        if (saved) {
            try {
                const order = JSON.parse(saved);
                // Reconstruct cards based on saved IDs
                const mapped = order.map(id => DEFAULT_CARDS.find(c => c.id === id)).filter(Boolean);
                if (mapped.length === DEFAULT_CARDS.length) return mapped;
            } catch (e) {
                console.error("Failed to parse dashboard cards layout");
            }
        }
        return DEFAULT_CARDS;
    });

    const dragItem = useRef(null);
    const dragOverItem = useRef(null);

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else if (!user.hasPurchasedCourse) {
            navigate('/course');
        }
    }, [user, navigate]);

    // Save card layout
    useEffect(() => {
        localStorage.setItem('dashboard_cards', JSON.stringify(cards.map(c => c.id)));
    }, [cards]);

    const handleSort = () => {
        let _cards = [...cards];
        const draggedItemContent = _cards.splice(dragItem.current, 1)[0];
        _cards.splice(dragOverItem.current, 0, draggedItemContent);
        dragItem.current = null;
        dragOverItem.current = null;
        setCards(_cards);
    };

    if (!user) return null;

    // Continue Learning mock data (could come from useStreaks or backend)
    const continueLearning = {
        title: "Advanced React Patterns",
        progress: 65,
        timeAgo: "2 hours ago",
        link: "/course"
    };

    return (
        <div className="dashboard-page">
            <div className="container">
                <div className="dashboard-header-row">
                    <div className="dashboard-header">
                        <h1 className="dashboard-title">
                            My <span>Dashboard</span>
                        </h1>
                        <p className="dashboard-subtitle">Manage your learning journey and access your resources.</p>
                    </div>
                    <StreakWidget />
                </div>

                <div className="profile-card">
                    <div className="profile-avatar">
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="profile-info">
                        <h2>{user.name}</h2>
                        <p>{user.email}</p>
                        <div className="dashboard-badges">
                            {user.hasPurchasedCourse && (
                                <span className="dashboard-pro-badge">PRO MEMBER</span>
                            )}
                            {user.enrolledBatch && (
                                <span className="dashboard-batch-badge">
                                    BATCH: {user.enrolledBatch.batchName}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {user.enrolledBatch && (
                    <div className="dashboard-batch-panel">
                        <h3>My Batch Details</h3>
                        <div className="dashboard-batch-details">
                            <p><strong>Track:</strong> {user.enrolledBatch.track}</p>
                            <p><strong>Instructor:</strong> {user.enrolledBatch.instructor}</p>
                            <p><strong>Timings:</strong> {user.enrolledBatch.timings}</p>
                        </div>
                    </div>
                )}

                {/* Continue Learning Section */}
                <div className="continue-learning-section">
                    <h3 className="section-title">Continue Learning</h3>
                    <div className="cl-card">
                        <div className="cl-info">
                            <h4>{continueLearning.title}</h4>
                            <span className="cl-time">Last accessed {continueLearning.timeAgo}</span>
                            <div className="cl-progress-wrapper">
                                <div className="cl-progress-bar" style={{ width: `${continueLearning.progress}%` }} />
                            </div>
                            <span className="cl-progress-text">{continueLearning.progress}% Completed</span>
                        </div>
                        <Link to={continueLearning.link} className="cl-resume-btn">Resume</Link>
                    </div>
                </div>

                <div className="dashboard-tools-header">
                    <h3 className="section-title">My Tools</h3>
                    <button className="reset-layout-btn" onClick={() => setCards(DEFAULT_CARDS)}>Reset Layout</button>
                </div>

                <div className="dashboard-grid">
                    {cards.map((card, index) => (
                        <div 
                            key={card.id}
                            className="dashboard-card-wrapper"
                            draggable
                            onDragStart={() => (dragItem.current = index)}
                            onDragEnter={() => (dragOverItem.current = index)}
                            onDragEnd={handleSort}
                            onDragOver={(e) => e.preventDefault()}
                        >
                            <Link to={card.to} state={card.state} className="dashboard-card">
                                <div className="card-drag-handle">⋮⋮</div>
                                <div className={`dashboard-card-icon ${card.className}`}>
                                    {card.icon}
                                </div>
                                <h3>{card.label}</h3>
                                <p>{card.desc}</p>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
