import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { IoChevronBackOutline } from "react-icons/io5";
import { FaUser, FaPhone, FaCheckCircle, FaQrcode } from "react-icons/fa";
import './CoursePurchase.css';

function CoursePurchase() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, token, updateUserPurchaseStatus } = useContext(AuthContext);
    
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        mobile: ''
    });
    const [isConfirming, setIsConfirming] = useState(false);
    const [purchaseMsg, setPurchaseMsg] = useState(null);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchCourse = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/Course/${id}`);
                setCourse(res.data?.course);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching course:", err);
                setLoading(false);
            }
        };
        fetchCourse();
    }, [id, user, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNextStep = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.mobile) {
            return;
        }
        setStep(2);
    };

    const confirmPayment = async () => {
        try {
            setIsConfirming(true);
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/purchase`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    courseId: id,
                    studentDetails: formData
                })
            });

            const data = await response.json();
            if (response.ok) {
                updateUserPurchaseStatus(true, data.token);
                setPurchaseMsg({ type: 'success', text: 'Payment successful! You are now enrolled.' });
                setTimeout(() => navigate('/dashboard'), 2000);
            } else {
                setPurchaseMsg({ type: 'error', text: data.message || 'Failed to confirm payment.' });
            }
        } catch (err) {
            setPurchaseMsg({ type: 'error', text: 'Network error. Please try again.' });
        } finally {
            setIsConfirming(false);
        }
    };

    if (loading) {
        return (
            <div className="purchase-page">
                <div className="loading-spinner"></div>
                <p>Loading purchase details...</p>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="purchase-page">
                <h2>Course not found</h2>
                <button className="back-btn" onClick={() => navigate('/course')}>
                    <IoChevronBackOutline /> Back to Courses
                </button>
            </div>
        );
    }

    const price = course.Price || 0;

    return (
        <div className="purchase-page">
            <div className="container">
                <button className="back-btn mb-4" onClick={() => navigate(`/course/${id}`)}>
                    <IoChevronBackOutline /> Back to Course
                </button>

                <div className="purchase-card mx-auto">
                    <div className="purchase-header text-center">
                        <h2>Complete Your Purchase</h2>
                        <p className="text-secondary">Course: <strong className="text-white">{course.courseName}</strong></p>
                    </div>

                    <div className="stepper">
                        <div className={`step-item ${step >= 1 ? 'active' : ''}`}>
                            <div className="step-num">1</div>
                            <span>Details</span>
                        </div>
                        <div className="step-divider"></div>
                        <div className={`step-item ${step >= 2 ? 'active' : ''}`}>
                            <div className="step-num">2</div>
                            <span>Payment</span>
                        </div>
                    </div>

                    <div className="purchase-body">
                        {step === 1 ? (
                            <form onSubmit={handleNextStep} className="purchase-form">
                                <div className="form-group mb-4">
                                    <label className="form-label d-flex align-items-center gap-2">
                                        <FaUser className="text-info" /> Full Name
                                    </label>
                                    <input 
                                        type="text" 
                                        className="form-control custom-input" 
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Enter your full name" 
                                        required 
                                    />
                                </div>
                                <div className="form-group mb-4">
                                    <label className="form-label d-flex align-items-center gap-2">
                                        <FaPhone className="text-info" /> Mobile Number
                                    </label>
                                    <input 
                                        type="tel" 
                                        className="form-control custom-input" 
                                        name="mobile"
                                        value={formData.mobile}
                                        onChange={handleInputChange}
                                        placeholder="Enter 10-digit mobile number" 
                                        pattern="[0-9]{10}"
                                        required 
                                    />
                                </div>
                                
                                <div className="price-summary mb-4">
                                    <span>Total Amount Payable</span>
                                    <span className="price-val">₹{price}</span>
                                </div>

                                <button type="submit" className="btn-primary w-100 py-3 d-flex justify-content-center align-items-center gap-2">
                                    <FaQrcode /> Generate Payment QR
                                </button>
                            </form>
                        ) : (
                            <div className="qr-payment-section text-center">
                                <h4 className="mb-3">Scan QR to Pay</h4>
                                <div className="qr-box mx-auto mb-4">
                                    <img 
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=devcoaching@upi&pn=DevCoaching&am=${price}&cu=INR`} 
                                        alt="Payment QR" 
                                        className="img-fluid rounded"
                                    />
                                </div>
                                <div className="payment-details text-start mb-4 p-3 rounded bg-dark border border-secondary">
                                    <p className="mb-1"><strong>Name:</strong> {formData.name}</p>
                                    <p className="mb-1"><strong>Mobile:</strong> {formData.mobile}</p>
                                    <p className="mb-0"><strong>Amount:</strong> <span className="text-info">₹{price}</span></p>
                                </div>

                                {purchaseMsg && (
                                    <div className={`alert alert-${purchaseMsg.type === 'success' ? 'success' : 'danger'} mb-3`}>
                                        {purchaseMsg.text}
                                    </div>
                                )}

                                <div className="d-flex gap-3">
                                    <button 
                                        className="btn btn-outline-secondary w-50"
                                        onClick={() => setStep(1)}
                                        disabled={isConfirming}
                                    >
                                        Back
                                    </button>
                                    <button 
                                        className="btn btn-success w-50 d-flex justify-content-center align-items-center gap-2"
                                        onClick={confirmPayment}
                                        disabled={isConfirming}
                                    >
                                        {isConfirming ? 'Confirming...' : <><FaCheckCircle /> Confirm Payment</>}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CoursePurchase;
