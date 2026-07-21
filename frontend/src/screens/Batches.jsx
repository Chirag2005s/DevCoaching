import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FaCalendarAlt, FaChalkboardTeacher, FaUsers, FaClock, FaCheckCircle } from 'react-icons/fa';
import './Batches.css';

function Batches() {
    const { user, token, updateUserBatch } = useContext(AuthContext);
    const navigate = useNavigate();
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');
    const [enrollingId, setEnrollingId] = useState(null);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchBatches = async () => {
            try {
                // Adjust endpoint based on backend setup, fallback to common structure
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/batches`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                // Check if response has data.data or data.batches
                setBatches(res.data?.data || res.data?.batches || []);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching batches:", err);
                setErrorMsg('Failed to load batches. The server might not be running or endpoint is missing.');
                setLoading(false);
            }
        };

        fetchBatches();
    }, [user, navigate, token]);

    const handleApply = async (batch) => {
        if (user.enrolledBatch) {
            alert("You are already enrolled in a batch! You can only apply for one batch at a time.");
            return;
        }

        if (window.confirm(`Are you sure you want to apply for ${batch.batchName}?`)) {
            setEnrollingId(batch._id);
            try {
                // Real API call for enrollment
                const response = await axios.patch(`${import.meta.env.VITE_API_URL}/api/batches/${batch._id}/enroll`, {}, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                updateUserBatch(batch);
                alert(`Successfully enrolled in ${batch.batchName}!`);
            } catch (err) {
                console.error("Enroll error:", err);
                alert(err.response?.data?.message || "Failed to enroll in batch. Please try again.");
            } finally {
                setEnrollingId(null);
            }
        }
    };

    if (loading) {
        return (
            <div className="batches-page">
                <div className="loading-spinner mx-auto"></div>
                <p className="text-center mt-3">Loading available batches...</p>
            </div>
        );
    }

    // Only show Upcoming or Ongoing batches
    const activeBatches = batches.filter(b => b.status === 'Upcoming' || b.status === 'Ongoing');

    return (
        <div className="batches-page">
            <div className="container">
                <div className="batches-header text-center">
                    <h1 className="batches-title">Study <span>Batches</span></h1>
                    <p className="batches-subtitle">Apply for a mentor-led batch and start your structured learning journey.</p>
                </div>

                {errorMsg && <div className="alert alert-danger text-center">{errorMsg}</div>}

                {user.enrolledBatch && (
                    <div className="enrolled-banner">
                        <FaCheckCircle className="enrolled-icon" />
                        <div>
                            <h4>You are currently enrolled in a batch</h4>
                            <p>You have been assigned to <strong>{user.enrolledBatch.batchName || 'your selected batch'}</strong>. Check your dashboard for more details.</p>
                        </div>
                    </div>
                )}

                <div className="row g-4 mt-2">
                    {activeBatches.length > 0 ? (
                        activeBatches.map(batch => {
                            const isEnrolledInThis = user.enrolledBatch && (user.enrolledBatch._id === batch._id || user.enrolledBatch.batchName === batch.batchName);
                            const isFull = batch.enrolledStudents?.length >= (batch.maxSeats || 30);

                            return (
                                <div className="col-lg-4 col-md-6" key={batch._id}>
                                    <div className={`batch-card ${isEnrolledInThis ? 'enrolled' : ''}`}>
                                        <div className="batch-status-badge">
                                            <span className={`status-dot ${batch.status === 'Ongoing' ? 'dot-ongoing' : 'dot-upcoming'}`}></span>
                                            {batch.status}
                                        </div>
                                        
                                        <h3 className="batch-name">{batch.batchName}</h3>
                                        <span className="batch-track">{batch.track}</span>

                                        <div className="batch-details mt-4">
                                            <div className="detail-item">
                                                <FaChalkboardTeacher className="detail-icon" />
                                                <span>Instructor: {batch.instructor}</span>
                                            </div>
                                            <div className="detail-item">
                                                <FaClock className="detail-icon" />
                                                <span>Timings: {batch.timings}</span>
                                            </div>
                                            <div className="detail-item">
                                                <FaUsers className="detail-icon" />
                                                <span>Seats: {batch.enrolledStudents?.length || 0} / {batch.maxSeats || 30}</span>
                                            </div>
                                        </div>

                                        <div className="batch-footer mt-4">
                                            {isEnrolledInThis ? (
                                                <button className="btn-enrolled" disabled>
                                                    <FaCheckCircle /> Enrolled
                                                </button>
                                            ) : (
                                                <button 
                                                    className={`btn-apply ${isFull ? 'full' : ''}`}
                                                    onClick={() => handleApply(batch)}
                                                    disabled={isFull || user.enrolledBatch || enrollingId === batch._id}
                                                >
                                                    {enrollingId === batch._id ? 'Applying...' : isFull ? 'Batch Full' : 'Apply Now'}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="col-12">
                            <div className="empty-batches">
                                <FaCalendarAlt size={60} style={{ color: '#94a3b8', marginBottom: '20px' }} />
                                <h3>No active batches available</h3>
                                <p>Please check back later for upcoming batches.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Batches;
