import { useState } from 'react';
import { MdAdd, MdEdit, MdDelete, MdVideoCall, MdCalendarMonth, MdPeople, MdAccessTime } from 'react-icons/md';
import './Management.css';

const DEMO_SCHEDULE = [
  { id: 1, title: 'React Hooks Deep Dive', teacher: 'John Smith', course: 'React.js', date: '2026-07-09', time: '10:00 AM', duration: 90, platform: 'Google Meet', students: 28, meetLink: 'https://meet.google.com/xyz' },
  { id: 2, title: 'Python Data Science Intro', teacher: 'Sarah Lee', course: 'Python', date: '2026-07-10', time: '02:00 PM', duration: 60, platform: 'Zoom', students: 32, meetLink: 'https://zoom.us/j/123' },
  { id: 3, title: 'Full Stack Project Review', teacher: 'Mike Chen', course: 'Full Stack', date: '2026-07-11', time: '11:00 AM', duration: 120, platform: 'Google Meet', students: 22, meetLink: 'https://meet.google.com/abc' },
  { id: 4, title: 'UI/UX Figma Workshop', teacher: 'Priya Sharma', course: 'UI/UX', date: '2026-07-12', time: '03:00 PM', duration: 90, platform: 'Zoom', students: 18, meetLink: 'https://zoom.us/j/456' },
  { id: 5, title: 'Node.js REST API Lab', teacher: 'Alex Kumar', course: 'Backend', date: '2026-07-14', time: '10:00 AM', duration: 75, platform: 'Google Meet', students: 15, meetLink: 'https://meet.google.com/def' },
];

const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const SchedulePage = () => {
  const [view, setView] = useState('list'); // 'list' | 'calendar'
  const today = new Date();
  const [calMonth] = useState(today.getMonth());
  const [calYear] = useState(today.getFullYear());

  // Build calendar grid
  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const calDays = [];
  for (let i = 0; i < firstDay; i++) calDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calDays.push(d);

  const hasClass = (day) => {
    if (!day) return false;
    const dateStr = `${calYear}-${String(calMonth + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    return DEMO_SCHEDULE.some(s => s.date === dateStr);
  };

  return (
    <div className="page-section">
      <div className="mgmt-header">
        <div className="mgmt-title-block">
          <h2>Class Schedule</h2>
          <p>Manage live sessions, Google Meet, and Zoom classes</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            id="schedule-list-btn"
            className={`btn ${view === 'list' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setView('list')}
          >List</button>
          <button
            id="schedule-cal-btn"
            className={`btn ${view === 'calendar' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setView('calendar')}
          ><MdCalendarMonth /> Calendar</button>
          <button id="create-schedule-btn" className="btn btn-primary">
            <MdAdd /> Schedule Class
          </button>
        </div>
      </div>

      {view === 'list' ? (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {DEMO_SCHEDULE.map(cls => (
              <div key={cls.id} style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                padding: '18px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: 18,
                flexWrap: 'wrap',
                transition: 'var(--transition)',
              }}>
                {/* Date block */}
                <div style={{
                  width: 56, height: 56, borderRadius: 'var(--radius-md)',
                  background: 'rgba(108,99,255,0.1)', color: 'var(--brand-primary)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: 800, lineHeight: 1 }}>
                    {new Date(cls.date).getDate()}
                  </span>
                  <span style={{ fontSize: '0.62rem', fontWeight: 600, textTransform: 'uppercase' }}>
                    {MONTHS[new Date(cls.date).getMonth()].slice(0,3)}
                  </span>
                </div>

                {/* Details */}
                <div style={{ flex: 1, minWidth: 180 }}>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{cls.title}</div>
                  <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    <span><MdPeople style={{ verticalAlign: 'middle' }} /> {cls.students} students</span>
                    <span><MdAccessTime style={{ verticalAlign: 'middle' }} /> {cls.time} · {cls.duration} min</span>
                    <span>{cls.teacher} · {cls.course}</span>
                  </div>
                </div>

                {/* Platform badge */}
                <span className={`badge ${cls.platform === 'Zoom' ? 'badge-info' : 'badge-primary'}`}>
                  {cls.platform}
                </span>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 8 }}>
                  <a href={cls.meetLink} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm">
                    <MdVideoCall /> Join
                  </a>
                  <button className="btn btn-ghost btn-sm btn-icon"><MdEdit /></button>
                  <button className="btn btn-ghost btn-sm btn-icon" style={{ color: 'var(--danger)' }}><MdDelete /></button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* Calendar View */
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: 24
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{MONTHS[calMonth]} {calYear}</h3>
          </div>

          {/* Day headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 8 }}>
            {WEEK_DAYS.map(d => (
              <div key={d} style={{ textAlign: 'center', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', padding: '6px 0' }}>
                {d}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
            {calDays.map((day, i) => (
              <div key={i} style={{
                minHeight: 52,
                borderRadius: 'var(--radius-md)',
                padding: 6,
                background: day === today.getDate() && calMonth === today.getMonth()
                  ? 'rgba(108,99,255,0.1)'
                  : 'transparent',
                border: day === today.getDate() && calMonth === today.getMonth()
                  ? '1px solid var(--brand-primary)'
                  : '1px solid transparent',
                cursor: day ? 'pointer' : 'default',
                transition: 'var(--transition)',
              }}>
                {day && (
                  <>
                    <div style={{
                      fontSize: '0.8rem', fontWeight: 600,
                      color: day === today.getDate() && calMonth === today.getMonth()
                        ? 'var(--brand-primary)' : 'var(--text-primary)',
                    }}>{day}</div>
                    {hasClass(day) && (
                      <div style={{
                        marginTop: 2, fontSize: '0.6rem', fontWeight: 600,
                        background: 'var(--brand-primary)', color: '#fff',
                        borderRadius: 4, padding: '1px 5px', display: 'inline-block'
                      }}>class</div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SchedulePage;
