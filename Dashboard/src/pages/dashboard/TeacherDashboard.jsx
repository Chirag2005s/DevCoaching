import { useAuth } from '../../context/AuthContext';
import StatsCard from '../../components/StatsCard/StatsCard';
import { MdPeople, MdMenuBook, MdAssignment, MdQuiz, MdCalendarMonth, MdStar } from 'react-icons/md';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts';
import './Dashboard.css';

const studentPerformance = [
  { subject: 'React', A: 85 }, { subject: 'Python', A: 72 },
  { subject: 'Node.js', A: 78 }, { subject: 'UI/UX', A: 90 }, { subject: 'SQL', A: 65 },
];

const submissionsData = [
  { week: 'Wk 1', submitted: 22, pending: 5 },
  { week: 'Wk 2', submitted: 28, pending: 3 },
  { week: 'Wk 3', submitted: 19, pending: 8 },
  { week: 'Wk 4', submitted: 31, pending: 2 },
];

const recentActivities = [
  { icon: '📋', msg: '5 students submitted Python assignment', time: '10 min ago', bg: 'rgba(108,99,255,0.1)' },
  { icon: '💬', msg: 'New review posted on React course', time: '1 hr ago', bg: 'rgba(34,197,94,0.1)' },
  { icon: '🗓️', msg: 'Upcoming class: Full Stack – Tomorrow 10 AM', time: '2 hr ago', bg: 'rgba(56,189,248,0.1)' },
];

const upcomingSchedule = [
  { day: '09', month: 'Jul', name: 'React Hooks Deep Dive', time: '10:00 AM', platform: 'Google Meet' },
  { day: '11', month: 'Jul', name: 'Python OOP Session', time: '2:00 PM', platform: 'Zoom' },
  { day: '14', month: 'Jul', name: 'Full Stack Review', time: '11:00 AM', platform: 'Google Meet' },
];

const TeacherDashboard = () => {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] || 'Teacher';

  return (
    <div className="page-section">
      <div className="welcome-banner">
        <div className="welcome-content">
          <p className="welcome-greeting">Hello,</p>
          <h1 className="welcome-name">👨‍🏫 {firstName}</h1>
          <p className="welcome-tagline">Inspire students and track your impact</p>
        </div>
        <div className="welcome-emoji">🎯</div>
      </div>

      <div className="stats-grid">
        <StatsCard title="My Students" value="156" icon={<MdPeople />} color="#6c63ff" trend="+6" positive />
        <StatsCard title="My Courses" value="4" icon={<MdMenuBook />} color="#a78bfa" trend="2 active" positive />
        <StatsCard title="Assignments" value="18" icon={<MdAssignment />} color="#f59e0b" trend="8 pending" positive={false} />
        <StatsCard title="Exams Created" value="12" icon={<MdQuiz />} color="#38bdf8" trend="+3" positive />
        <StatsCard title="Classes This Week" value="5" icon={<MdCalendarMonth />} color="#22c55e" trend="2 today" positive />
        <StatsCard title="Avg. Rating" value="4.8★" icon={<MdStar />} color="#ec4899" trend="+0.2" positive />
      </div>

      <div className="dashboard-grid">
        {/* Radar – Student Skill Performance */}
        <div className="chart-card">
          <div className="chart-card-header">
            <div>
              <div className="chart-card-title">Student Skill Performance</div>
              <div className="chart-card-sub">Average scores across subjects</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={230}>
            <RadarChart data={studentPerformance}>
              <PolarGrid stroke="var(--border-color)" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
              <Radar dataKey="A" stroke="#6c63ff" fill="#6c63ff" fillOpacity={0.25} strokeWidth={2} name="Avg Score" />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Upcoming Schedule */}
        <div className="chart-card">
          <div className="chart-card-header">
            <div className="chart-card-title">My Schedule</div>
          </div>
          {upcomingSchedule.map((c, i) => (
            <div key={i} className="class-item">
              <div className="class-date">
                <span className="class-date-day">{c.day}</span>
                <span className="class-date-month">{c.month}</span>
              </div>
              <div className="class-info">
                <div className="class-name">{c.name}</div>
                <div className="class-meta">{c.time} · {c.platform}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Assignment submissions */}
        <div className="chart-card">
          <div className="chart-card-header">
            <div>
              <div className="chart-card-title">Assignment Submissions</div>
              <div className="chart-card-sub">Weekly submitted vs pending</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={submissionsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="week" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 12 }} />
              <Bar dataKey="submitted" fill="#22c55e" name="Submitted" radius={[6,6,0,0]} />
              <Bar dataKey="pending" fill="#f59e0b" name="Pending" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activities */}
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
      </div>
    </div>
  );
};

export default TeacherDashboard;
