import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMenuItems, getAvailableItemIds, saveAvailableItemIds } from '../services/storage';
import { ArrowLeft, CheckSquare, Square, Save } from 'lucide-react';

// HQ page: Toggle which menu items are available for daily orders
// Changes affect what location managers see in their order form
const AdminMenuSettings = () => {
    const navigate = useNavigate();
    const [menuItems, setMenuItems] = useState([]);
    const [availableItemIds, setAvailableItemIds] = useState([]);

    useEffect(() => {
        setMenuItems(getMenuItems());
        setAvailableItemIds(getAvailableItemIds());
    }, []);

    // Toggle item availability - saves immediately to localStorage
    const toggleAvailability = (itemId) => {
        setAvailableItemIds(prev => {
            const newIds = prev.includes(itemId)
                ? prev.filter(id => id !== itemId)
                : [...prev, itemId];
            saveAvailableItemIds(newIds);
            return newIds;
        });
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <button
                onClick={() => navigate('/admin')}
                className="btn btn-secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 'var(--space-lg)' }}
            >
                <ArrowLeft size={20} /> Back to Dashboard
            </button>

            <div className="card">
                <div style={{ marginBottom: 'var(--space-lg)', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
                    <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Daily Menu Availability</h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>
                        Select the items that should be available for managers to order today.
                        Changes are saved immediately.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                    {menuItems.map(item => {
                        const isAvailable = availableItemIds.includes(item.id);
                        return (
                            <div
                                key={item.id}
                                onClick={() => toggleAvailability(item.id)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    padding: '1rem',
                                    background: isAvailable ? 'rgba(52, 211, 153, 0.1)' : 'rgba(255,255,255,0.03)',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    border: isAvailable ? '1px solid rgba(52, 211, 153, 0.3)' : '1px solid transparent',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <div style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    width: '24px', height: '24px',
                                    color: isAvailable ? '#34d399' : 'var(--color-text-muted)'
                                }}>
                                    {isAvailable ? <CheckSquare size={24} /> : <Square size={24} />}
                                </div>
                                <div>
                                    <span style={{ display: 'block', fontWeight: 500, color: isAvailable ? 'var(--color-text-main)' : 'var(--color-text-muted)' }}>
                                        {item.name}
                                    </span>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-dim)', textTransform: 'capitalize' }}>
                                        {item.type}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default AdminMenuSettings;
