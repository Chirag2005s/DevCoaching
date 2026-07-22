import React, { useState } from 'react';
import { Bell, Check, Trash2, X, AlertCircle, Info, ShieldAlert, CreditCard } from 'lucide-react';
import './NotificationDrawer.css';

export const INITIAL_NOTIFICATIONS = [
  { id: 1, type: 'payment', title: 'New Course Purchase', desc: 'Rahul Sharma purchased Full-Stack MERN track.', time: '10 mins ago', read: false, icon: CreditCard },
  { id: 2, type: 'security', title: 'New Admin Login', desc: 'Login detected from IP 192.168.1.45 (Windows).', time: '1 hour ago', read: false, icon: ShieldAlert },
  { id: 3, type: 'system', title: 'System Backup Completed', desc: 'Automated database backup completed successfully.', time: '3 hours ago', read: true, icon: Info },
  { id: 4, type: 'alert', title: 'Low Attendance Warning', desc: 'Python Batch B attendance fell below 70%.', time: '5 hours ago', read: false, icon: AlertCircle },
  { id: 5, type: 'payment', title: 'Payment Receipt Issued', desc: 'Invoice #INV-2049 sent to Priya Verma.', time: '1 day ago', read: true, icon: CreditCard },
];

export default function NotificationDrawer({ isOpen, onClose, notifications, setNotifications }) {
  const [filter, setFilter] = useState('all');

  if (!isOpen) return null;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const markRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const filtered = notifications.filter(n => filter === 'all' || (filter === 'unread' && !n.read));

  return (
    <>
      <div className="notif-overlay" onClick={onClose} />
      <div className="notif-drawer">
        <div className="notif-drawer-header">
          <div className="notif-header-title">
            <Bell size={20} className="notif-bell-icon" />
            <h3>Notification Center</h3>
          </div>
          <button className="notif-close-btn" onClick={onClose} type="button">
            <X size={18} />
          </button>
        </div>

        <div className="notif-toolbar">
          <div className="notif-filters">
            <button className={`notif-tab ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
              All ({notifications.length})
            </button>
            <button className={`notif-tab ${filter === 'unread' ? 'active' : ''}`} onClick={() => setFilter('unread')}>
              Unread ({notifications.filter(n => !n.read).length})
            </button>
          </div>
          <div className="notif-actions">
            <button className="notif-btn" onClick={markAllRead} title="Mark all as read">
              <Check size={14} /> Read All
            </button>
            <button className="notif-btn danger" onClick={clearAll} title="Clear all">
              <Trash2 size={14} /> Clear
            </button>
          </div>
        </div>

        <div className="notif-body">
          {filtered.length === 0 ? (
            <div className="notif-empty">No notifications to show.</div>
          ) : (
            filtered.map(item => {
              const IconComp = item.icon || Info;
              return (
                <div key={item.id} className={`notif-item ${!item.read ? 'unread' : ''}`} onClick={() => markRead(item.id)}>
                  <div className={`notif-type-icon ${item.type}`}>
                    <IconComp size={16} />
                  </div>
                  <div className="notif-content">
                    <div className="notif-title-row">
                      <span className="notif-title">{item.title}</span>
                      <span className="notif-time">{item.time}</span>
                    </div>
                    <p className="notif-desc">{item.desc}</p>
                  </div>
                  {!item.read && <div className="notif-unread-dot" />}
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
