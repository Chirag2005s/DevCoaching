import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Signup.css';

function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                login(data.user, data.token);
                if (data.user.hasPurchasedCourse) {
                    navigate('/dashboard');
                } else {
                    navigate('/course');
                }
            } else {
                setError(data.message || 'Failed to sign up');
            }
        } catch (err) {
            setError('Network error, please try again later');
        }
    };

    return (
        <div className="signup-page-container">
            <div className="signup-left">
                <h1>Unlock Your<br/>Coding Potential</h1>
                <p>Join Dev Coaching to master web development with world-class instructors, comprehensive notes, and live classes.</p>
            </div>
            
            <div className="signup-right">
                <div className="signup-form-wrapper">
                    <div className="signup-header">
                        <h2>Create Account</h2>
                        <p>Sign up to get started</p>
                    </div>
                    
                    {error && <div className="signup-error">{error}</div>}
                    
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="name">Full Name</label>
                            <input
                                type="text"
                                id="name"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                placeholder="john@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                placeholder="Min. 6 characters"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                        </div>
                        <button type="submit" className="signup-btn">
                            Sign Up
                        </button>
                    </form>
                    
                    <div className="signup-footer">
                        <p>Already have an account? <Link to="/login">Log In</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signup;
