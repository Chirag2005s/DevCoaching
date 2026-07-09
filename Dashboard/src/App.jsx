import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './routes/ProtectedRoute';
import DashboardLayout from './components/Layout/DashboardLayout';

// Auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Unauthorized from './pages/auth/Unauthorized';

// Dashboard
import DashboardHome from './pages/dashboard/DashboardHome';

// Management pages
import CoursesPage from './pages/management/CoursesPage';
import TeachersPage from './pages/management/TeachersPage';
import StudentsPage from './pages/management/StudentsPage';
import NotesPage from './pages/management/NotesPage';
import ExamsPage from './pages/management/ExamsPage';
import AssignmentsPage from './pages/management/AssignmentsPage';
import CertificatesPage from './pages/management/CertificatesPage';
import SchedulePage from './pages/management/SchedulePage';
import AnalyticsPage from './pages/management/AnalyticsPage';
import AIAssistantPage from './pages/management/AIAssistantPage';
import ProfilePage from './pages/management/ProfilePage';

import './index.css';

/** Layout wrapper that injects mobile menu state */
const AppLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <DashboardLayout
      mobileOpen={mobileOpen}
      onMenuClick={() => setMobileOpen(p => !p)}
      onClose={() => setMobileOpen(false)}
    >
      {children}
    </DashboardLayout>
  );
};

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Protected Routes – all authenticated roles */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <DashboardHome />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/courses"
              element={
                <ProtectedRoute>
                  <AppLayout><CoursesPage /></AppLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/notes"
              element={
                <ProtectedRoute>
                  <AppLayout><NotesPage /></AppLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/exams"
              element={
                <ProtectedRoute>
                  <AppLayout><ExamsPage /></AppLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/assignments"
              element={
                <ProtectedRoute>
                  <AppLayout><AssignmentsPage /></AppLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/schedule"
              element={
                <ProtectedRoute>
                  <AppLayout><SchedulePage /></AppLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/certificates"
              element={
                <ProtectedRoute>
                  <AppLayout><CertificatesPage /></AppLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <AppLayout><AnalyticsPage /></AppLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/ai-assistant"
              element={
                <ProtectedRoute>
                  <AppLayout><AIAssistantPage /></AppLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <AppLayout><ProfilePage /></AppLayout>
                </ProtectedRoute>
              }
            />

            {/* Admin+ restricted routes */}
            <Route
              path="/teachers"
              element={
                <ProtectedRoute allowedRoles={['superadmin', 'admin']}>
                  <AppLayout><TeachersPage /></AppLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/students"
              element={
                <ProtectedRoute allowedRoles={['superadmin', 'admin', 'teacher']}>
                  <AppLayout><StudentsPage /></AppLayout>
                </ProtectedRoute>
              }
            />

            {/* Super Admin only */}
            <Route
              path="/users"
              element={
                <ProtectedRoute allowedRoles={['superadmin']}>
                  <AppLayout><StudentsPage /></AppLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/permissions"
              element={
                <ProtectedRoute allowedRoles={['superadmin']}>
                  <AppLayout>
                    <div className="page-section">
                      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, background: 'var(--brand-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Permissions & Roles
                      </h2>
                      <p style={{ color: 'var(--text-muted)', marginTop: 8 }}>Role-based access control configuration – coming soon.</p>
                    </div>
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/revenue"
              element={
                <ProtectedRoute allowedRoles={['superadmin']}>
                  <AppLayout><AnalyticsPage /></AppLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/settings"
              element={
                <ProtectedRoute allowedRoles={['superadmin', 'admin']}>
                  <AppLayout>
                    <div className="page-section">
                      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, background: 'var(--brand-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Platform Settings
                      </h2>
                      <p style={{ color: 'var(--text-muted)', marginTop: 8 }}>System configuration and preferences – coming soon.</p>
                    </div>
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
