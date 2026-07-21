import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import './Calendar.css';

// Generate days for a specific month and year
const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

// Mock events data
const MOCK_EVENTS = [
    { date: '2026-07-22', title: 'React Basics Live Class', type: 'live', time: '10:00 AM' },
    { date: '2026-07-25', title: 'Node.js Exam', type: 'exam', time: '12:00 PM' },
    { date: '2026-07-28', title: 'Project Deadline', type: 'deadline', time: '11:59 PM' },
];

export default function Calendar() {
    const { user } = useContext(AuthContext);
    const [currentDate, setCurrentDate] = useState(new Date());

    if (!user) return (
        <div className="calendar-page">
            <div className="container"><p>Please login to view calendar.</p></div>
        </div>
    );

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];

    const handlePrevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const handleToday = () => {
        setCurrentDate(new Date());
    };

    // Build grid cells
    const cells = [];
    
    // Empty cells for days before the 1st
    for (let i = 0; i < firstDay; i++) {
        cells.push(<div key={`empty-${i}`} className="cal-cell empty"></div>);
    }

    // Days of the month
    for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        
        // Find events for this day
        const dayEvents = MOCK_EVENTS.filter(e => e.date === dateStr);
        
        // Check if today
        const today = new Date();
        const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();

        cells.push(
            <div key={d} className={`cal-cell ${isToday ? 'today' : ''}`}>
                <div className="cal-day-num">{d}</div>
                <div className="cal-events">
                    {dayEvents.map((evt, idx) => (
                        <div key={idx} className={`cal-event-badge type-${evt.type}`} title={`${evt.time} - ${evt.title}`}>
                            {evt.title}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="calendar-page">
            <div className="container">
                <div className="calendar-header-row">
                    <div>
                        <h1 className="calendar-title">My <span>Calendar</span></h1>
                        <p className="calendar-subtitle">Track your classes, exams, and deadlines.</p>
                    </div>
                    
                    <div className="calendar-controls">
                        <button className="cal-btn" onClick={handleToday}>Today</button>
                        <div className="cal-nav">
                            <button className="cal-icon-btn" onClick={handlePrevMonth}><FiChevronLeft /></button>
                            <h2>{monthNames[month]} {year}</h2>
                            <button className="cal-icon-btn" onClick={handleNextMonth}><FiChevronRight /></button>
                        </div>
                    </div>
                </div>

                <div className="calendar-container">
                    <div className="cal-weekdays">
                        <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div>
                        <div>Thu</div><div>Fri</div><div>Sat</div>
                    </div>
                    <div className="cal-grid">
                        {cells}
                    </div>
                </div>

                <div className="cal-legend">
                    <div className="legend-item"><span className="legend-dot type-live"></span> Live Class</div>
                    <div className="legend-item"><span className="legend-dot type-exam"></span> Exam</div>
                    <div className="legend-item"><span className="legend-dot type-deadline"></span> Deadline</div>
                </div>
            </div>
        </div>
    );
}
