import React, { useState, useMemo } from 'react';
import { BookOpen, Search, Trash2, RefreshCw, AlertCircle } from 'lucide-react';
import { useApi, api } from '../hooks/useApi';
import './admin.shared.css';

function ConfirmDelete({ name, onConfirm, onCancel }) {
  return (
    <div className="confirm-overlay">
      <div className="confirm-box">
        <Trash2 size={36} color="#ef4444" style={{ marginBottom: 12 }} />
        <h3>Delete Course?</h3>
        <p>Are you sure you want to delete <strong>{name}</strong>? This cannot be undone.</p>
        <div className="confirm-actions">
          <button className="btn-confirm-cancel" onClick={onCancel}>Cancel</button>
          <button className="btn-confirm-del" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}

export default function CoursesPage() {
  const { data, loading, error, refetch } = useApi('/Course');
  const [search, setSearch] = useState('');
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const courses = data?.course || [];

  const filtered = useMemo(() =>
    courses.filter(c =>
      c.courseName?.toLowerCase().includes(search.toLowerCase()) ||
      c.Language?.toLowerCase().includes(search.toLowerCase())
    ), [courses, search]);

  const handleDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await api.delete(`/Course/${toDelete._id}`);
      setToDelete(null);
      refetch();
    } catch {
      alert('Failed to delete course.');
    } finally { setDeleting(false); }
  };

  const freeCount = courses.filter(c => c.CourseStatus === 'Free').length;

  return (
    <div className="admin-page">
      {toDelete && <ConfirmDelete name={toDelete.courseName} onConfirm={handleDelete} onCancel={() => setToDelete(null)} />}

      <div className="page-top">
        <div className="page-top-left">
          <h1>📚 Courses</h1>
          <p>Manage all course offerings.</p>
        </div>
        <button className="btn-primary-sm" onClick={refetch}><RefreshCw size={15} /> Refresh</button>
      </div>

      <div className="summary-bar">
        <div className="summary-pill"><span className="pill-label">Total</span><span className="pill-value">{courses.length}</span></div>
        <div className="summary-pill"><span className="pill-label">Paid</span><span className="pill-value" style={{ color: '#10b981' }}>{courses.length - freeCount}</span></div>
        <div className="summary-pill"><span className="pill-label">Free</span><span className="pill-value" style={{ color: '#3b82f6' }}>{freeCount}</span></div>
      </div>

      <div className="search-bar">
        <div className="search-input-wrap">
          <Search size={16} className="search-icon" />
          <input className="search-input" placeholder="Search by course name or track..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="table-card">
        {loading ? (
          <div className="state-box"><RefreshCw size={32} className="state-spin" /><p>Loading courses...</p></div>
        ) : error ? (
          <div className="state-box"><AlertCircle size={32} /><h3>Failed to load</h3></div>
        ) : filtered.length === 0 ? (
          <div className="state-box"><BookOpen size={48} /><h3>No courses found</h3></div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Course Name</th>
                <th>Track</th>
                <th>Type</th>
                <th>Price</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c._id}>
                  <td style={{ fontWeight: 600 }}>{c.courseName}</td>
                  <td><span className="badge-pill bp-blue">{c.Language}</span></td>
                  <td>
                    {c.CourseStatus === 'Paid'
                      ? <span className="badge-pill bp-amber">Paid</span>
                      : <span className="badge-pill bp-green">Free</span>}
                  </td>
                  <td>{c.Price === 0 ? 'Free' : `₹${c.Price}`}</td>
                  <td style={{ maxWidth: 300, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {c.Disp}
                  </td>
                  <td>
                    <button className="btn-danger-sm" onClick={() => setToDelete(c)} disabled={deleting}>
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
