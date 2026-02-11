import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { getSession, logoutUser } from '../services/storage';
import { LogOut, Coffee } from 'lucide-react';

// Shared layout wrapper for authenticated pages
// Provides header with user info and logout
// <Outlet /> renders the child route component
const Layout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const session = getSession();

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };

    if (!session) return null; // Should be handled by PrivateRoute but safety check

    return (
        <div className="layout">
            <header style={{
                padding: 'var(--space-md) var(--space-lg)',
                borderBottom: '1px solid var(--color-border)',
                background: '#ffffff',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'sticky',
                top: 0,
                zIndex: 10,
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                    <div style={{
                        width: 40, height: 40,
                        background: 'var(--color-primary)',
                        borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <Coffee color="white" size={24} />
                    </div>
                    <div>
                        <h2 style={{ fontSize: 'var(--font-size-lg)', margin: 0 }}>Chazu</h2>
                        <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
                            {session.role === 'OVERALL_MANAGER' ? 'Headquarters' : 'Location Manager'}
                        </span>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                    {/* Only show admin nav links for overall managers */}
                    {session.role === 'OVERALL_MANAGER' && (
                        <nav style={{ display: 'flex', gap: '1rem', marginRight: '2rem' }}>
                            <a href="/admin" style={{ fontWeight: 500, color: location.pathname === '/admin' ? 'var(--color-primary)' : 'var(--color-text-muted)' }}>Dashboard</a>
                            <a href="/admin/alerts" style={{ fontWeight: 500, color: location.pathname === '/admin/alerts' ? 'var(--color-primary)' : 'var(--color-text-muted)' }}>Alerts</a>
                        </nav>
                    )}
                    <span style={{ color: 'var(--color-text-main)' }}>Welcome, {session.name}</span>
                    <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </header>

            <main style={{ padding: 'var(--space-lg)', minHeight: 'calc(100vh - 80px)' }}>
                <div className="container">
                    {/* Child route component renders here */}
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
