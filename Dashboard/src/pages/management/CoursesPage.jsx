import { useState } from 'react';
import { MdAdd, MdEdit, MdDelete, MdSearch, MdPeople, MdVideoLibrary, MdAttachMoney } from 'react-icons/md';
import './Management.css';

const DEMO_COURSES = [
  { id: 1, name: 'React.js Complete Course', category: 'FRONTEND', price: 2999, status: 'Paid', students: 120, lessons: 48, emoji: '⚛️' },
  { id: 2, name: 'Python for Beginners', category: 'PYTHON', price: 0, status: 'Free', students: 98, lessons: 36, emoji: '🐍' },
  { id: 3, name: 'Full Stack Development', category: 'FULL STACK', price: 4999, status: 'Paid', students: 85, lessons: 72, emoji: '💻' },
  { id: 4, name: 'UI/UX Design Mastery', category: 'UI/UX', price: 1999, status: 'Paid', students: 70, lessons: 30, emoji: '🎨' },
  { id: 5, name: 'Node.js Backend', category: 'BACKEND', price: 3499, status: 'Paid', students: 60, lessons: 42, emoji: '🟢' },
  { id: 6, name: 'Robotics with Python', category: 'ROBOTICS', price: 5999, status: 'Paid', students: 32, lessons: 55, emoji: '🤖' },
];

const CATEGORIES = ['All', 'FRONTEND', 'PYTHON', 'BACKEND', 'UI/UX', 'FULL STACK', 'ROBOTICS'];

const CoursesPage = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [courses] = useState(DEMO_COURSES);

  const filtered = courses.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || c.category === category;
    return matchSearch && matchCat;
  });

  return (
    <div className="page-section">
      {/* Header */}
      <div className="mgmt-header">
        <div className="mgmt-title-block">
          <h2>Course Management</h2>
          <p>Manage all courses, modules, and video lessons</p>
        </div>
        <button id="add-course-btn" className="btn btn-primary">
          <MdAdd /> Add New Course
        </button>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="filter-search-wrap">
          <MdSearch className="filter-search-icon" />
          <input
            id="course-search-input"
            className="filter-search-input"
            placeholder="Search courses..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          id="course-category-filter"
          className="filter-select"
          value={category}
          onChange={e => setCategory(e.target.value)}
        >
          {CATEGORIES.map(cat => <option key={cat}>{cat}</option>)}
        </select>
        <select id="course-status-filter" className="filter-select">
          <option>All Status</option>
          <option>Free</option>
          <option>Paid</option>
        </select>
      </div>

      {/* Courses Grid */}
      <div className="card-grid">
        {filtered.map(course => (
          <div key={course.id} className="course-card">
            <div className="course-card-thumb">
              {course.emoji}
              <div className="course-card-status">
                <span className={`badge ${course.status === 'Free' ? 'badge-success' : 'badge-primary'}`}>
                  {course.status}
                </span>
              </div>
            </div>
            <div className="course-card-body">
              <div className="course-card-category">{course.category}</div>
              <div className="course-card-name">{course.name}</div>
              <div className="course-card-meta">
                <span><MdPeople style={{ verticalAlign: 'middle' }} /> {course.students} students</span>
                <span><MdVideoLibrary style={{ verticalAlign: 'middle' }} /> {course.lessons} lessons</span>
              </div>
              <div className="course-card-price">
                {course.price === 0 ? 'Free' : `₹${course.price.toLocaleString()}`}
              </div>
            </div>
            <div className="course-card-actions">
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

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '3rem' }}>📚</div>
          <p style={{ marginTop: 12, fontWeight: 600 }}>No courses found</p>
        </div>
      )}
    </div>
  );
};

export default CoursesPage;
