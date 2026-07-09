import { useAuth } from '../../context/AuthContext';
import StatsCard from '../../components/StatsCard/StatsCard';
import {
  MdPeople, MdSupervisorAccount, MdMenuBook, MdCheckCircle,
  MdTrendingUp, MdAttachMoney, MdSchool, MdBarChart
} from 'react-icons/md';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import './Dashboard.css';

const studentGrowth = [
  { month: 'Jan', students: 120, revenue: 4800 },
  { month: 'Feb', students: 155, revenue: 6200 },
  { month: 'Mar', students: 190, revenue: 7600 },
  { month: 'Apr', students: 230, revenue: 9200 },
  { month: 'May', students: 280, revenue: 11200 },
  { month: 'Jun', students: 340, revenue: 13600 },
  { month: 'Jul', students: 410, revenue: 16400 },
];

const coursePerf = [
  { name: 'React', students: 120, completion: 82 },
  { name: 'Python', students: 98, completion: 76 },
  { name: 'Full Stack', students: 85, completion: 68 },
  { name: 'UI/UX', students: 70, completion: 90 },
  { name: 'Backend', students: 60, completion: 72 },
];

const roleDistribution = [
  { name: 'Students', value: 410, color: '#6c63ff' },
  { name: 'Teachers', value: 24, color: '#a78bfa' },
  { name: 'Admins', value: 8, color: '#38bdf8' },
];

const recentActivities = [
  { icon: '🎓', msg: 'New student Jane Doe enrolled in React Course', time: '2 min ago', bg: 'rgba(108,99,255,0.1)' },
  { icon: '📚', msg: 'Teacher John uploaded new notes for Python', time: '15 min ago', bg: 'rgba(56,189,248,0.1)' },
  { icon: '✅', msg: 'Exam "JavaScript Basics" completed by 34 students', time: '1 hr ago', bg: 'rgba(34,197,94,0.1)' },
  { icon: '⚠️', msg: 'Course "Robotics" approval pending review', time: '2 hr ago', bg: 'rgba(245,158,11,0.1)' },
  { icon: '🏆', msg: '5 new certificates issued today', time: '3 hr ago', bg: 'rgba(108,99,255,0.1)' },
];

const upcomingClasses = [
  { day: '09', month: 'Jul', name: 'React Advanced Hooks', teacher: 'John Smith', time: '10:00 AM' },
  { day: '10', month: 'Jul', name: 'Python Data Science', teacher: 'Sarah Lee', time: '2:00 PM' },
  { day: '11', month: 'Jul', name: 'Full Stack Project Review', teacher: 'Mike Chen', time: '11:00 AM' },
];

const SuperAdminDashboard = () => {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] || 'Admin';

  return (
    <div className="page-section">
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div className="welcome-content">
          <p className="welcome-greeting">Good morning,</p>
          <h1 className="welcome-name">👑 {firstName}</h1>
          <p className="welcome-tagline">Here&apos;s your platform overview for today</p>
        </div>
        <div className="welcome-emoji">🚀</div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <StatsCard title="Total Students" value="1,240" icon={<MdPeople />} color="#6c63ff" trend="+12%" trendLabel="vs last month" positive />
        <StatsCard title="Total Teachers" value="48" icon={<MdSupervisorAccount />} color="#38bdf8" trend="+3" trendLabel="this month" positive />
        <StatsCard title="Total Courses" value="32" icon={<MdMenuBook />} color="#a78bfa" trend="+4" trendLabel="new courses" positive />
        <StatsCard title="Monthly Revenue" value="₹1.6L" icon={<MdAttachMoney />} color="#22c55e" trend="+18%" trendLabel="vs last month" positive />
        <StatsCard title="Active Courses" value="28" icon={<MdCheckCircle />} color="#f59e0b" trend="87%" trendLabel="active rate" positive />
        <StatsCard title="Certificates Issued" value="342" icon={<MdSchool />} color="#ec4899" trend="+24" trendLabel="this week" positive />
        <StatsCard title="Exams Conducted" value="118" icon={<MdBarChart />} color="#14b8a6" trend="+8" trendLabel="this month" positive />
        <StatsCard title="Avg. Completion" value="79%" icon={<MdTrendingUp />} color="#f97316" trend="+5%" trendLabel="vs last month" positive />
      </div>

      {/* Charts Row 1 */}
      <div className="dashboard-grid">
        {/* Student Growth Chart */}
        <div className="chart-card">
          <div className="chart-card-header">
            <div>
              <div className="chart-card-title">Student Growth & Revenue</div>
              <div className="chart-card-sub">Last 7 months performance</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={studentGrowth}>
              <defs>
                <linearGradient id="studGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6c63ff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6c63ff" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 12 }} />
              <Area type="monotone" dataKey="students" stroke="#6c63ff" strokeWidth={2.5} fill="url(#studGrad)" name="Students" />
              <Area type="monotone" dataKey="revenue" stroke="#38bdf8" strokeWidth={2.5} fill="url(#revGrad)" name="Revenue (₹)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Role Distribution Pie */}
        <div className="chart-card">
          <div className="chart-card-header">
            <div>
              <div className="chart-card-title">User Distribution</div>
              <div className="chart-card-sub">By role</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={roleDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={95}
                dataKey="value" paddingAngle={4}>
                {roleDistribution.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 12 }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="dashboard-grid-3">
        {/* Course Performance */}
        <div className="chart-card" style={{ gridColumn: 'span 2' }}>
          <div className="chart-card-header">
            <div>
              <div className="chart-card-title">Course Performance</div>
              <div className="chart-card-sub">Enrollments & completion rates</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={coursePerf} barGap={6}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 12 }} />
              <Bar dataKey="students" fill="#6c63ff" name="Students" radius={[6,6,0,0]} />
              <Bar dataKey="completion" fill="#38bdf8" name="Completion %" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Upcoming Classes */}
        <div className="chart-card">
          <div className="chart-card-header">
            <div className="chart-card-title">Upcoming Classes</div>
          </div>
          {upcomingClasses.map((c, i) => (
            <div key={i} className="class-item">
              <div className="class-date">
                <span className="class-date-day">{c.day}</span>
                <span className="class-date-month">{c.month}</span>
              </div>
              <div className="class-info">
                <div className="class-name">{c.name}</div>
                <div className="class-meta">{c.teacher} · {c.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activities */}
      <div className="chart-card">
        <div className="chart-card-header">
          <div className="chart-card-title">Recent Activities</div>
          <button className="btn btn-ghost btn-sm">View all</button>
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

export default SuperAdminDashboard;
