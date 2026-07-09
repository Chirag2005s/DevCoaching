import { useAuth } from '../../context/AuthContext';
import SuperAdminDashboard from './SuperAdminDashboard';
import AdminDashboard from './AdminDashboard';
import TeacherDashboard from './TeacherDashboard';
import StudentDashboard from './StudentDashboard';

/** Router: renders the correct dashboard based on user role */
const DashboardHome = () => {
  const { role } = useAuth();

  switch (role) {
    case 'superadmin': return <SuperAdminDashboard />;
    case 'admin':      return <AdminDashboard />;
    case 'teacher':    return <TeacherDashboard />;
    case 'student':    return <StudentDashboard />;
    default:           return <StudentDashboard />;
  }
};

export default DashboardHome;
