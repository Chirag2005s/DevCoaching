import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, GraduationCap, BookOpen, Library, FileText, Star,
  UserPlus, Video, Megaphone, Upload, Activity, TrendingUp,
  X, Check, AlertCircle, RefreshCw, ChevronDown
} from 'lucide-react';
import { useApi, api } from '../hooks/useApi';
import './DashboardOverview.css';

// ─── Modal Component ────────────────────────────────────────────────────────
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

// ─── Toast Notification ──────────────────────────────────────────────────────
function Toast({ message, type }) {
  if (!message) return null;
  return (
    <div className={`toast toast-${type}`}>
      {type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
      <span>{message}</span>
    </div>
  );
}

// ─── Constants (synced exactly with backend enums) ───────────────────────────
const TRACKS = ['FRONTEND', 'PYTHON', 'BACKEND', 'UI/UX', 'FULL STACK', 'ROBOTICS'];
const COURSE_STATUS = ['Free', 'Paid'];        // Course model enum
const BATCH_STATUS = ['Upcoming', 'Ongoing', 'Completed'];
const QUALIFICATIONS = ['BCA', 'MCA', 'B.Tech CSE'];
const GENDERS = ['Male', 'Female'];

// ─── Default form values ─────────────────────────────────────────────────────
const DEFAULT_STUDENT = { name: '', email: '', password: '' };
const DEFAULT_TEACHER = {
  Name: '', Title: '', Email: '', PhoneNo: '', Exprience: '',
  Qualification: 'BCA', Gender: 'Male', Rating: '', ID: '',
  Discprition: '', Logo: 'https://ui-avatars.com/api/?name=Teacher&background=3b82f6&color=fff'
};
const DEFAULT_COURSE = { courseName: '', Language: 'FRONTEND', Disp: '', Price: '', CourseStatus: 'Free' };
const DEFAULT_BATCH = { batchName: '', track: 'FRONTEND', instructor: '', startDate: '', timings: '', maxSeats: 30, courseId: '', status: 'Upcoming' };

// ─── Main Component ──────────────────────────────────────────────────────────
export default function DashboardOverview() {
  const navigate = useNavigate();
  const { data, loading, error, refetch } = useApi('/stats');

  // Active modal key: null | 'addStudent' | 'addTeacher' | 'addCourse' | 'addBatch'
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState({ message: '', type: '' });
  const [submitting, setSubmitting] = useState(false);

  // Form states (reset each time modal opens)
  const [studentForm, setStudentForm] = useState(DEFAULT_STUDENT);
  const [teacherForm, setTeacherForm] = useState(DEFAULT_TEACHER);
  const [courseForm, setCourseForm] = useState(DEFAULT_COURSE);
  const [batchForm, setBatchForm] = useState(DEFAULT_BATCH);

  // Courses list for batch dropdown
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(false);

  // Fetch courses whenever the Add Batch modal opens
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

  const openModal = (key) => {
    // Reset form state when opening a fresh modal
    if (key === 'addStudent') setStudentForm(DEFAULT_STUDENT);
    if (key === 'addTeacher') setTeacherForm(DEFAULT_TEACHER);
    if (key === 'addCourse') setCourseForm(DEFAULT_COURSE);
    if (key === 'addBatch') setBatchForm(DEFAULT_BATCH);
    setModal(key);
  };

  const closeModal = () => setModal(null);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleAddStudent = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/auth/register', studentForm);
      showToast(`Student "${studentForm.name}" registered successfully!`);
      closeModal();
      refetch();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to register student.', 'error');
    } finally { setSubmitting(false); }
  };

  const handleAddTeacher = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    // Auto-generate logo URL from name if empty
    const payload = {
      ...teacherForm,
      Rating: parseFloat(teacherForm.Rating),
      PhoneNo: Number(teacherForm.PhoneNo),
      Logo: teacherForm.Logo ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(teacherForm.Name)}&background=3b82f6&color=fff`
    };
    try {
      const res = await api.post('/Teacher', payload);
      // Backend returns 200 with 'already exists' message
      if (res.data?.message?.toLowerCase().includes('already')) {
        showToast(res.data.message, 'error');
      } else {
        showToast(`Teacher "${teacherForm.Name}" added successfully!`);
        closeModal();
        refetch();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to add teacher.', 'error');
    } finally { setSubmitting(false); }
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = { ...courseForm, Price: Number(courseForm.Price) };
    try {
      const res = await api.post('/Course', payload);
      // Backend returns 200 with 'already exists' message
      if (res.data?.message?.toLowerCase().includes('already')) {
        showToast(res.data.message, 'error');
      } else {
        showToast(`Course "${courseForm.courseName}" created!`);
        closeModal();
        refetch();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create course.', 'error');
    } finally { setSubmitting(false); }
  };

  const handleAddBatch = async (e) => {
    e.preventDefault();
    if (!batchForm.courseId) {
      showToast('Please select a course for this batch.', 'error');
      return;
    }
    setSubmitting(true);
    const payload = { ...batchForm, maxSeats: Number(batchForm.maxSeats) };
    try {
      await api.post('/batches', payload);
      showToast(`Batch "${batchForm.batchName}" created successfully!`);
      closeModal();
      refetch();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create batch.', 'error');
    } finally { setSubmitting(false); }
  };

  // ── Render states ─────────────────────────────────────────────────────────
  if (loading) return (
    <div className="overview-loading">
      <RefreshCw className="spin" size={36} />
      <p>Loading dashboard data...</p>
    </div>
  );

  if (error) return (
    <div className="overview-error">
      <AlertCircle size={52} />
      <h2>Backend Unreachable</h2>
      <p>Could not connect to <b>localhost:9000</b>. Make sure your backend server is running.</p>
      <button className="btn-retry" onClick={refetch}>
        <RefreshCw size={16} /> Retry Connection
      </button>
    </div>
  );

  const { stats, recentStudents = [], recentBatches = [] } = data;

  // ── Data-driven card config ───────────────────────────────────────────────
  const analyticsCards = [
    { label: 'Total Students',    value: stats.totalStudents,        color: '#3b82f6', bg: 'rgba(59,130,246,0.12)',  icon: <Users size={22} />,        trend: 'Registered users' },
    { label: 'Total Teachers',    value: stats.totalTeachers,        color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)',  icon: <GraduationCap size={22} />, trend: 'Active faculty' },
    { label: 'Total Courses',     value: stats.totalCourses,         color: '#10b981', bg: 'rgba(16,185,129,0.12)',  icon: <BookOpen size={22} />,      trend: 'Available courses' },
    { label: 'Total Batches',     value: stats.totalBatches,         color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  icon: <Library size={22} />,       trend: `${stats.activeBatches} ongoing` },
    { label: 'Active Batches',    value: stats.activeBatches,        color: '#ef4444', bg: 'rgba(239,68,68,0.12)',   icon: <Activity size={22} />,      trend: `${stats.upcomingBatches} upcoming` },
    { label: 'Avg Rating',        value: stats.avgRating || '—',     color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  icon: <Star size={22} />,          trend: `${stats.totalReviews} reviews` },
    { label: 'Attendance Logs',   value: stats.totalAttendanceRecords, color: '#14b8a6', bg: 'rgba(20,184,166,0.12)', icon: <FileText size={22} />,    trend: 'Total records' },
    { label: 'Completed Batches', value: stats.completedBatches,     color: '#6366f1', bg: 'rgba(99,102,241,0.12)',  icon: <TrendingUp size={22} />,    trend: 'All time' },
  ];

  const quickActions = [
    { label: 'Add Student',      icon: <UserPlus size={22} />,      color: '#3b82f6', action: () => openModal('addStudent') },
    { label: 'Add Teacher',      icon: <GraduationCap size={22} />, color: '#8b5cf6', action: () => openModal('addTeacher') },
    { label: 'Add Course',       icon: <BookOpen size={22} />,      color: '#10b981', action: () => openModal('addCourse') },
    { label: 'Create Batch',     icon: <Library size={22} />,       color: '#f59e0b', action: () => openModal('addBatch') },
    { label: 'Attendance',       icon: <FileText size={22} />,      color: '#ef4444', action: () => navigate('/attendance') },
    { label: 'Instructors',      icon: <Video size={22} />,         color: '#14b8a6', action: () => navigate('/instructor-check') },
    { label: 'Announcement',     icon: <Megaphone size={22} />,     color: '#f59e0b', action: () => showToast('Announcement module coming in Phase 3.', 'error') },
    { label: 'Export Report',    icon: <Upload size={22} />,        color: '#6366f1', action: () => showToast('Export module coming in Phase 3.', 'error') },
  ];

  const batchStatusColor = s => s === 'Ongoing' ? '#10b981' : s === 'Upcoming' ? '#3b82f6' : '#6b7280';

  // ── JSX ───────────────────────────────────────────────────────────────────
  return (
    <div className="dashboard-overview">
      <Toast message={toast.message} type={toast.type} />

      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div className="banner-content">
          <h1>Welcome back, Admin! 👋</h1>
          <p>Here's a live overview of your coaching institute.</p>
        </div>
        <button className="btn-refresh" onClick={refetch}>
          <RefreshCw size={15} /> Refresh Data
        </button>
      </div>

      {/* Analytics Cards */}
      <div className="section-header"><h2>Analytics Overview</h2></div>
      <div className="analytics-grid">
        {analyticsCards.map(card => (
          <div className="analytics-card" key={card.label}>
            <div className="card-icon" style={{ backgroundColor: card.bg, color: card.color }}>
              {card.icon}
            </div>
            <div className="card-data">
              <h3>{card.label}</h3>
              <span className="value" style={{ color: card.color }}>{card.value}</span>
              <span className="trend">{card.trend}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="section-header"><h2>Quick Actions</h2></div>
      <div className="quick-actions-grid">
        {quickActions.map(q => (
          <button
            key={q.label}
            className="quick-action-btn"
            onClick={q.action}
            style={{ '--qa-color': q.color }}
            type="button"
          >
            <span className="qa-icon" style={{ color: q.color }}>{q.icon}</span>
            <span className="qa-label">{q.label}</span>
          </button>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="section-header"><h2>Recent Activity</h2></div>
      <div className="activity-grid">
        <div className="activity-card">
          <h3><Users size={16} /> Recent Students</h3>
          {recentStudents.length === 0 ? (
            <p className="empty">No students registered yet.</p>
          ) : (
            <ul>
              {recentStudents.map(s => (
                <li key={s._id} className="activity-item">
                  <div className="ai-avatar">{s.name?.charAt(0).toUpperCase()}</div>
                  <div className="ai-info">
                    <span className="ai-name">{s.name}</span>
                    <span className="ai-meta">{s.email}</span>
                  </div>
                  <span className={`badge ${s.hasPurchasedCourse ? 'badge-pro' : 'badge-free'}`}>
                    {s.hasPurchasedCourse ? 'PRO' : 'Free'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="activity-card">
          <h3><Library size={16} /> Recent Batches</h3>
          {recentBatches.length === 0 ? (
            <p className="empty">No batches created yet.</p>
          ) : (
            <ul>
              {recentBatches.map(b => (
                <li key={b._id} className="activity-item">
                  <div className="ai-avatar batch-avatar"><Library size={15} /></div>
                  <div className="ai-info">
                    <span className="ai-name">{b.batchName}</span>
                    <span className="ai-meta">{b.track} — {b.instructor}</span>
                  </div>
                  <span
                    className="badge"
                    style={{ backgroundColor: `${batchStatusColor(b.status)}22`, color: batchStatusColor(b.status) }}
                  >
                    {b.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* ════════════════════════ MODALS ════════════════════════ */}

      {/* ── Add Student ── */}
      <Modal isOpen={modal === 'addStudent'} onClose={closeModal} title="➕ Add New Student">
        <form onSubmit={handleAddStudent} className="modal-form">
          <div className="form-row">
            <label>Full Name *</label>
            <input
              required
              placeholder="e.g. Ravi Sharma"
              value={studentForm.name}
              onChange={e => setStudentForm(p => ({ ...p, name: e.target.value }))}
            />
          </div>
          <div className="form-row">
            <label>Email *</label>
            <input
              required
              type="email"
              placeholder="e.g. ravi@example.com"
              value={studentForm.email}
              onChange={e => setStudentForm(p => ({ ...p, email: e.target.value }))}
            />
          </div>
          <div className="form-row">
            <label>Password * (min 6 chars)</label>
            <input
              required
              type="password"
              placeholder="Min 6 characters"
              minLength={6}
              value={studentForm.password}
              onChange={e => setStudentForm(p => ({ ...p, password: e.target.value }))}
            />
          </div>
          <button type="submit" className="btn-submit" disabled={submitting}>
            {submitting ? 'Registering...' : 'Register Student'}
          </button>
        </form>
      </Modal>

      {/* ── Add Teacher ── */}
      <Modal isOpen={modal === 'addTeacher'} onClose={closeModal} title="➕ Add New Teacher">
        <form onSubmit={handleAddTeacher} className="modal-form two-col">
          <div className="form-row">
            <label>Full Name *</label>
            <input required placeholder="e.g. Priya Sharma" value={teacherForm.Name} onChange={e => setTeacherForm(p => ({ ...p, Name: e.target.value }))} />
          </div>
          <div className="form-row">
            <label>Title *</label>
            <input required placeholder="e.g. Full Stack Developer" value={teacherForm.Title} onChange={e => setTeacherForm(p => ({ ...p, Title: e.target.value }))} />
          </div>
          <div className="form-row">
            <label>Email *</label>
            <input required type="email" placeholder="teacher@devcoaching.com" value={teacherForm.Email} onChange={e => setTeacherForm(p => ({ ...p, Email: e.target.value }))} />
          </div>
          <div className="form-row">
            <label>Phone Number *</label>
            <input required type="tel" placeholder="10-digit number" value={teacherForm.PhoneNo} onChange={e => setTeacherForm(p => ({ ...p, PhoneNo: e.target.value }))} />
          </div>
          <div className="form-row">
            <label>Experience *</label>
            <input required placeholder="e.g. 3 Years" value={teacherForm.Exprience} onChange={e => setTeacherForm(p => ({ ...p, Exprience: e.target.value }))} />
          </div>
          <div className="form-row">
            <label>Rating * (1–5)</label>
            <input required type="number" min="1" max="5" step="0.1" placeholder="4.5" value={teacherForm.Rating} onChange={e => setTeacherForm(p => ({ ...p, Rating: e.target.value }))} />
          </div>
          <div className="form-row">
            <label>Staff ID *</label>
            <input required placeholder="e.g. TC-001" value={teacherForm.ID} onChange={e => setTeacherForm(p => ({ ...p, ID: e.target.value }))} />
          </div>
          <div className="form-row">
            <label>Qualification *</label>
            <div className="select-wrap">
              <select value={teacherForm.Qualification} onChange={e => setTeacherForm(p => ({ ...p, Qualification: e.target.value }))}>
                {QUALIFICATIONS.map(q => <option key={q}>{q}</option>)}
              </select>
              <ChevronDown size={14} className="select-arrow" />
            </div>
          </div>
          <div className="form-row">
            <label>Gender *</label>
            <div className="select-wrap">
              <select value={teacherForm.Gender} onChange={e => setTeacherForm(p => ({ ...p, Gender: e.target.value }))}>
                {GENDERS.map(g => <option key={g}>{g}</option>)}
              </select>
              <ChevronDown size={14} className="select-arrow" />
            </div>
          </div>
          <div className="form-row full-width">
            <label>Photo URL <span className="optional">(auto-generated if empty)</span></label>
            <input placeholder="https://example.com/photo.jpg" value={teacherForm.Logo} onChange={e => setTeacherForm(p => ({ ...p, Logo: e.target.value }))} />
          </div>
          <div className="form-row full-width">
            <label>Description / Bio *</label>
            <textarea required rows={3} placeholder="Short professional bio..." value={teacherForm.Discprition} onChange={e => setTeacherForm(p => ({ ...p, Discprition: e.target.value }))} />
          </div>
          <button type="submit" className="btn-submit full-width" disabled={submitting}>
            {submitting ? 'Adding Teacher...' : 'Add Teacher'}
          </button>
        </form>
      </Modal>

      {/* ── Add Course ── */}
      <Modal isOpen={modal === 'addCourse'} onClose={closeModal} title="➕ Create New Course">
        <form onSubmit={handleAddCourse} className="modal-form two-col">
          <div className="form-row full-width">
            <label>Course Name *</label>
            <input required placeholder="e.g. React Mastery 2026" value={courseForm.courseName} onChange={e => setCourseForm(p => ({ ...p, courseName: e.target.value }))} />
          </div>
          <div className="form-row">
            <label>Language / Track *</label>
            <div className="select-wrap">
              <select
                required
                value={courseForm.Language}
                onChange={e => setCourseForm(p => ({ ...p, Language: e.target.value }))}
              >
                {TRACKS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <ChevronDown size={14} className="select-arrow" />
            </div>
          </div>
          <div className="form-row">
            <label>Course Type *</label>
            <div className="select-wrap">
              <select
                required
                value={courseForm.CourseStatus}
                onChange={e => setCourseForm(p => ({ ...p, CourseStatus: e.target.value }))}
              >
                {COURSE_STATUS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <ChevronDown size={14} className="select-arrow" />
            </div>
          </div>
          <div className="form-row full-width">
            <label>Price (₹) * <span className="optional">(enter 0 for free)</span></label>
            <input required type="number" min="0" placeholder="e.g. 4999" value={courseForm.Price} onChange={e => setCourseForm(p => ({ ...p, Price: e.target.value }))} />
          </div>
          <div className="form-row full-width">
            <label>Description *</label>
            <textarea required rows={3} placeholder="What will students learn in this course..." value={courseForm.Disp} onChange={e => setCourseForm(p => ({ ...p, Disp: e.target.value }))} />
          </div>
          <button type="submit" className="btn-submit full-width" disabled={submitting}>
            {submitting ? 'Creating Course...' : 'Create Course'}
          </button>
        </form>
      </Modal>

      {/* ── Create Batch ── */}
      <Modal isOpen={modal === 'addBatch'} onClose={closeModal} title="➕ Create New Batch">
        <form onSubmit={handleAddBatch} className="modal-form two-col">
          <div className="form-row">
            <label>Batch Name *</label>
            <input required placeholder="e.g. BATCH-FE-2026-01" value={batchForm.batchName} onChange={e => setBatchForm(p => ({ ...p, batchName: e.target.value }))} />
          </div>
          <div className="form-row">
            <label>Track *</label>
            <div className="select-wrap">
              <select value={batchForm.track} onChange={e => setBatchForm(p => ({ ...p, track: e.target.value }))}>
                {TRACKS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <ChevronDown size={14} className="select-arrow" />
            </div>
          </div>
          <div className="form-row full-width">
            <label>Course * (link a course)</label>
            {coursesLoading ? (
              <p className="loading-inline">Fetching courses...</p>
            ) : (
              <div className="select-wrap">
                <select
                  required
                  value={batchForm.courseId}
                  onChange={e => setBatchForm(p => ({ ...p, courseId: e.target.value }))}
                >
                  <option value="">— Select a course —</option>
                  {courses.map(c => (
                    <option key={c._id} value={c._id}>
                      {c.courseName} ({c.Language})
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="select-arrow" />
              </div>
            )}
          </div>
          <div className="form-row">
            <label>Instructor Name *</label>
            <input required placeholder="e.g. Ankit Sharma" value={batchForm.instructor} onChange={e => setBatchForm(p => ({ ...p, instructor: e.target.value }))} />
          </div>
          <div className="form-row">
            <label>Start Date *</label>
            <input required type="date" value={batchForm.startDate} onChange={e => setBatchForm(p => ({ ...p, startDate: e.target.value }))} />
          </div>
          <div className="form-row">
            <label>Timings *</label>
            <input required placeholder="e.g. Mon/Wed 6PM–8PM" value={batchForm.timings} onChange={e => setBatchForm(p => ({ ...p, timings: e.target.value }))} />
          </div>
          <div className="form-row">
            <label>Max Seats</label>
            <input type="number" min={1} max={200} value={batchForm.maxSeats} onChange={e => setBatchForm(p => ({ ...p, maxSeats: parseInt(e.target.value) || 30 }))} />
          </div>
          <div className="form-row">
            <label>Status</label>
            <div className="select-wrap">
              <select value={batchForm.status} onChange={e => setBatchForm(p => ({ ...p, status: e.target.value }))}>
                {BATCH_STATUS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <ChevronDown size={14} className="select-arrow" />
            </div>
          </div>
          <button type="submit" className="btn-submit full-width" disabled={submitting}>
            {submitting ? 'Creating Batch...' : 'Create Batch'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
