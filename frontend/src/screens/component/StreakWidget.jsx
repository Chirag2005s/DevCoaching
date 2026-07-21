import { useStreaks } from '../../hooks/useStreaks';
import { FiClock, FiStar, FiTrendingUp } from 'react-icons/fi';
import './StreakWidget.css';

export default function StreakWidget() {
    const { streakData } = useStreaks();

    return (
        <div className="streak-widget">
            <div className="streak-item" title="Current Streak">
                <span className="streak-icon fire">🔥</span>
                <span className="streak-value">{streakData.currentStreak}</span>
            </div>
            <div className="streak-item" title="Total XP">
                <FiStar className="streak-icon star" />
                <span className="streak-value">{streakData.totalXP} <span className="streak-unit">XP</span></span>
            </div>
        </div>
    );
}
