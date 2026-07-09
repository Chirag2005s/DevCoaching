import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff, MdWarning } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:9000/api';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      login(data.user, data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Demo quick-login
  const demoLogin = (role) => {
    const demoUsers = {
      superadmin: { name: 'Super Admin', email: 'superadmin@devcoaching.com', role: 'superadmin' },
      admin: { name: 'Admin User', email: 'admin@devcoaching.com', role: 'admin' },
      teacher: { name: 'John Teacher', email: 'teacher@devcoaching.com', role: 'teacher' },
      student: { name: 'Jane Student', email: 'student@devcoaching.com', role: 'student' },
    };
    login(demoUsers[role], 'demo-token-' + role);
    navigate('/dashboard');
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo-icon">DC</div>
          <span className="auth-logo-name">Dev Coaching</span>
        </div>

        <h1 className="auth-title">Welcome Back!</h1>
        <p className="auth-subtitle">Sign in to your account to continue learning</p>

        {error && (
          <div className="auth-error">
            <MdWarning /> {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          {/* Email */}
          <div className="auth-input-group">
            <label className="auth-input-label" htmlFor="login-email">Email Address</label>
            <div className="auth-input-wrapper">
              <MdEmail className="auth-input-icon" />
              <input
                id="login-email"
                className="auth-input"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password */}
          <div className="auth-input-group">
            <label className="auth-input-label" htmlFor="login-password">Password</label>
            <div className="auth-input-wrapper">
              <MdLock className="auth-input-icon" />
              <input
                id="login-password"
                className="auth-input"
                type={showPw ? 'text' : 'password'}
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
              <span className="auth-input-eye" onClick={() => setShowPw(p => !p)}>
                {showPw ? <MdVisibilityOff /> : <MdVisibility />}
              </span>
            </div>
          </div>

          {/* Options */}
          <div className="auth-options">
            <label className="auth-remember">
              <input type="checkbox" id="login-remember" />
              Remember me
            </label>
            <Link to="/forgot-password" className="auth-forgot">Forgot password?</Link>
          </div>

          <button
            id="login-submit-btn"
            className="auth-btn"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Demo logins */}
        <div className="auth-divider" style={{ marginTop: 20 }}>Quick Demo Access</div>
        <div className="role-grid">
          {[
            { role: 'superadmin', label: 'Super Admin', icon: '👑' },
            { role: 'admin', label: 'Admin', icon: '🛡️' },
            { role: 'teacher', label: 'Teacher', icon: '👨‍🏫' },
            { role: 'student', label: 'Student', icon: '🎓' },
          ].map(({ role, label, icon }) => (
            <button
              key={role}
              id={`demo-${role}-btn`}
              className="role-option"
              onClick={() => demoLogin(role)}
              type="button"
            >
              <span className="role-option-icon">{icon}</span>
              <span className="role-option-label">{label}</span>
            </button>
          ))}
        </div>

        <div className="auth-footer" style={{ marginTop: 20 }}>
          Don&apos;t have an account?{' '}
          <Link to="/register" className="auth-footer-link">Create one</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
