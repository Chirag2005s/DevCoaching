import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Home from './screens/Home.jsx'
import Course from './screens/Course.jsx'
import Navbar from './screens/component/Navbar.jsx'
import Footer from './screens/component/Footer.jsx'
import About from './screens/About.jsx'
import Contact from './screens/Contact.jsx'
import ChatWidget from './screens/component/ChatWidget.jsx'
import JoinLive from './screens/joinLive.jsx'
import CourseDetails from './screens/CourseDetails.jsx';
import CoursePurchase from './screens/CoursePurchase.jsx';
import Instructors from './screens/Instructors.jsx';
import LearningHub from './screens/LearningHub.jsx';
import Batches from './screens/Batches.jsx';
import Careers from './screens/careers.jsx';
import Login from './screens/Login.jsx';
import Signup from './screens/Signup.jsx';
import Dashboard from './screens/Dashboard.jsx';
import Analytics from './screens/Analytics.jsx';
import Calendar from './screens/Calendar.jsx';
import Playground from './screens/Playground.jsx';
import GlobalSearch from './screens/component/GlobalSearch.jsx';
import KeyboardShortcuts from './screens/component/KeyboardShortcuts.jsx';
import QuickActions from './screens/component/QuickActions.jsx';
import OnboardingTour from './screens/component/OnboardingTour.jsx';
import NotificationBell from './screens/component/NotificationBell.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { NotificationProvider } from './context/NotificationContext.jsx';
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './page-transition.css';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <div key={location.pathname} className="page-transition">
      <Routes location={location}>
        <Route path='/' element={<Home />} />
        <Route path='/course' element={<Course />} />
        <Route path='/course/:id' element={<CourseDetails />} />
        <Route path='/purchase/:id' element={<CoursePurchase />} />
        <Route path='/add-course' element={<Navigate to='/course' replace />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/join-live' element={<JoinLive />} />
        <Route path='/instructors' element={<Instructors />} />
        <Route path='/learning-hub' element={<LearningHub />} />
        <Route path='/batches' element={<Batches />} />
        <Route path='/notes' element={<Navigate to='/learning-hub' state={{ activeTab: 'notes' }} replace />} />
        <Route path='/exams' element={<Navigate to='/learning-hub' state={{ activeTab: 'exams' }} replace />} />
        <Route path='/careers' element={<Careers />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/analytics' element={<Analytics />} />
        <Route path='/calendar' element={<Calendar />} />
        <Route path='/playground' element={<Playground />} />
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </div>
  );
}

function AppShell() {
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <Navbar onOpenSearch={() => setSearchOpen(true)} />
      <AnimatedRoutes />
      <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <KeyboardShortcuts onOpenSearch={() => setSearchOpen(true)} navigate={navigate} />
      <QuickActions onOpenSearch={() => setSearchOpen(true)} />
      <OnboardingTour />
      <ChatWidget />
      <Footer />
    </>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <BrowserRouter>
            <AppShell />
          </BrowserRouter>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
)