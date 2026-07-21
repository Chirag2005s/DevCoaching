import { useContext, useState } from 'react';
import { NotificationContext } from '../../context/NotificationContext';
import { FiBell, FiCheckCircle } from 'react-icons/fi';
import './NotificationBell.css';

export default function NotificationBell() {
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useContext(NotificationContext);
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="notif-container">
            <button
                className="notif-trigger"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Notifications"
            >
                <FiBell />
                {unreadCount > 0 && <span className="notif-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>}
            </button>

            {isOpen && (
                <>
                    <div className="notif-overlay" onClick={() => setIsOpen(false)} />
                    <div className="notif-dropdown">
                        <div className="notif-header">
                            <h4>Notifications</h4>
                            {unreadCount > 0 && (
                                <button className="notif-mark-all" onClick={markAllAsRead}>
                                    <FiCheckCircle /> Mark all read
                                </button>
                            )}
                        </div>
                        <div className="notif-list">
                            {notifications.length === 0 ? (
                                <div className="notif-empty">No notifications yet.</div>
                            ) : (
                                notifications.map(notif => (
                                    <div 
                                        key={notif.id} 
                                        className={`notif-item ${!notif.read ? 'unread' : ''}`}
                                        onClick={() => markAsRead(notif.id)}
                                    >
                                        <div className={`notif-icon type-${notif.type}`}></div>
                                        <div className="notif-content">
                                            <h5>{notif.title}</h5>
                                            <p>{notif.message}</p>
                                            <span className="notif-time">{notif.time}</span>
                                        </div>
                                        {!notif.read && <div className="notif-dot"></div>}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
