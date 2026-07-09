import { useAuth } from '../../context/AuthContext';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import './Management.css';
import '../dashboard/Dashboard.css';

const studentGrowth = [
  { month: 'Jan', students: 120, active: 95 },
  { month: 'Feb', students: 155, active: 130 },
  { month: 'Mar', students: 190, active: 162 },
  { month: 'Apr', students: 230, active: 198 },
  { month: 'May', students: 280, active: 240 },
  { month: 'Jun', students: 340, active: 295 },
  { month: 'Jul', students: 410, active: 356 },
];

const revenueData = [
  { month: 'Jan', revenue: 48000, target: 50000 },
  { month: 'Feb', revenue: 62000, target: 55000 },
  { month: 'Mar', revenue: 76000, target: 65000 },
  { month: 'Apr', revenue: 92000, target: 80000 },
  { month: 'May', revenue: 112000, target: 100000 },
  { month: 'Jun', revenue: 136000, target: 120000 },
  { month: 'Jul', revenue: 164000, target: 150000 },
];

const coursePerf = [
  { name: 'React', completion: 82, rating: 4.9 },
  { name: 'Python', completion: 76, rating: 4.8 },
  { name: 'Full Stack', completion: 68, rating: 4.7 },
  { name: 'UI/UX', completion: 90, rating: 4.9 },
  { name: 'Backend', completion: 72, rating: 4.6 },
  { name: 'Robotics', completion: 85, rating: 4.8 },
];

const teacherPerf = [
  { name: 'John S.', rating: 4.9, students: 120 },
  { name: 'Sarah L.', rating: 4.8, students: 98 },
  { name: 'Mike C.', rating: 4.7, students: 85 },
  { name: 'Priya S.', rating: 4.9, students: 70 },
  { name: 'Alex K.', rating: 4.6, students: 60 },
];

const AnalyticsPage = () => {
  const { role } = useAuth();

  return (
    <div className="page-section">
      <div className="mgmt-header">
        <div className="mgmt-title-block">
          <h2>Analytics & Reports</h2>
          <p>Comprehensive platform performance metrics and insights</p>
        </div>
        <button className="btn btn-secondary">Export Report</button>
      </div>

      {/* Quick stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Total Revenue', value: '₹6.9L', change: '+18%', positive: true },
          { label: 'Avg. Completion', value: '79%', change: '+5%', positive: true },
          { label: 'Student Retention', value: '86%', change: '+3%', positive: true },
          { label: 'Avg. Exam Score', value: '76/100', change: '+2', positive: true },
        ].map((s, i) => (
          <div key={i} style={{
            background: 'var(--bg-surface)', border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)', padding: '18px 20px'
          }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: 8 }}>{s.label}</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1, marginBottom: 6 }}>{s.value}</div>
            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: s.positive ? 'var(--success)' : 'var(--danger)' }}>
              {s.positive ? '↑' : '↓'} {s.change} vs last month
            </div>
          </div>
        ))}
      </div>

      {/* Student growth */}
      <div className="dashboard-grid" style={{ marginBottom: 20 }}>
        <div className="chart-card">
          <div className="chart-card-header">
            <div>
              <div className="chart-card-title">Student Growth</div>
              <div className="chart-card-sub">Total vs active students over 7 months</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={230}>
            <AreaChart data={studentGrowth}>
              <defs>
                <linearGradient id="totalGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6c63ff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6c63ff" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="activeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 12 }} />
              <Legend />
              <Area type="monotone" dataKey="students" stroke="#6c63ff" strokeWidth={2.5} fill="url(#totalGrad)" name="Total Students" />
              <Area type="monotone" dataKey="active" stroke="#22c55e" strokeWidth={2.5} fill="url(#activeGrad)" name="Active Students" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue */}
        <div className="chart-card">
          <div className="chart-card-header">
            <div>
              <div className="chart-card-title">Revenue Analytics</div>
              <div className="chart-card-sub">Actual vs target</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={230}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 12 }}
                formatter={(v) => `₹${(v/1000).toFixed(0)}K`} />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#6c63ff" strokeWidth={2.5} dot={{ fill: '#6c63ff', r: 4 }} name="Revenue" />
              <Line type="monotone" dataKey="target" stroke="#f59e0b" strokeWidth={2} strokeDasharray="6 3" dot={false} name="Target" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Course perf + Teacher perf */}
      <div className="dashboard-grid">
        <div className="chart-card">
          <div className="chart-card-header">
            <div>
              <div className="chart-card-title">Course Performance</div>
              <div className="chart-card-sub">Completion rate by course</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={coursePerf} layout="vertical" barSize={14}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} width={60} />
              <Tooltip contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 12 }} />
              <Bar dataKey="completion" fill="#6c63ff" name="Completion %" radius={[0,6,6,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <div className="chart-card-header">
            <div className="chart-card-title">Teacher Performance</div>
          </div>
          {teacherPerf.map((t, i) => (
            <div key={i} className="perf-item">
              <div className="perf-header">
                <span className="perf-label">{t.name}</span>
                <span className="perf-value" style={{ color: 'var(--brand-primary)' }}>
                  ★ {t.rating}
                </span>
              </div>
              <div className="progress-bar-wrapper">
                <div className="progress-bar-fill"
                  style={{ width: `${(t.rating / 5) * 100}%`, background: 'var(--brand-gradient)' }}
                />
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{t.students} students</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
