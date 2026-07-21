import { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import demoVideo from './videos/WhatsApp Video 2026-07-01 at 11.28.12 AM.mp4';
import {
  FaGraduationCap,
  FaLightbulb,
  FaChevronDown,
  FaChevronUp,
  FaRegLightbulb,
  FaRocket,
  FaAward,
} from 'react-icons/fa6';
import {
  FiUsers,
  FiFileText,
  FiCheckCircle,
  FiDownload,
  FiTrendingUp,
  FiMapPin,
  FiBookOpen,
  FiCheck,
  FiArrowRight,
} from 'react-icons/fi';
import { ThemeContext } from '../context/ThemeContext';
import devLogo from './logo/devcoaching.png.logo.png';
import './careers.css';

const SERVICES = [
  {
    title: 'Career Counseling',
    description: 'Get personalized mentorship and map your career paths with senior developers.',
    icon: FiUsers,
  },
  {
    title: 'Resume Building',
    description: 'Craft high-converting, ATS-friendly developer resumes that stand out to tech recruiters.',
    icon: FiFileText,
  },
  {
    title: 'Interview Preparation',
    description: 'Structure mock coding rounds, DSA reviews, and technical system design evaluations.',
    icon: FiTrendingUp,
  },
  {
    title: 'Soft Skills Training',
    description: 'Develop presentation, collaboration, and client communication skills crucial for remote dev teams.',
    icon: FaLightbulb,
  },
  {
    title: 'Industry Mentorship',
    description: 'Learn directly from engineers working at top-tier product and software companies.',
    icon: FaGraduationCap,
  },
  {
    title: 'Higher Education Guidance',
    description: 'Get mapped paths for pursuing specialized master degrees or advanced bootcamps abroad.',
    icon: FiBookOpen,
  },
];

const FAQS = [
  {
    q: 'How does Dev Coaching help students build careers?',
    a: 'We combine premium live instruction on Google Meet with continuous career development. You do not just learn syntax — you construct production-level applications, build a strong GitHub profile, undergo mock interviews, and work 1:1 with industry mentors to match active hiring standards.',
  },
  {
    q: 'Do you provide internship guidance?',
    a: 'Yes! We run dedicated internship matching programs. We assist with applying to partner startups, preparing for short-term coding trials, and drafting developer profiles that secure remote and hybrid internship positions.',
  },
  {
    q: 'How can I prepare for interviews?',
    a: 'We host weekly mock interviews mimicking top tech recruiters. We provide structured sets of DSA challenges, system design templates, ATS-approved resume formats, and live feedback from senior engineering mentors.',
  },
];

function Careers() {
  const navigate = useNavigate();
  const { isDarkMode } = useContext(ThemeContext);
  const [activeFaq, setActiveFaq] = useState(null);

  useEffect(() => {
    document.title = 'Careers & Career Guidance | Dev Coaching';
  }, []);

  return (
    <div className="careers-page-container" data-theme={isDarkMode ? 'dark' : 'light'}>
      {/* HERO SECTION */}
      <section className="careers-hero">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <img src={devLogo} alt="Dev Coaching" className="careers-hero-logo" />
            <h1>Build Your Future <span>with Dev Coaching</span></h1>
            <p>Learn in-demand skills, gain practical experience, and prepare for a successful developer career with live mentorship.</p>
            <div className="hero-buttons">
              <button onClick={() => navigate('/course')} className="career-btn career-btn-primary">
                Explore Courses <FiArrowRight />
              </button>
              <button onClick={() => navigate('/contact')} className="career-btn career-btn-outline">
                Contact Us
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* VIDEO SECTION */}
      <section className="video-section">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-5">
              <motion.div className="video-text-content" initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <h2>Experience <span>Live Training</span></h2>
                <p>
                  Watch how our live developer coaching works. Learn exactly what the industry demands directly from senior engineers building real production applications.
                </p>
                <ul className="video-list">
                  <li><FiCheckCircle /> Live Google Meet Sessions</li>
                  <li><FiCheckCircle /> 1:1 Doubt Resolution</li>
                  <li><FiCheckCircle /> Real-world Project Building</li>
                  <li><FiCheckCircle /> Placement & Interview Prep</li>
                </ul>
                <button onClick={() => navigate('/join-live')} className="career-btn career-btn-primary mt-3" style={{ width: 'fit-content' }}>
                  Join Live Class
                </button>
              </motion.div>
            </div>
            <div className="col-lg-7">
              <motion.div className="career-video-container" initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <video className="career-video" autoPlay muted loop playsInline preload="auto">
                  <source src={demoVideo} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section className="careers-section">
        <div className="container">
          <h2 className="section-title">Career Guidance & Support</h2>
          <p className="section-subtitle">
            We provide comprehensive training frameworks built around real hiring parameters to ensure your developer growth.
          </p>
          <div className="row g-4">
            {SERVICES.map((srv, idx) => {
              const Icon = srv.icon;
              return (
                <div className="col-md-6 col-lg-4" key={srv.title}>
                  <motion.div 
                    className="career-card"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <div className="career-card-icon">
                      <Icon />
                    </div>
                    <h3>{srv.title}</h3>
                    <p>{srv.description}</p>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="careers-section" style={{ borderBottom: 'none' }}>
        <div className="container">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-subtitle">
            Clear your questions about career tracks, mentorship, and job readiness loops.
          </p>
          <div className="row justify-content-center">
            <div className="col-lg-8">
              {FAQS.map((faq, index) => {
                const isOpen = activeFaq === index;
                return (
                  <div key={index} className="faq-item">
                    <button onClick={() => setActiveFaq(isOpen ? null : index)} className="faq-question">
                      {faq.q}
                      {isOpen ? <FaChevronUp /> : <FaChevronDown />}
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="faq-answer-wrapper"
                        >
                          <div className="faq-answer">
                            {faq.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Careers;
