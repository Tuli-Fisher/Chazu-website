import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/storage';
import { Coffee } from 'lucide-react';

// Login page - authenticates user and redirects based on role
const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        const session = loginUser(username, password);
        if (session) {
            // Redirect based on user role
            if (session.role === 'OVERALL_MANAGER') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } else {
            setError('Invalid credentials');
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--color-bg-app)'
        }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px', padding: 'var(--space-xl)' }}>
                <div style={{ textAlign: 'center', marginBottom: 'var(--space-lg)' }}>
                    <div style={{
                        width: 60, height: 60,
                        background: 'var(--color-primary)',
                        borderRadius: '50%',
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        marginBottom: 'var(--space-md)'
                    }}>
                        <Coffee color="white" size={32} />
                    </div>
                    <h1>Welcome Back</h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>Sign in to manage breakfast orders</p>
                </div>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                    {error && (
                        <div style={{
                            padding: '0.75rem',
                            background: 'rgba(239, 68, 68, 0.2)',
                            border: '1px solid var(--color-danger)',
                            borderRadius: '8px',
                            color: '#fca5a5',
                            fontSize: '0.9rem'
                        }}>
                            {error}
                        </div>
                    )}

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Username</label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                            autoComplete="username"
                            style={{ color: 'black' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            style={{ color: 'black' }}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ marginTop: 'var(--space-sm)' }}>
                        Sign In
                    </button>
                </form>

                <div style={{ marginTop: 'var(--space-lg)', textAlign: 'center', fontSize: '0.8rem', color: 'var(--color-text-dim)' }}>
                    <p>Demo Credentials:</p>
                    <p>Admin: admin / 123</p>
                    <p>Manager: mgr1 / 123</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
