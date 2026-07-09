import { useState } from 'react';
import { MdAdd, MdEdit, MdDelete, MdSearch, MdStar, MdPeople } from 'react-icons/md';
import './Management.css';

const DEMO_TEACHERS = [
  { id: 1, name: 'John Smith', title: 'Senior React Developer', experience: '5 yrs', rating: 4.9, students: 120, courses: 3, qualification: 'B.Tech CSE', status: 'active' },
  { id: 2, name: 'Sarah Lee', title: 'Python & Data Science Expert', experience: '7 yrs', rating: 4.8, students: 98, courses: 2, qualification: 'MCA', status: 'active' },
  { id: 3, name: 'Mike Chen', title: 'Full Stack Architect', experience: '6 yrs', rating: 4.7, students: 85, courses: 4, qualification: 'B.Tech CSE', status: 'active' },
  { id: 4, name: 'Priya Sharma', title: 'UI/UX Design Lead', experience: '4 yrs', rating: 4.9, students: 70, courses: 2, qualification: 'BCA', status: 'inactive' },
  { id: 5, name: 'Alex Kumar', title: 'Backend & DevOps Engineer', experience: '8 yrs', rating: 4.6, students: 60, courses: 3, qualification: 'MCA', status: 'active' },
];

const TeachersPage = () => {
  const [search, setSearch] = useState('');
  const [teachers] = useState(DEMO_TEACHERS);

  const filtered = teachers.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.title.toLowerCase().includes(search.toLowerCase())
  );

  const initials = (name) => name.split(' ').map(n => n[0]).join('').slice(0, 2);

  return (
    <div className="page-section">
      <div className="mgmt-header">
        <div className="mgmt-title-block">
          <h2>Teacher Management</h2>
          <p>Manage all teaching staff and their assigned courses</p>
        </div>
        <button id="add-teacher-btn" className="btn btn-primary">
          <MdAdd /> Add Teacher
        </button>
      </div>

      <div className="filter-bar">
        <div className="filter-search-wrap">
          <MdSearch className="filter-search-icon" />
          <input
            id="teacher-search-input"
            className="filter-search-input"
            placeholder="Search teachers..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select id="teacher-status-filter" className="filter-select">
          <option>All Status</option>
          <option>active</option>
          <option>inactive</option>
        </select>
        <select id="teacher-qual-filter" className="filter-select">
          <option>All Qualifications</option>
          <option>BCA</option>
          <option>MCA</option>
          <option>B.Tech CSE</option>
        </select>
      </div>

      <div className="card-grid">
        {filtered.map(t => (
          <div key={t.id} className="teacher-card">
            <div className="teacher-card-avatar">{initials(t.name)}</div>
            <div>
              <div className="teacher-card-name">{t.name}</div>
              <div className="teacher-card-title">{t.title}</div>
            </div>
            <span className={`badge ${t.status === 'active' ? 'badge-success' : 'badge-danger'}`}>
              {t.status}
            </span>
            <div className="teacher-card-stats">
              <div className="teacher-stat">
                <span className="teacher-stat-value">{t.students}</span>
                <span className="teacher-stat-label">Students</span>
              </div>
              <div className="teacher-stat">
                <span className="teacher-stat-value">{t.courses}</span>
                <span className="teacher-stat-label">Courses</span>
              </div>
              <div className="teacher-stat">
                <span className="teacher-stat-value">{t.rating}★</span>
                <span className="teacher-stat-label">Rating</span>
              </div>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              {t.qualification} · {t.experience} exp
            </div>
            <div style={{ display: 'flex', gap: 8, width: '100%' }}>
              <button className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                <MdEdit /> Edit
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

export default TeachersPage;
