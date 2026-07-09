import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MdPerson, MdEmail, MdLock, MdVisibility, MdVisibilityOff, MdWarning,
         MdAdminPanelSettings, MdSupervisorAccount, MdSchool, MdGroups } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:9000/api';

const ROLES = [
  { value: 'student', label: 'Student', icon: <MdGroups /> },
  { value: 'teacher', label: 'Teacher', icon: <MdSchool /> },
  { value: 'admin', label: 'Admin', icon: <MdSupervisorAccount /> },
  { value: 'superadmin', label: 'Super Admin', icon: <MdAdminPanelSettings /> },
];

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
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
    if (!form.name || !form.email || !form.password) {
      setError('Please fill in all fields.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      login(data.user, data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">DC</div>
          <span className="auth-logo-name">Dev Coaching</span>
        </div>

        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Join thousands of learners today</p>

        {error && (
          <div className="auth-error">
            <MdWarning /> {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          {/* Name */}
          <div className="auth-input-group">
            <label className="auth-input-label" htmlFor="reg-name">Full Name</label>
            <div className="auth-input-wrapper">
              <MdPerson className="auth-input-icon" />
              <input
                id="reg-name"
                className="auth-input"
                type="text"
                name="name"
                placeholder="Your full name"
                value={form.name}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Email */}
          <div className="auth-input-group">
            <label className="auth-input-label" htmlFor="reg-email">Email</label>
            <div className="auth-input-wrapper">
              <MdEmail className="auth-input-icon" />
              <input
                id="reg-email"
                className="auth-input"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Password */}
          <div className="auth-input-group">
            <label className="auth-input-label" htmlFor="reg-password">Password</label>
            <div className="auth-input-wrapper">
              <MdLock className="auth-input-icon" />
              <input
                id="reg-password"
                className="auth-input"
                type={showPw ? 'text' : 'password'}
                name="password"
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={handleChange}
              />
              <span className="auth-input-eye" onClick={() => setShowPw(p => !p)}>
                {showPw ? <MdVisibilityOff /> : <MdVisibility />}
              </span>
            </div>
          </div>

          {/* Role */}
          <div className="auth-input-group">
            <label className="auth-input-label">Select Role</label>
            <div className="role-grid">
              {ROLES.map(r => (
                <button
                  key={r.value}
                  type="button"
                  id={`role-${r.value}`}
                  className={`role-option ${form.role === r.value ? 'selected' : ''}`}
                  onClick={() => setForm(p => ({ ...p, role: r.value }))}
                >
                  <span className="role-option-icon">{r.icon}</span>
                  <span className="role-option-label">{r.label}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            id="register-submit-btn"
            className="auth-btn"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer" style={{ marginTop: 16 }}>
          Already have an account?{' '}
          <Link to="/login" className="auth-footer-link">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
