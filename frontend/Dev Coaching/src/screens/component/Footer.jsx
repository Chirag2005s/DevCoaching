import './Footer.css';
import { useEffect, useState } from 'react';
import { FaInstagram } from "react-icons/fa";
import { FiFacebook } from "react-icons/fi";
import { FaLinkedinIn } from "react-icons/fa";
import { FiArrowUp } from "react-icons/fi";
import { Link } from 'react-router-dom';
import logo from '../logo/devcoaching.png.logo.png';

const QUICK_LINKS = [
    { to: '/', label: 'Home' },
    { to: '/course', label: 'Course' },
    { to: '/join-live', label: 'Live Classes' },
];

const RESOURCE_LINKS = [
    { to: '/exams', label: 'Exam' },
    { to: '/instructors', label: 'Teacher' },
];

const COMPANY_LINKS = [
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
    { to: '/careers', label: 'Careers' },
];

function Footer() {
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('footer-reveal-visible');
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
        );

        document.querySelectorAll('.footer-reveal').forEach((el) => observer.observe(el));

        const handleScroll = () => {
            if (window.scrollY > 400) {
                setShowScrollTop(true);
            } else {
                setShowScrollTop(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            observer.disconnect();
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (email.trim()) {
            setSubscribed(true);
            setEmail('');
            setTimeout(() => setSubscribed(false), 5000);
        }
    };

    return (
        <footer className="Footer">
            <div className="container">
                <div className="row g-4">
                    <div className="col-md-6 col-lg-3 footer-reveal">
                        <div className="footer-brand">
                            <h3 className="footer-brand__logo">
                                <img src={logo} alt="Dev Coaching Logo" className="footer-logo-img" />
                                Dev <span>Coaching</span>
                            </h3>
                            <p className="footer-brand__tagline">
                                Level up your developer career with senior mentors.
                            </p>

                            {/* Newsletter form */}
                            <div className="footer-newsletter" style={{ marginBottom: '24px' }}>
                                <h5 className="footer-newsletter__title" style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '10px', color: 'var(--text)' }}>
                                    Join Our Newsletter
                                </h5>
                                {subscribed ? (
                                    <div className="footer-newsletter__success" style={{ color: 'var(--success)', fontSize: '0.85rem', fontWeight: '500' }}>
                                        🎉 Subscribed successfully!
                                    </div>
                                ) : (
                                    <form className="footer-newsletter__form" onSubmit={handleSubscribe} style={{ display: 'flex', gap: '8px' }}>
                                        <input
                                            type="email"
                                            placeholder="Enter your email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="footer-newsletter__input"
                                            style={{
                                                flex: 1,
                                                padding: '8px 12px',
                                                borderRadius: '8px',
                                                border: '1px solid var(--border)',
                                                fontSize: '0.8rem',
                                                background: 'var(--surface)',
                                                color: 'var(--text)'
                                            }}
                                        />
                                        <button
                                            type="submit"
                                            className="footer-newsletter__btn"
                                            style={{
                                                padding: '8px 16px',
                                                borderRadius: '8px',
                                                background: 'var(--primary)',
                                                color: 'white',
                                                border: 'none',
                                                cursor: 'pointer',
                                                fontWeight: '600',
                                                fontSize: '0.8rem'
                                            }}
                                        >
                                            Join
                                        </button>
                                    </form>
                                )}
                            </div>

                            <div className="footer-social">
                                <div className="Footer_icons">
                                    <a href="https://www.instagram.com/devcoaching.official/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                                        <FaInstagram className="Footer_icons_style" />
                                    </a>
                                </div>
                                <div className="Footer_icons">
                                    <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                                        <FaLinkedinIn className="Footer_icons_style" />
                                    </a>
                                </div>
                                <div className="Footer_icons">
                                    <a href="https://www.facebook.com/people/Dev-Coaching/pfbid02m5rEQZspUr863SJu1tGyqDEjRjgwxQWT1D8j3QyYnr6q9QayYcX2M9HNJfHy6qscl/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                                        <FiFacebook className="Footer_icons_style" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-6 col-md-3 footer-reveal footer-reveal-delay-1">
                        <div className="footer-col">
                            <h4 className="footer-col__title">Quick Links</h4>
                            <nav className="footer-links">
                                {QUICK_LINKS.map(({ to, label }) => (
                                    <Link key={label} to={to} className="links">{label}</Link>
                                ))}
                            </nav>
                        </div>
                    </div>

                    <div className="col-6 col-md-3 footer-reveal footer-reveal-delay-2">
                        <div className="footer-col">
                            <h4 className="footer-col__title">Resources</h4>
                            <nav className="footer-links">
                                {RESOURCE_LINKS.map(({ to, label }) => (
                                    <Link key={label} to={to} className="links">{label}</Link>
                                ))}
                            </nav>
                        </div>
                    </div>

                    <div className="col-12 col-md-6 col-lg-3 footer-reveal footer-reveal-delay-3">
                        <div className="footer-col">
                            <h4 className="footer-col__title">Company</h4>
                            <nav className="footer-links">
                                {COMPANY_LINKS.map(({ to, label }) => (
                                    <Link key={label} to={to} className="links">{label}</Link>
                                ))}
                            </nav>
                        </div>
                    </div>
                </div>
            </div>

            <hr className="footer-divider" />
            <div className="footer-bottom container">
                <p className="footer-copyright">
                    Copyright © 2024 Dev Coaching | All rights reserved.
                </p>
            </div>

            {/* Scroll to Top Button */}
            <button
                type="button"
                className={`scroll-to-top ${showScrollTop ? 'scroll-to-top--visible' : ''}`}
                onClick={scrollToTop}
                aria-label="Scroll to top"
            >
                <FiArrowUp />
            </button>
        </footer>
    );
}

export default Footer;
