import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    Plus, Trash2, Video, Clock, Calendar, BookOpen, 
    X, Radio, Search, Filter, Sparkles, User, Link as LinkIcon, AlertCircle, Layers
} from 'lucide-react';
import './LiveClassesPage.css';

const API_BASE_URL = 'http://localhost:9000/api';

export default function LiveClassesPage() {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTrackFilter, setSelectedTrackFilter] = useState('All');
    const [selectedDayFilter, setSelectedDayFilter] = useState('All');
    const [scheduleMode, setScheduleMode] = useState('single'); // 'single', 'mon_to_sat', 'sunday_holiday'
    
    const [formData, setFormData] = useState({
        topic: '',
        mentor: '',
        track: 'MERN Stack',
        type: 'Core Lecture',
        dayOfWeek: 'Monday',
        time: '7:00 PM - 9:00 PM',
        meetingLink: '',
        description: '',
        prerequisites: ''
    });

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/live-classes`);
            if (res.data.success) {
                setClasses(res.data.liveClasses);
            }
        } catch (error) {
            console.error("Error fetching live classes", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const prereqs = formData.prerequisites ? formData.prerequisites.split(',').map(p => p.trim()).filter(Boolean) : [];

            if (scheduleMode === 'mon_to_sat') {
                const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                const promises = days.map(day => {
                    const payload = {
                        ...formData,
                        dayOfWeek: day,
                        prerequisites: prereqs
                    };
                    return axios.post(`${API_BASE_URL}/live-classes`, payload);
                });
                await Promise.all(promises);
            } else if (scheduleMode === 'sunday_holiday') {
                const payload = {
                    ...formData,
                    dayOfWeek: 'Sunday',
                    topic: formData.topic || 'Sunday Rest Day & Self-Study',
                    mentor: formData.mentor || 'Self-paced',
                    type: 'Study Day',
                    time: 'All Day',
                    description: formData.description || 'No scheduled live classes today. Focus on assignments, review recordings, or take rest.',
                    prerequisites: prereqs
                };
                await axios.post(`${API_BASE_URL}/live-classes`, payload);
            } else {
                const payload = { ...formData, prerequisites: prereqs };
                await axios.post(`${API_BASE_URL}/live-classes`, payload);
            }

            setIsFormOpen(false);
            setScheduleMode('single');
            setFormData({
                topic: '', mentor: '', track: 'MERN Stack', type: 'Core Lecture',
                dayOfWeek: 'Monday', time: '7:00 PM - 9:00 PM', meetingLink: '',
                description: '', prerequisites: ''
            });
            fetchClasses();
        } catch (error) {
            console.error("Error creating live class", error);
            alert("Failed to create live class session");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this class?")) return;
        try {
            await axios.delete(`${API_BASE_URL}/live-classes/${id}`);
            fetchClasses();
        } catch (error) {
            console.error("Error deleting live class", error);
        }
    };

    const toggleLiveStatus = async (cls) => {
        try {
            await axios.put(`${API_BASE_URL}/live-classes/${cls._id}`, {
                isActiveNow: !cls.isActiveNow,
                status: !cls.isActiveNow ? "Live" : "Scheduled"
            });
            fetchClasses();
        } catch (error) {
            console.error("Error toggling live status", error);
        }
    };

    // Derived statistics
    const liveNowCount = classes.filter(c => c.isActiveNow).length;
    const totalScheduled = classes.length;
    const uniqueTracks = Array.from(new Set(classes.map(c => c.track))).length;
    const uniqueMentors = Array.from(new Set(classes.map(c => c.mentor))).length;

    // Filtered classes
    const filteredClasses = classes.filter(cls => {
        const matchesSearch = cls.topic.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              cls.mentor.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTrack = selectedTrackFilter === 'All' || cls.track === selectedTrackFilter;
        const matchesDay = selectedDayFilter === 'All' || cls.dayOfWeek === selectedDayFilter;
        return matchesSearch && matchesTrack && matchesDay;
    });

    return (
        <div className="lc-page-container">
            {/* Header Banner */}
            <div className="lc-header-banner">
                <div className="lc-header-content">
                    <div className="lc-title-wrap">
                        <span className="lc-badge">
                            <Sparkles className="lc-badge-icon" size={14} /> LIVE MANAGEMENT ERP
                        </span>
                        <h1 className="lc-page-title">Live Class Schedule Control</h1>
                        <p className="lc-page-subtitle">Schedule, orchestrate, and go live with real-time student learning sessions.</p>
                    </div>
                    <button className="lc-btn-primary" onClick={() => setIsFormOpen(true)}>
                        <Plus size={18} /> Schedule New Class
                    </button>
                </div>
            </div>

            {/* Metrics Overview Cards */}
            <div className="lc-stats-grid">
                <div className="lc-stat-card">
                    <div className="lc-stat-icon-box blue">
                        <Calendar size={22} />
                    </div>
                    <div className="lc-stat-info">
                        <span className="lc-stat-label">Total Scheduled</span>
                        <h3 className="lc-stat-value">{totalScheduled}</h3>
                    </div>
                </div>

                <div className="lc-stat-card pulse-border">
                    <div className="lc-stat-icon-box red">
                        <Radio size={22} className="pulse-icon" />
                    </div>
                    <div className="lc-stat-info">
                        <span className="lc-stat-label">Currently Live</span>
                        <h3 className="lc-stat-value live-highlight">{liveNowCount}</h3>
                    </div>
                </div>

                <div className="lc-stat-card">
                    <div className="lc-stat-icon-box purple">
                        <Layers size={22} />
                    </div>
                    <div className="lc-stat-info">
                        <span className="lc-stat-label">Active Tracks</span>
                        <h3 className="lc-stat-value">{uniqueTracks}</h3>
                    </div>
                </div>

                <div className="lc-stat-card">
                    <div className="lc-stat-icon-box green">
                        <User size={22} />
                    </div>
                    <div className="lc-stat-info">
                        <span className="lc-stat-label">Mentors Active</span>
                        <h3 className="lc-stat-value">{uniqueMentors}</h3>
                    </div>
                </div>
            </div>

            {/* Filter & Toolbar */}
            <div className="lc-toolbar-panel">
                <div className="lc-search-box">
                    <Search size={18} className="lc-search-icon" />
                    <input 
                        type="text" 
                        placeholder="Search by topic or mentor..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="lc-search-input"
                    />
                </div>

                <div className="lc-filter-group">
                    <div className="lc-select-wrapper">
                        <Filter size={14} className="lc-select-icon" />
                        <select 
                            value={selectedTrackFilter} 
                            onChange={(e) => setSelectedTrackFilter(e.target.value)}
                            className="lc-filter-select"
                        >
                            <option value="All">All Tracks</option>
                            <option value="MERN Stack">MERN Stack</option>
                            <option value="Python">Python</option>
                            <option value="UI/UX Design">UI/UX Design</option>
                        </select>
                    </div>

                    <div className="lc-select-wrapper">
                        <Calendar size={14} className="lc-select-icon" />
                        <select 
                            value={selectedDayFilter} 
                            onChange={(e) => setSelectedDayFilter(e.target.value)}
                            className="lc-filter-select"
                        >
                            <option value="All">All Days</option>
                            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => (
                                <option key={day} value={day}>{day}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Schedule Form Modal */}
            {isFormOpen && (
                <div className="lc-modal-overlay">
                    <div className="lc-modal-content">
                        <div className="lc-modal-header">
                            <div className="lc-modal-title-area">
                                <Video className="lc-modal-icon" size={24} />
                                <h2>Schedule Live Class Session</h2>
                            </div>
                            <button className="lc-icon-btn" onClick={() => setIsFormOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="lc-form-body">
                            <div className="lc-form-group full-width">
                                <label>Schedule Preset / Range Option</label>
                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                    <button 
                                        type="button" 
                                        style={{ 
                                            padding: '8px 14px', 
                                            borderRadius: '8px', 
                                            border: scheduleMode === 'single' ? '1px solid #6366f1' : '1px solid rgba(255,255,255,0.1)',
                                            background: scheduleMode === 'single' ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.05)',
                                            color: scheduleMode === 'single' ? '#818cf8' : '#94a3b8',
                                            cursor: 'pointer',
                                            fontWeight: 600,
                                            fontSize: '0.82rem'
                                        }}
                                        onClick={() => setScheduleMode('single')}
                                    >
                                        📅 Single Day
                                    </button>

                                    <button 
                                        type="button" 
                                        style={{ 
                                            padding: '8px 14px', 
                                            borderRadius: '8px', 
                                            border: scheduleMode === 'mon_to_sat' ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.1)',
                                            background: scheduleMode === 'mon_to_sat' ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.05)',
                                            color: scheduleMode === 'mon_to_sat' ? '#34d399' : '#94a3b8',
                                            cursor: 'pointer',
                                            fontWeight: 600,
                                            fontSize: '0.82rem'
                                        }}
                                        onClick={() => setScheduleMode('mon_to_sat')}
                                    >
                                        ⚡ Mon to Sat (Continuous Class)
                                    </button>

                                    <button 
                                        type="button" 
                                        style={{ 
                                            padding: '8px 14px', 
                                            borderRadius: '8px', 
                                            border: scheduleMode === 'sunday_holiday' ? '1px solid #f59e0b' : '1px solid rgba(255,255,255,0.1)',
                                            background: scheduleMode === 'sunday_holiday' ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.05)',
                                            color: scheduleMode === 'sunday_holiday' ? '#fbbf24' : '#94a3b8',
                                            cursor: 'pointer',
                                            fontWeight: 600,
                                            fontSize: '0.82rem'
                                        }}
                                        onClick={() => {
                                            setScheduleMode('sunday_holiday');
                                            setFormData(prev => ({ 
                                                ...prev, 
                                                dayOfWeek: 'Sunday', 
                                                topic: 'Sunday Rest Day & Self-Study', 
                                                type: 'Study Day', 
                                                time: 'All Day',
                                                mentor: prev.mentor || 'Self-paced'
                                            }));
                                        }}
                                    >
                                        🏖️ Sunday (Holiday Option)
                                    </button>
                                </div>
                            </div>

                            <div className="lc-form-group full-width">
                                <label>Session Topic / Title *</label>
                                <input 
                                    type="text" 
                                    name="topic" 
                                    value={formData.topic} 
                                    onChange={handleInputChange} 
                                    required={scheduleMode !== 'sunday_holiday'} 
                                    className="lc-input" 
                                    placeholder={scheduleMode === 'mon_to_sat' ? "Topic for Mon-Sat series..." : "e.g. Master Redux Toolkit & Async Thunks"} 
                                />
                            </div>

                            <div className="lc-form-row">
                                <div className="lc-form-group">
                                    <label>Mentor Name *</label>
                                    <input 
                                        type="text" 
                                        name="mentor" 
                                        value={formData.mentor} 
                                        onChange={handleInputChange} 
                                        required 
                                        className="lc-input" 
                                        placeholder="e.g. Johan Gao" 
                                    />
                                </div>

                                <div className="lc-form-group">
                                    <label>Course Track</label>
                                    <select name="track" value={formData.track} onChange={handleInputChange} className="lc-select">
                                        <option value="MERN Stack">MERN Stack</option>
                                        <option value="Python">Python</option>
                                        <option value="UI/UX Design">UI/UX Design</option>
                                        <option value="All Tracks">All Tracks</option>
                                    </select>
                                </div>
                            </div>

                            <div className="lc-form-row triple">
                                <div className="lc-form-group">
                                    <label>Scheduled Day</label>
                                    <select name="dayOfWeek" value={formData.dayOfWeek} onChange={handleInputChange} className="lc-select">
                                        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => (
                                            <option key={day} value={day}>{day}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="lc-form-group">
                                    <label>Time Slot</label>
                                    <input 
                                        type="text" 
                                        name="time" 
                                        value={formData.time} 
                                        onChange={handleInputChange} 
                                        className="lc-input" 
                                        placeholder="7:00 PM - 9:00 PM" 
                                    />
                                </div>

                                <div className="lc-form-group">
                                    <label>Session Type</label>
                                    <select name="type" value={formData.type} onChange={handleInputChange} className="lc-select">
                                        <option value="Core Lecture">Core Lecture</option>
                                        <option value="Hands-on Workshop">Hands-on Workshop</option>
                                        <option value="Advanced Topic">Advanced Topic</option>
                                        <option value="Coding Practice">Coding Practice</option>
                                    </select>
                                </div>
                            </div>

                            <div className="lc-form-group full-width">
                                <label>Google Meet / Streaming Link</label>
                                <input 
                                    type="url" 
                                    name="meetingLink" 
                                    value={formData.meetingLink} 
                                    onChange={handleInputChange} 
                                    className="lc-input" 
                                    placeholder="https://meet.google.com/abc-defg-hij" 
                                />
                            </div>

                            <div className="lc-form-group full-width">
                                <label>Session Description</label>
                                <textarea 
                                    name="description" 
                                    value={formData.description} 
                                    onChange={handleInputChange} 
                                    className="lc-textarea" 
                                    rows="3"
                                    placeholder="Provide key highlights of what will be taught in this live class..."
                                ></textarea>
                            </div>

                            <div className="lc-form-group full-width">
                                <label>Prerequisites (Comma separated)</label>
                                <input 
                                    type="text" 
                                    name="prerequisites" 
                                    value={formData.prerequisites} 
                                    onChange={handleInputChange} 
                                    className="lc-input" 
                                    placeholder="Node.js installed, VS Code setup" 
                                />
                            </div>

                            <div className="lc-modal-footer">
                                <button type="button" className="lc-btn-secondary" onClick={() => setIsFormOpen(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="lc-btn-primary">
                                    Schedule Session
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Live Class Cards Grid */}
            <div className="lc-cards-grid">
                {loading ? (
                    <div className="lc-empty-state">
                        <p>Loading live class schedule...</p>
                    </div>
                ) : filteredClasses.length === 0 ? (
                    <div className="lc-empty-state">
                        <AlertCircle size={48} className="lc-empty-icon" />
                        <h3>No Live Classes Found</h3>
                        <p>Try adjusting your search criteria or schedule a new class above.</p>
                    </div>
                ) : (
                    filteredClasses.map(cls => (
                        <div key={cls._id} className={`lc-card ${cls.isActiveNow ? 'is-live-active' : ''}`}>
                            <div className="lc-card-header">
                                <div className="lc-card-badges">
                                    <span className={`lc-track-badge ${cls.track.toLowerCase().replace(/\s+/g, '-')}`}>
                                        {cls.track}
                                    </span>
                                    <span className="lc-type-badge">{cls.type}</span>
                                </div>
                                {cls.isActiveNow ? (
                                    <span className="lc-status-pill live">
                                        <span className="pulse-dot"></span> LIVE NOW
                                    </span>
                                ) : (
                                    <span className="lc-status-pill scheduled">
                                        Scheduled
                                    </span>
                                )}
                            </div>

                            <div className="lc-card-body">
                                <h3 className="lc-card-topic">{cls.topic}</h3>
                                {cls.description && <p className="lc-card-desc">{cls.description}</p>}

                                <div className="lc-meta-list">
                                    <div className="lc-meta-item">
                                        <Calendar size={15} className="lc-meta-icon" />
                                        <span>{cls.dayOfWeek}</span>
                                    </div>
                                    <div className="lc-meta-item">
                                        <Clock size={15} className="lc-meta-icon" />
                                        <span>{cls.time}</span>
                                    </div>
                                    <div className="lc-meta-item">
                                        <BookOpen size={15} className="lc-meta-icon" />
                                        <span>{cls.mentor}</span>
                                    </div>
                                    {cls.meetingLink && (
                                        <div className="lc-meta-item link">
                                            <LinkIcon size={15} className="lc-meta-icon" />
                                            <a href={cls.meetingLink} target="_blank" rel="noreferrer">
                                                Meeting Link
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="lc-card-footer">
                                <button 
                                    className={`lc-action-btn ${cls.isActiveNow ? 'end-live' : 'go-live'}`} 
                                    onClick={() => toggleLiveStatus(cls)}
                                >
                                    <Radio size={16} className={cls.isActiveNow ? 'spin' : ''} />
                                    {cls.isActiveNow ? 'End Live Session' : 'Broadcast Live Now'}
                                </button>
                                <button 
                                    className="lc-delete-btn" 
                                    onClick={() => handleDelete(cls._id)}
                                    title="Delete Session"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
