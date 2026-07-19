import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  BookOpen,
  Library,
  FileText,
  FolderOpen,
  CreditCard,
  Target,
  Bot,
  Bell,
  ShieldCheck,
  Settings,
  Mail,
  User,
  History
} from 'lucide-react';
import { AuthProvider, useAuth } from './hooks/AuthContext';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import AdminProfile from './pages/AdminProfile';
import DashboardOverview from './pages/DashboardOverview';
import AttendanceTracker from './pages/AttendanceTracker';
import InstructorCheck from './pages/InstructorCheck';
import StudentsPage from './pages/StudentsPage';
import TeachersPage from './pages/TeachersPage';
import CoursesPage from './pages/CoursesPage';
import BatchesPage from './pages/BatchesPage';
import ExamsPage from './pages/ExamsPage';
import ContactPage from './pages/ContactPage';
import AccessLogsPage from './pages/AccessLogsPage';
import PlaceholderPage from './pages/PlaceholderPage';
import './App.css';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main)', color: 'white' }}>Loading Dashboard...</div>;
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Dev Coaching</h2>
          <p>Admin ERP</p>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-group-title">Main</div>
          <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')} end>
            <LayoutDashboard className="nav-icon" />
            <span>Overview</span>
          </NavLink>
          <NavLink to="/students" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
            <Users className="nav-icon" />
            <span>Students</span>
          </NavLink>
          <NavLink to="/teachers" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
            <UserCheck className="nav-icon" />
            <span>Teachers</span>
          </NavLink>

          <div className="nav-group-title">Academics</div>
          <NavLink to="/courses" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
            <BookOpen className="nav-icon" />
            <span>Courses</span>
          </NavLink>
          <NavLink to="/batches" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
            <Library className="nav-icon" />
            <span>Batches</span>
          </NavLink>
          <NavLink to="/exams" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
            <FileText className="nav-icon" />
            <span>Exams</span>
          </NavLink>
          <NavLink to="/content" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
            <FolderOpen className="nav-icon" />
            <span>Content</span>
          </NavLink>
          <NavLink to="/attendance" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
            <UserCheck className="nav-icon" />
            <span>Attendance (Legacy)</span>
          </NavLink>
          <NavLink to="/instructor-check" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
            <ShieldCheck className="nav-icon" />
            <span>Instructor Check</span>
          </NavLink>

          <div className="nav-group-title">Administration</div>
          <NavLink to="/payments" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
            <CreditCard className="nav-icon" />
            <span>Payments</span>
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
            <Mail className="nav-icon" />
            <span>Contact Inquiries</span>
          </NavLink>
          <NavLink to="/ai" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
            <Bot className="nav-icon" />
            <span>AI Assistant</span>
          </NavLink>

          <div className="nav-group-title">System</div>
          <NavLink to="/access-logs" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
            <History className="nav-icon" />
            <span>Access Logs</span>
          </NavLink>
          <NavLink to="/notifications" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
            <Bell className="nav-icon" />
            <span>Notifications</span>
          </NavLink>
          <NavLink to="/security" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
            <ShieldCheck className="nav-icon" />
            <span>Security</span>
          </NavLink>
          <NavLink to="/profile" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
            <User className="nav-icon" />
            <span>Admin Profile</span>
          </NavLink>
          <NavLink to="/settings" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
            <Settings className="nav-icon" />
            <span>Settings</span>
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="topbar">
          <div className="topbar-title">ERP Control Panel</div>
          <NavLink to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'var(--text-primary)', background: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: '20px', border: '1px solid var(--border-color)', transition: 'background 0.2s' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.8rem', fontWeight: 'bold' }}>
              {user?.name?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div className="topbar-user" style={{ fontSize: '0.9rem', fontWeight: '500' }}>{user?.name || 'Super Admin'}</div>
          </NavLink>
        </header>

        <div className="page-content">
          <Routes>
            {/* Active Routes */}
            <Route path="/" element={<DashboardOverview />} />
            <Route path="/access-logs" element={<AccessLogsPage />} />
            <Route path="/attendance" element={<AttendanceTracker />} />
            <Route path="/instructor-check" element={<InstructorCheck />} />
            <Route path="/students" element={<StudentsPage />} />
            <Route path="/teachers" element={<TeachersPage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/batches" element={<BatchesPage />} />
            <Route path="/exams" element={<ExamsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/profile" element={<AdminProfile />} />

            {/* Redirect legacy auth paths to root if logged in */}
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="/signup" element={<Navigate to="/" replace />} />

            {/* Placeholder Routes */}
            <Route path="/content" element={<PlaceholderPage title="Content Management" />} />
            <Route path="/placement" element={<PlaceholderPage title="Placement Dashboard" />} />
            <Route path="/ai" element={<PlaceholderPage title="AI Dashboard" />} />
            <Route path="/notifications" element={<PlaceholderPage title="Notification Center" />} />
            <Route path="/security" element={<PlaceholderPage title="Security & Access" />} />
            <Route path="/settings" element={<PlaceholderPage title="System Settings" />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
