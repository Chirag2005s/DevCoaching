import { createContext, useState, useEffect } from 'react';

export const NotificationContext = createContext();

const MOCK_NOTIFICATIONS = [
    { id: 1, type: 'course', title: 'New Course Available', message: 'React Native Masterclass is now live.', read: false, time: '2 hours ago' },
    { id: 2, type: 'exam', title: 'Exam Reminder', message: 'Node.js Basics exam is due tomorrow.', read: false, time: '5 hours ago' },
    { id: 3, type: 'streak', title: 'Streak Maintained! 🔥', message: 'You earned 10 XP for logging in today.', read: true, time: '1 day ago' },
];

export function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState(() => {
        const saved = localStorage.getItem('notifications');
        return saved ? JSON.parse(saved) : MOCK_NOTIFICATIONS;
    });

    useEffect(() => {
        localStorage.setItem('notifications', JSON.stringify(notifications));
    }, [notifications]);

    const markAsRead = (id) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const addNotification = (notif) => {
        setNotifications(prev => [{ ...notif, id: Date.now(), read: false, time: 'Just now' }, ...prev]);
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead, addNotification }}>
            {children}
        </NotificationContext.Provider>
    );
}
