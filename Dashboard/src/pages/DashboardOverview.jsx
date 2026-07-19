import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, GraduationCap, BookOpen, Library, FileText, Star,
  UserPlus, Video, Megaphone, Upload, Activity, TrendingUp,
  X, Check, AlertCircle, RefreshCw, ChevronDown,
  ArrowUpRight, Zap, Clock, BarChart2, Shield,
} from 'lucide-react';
import { useApi, api } from '../hooks/useApi';
import './DashboardOverview.css';

// ─── Modal ───────────────────────────────────────────────────────────────────
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

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ message, type }) {
  if (!message) return null;
  return (
    <div className={`toast toast-${type}`}>
      {type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
      <span>{message}</span>
    </div>
  );
}

// ─── Mini Donut Chart (pure SVG) ──────────────────────────────────────────────
function DonutRing({ percent = 0, color = '#3b82f6', size = 54, stroke = 5 }) {
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (Math.min(percent, 100) / 100) * circ;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="donut-svg">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: 'stroke-dasharray 0.6s ease' }}
      />
    </svg>
  );
}

// ─── Mini Spark Bar (pure CSS) ────────────────────────────────────────────────
function SparkBars({ color = '#3b82f6', bars = [40, 65, 50, 80, 60, 90, 75] }) {
  return (
    <div className="spark-bars">
      {bars.map((h, i) => (
        <div key={i} className="spark-bar" style={{ height: `${h}%`, background: color, opacity: 0.7 + i * 0.04 }} />
      ))}
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

  const [studentForm, setStudentForm] = useState(DEFAULT_STUDENT);
  const [teacherForm, setTeacherForm] = useState(DEFAULT_TEACHER);
  const [courseForm,  setCourseForm]  = useState(DEFAULT_COURSE);
  const [batchForm,   setBatchForm]   = useState(DEFAULT_BATCH);
  const [courses,     setCourses]     = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(false);

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

  // ── Loading / Error ────────────────────────────────────────────────────────
  if (loading) return (
    <div className="overview-loading">
      <div className="ov-loader-ring"><RefreshCw className="spin" size={28} /></div>
      <p>Loading dashboard data…</p>
    </div>
  );

  if (error) return (
    <div className="overview-error">
      <AlertCircle size={52} />
      <h2>Backend Unreachable</h2>
      <p>Could not connect to <b>localhost:9000</b>. Make sure your backend server is running.</p>
      <button className="btn-retry" onClick={refetch}><RefreshCw size={16} /> Retry Connection</button>
    </div>
  );

  const { stats, recentStudents = [], recentBatches = [] } = data;

  // ── Derived values ────────────────────────────────────────────────────────
  const activeRate    = stats.totalBatches ? Math.round((stats.activeBatches / stats.totalBatches) * 100) : 0;
  const completedRate = stats.totalBatches ? Math.round((stats.completedBatches / stats.totalBatches) * 100) : 0;
  const now = new Date();

  // ── Analytics cards ───────────────────────────────────────────────────────
  const analyticsCards = [
    {
      label: 'Total Students', value: stats.totalStudents, color: '#3b82f6',
      icon: <Users size={20} />, sub: 'Registered learners',
      visual: <SparkBars color="#3b82f6" bars={[30, 50, 45, 70, 60, 85, 80]} />,
    },
    {
      label: 'Total Teachers', value: stats.totalTeachers, color: '#8b5cf6',
      icon: <GraduationCap size={20} />, sub: 'Active faculty',
      visual: <SparkBars color="#8b5cf6" bars={[60, 60, 80, 70, 75, 72, 80]} />,
    },
    {
      label: 'Total Courses', value: stats.totalCourses, color: '#10b981',
      icon: <BookOpen size={20} />, sub: 'Available courses',
      visual: <SparkBars color="#10b981" bars={[40, 55, 48, 65, 60, 70, 68]} />,
    },
    {
      label: 'Total Batches', value: stats.totalBatches, color: '#f59e0b',
      icon: <Library size={20} />, sub: `${stats.activeBatches} ongoing`,
      visual: <DonutRing percent={activeRate} color="#f59e0b" />,
    },
    {
      label: 'Active Batches', value: stats.activeBatches, color: '#ef4444',
      icon: <Activity size={20} />, sub: `${stats.upcomingBatches} upcoming`,
      visual: <DonutRing percent={activeRate} color="#ef4444" />,
    },
    {
      label: 'Avg Rating', value: stats.avgRating ? Number(stats.avgRating).toFixed(1) : '—', color: '#f59e0b',
      icon: <Star size={20} />, sub: `${stats.totalReviews} reviews`,
      visual: <DonutRing percent={stats.avgRating ? (stats.avgRating / 5) * 100 : 0} color="#f59e0b" />,
    },
    {
      label: 'Attendance Logs', value: stats.totalAttendanceRecords, color: '#14b8a6',
      icon: <FileText size={20} />, sub: 'Total records',
      visual: <SparkBars color="#14b8a6" bars={[50, 60, 70, 65, 80, 75, 90]} />,
    },
    {
      label: 'Completed Batches', value: stats.completedBatches, color: '#6366f1',
      icon: <TrendingUp size={20} />, sub: 'All time',
      visual: <DonutRing percent={completedRate} color="#6366f1" />,
    },
  ];

  // ── Quick Actions ─────────────────────────────────────────────────────────
  const primaryActions = [
    { label: 'Add Student',  icon: <UserPlus size={22} />,      color: '#3b82f6', bg: 'rgba(59,130,246,0.12)',  desc: 'Register new learner',  action: () => openModal('addStudent') },
    { label: 'Add Teacher',  icon: <GraduationCap size={22} />, color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)', desc: 'Onboard instructor',      action: () => openModal('addTeacher') },
    { label: 'Add Course',   icon: <BookOpen size={22} />,      color: '#10b981', bg: 'rgba(16,185,129,0.12)', desc: 'Create curriculum',       action: () => openModal('addCourse') },
    { label: 'Create Batch', icon: <Library size={22} />,       color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', desc: 'Launch new batch',        action: () => openModal('addBatch') },
  ];

  const secondaryActions = [
    { label: 'Attendance',   icon: <FileText size={18} />,  color: '#ef4444', action: () => navigate('/attendance') },
    { label: 'Instructors',  icon: <Video size={18} />,     color: '#14b8a6', action: () => navigate('/instructor-check') },
    { label: 'Announcement', icon: <Megaphone size={18} />, color: '#f59e0b', action: () => showToast('Announcement module coming in Phase 3.', 'error') },
    { label: 'Export Report',icon: <Upload size={18} />,    color: '#6366f1', action: () => showToast('Export module coming in Phase 3.', 'error') },
  ];

  const batchStatusColor = s => s === 'Ongoing' ? '#10b981' : s === 'Upcoming' ? '#3b82f6' : '#6b7280';

  // ── JSX ───────────────────────────────────────────────────────────────────
  return (
    <div className="dashboard-overview">
      <Toast message={toast.message} type={toast.type} />

      {/* ══ Welcome Banner ════════════════════════════════════════════ */}
      <div className="ov-banner">
        <div className="ov-banner-left">
          <div className="ov-banner-badge">
            <BarChart2 size={14} />
            <span>Live Dashboard</span>
          </div>
          <h1>Welcome back, Admin <span className="ov-wave">👋</span></h1>
          <p>Here's your coaching institute at a glance — <strong>{now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</strong></p>

          {/* Quick stat pills in banner */}
          <div className="ov-banner-pills">
            <div className="ov-banner-pill">
              <Users size={13} />
              <span>{stats.totalStudents} Students</span>
            </div>
            <div className="ov-banner-pill">
              <Activity size={13} />
              <span>{stats.activeBatches} Active Batches</span>
            </div>
            <div className="ov-banner-pill">
              <Star size={13} />
              <span>{stats.avgRating ? Number(stats.avgRating).toFixed(1) : '—'} Avg Rating</span>
            </div>
          </div>
        </div>
        <div className="ov-banner-right">
          <div className="ov-banner-visual">
            <div className="ov-banner-ring">
              <DonutRing percent={activeRate} color="#3b82f6" size={110} stroke={9} />
              <div className="ov-banner-ring-label">
                <span className="ring-pct">{activeRate}%</span>
                <span className="ring-sub">Active</span>
              </div>
            </div>
          </div>
          <button className="btn-refresh" onClick={refetch}>
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
      </div>

      {/* ══ Analytics Cards ═══════════════════════════════════════════ */}
      <div className="ov-section-header">
        <div className="ov-section-title">
          <BarChart2 size={17} />
          <h2>Analytics Overview</h2>
        </div>
        <span className="ov-section-badge">Live</span>
      </div>

      <div className="ov-analytics-grid">
        {analyticsCards.map(card => (
          <div className="ov-analytics-card" key={card.label} style={{ '--c': card.color }}>
            <div className="ov-card-header">
              <div className="ov-card-icon" style={{ background: `${card.color}18`, color: card.color }}>
                {card.icon}
              </div>
              <div className="ov-card-visual">{card.visual}</div>
            </div>
            <div className="ov-card-body">
              <span className="ov-card-label">{card.label}</span>
              <span className="ov-card-value" style={{ color: card.color }}>{card.value}</span>
              <div className="ov-card-sub">
                <ArrowUpRight size={12} style={{ color: card.color }} />
                <span>{card.sub}</span>
              </div>
            </div>
            <div className="ov-card-shine" />
          </div>
        ))}
      </div>

      {/* ══ Quick Actions ══════════════════════════════════════════════ */}
      <div className="ov-section-header">
        <div className="ov-section-title">
          <Zap size={17} />
          <h2>Quick Actions</h2>
        </div>
      </div>

      <div className="ov-qa-wrapper">
        {/* Primary actions — large cards */}
        <div className="ov-qa-primary">
          {primaryActions.map(q => (
            <button
              key={q.label}
              className="ov-qa-card"
              onClick={q.action}
              type="button"
              style={{ '--qa-c': q.color, '--qa-bg': q.bg }}
            >
              <div className="ov-qa-card-icon">
                {q.icon}
              </div>
              <div className="ov-qa-card-body">
                <span className="ov-qa-card-label">{q.label}</span>
                <span className="ov-qa-card-desc">{q.desc}</span>
              </div>
              <ArrowUpRight size={16} className="ov-qa-arrow" />
              <div className="ov-qa-card-glow" />
            </button>
          ))}
        </div>

        {/* Secondary actions — compact strip */}
        <div className="ov-qa-secondary">
          <span className="ov-qa-secondary-label">
            <Clock size={13} /> More Actions
          </span>
          <div className="ov-qa-secondary-list">
            {secondaryActions.map(q => (
              <button
                key={q.label}
                className="ov-qa-chip"
                onClick={q.action}
                type="button"
                style={{ '--qa-c': q.color }}
              >
                <span className="ov-qa-chip-icon" style={{ color: q.color }}>{q.icon}</span>
                <span>{q.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ══ Recent Activity ════════════════════════════════════════════ */}
      <div className="ov-section-header">
        <div className="ov-section-title">
          <Activity size={17} />
          <h2>Recent Activity</h2>
        </div>
      </div>

      <div className="ov-activity-grid">
        {/* Recent Students */}
        <div className="ov-activity-card">
          <div className="ov-activity-card-header">
            <div className="ov-act-title">
              <Users size={15} />
              <h3>Recent Students</h3>
            </div>
            <button className="ov-act-view-btn" onClick={() => navigate('/students')}>
              View All <ArrowUpRight size={13} />
            </button>
          </div>
          {recentStudents.length === 0 ? (
            <div className="ov-act-empty">
              <Users size={32} opacity={0.3} />
              <p>No students registered yet.</p>
            </div>
          ) : (
            <ul className="ov-act-list">
              {recentStudents.map(s => (
                <li key={s._id} className="ov-act-item">
                  <div className="ov-act-avatar" style={{ background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)' }}>
                    {(s.name || '?').charAt(0).toUpperCase()}
                  </div>
                  <div className="ov-act-info">
                    <span className="ov-act-name">{s.name}</span>
                    <span className="ov-act-meta">{s.email}</span>
                  </div>
                  <span className={`ov-act-badge ${s.hasPurchasedCourse ? 'badge-pro' : 'badge-free'}`}>
                    {s.hasPurchasedCourse ? 'PRO' : 'Free'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent Batches */}
        <div className="ov-activity-card">
          <div className="ov-activity-card-header">
            <div className="ov-act-title">
              <Library size={15} />
              <h3>Recent Batches</h3>
            </div>
            <button className="ov-act-view-btn" onClick={() => navigate('/batches')}>
              View All <ArrowUpRight size={13} />
            </button>
          </div>
          {recentBatches.length === 0 ? (
            <div className="ov-act-empty">
              <Library size={32} opacity={0.3} />
              <p>No batches created yet.</p>
            </div>
          ) : (
            <ul className="ov-act-list">
              {recentBatches.map(b => (
                <li key={b._id} className="ov-act-item">
                  <div className="ov-act-avatar" style={{ background: 'linear-gradient(135deg,#f59e0b,#ef4444)', borderRadius: '8px' }}>
                    <Library size={14} />
                  </div>
                  <div className="ov-act-info">
                    <span className="ov-act-name">{b.batchName}</span>
                    <span className="ov-act-meta">{b.track} — {b.instructor}</span>
                  </div>
                  <span
                    className="ov-act-badge"
                    style={{ background: `${batchStatusColor(b.status)}22`, color: batchStatusColor(b.status) }}
                  >
                    {b.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

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

      {/* ── Add Teacher ── */}
      <Modal isOpen={modal === 'addTeacher'} onClose={closeModal} title="Add New Teacher">
        <form onSubmit={handleAddTeacher} className="modal-form two-col">
          <div className="form-row">
            <label>Full Name *</label>
            <input required placeholder="e.g. Priya Sharma" value={teacherForm.Name}
              onChange={e => setTeacherForm(p => ({ ...p, Name: e.target.value }))} />
          </div>
          <div className="form-row">
            <label>Title *</label>
            <input required placeholder="e.g. Full Stack Developer" value={teacherForm.Title}
              onChange={e => setTeacherForm(p => ({ ...p, Title: e.target.value }))} />
          </div>
          <div className="form-row">
            <label>Email *</label>
            <input required type="email" placeholder="teacher@devcoaching.com" value={teacherForm.Email}
              onChange={e => setTeacherForm(p => ({ ...p, Email: e.target.value }))} />
          </div>
          <div className="form-row">
            <label>Phone Number *</label>
            <input required type="tel" placeholder="10-digit number" value={teacherForm.PhoneNo}
              onChange={e => setTeacherForm(p => ({ ...p, PhoneNo: e.target.value }))} />
          </div>
          <div className="form-row">
            <label>Experience *</label>
            <input required placeholder="e.g. 3 Years" value={teacherForm.Exprience}
              onChange={e => setTeacherForm(p => ({ ...p, Exprience: e.target.value }))} />
          </div>
          <div className="form-row">
            <label>Rating * (1–5)</label>
            <input required type="number" min="1" max="5" step="0.1" placeholder="4.5" value={teacherForm.Rating}
              onChange={e => setTeacherForm(p => ({ ...p, Rating: e.target.value }))} />
          </div>
          <div className="form-row">
            <label>Staff ID *</label>
            <input required placeholder="e.g. TC-001" value={teacherForm.ID}
              onChange={e => setTeacherForm(p => ({ ...p, ID: e.target.value }))} />
          </div>
          <div className="form-row">
            <label>Qualification *</label>
            <div className="select-wrap">
              <select value={teacherForm.Qualification}
                onChange={e => setTeacherForm(p => ({ ...p, Qualification: e.target.value }))}>
                {QUALIFICATIONS.map(q => <option key={q}>{q}</option>)}
              </select>
              <ChevronDown size={14} className="select-arrow" />
            </div>
          </div>
          <div className="form-row">
            <label>Gender *</label>
            <div className="select-wrap">
              <select value={teacherForm.Gender}
                onChange={e => setTeacherForm(p => ({ ...p, Gender: e.target.value }))}>
                {GENDERS.map(g => <option key={g}>{g}</option>)}
              </select>
              <ChevronDown size={14} className="select-arrow" />
            </div>
          </div>
          <div className="form-row full-width">
            <label>Photo URL <span className="optional">(auto-generated if empty)</span></label>
            <input placeholder="https://example.com/photo.jpg" value={teacherForm.Logo}
              onChange={e => setTeacherForm(p => ({ ...p, Logo: e.target.value }))} />
          </div>
          <div className="form-row full-width">
            <label>Description / Bio *</label>
            <textarea required rows={3} placeholder="Short professional bio…" value={teacherForm.Discprition}
              onChange={e => setTeacherForm(p => ({ ...p, Discprition: e.target.value }))} />
          </div>
          <button type="submit" className="btn-submit full-width" disabled={submitting}>
            {submitting ? 'Adding Teacher…' : 'Add Teacher'}
          </button>
        </form>
      </Modal>

      {/* ── Add Course ── */}
      <Modal isOpen={modal === 'addCourse'} onClose={closeModal} title="Create New Course">
        <form onSubmit={handleAddCourse} className="modal-form two-col">
          <div className="form-row full-width">
            <label>Course Name *</label>
            <input required placeholder="e.g. React Mastery 2026" value={courseForm.courseName}
              onChange={e => setCourseForm(p => ({ ...p, courseName: e.target.value }))} />
          </div>
          <div className="form-row">
            <label>Language / Track *</label>
            <div className="select-wrap">
              <select required value={courseForm.Language}
                onChange={e => setCourseForm(p => ({ ...p, Language: e.target.value }))}>
                {TRACKS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <ChevronDown size={14} className="select-arrow" />
            </div>
          </div>
          <div className="form-row">
            <label>Course Type *</label>
            <div className="select-wrap">
              <select required value={courseForm.CourseStatus}
                onChange={e => setCourseForm(p => ({ ...p, CourseStatus: e.target.value }))}>
                {COURSE_STATUS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <ChevronDown size={14} className="select-arrow" />
            </div>
          </div>
          <div className="form-row full-width">
            <label>Price (₹) * <span className="optional">(enter 0 for free)</span></label>
            <input required type="number" min="0" placeholder="e.g. 4999" value={courseForm.Price}
              onChange={e => setCourseForm(p => ({ ...p, Price: e.target.value }))} />
          </div>
          <div className="form-row full-width">
            <label>Description *</label>
            <textarea required rows={3} placeholder="What will students learn…" value={courseForm.Disp}
              onChange={e => setCourseForm(p => ({ ...p, Disp: e.target.value }))} />
          </div>
          <button type="submit" className="btn-submit full-width" disabled={submitting}>
            {submitting ? 'Creating Course…' : 'Create Course'}
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
