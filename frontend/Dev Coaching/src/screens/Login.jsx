import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Login.css';
import { FiLogIn } from "react-icons/fi";

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            const response = await fetch('http://localhost:9000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
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
                setError(data.message || 'Failed to login');
            }
        } catch (err) {
            setError('Network error, please try again later');
        }
    };

    return (
        <div className="login-page-container">
            <div className="login-left">
                <h1>Welcome Back<br/>To Your Path</h1>
                <p>Log in to pick up right where you left off. Access your notes, live classes, and keep advancing your skills.</p>
            </div>
            
            <div className="login-right">
                <div className="login-form-wrapper">
                    <div className="login-header">
                        <h2>Log In</h2>
                        <p>Welcome back! Please enter your details.</p>
                    </div>
                    
                    {error && <div className="login-error">{error}</div>}
                    
                    <form onSubmit={handleSubmit}>
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
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="login-btn">
                            <FiLogIn className="btn-icon" /> Log In
                        </button>
                    </form>
                    
                    <div className="login-footer">
                        <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
