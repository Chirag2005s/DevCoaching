import { useState, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  MdDashboard, MdSchool, MdPeople, MdPerson, MdLibraryBooks,
  MdAssignment, MdQuiz, MdCardMembership, MdBarChart, MdSettings,
  MdCalendarMonth, MdNote, MdSmartToy, MdLogout, MdChevronLeft,
  MdChevronRight, MdAdminPanelSettings, MdSupervisorAccount,
  MdMenuBook, MdGroups, MdVerifiedUser, MdAttachMoney
} from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

/* Navigation config by role */
const navConfig = {
  superadmin: [
    { section: 'Overview' },
    { label: 'Dashboard', icon: <MdDashboard />, path: '/dashboard' },
    { section: 'Management' },
    { label: 'Users', icon: <MdPeople />, path: '/users' },
    { label: 'Teachers', icon: <MdSupervisorAccount />, path: '/teachers' },
    { label: 'Students', icon: <MdGroups />, path: '/students' },
    { label: 'Courses', icon: <MdMenuBook />, path: '/courses' },
    { section: 'Academics' },
    { label: 'Notes', icon: <MdNote />, path: '/notes' },
    { label: 'Exams', icon: <MdQuiz />, path: '/exams' },
    { label: 'Assignments', icon: <MdAssignment />, path: '/assignments' },
    { label: 'Schedule', icon: <MdCalendarMonth />, path: '/schedule' },
    { label: 'Certificates', icon: <MdCardMembership />, path: '/certificates' },
    { section: 'System' },
    { label: 'Analytics', icon: <MdBarChart />, path: '/analytics' },
    { label: 'Permissions', icon: <MdVerifiedUser />, path: '/permissions' },
    { label: 'Revenue', icon: <MdAttachMoney />, path: '/revenue' },
    { label: 'AI Assistant', icon: <MdSmartToy />, path: '/ai-assistant' },
    { label: 'Settings', icon: <MdSettings />, path: '/settings' },
  ],
  admin: [
    { section: 'Overview' },
    { label: 'Dashboard', icon: <MdDashboard />, path: '/dashboard' },
    { section: 'Management' },
    { label: 'Teachers', icon: <MdSupervisorAccount />, path: '/teachers' },
    { label: 'Students', icon: <MdGroups />, path: '/students' },
    { label: 'Courses', icon: <MdMenuBook />, path: '/courses' },
    { section: 'Academics' },
    { label: 'Notes', icon: <MdNote />, path: '/notes' },
    { label: 'Exams', icon: <MdQuiz />, path: '/exams' },
    { label: 'Assignments', icon: <MdAssignment />, path: '/assignments' },
    { label: 'Schedule', icon: <MdCalendarMonth />, path: '/schedule' },
    { label: 'Certificates', icon: <MdCardMembership />, path: '/certificates' },
    { section: 'Reports' },
    { label: 'Analytics', icon: <MdBarChart />, path: '/analytics' },
    { label: 'AI Assistant', icon: <MdSmartToy />, path: '/ai-assistant' },
  ],
  teacher: [
    { section: 'Overview' },
    { label: 'Dashboard', icon: <MdDashboard />, path: '/dashboard' },
    { section: 'Teaching' },
    { label: 'My Courses', icon: <MdMenuBook />, path: '/courses' },
    { label: 'My Students', icon: <MdGroups />, path: '/students' },
    { label: 'Notes', icon: <MdNote />, path: '/notes' },
    { label: 'Exams', icon: <MdQuiz />, path: '/exams' },
    { label: 'Assignments', icon: <MdAssignment />, path: '/assignments' },
    { label: 'Schedule', icon: <MdCalendarMonth />, path: '/schedule' },
    { section: 'Tools' },
    { label: 'Analytics', icon: <MdBarChart />, path: '/analytics' },
    { label: 'AI Assistant', icon: <MdSmartToy />, path: '/ai-assistant' },
    { label: 'Profile', icon: <MdPerson />, path: '/profile' },
  ],
  student: [
    { section: 'Overview' },
    { label: 'Dashboard', icon: <MdDashboard />, path: '/dashboard' },
    { section: 'Learning' },
    { label: 'My Courses', icon: <MdMenuBook />, path: '/courses' },
    { label: 'Notes', icon: <MdNote />, path: '/notes' },
    { label: 'Exams', icon: <MdQuiz />, path: '/exams' },
    { label: 'Assignments', icon: <MdAssignment />, path: '/assignments' },
    { label: 'Schedule', icon: <MdCalendarMonth />, path: '/schedule' },
    { section: 'My Account' },
    { label: 'Certificates', icon: <MdCardMembership />, path: '/certificates' },
    { label: 'Progress', icon: <MdBarChart />, path: '/analytics' },
    { label: 'AI Assistant', icon: <MdSmartToy />, path: '/ai-assistant' },
    { label: 'Profile', icon: <MdPerson />, path: '/profile' },
  ],
};

const Sidebar = ({ mobileOpen, onClose }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = navConfig[role] || navConfig.student;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'DC';

  const roleLabel = {
    superadmin: 'Super Admin',
    admin: 'Admin',
    teacher: 'Teacher',
    student: 'Student',
  }[role] || 'User';

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && <div className="sidebar-overlay" onClick={onClose} />}

      <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        {/* Collapse toggle (desktop) */}
        <button
          className="sidebar-toggle"
          onClick={() => setCollapsed(p => !p)}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <MdChevronRight /> : <MdChevronLeft />}
        </button>

        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">DC</div>
          <div className="sidebar-logo-text">
            <span className="sidebar-logo-name">Dev Coaching</span>
            <span className="sidebar-logo-tagline">Learn. Build. Grow.</span>
          </div>
        </div>

        {/* User role badge */}
        <div className="sidebar-role-badge">
          <div className="sidebar-avatar">{initials}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user?.name || 'Guest'}</div>
            <div className="sidebar-user-role">{roleLabel}</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {navItems.map((item, i) =>
            item.section ? (
              <div key={`section-${i}`} className="nav-section-label">
                {item.section}
              </div>
            ) : (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                onClick={onClose}
                title={collapsed ? item.label : undefined}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
                {item.badge && <span className="nav-badge">{item.badge}</span>}
              </NavLink>
            )
          )}
        </nav>

        {/* Footer – logout */}
        <div className="sidebar-footer">
          <button className="nav-item w-full" onClick={handleLogout} title="Logout">
            <span className="nav-icon"><MdLogout /></span>
            <span className="nav-label">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
