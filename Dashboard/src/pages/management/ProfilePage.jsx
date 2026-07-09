import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MdEdit, MdEmail, MdPhone, MdCalendarMonth, MdSchool,
         MdLocationOn, MdVerified, MdStar, MdMenuBook } from 'react-icons/md';
import './Management.css';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+91 9876543210',
    location: 'Mumbai, India',
    bio: 'Passionate learner exploring modern web development technologies.',
  });

  const initials = form.name
    ? form.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'DC';

  const roleLabel = {
    superadmin: 'Super Admin',
    admin: 'Admin',
    teacher: 'Teacher',
    student: 'Student',
  }[user?.role] || 'User';

  const stats = [
    { label: 'Courses', value: user?.role === 'student' ? '3' : '4' },
    { label: user?.role === 'teacher' ? 'Students' : 'Completed', value: user?.role === 'teacher' ? '156' : '2' },
    { label: 'Certificates', value: '2' },
    { label: 'Avg Score', value: '78%' },
  ];

  return (
    <div className="page-section">
      <div className="mgmt-header">
        <div className="mgmt-title-block">
          <h2>My Profile</h2>
          <p>Manage your personal information and account settings</p>
        </div>
        <button
          id="edit-profile-btn"
          className={`btn ${editing ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => {
            if (editing) updateUser({ ...user, name: form.name });
            setEditing(p => !p);
          }}
        >
          <MdEdit /> {editing ? 'Save Changes' : 'Edit Profile'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 20, alignItems: 'start' }}>
        {/* Left Card */}
        <div style={{
          background: 'var(--bg-surface)', border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)', padding: 28, display: 'flex',
          flexDirection: 'column', alignItems: 'center', gap: 16, textAlign: 'center'
        }}>
          <div style={{ position: 'relative' }}>
            <div className="avatar avatar-xl">{initials}</div>
            {editing && (
              <div style={{
                position: 'absolute', bottom: 0, right: 0,
                width: 28, height: 28, borderRadius: '50%',
                background: 'var(--brand-primary)', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.8rem', cursor: 'pointer', border: '2px solid var(--bg-surface)'
              }}>
                <MdEdit />
              </div>
            )}
          </div>

          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>
              {form.name}
            </h3>
            <span className={`badge ${user?.role === 'superadmin' ? 'badge-warning' : user?.role === 'admin' ? 'badge-info' : user?.role === 'teacher' ? 'badge-primary' : 'badge-success'}`}>
              {roleLabel}
            </span>
          </div>

          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            {form.bio}
          </p>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, width: '100%' }}>
            {stats.map((s, i) => (
              <div key={i} style={{
                background: 'var(--bg-surface-hover)', borderRadius: 'var(--radius-md)', padding: '12px 8px', textAlign: 'center'
              }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--brand-primary)' }}>{s.value}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div style={{ width: '100%', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { icon: <MdEmail />, text: form.email },
              { icon: <MdPhone />, text: form.phone },
              { icon: <MdLocationOn />, text: form.location },
              { icon: <MdCalendarMonth />, text: 'Joined Jan 2026' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.83rem', color: 'var(--text-secondary)' }}>
                <span style={{ color: 'var(--brand-primary)' }}>{item.icon}</span>
                {item.text}
              </div>
            ))}
          </div>
        </div>

        {/* Right Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Personal Info Form */}
          <div style={{
            background: 'var(--bg-surface)', border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)', padding: 24
          }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 20, color: 'var(--text-primary)' }}>
              Personal Information
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                { label: 'Full Name', key: 'name', type: 'text' },
                { label: 'Email', key: 'email', type: 'email' },
                { label: 'Phone', key: 'phone', type: 'tel' },
                { label: 'Location', key: 'location', type: 'text' },
              ].map(f => (
                <div key={f.key} className="input-group">
                  <label className="input-label">{f.label}</label>
                  <input
                    id={`profile-${f.key}`}
                    className="input"
                    type={f.type}
                    value={form[f.key]}
                    disabled={!editing}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  />
                </div>
              ))}
              <div className="input-group" style={{ gridColumn: 'span 2' }}>
                <label className="input-label">Bio</label>
                <textarea
                  id="profile-bio"
                  className="input"
                  rows={3}
                  value={form.bio}
                  disabled={!editing}
                  onChange={e => setForm(p => ({ ...p, bio: e.target.value }))}
                  style={{ resize: 'vertical' }}
                />
              </div>
            </div>
          </div>

          {/* Learning / Teaching history */}
          <div style={{
            background: 'var(--bg-surface)', border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)', padding: 24
          }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 16, color: 'var(--text-primary)' }}>
              {user?.role === 'teacher' ? 'Courses I Teach' : 'Enrolled Courses'}
            </h4>
            {[
              { name: 'React.js Complete Course', progress: 82, badge: 'badge-primary' },
              { name: 'Python for Beginners', progress: 65, badge: 'badge-success' },
              { name: 'Full Stack Development', progress: 45, badge: 'badge-warning' },
            ].map((c, i) => (
              <div key={i} style={{ padding: '12px 0', borderBottom: i < 2 ? '1px solid var(--border-color)' : 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>{c.name}</span>
                  <span className={`badge ${c.badge}`}>{c.progress}%</span>
                </div>
                <div className="progress-bar-wrapper">
                  <div className="progress-bar-fill" style={{ width: `${c.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
