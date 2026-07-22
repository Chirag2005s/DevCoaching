import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Search, Bell, Menu, X, User } from 'lucide-react';
import { useAuth } from '../hooks/AuthContext';

export default function Header() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, title: 'New Student Registration', time: '5m ago', read: false },
    { id: 2, title: 'Batch Frontend-26 started', time: '1h ago', read: false },
    { id: 3, title: 'Weekly Backup Completed', time: '1d ago', read: true },
  ];

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="topbar-title" style={{ display: 'none' }}>ERP Control Panel</div>
        
        {/* Global Search */}
        <div className="global-search-container">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="global-search-input"
            placeholder="Search students, courses, batches..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="search-clear" onClick={() => setSearchQuery('')}>
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="topbar-right">
        {/* Notification Center */}
        <div className="notification-center">
          <button 
            className="notification-btn"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={20} />
            {notifications.some(n => !n.read) && <span className="notification-badge"></span>}
          </button>
          
          {showNotifications && (
            <div className="notification-dropdown">
              <div className="notif-header">
                <h3>Notifications</h3>
                <button className="mark-read">Mark all as read</button>
              </div>
              <div className="notif-list">
                {notifications.map(n => (
                  <div key={n.id} className={`notif-item ${!n.read ? 'unread' : ''}`}>
                    <div className="notif-content">
                      <p>{n.title}</p>
                      <span>{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="notif-footer">
                <NavLink to="/notifications" onClick={() => setShowNotifications(false)}>
                  View all notifications
                </NavLink>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <NavLink to="/profile" className="topbar-profile">
          <div className="profile-avatar">
            {user?.name?.charAt(0)?.toUpperCase() || 'A'}
          </div>
          <div className="profile-info">
            <span className="profile-name">{user?.name || 'Super Admin'}</span>
            <span className="profile-role">Admin</span>
          </div>
        </NavLink>
      </div>
    </header>
  );
}
