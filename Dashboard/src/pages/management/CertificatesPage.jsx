import { useState } from 'react';
import { MdDownload, MdShare, MdVerified, MdSearch, MdCardMembership } from 'react-icons/md';
import './Management.css';

const DEMO_CERTS = [
  { id: 'DC-2026-001', student: 'Alice Johnson', course: 'React.js Complete Course', issuedOn: 'Jun 30, 2026', initials: 'AJ', color: '#6c63ff' },
  { id: 'DC-2026-002', student: 'David Martinez', course: 'UI/UX Design Mastery', issuedOn: 'Jun 28, 2026', initials: 'DM', color: '#a78bfa' },
  { id: 'DC-2026-003', student: 'Henry Brown', course: 'Robotics with Python', issuedOn: 'Jun 25, 2026', initials: 'HB', color: '#38bdf8' },
  { id: 'DC-2026-004', student: 'Emma Wilson', course: 'Node.js Backend', issuedOn: 'Jun 20, 2026', initials: 'EW', color: '#22c55e' },
  { id: 'DC-2026-005', student: 'Bob Williams', course: 'Python for Beginners', issuedOn: 'Jun 18, 2026', initials: 'BW', color: '#f59e0b' },
  { id: 'DC-2026-006', student: 'Carol Davis', course: 'Full Stack Development', issuedOn: 'Jun 15, 2026', initials: 'CD', color: '#ec4899' },
];

const CertificatesPage = () => {
  const [search, setSearch] = useState('');
  const certs = DEMO_CERTS.filter(c =>
    c.student.toLowerCase().includes(search.toLowerCase()) ||
    c.course.toLowerCase().includes(search.toLowerCase()) ||
    c.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-section">
      <div className="mgmt-header">
        <div className="mgmt-title-block">
          <h2>Certificate Management</h2>
          <p>View, download, and share student achievement certificates</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary">
            <MdVerified /> Verify Certificate
          </button>
        </div>
      </div>

      <div className="filter-bar">
        <div className="filter-search-wrap">
          <MdSearch className="filter-search-icon" />
          <input
            id="cert-search-input"
            className="filter-search-input"
            placeholder="Search by student, course, or ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select id="cert-course-filter" className="filter-select">
          <option>All Courses</option>
          <option>React.js Complete Course</option>
          <option>Python for Beginners</option>
        </select>
      </div>

      {/* Certificate Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 18 }}>
        {certs.map(cert => (
          <div key={cert.id} style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            transition: 'var(--transition)',
          }}
            className="course-card"
          >
            {/* Certificate Preview */}
            <div style={{
              background: `linear-gradient(135deg, ${cert.color}22, ${cert.color}44)`,
              border: `2px solid ${cert.color}33`,
              margin: 16,
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
              position: 'relative'
            }}>
              <MdCardMembership style={{ fontSize: '2rem', color: cert.color }} />
              <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: cert.color }}>
                Certificate of Completion
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Dev Coaching Platform</div>
              <div className="avatar avatar-md" style={{ background: `linear-gradient(135deg, ${cert.color}, ${cert.color}99)` }}>
                {cert.initials}
              </div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>{cert.student}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textAlign: 'center' }}>{cert.course}</div>
              <div style={{
                position: 'absolute', top: 8, right: 8,
                background: 'rgba(34,197,94,0.15)', color: 'var(--success)',
                borderRadius: 20, padding: '2px 8px', fontSize: '0.68rem', fontWeight: 700,
                display: 'flex', alignItems: 'center', gap: 3
              }}>
                <MdVerified style={{ fontSize: '0.75rem' }} /> Verified
              </div>
            </div>

            {/* Info */}
            <div style={{ padding: '0 16px 12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 10 }}>
                <span>ID: <strong style={{ color: 'var(--brand-primary)' }}>{cert.id}</strong></span>
                <span>{cert.issuedOn}</span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                  <MdDownload /> Download PDF
                </button>
                <button className="btn btn-secondary btn-sm">
                  <MdShare />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CertificatesPage;
