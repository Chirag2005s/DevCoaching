import React, { useState, useMemo } from 'react';
import { Mail, Search, RefreshCw, AlertCircle } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import './admin.shared.css';

export default function ContactPage() {
  const { data, loading, error, refetch } = useApi('/Contact');
  const [search, setSearch] = useState('');

  const messages = data?.messages || [];

  const filtered = useMemo(() =>
    messages.filter(m =>
      m.name?.toLowerCase().includes(search.toLowerCase()) ||
      m.email?.toLowerCase().includes(search.toLowerCase()) ||
      m.subject?.toLowerCase().includes(search.toLowerCase())
    ), [messages, search]);

  return (
    <div className="admin-page">
      <div className="page-top">
        <div className="page-top-left">
          <h1>✉️ Contact Inquiries</h1>
          <p>Messages received from the website contact form.</p>
        </div>
        <button className="btn-primary-sm" onClick={refetch}><RefreshCw size={15} /> Refresh</button>
      </div>

      <div className="summary-bar">
        <div className="summary-pill"><span className="pill-label">Total Messages</span><span className="pill-value">{messages.length}</span></div>
      </div>

      <div className="search-bar">
        <div className="search-input-wrap">
          <Search size={16} className="search-icon" />
          <input className="search-input" placeholder="Search by name, email, or subject..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="table-card">
        {loading ? (
          <div className="state-box"><RefreshCw size={32} className="state-spin" /><p>Loading messages...</p></div>
        ) : error ? (
          <div className="state-box"><AlertCircle size={32} /><h3>Failed to load</h3></div>
        ) : filtered.length === 0 ? (
          <div className="state-box"><Mail size={48} /><h3>No messages found</h3></div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Sender</th>
                <th>Subject</th>
                <th>Message</th>
                <th>Received On</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(m => (
                <tr key={m._id}>
                  <td>
                    <div className="user-info">
                      <span className="user-name">{m.name}</span>
                      <span className="user-email">{m.email}</span>
                    </div>
                  </td>
                  <td><span className="badge-pill bp-blue">{m.subject}</span></td>
                  <td style={{ maxWidth: 400, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {m.message}
                  </td>
                  <td style={{ color: '#94a3b8', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                    {new Date(m.createdAt).toLocaleString()}
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
