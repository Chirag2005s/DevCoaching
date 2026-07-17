import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaCheckCircle, FaTimesCircle, FaClock, FaHistory } from 'react-icons/fa';
import './Attendance.css';
import axios from 'axios';

function Attendance() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [attendanceData, setAttendanceData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Redirect to login if user is not authenticated or hasn't purchased
    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else if (!user.hasPurchasedCourse) {
            navigate('/course');
        }
    }, [user, navigate]);

    useEffect(() => {
        if (user && user._id) {
            const fetchAttendance = async () => {
                try {
                    const res = await axios.get(`http://localhost:9000/api/attendance/student/${user._id}`);
                    if (res.data.success) {
                        setAttendanceData(res.data.attendance);
                    }
                } catch (error) {
                    console.error("Error fetching attendance data", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchAttendance();
        }
    }, [user]);

    if (!user) return null;

    // Calculate stats
    const totalClasses = attendanceData.length;
    const presentClasses = attendanceData.filter(record => record.status === 'Present').length;
    const absentClasses = attendanceData.filter(record => record.status === 'Absent').length;
    const lateClasses = attendanceData.filter(record => record.status === 'Late').length;
    const attendancePercentage = totalClasses > 0 ? Math.round((presentClasses / totalClasses) * 100) : 0;

    return (
        <div className="attendance-page">
            <div className="container">
                <div className="dashboard-header">
                    <h1 className="dashboard-title">
                        My <span>Attendance</span>
                    </h1>
                    <p className="dashboard-subtitle">Track your class attendance and participation history.</p>
                </div>

                {loading ? (
                    <div className="loading-state">Loading your attendance records...</div>
                ) : (
                    <>
                        {/* Summary Stats Row */}
                        <div className="attendance-stats-row">
                            <div className="stat-card total">
                                <div className="stat-icon"><FaHistory /></div>
                                <div className="stat-details">
                                    <span className="stat-value">{totalClasses}</span>
                                    <span className="stat-label">Total Classes</span>
                                </div>
                            </div>
                            <div className="stat-card present">
                                <div className="stat-icon"><FaCheckCircle /></div>
                                <div className="stat-details">
                                    <span className="stat-value">{presentClasses}</span>
                                    <span className="stat-label">Present</span>
                                </div>
                            </div>
                            <div className="stat-card absent">
                                <div className="stat-icon"><FaTimesCircle /></div>
                                <div className="stat-details">
                                    <span className="stat-value">{absentClasses}</span>
                                    <span className="stat-label">Absent</span>
                                </div>
                            </div>
                            <div className="stat-card percentage">
                                <div className="stat-icon"><FaClock /></div>
                                <div className="stat-details">
                                    <span className="stat-value">{attendancePercentage}%</span>
                                    <span className="stat-label">Attendance Rate</span>
                                </div>
                            </div>
                        </div>

                        {/* Attendance History Table */}
                        <div className="attendance-history-card">
                            <h3>Attendance History</h3>
                            {attendanceData.length > 0 ? (
                                <div className="table-responsive">
                                    <table className="attendance-table">
                                        <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Batch</th>
                                                <th>Instructor</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {attendanceData.map(record => (
                                                <tr key={record._id}>
                                                    <td>
                                                        {new Date(record.date).toLocaleDateString(undefined, {
                                                            weekday: 'short',
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}
                                                    </td>
                                                    <td>
                                                        <span className="batch-name">{record.batchName}</span>
                                                        <span className="batch-track">{record.track}</span>
                                                    </td>
                                                    <td>{record.instructorName}</td>
                                                    <td>
                                                        <span className={`status-badge status-${record.status.toLowerCase()}`}>
                                                            {record.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="empty-state">
                                    <p>No attendance records found yet.</p>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default Attendance;
