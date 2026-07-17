import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './InstructorCheck.css';

const API_BASE = 'http://localhost:9000/api';

export default function InstructorCheck() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${API_BASE}/attendance/instructors/stats`);
        if (res.data.success) {
          setStats(res.data.stats);
        }
      } catch (error) {
        console.error("Failed to fetch instructor stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="loading">Loading instructor statistics...</div>;
  }

  return (
    <div className="instructor-page">
      <div className="page-header">
        <h1>Instructor Monitoring</h1>
        <p>Monitor classes taken by instructors across all batches.</p>
      </div>

      <div className="stats-grid">
        {stats.length === 0 ? (
          <div className="empty-state">No attendance records found for instructors.</div>
        ) : (
          stats.map(stat => (
            <div className="stat-card" key={stat.instructorId}>
              <div className="stat-header">
                <div className="instructor-info">
                  <div className="avatar">{stat.instructorName.charAt(0)}</div>
                  <h2>{stat.instructorName}</h2>
                </div>
                <div className="total-classes">
                  <span className="count">{stat.totalClassesTaken}</span>
                  <span className="label">Classes Taken</span>
                </div>
              </div>
              
              <div className="stat-body">
                <h3>Recent Classes</h3>
                {stat.recentClasses.length > 0 ? (
                  <ul className="recent-classes-list">
                    {stat.recentClasses.map((rc, idx) => (
                      <li key={idx} className="recent-class-item">
                        <div className="class-date">
                          {new Date(rc.date).toLocaleDateString(undefined, { 
                            month: 'short', day: 'numeric', year: 'numeric' 
                          })}
                        </div>
                        <div className="class-batch">
                          {rc.batchName} <span className="track-badge">{rc.track}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="no-recent">No recent classes.</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
