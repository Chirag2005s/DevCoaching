import React, { useState, useEffect } from 'react';
import { api } from '../hooks/useApi';
import './admin.shared.css';
import './AttendanceTracker.css';

export default function AttendanceTracker() {
  const [batches, setBatches] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch batches and teachers on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [batchesRes, teachersRes] = await Promise.all([
          api.get('/batches'),
          api.get('/Teacher')
        ]);
        if (batchesRes.data.batches) setBatches(batchesRes.data.batches);
        if (teachersRes.data.teachers) setTeachers(teachersRes.data.teachers);
      } catch (error) {
        console.error("Failed to fetch initial data", error);
      }
    };
    fetchData();
  }, []);

  // Fetch students when a batch is selected
  useEffect(() => {
    if (!selectedBatch) {
      setStudents([]);
      setAttendanceRecords({});
      return;
    }

    const fetchStudents = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/attendance/batch/${selectedBatch}/students`);
        if (res.data.success) {
          setStudents(res.data.students);
          // Initialize attendance records (default Present)
          const initialRecords = {};
          res.data.students.forEach(student => {
            initialRecords[student._id] = 'Present';
          });
          setAttendanceRecords(initialRecords);
        }
      } catch (error) {
        console.error("Failed to fetch students", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [selectedBatch]);

  const handleStatusChange = (studentId, status) => {
    setAttendanceRecords(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBatch || !selectedTeacher || !date) {
      setMessage("Please fill all fields.");
      return;
    }

    const records = Object.keys(attendanceRecords).map(studentId => ({
      studentId,
      status: attendanceRecords[studentId]
    }));

    try {
      setLoading(true);
      const res = await api.post(`/attendance`, {
        batchId: selectedBatch,
        instructorId: selectedTeacher,
        date,
        records
      });
      if (res.data.success) {
        setMessage("Attendance saved successfully!");
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error(error);
      setMessage("Failed to save attendance.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="page-top">
        <div className="page-top-left">
          <h1>📅 Attendance Tracker</h1>
          <p>Mark daily attendance for students.</p>
        </div>
      </div>

      <div className="card filters-card">
        <form className="filters-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Batch</label>
            <select value={selectedBatch} onChange={e => setSelectedBatch(e.target.value)} required>
              <option value="">Select a Batch</option>
              {batches && batches.map(b => (
                <option key={b._id} value={b._id}>{b.batchName} ({b.track})</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>Instructor</label>
            <select value={selectedTeacher} onChange={e => setSelectedTeacher(e.target.value)} required>
              <option value="">Select Instructor</option>
              {teachers && teachers.map(t => (
                <option key={t._id} value={t._id}>{t.Name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
          </div>

          <button type="submit" className="btn-primary" disabled={loading || students.length === 0}>
            {loading ? 'Saving...' : 'Save Attendance'}
          </button>
        </form>
        {message && <div className="message">{message}</div>}
      </div>

      {selectedBatch && (
        <div className="card students-card">
          <h3>Enrolled Students ({students.length})</h3>
          {loading ? (
            <p>Loading students...</p>
          ) : students.length > 0 ? (
            <div className="students-list">
              <div className="list-header">
                <div className="col-name">Student Name</div>
                <div className="col-status">Status</div>
              </div>
              {students.map(student => (
                <div className="list-row" key={student._id}>
                  <div className="col-name">
                    <div className="student-name">{student.name}</div>
                    <div className="student-email">{student.email}</div>
                  </div>
                  <div className="col-status">
                    <div className="status-toggle">
                      {['Present', 'Absent', 'Late'].map(status => (
                        <button
                          key={status}
                          type="button"
                          className={`status-btn ${status.toLowerCase()} ${attendanceRecords[student._id] === status ? 'active' : ''}`}
                          onClick={() => handleStatusChange(student._id, status)}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-state">No students found for this batch.</p>
          )}
        </div>
      )}
    </div>
  );
}
