import { useState } from 'react';
import { MdAdd, MdEdit, MdDelete, MdSearch, MdGrade, MdCheckCircle, MdPending } from 'react-icons/md';
import './Management.css';

const DEMO_ASSIGNMENTS = [
  { id: 1, title: 'Build a Todo App with React Hooks', course: 'React.js', teacher: 'John Smith', due: 'Jul 12, 2026', submissions: 18, total: 25, status: 'open' },
  { id: 2, title: 'Python Web Scraper Project', course: 'Python', teacher: 'Sarah Lee', due: 'Jul 10, 2026', submissions: 22, total: 30, status: 'closed' },
  { id: 3, title: 'REST API with Authentication', course: 'Backend', teacher: 'Mike Chen', due: 'Jul 15, 2026', submissions: 8, total: 20, status: 'open' },
  { id: 4, title: 'Figma Portfolio Design', course: 'UI/UX', teacher: 'Priya Sharma', due: 'Jul 8, 2026', submissions: 15, total: 15, status: 'grading' },
  { id: 5, title: 'Full Stack Blog Platform', course: 'Full Stack', teacher: 'Alex Kumar', due: 'Jul 20, 2026', submissions: 5, total: 18, status: 'open' },
];

const statusMap = {
  open: 'badge-primary',
  closed: 'badge-danger',
  grading: 'badge-warning',
};

const AssignmentsPage = () => {
  const [search, setSearch] = useState('');
  const [assignments] = useState(DEMO_ASSIGNMENTS);

  const filtered = assignments.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.course.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-section">
      <div className="mgmt-header">
        <div className="mgmt-title-block">
          <h2>Assignment System</h2>
          <p>Create, assign, and grade student assignments</p>
        </div>
        <button id="create-assignment-btn" className="btn btn-primary">
          <MdAdd /> Create Assignment
        </button>
      </div>

      <div className="filter-bar">
        <div className="filter-search-wrap">
          <MdSearch className="filter-search-icon" />
          <input
            id="assignment-search-input"
            className="filter-search-input"
            placeholder="Search assignments..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select id="assignment-course-filter" className="filter-select">
          <option>All Courses</option>
          <option>React.js</option>
          <option>Python</option>
          <option>Backend</option>
        </select>
        <select id="assignment-status-filter" className="filter-select">
          <option>All Status</option>
          <option>open</option>
          <option>closed</option>
          <option>grading</option>
        </select>
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Assignment</th>
              <th>Course</th>
              <th>Teacher</th>
              <th>Due Date</th>
              <th>Submissions</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(a => (
              <tr key={a.id}>
                <td style={{ fontWeight: 600, maxWidth: 220 }}>{a.title}</td>
                <td><span className="badge badge-primary">{a.course}</span></td>
                <td style={{ color: 'var(--text-muted)', fontSize: '0.83rem' }}>{a.teacher}</td>
                <td style={{ fontSize: '0.83rem' }}>{a.due}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div className="progress-bar-wrapper" style={{ width: 70 }}>
                      <div className="progress-bar-fill"
                        style={{ width: `${(a.submissions / a.total) * 100}%` }} />
                    </div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>
                      {a.submissions}/{a.total}
                    </span>
                  </div>
                </td>
                <td>
                  <span className={`badge ${statusMap[a.status]}`}>{a.status}</span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-secondary btn-sm" title="Grade">
                      <MdGrade />
                    </button>
                    <button className="btn btn-ghost btn-sm btn-icon" title="Edit"><MdEdit /></button>
                    <button className="btn btn-ghost btn-sm btn-icon" title="Delete" style={{ color: 'var(--danger)' }}>
                      <MdDelete />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssignmentsPage;
