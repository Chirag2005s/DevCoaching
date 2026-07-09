import { useState } from 'react';
import { MdAdd, MdEdit, MdDelete, MdSearch, MdTimer, MdQuiz, MdPlayArrow } from 'react-icons/md';
import './Management.css';

const DEMO_EXAMS = [
  { id: 1, title: 'JavaScript Basics', subject: 'Full Stack', questions: 25, duration: 30, marks: 100, attempts: 34, status: 'active' },
  { id: 2, title: 'React Component Patterns', subject: 'React.js', questions: 20, duration: 25, marks: 80, attempts: 28, status: 'active' },
  { id: 3, title: 'Python OOP Concepts', subject: 'Python', questions: 30, duration: 40, marks: 120, attempts: 42, status: 'draft' },
  { id: 4, title: 'Node.js API Design', subject: 'Backend', questions: 15, duration: 20, marks: 60, attempts: 19, status: 'active' },
  { id: 5, title: 'UI/UX Principles Quiz', subject: 'UI/UX', questions: 20, duration: 30, marks: 80, attempts: 0, status: 'draft' },
  { id: 6, title: 'MongoDB Final Exam', subject: 'Backend', questions: 35, duration: 60, marks: 140, attempts: 0, status: 'scheduled' },
];

const statusMap = {
  active: 'badge-success',
  draft: 'badge-warning',
  scheduled: 'badge-info',
};

const ExamsPage = () => {
  const [search, setSearch] = useState('');
  const [exams] = useState(DEMO_EXAMS);

  const filtered = exams.filter(e =>
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-section">
      <div className="mgmt-header">
        <div className="mgmt-title-block">
          <h2>Examination System</h2>
          <p>Create, manage, and monitor exams and quizzes</p>
        </div>
        <button id="create-exam-btn" className="btn btn-primary">
          <MdAdd /> Create Exam
        </button>
      </div>

      <div className="filter-bar">
        <div className="filter-search-wrap">
          <MdSearch className="filter-search-icon" />
          <input
            id="exam-search-input"
            className="filter-search-input"
            placeholder="Search exams..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select id="exam-subject-filter" className="filter-select">
          <option>All Subjects</option>
          <option>React.js</option>
          <option>Python</option>
          <option>Backend</option>
          <option>UI/UX</option>
        </select>
        <select id="exam-status-filter" className="filter-select">
          <option>All Status</option>
          <option>active</option>
          <option>draft</option>
          <option>scheduled</option>
        </select>
      </div>

      <div className="card-grid">
        {filtered.map(exam => (
          <div key={exam.id} className="exam-card">
            <div className="exam-card-header">
              <div>
                <div className="exam-card-title">{exam.title}</div>
                <div className="exam-card-subject">{exam.subject}</div>
              </div>
              <span className={`badge ${statusMap[exam.status]}`}>{exam.status}</span>
            </div>
            <div className="exam-card-meta">
              <div className="exam-meta-item">
                <span className="exam-meta-label">Questions</span>
                <span className="exam-meta-value">{exam.questions}</span>
              </div>
              <div className="exam-meta-item">
                <span className="exam-meta-label">Duration</span>
                <span className="exam-meta-value">{exam.duration} min</span>
              </div>
              <div className="exam-meta-item">
                <span className="exam-meta-label">Total Marks</span>
                <span className="exam-meta-value">{exam.marks}</span>
              </div>
              <div className="exam-meta-item">
                <span className="exam-meta-label">Attempts</span>
                <span className="exam-meta-value">{exam.attempts}</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                <MdPlayArrow /> Start
              </button>
              <button className="btn btn-secondary btn-sm"><MdEdit /></button>
              <button className="btn btn-danger btn-sm"><MdDelete /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExamsPage;
