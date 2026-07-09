import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { MdLock } from 'react-icons/md';

const Unauthorized = () => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', gap: 16, background: 'var(--bg-base)', textAlign: 'center', padding: 24
    }}>
      <div style={{
        width: 80, height: 80, borderRadius: '50%',
        background: 'rgba(239,68,68,0.1)', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        fontSize: '2rem', color: 'var(--danger)'
      }}>
        <MdLock />
      </div>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>Access Denied</h1>
      <p style={{ color: 'var(--text-secondary)', maxWidth: 360 }}>
        You don&apos;t have permission to access this page. Please contact your administrator.
      </p>
      <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
    </div>
  );
};

export default Unauthorized;
