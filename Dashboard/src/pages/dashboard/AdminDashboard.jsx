import { useAuth } from '../../context/AuthContext';
import StatsCard from '../../components/StatsCard/StatsCard';
import { MdPeople, MdMenuBook, MdSupervisorAccount, MdAssignment, MdQuiz, MdCardMembership } from 'react-icons/md';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import './Dashboard.css';

const weeklyEnrollments = [
  { day: 'Mon', enrollments: 12 },
  { day: 'Tue', enrollments: 19 },
  { day: 'Wed', enrollments: 8 },
  { day: 'Thu', enrollments: 24 },
  { day: 'Fri', enrollments: 16 },
  { day: 'Sat', enrollments: 30 },
  { day: 'Sun', enrollments: 10 },
];

const examScores = [
  { exam: 'JS Basics', avg: 74 },
  { exam: 'React', avg: 81 },
  { exam: 'Python', avg: 68 },
  { exam: 'Backend', avg: 77 },
  { exam: 'UI/UX', avg: 85 },
];

const recentActivities = [
  { icon: '📘', msg: '3 new courses submitted for approval', time: '5 min ago', bg: 'rgba(108,99,255,0.1)' },
  { icon: '👨‍🏫', msg: 'New teacher Sarah added to the platform', time: '1 hr ago', bg: 'rgba(56,189,248,0.1)' },
  { icon: '🎓', msg: '18 students enrolled in Full Stack course', time: '2 hr ago', bg: 'rgba(34,197,94,0.1)' },
  { icon: '📝', msg: 'Assignment deadline extended for Python batch', time: '3 hr ago', bg: 'rgba(245,158,11,0.1)' },
];

const AdminDashboard = () => {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] || 'Admin';

  return (
    <div className="page-section">
      {/* Welcome */}
      <div className="welcome-banner">
        <div className="welcome-content">
          <p className="welcome-greeting">Welcome back,</p>
          <h1 className="welcome-name">🛡️ {firstName}</h1>
          <p className="welcome-tagline">Manage your platform with ease</p>
        </div>
        <div className="welcome-emoji">📊</div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <StatsCard title="Total Students" value="840" icon={<MdPeople />} color="#6c63ff" trend="+8%" positive />
        <StatsCard title="Total Teachers" value="24" icon={<MdSupervisorAccount />} color="#38bdf8" trend="+2" positive />
        <StatsCard title="Active Courses" value="18" icon={<MdMenuBook />} color="#a78bfa" trend="90%" positive />
        <StatsCard title="Assignments Due" value="12" icon={<MdAssignment />} color="#f59e0b" trend="-3" positive={false} />
        <StatsCard title="Exams This Week" value="6" icon={<MdQuiz />} color="#22c55e" trend="+2" positive />
        <StatsCard title="Certificates" value="128" icon={<MdCardMembership />} color="#ec4899" trend="+14" positive />
      </div>

      {/* Charts */}
      <div className="dashboard-grid">
        <div className="chart-card">
          <div className="chart-card-header">
            <div>
              <div className="chart-card-title">Weekly Enrollments</div>
              <div className="chart-card-sub">New student signups this week</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={weeklyEnrollments}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 12 }} />
              <Bar dataKey="enrollments" fill="#6c63ff" name="Enrollments" radius={[8,8,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Exam avg scores */}
        <div className="chart-card">
          <div className="chart-card-header">
            <div>
              <div className="chart-card-title">Avg. Exam Scores</div>
              <div className="chart-card-sub">By subject</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={230}>
            <LineChart data={examScores}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="exam" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis domain={[50, 100]} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 12 }} />
              <Line type="monotone" dataKey="avg" stroke="#a78bfa" strokeWidth={3} dot={{ fill: '#a78bfa', r: 5 }} name="Avg Score" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Activity */}
      <div className="chart-card">
        <div className="chart-card-header">
          <div className="chart-card-title">Recent Activities</div>
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
  );
};

export default AdminDashboard;
