import Button from '@mui/material/Button';
import './Navbar.css';
import { FaLaptopCode } from "react-icons/fa6";
import { FiLogIn, FiLogOut } from "react-icons/fi";
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useLayoutEffect, useRef, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const NAV_LINKS = [
    { to: '/', label: 'Home', end: true },
    { to: '/course', label: 'Course' },
    { to: '/notes', label: 'Notes' },
    { to: '/exams', label: 'Exams' },
    { to: '/join-live', label: 'Join Live' },
    { to: '/instructors', label: 'Instructors' },
    { to: '/about', label: 'About' },
];

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const navListRef = useRef(null);
    const linkRefs = useRef({});
    const [indicator, setIndicator] = useState({ left: 0, width: 0, opacity: 0 });
    const [isSwitching, setIsSwitching] = useState(false);
    const { user, logout } = useContext(AuthContext);

    const updateIndicator = () => {
        const activePath = NAV_LINKS.find(
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
            <div className="nav-progress-bar" aria-hidden="true" />

            <div className="container">
                <div className="row align-items-center">
                    <div className="col-md-2">
                        <button
                            type="button"
                            className="nav-brand"
                            onClick={() => navigate('/')}
                        >
                            <FaLaptopCode className="nav-brand__icon" />
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
                                {NAV_LINKS.map((link) => (
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
                            {user ? (
                                <>
                                    <span style={{ marginRight: '15px', color: 'white', fontWeight: '600' }}>
                                        Hi, {user.name.split(' ')[0]}
                                    </span>
                                    <button type="button" className="Nav_Login" onClick={() => { logout(); navigate('/'); }}>
                                        <FiLogOut /> Logout
                                    </button>
                                </>
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
