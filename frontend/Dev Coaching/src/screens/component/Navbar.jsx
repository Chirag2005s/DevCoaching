import Button from '@mui/material/Button';
import './Navbar.css';
import { FiLogIn, FiLogOut, FiSun, FiMoon, FiShoppingBag } from "react-icons/fi";
import devLogo from '../logo/logo.png';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useLayoutEffect, useRef, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const navListRef = useRef(null);
    const linkRefs = useRef({});
    const [indicator, setIndicator] = useState({ left: 0, width: 0, opacity: 0 });
    const [isSwitching, setIsSwitching] = useState(false);
    const { user, logout } = useContext(AuthContext);
    const { isDarkMode, toggleTheme } = useContext(ThemeContext);

    const displayLinks = [
        // { to: '/', label: 'Home', end: true },
        { to: '/course', label: 'Course' },
        { to: '/batches', label: 'Batches' },
        { to: '/resources', label: 'Resources' },
        { to: '/join-live', label: 'Join Live' },
        { to: '/instructors', label: 'Instructors' },
    ];

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
        }
    };

    useEffect(() => {
        setIsSwitching(true);
        const timer = setTimeout(() => setIsSwitching(false), 450);
        return () => clearTimeout(timer);
    }, [location.pathname]);

    useLayoutEffect(() => {
        updateIndicator();
        window.addEventListener('resize', updateIndicator);
        return () => window.removeEventListener('resize', updateIndicator);
    }, [location.pathname]);

    return (
        <section className={`Nav_Section ${isSwitching ? 'Nav_Section--switching' : ''}`}>
            {/* Announcement Bar */}
            <div className="announcement-bar">
                <span>ðŸš€ Special Offer: Get 20% off on all courses this week! Use code: <strong>DEV20</strong> at checkout</span>
            </div>

            <div className="nav-progress-bar" aria-hidden="true" />

            <div className="container">
                <div className="row align-items-center">
                    <div className="col-md-2">
                        <button
                            type="button"
                            className="nav-brand"
                            onClick={() => navigate('/')}
                        >
                            <img src={devLogo} alt="Dev Coaching" className="nav-brand__logo" />
                            <span>
                                Dev <span className="nav-brand__accent">Coaching</span>
                            </span>
                        </button>
                    </div>

                    <div className="col-md-6">
                        <div className="nav-links-wrap" ref={navListRef}>
                            <span
                                className="nav-indicator"
                                style={{
                                    transform: `translateX(${indicator.left}px)`,
                                    width: indicator.width,
                                    opacity: indicator.opacity,
                                }}
                            />
                            <div className="nav-links">
                                {displayLinks.map((link) => (
                                    <NavLink
                                        key={link.to}
                                        to={link.to}
                                        end={link.end}
                                        ref={(el) => { linkRefs.current[link.to] = el; }}
                                        className={({ isActive }) =>
                                            `Nav_btn nav-link${isActive ? ' nav-link--active' : ''}`
                                        }
                                    >
                                        {link.label}
                                    </NavLink>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="nav-auth">
                            {/* Course Enrollment Bag/Cart Icon */}
                            <div className="nav-cart-wrapper" onClick={() => navigate(user ? '/dashboard' : '/course')} title={user ? "My Enrolled Courses" : "Explore Courses"}>
                                <FiShoppingBag className="nav-cart-icon" />
                                {user && (
                                    <span className="nav-cart-badge">
                                        {user.hasPurchasedCourse ? '1' : '0'}
                                    </span>
                                )}
                            </div>

                            <button type="button" className={`nav-theme-switch ${isDarkMode ? 'dark' : 'light'}`} onClick={toggleTheme} aria-label="Toggle Theme">
                                <div className="switch-track">
                                    <FiSun className="switch-icon switch-icon-sun" />
                                    <FiMoon className="switch-icon switch-icon-moon" />
                                    <div className="switch-knob">
                                        {isDarkMode ? <FiMoon /> : <FiSun />}
                                    </div>
                                </div>
                            </button>
                            {user ? (
                                <div style={{ display: 'flex', alignItems: 'center', marginRight: '15px' }}>
                                    <span className="nav-user-greeting" style={{ fontWeight: '600', marginRight: '8px' }}>
                                        Hi, {user.name.split(' ')[0]}
                                    </span>
                                    {user.hasPurchasedCourse && (
                                        <span className="nav-pro-badge">
                                            PRO
                                        </span>
                                    )}
                                    <button type="button" className="Nav_Login" onClick={() => { logout(); navigate('/'); }} style={{ marginLeft: user.hasPurchasedCourse ? '0' : '15px' }}>
                                        <FiLogOut /> Logout
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <button type="button" className="Nav_Login" onClick={() => navigate('/login')}>
                                        <FiLogIn /> Login
                                    </button>
                                    <button type="button" className="Sgin_up" onClick={() => navigate('/signup')}>Sign up</button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Navbar;

