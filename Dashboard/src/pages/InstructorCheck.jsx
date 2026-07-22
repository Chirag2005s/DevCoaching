import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, CheckCircle, XCircle, Clock, CalendarDays, Percent, 
  Search, Filter, Save, Download, FileText, CheckSquare, 
  AlertTriangle, BrainCircuit, Bell, MoreVertical
} from 'lucide-react';
import { exportToPDF, exportToExcel } from '../utils/exportUtils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './InstructorCheck.css';

// ─── Mock Data ─────────────────────────────────────────────────────────────
const MOCK_STUDENTS = Array.from({ length: 45 }, (_, i) => ({
  id: `STU-${1000 + i}`,
  name: `Student ${i + 1}`,
  batch: i % 2 === 0 ? 'BATCH-FE-2026' : 'BATCH-BE-2026',
  rollNo: 100 + i,
  status: '', // 'present', 'absent', 'late', 'leave', ''
  checkIn: i % 3 === 0 ? '09:05 AM' : '--:--',
  remarks: '',
  lastAttendance: i % 4 === 0 ? 'Absent' : 'Present',
  attendancePercentage: Math.floor(Math.random() * 40) + 60, // 60 to 100
}));

const MOCK_ANALYTICS = [
  { name: 'Mon', attendance: 85 },
  { name: 'Tue', attendance: 88 },
  { name: 'Wed', attendance: 78 },
  { name: 'Thu', attendance: 92 },
  { name: 'Fri', attendance: 89 },
];

