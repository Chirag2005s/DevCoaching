import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
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
  FiSun,
  FiMoon,
} from 'react-icons/fi';
import './careers.css';

// ── DATA DEFINITIONS ──

const SERVICES = [
  {
    title: 'Career Counseling',
    description: 'Get personalized mentorship and map your career paths with senior developers.',
    icon: FiUsers,
    color: 'from-blue-500 to-indigo-600',
  },
  {
    title: 'Resume Building',
    description: 'Craft high-converting, ATS-friendly developer resumes that stand out to tech recruiters.',
    icon: FiFileText,
    color: 'from-purple-500 to-pink-600',
  },
  {
    title: 'Interview Preparation',
    description: 'Structure mock coding rounds, DSA reviews, and technical system design evaluations.',
    icon: FiTrendingUp,
    color: 'from-emerald-500 to-teal-600',
  },
  {
    title: 'Soft Skills Training',
    description: 'Develop presentation, collaboration, and client communication skills crucial for remote dev teams.',
    icon: FaLightbulb,
    color: 'from-amber-500 to-orange-600',
  },
  {
    title: 'Industry Mentorship',
    description: 'Learn directly from engineers working at top-tier product and software companies.',
    icon: FaGraduationCap,
    color: 'from-sky-500 to-blue-600',
  },
  {
    title: 'Higher Education Guidance',
    description: 'Get mapped paths for pursuing specialized master degrees or advanced bootcamps abroad.',
    icon: FiBookOpen,
    color: 'from-red-500 to-rose-600',
  },
];

const TRACKS = [
  {
    name: 'Full Stack Development',
    duration: '6 Months',
    tech: 'React, Node.js, Express, MongoDB',
    description: 'Master frontend, backend, database systems, and end-to-end cloud deployment.',
    demand: 'High',
  },
  {
    name: 'Python Programming',
    duration: '4 Months',
    tech: 'Core Python, Flask, Scripting, APIs',
    description: 'Build backend microservices, web-scraping scripts, and automations.',
    demand: 'Very High',
  },
  {
    name: 'Java Development',
    duration: '5 Months',
    tech: 'Java Core, Spring Boot, Hibernate',
    description: 'Architect scalable corporate enterprise web services and MVC architecture.',
    demand: 'Stable',
  },
  {
    name: 'Data Science',
    duration: '6 Months',
    tech: 'NumPy, Pandas, SciKit-Learn, SQL',
    description: 'Model predictive statistical systems, data analysis dashboards, and pipelines.',
    demand: 'High',
  },
  {
    name: 'Web Development',
    duration: '3 Months',
    tech: 'HTML5, CSS3, JavaScript ES6+, Bootstrap',
    description: 'Build premium responsive user layouts and interface mockups.',
    demand: 'High',
  },
  {
    name: 'Mobile App Development',
    duration: '5 Months',
    tech: 'React Native, Flutter, Firebase',
    description: 'Code hybrid cross-platform iOS and Android mobile applications.',
    demand: 'High',
  },
  {
    name: 'AI & Machine Learning',
    duration: '6 Months',
    tech: 'TensorFlow, PyTorch, LLMs, Neural Networks',
    description: 'Train neural architectures, fine-tune models, and integrate cognitive services.',
    demand: 'Emerging',
  },
];

const TESTIMONIALS = [
  {
    name: 'Rohan Sharma',
    course: 'Full Stack Development',
    position: 'Associate Engineer at TCS',
    story:
      'Johan sir helped me rebuild my portfolio from scratch. The mock interview rounds were identical to the real interviews. I cracked my placement on the first try!',
    avatar: 'RS',
  },
  {
    name: 'Ananya Goel',
    course: 'Python Programming',
    position: 'Data Analyst at Capgemini',
    story:
      'The transition from non-tech to analytics was smooth. Doing live code-reviews with senior mentors gave me high-level skills that immediately solved my project test rounds.',
    avatar: 'AG',
  },
  {
    name: 'Vikram Aditya',
    course: 'Java Development & Spring Boot',
    position: 'SDE-1 at Cognizant',
    story:
      'Learning REST API design and Spring Security live on Google Meet helped clear all my architectural concepts. Direct mentor chats solved my doubts within minutes.',
    avatar: 'VA',
  },
];

const PLACEMENT_FEATURES = [
  { title: 'Mock Interviews', desc: 'Simulated technical and HR interviews with real industry specialists.' },
  { title: 'Resume Reviews', desc: 'Iterative, peer-reviewed resume edits highlighting key GitHub projects.' },
  { title: 'Job Readiness Training', desc: 'DSA sprints, live coding tests, and communication mock-ups.' },
  { title: 'Internship Assistance', desc: 'Guaranteed matching with partner startups looking for developer talents.' },
  { title: 'Placement Guidance', desc: 'Direct HR recruitment pipelines and regular referral opportunities.' },
];

