import React, { useState } from 'react';
import { CreditCard, QrCode, User, Phone, Book, CheckCircle2 } from 'lucide-react';
import './admin.shared.css';
import './PaymentsPage.css';

const coursesList = [
  { id: 'c1', name: 'Full Stack Web Development', price: 4999 },
  { id: 'c2', name: 'Data Science & Machine Learning', price: 5999 },
  { id: 'c3', name: 'Mobile App Development (React Native)', price: 3999 },
  { id: 'c4', name: 'UI/UX Design Masterclass', price: 2999 }
];

export default function PaymentsPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    courseId: ''
  });
  const [selectedCourse, setSelectedCourse] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'courseId') {
      const course = coursesList.find(c => c.id === value);
      setSelectedCourse(course);
    }
  };

  const generateQR = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.mobile || !formData.courseId) {
      alert("Please fill all required fields");
      return;
    }
    setStep(2);
  };

  const resetForm = () => {
    setFormData({ name: '', mobile: '', courseId: '' });
    setSelectedCourse(null);
    setStep(1);
  };

  return (
    <div className="admin-page payments-page">
      <div className="page-top">
        <div className="page-top-left">
          <h1>Course Purchase & Payments</h1>
          <p>Register student for a course and generate payment QR code</p>
        </div>
      </div>

      <div className="payments-container">
        <div className="payment-stepper">
          <div className={`step ${step >= 1 ? 'active' : ''}`}>
            <div className="step-circle">1</div>
            <span>Student Details</span>
          </div>
          <div className="step-line"></div>
          <div className={`step ${step >= 2 ? 'active' : ''}`}>
            <div className="step-circle">2</div>
            <span>Payment QR</span>
          </div>
        </div>

        <div className="payment-card">
          {step === 1 ? (
            <form onSubmit={generateQR} className="payment-form">
              <div className="form-group">
                <label><User size={16} /> Student Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  placeholder="Enter full name" 
                  required 
                />
              </div>

              <div className="form-group">
                <label><Phone size={16} /> Mobile Number</label>
                <input 
                  type="tel" 
                  name="mobile" 
                  value={formData.mobile} 
                  onChange={handleInputChange} 
                  placeholder="Enter mobile number" 
                  pattern="[0-9]{10}"
                  title="10 digit mobile number"
                  required 
                />
              </div>

              <div className="form-group">
                <label><Book size={16} /> Select Course</label>
                <select 
                  name="courseId" 
                  value={formData.courseId} 
                  onChange={handleInputChange} 
                  required
                >
                  <option value="">-- Choose a course --</option>
                  {coursesList.map(course => (
                    <option key={course.id} value={course.id}>
                      {course.name} - ₹{course.price}
                    </option>
                  ))}
                </select>
              </div>

              {selectedCourse && (
                <div className="price-summary">
                  <span>Total Amount to Pay:</span>
                  <span className="amount">₹{selectedCourse.price}</span>
                </div>
              )}

              <button type="submit" className="btn-generate-qr">
                <QrCode size={18} /> Generate Payment QR
              </button>
            </form>
          ) : (
            <div className="qr-container">
              <div className="qr-header">
                <h3>Scan to Pay</h3>
                <p>Course: <strong>{selectedCourse?.name}</strong></p>
                <p>Student: {formData.name} ({formData.mobile})</p>
                <div className="qr-amount">₹{selectedCourse?.price}</div>
              </div>
              
              <div className="qr-code-wrapper">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=devcoaching@upi&pn=DevCoaching&am=${selectedCourse?.price}&cu=INR`} 
                  alt="Payment QR Code" 
                />
              </div>

              <div className="qr-actions">
                <button type="button" className="btn-back" onClick={() => setStep(1)}>
                  Back
                </button>
                <button type="button" className="btn-confirm-payment" onClick={() => {
                  alert("Payment confirmed for " + formData.name);
                  resetForm();
                }}>
                  <CheckCircle2 size={18} /> Confirm Payment
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
