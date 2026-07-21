import './Navbar.css';
import { FiLogIn, FiLogOut, FiSun, FiMoon, FiShoppingBag, FiSearch } from "react-icons/fi";
import devLogo from '../logo/logo.png';
import ThemePicker from './ThemePicker';
import NotificationBell from './NotificationBell';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useLayoutEffect, useRef, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';

function Navbar({ onOpenSearch }) {
    const navigate = useNavigate();
    const location = useLocation();
    const navListRef = useRef(null);
    const linkRefs = useRef({});
    const [indicator, setIndicator] = useState({ left: 0, width: 0, opacity: 0 });
    const [isSwitching, setIsSwitching] = useState(false);
    const { user, logout } = useContext(AuthContext);
    const { isDarkMode, toggleTheme } = useContext(ThemeContext);

    const displayLinks = [
        { to: '/course', label: 'Course' },
        { to: '/learning-hub', label: 'Hub' },
        { to: '/join-live', label: 'Live' },
        { to: '/instructors', label: 'Mentors' },
    ];

    if (user) {
        displayLinks.push({ to: '/batches', label: 'Batches' });
    }

    if (user && user.hasPurchasedCourse) {
        displayLinks.push({ to: '/dashboard', label: 'Dashboard' });
    }

    const updateIndicator = () => {
        const activePath = displayLinks.find(
            (link) =>
                link.end
                    ? location.pathname === link.to
                    : location.pathname.startsWith(link.to)
        )?.to;

        const activeEl = activePath ? linkRefs.current[activePath] : null;
        const listEl = navListRef.current;

        if (activeEl && listEl) {
            const listRect = listEl.getBoundingClientRect();
            const elRect = activeEl.getBoundingClientRect();
            setIndicator({
                left: elRect.left - listRect.left,
                width: elRect.width,
                opacity: 1,
            });
        } else {
            setIndicator(prev => ({ ...prev, opacity: 0 }));
        }
    };

    useEffect(() => {
        setIsSwitching(true);
        const timer = setTimeout(() => setIsSwitching(false), 450);
        return () => clearTimeout(timer);
    }, [location.pathname]);

    useLayoutEffect(() => {
        // Small delay to ensure layout is done
        const timer = setTimeout(updateIndicator, 50);
        window.addEventListener('resize', updateIndicator);
        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', updateIndicator);
        };
    }, [location.pathname, user]);

    return (
        <header className={`Nav_Section ${isSwitching ? 'Nav_Section--switching' : ''}`}>
            {/* Announcement Bar */}
            <div className="announcement-bar">
                <span>🚀 Special Offer: Get 20% off on all courses this week! Use code: <strong>DEV20</strong></span>
            </div>

            <div className="nav-progress-bar" aria-hidden="true" />

            <div className="nav-container">
                {/* Brand */}
                <button type="button" className="nav-brand" onClick={() => navigate('/')}>
                    <img src={devLogo} alt="Dev Coaching" className="nav-brand__logo" />
                    <span>Dev <span className="nav-brand__accent">Coaching</span></span>
                </button>

                {/* Navigation Links */}
                <div className="nav-links-wrap" ref={navListRef}>
                    <span
                        className="nav-indicator"
                        style={{
                            transform: `translateX(${indicator.left}px)`,
                            width: indicator.width,
                            opacity: indicator.opacity,
                        }}
                    />
                    <nav className="nav-links">
                        {displayLinks.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                end={link.end}
                                ref={(el) => { linkRefs.current[link.to] = el; }}
                                className={({ isActive }) =>
                                    `nav-link${isActive ? ' nav-link--active' : ''}`
                                }
                            >
                                {link.label}
                            </NavLink>
                        ))}
                    </nav>
                </div>

                {/* Actions & Auth */}
                <div className="nav-auth">
                    {/* Search */}
                    <button type="button" className="nav-search-btn" onClick={() => onOpenSearch?.()} title="Search">
                        <FiSearch />
                        <span>Search</span>
                        <kbd className="nav-search-kbd">⌘K</kbd>
                    </button>

                    {/* Cart */}
                    <button 
                        type="button" 
                        className="nav-icon-btn" 
                        onClick={() => navigate(user ? '/dashboard' : '/course')} 
                        title={user ? "My Courses" : "Explore"}
                    >
                        <FiShoppingBag />
                        {user && user.hasPurchasedCourse && (
                            <span className="nav-badge">1</span>
                        )}
                    </button>

                    {/* Notifications (Assuming NotificationBell renders a button with similar class) */}
                    <NotificationBell />

                    {/* Theme Customizer Trigger */}
                    <ThemePicker />

                    {/* Dark Mode Toggle */}
                    <button type="button" className={`nav-theme-switch ${isDarkMode ? 'dark' : 'light'}`} onClick={toggleTheme} aria-label="Toggle Theme">
                        <div className="switch-track">
                            <FiSun className="switch-icon switch-icon-sun" />
                            <FiMoon className="switch-icon switch-icon-moon" />
                            <div className="switch-knob">
                                {isDarkMode ? <FiMoon /> : <FiSun />}
                            </div>
                        </div>
                    </button>

                    {/* User Auth Section */}
                    {user ? (
                        <div className="nav-user-area">
                            <span className="nav-user-greeting">Hi, {user.name.split(' ')[0]}</span>
                            {user.hasPurchasedCourse && <span className="nav-pro-badge">PRO</span>}
                            <button type="button" className="Nav_Login" onClick={() => { logout(); navigate('/'); }} style={{ padding: '8px 16px', marginLeft: '4px' }}>
                                <FiLogOut />
                            </button>
                        </div>
                    ) : (
                        <>
                            <button type="button" className="Nav_Login" onClick={() => navigate('/login')}>
                                <FiLogIn /> Login
                            </button>
                            <button type="button" className="Sgin_up" onClick={() => navigate('/signup')}>
                                Sign up
                            </button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Navbar;
