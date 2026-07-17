import React, { useState, useMemo } from 'react';
import { Users, Search, Trash2, RefreshCw, AlertCircle, UserCheck } from 'lucide-react';
import { useApi, api } from '../hooks/useApi';
import './admin.shared.css';

function ConfirmDelete({ name, onConfirm, onCancel }) {
  return (
    <div className="confirm-overlay">
      <div className="confirm-box">
        <Trash2 size={36} color="#ef4444" style={{ marginBottom: 12 }} />
        <h3>Delete Student?</h3>
        <p>Are you sure you want to permanently delete <strong>{name}</strong>? This cannot be undone.</p>
        <div className="confirm-actions">
          <button className="btn-confirm-cancel" onClick={onCancel}>Cancel</button>
          <button className="btn-confirm-del" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}

export default function StudentsPage() {
  const { data, loading, error, refetch } = useApi('/students');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // all | pro | free
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const students = data?.students || [];

  const filtered = useMemo(() => {
    return students.filter(s => {
      const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase());
      const matchFilter = filter === 'all' || (filter === 'pro' ? s.hasPurchasedCourse : !s.hasPurchasedCourse);
      return matchSearch && matchFilter;
    });
  }, [students, search, filter]);

  const handleDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await api.delete(`/students/${toDelete._id}`);
      setToDelete(null);
      refetch();
    } catch {
      alert('Failed to delete student.');
    } finally { setDeleting(false); }
  };

  const totalPro = students.filter(s => s.hasPurchasedCourse).length;

  return (
    <div className="admin-page">
      {toDelete && (
        <ConfirmDelete
          name={toDelete.name}
          onConfirm={handleDelete}
          onCancel={() => setToDelete(null)}
        />
      )}

      <div className="page-top">
        <div className="page-top-left">
          <h1>👨‍🎓 Students</h1>
          <p>Manage all registered students on the platform.</p>
        </div>
        <button className="btn-primary-sm" onClick={refetch}><RefreshCw size={15} /> Refresh</button>
      </div>

      {/* Summary */}
      <div className="summary-bar">
        <div className="summary-pill"><span className="pill-label">Total</span><span className="pill-value">{students.length}</span></div>
        <div className="summary-pill"><span className="pill-label">PRO</span><span className="pill-value" style={{ color: '#3b82f6' }}>{totalPro}</span></div>
        <div className="summary-pill"><span className="pill-label">Free</span><span className="pill-value" style={{ color: '#94a3b8' }}>{students.length - totalPro}</span></div>
      </div>

      {/* Search & Filter */}
      <div className="search-bar">
        <div className="search-input-wrap">
          <Search size={16} className="search-icon" />
          <input
            className="search-input"
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        {['all', 'pro', 'free'].map(f => (
          <button
            key={f}
            className={`btn-icon-sm ${filter === f ? 'active-filter' : ''}`}
            onClick={() => setFilter(f)}
            style={filter === f ? { background: 'rgba(59,130,246,0.15)', borderColor: '#3b82f6', color: '#3b82f6' } : {}}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="table-card">
        {loading ? (
          <div className="state-box"><RefreshCw size={32} className="state-spin" /><p>Loading students...</p></div>
        ) : error ? (
          <div className="state-box"><AlertCircle size={32} /><h3>Failed to load</h3><p>Check backend connection</p></div>
        ) : filtered.length === 0 ? (
          <div className="state-box"><Users size={48} /><h3>No students found</h3><p>Try adjusting your search or filter.</p></div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Enrollment No.</th>
                <th>Status</th>
                <th>Courses Purchased</th>
                <th>Enrolled Batches</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s._id}>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar">{s.name?.charAt(0).toUpperCase()}</div>
                      <div className="user-info">
                        <span className="user-name">{s.name}</span>
                        <span className="user-email">{s.email}</span>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.82rem' }}>
                    {s.enrollmentNumber || <span style={{ color: '#6b7280' }}>—</span>}
                  </td>
                  <td>
                    {s.hasPurchasedCourse
                      ? <span className="badge-pill bp-blue"><span className="bp-dot" />PRO</span>
                      : <span className="badge-pill bp-gray"><span className="bp-dot" />Free</span>}
                  </td>
                  <td style={{ textAlign: 'center' }}>{s.purchasedCourses?.length || 0}</td>
                  <td style={{ textAlign: 'center' }}>{s.enrolledBatches?.length || 0}</td>
                  <td style={{ color: '#94a3b8', fontSize: '0.82rem' }}>
                    {new Date(s.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td>
                    <button className="btn-danger-sm" onClick={() => setToDelete(s)} disabled={deleting}>
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
