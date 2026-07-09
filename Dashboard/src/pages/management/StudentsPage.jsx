import { useState } from 'react';
import { MdAdd, MdEdit, MdDelete, MdSearch, MdVisibility } from 'react-icons/md';
import './Management.css';

const DEMO_STUDENTS = [
  { id: 1, name: 'Alice Johnson', email: 'alice@email.com', course: 'React.js', progress: 82, status: 'active', joined: 'Jan 2026' },
  { id: 2, name: 'Bob Williams', email: 'bob@email.com', course: 'Python', progress: 65, status: 'active', joined: 'Feb 2026' },
  { id: 3, name: 'Carol Davis', email: 'carol@email.com', course: 'Full Stack', progress: 45, status: 'inactive', joined: 'Mar 2026' },
  { id: 4, name: 'David Martinez', email: 'david@email.com', course: 'UI/UX', progress: 90, status: 'active', joined: 'Jan 2026' },
  { id: 5, name: 'Emma Wilson', email: 'emma@email.com', course: 'Backend', progress: 72, status: 'active', joined: 'Apr 2026' },
  { id: 6, name: 'Frank Lee', email: 'frank@email.com', course: 'React.js', progress: 30, status: 'active', joined: 'May 2026' },
  { id: 7, name: 'Grace Kim', email: 'grace@email.com', course: 'Python', progress: 55, status: 'inactive', joined: 'Jun 2026' },
  { id: 8, name: 'Henry Brown', email: 'henry@email.com', course: 'Robotics', progress: 88, status: 'active', joined: 'Feb 2026' },
];

const StudentsPage = () => {
  const [search, setSearch] = useState('');
  const [students] = useState(DEMO_STUDENTS);

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase()) ||
    s.course.toLowerCase().includes(search.toLowerCase())
  );

  const initials = (name) => name.split(' ').map(n => n[0]).join('').slice(0, 2);

  return (
    <div className="page-section">
      <div className="mgmt-header">
        <div className="mgmt-title-block">
          <h2>Student Management</h2>
          <p>Track enrollment, progress, and performance of all students</p>
        </div>
        <button id="add-student-btn" className="btn btn-primary">
          <MdAdd /> Add Student
        </button>
      </div>

      <div className="filter-bar">
        <div className="filter-search-wrap">
          <MdSearch className="filter-search-icon" />
          <input
            id="student-search-input"
            className="filter-search-input"
            placeholder="Search students..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select id="student-status-filter" className="filter-select">
          <option>All Status</option>
          <option>active</option>
          <option>inactive</option>
        </select>
        <select id="student-course-filter" className="filter-select">
          <option>All Courses</option>
          <option>React.js</option>
          <option>Python</option>
          <option>Full Stack</option>
        </select>
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Email</th>
              <th>Course</th>
              <th>Progress</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="avatar avatar-sm" style={{ background: 'var(--brand-gradient)' }}>
                      {initials(s.name)}
                    </div>
                    <span style={{ fontWeight: 600 }}>{s.name}</span>
                  </div>
                </td>
                <td style={{ color: 'var(--text-muted)' }}>{s.email}</td>
                <td>
                  <span className="badge badge-primary">{s.course}</span>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div className="progress-bar-wrapper" style={{ width: 80 }}>
                      <div className="progress-bar-fill" style={{ width: `${s.progress}%` }} />
                    </div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{s.progress}%</span>
                  </div>
                </td>
                <td>
                  <span className={`badge ${s.status === 'active' ? 'badge-success' : 'badge-danger'}`}>
                    {s.status}
                  </span>
                </td>
                <td style={{ color: 'var(--text-muted)', fontSize: '0.83rem' }}>{s.joined}</td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-ghost btn-sm btn-icon" title="View"><MdVisibility /></button>
                    <button className="btn btn-ghost btn-sm btn-icon" title="Edit"><MdEdit /></button>
                    <button className="btn btn-ghost btn-sm btn-icon" title="Delete" style={{ color: 'var(--danger)' }}><MdDelete /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        {[1, 2, 3].map(p => (
          <button key={p} className={`pagination-btn ${p === 1 ? 'active' : ''}`}>{p}</button>
        ))}
      </div>
    </div>
  );
};

export default StudentsPage;
