import { useAuth } from '../../context/AuthContext';
import StatsCard from '../../components/StatsCard/StatsCard';
import { MdMenuBook, MdAssignment, MdQuiz, MdCardMembership, MdTrendingUp, MdCalendarMonth } from 'react-icons/md';
import {
  RadialBarChart, RadialBar, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts';
import './Dashboard.css';

const progressData = [
  { name: 'React', progress: 82, fill: '#6c63ff' },
  { name: 'Python', progress: 65, fill: '#a78bfa' },
  { name: 'UI/UX', progress: 45, fill: '#38bdf8' },
];

const weeklyActivity = [
  { day: 'Mon', hours: 2.5 },
  { day: 'Tue', hours: 1.8 },
  { day: 'Wed', hours: 3.2 },
  { day: 'Thu', hours: 2.1 },
  { day: 'Fri', hours: 4.0 },
  { day: 'Sat', hours: 1.5 },
  { day: 'Sun', hours: 0.8 },
];

const recentActivities = [
  { icon: '✅', msg: 'Completed "React Hooks" lesson', time: '1 hr ago', bg: 'rgba(34,197,94,0.1)' },
  { icon: '📝', msg: 'Submitted Python Assignment 3', time: '3 hr ago', bg: 'rgba(108,99,255,0.1)' },
  { icon: '🏆', msg: 'Earned React Beginner Certificate!', time: 'Yesterday', bg: 'rgba(245,158,11,0.1)' },
  { icon: '📚', msg: 'Downloaded Node.js notes', time: '2 days ago', bg: 'rgba(56,189,248,0.1)' },
];

const upcomingSchedule = [
  { day: '09', month: 'Jul', name: 'React Advanced Hooks', time: '10:00 AM', teacher: 'John Smith' },
  { day: '11', month: 'Jul', name: 'Python Data Science', time: '2:00 PM', teacher: 'Sarah Lee' },
];

const upcomingExams = [
  { name: 'JavaScript Final', date: 'Jul 12', duration: '1 hr', badge: 'warning' },
  { name: 'React MCQ Test', date: 'Jul 15', duration: '45 min', badge: 'primary' },
];

const StudentDashboard = () => {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] || 'Student';

  return (
    <div className="page-section">
      <div className="welcome-banner">
        <div className="welcome-content">
          <p className="welcome-greeting">Keep it up,</p>
          <h1 className="welcome-name">🎓 {firstName}</h1>
          <p className="welcome-tagline">"Learn, Build, and Grow with Industry-Level Skills."</p>
        </div>
        <div className="welcome-emoji">📚</div>
      </div>

      <div className="stats-grid">
        <StatsCard title="Enrolled Courses" value="3" icon={<MdMenuBook />} color="#6c63ff" trend="+1" positive />
        <StatsCard title="Assignments" value="5" icon={<MdAssignment />} color="#f59e0b" trend="2 due soon" positive={false} />
        <StatsCard title="Exams Taken" value="8" icon={<MdQuiz />} color="#38bdf8" trend="+2" positive />
        <StatsCard title="Certificates" value="2" icon={<MdCardMembership />} color="#22c55e" trend="+1" positive />
        <StatsCard title="Overall Progress" value="68%" icon={<MdTrendingUp />} color="#a78bfa" trend="+5%" positive />
        <StatsCard title="Classes This Week" value="3" icon={<MdCalendarMonth />} color="#ec4899" trend="1 today" positive />
      </div>

      <div className="dashboard-grid">
        {/* Weekly Study Hours */}
        <div className="chart-card">
          <div className="chart-card-header">
            <div>
              <div className="chart-card-title">Study Hours This Week</div>
              <div className="chart-card-sub">Daily learning time tracked</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={230}>
            <AreaChart data={weeklyActivity}>
              <defs>
                <linearGradient id="hoursGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6c63ff" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#6c63ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 12 }} />
              <Area type="monotone" dataKey="hours" stroke="#6c63ff" strokeWidth={2.5} fill="url(#hoursGrad)" name="Hours" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Course Progress */}
        <div className="chart-card">
          <div className="chart-card-header">
            <div className="chart-card-title">Course Progress</div>
          </div>
          {progressData.map((p, i) => (
            <div key={i} className="perf-item">
              <div className="perf-header">
                <span className="perf-label">{p.name}</span>
                <span className="perf-value" style={{ color: p.fill }}>{p.progress}%</span>
              </div>
              <div className="progress-bar-wrapper">
                <div className="progress-bar-fill" style={{ width: `${p.progress}%`, background: p.fill }} />
              </div>
            </div>
          ))}

          <div style={{ marginTop: 16 }}>
            <div className="chart-card-title" style={{ fontSize: '0.9rem', marginBottom: 10 }}>Upcoming Exams</div>
            {upcomingExams.map((ex, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border-color)' }}>
                <div>
                  <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-primary)' }}>{ex.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{ex.date} · {ex.duration}</div>
                </div>
                <span className={`badge badge-${ex.badge}`}>Upcoming</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Recent Activity */}
        <div className="chart-card">
          <div className="chart-card-header">
            <div className="chart-card-title">Recent Activity</div>
          </div>
          <div className="activity-list">
            {recentActivities.map((a, i) => (
              <div key={i} className="activity-item">
                <div className="activity-icon" style={{ background: a.bg }}>{a.icon}</div>
                <div className="activity-text">
                  <div className="activity-msg">{a.msg}</div>
                  <div className="activity-time">{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Classes */}
        <div className="chart-card">
          <div className="chart-card-header">
            <div className="chart-card-title">Upcoming Classes</div>
          </div>
          {upcomingSchedule.map((c, i) => (
            <div key={i} className="class-item">
              <div className="class-date">
                <span className="class-date-day">{c.day}</span>
                <span className="class-date-month">{c.month}</span>
              </div>
              <div className="class-info">
                <div className="class-name">{c.name}</div>
                <div className="class-meta">{c.teacher} · {c.time}</div>
              </div>
              <button className="btn btn-primary btn-sm">Join</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
