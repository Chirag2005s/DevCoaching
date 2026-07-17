import React, { useState, useMemo } from 'react';
import { GraduationCap, Search, Trash2, RefreshCw, AlertCircle, Star } from 'lucide-react';
import { useApi, api } from '../hooks/useApi';
import './admin.shared.css';

function ConfirmDelete({ name, onConfirm, onCancel }) {
  return (
    <div className="confirm-overlay">
      <div className="confirm-box">
        <Trash2 size={36} color="#ef4444" style={{ marginBottom: 12 }} />
        <h3>Delete Teacher?</h3>
        <p>Are you sure you want to delete <strong>{name}</strong>? This cannot be undone.</p>
        <div className="confirm-actions">
          <button className="btn-confirm-cancel" onClick={onCancel}>Cancel</button>
          <button className="btn-confirm-del" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}

export default function TeachersPage() {
  const { data, loading, error, refetch } = useApi('/Teacher');
  const [search, setSearch] = useState('');
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const teachers = data?.teachers || [];

  const filtered = useMemo(() =>
    teachers.filter(t =>
      t.Name?.toLowerCase().includes(search.toLowerCase()) ||
      t.Email?.toLowerCase().includes(search.toLowerCase()) ||
      t.Title?.toLowerCase().includes(search.toLowerCase())
    ), [teachers, search]);

  const handleDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await api.delete(`/Teacher/${toDelete._id}`);
      setToDelete(null);
      refetch();
    } catch {
      alert('Failed to delete teacher.');
    } finally { setDeleting(false); }
  };

  const activeCount = teachers.filter(t => t.Status === 'active').length;
  const avgRating = teachers.length > 0
    ? (teachers.reduce((s, t) => s + (t.Rating || 0), 0) / teachers.length).toFixed(1)
    : '—';

  return (
    <div className="admin-page">
      {toDelete && <ConfirmDelete name={toDelete.Name} onConfirm={handleDelete} onCancel={() => setToDelete(null)} />}

      <div className="page-top">
        <div className="page-top-left">
          <h1>👨‍🏫 Teachers</h1>
          <p>Manage your faculty and teaching staff.</p>
        </div>
        <button className="btn-primary-sm" onClick={refetch}><RefreshCw size={15} /> Refresh</button>
      </div>

      <div className="summary-bar">
        <div className="summary-pill"><span className="pill-label">Total</span><span className="pill-value">{teachers.length}</span></div>
        <div className="summary-pill"><span className="pill-label">Active</span><span className="pill-value" style={{ color: '#10b981' }}>{activeCount}</span></div>
        <div className="summary-pill"><span className="pill-label">Avg Rating</span><span className="pill-value" style={{ color: '#f59e0b' }}>{avgRating} ⭐</span></div>
      </div>

      <div className="search-bar">
        <div className="search-input-wrap">
          <Search size={16} className="search-icon" />
          <input className="search-input" placeholder="Search by name, email, or title..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="table-card">
        {loading ? (
          <div className="state-box"><RefreshCw size={32} className="state-spin" /><p>Loading teachers...</p></div>
        ) : error ? (
          <div className="state-box"><AlertCircle size={32} /><h3>Failed to load</h3></div>
        ) : filtered.length === 0 ? (
          <div className="state-box"><GraduationCap size={48} /><h3>No teachers found</h3></div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Teacher</th>
                <th>ID</th>
                <th>Qualification</th>
                <th>Experience</th>
                <th>Rating</th>
                <th>Status</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t._id}>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar green">
                        {t.Logo
                          ? <img src={t.Logo} alt={t.Name} />
                          : t.Name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="user-info">
                        <span className="user-name">{t.Name}</span>
                        <span className="user-email">{t.Email}</span>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.82rem' }}>{t.ID}</td>
                  <td><span className="badge-pill bp-purple">{t.Qualification}</span></td>
                  <td>{t.Exprience}</td>
                  <td>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Star size={14} fill="#f59e0b" color="#f59e0b" />
                      <span style={{ fontWeight: 600 }}>{t.Rating}</span>
                    </span>
                  </td>
                  <td>
                    {t.Status === 'active'
                      ? <span className="badge-pill bp-green"><span className="bp-dot" />Active</span>
                      : <span className="badge-pill bp-red"><span className="bp-dot" />Inactive</span>}
                  </td>
                  <td style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{t.PhoneNo}</td>
                  <td>
                    <button className="btn-danger-sm" onClick={() => setToDelete(t)} disabled={deleting}>
                      <Trash2 size={14} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
