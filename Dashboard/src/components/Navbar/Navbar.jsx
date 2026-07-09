import { useState, useContext, useRef, useEffect } from 'react';
import { useNavigate, NavLink, useLocation } from 'react-router-dom';
import {
  MdSearch, MdNotifications, MdLightMode, MdDarkMode,
  MdPerson, MdSettings, MdLogout, MdMenu, MdKeyboardArrowDown,
  MdCheckCircle, MdSchool, MdAssignment, MdWarning
} from 'react-icons/md';
import { ThemeContext } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const DEMO_NOTIFICATIONS = [
  { id: 1, icon: <MdSchool />, bg: 'rgba(108,99,255,0.1)', color: 'var(--brand-primary)', msg: 'New course "React Advanced" is available', time: '2 min ago' },
  { id: 2, icon: <MdAssignment />, bg: 'rgba(245,158,11,0.1)', color: 'var(--warning)', msg: 'Assignment deadline in 2 hours', time: '30 min ago' },
  { id: 3, icon: <MdCheckCircle />, bg: 'rgba(34,197,94,0.1)', color: 'var(--success)', msg: 'Your exam result is ready', time: '1 hr ago' },
  { id: 4, icon: <MdWarning />, bg: 'rgba(239,68,68,0.1)', color: 'var(--danger)', msg: 'Session expiring soon, please save work', time: '2 hr ago' },
];

const PAGE_TITLES = {
  '/dashboard': ['Dashboard', 'Welcome back! 👋'],
  '/courses': ['Courses', 'Manage your courses'],
  '/teachers': ['Teachers', 'Manage teaching staff'],
  '/students': ['Students', 'Manage enrolled students'],
  '/notes': ['Notes', 'Learning resources & materials'],
  '/exams': ['Exams', 'Examination management'],
  '/assignments': ['Assignments', 'Assignment tracker'],
  '/schedule': ['Schedule', 'Class calendar & sessions'],
  '/certificates': ['Certificates', 'Achievements & credentials'],
  '/analytics': ['Analytics', 'Performance & insights'],
  '/ai-assistant': ['AI Assistant', 'Your smart learning companion'],
  '/settings': ['Settings', 'Platform configuration'],
  '/profile': ['Profile', 'Your account details'],
  '/permissions': ['Permissions', 'Role & access control'],
  '/revenue': ['Revenue', 'Financial analytics'],
  '/users': ['Users', 'User management'],
};

const Navbar = ({ onMenuClick }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [showNotif, setShowNotif] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifCount, setNotifCount] = useState(DEMO_NOTIFICATIONS.length);

  const notifRef = useRef(null);
  const dropdownRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false);
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowDropdown(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const [pageTitle, pageSubtitle] = PAGE_TITLES[location.pathname] || ['Dashboard', ''];

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'DC';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      {/* Left */}
      <div className="navbar-left">
        <button className="hamburger-btn" id="navbar-menu-btn" onClick={onMenuClick}>
          <MdMenu />
        </button>
        <div className="navbar-breadcrumb">
          <span className="navbar-page-title">{pageTitle}</span>
          {pageSubtitle && <span className="navbar-page-sub">{pageSubtitle}</span>}
        </div>
      </div>

      {/* Search */}
      <div className="navbar-search">
        <div className="search-wrapper">
          <MdSearch className="search-icon" />
          <input
            id="navbar-search-input"
            className="search-input"
            type="text"
            placeholder="Search courses, students, exams..."
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="navbar-actions">
        {/* Theme Toggle */}
        <button
          id="theme-toggle-btn"
          className="theme-btn"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <MdDarkMode /> : <MdLightMode />}
        </button>

        {/* Notifications */}
        <div className="navbar-avatar-wrapper" ref={notifRef}>
          <button
            id="notif-bell-btn"
            className="notif-btn"
            onClick={() => { setShowNotif(p => !p); setShowDropdown(false); }}
          >
            <MdNotifications />
            {notifCount > 0 && <span className="notif-dot" />}
          </button>

          {showNotif && (
            <div className="notif-panel">
              <div className="notif-panel-header">
                <span className="notif-panel-title">
                  Notifications {notifCount > 0 && <span className="badge badge-danger" style={{marginLeft:6}}>{notifCount}</span>}
                </span>
                <button className="notif-panel-clear" onClick={() => setNotifCount(0)}>
                  Mark all read
                </button>
              </div>
              <div className="notif-list">
                {DEMO_NOTIFICATIONS.map(n => (
                  <div key={n.id} className="notif-item">
                    <div className="notif-item-icon" style={{ background: n.bg, color: n.color }}>
                      {n.icon}
                    </div>
                    <div className="notif-item-text">
                      <div className="notif-item-msg">{n.msg}</div>
                      <div className="notif-item-time">{n.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Avatar Dropdown */}
        <div className="navbar-avatar-wrapper" ref={dropdownRef}>
          <button
            id="navbar-avatar-btn"
            className="navbar-avatar-btn"
            onClick={() => { setShowDropdown(p => !p); setShowNotif(false); }}
          >
            <div className="navbar-avatar-img">{initials}</div>
            <span className="navbar-user-name">{user?.name || 'User'}</span>
            <MdKeyboardArrowDown className={`navbar-chevron ${showDropdown ? 'open' : ''}`} />
          </button>

          {showDropdown && (
            <div className="navbar-dropdown">
              <div className="dropdown-header">
                <div className="dropdown-name">{user?.name || 'User'}</div>
                <div className="dropdown-email">{user?.email || ''}</div>
              </div>
              <NavLink to="/profile" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                <MdPerson /> My Profile
              </NavLink>
              <NavLink to="/settings" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                <MdSettings /> Settings
              </NavLink>
              <div className="dropdown-divider" />
              <button className="dropdown-item danger" onClick={handleLogout}>
                <MdLogout /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
