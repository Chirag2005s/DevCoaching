import { useState, useEffect } from 'react';

const STREAK_KEY = 'user_streak_data';

const getInitialData = () => {
    const saved = localStorage.getItem(STREAK_KEY);
    if (saved) {
        return JSON.parse(saved);
    }
    return {
        currentStreak: 0,
        longestStreak: 0,
        totalXP: 0,
        lastLoginDate: null,
        history: {} // { 'YYYY-MM-DD': xpEarned }
    };
};

export function useStreaks() {
    const [streakData, setStreakData] = useState(getInitialData);

    // Calculate streaks on load
    useEffect(() => {
        const todayStr = new Date().toISOString().split('T')[0];
        setStreakData(prev => {
            const data = { ...prev };
            if (!data.lastLoginDate) {
                // First ever login
                data.lastLoginDate = todayStr;
                data.currentStreak = 1;
                data.longestStreak = 1;
                data.totalXP += 10;
                data.history[todayStr] = (data.history[todayStr] || 0) + 10;
            } else if (data.lastLoginDate !== todayStr) {
                const lastDate = new Date(data.lastLoginDate);
                const todayDate = new Date(todayStr);
                const diffTime = Math.abs(todayDate - lastDate);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

                if (diffDays === 1) {
                    // Logged in consecutive day
                    data.currentStreak += 1;
                    if (data.currentStreak > data.longestStreak) {
                        data.longestStreak = data.currentStreak;
                    }
                } else if (diffDays > 1) {
                    // Streak broken
                    data.currentStreak = 1;
                }
                data.lastLoginDate = todayStr;
                data.totalXP += 10; // Login XP
                data.history[todayStr] = (data.history[todayStr] || 0) + 10;
            }
            return data;
        });
    }, []);

    // Save to localStorage when updated
    useEffect(() => {
        localStorage.setItem(STREAK_KEY, JSON.stringify(streakData));
    }, [streakData]);

    const addXP = (amount) => {
        const todayStr = new Date().toISOString().split('T')[0];
        setStreakData(prev => {
            const data = { ...prev };
            data.totalXP += amount;
            data.history[todayStr] = (data.history[todayStr] || 0) + amount;
            return data;
        });
    };

    return { streakData, addXP };
}
