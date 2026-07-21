import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useStreaks } from '../hooks/useStreaks';
import './Analytics.css';

// Mock data generator for the calendar heatmap
const generateHeatmapData = () => {
    const data = [];
    const now = new Date();
    for (let i = 0; i < 90; i++) {
        const d = new Date(now);
        d.setDate(d.getDate() - (89 - i));
        // Random intensity 0-4
        const intensity = Math.random() > 0.6 ? Math.floor(Math.random() * 4) + 1 : 0;
        data.push({ date: d, intensity });
    }
    return data;
};

const HEATMAP_DATA = generateHeatmapData();

// Mock data for Bar Chart
const COURSE_PROGRESS = [
    { name: 'React Native Masterclass', progress: 85 },
    { name: 'Advanced Node.js', progress: 40 },
    { name: 'UI/UX for Developers', progress: 15 },
];

// Mock data for Line Chart
const WEEKLY_HOURS = [2.5, 3.8, 1.2, 5.0, 4.2, 6.5, 3.0]; // Mon-Sun

export default function Analytics() {
    const { user } = useContext(AuthContext);
    const { streakData } = useStreaks();

    if (!user) return (
        <div className="analytics-page">
            <div className="container"><p>Please login to view analytics.</p></div>
        </div>
    );

    const maxWeeklyHours = Math.max(...WEEKLY_HOURS);

    return (
        <div className="analytics-page">
            <div className="container">
                <div className="analytics-header">
                    <h1 className="analytics-title">My <span>Analytics</span></h1>
                    <p className="analytics-subtitle">Track your learning progress and stay motivated.</p>
                </div>

                {/* Summary Cards */}
                <div className="analytics-summary-grid">
                    <div className="stat-card">
                        <span className="stat-label">Total XP</span>
                        <div className="stat-value">{streakData.totalXP}</div>
                    </div>
                    <div className="stat-card">
                        <span className="stat-label">Current Streak</span>
                        <div className="stat-value">{streakData.currentStreak} <span className="stat-unit">Days</span></div>
                    </div>
                    <div className="stat-card">
                        <span className="stat-label">Longest Streak</span>
                        <div className="stat-value">{streakData.longestStreak} <span className="stat-unit">Days</span></div>
                    </div>
                    <div className="stat-card">
                        <span className="stat-label">Courses In Progress</span>
                        <div className="stat-value">{COURSE_PROGRESS.length}</div>
                    </div>
                </div>

                <div className="analytics-charts-grid">
                    {/* Course Progress Bar Chart */}
                    <div className="chart-card">
                        <h3>Course Progress</h3>
                        <div className="bar-chart-container">
                            {COURSE_PROGRESS.map((course, idx) => (
                                <div key={idx} className="bar-row">
                                    <div className="bar-label">
                                        <span>{course.name}</span>
                                        <span>{course.progress}%</span>
                                    </div>
                                    <div className="bar-track">
                                        <div className="bar-fill" style={{ width: `${course.progress}%`, animationDelay: `${idx * 0.1}s` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Weekly Study Time (Line Chart Approximation with SVG) */}
                    <div className="chart-card">
                        <h3>Study Time (This Week)</h3>
                        <div className="line-chart-container">
                            <svg viewBox="0 0 100 50" className="line-chart-svg" preserveAspectRatio="none">
                                {/* Grid lines */}
                                <line x1="0" y1="12.5" x2="100" y2="12.5" stroke="currentColor" strokeOpacity="0.1" strokeWidth="0.5" />
                                <line x1="0" y1="25" x2="100" y2="25" stroke="currentColor" strokeOpacity="0.1" strokeWidth="0.5" />
                                <line x1="0" y1="37.5" x2="100" y2="37.5" stroke="currentColor" strokeOpacity="0.1" strokeWidth="0.5" />
                                
                                {/* Data Line */}
                                <polyline
                                    fill="none"
                                    stroke="var(--primary)"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    points={WEEKLY_HOURS.map((val, i) => `${(i / 6) * 100},${50 - (val / maxWeeklyHours) * 45}`).join(' ')}
                                />
                                {/* Data Points */}
                                {WEEKLY_HOURS.map((val, i) => (
                                    <circle
                                        key={i}
                                        cx={(i / 6) * 100}
                                        cy={50 - (val / maxWeeklyHours) * 45}
                                        r="2"
                                        fill="var(--surface)"
                                        stroke="var(--primary)"
                                        strokeWidth="1"
                                    />
                                ))}
                            </svg>
                            <div className="line-chart-labels">
                                <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* GitHub-style Heatmap */}
                <div className="chart-card heatmap-card">
                    <h3>Learning Activity (Last 90 Days)</h3>
                    <div className="heatmap-scroll">
                        <div className="heatmap-grid">
                            {HEATMAP_DATA.map((day, i) => (
                                <div 
                                    key={i} 
                                    className="heatmap-cell" 
                                    data-intensity={day.intensity}
                                    title={`${day.date.toDateString()}: ${day.intensity > 0 ? day.intensity * 2 + ' hours' : 'No activity'}`}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="heatmap-legend">
                        <span>Less</span>
                        <div className="heatmap-cell" data-intensity="0"></div>
                        <div className="heatmap-cell" data-intensity="1"></div>
                        <div className="heatmap-cell" data-intensity="2"></div>
                        <div className="heatmap-cell" data-intensity="3"></div>
                        <div className="heatmap-cell" data-intensity="4"></div>
                        <span>More</span>
                    </div>
                </div>

            </div>
        </div>
    );
}