const INTERNSHIPS = [
  { category: 'Web Development', roles: 'MERN stack intern, Frontend engineer assistant', open: '12 Positions' },
  { category: 'Python Development', roles: 'Flask backend intern, Automation script writer', open: '8 Positions' },
  { category: 'Frontend Development', roles: 'React UI dev, Tailwind CSS design intern', open: '15 Positions' },
  { category: 'Backend Development', roles: 'Node/Express API coordinator, database assistant', open: '6 Positions' },
  { category: 'Digital Marketing', roles: 'Technical SEO lead, content and layout analyst', open: '4 Positions' },
];

const RESOURCES = [
  { title: 'Interview Questions', type: 'PDF Guide', count: '150+ Questions' },
  { title: 'Coding Practice Materials', type: 'GitHub Repos', count: '50+ Challenges' },
  { title: 'Project Ideas', type: 'Design Documents', count: '20+ Blueprints' },
  { title: 'Resume Templates', type: 'Figma & Docx', count: '5 Premium Layouts' },
  { title: 'Career Roadmaps', type: 'Interactive Mindmap', count: '7 Technical Tracks' },
];

const STATS = [
  { label: 'Students Trained', value: '5000+' },
  { label: 'Specialized Courses', value: '100+' },
  { label: 'Student Satisfaction', value: '95%' },
  { label: 'Guidance Sessions', value: '1000+' },
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
  {
    q: 'Which courses are best for software development careers?',
    a: 'Our Full Stack Development (MERN) and Python Development tracks are currently the highest in demand. If you enjoy building visual applications, React and Frontend tracks are ideal. For enterprise architectures, the Java + Spring Boot pathway is highly recommended.',
  },
];

// ── COMPONENT ──

