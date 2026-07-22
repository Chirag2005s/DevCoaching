import React from 'react';
import { User, Mail, Shield, LogOut, Key, Edit, Settings } from 'lucide-react';
import { useAuth } from '../hooks/AuthContext';
import { useNavigate } from 'react-router-dom';
import './admin.shared.css';

export default function AdminProfile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="admin-page">
      <div className="page-top">
        <div className="page-top-left">
          <h1>👤 Admin Profile</h1>
          <p>Manage your account settings and active sessions.</p>
        </div>
      </div>

      <div className="profile-container" style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginTop: '12px' }}>
        
        {/* User Details Card */}
        <div className="card" style={{ flex: '1', minWidth: '300px' }}>
          <h3 style={{ marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={20} color="var(--accent-primary)" />
            Account Details
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.5rem', fontWeight: 'bold' }}>
                {user?.name?.charAt(0)?.toUpperCase() || 'A'}
              </div>
              <div>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '4px' }}>{user?.name || 'Administrator'}</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '4px' }}>
                  <Mail size={14} />
                  {user?.email || 'admin@example.com'}
                </div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '600', marginTop: '8px' }}>
                  <Shield size={12} />
                  Super Admin
                </div>
              </div>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Account Status</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500' }}>
                <span className="bp-dot" style={{ background: 'var(--success)', display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%' }}></span>
                Active and Verified
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons Card */}
        <div className="card" style={{ flex: '1', minWidth: '300px' }}>
          <h3 style={{ marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Settings size={20} color="var(--accent-primary)" />
            Quick Actions
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', cursor: 'pointer', textAlign: 'left', transition: 'background 0.2s' }}>
              <Edit size={18} color="var(--accent-primary)" />
              <div>
                <div style={{ fontWeight: '500', fontSize: '0.95rem' }}>Edit Profile</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Update your name and personal info</div>
              </div>
            </button>

            <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', cursor: 'pointer', textAlign: 'left', transition: 'background 0.2s' }}>
              <Key size={18} color="#eab308" />
              <div>
                <div style={{ fontWeight: '500', fontSize: '0.95rem' }}>Change Password</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Update your security credentials</div>
              </div>
            </button>

            <div style={{ marginTop: 'auto', paddingTop: '24px' }}>
              <button 
                onClick={handleLogout}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px 16px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', color: 'var(--danger)', cursor: 'pointer', width: '100%', fontWeight: '600', transition: 'all 0.2s' }}
                onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <LogOut size={18} />
                Secure Logout
              </button>
            </div>
          </div>
        </div>

        {/* Security Settings Card (v4.0.0 Feature) */}
        <div className="card" style={{ flex: '1', minWidth: '300px' }}>
          <h3 style={{ marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={20} color="var(--success)" />
            Security & Access
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* RBAC */}
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ fontWeight: '500' }}>Role-Based Access Control (RBAC)</div>
                <div style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' }}>Super Admin</div>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>You have full access to all modules including user management, billing, and system settings.</p>
            </div>

            {/* 2FA Toggle */}
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  Two-Factor Authentication
                  <span style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', padding: '2px 6px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 'bold' }}>Enabled</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Add an extra layer of security to your account.</p>
              </div>
              <button style={{ background: 'var(--sidebar-bg)', border: '1px solid var(--accent-primary)', color: 'var(--accent-primary)', padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer' }}>
                Configure
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
