import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiSearch, FiHome, FiMonitor, FiArrowUp, FiGrid, FiCode, FiBarChart2 } from 'react-icons/fi';
import './QuickActions.css';

const ACTIONS = [
    { icon: <FiSearch />,    label: 'Search',     action: 'search',    color: '#3b82f6' },
    { icon: <FiHome />,      label: 'Dashboard',  action: '/dashboard', color: '#10b981' },
    { icon: <FiMonitor />,   label: 'Join Live',  action: '/join-live', color: '#ef4444' },
    { icon: <FiCode />,      label: 'Playground', action: '/playground', color: '#f59e0b' },
    { icon: <FiBarChart2 />, label: 'Analytics',  action: '/analytics', color: '#8b5cf6' },
    { icon: <FiArrowUp />,   label: 'Scroll Top', action: 'scrollTop', color: '#64748b' },
];

export default function QuickActions({ onOpenSearch }) {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const handleAction = (action) => {
        setIsOpen(false);
        if (action === 'search') {
            onOpenSearch?.();
        } else if (action === 'scrollTop') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            navigate(action);
        }
    };

    return (
        <div className="qa-container">
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            className="qa-backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                        />
                        <div className="qa-menu">
                            {ACTIONS.map((item, i) => (
                                <motion.button
                                    key={item.label}
                                    className="qa-item"
                                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.8 }}
                                    transition={{ delay: i * 0.04, duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                                    onClick={() => handleAction(item.action)}
                                    style={{ '--qa-color': item.color }}
                                >
                                    <span className="qa-item-icon">{item.icon}</span>
                                    <span className="qa-item-label">{item.label}</span>
                                </motion.button>
                            ))}
                        </div>
                    </>
                )}
            </AnimatePresence>

            <motion.button
                className={`qa-fab ${isOpen ? 'qa-fab--active' : ''}`}
                onClick={() => setIsOpen(o => !o)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Quick Actions"
            >
                <motion.div
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <FiPlus size={24} />
                </motion.div>
            </motion.button>
        </div>
    );
}
