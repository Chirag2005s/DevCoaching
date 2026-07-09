import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute – Checks auth and role before rendering.
 * @param {string[]} allowedRoles – If empty, any authenticated user is allowed.
 */
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center" style={{ height: '100vh' }}>
        <div style={{
          width: 40, height: 40, border: '3px solid var(--border-color)',
          borderTopColor: 'var(--brand-primary)', borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
