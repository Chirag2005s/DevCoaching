import { useState, useEffect, useRef, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FiSearch, FiArrowRight, FiBook, FiClipboard, FiHome, FiMonitor, FiUsers, FiCalendar, FiCode, FiBarChart2 } from 'react-icons/fi';
import { FaGraduationCap } from 'react-icons/fa';
import './GlobalSearch.css';

/* ── static page index ─────────────────────────────────── */
const PAGES = [
    { label: 'Home',          path: '/',              icon: <FiHome />,       tags: 'home landing welcome' },
    { label: 'Courses',       path: '/course',        icon: <FaGraduationCap />, tags: 'course learn program' },
    { label: 'Learning Hub',  path: '/learning-hub',  icon: <FiBook />,       tags: 'notes exams hub study' },
    { label: 'Study Notes',   path: '/learning-hub',  icon: <FiBook />,       tags: 'notes pdf material study', state: { activeTab: 'notes' } },
    { label: 'Mock Exams',    path: '/learning-hub',  icon: <FiClipboard />,  tags: 'exam quiz test mock', state: { activeTab: 'exams' } },
    { label: 'Join Live',     path: '/join-live',     icon: <FiMonitor />,    tags: 'live class meet session zoom google' },
    { label: 'Instructors',   path: '/instructors',   icon: <FiUsers />,      tags: 'teacher instructor mentor tutor' },
    { label: 'Batches',       path: '/batches',       icon: <FiCalendar />,   tags: 'batch enroll register group' },
    { label: 'Dashboard',     path: '/dashboard',     icon: <FiBarChart2 />,  tags: 'dashboard profile account my' },
    { label: 'Playground',    path: '/playground',    icon: <FiCode />,       tags: 'code editor playground run execute javascript' },
    { label: 'Analytics',     path: '/analytics',     icon: <FiBarChart2 />,  tags: 'analytics stats progress chart streak' },
    { label: 'Calendar',      path: '/calendar',      icon: <FiCalendar />,   tags: 'calendar schedule classes events dates' },
    { label: 'About',         path: '/about',         icon: <FiHome />,       tags: 'about us company info' },
    { label: 'Contact',       path: '/contact',       icon: <FiHome />,       tags: 'contact support help email phone' },
    { label: 'Careers',       path: '/careers',       icon: <FiUsers />,      tags: 'career job hire work' },
    { label: 'Login',         path: '/login',         icon: <FiHome />,       tags: 'login signin sign in' },
    { label: 'Sign Up',       path: '/signup',        icon: <FiHome />,       tags: 'signup register create account' },
];

/* ── fuzzy-ish match ───────────────────────────────────── */
function matchScore(query, item) {
    const q = query.toLowerCase();
    const label = item.label.toLowerCase();
    const tags  = item.tags.toLowerCase();
    if (label === q) return 100;
    if (label.startsWith(q)) return 80;
    if (label.includes(q)) return 60;
    if (tags.includes(q)) return 40;
    // token match
    const tokens = q.split(/\s+/);
    const allMatch = tokens.every(t => label.includes(t) || tags.includes(t));
    if (allMatch) return 30;
    return 0;
}

export default function GlobalSearch({ isOpen, onClose }) {
    const [query, setQuery] = useState('');
    const [selectedIdx, setSelectedIdx] = useState(0);
    const inputRef = useRef(null);
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    /* focus input when opened */
    useEffect(() => {
        if (isOpen) {
            setQuery('');
            setSelectedIdx(0);
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [isOpen]);

    /* build results */
    const results = useMemo(() => {
        if (!query.trim()) return PAGES.slice(0, 8);  // show top pages when empty
        return PAGES
            .map(p => ({ ...p, score: matchScore(query, p) }))
            .filter(p => p.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 10);
    }, [query]);

    /* keep selectedIdx in bounds */
    useEffect(() => {
        if (selectedIdx >= results.length) setSelectedIdx(Math.max(0, results.length - 1));
    }, [results, selectedIdx]);

    /* keyboard navigation */
    const handleKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIdx(i => Math.min(i + 1, results.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIdx(i => Math.max(i - 1, 0));
        } else if (e.key === 'Enter' && results[selectedIdx]) {
            e.preventDefault();
            goTo(results[selectedIdx]);
        } else if (e.key === 'Escape') {
            onClose();
        }
    };

    const goTo = (item) => {
        onClose();
        navigate(item.path, item.state ? { state: item.state } : undefined);
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="gs-overlay" onClick={onClose} />
            <div className="gs-modal" role="dialog" aria-label="Global Search">
                <div className="gs-input-row">
                    <FiSearch className="gs-input-icon" />
                    <input
                        ref={inputRef}
                        className="gs-input"
                        type="text"
                        placeholder="Search pages, courses, notes, exams…"
                        value={query}
                        onChange={e => { setQuery(e.target.value); setSelectedIdx(0); }}
                        onKeyDown={handleKeyDown}
                        autoComplete="off"
                        spellCheck={false}
                    />
                    <kbd className="gs-kbd">Esc</kbd>
                </div>

                <div className="gs-results">
                    {results.length === 0 && (
                        <div className="gs-empty">No results for "{query}"</div>
                    )}
                    {results.map((item, i) => (
                        <button
                            key={item.path + item.label}
                            className={`gs-result-item ${i === selectedIdx ? 'gs-result-item--active' : ''}`}
                            onClick={() => goTo(item)}
                            onMouseEnter={() => setSelectedIdx(i)}
                        >
                            <span className="gs-result-icon">{item.icon}</span>
                            <span className="gs-result-label">{item.label}</span>
                            <FiArrowRight className="gs-result-arrow" />
                        </button>
                    ))}
                </div>

                <div className="gs-footer">
                    <span><kbd>↑↓</kbd> navigate</span>
                    <span><kbd>↵</kbd> open</span>
                    <span><kbd>esc</kbd> close</span>
                </div>
            </div>
        </>
    );
}
