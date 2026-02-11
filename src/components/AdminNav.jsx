import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Calendar, MapPin, DollarSign } from 'lucide-react';

// Navigation component for admin pages
// Uses NavLink to highlight active route
const AdminNav = () => {
    const navStyle = {
        display: 'flex',
        gap: 'var(--space-md)',
        marginBottom: 'var(--space-lg)',
        borderBottom: '1px solid var(--color-border)',
        paddingBottom: 'var(--space-sm)'
    };

    const linkStyle = ({ isActive }) => ({
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 1rem',
        textDecoration: 'none',
        borderRadius: 'var(--radius-md)',
        color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
        background: isActive ? 'rgba(77, 124, 15, 0.1)' : 'transparent',
        fontWeight: isActive ? 600 : 500,
        transition: 'all 0.2s ease'
    });

    return (
        <nav style={navStyle}>
            <NavLink to="/admin/aggregated" style={linkStyle}>
                <LayoutDashboard size={18} />
                Aggregated Data
            </NavLink>
            <NavLink to="/admin/daily" style={linkStyle}>
                <Calendar size={18} />
                Daily Operations
            </NavLink>
            <NavLink to="/admin/locations" style={linkStyle}>
                <MapPin size={18} />
                Locations
            </NavLink>
            <NavLink to="/admin/finance" style={linkStyle}>
                <DollarSign size={18} />
                Finance
            </NavLink>
        </nav>
    );
};

export default AdminNav;
