import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Search, Bell, Menu, X, User } from 'lucide-react';
import { useAuth } from '../hooks/AuthContext';
import axios from 'axios';

const API_BASE = 'http://localhost:9000/api';

export default function Header() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${API_BASE}/notifications`);
      if (res.data && res.data.success) {
        setNotifications(res.data.notifications);
        setUnreadCount(res.data.unreadCount);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    
    // Optional: Poll every 30 seconds for new notifications
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await axios.put(`${API_BASE}/notifications/read-all`);
      fetchNotifications();
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

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
            {unreadCount > 0 && <span className="notification-badge"></span>}
          </button>
          
          {showNotifications && (
            <div className="notification-dropdown">
              <div className="notif-header">
                <h3>Notifications</h3>
                {unreadCount > 0 && (
                  <button className="mark-read" onClick={handleMarkAllRead}>
                    Mark all as read
                  </button>
                )}
              </div>
              <div className="notif-list">
                {notifications.length === 0 ? (
                  <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No notifications yet.
                  </div>
                ) : (
                  notifications.map(n => (
                    <div key={n._id} className={`notif-item ${!n.isRead ? 'unread' : ''}`}>
                      <div className="notif-content">
                        <p>{n.title}</p>
                        <span>{formatTime(n.createdAt)}</span>
                      </div>
                    </div>
                  ))
                )}
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
