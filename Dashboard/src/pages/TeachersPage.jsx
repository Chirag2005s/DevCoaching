import React, { useState, useMemo } from 'react';
import {
  GraduationCap, Search, Trash2, RefreshCw, AlertCircle,
  Star, Phone, Mail, BadgeCheck, Briefcase, ToggleLeft,
  ToggleRight, ShieldCheck, ShieldOff, Users, Award,
} from 'lucide-react';
import { useApi, api } from '../hooks/useApi';
import './admin.shared.css';
import './TeachersPage.css';

// ── Confirm Delete Modal ───────────────────────────────────────────────────────
function ConfirmDelete({ name, onConfirm, onCancel, loading }) {
  return (
    <div className="confirm-overlay">
      <div className="confirm-box tcp-confirm-box">
        <div className="tcp-confirm-icon">
          <Trash2 size={28} />
        </div>
        <h3>Delete Teacher?</h3>
        <p>
          Are you sure you want to delete <strong>{name}</strong>?<br />
          This action <strong>cannot be undone</strong>.
        </p>
        <div className="confirm-actions">
          <button className="btn-confirm-cancel" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
          <button className="btn-confirm-del" onClick={onConfirm} disabled={loading}>
            {loading ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Star Rating Renderer ───────────────────────────────────────────────────────
function StarRating({ value }) {
  const full = Math.floor(value || 0);
  return (
    <div className="tcp-stars">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          size={13}
          fill={i <= full ? '#f59e0b' : 'none'}
          color={i <= full ? '#f59e0b' : 'rgba(255,255,255,0.2)'}
        />
      ))}
      <span className="tcp-rating-num">{Number(value || 0).toFixed(1)}</span>
    </div>
  );
}

