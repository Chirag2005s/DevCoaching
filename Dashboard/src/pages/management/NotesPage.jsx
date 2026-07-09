import { useState } from 'react';
import { MdAdd, MdDownload, MdDelete, MdSearch, MdPictureAsPdf, MdCode, MdFolder } from 'react-icons/md';
import './Management.css';

const DEMO_NOTES = [
  { id: 1, title: 'React Hooks Complete Guide', subject: 'React.js', author: 'John Smith', type: 'pdf', size: '2.4 MB', date: 'Jul 5, 2026', emoji: '📕', color: 'rgba(239,68,68,0.1)', textColor: '#ef4444' },
  { id: 2, title: 'Python Data Structures', subject: 'Python', author: 'Sarah Lee', type: 'pdf', size: '1.8 MB', date: 'Jul 3, 2026', emoji: '📗', color: 'rgba(34,197,94,0.1)', textColor: '#22c55e' },
  { id: 3, title: 'Node.js REST API Slides', subject: 'Backend', author: 'Mike Chen', type: 'ppt', size: '4.1 MB', date: 'Jun 28, 2026', emoji: '📙', color: 'rgba(245,158,11,0.1)', textColor: '#f59e0b' },
  { id: 4, title: 'UI/UX Figma Resources', subject: 'UI/UX', author: 'Priya Sharma', type: 'zip', size: '12.5 MB', date: 'Jun 25, 2026', emoji: '📦', color: 'rgba(108,99,255,0.1)', textColor: '#6c63ff' },
  { id: 5, title: 'JavaScript ES2024 Reference', subject: 'Full Stack', author: 'Alex Kumar', type: 'pdf', size: '3.2 MB', date: 'Jun 20, 2026', emoji: '📘', color: 'rgba(56,189,248,0.1)', textColor: '#38bdf8' },
  { id: 6, title: 'MongoDB Cheatsheet', subject: 'Backend', author: 'Mike Chen', type: 'pdf', size: '0.9 MB', date: 'Jun 18, 2026', emoji: '📒', color: 'rgba(34,197,94,0.1)', textColor: '#22c55e' },
];

const NotesPage = () => {
  const [search, setSearch] = useState('');
  const [notes] = useState(DEMO_NOTES);

  const filtered = notes.filter(n =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.subject.toLowerCase().includes(search.toLowerCase())
  );

  const typeIcon = (type) => {
    if (type === 'pdf') return <MdPictureAsPdf />;
    if (type === 'ppt') return <MdFolder />;
    if (type === 'zip') return <MdCode />;
    return <MdFolder />;
  };

  return (
    <div className="page-section">
      <div className="mgmt-header">
        <div className="mgmt-title-block">
          <h2>Notes Management</h2>
          <p>Upload, manage, and share course materials and resources</p>
        </div>
        <button id="upload-note-btn" className="btn btn-primary">
          <MdAdd /> Upload Note
        </button>
      </div>

      <div className="filter-bar">
        <div className="filter-search-wrap">
          <MdSearch className="filter-search-icon" />
          <input
            id="note-search-input"
            className="filter-search-input"
            placeholder="Search notes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select id="note-subject-filter" className="filter-select">
          <option>All Subjects</option>
          <option>React.js</option>
          <option>Python</option>
          <option>Backend</option>
          <option>UI/UX</option>
        </select>
        <select id="note-type-filter" className="filter-select">
          <option>All Types</option>
          <option>pdf</option>
          <option>ppt</option>
          <option>zip</option>
        </select>
      </div>

      <div className="card-grid">
        {filtered.map(note => (
          <div key={note.id} className="note-card">
            <div className="note-icon" style={{ background: note.color, color: note.textColor }}>
              {typeIcon(note.type)}
            </div>
            <div className="note-title">{note.title}</div>
            <div className="note-meta">
              {note.subject} · {note.author} · {note.size} · {note.date}
            </div>
            <div className="note-actions">
              <button className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                <MdDownload /> Download
              </button>
              <button className="btn btn-danger btn-sm">
                <MdDelete />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotesPage;
