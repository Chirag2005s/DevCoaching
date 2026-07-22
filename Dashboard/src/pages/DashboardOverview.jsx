import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, GraduationCap, BookOpen, Library, FileText, Star,
  UserPlus, Video, Megaphone, Upload, Activity, TrendingUp,
  X, Check, AlertCircle, RefreshCw, ChevronDown,
  ArrowUpRight, Zap, Clock, BarChart2, Shield, Calendar as CalendarIcon, Download, FileSpreadsheet, File, Bot, GripHorizontal
} from 'lucide-react';
import { useApi, api } from '../hooks/useApi';
import { exportToPDF, exportToExcel } from '../utils/exportUtils';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import './DashboardOverview.css';

// ─── Modal & Toast ──────────────────────────────────────────────────────────
function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose} type="button">
            <X size={20} />
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

function Toast({ message, type }) {
  if (!message) return null;
  return (
    <div className={`toast toast-${type}`}>
      {type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
      <span>{message}</span>
    </div>
  );
}

// ─── Constants ────────────────────────────────────────────────────────────────
const TRACKS        = ['FRONTEND', 'PYTHON', 'BACKEND', 'UI/UX', 'FULL STACK', 'ROBOTICS'];
const COURSE_STATUS = ['Free', 'Paid'];
const BATCH_STATUS  = ['Upcoming', 'Ongoing', 'Completed'];
const QUALIFICATIONS = ['BCA', 'MCA', 'B.Tech CSE'];
const GENDERS       = ['Male', 'Female'];

const DEFAULT_STUDENT = { name: '', email: '', password: '' };
const DEFAULT_TEACHER = {
  Name: '', Title: '', Email: '', PhoneNo: '', Exprience: '',
  Qualification: 'BCA', Gender: 'Male', Rating: '', ID: '',
  Discprition: '', Logo: 'https://ui-avatars.com/api/?name=Teacher&background=3b82f6&color=fff'
};
const DEFAULT_COURSE = { courseName: '', Language: 'FRONTEND', Disp: '', Price: '', CourseStatus: 'Free' };
const DEFAULT_BATCH  = { batchName: '', track: 'FRONTEND', instructor: '', startDate: '', timings: '', maxSeats: 30, courseId: '', status: 'Upcoming' };

// ─── Main Component ───────────────────────────────────────────────────────────
export default function DashboardOverview() {
  const navigate  = useNavigate();
  const { data, loading, error, refetch } = useApi('/stats');

  const [modal,      setModal]      = useState(null);
  const [toast,      setToast]      = useState({ message: '', type: '' });
  const [submitting, setSubmitting] = useState(false);
  const [date, setDate] = useState(new Date());

  const [studentForm, setStudentForm] = useState(DEFAULT_STUDENT);
  const [teacherForm, setTeacherForm] = useState(DEFAULT_TEACHER);
  const [courseForm,  setCourseForm]  = useState(DEFAULT_COURSE);
  const [batchForm,   setBatchForm]   = useState(DEFAULT_BATCH);
  const [courses,     setCourses]     = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(false);
  
  const [widgetOrder, setWidgetOrder] = useState(['analytics', 'charts', 'timeline_insights']);

  useEffect(() => {
    if (modal === 'addBatch') {
      setCoursesLoading(true);
      api.get('/Course')
        .then(res => setCourses(res.data.course || []))
        .catch(() => setCourses([]))
        .finally(() => setCoursesLoading(false));
    }
  }, [modal]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: '' }), 4000);
  };

  const openModal = key => {
    if (key === 'addStudent') setStudentForm(DEFAULT_STUDENT);
    if (key === 'addTeacher') setTeacherForm(DEFAULT_TEACHER);
    if (key === 'addCourse')  setCourseForm(DEFAULT_COURSE);
    if (key === 'addBatch')   setBatchForm(DEFAULT_BATCH);
    setModal(key);
  };

  const closeModal = () => setModal(null);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleAddStudent = async e => {
    e.preventDefault(); setSubmitting(true);
    try {
      await api.post('/auth/register', studentForm);
      showToast(`Student "${studentForm.name}" registered successfully!`);
      closeModal(); refetch();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to register student.', 'error');
    } finally { setSubmitting(false); }
  };

  const handleAddTeacher = async e => {
    e.preventDefault(); setSubmitting(true);
    const payload = {
      ...teacherForm, Rating: parseFloat(teacherForm.Rating), PhoneNo: Number(teacherForm.PhoneNo),
      Logo: teacherForm.Logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(teacherForm.Name)}&background=3b82f6&color=fff`
    };
    try {
      const res = await api.post('/Teacher', payload);
      if (res.data?.message?.toLowerCase().includes('already')) { showToast(res.data.message, 'error'); }
      else { showToast(`Teacher "${teacherForm.Name}" added successfully!`); closeModal(); refetch(); }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to add teacher.', 'error');
    } finally { setSubmitting(false); }
  };

  const handleAddCourse = async e => {
    e.preventDefault(); setSubmitting(true);
    const payload = { ...courseForm, Price: Number(courseForm.Price) };
    try {
      const res = await api.post('/Course', payload);
      if (res.data?.message?.toLowerCase().includes('already')) { showToast(res.data.message, 'error'); }
      else { showToast(`Course "${courseForm.courseName}" created!`); closeModal(); refetch(); }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create course.', 'error');
    } finally { setSubmitting(false); }
  };

  const handleAddBatch = async e => {
    e.preventDefault();
    if (!batchForm.courseId) { showToast('Please select a course for this batch.', 'error'); return; }
    setSubmitting(true);
    const payload = { ...batchForm, maxSeats: Number(batchForm.maxSeats) };
    try {
      await api.post('/batches', payload);
      showToast(`Batch "${batchForm.batchName}" created successfully!`); closeModal(); refetch();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create batch.', 'error');
    } finally { setSubmitting(false); }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(widgetOrder);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setWidgetOrder(items);
  };

  // ── Loading / Error ────────────────────────────────────────────────────────
  if (loading) return (
    <div className="overview-loading">
      <div className="ov-loader-ring"><RefreshCw className="spin" size={28} /></div>
      <p>Loading v4.0.0 Dashboard…</p>
    </div>
  );

  if (error) return (
    <div className="overview-error">
      <AlertCircle size={52} />
      <h2>Backend Unreachable</h2>
      <p>Could not connect to backend server. Please verify your connection.</p>
      <button className="btn-retry" onClick={refetch}><RefreshCw size={16} /> Retry</button>
    </div>
  );

  const { stats, recentStudents = [], recentBatches = [] } = data;
  const now = new Date();

  // Export functions
  const handleExportPDF = () => {
    const success = exportToPDF(
      ['Metric', 'Value'],
      [
        ['Total Students', stats.totalStudents],
        ['Total Teachers', stats.totalTeachers],
        ['Total Courses', stats.totalCourses],
        ['Total Batches', stats.totalBatches],
        ['Active Batches', stats.activeBatches]
      ],
      'Dev Coaching Dashboard Report',
      'dashboard_report.pdf'
    );
    if(success) showToast('PDF Report Exported Successfully!');
  };

  const handleExportExcel = () => {
    const success = exportToExcel([
      { Metric: 'Total Students', Value: stats.totalStudents },
      { Metric: 'Total Teachers', Value: stats.totalTeachers },
      { Metric: 'Total Courses', Value: stats.totalCourses },
      { Metric: 'Total Batches', Value: stats.totalBatches },
      { Metric: 'Active Batches', Value: stats.activeBatches }
    ], 'dashboard_data.xlsx');
    if(success) showToast('Excel Report Exported Successfully!');
  };

  // Chart Data
  const enrollmentData = [
    { name: 'Jan', students: 400 }, { name: 'Feb', students: 300 },
    { name: 'Mar', students: 550 }, { name: 'Apr', students: 450 },
    { name: 'May', students: 700 }, { name: 'Jun', students: Math.max(stats.totalStudents || 800, 600) }
  ];

  const batchData = [
    { name: 'Frontend', active: 4, completed: 12 },
    { name: 'Backend', active: 3, completed: 8 },
    { name: 'Python', active: 5, completed: 15 },
    { name: 'UI/UX', active: 2, completed: 5 }
  ];

  const batchStatusColor = s => s === 'Ongoing' ? '#10b981' : s === 'Upcoming' ? '#3b82f6' : '#6b7280';

  const widgets = {
    analytics: (
      <div className="ov-analytics-grid">
        {[
          { label: 'Total Students', value: stats.totalStudents, icon: <Users size={24}/>, color: 'var(--accent-primary)' },
          { label: 'Total Teachers', value: stats.totalTeachers, icon: <GraduationCap size={24}/>, color: '#8b5cf6' },
          { label: 'Total Courses', value: stats.totalCourses, icon: <BookOpen size={24}/>, color: '#10b981' },
          { label: 'Active Batches', value: stats.activeBatches, icon: <Activity size={24}/>, color: '#f59e0b' }
        ].map((item, i) => (
          <div className="stat-card glass-panel" key={i}>
            <div className="stat-icon" style={{ backgroundColor: `${item.color}20`, color: item.color }}>{item.icon}</div>
            <div className="stat-info">
              <h3>{item.value}</h3>
              <p>{item.label}</p>
            </div>
          </div>
        ))}
      </div>
    ),
    charts: (
      <div className="charts-container grid-2-col">
        <div className="chart-card glass-panel">
          <div className="chart-header">
            <h3>Enrollment Trends</h3>
            <span className="badge">Last 6 Months</span>
          </div>
          <div className="chart-body">
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={enrollmentData}>
                <defs>
                  <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                <Area type="monotone" dataKey="students" stroke="#3b82f6" fillOpacity={1} fill="url(#colorStudents)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="chart-card glass-panel">
          <div className="chart-header">
            <h3>Batch Distribution</h3>
            <span className="badge">By Track</span>
          </div>
          <div className="chart-body">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={batchData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                <Legend />
                <Bar dataKey="active" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="completed" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    ),
    timeline_insights: (
      <div className="insights-timeline-container grid-3-col">
        {/* Calendar Widget */}
        <div className="widget-card glass-panel">
          <div className="widget-header">
            <h3><CalendarIcon size={18} /> Schedule</h3>
          </div>
          <div className="calendar-wrapper">
            <Calendar onChange={setDate} value={date} className="custom-calendar" />
          </div>
        </div>

        {/* AI Insights */}
        <div className="widget-card glass-panel ai-insights">
          <div className="widget-header">
            <h3 style={{ color: '#f472b6' }}><Bot size={18} /> AI Insights</h3>
            <span className="ai-badge">Live</span>
          </div>
          <ul className="insights-list">
            <li>
              <div className="insight-icon bg-blue">💡</div>
              <p>Enrollment is up 15% this month compared to last month. Consider launching a new Frontend batch soon.</p>
            </li>
            <li>
              <div className="insight-icon bg-red">⚠️</div>
              <p>Batch <b>BATCH-FE-2026</b> has seen a drop in attendance over the last 3 days.</p>
            </li>
            <li>
              <div className="insight-icon bg-green">✅</div>
              <p>Overall student satisfaction is highly correlated with instructor Ankit Sharma's batches.</p>
            </li>
          </ul>
        </div>

        {/* Activity Timeline */}
        <div className="widget-card glass-panel">
          <div className="widget-header">
            <h3><Activity size={18} /> Recent Activity</h3>
          </div>
          <div className="timeline-container">
            {recentStudents.slice(0, 3).map((s, i) => (
              <div className="timeline-item" key={`s-${i}`}>
                <div className="timeline-dot blue"></div>
                <div className="timeline-content">
                  <h4>New Student Joined</h4>
                  <p>{s.name} registered</p>
                  <span className="time">Just now</span>
                </div>
              </div>
            ))}
            {recentBatches.slice(0, 2).map((b, i) => (
              <div className="timeline-item" key={`b-${i}`}>
                <div className="timeline-dot green"></div>
                <div className="timeline-content">
                  <h4>Batch Created</h4>
                  <p>{b.batchName} ({b.track})</p>
                  <span className="time">Today</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  };

  // ── JSX ───────────────────────────────────────────────────────────────────
  return (
    <div className="dashboard-overview v4-dashboard">
      <Toast message={toast.message} type={toast.type} />

      {/* ══ Header & Actions ════════════════════════════════════════════ */}
      <div className="dashboard-header-bar">
        <div className="dh-title">
          <h1>Dashboard Overview <span className="version-tag">v4.0.0</span></h1>
          <p>{now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
        
        <div className="dh-actions">
          <div className="action-group">
            <button className="btn-primary" onClick={() => openModal('addStudent')}><UserPlus size={16} /> Add Student</button>
            <button className="btn-secondary" onClick={() => openModal('addBatch')}><Library size={16} /> New Batch</button>
          </div>
          
          <div className="export-group">
            <button className="btn-export" onClick={handleExportPDF} title="Export PDF"><File size={16} /> PDF</button>
            <button className="btn-export excel" onClick={handleExportExcel} title="Export Excel"><FileSpreadsheet size={16} /> Excel</button>
          </div>
        </div>
      </div>

      {/* ══ Draggable Widgets ═══════════════════════════════════════════ */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="dashboard-widgets">
          {(provided) => (
            <div 
              className="widgets-container" 
              {...provided.droppableProps} 
              ref={provided.innerRef}
            >
              {widgetOrder.map((widgetKey, index) => (
                <Draggable key={widgetKey} draggableId={widgetKey} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`widget-wrapper ${snapshot.isDragging ? 'is-dragging' : ''}`}
                    >
                      <div className="drag-handle" {...provided.dragHandleProps}>
                        <GripHorizontal size={16} />
                      </div>
                      {widgets[widgetKey]}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* ══════════════════════ MODALS ══════════════════════════════════ */}
      
      {/* ── Add Student ── */}
      <Modal isOpen={modal === 'addStudent'} onClose={closeModal} title="Add New Student">
        <form onSubmit={handleAddStudent} className="modal-form">
          <div className="form-row">
            <label>Full Name *</label>
            <input required placeholder="e.g. Ravi Sharma" value={studentForm.name}
              onChange={e => setStudentForm(p => ({ ...p, name: e.target.value }))} />
          </div>
          <div className="form-row">
            <label>Email *</label>
            <input required type="email" placeholder="e.g. ravi@example.com" value={studentForm.email}
              onChange={e => setStudentForm(p => ({ ...p, email: e.target.value }))} />
          </div>
          <div className="form-row">
            <label>Password * (min 6 chars)</label>
            <input required type="password" placeholder="Min 6 characters" minLength={6} value={studentForm.password}
              onChange={e => setStudentForm(p => ({ ...p, password: e.target.value }))} />
          </div>
          <button type="submit" className="btn-submit" disabled={submitting}>
            {submitting ? 'Registering…' : 'Register Student'}
          </button>
        </form>
      </Modal>

      {/* ── Create Batch ── */}
      <Modal isOpen={modal === 'addBatch'} onClose={closeModal} title="Create New Batch">
        <form onSubmit={handleAddBatch} className="modal-form two-col">
          <div className="form-row">
            <label>Batch Name *</label>
            <input required placeholder="e.g. BATCH-FE-2026-01" value={batchForm.batchName}
              onChange={e => setBatchForm(p => ({ ...p, batchName: e.target.value }))} />
          </div>
          <div className="form-row">
            <label>Track *</label>
            <div className="select-wrap">
              <select value={batchForm.track}
                onChange={e => setBatchForm(p => ({ ...p, track: e.target.value }))}>
                {TRACKS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <ChevronDown size={14} className="select-arrow" />
            </div>
          </div>
          <div className="form-row full-width">
            <label>Course * (link a course)</label>
            {coursesLoading ? (
              <p className="loading-inline">Fetching courses…</p>
            ) : (
              <div className="select-wrap">
                <select required value={batchForm.courseId}
                  onChange={e => setBatchForm(p => ({ ...p, courseId: e.target.value }))}>
                  <option value="">— Select a course —</option>
                  {courses.map(c => (
                    <option key={c._id} value={c._id}>{c.courseName} ({c.Language})</option>
                  ))}
                </select>
                <ChevronDown size={14} className="select-arrow" />
              </div>
            )}
          </div>
          <div className="form-row">
            <label>Instructor Name *</label>
            <input required placeholder="e.g. Ankit Sharma" value={batchForm.instructor}
              onChange={e => setBatchForm(p => ({ ...p, instructor: e.target.value }))} />
          </div>
          <div className="form-row">
            <label>Start Date *</label>
            <input required type="date" value={batchForm.startDate}
              onChange={e => setBatchForm(p => ({ ...p, startDate: e.target.value }))} />
          </div>
          <div className="form-row">
            <label>Timings *</label>
            <input required placeholder="e.g. Mon/Wed 6PM–8PM" value={batchForm.timings}
              onChange={e => setBatchForm(p => ({ ...p, timings: e.target.value }))} />
          </div>
          <div className="form-row">
            <label>Max Seats</label>
            <input type="number" min={1} max={200} value={batchForm.maxSeats}
              onChange={e => setBatchForm(p => ({ ...p, maxSeats: parseInt(e.target.value) || 30 }))} />
          </div>
          <div className="form-row">
            <label>Status</label>
            <div className="select-wrap">
              <select value={batchForm.status}
                onChange={e => setBatchForm(p => ({ ...p, status: e.target.value }))}>
                {BATCH_STATUS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <ChevronDown size={14} className="select-arrow" />
            </div>
          </div>
          <button type="submit" className="btn-submit full-width" disabled={submitting}>
            {submitting ? 'Creating Batch…' : 'Create Batch'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
