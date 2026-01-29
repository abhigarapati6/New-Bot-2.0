import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { loginUser, registerUser } from '../services/api';
import './Auth.css';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const { setUser } = useContext(ShopContext);
    const navigate = useNavigate();

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const email = e.target[isLogin ? 0 : 1].value;
        const password = e.target[isLogin ? 1 : 2].value;
        const name = !isLogin ? e.target[0].value : '';

        try {
            let userData;
            if (isLogin) {
                userData = await loginUser(email, password);
            } else {
                userData = await registerUser({ name, email, password });
            }

            setUser(userData);

            if (userData.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page auth-page">
            <div className="container auth-container">
                <div className="auth-card">
                    <h2>{isLogin ? 'Welcome Back' : 'Join Us'}</h2>
                    {error && <div className="error-message" style={{ color: '#ef4444', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
                    <form onSubmit={handleSubmit}>
                        {!isLogin && (
                            <div className="form-group">
                                <label>Name</label>
                                <input type="text" placeholder="John Doe" required />
                            </div>
                        )}
                        <div className="form-group">
                            <label>Email or Username</label>
                            <input type="text" placeholder="email@example.com or username" required />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input type="password" placeholder="********" required />
                        </div>
                        <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
                            {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
                        </button>
                    </form>
                    <p className="switch-mode">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button onClick={() => setIsLogin(!isLogin)}>
                            {isLogin ? 'Sign Up' : 'Login'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Auth;
