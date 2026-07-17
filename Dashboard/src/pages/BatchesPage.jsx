import React, { useState, useMemo } from 'react';
import { Library, Search, Trash2, RefreshCw, AlertCircle } from 'lucide-react';
import { useApi, api } from '../hooks/useApi';
import './admin.shared.css';

function ConfirmDelete({ name, onConfirm, onCancel }) {
  return (
    <div className="confirm-overlay">
      <div className="confirm-box">
        <Trash2 size={36} color="#ef4444" style={{ marginBottom: 12 }} />
        <h3>Delete Batch?</h3>
        <p>Are you sure you want to delete <strong>{name}</strong>?</p>
        <div className="confirm-actions">
          <button className="btn-confirm-cancel" onClick={onCancel}>Cancel</button>
          <button className="btn-confirm-del" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}

export default function BatchesPage() {
  const { data, loading, error, refetch } = useApi('/batches');
  const [search, setSearch] = useState('');
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const batches = data?.data || data?.batches || [];

  const filtered = useMemo(() =>
    batches.filter(b =>
      b.batchName?.toLowerCase().includes(search.toLowerCase()) ||
      b.instructor?.toLowerCase().includes(search.toLowerCase()) ||
      b.track?.toLowerCase().includes(search.toLowerCase())
    ), [batches, search]);

  const handleDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await api.delete(`/batches/${toDelete._id}`);
      setToDelete(null);
      refetch();
    } catch {
      alert('Failed to delete batch.');
    } finally { setDeleting(false); }
  };

  const statusColor = (s) => s === 'Ongoing' ? 'bp-green' : s === 'Upcoming' ? 'bp-blue' : 'bp-gray';

  return (
    <div className="admin-page">
      {toDelete && <ConfirmDelete name={toDelete.batchName} onConfirm={handleDelete} onCancel={() => setToDelete(null)} />}

      <div className="page-top">
        <div className="page-top-left">
          <h1>🏫 Batches</h1>
          <p>Manage all teaching batches.</p>
        </div>
        <button className="btn-primary-sm" onClick={refetch}><RefreshCw size={15} /> Refresh</button>
      </div>

      <div className="summary-bar">
        <div className="summary-pill"><span className="pill-label">Total</span><span className="pill-value">{batches.length}</span></div>
        <div className="summary-pill"><span className="pill-label">Ongoing</span><span className="pill-value" style={{ color: '#10b981' }}>{batches.filter(b => b.status === 'Ongoing').length}</span></div>
        <div className="summary-pill"><span className="pill-label">Upcoming</span><span className="pill-value" style={{ color: '#3b82f6' }}>{batches.filter(b => b.status === 'Upcoming').length}</span></div>
      </div>

      <div className="search-bar">
        <div className="search-input-wrap">
          <Search size={16} className="search-icon" />
          <input className="search-input" placeholder="Search by name, instructor, or track..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="table-card">
        {loading ? (
          <div className="state-box"><RefreshCw size={32} className="state-spin" /><p>Loading batches...</p></div>
        ) : error ? (
          <div className="state-box"><AlertCircle size={32} /><h3>Failed to load</h3></div>
        ) : filtered.length === 0 ? (
          <div className="state-box"><Library size={48} /><h3>No batches found</h3></div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Batch Name</th>
                <th>Track</th>
                <th>Instructor</th>
                <th>Timings</th>
                <th>Students Enrolled</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(b => (
                <tr key={b._id}>
                  <td style={{ fontWeight: 600 }}>{b.batchName}</td>
                  <td><span className="badge-pill bp-purple">{b.track}</span></td>
                  <td>{b.instructor}</td>
                  <td style={{ fontSize: '0.85rem' }}>{b.timings}</td>
                  <td style={{ textAlign: 'center' }}>{b.enrolledStudents?.length || 0} / {b.maxSeats || 30}</td>
                  <td><span className={`badge-pill ${statusColor(b.status)}`}><span className="bp-dot" />{b.status}</span></td>
                  <td>
                    <button className="btn-danger-sm" onClick={() => setToDelete(b)} disabled={deleting}>
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