export default function InstructorCheck() {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('All');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isLocked, setIsLocked] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize Data
  useEffect(() => {
    // Simulate API fetch
    const timer = setTimeout(() => {
      setStudents(MOCK_STUDENTS);
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // ─── Handlers ────────────────────────────────────────────────────────────
  const handleStatusChange = (id, status) => {
    if (isLocked) return;
    setStudents(prev => prev.map(s => s.id === id ? { ...s, status } : s));
  };

  const handleRemarkChange = (id, remarks) => {
    if (isLocked) return;
    setStudents(prev => prev.map(s => s.id === id ? { ...s, remarks } : s));
  };

  const handleMarkAllPresent = () => {
    if (isLocked) return;
    setStudents(prev => prev.map(s => s.status ? s : { ...s, status: 'present', checkIn: '09:00 AM' }));
  };

  const handleSaveAttendance = () => {
    setIsSaving(true);
    // Simulate save
    setTimeout(() => {
      setIsSaving(false);
      setIsLocked(true);
      alert('Attendance saved and locked successfully! Notifications sent to absent students.');
    }, 1500);
  };

  const handleExportPDF = () => {
    const data = filteredStudents.map(s => [s.rollNo, s.name, s.batch, s.status || 'Not Marked', s.remarks]);
    exportToPDF(['Roll No', 'Name', 'Batch', 'Status', 'Remarks'], data, `Attendance_${selectedDate}`, `attendance_${selectedDate}.pdf`);
  };

  const handleExportExcel = () => {
    const data = filteredStudents.map(s => ({
      'Roll No': s.rollNo,
      'Name': s.name,
      'Batch': s.batch,
      'Status': s.status || 'Not Marked',
      'Check In': s.checkIn,
      'Remarks': s.remarks
    }));
    exportToExcel(data, `attendance_${selectedDate}.xlsx`);
  };

  // ─── Computed Stats ──────────────────────────────────────────────────────
  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchBatch = selectedBatch === 'All' || s.batch === selectedBatch;
      return matchSearch && matchBatch;
    });
  }, [students, searchQuery, selectedBatch]);

  const stats = useMemo(() => {
    const total = filteredStudents.length;
    const present = filteredStudents.filter(s => s.status === 'present').length;
    const absent = filteredStudents.filter(s => s.status === 'absent').length;
    const late = filteredStudents.filter(s => s.status === 'late').length;
    const leave = filteredStudents.filter(s => s.status === 'leave').length;
    const marked = present + absent + late + leave;
    const percentage = marked === 0 ? 0 : Math.round(((present + late) / total) * 100);
    return { total, present, absent, late, leave, percentage };
  }, [filteredStudents]);

  const atRiskStudents = useMemo(() => {
    return students.filter(s => s.attendancePercentage < 75).slice(0, 3);
  }, [students]);

  // ─── Rendering ───────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="attendance-dashboard">
        <div className="glass-panel" style={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="skeleton-text" style={{ width: '200px' }}></div>
        </div>
        <div className="glass-panel">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="skeleton-row">
              <div className="skeleton-avatar"></div>
              <div className="skeleton-text" style={{ width: '150px' }}></div>
              <div className="skeleton-text" style={{ width: '100px' }}></div>
              <div className="skeleton-text" style={{ width: '200px' }}></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="attendance-dashboard">
      <div className="dashboard-header-bar">
        <div className="dh-title">
          <h1>Student Attendance <span className="version-tag">v4.0.0</span></h1>
          <p>Smart attendance tracking with AI insights and automated reporting.</p>
        </div>
        <div className="dh-actions">
          <button className="btn-export" onClick={handleExportPDF}><FileText size={16}/> PDF</button>
          <button className="btn-export excel" onClick={handleExportExcel}><Download size={16}/> Excel</button>
        </div>
      </div>

      {/* ══ Stats Cards ══ */}
      <div className="attendance-stats-grid">
        <div className="glass-panel att-stat-card">
          <div className="att-stat-icon" style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6' }}><Users size={20}/></div>
          <div className="att-stat-info"><h3>{stats.total}</h3><p>Total Students</p></div>
        </div>
        <div className="glass-panel att-stat-card">
          <div className="att-stat-icon" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981' }}><CheckCircle size={20}/></div>
          <div className="att-stat-info"><h3>{stats.present}</h3><p>Present Today</p></div>
        </div>
        <div className="glass-panel att-stat-card">
          <div className="att-stat-icon" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' }}><XCircle size={20}/></div>
          <div className="att-stat-info"><h3>{stats.absent}</h3><p>Absent Today</p></div>
        </div>
        <div className="glass-panel att-stat-card">
          <div className="att-stat-icon" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b' }}><Clock size={20}/></div>
          <div className="att-stat-info"><h3>{stats.late}</h3><p>Late Arrivals</p></div>
        </div>
        <div className="glass-panel att-stat-card">
          <div className="att-stat-icon" style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#6366f1' }}><CalendarDays size={20}/></div>
          <div className="att-stat-info"><h3>{stats.leave}</h3><p>On Leave</p></div>
        </div>
        <div className="glass-panel att-stat-card">
          <div className="att-stat-icon" style={{ background: 'rgba(236, 72, 153, 0.2)', color: '#ec4899' }}><Percent size={20}/></div>
          <div className="att-stat-info"><h3>{stats.percentage}%</h3><p>Attendance Rate</p></div>
        </div>
      </div>

      <div className="attendance-main-layout">
        {/* ══ Left Column: Table & Controls ══ */}
        <div className="table-section">
          <div className="attendance-controls">
            <div className="controls-left">
              <div className="att-search">
                <Search size={16} />
                <input 
                  placeholder="Search name or ID..." 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
              <select className="att-select" value={selectedBatch} onChange={e => setSelectedBatch(e.target.value)}>
                <option value="All">All Batches</option>
                <option value="BATCH-FE-2026">BATCH-FE-2026</option>
                <option value="BATCH-BE-2026">BATCH-BE-2026</option>
              </select>
              <input 
                type="date" 
                className="att-date-input" 
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
              />
            </div>
            <div className="controls-right">
              <button className="btn-att-outline" onClick={handleMarkAllPresent} disabled={isLocked}>
                <CheckSquare size={16} /> Mark All Present
              </button>
              <button className="btn-att-primary" onClick={handleSaveAttendance} disabled={isLocked || isSaving}>
                <Save size={16} /> {isSaving ? 'Saving...' : 'Save & Lock'}
              </button>
            </div>
          </div>

          <div className="table-container">
            <table className="att-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Roll No</th>
                  <th>Status</th>
                  <th>Check-In</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr><td colSpan="5" style={{textAlign:'center', padding:'30px'}}>No students found matching criteria.</td></tr>
                ) : (
                  filteredStudents.map(student => (
                    <tr key={student.id}>
                      <td>
                        <div className="student-cell">
                          <div className="student-photo">{student.name.charAt(0)}</div>
                          <div className="student-info">
                            <h4>{student.name}</h4>
                            <p>{student.id} • {student.batch}</p>
                          </div>
                        </div>
                      </td>
                      <td>{student.rollNo}</td>
                      <td>
                        <div className="status-toggle-group">
                          <button 
                            className={`status-toggle-btn ${student.status === 'present' ? 'active present' : ''}`}
                            onClick={() => handleStatusChange(student.id, 'present')}
                          >P</button>
                          <button 
                            className={`status-toggle-btn ${student.status === 'absent' ? 'active absent' : ''}`}
                            onClick={() => handleStatusChange(student.id, 'absent')}
                          >A</button>
                          <button 
                            className={`status-toggle-btn ${student.status === 'late' ? 'active late' : ''}`}
                            onClick={() => handleStatusChange(student.id, 'late')}
                          >L</button>
                          <button 
                            className={`status-toggle-btn ${student.status === 'leave' ? 'active leave' : ''}`}
                            onClick={() => handleStatusChange(student.id, 'leave')}
                          >LV</button>
                        </div>
                      </td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{student.checkIn}</td>
                      <td>
                        <input 
                          type="text" 
                          className="att-remarks-input" 
                          placeholder="Add remark..." 
                          value={student.remarks}
                          onChange={e => handleRemarkChange(student.id, e.target.value)}
                          disabled={isLocked}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ══ Right Column: Analytics & AI ══ */}
        <div className="sidebar-widgets">
          {/* AI Insights Widget */}
          <div className="glass-panel ai-widget">
            <div className="widget-header">
              <h3 style={{ color: '#f472b6' }}><BrainCircuit size={18} /> AI Attendance Insights</h3>
            </div>
            <div className="ai-alert-list">
              <div className="ai-alert-item">
                <div className="ai-alert-icon danger"><AlertTriangle size={14} /></div>
                <div className="ai-alert-content">
                  <h4>At-Risk Students Detected</h4>
                  <p>{atRiskStudents.length} students have fallen below the 75% threshold. Automated warnings suggested.</p>
                </div>
              </div>
              <div className="ai-alert-item">
                <div className="ai-alert-icon warning"><Bell size={14} /></div>
                <div className="ai-alert-content">
                  <h4>Unusual Pattern Detected</h4>
                  <p>Batch BATCH-FE-2026 sees a 20% drop in attendance on Fridays. Consider engaging activities.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Weekly Trend Chart */}
          <div className="glass-panel chart-widget">
            <div className="widget-header">
              <h3>Weekly Trend</h3>
            </div>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MOCK_ANALYTICS}>
                  <defs>
                    <linearGradient id="colorAtt" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                  <Area type="monotone" dataKey="attendance" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorAtt)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Top At-Risk List */}
          <div className="glass-panel">
            <div className="widget-header">
              <h3><AlertTriangle size={18} color="#ef4444" /> Needs Attention</h3>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {atRiskStudents.map(s => (
                <li key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{s.name.charAt(0)}</div>
                    <span>{s.name}</span>
                  </div>
                  <span style={{ color: '#ef4444', fontWeight: 'bold' }}>{s.attendancePercentage}%</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
