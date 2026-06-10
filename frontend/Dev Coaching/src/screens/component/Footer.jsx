import './Footer.css';
import { useEffect } from 'react';
import { FaLaptopCode } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { FiTwitter, FiFacebook } from "react-icons/fi";
import { Link } from 'react-router-dom';

const QUICK_LINKS = [
    { to: '/', label: 'Home' },
    { to: '/course', label: 'Course' },
    { to: '', label: 'Live Classes' },
];

const RESOURCE_LINKS = [
    { to: '', label: 'Exam' },
    { to: '', label: 'Teacher' },
];

const COMPANY_LINKS = [
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
    { to: '', label: 'Careers' },
];

function Footer() {
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
        return () => observer.disconnect();
    }, []);

    return (
        <footer className="Footer">
            <div className="container">
                <div className="row g-4">
                    <div className="col-md-6 col-lg-3 footer-reveal">
                        <div className="footer-brand">
                            <h3 className="footer-brand__logo">
                                <FaLaptopCode />
                                Dev <span>Coaching</span>
                            </h3>
                            <p className="footer-brand__tagline">
                                Level up your developer career with senior mentors.
                            </p>
                            <div className="footer-social">
                                <div className="Footer_icons">
                                    <Link to="" aria-label="Instagram">
                                        <FaInstagram className="Footer_icons_style" />
                                    </Link>
                                </div>
                                <div className="Footer_icons">
                                    <Link to="" aria-label="Twitter">
                                        <FiTwitter className="Footer_icons_style" />
                                    </Link>
                                </div>
                                <div className="Footer_icons">
                                    <Link to="" aria-label="Facebook">
                                        <FiFacebook className="Footer_icons_style" />
                                    </Link>
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
        </footer>
    );
}

export default Footer;
