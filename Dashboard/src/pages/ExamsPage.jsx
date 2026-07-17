import React, { useState, useMemo } from 'react';
import { FileText, Search, Trash2, RefreshCw, AlertCircle, Plus, X, Save } from 'lucide-react';
import { useApi, api } from '../hooks/useApi';
import './admin.shared.css';

function ConfirmDelete({ name, onConfirm, onCancel }) {
  return (
    <div className="confirm-overlay">
      <div className="confirm-box">
        <Trash2 size={36} color="#ef4444" style={{ marginBottom: 12 }} />
        <h3>Delete Exam?</h3>
        <p>Are you sure you want to delete <strong>{name}</strong>?</p>
        <div className="confirm-actions">
          <button className="btn-confirm-cancel" onClick={onCancel}>Cancel</button>
          <button className="btn-confirm-del" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}

function CreateExamModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    duration: 60,
    totalMarks: 100
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Add one mock question as it is required by the backend
    const payload = {
      ...formData,
      questions: [{
        questionText: "Sample Mock Question?",
        options: ["Option A", "Option B", "Option C", "Option D"],
        correctOptionIndex: 0,
        explanation: "This is an auto-generated sample question."
      }]
    };

    try {
      await api.post('/exams', payload);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create exam');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="confirm-overlay">
      <div className="confirm-box" style={{ maxWidth: '500px', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0 }}>Create Mock Exam</h3>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Exam Title</label>
            <input 
              required
              style={{ padding: '10px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'white' }}
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})}
              placeholder="e.g. Midterm Physics Mock"
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Subject</label>
            <input 
              required
              style={{ padding: '10px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'white' }}
              value={formData.subject} 
              onChange={e => setFormData({...formData, subject: e.target.value})}
              placeholder="e.g. Physics"
            />
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Duration (mins)</label>
              <input 
                type="number"
                required
                min="1"
                style={{ padding: '10px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'white' }}
                value={formData.duration} 
                onChange={e => setFormData({...formData, duration: Number(e.target.value)})}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total Marks</label>
              <input 
                type="number"
                required
                min="1"
                style={{ padding: '10px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'white' }}
                value={formData.totalMarks} 
                onChange={e => setFormData({...formData, totalMarks: Number(e.target.value)})}
              />
            </div>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '6px' }}>
            Note: This will create an exam with 1 sample mock question. You can add more questions later.
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '10px', justifyContent: 'flex-end' }}>
            <button type="button" className="btn-secondary" onClick={onClose} style={{ padding: '10px 16px', background: 'transparent', border: '1px solid var(--border-color)', color: 'white', borderRadius: '6px' }}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading} style={{ padding: '10px 16px', background: 'var(--accent-primary)', border: 'none', color: 'white', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Save size={16} />
              {loading ? 'Saving...' : 'Create Mock Exam'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ExamsPage() {
  const { data, loading, error, refetch } = useApi('/exams');
  const [search, setSearch] = useState('');
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  const exams = data?.exams || [];

  const filtered = useMemo(() =>
    exams.filter(e =>
      e.title?.toLowerCase().includes(search.toLowerCase()) ||
      e.subject?.toLowerCase().includes(search.toLowerCase())
    ), [exams, search]);

  const handleDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await api.delete(`/exams/${toDelete._id}`);
      setToDelete(null);
      refetch();
    } catch {
      alert('Failed to delete exam.');
    } finally { setDeleting(false); }
  };

  return (
    <div className="admin-page">
      {toDelete && <ConfirmDelete name={toDelete.title} onConfirm={handleDelete} onCancel={() => setToDelete(null)} />}

      <div className="page-top">
        <div className="page-top-left">
          <h1>📝 Exams</h1>
          <p>Manage examinations and quizzes.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-primary-sm" onClick={refetch}><RefreshCw size={15} /> Refresh</button>
          <button className="btn-primary-sm" style={{ background: 'var(--success)' }} onClick={() => setShowCreate(true)}>
            <Plus size={15} /> Create Mock Exam
          </button>
        </div>
      </div>

      {showCreate && (
        <CreateExamModal 
          onClose={() => setShowCreate(false)} 
          onSuccess={() => {
            setShowCreate(false);
            refetch();
          }} 
        />
      )}

      <div className="summary-bar">
        <div className="summary-pill"><span className="pill-label">Total Exams</span><span className="pill-value">{exams.length}</span></div>
      </div>

      <div className="search-bar">
        <div className="search-input-wrap">
          <Search size={16} className="search-icon" />
          <input className="search-input" placeholder="Search by title or subject..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="table-card">
        {loading ? (
          <div className="state-box"><RefreshCw size={32} className="state-spin" /><p>Loading exams...</p></div>
        ) : error ? (
          <div className="state-box"><AlertCircle size={32} /><h3>Failed to load</h3></div>
        ) : filtered.length === 0 ? (
          <div className="state-box"><FileText size={48} /><h3>No exams found</h3></div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Subject</th>
                <th>Duration (mins)</th>
                <th>Questions</th>
                <th>Total Marks</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(e => (
                <tr key={e._id}>
                  <td style={{ fontWeight: 600 }}>{e.title}</td>
                  <td><span className="badge-pill bp-purple">{e.subject}</span></td>
                  <td>{e.duration}</td>
                  <td style={{ textAlign: 'center' }}>{e.questions?.length || 0}</td>
                  <td style={{ textAlign: 'center' }}>{e.totalMarks || 100}</td>
                  <td style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                    {new Date(e.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <button className="btn-danger-sm" onClick={() => setToDelete(e)} disabled={deleting}>
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