// ── Teacher Card ───────────────────────────────────────────────────────────────
function TeacherCard({ teacher, onDelete, onToggleStatus, toggling }) {
  const isActive = teacher.Status === 'active';

  return (
    <div className={`tcp-card ${isActive ? 'tcp-card-active' : 'tcp-card-inactive'}`}>
      {/* Status glow strip */}
      <div className={`tcp-card-strip ${isActive ? 'strip-active' : 'strip-inactive'}`} />

      {/* Header: Avatar + Name + Status badge */}
      <div className="tcp-card-header">
        <div className="tcp-avatar-wrap">
          {teacher.Logo ? (
            <img src={teacher.Logo} alt={teacher.Name} className="tcp-avatar-img" />
          ) : (
            <div className="tcp-avatar-fallback">
              {(teacher.Name || '?').charAt(0).toUpperCase()}
            </div>
          )}
          <div className={`tcp-avatar-ring ${isActive ? 'ring-active' : 'ring-inactive'}`} />
        </div>

        <div className="tcp-card-title">
          <h3 className="tcp-name">{teacher.Name}</h3>
          <p className="tcp-title">{teacher.Title}</p>
          <StarRating value={teacher.Rating} />
        </div>

        <span className={`tcp-status-badge ${isActive ? 'tcp-badge-active' : 'tcp-badge-inactive'}`}>
          {isActive ? <ShieldCheck size={11} /> : <ShieldOff size={11} />}
          {isActive ? 'Active' : 'Inactive'}
        </span>
      </div>

      {/* Divider */}
      <div className="tcp-divider" />

      {/* Meta info */}
      <div className="tcp-meta-grid">
        <div className="tcp-meta-item">
          <BadgeCheck size={13} className="tcp-meta-icon" />
          <span className="tcp-meta-label">ID</span>
          <span className="tcp-meta-value mono">{teacher.ID || '—'}</span>
        </div>
        <div className="tcp-meta-item">
          <GraduationCap size={13} className="tcp-meta-icon" />
          <span className="tcp-meta-label">Qualification</span>
          <span className="tcp-meta-value">{teacher.Qualification}</span>
        </div>
        <div className="tcp-meta-item">
          <Briefcase size={13} className="tcp-meta-icon" />
          <span className="tcp-meta-label">Experience</span>
          <span className="tcp-meta-value">{teacher.Exprience || '—'}</span>
        </div>
        <div className="tcp-meta-item">
          <Award size={13} className="tcp-meta-icon" />
          <span className="tcp-meta-label">Gender</span>
          <span className="tcp-meta-value">{teacher.Gender || '—'}</span>
        </div>
        <div className="tcp-meta-item full">
          <Mail size={13} className="tcp-meta-icon" />
          <span className="tcp-meta-label">Email</span>
          <span className="tcp-meta-value">{teacher.Email || '—'}</span>
        </div>
        <div className="tcp-meta-item">
          <Phone size={13} className="tcp-meta-icon" />
          <span className="tcp-meta-label">Phone</span>
          <span className="tcp-meta-value mono">{teacher.PhoneNo || '—'}</span>
        </div>
      </div>

      {/* Bio snippet */}
      {teacher.Discprition && (
        <p className="tcp-bio" title={teacher.Discprition}>
          {teacher.Discprition}
        </p>
      )}

      {/* Action buttons */}
      <div className="tcp-card-actions">
        {/* ── Active / Inactive Toggle ── */}
        <button
          className={`tcp-toggle-btn ${isActive ? 'tcp-toggle-deactivate' : 'tcp-toggle-activate'}`}
          onClick={() => onToggleStatus(teacher)}
          disabled={toggling === teacher._id}
          title={isActive ? 'Set Inactive' : 'Set Active'}
        >
          {toggling === teacher._id ? (
            <RefreshCw size={14} className="state-spin" />
          ) : isActive ? (
            <ToggleRight size={16} />
          ) : (
            <ToggleLeft size={16} />
          )}
          <span>{toggling === teacher._id ? 'Updating…' : isActive ? 'Set Inactive' : 'Set Active'}</span>
        </button>

        {/* ── Delete ── */}
        <button
          className="btn-danger-sm tcp-delete-btn"
          onClick={() => onDelete(teacher)}
          disabled={toggling === teacher._id}
        >
          <Trash2 size={14} />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function TeachersPage() {
  const { data, loading, error, refetch } = useApi('/Teacher');

  const [search,   setSearch]   = useState('');
  const [filter,   setFilter]   = useState('all');   // 'all' | 'active' | 'inactive'
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState(null);    // teacher._id being toggled
  const [toast,    setToast]    = useState(null);

  const teachers = data?.teachers || [];

  // Derived stats
  const activeCount   = teachers.filter(t => t.Status === 'active').length;
  const inactiveCount = teachers.length - activeCount;
  const avgRating     = teachers.length > 0
    ? (teachers.reduce((s, t) => s + (t.Rating || 0), 0) / teachers.length).toFixed(1)
    : '—';

  const filtered = useMemo(() => {
    let list = teachers;
    if (filter === 'active')   list = list.filter(t => t.Status === 'active');
    if (filter === 'inactive') list = list.filter(t => t.Status !== 'active');
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(t =>
        t.Name?.toLowerCase().includes(q) ||
        t.Email?.toLowerCase().includes(q) ||
        t.Title?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [teachers, search, filter]);

  // Toast helper
  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Delete handler
  const handleDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await api.delete(`/Teacher/${toDelete._id}`);
      setToDelete(null);
      refetch();
      showToast(`"${toDelete.Name}" deleted successfully.`);
    } catch {
      showToast('Failed to delete teacher.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  // Toggle Active / Inactive
  const handleToggleStatus = async (teacher) => {
    const newStatus = teacher.Status === 'active' ? 'inactive' : 'active';
    setToggling(teacher._id);
    try {
      await api.patch(`/Teacher/${teacher._id}`, { Status: newStatus });
      refetch();
      showToast(
        `${teacher.Name} is now ${newStatus}.`,
        newStatus === 'active' ? 'success' : 'warn'
      );
    } catch {
      showToast('Failed to update status.', 'error');
    } finally {
      setToggling(null);
    }
  };

  return (
    <div className="admin-page">
      {/* ── Confirm Delete Modal ── */}
      {toDelete && (
        <ConfirmDelete
          name={toDelete.Name}
          onConfirm={handleDelete}
          onCancel={() => setToDelete(null)}
          loading={deleting}
        />
      )}

      {/* ── Toast ── */}
      {toast && (
        <div className={`tcp-toast tcp-toast-${toast.type}`}>
          {toast.type === 'success' ? <ShieldCheck size={15} /> : <AlertCircle size={15} />}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* ── Page Header ── */}
      <div className="page-top">
        <div className="page-top-left">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="tcp-page-icon">
              <GraduationCap size={22} />
            </div>
            <div>
              <h1>Teachers</h1>
              <p>Manage your faculty, toggle availability, and monitor ratings.</p>
            </div>
          </div>
        </div>
        <button className="btn-primary-sm" onClick={refetch} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* ── Stats Bar ── */}
      <div className="tcp-stats-row">
        <div className="tcp-stat-pill tcp-stat-blue">
          <Users size={16} />
          <div>
            <span className="tcp-stat-val">{teachers.length}</span>
            <span className="tcp-stat-lbl">Total Teachers</span>
          </div>
        </div>
        <div className="tcp-stat-pill tcp-stat-green">
          <ShieldCheck size={16} />
          <div>
            <span className="tcp-stat-val">{activeCount}</span>
            <span className="tcp-stat-lbl">Active</span>
          </div>
        </div>
        <div className="tcp-stat-pill tcp-stat-red">
          <ShieldOff size={16} />
          <div>
            <span className="tcp-stat-val">{inactiveCount}</span>
            <span className="tcp-stat-lbl">Inactive</span>
          </div>
        </div>
        <div className="tcp-stat-pill tcp-stat-amber">
          <Star size={16} />
          <div>
            <span className="tcp-stat-val">{avgRating}</span>
            <span className="tcp-stat-lbl">Avg Rating</span>
          </div>
        </div>
      </div>

      {/* ── Filters Row ── */}
      <div className="tcp-filter-row">
        {/* Search */}
        <div className="search-input-wrap tcp-search">
          <Search size={16} className="search-icon" />
          <input
            className="search-input"
            placeholder="Search by name, email, or title…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Status filter tabs */}
        <div className="tcp-filter-tabs">
          {[
            { key: 'all',      label: `All (${teachers.length})` },
            { key: 'active',   label: `Active (${activeCount})` },
            { key: 'inactive', label: `Inactive (${inactiveCount})` },
          ].map(tab => (
            <button
              key={tab.key}
              className={`tcp-tab ${filter === tab.key ? 'tcp-tab-active' : ''}`}
              onClick={() => setFilter(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Cards Grid ── */}
      {loading ? (
        <div className="state-box">
          <RefreshCw size={34} className="state-spin" style={{ color: 'var(--accent-primary)' }} />
          <h3>Loading teachers…</h3>
          <p>Fetching faculty data from server.</p>
        </div>
      ) : error ? (
        <div className="state-box" style={{ color: 'var(--danger)' }}>
          <AlertCircle size={40} />
          <h3>Failed to load teachers</h3>
          <p>Check your server connection.</p>
          <button className="btn-primary-sm" onClick={refetch} style={{ marginTop: 10 }}>Retry</button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="state-box">
          <GraduationCap size={48} style={{ opacity: 0.3 }} />
          <h3>No teachers found</h3>
          <p>{search ? 'Try a different search term.' : 'No faculty members added yet.'}</p>
        </div>
      ) : (
        <div className="tcp-grid">
          {filtered.map(teacher => (
            <TeacherCard
              key={teacher._id}
              teacher={teacher}
              onDelete={setToDelete}
              onToggleStatus={handleToggleStatus}
              toggling={toggling}
            />
          ))}
        </div>
      )}
    </div>
  );
}