function Careers() {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeFaq, setActiveFaq] = useState(null);

  // Set page document title and meta description dynamically for SEO
  useEffect(() => {
    document.title = 'Careers & Career Guidance | Dev Coaching';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Explore learning paths, career opportunities, mock interviews, placement support, and skill development programs at Dev Coaching.'
      );
    }
  }, []);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // Animation helper configurations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <div
      className={`careers-page-container ${
        isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'light bg-slate-50 text-slate-900'
      }`}
    >
      {/* ── Theme Switcher Floater ── */}
      <button
        onClick={toggleTheme}
        className="fixed top-24 right-6 z-50 p-3 rounded-full shadow-lg border backdrop-blur-md transition-all duration-300 hover:scale-110 active:scale-95 bg-white/10 dark:bg-black/20 border-slate-300 dark:border-slate-700 text-amber-500 dark:text-blue-400"
        aria-label="Toggle Theme"
      >
        {isDarkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
      </button>

      {/* ═══════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════ */}
      <section className="relative overflow-hidden pt-36 pb-24 md:pt-44 md:pb-32 lg:pt-52 lg:pb-40 border-b border-slate-200/50 dark:border-slate-800/50">
        {/* Background glow blobs */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-16 left-1/4 w-80 h-80 md:w-96 md:h-96 bg-blue-500/15 dark:bg-blue-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-16 right-1/4 w-80 h-80 md:w-96 md:h-96 bg-amber-500/20 dark:bg-amber-600/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-6 bg-blue-500/10 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              <FaRocket className="w-3.5 h-3.5 animate-pulse" /> Launch Your Developer Career
            </span>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-slate-900 via-blue-600 to-slate-800 dark:from-white dark:via-blue-400 dark:to-slate-200 bg-clip-text text-transparent leading-[1.15]">
              Build Your Future <br className="hidden md:block" />
              with <span className="text-blue-600 dark:text-blue-500">Dev Coaching</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
              Learn in-demand skills, gain practical experience, and prepare for a successful career.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <button
                onClick={() => navigate('/course')}
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/25 transition-all hover:scale-105 duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                Explore Courses <FiArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate('/contact')}
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold border transition-all hover:scale-105 duration-200 bg-transparent border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-900/60 cursor-pointer"
              >
                Contact Us
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          STATS SECTION
      ═══════════════════════════════════════════ */}
      <section className="py-14 bg-slate-100/50 dark:bg-slate-900/20 border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 text-center">
            {STATS.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 shadow-sm"
              >
                <div className="text-3xl md:text-4xl font-extrabold text-blue-600 dark:text-blue-400 mb-1">
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CAREER GUIDANCE SECTION
      ═══════════════════════════════════════════ */}
      <section className="py-20 lg:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              Career Guidance &amp; Support
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              We provide comprehensive training frameworks built around real hiring parameters to ensure your developer growth.
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          >
            {SERVICES.map((srv) => {
              const Icon = srv.icon;
              return (
                <motion.div
                  key={srv.title}
                  variants={itemVariants}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="group relative overflow-hidden p-7 rounded-2xl border transition-all duration-300 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md"
                >
                  <div
                    className={`inline-flex p-3.5 rounded-xl bg-gradient-to-r ${srv.color} text-white mb-5 shadow-md`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {srv.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {srv.description}
                  </p>
                  {/* Bottom accent bar */}
                  <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          LEARNING PATHWAYS SECTION
      ═══════════════════════════════════════════ */}
      <section className="py-20 lg:py-28 bg-slate-100/50 dark:bg-slate-900/30 border-y border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              Career Tracks &amp; Learning Pathways
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Select a specialized development path, learn structured curriculums, and transition smoothly into technical roles.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {TRACKS.map((track, index) => (
              <motion.div
                key={track.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="inline-block px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400">
                      {track.duration}
                    </span>
                    <span
                      className={`inline-block px-2.5 py-1 rounded-md text-xs font-semibold ${
                        track.demand === 'Very High'
                          ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400'
                          : track.demand === 'High'
                          ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400'
                          : 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-400'
                      }`}
                    >
                      {track.demand} Demand
                    </span>
                  </div>
                  <h3 className="text-lg font-bold mb-2">{track.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-3 leading-normal">
                    Tech:{' '}
                    <span className="text-slate-700 dark:text-slate-300">{track.tech}</span>
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                    {track.description}
                  </p>
                </div>
                <button
                  onClick={() => navigate('/course')}
                  className="w-full py-2.5 rounded-lg text-sm font-bold border transition-all flex items-center justify-center gap-1.5 bg-blue-50/50 dark:bg-blue-900/10 hover:bg-blue-600 border-blue-200 dark:border-blue-900/50 hover:border-transparent text-blue-600 dark:text-blue-400 hover:text-white cursor-pointer"
                >
                  View Pathway <FiArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          PLACEMENT SUPPORT SECTION
      ═══════════════════════════════════════════ */}
      <section className="py-20 lg:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-16">
            {/* Left column — features list */}
            <div className="w-full lg:w-1/2">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-5 bg-emerald-500/10 dark:bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <FaAward className="w-3.5 h-3.5" /> 100% Placement Sprints
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold mb-5 leading-tight">
                  Placement Support &amp; Job Readiness Program
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                  We don&apos;t just stop at coding. Our placement assistance programs prepare you for standard tech
                  hiring processes, helping you clear interviews at major tech corporations.
                </p>

                <div className="space-y-3">
                  {PLACEMENT_FEATURES.map((item) => (
                    <div
                      key={item.title}
                      className="flex gap-4 p-4 rounded-xl hover:bg-slate-100/60 dark:hover:bg-slate-900/40 transition-colors"
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        <div className="p-1.5 rounded-full bg-emerald-500/10 text-emerald-500">
                          <FiCheck className="w-4 h-4 stroke-[3px]" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-bold mb-0.5">{item.title}</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right column — checklist card */}
            <div className="w-full lg:w-1/2">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative p-8 rounded-3xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
                <h3 className="text-xl font-bold mb-3 relative z-10">Placement Preparation Checklist</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed relative z-10">
                  Here is what you will accomplish during the Job Readiness program to finalize your placement profile:
                </p>
                <ul className="space-y-4 mb-8 relative z-10">
                  {[
                    '3 Full Stack GitHub Projects Approved',
                    'Complete 100+ LeetCode DSA Problems',
                    'ATS Resume score rated 85+',
                    'Clear 2 Mock Technical Panel Rounds',
                    'Polish LinkedIn Profile & Developer Presence',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm font-semibold">
                      <FiCheckCircle className="text-blue-500 w-5 h-5 flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => navigate('/contact')}
                  className="w-full py-4 rounded-xl text-center font-bold text-white bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 transition-colors shadow-lg cursor-pointer relative z-10"
                >
                  Enroll in Placement Program
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          INTERNSHIP OPPORTUNITIES SECTION
      ═══════════════════════════════════════════ */}
      <section className="py-20 lg:py-28 bg-slate-100/50 dark:bg-slate-900/30 border-y border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Internship Opportunities</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Apply directly to exclusive developer internship slots at partner product firms. Gain real engineering
              experience.
            </p>
          </div>

          {/* 5-card grid — last 2 centered on desktop via col-start */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {INTERNSHIPS.map((intern, idx) => (
              <motion.div
                key={intern.category}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`p-6 rounded-2xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between${
                  idx === 3 ? ' lg:col-start-1' : idx === 4 ? ' lg:col-start-2' : ''
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="px-2 py-1 rounded text-xs font-semibold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400">
                      Internship
                    </span>
                    <span className="text-xs font-bold text-blue-500 dark:text-blue-400">{intern.open}</span>
                  </div>
                  <h3 className="text-lg font-bold mb-2">{intern.category}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                    Roles:{' '}
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{intern.roles}</span>
                  </p>
                </div>
                <button
                  onClick={() => navigate('/contact')}
                  className="w-full py-2.5 rounded-lg text-sm font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <FiMapPin className="w-4 h-4" /> Apply for Internship
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          STUDENT SUCCESS STORIES
      ═══════════════════════════════════════════ */}
      <section className="py-20 lg:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Student Success Stories</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Read how our students transitioned into dream developer careers with mock practices and customized guidance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {TESTIMONIALS.map((t, idx) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className="p-7 rounded-2xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between"
              >
                <div className="mb-6">
                  <span className="text-5xl text-blue-500/20 font-serif leading-none select-none">&ldquo;</span>
                  <p className="text-sm italic leading-relaxed text-slate-600 dark:text-slate-400 -mt-2">
                    {t.story}
                  </p>
                </div>
                <div className="flex items-center gap-4 border-t pt-4 border-slate-100 dark:border-slate-800">
                  <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-base flex-shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{t.name}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{t.course}</p>
                    <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-0.5">{t.position}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CAREER RESOURCES SECTION
      ═══════════════════════════════════════════ */}
      <section className="py-20 lg:py-28 bg-slate-100/50 dark:bg-slate-900/30 border-y border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-16">
            {/* Left — description + mini stats grid */}
            <div className="w-full lg:w-1/2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-5 bg-amber-500/10 dark:bg-amber-600/20 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  <FaRegLightbulb className="w-3.5 h-3.5" /> Developer Toolkit
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold mb-5 leading-tight">
                  Premium Career Resources
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                  Download high-yield mock guides, ATS-ready templates, and project blueprints crafted directly by our
                  senior dev team.
                </p>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: '150+', label: 'Coding Questions' },
                    { value: '5+', label: 'Resume Formats' },
                    { value: '20+', label: 'Project Blueprints' },
                    { value: '7', label: 'Career Roadmaps' },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                    >
                      <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 mb-1">{stat.value}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right — resource list */}
            <div className="w-full lg:w-1/2">
              <div className="space-y-4">
                {RESOURCES.map((res, idx) => (
                  <motion.div
                    key={res.title}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.08 }}
                    className="p-4 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 flex justify-between items-center shadow-sm hover:border-blue-300 dark:hover:border-blue-800 transition-colors group"
                  >
                    <div>
                      <h4 className="font-bold text-sm md:text-base group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {res.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                        {res.type} &bull;{' '}
                        <span className="text-blue-500 dark:text-blue-400 font-bold">{res.count}</span>
                      </p>
                    </div>
                    <button
                      onClick={() => navigate('/contact')}
                      className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-blue-600 hover:border-transparent hover:text-white transition-all text-slate-600 dark:text-slate-300 cursor-pointer ml-4 flex-shrink-0"
                      aria-label="Download Resource"
                    >
                      <FiDownload className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FAQ SECTION
      ═══════════════════════════════════════════ */}
      <section className="py-20 lg:py-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Frequently Asked Questions</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Clear your questions about career tracks, mentorship, and job readiness loops.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div
                  key={faq.q}
                  className={`rounded-xl border transition-all bg-white dark:bg-slate-900 ${
                    isOpen
                      ? 'border-blue-400 dark:border-blue-700 shadow-md shadow-blue-500/10'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full px-5 md:px-6 py-5 text-left flex justify-between items-center gap-4 cursor-pointer"
                  >
                    <span className="font-bold text-sm md:text-base leading-snug">{faq.q}</span>
                    <span
                      className={`flex-shrink-0 transition-colors ${isOpen ? 'text-blue-500' : 'text-slate-400'}`}
                    >
                      {isOpen ? <FaChevronUp className="w-4 h-4" /> : <FaChevronDown className="w-4 h-4" />}
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 md:px-6 pb-5 md:pb-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
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
      </section>
    </div>
  );
}

export default Careers;
