import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useAuth } from '../hooks/AuthContext';
import { 
  Users, CheckCircle, XCircle, Clock, CalendarDays, Percent, 
  Search, Filter, Save, Download, FileText, CheckSquare, 
  AlertTriangle, BrainCircuit, Bell, MoreVertical
} from 'lucide-react';
import { exportToPDF, exportToExcel } from '../utils/exportUtils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './InstructorCheck.css';

const API_BASE = 'http://localhost:9000/api';

// ─── Mock Data for AI Analytics ────────────────────────────────────────────
const MOCK_ANALYTICS = [
  { name: 'Mon', attendance: 85 },
  { name: 'Tue', attendance: 88 },
  { name: 'Wed', attendance: 78 },
  { name: 'Thu', attendance: 92 },
  { name: 'Fri', attendance: 89 },
];

export default function InstructorCheck() {
  const { user } = useAuth();
  
  const [loadingBatches, setLoadingBatches] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [isLocked, setIsLocked] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // 1. Fetch Batches on Mount
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const res = await axios.get(`${API_BASE}/batches`);
        if (res.data && res.data.batches) {
          setBatches(res.data.batches);
          if (res.data.batches.length > 0) {
            setSelectedBatch(res.data.batches[0]._id);
          }
        }
      } catch (error) {
        console.error("Failed to fetch batches", error);
      } finally {
        setLoadingBatches(false);
      }
    };
    fetchBatches();
  }, []);

  // 2. Fetch Students and Existing Attendance when Batch or Date changes
  useEffect(() => {
    if (!selectedBatch) return;
    
    const fetchStudentsAndAttendance = async () => {
      setLoadingStudents(true);
      setIsLocked(false);
      try {
        // Fetch Students
        const studentsRes = await axios.get(`${API_BASE}/attendance/batch/${selectedBatch}/students`);
        let enrolledStudents = studentsRes.data.students || [];
        
        // Transform to our table format
        let formattedStudents = enrolledStudents.map((s, i) => ({
          id: s._id,
          name: s.name,
          batch: batches.find(b => b._id === selectedBatch)?.batchName || 'Unknown',
          rollNo: s.enrollmentNumber || `R-${1000 + i}`,
          status: '', 
          checkIn: '--:--',
          remarks: '',
          attendancePercentage: Math.floor(Math.random() * 40) + 60, // AI mock
        }));

        // Fetch Existing Attendance for this date
        const attRes = await axios.get(`${API_BASE}/attendance/batch/${selectedBatch}`);
        if (attRes.data && attRes.data.attendance) {
          // Find the record for the selected date
          const selectedDateObj = new Date(selectedDate);
          const existingRecord = attRes.data.attendance.find(a => {
            const aDate = new Date(a.date);
            return aDate.getFullYear() === selectedDateObj.getFullYear() &&
                   aDate.getMonth() === selectedDateObj.getMonth() &&
                   aDate.getDate() === selectedDateObj.getDate();
          });

          if (existingRecord) {
            // Apply existing statuses
            formattedStudents = formattedStudents.map(fs => {
              const record = existingRecord.records.find(r => r.studentId._id === fs.id || r.studentId === fs.id);
              if (record) {
                return { ...fs, status: record.status.toLowerCase(), checkIn: '09:00 AM' }; // Mock checkIn
              }
              return fs;
            });
            // If it already exists for past dates, we might want to lock it (optional)
            // setIsLocked(true);
          }
        }

        setStudents(formattedStudents);
      } catch (error) {
        console.error("Error fetching students or attendance:", error);
      } finally {
        setLoadingStudents(false);
      }
    };

    fetchStudentsAndAttendance();
  }, [selectedBatch, selectedDate, batches]);

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

  const handleSaveAttendance = async () => {
    if (!selectedBatch) return alert("Please select a batch first.");
    
    // Validate all have status
    const unmarked = students.filter(s => !s.status);
    if (unmarked.length > 0) {
      if (!window.confirm(`${unmarked.length} students are unmarked. Save anyway?`)) {
        return;
      }
    }

    setIsSaving(true);
    
    // Prepare payload matching backend model: records: [{ studentId, status }]
    const records = students
      .filter(s => s.status)
      .map(s => ({
        studentId: s.id,
        status: s.status.charAt(0).toUpperCase() + s.status.slice(1) // "Present", "Absent", "Late"
      }));

    try {
      const payload = {
        batchId: selectedBatch,
        instructorId: user?._id || '64f1b2b3c9e77d0012345678', // Fallback if user ID is missing
        date: selectedDate,
        records: records,
        notes: "Marked via v4.0.0 Dashboard"
      };

      const res = await axios.post(`${API_BASE}/attendance`, payload);
      
      if (res.data.success) {
        setIsLocked(true);
        alert('Attendance saved and locked successfully!');
      } else {
        alert('Failed to save attendance: ' + res.data.message);
      }
    } catch (error) {
      console.error("Save error:", error);
      alert('An error occurred while saving attendance.');
    } finally {
      setIsSaving(false);
    }
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
      return matchSearch;
    });
  }, [students, searchQuery]);

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
  if (loadingBatches) {
    return (
      <div className="attendance-dashboard">
        <div className="glass-panel" style={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="skeleton-text" style={{ width: '200px' }}></div>
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
                {batches.length === 0 && <option value="">No Batches Found</option>}
                {batches.map(b => (
                  <option key={b._id} value={b._id}>{b.batchName}</option>
                ))}
              </select>
              <input 
                type="date" 
                className="att-date-input" 
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
              />
            </div>
            <div className="controls-right">
              <button className="btn-att-outline" onClick={handleMarkAllPresent} disabled={isLocked || loadingStudents}>
                <CheckSquare size={16} /> Mark All Present
              </button>
              <button className="btn-att-primary" onClick={handleSaveAttendance} disabled={isLocked || isSaving || loadingStudents}>
                <Save size={16} /> {isSaving ? 'Saving...' : 'Save & Lock'}
              </button>
            </div>
          </div>

          <div className="table-container">
            {loadingStudents ? (
              <div style={{ padding: '20px' }}>
                {[1, 2, 3].map(i => (
                  <div key={i} className="skeleton-row">
                    <div className="skeleton-avatar"></div>
                    <div className="skeleton-text" style={{ width: '150px' }}></div>
                    <div className="skeleton-text" style={{ width: '100px' }}></div>
                  </div>
                ))}
              </div>
            ) : (
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
                    <tr><td colSpan="5" style={{textAlign:'center', padding:'30px'}}>No students enrolled in this batch.</td></tr>
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
            )}
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
                  <p>This batch sees a 20% drop in attendance on Fridays. Consider engaging activities.</p>
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
