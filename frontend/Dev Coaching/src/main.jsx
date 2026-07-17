import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Home from "./screens/Home.jsx";
import Course from "./screens/Course.jsx";
import Navbar from "./screens/component/Navbar.jsx";
import Footer from "./screens/component/Footer.jsx";
import About from "./screens/About.jsx";
import Contact from "./screens/Contact.jsx";
import ChatWidget from "./screens/component/ChatWidget.jsx";
import JoinLive from "./screens/joinLive.jsx";
import CourseDetails from "./screens/CourseDetails.jsx";
import Instructors from "./screens/Instructors.jsx";
import Resources from "./screens/Resources.jsx";
import Careers from "./screens/careers.jsx";
import Login from "./screens/Login.jsx";
import Signup from "./screens/Signup.jsx";
import Dashboard from "./screens/Dashboard.jsx";
import Batch from "./screens/Batch.jsx";
import Attendance from "./screens/Attendance.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./page-transition.css";

function AnimatedRoutes() {
    const location = useLocation();

    return (
        <div key={location.pathname} className="page-transition">
            <Routes location={location}>
                <Route path="/" element={<Home />} />
                <Route path="/course" element={<Course />} />
                <Route path="/course/:id" element={<CourseDetails />} />
                <Route path="/add-course" element={<Navigate to="/course" replace />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/join-live" element={<JoinLive />} />
                <Route path="/instructors" element={<Instructors />} />
                <Route path="/resources" element={<Resources />} />
                {/* Legacy redirects */}
                <Route path="/notes" element={<Navigate to="/resources" replace />} />
                <Route path="/exams" element={<Navigate to="/resources" replace />} />
                <Route path="/careers" element={<Careers />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/batches" element={<Batch />} />
                <Route path="/attendance" element={<Attendance />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </div>
    );
}

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <ThemeProvider>
            <AuthProvider>
                <BrowserRouter>
                    <Navbar />
                    <AnimatedRoutes />
                    <ChatWidget />
                    <Footer />
                </BrowserRouter>
            </AuthProvider>
        </ThemeProvider>
    </StrictMode>
);