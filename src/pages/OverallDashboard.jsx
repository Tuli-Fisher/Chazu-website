import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrders, getLocations, getMenuItems } from '../services/storage';
import { TrendingUp, Users, ShoppingBag, Search, Calendar } from 'lucide-react';

const OverallDashboard = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [locations, setLocations] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [filterText, setFilterText] = useState('');

    useEffect(() => {
        setOrders(getOrders());
        setLocations(getLocations());
        setMenuItems(getMenuItems());
    }, []);

    const aggregatedItems = orders.reduce((acc, order) => {
        Object.entries(order.items).forEach(([itemId, qty]) => {
            acc[itemId] = (acc[itemId] || 0) + qty;
        });
        return acc;
    }, {});

    const getLocationName = (id) => locations.find(l => l.id === id)?.name || id;
    const getItemName = (id) => menuItems.find(i => i.id === id)?.name || id;

    const filteredOrders = orders.filter(o => {
        const locName = getLocationName(o.locationId).toLowerCase();
        return locName.includes(filterText.toLowerCase()) || o.date.includes(filterText);
    });

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
                <h1 style={{ marginBottom: 0 }}>HQ Dashboard</h1>
                <button
                    onClick={() => navigate('/admin/menu')}
                    className="btn btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <Calendar size={18} /> Manage Daily Menu
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>
                        <ShoppingBag size={20} />
                        <span style={{ fontWeight: 600 }}>Total Orders</span>
                    </div>
                    <span style={{ fontSize: '2rem', fontWeight: 700 }}>{orders.length}</span>
                </div>
                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--color-accent)' }}>
                        <Users size={20} />
                        <span style={{ fontWeight: 600 }}>Active Locations</span>
                    </div>
                    <span style={{ fontSize: '2rem', fontWeight: 700 }}>{locations.length}</span>
                </div>
                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--color-accent-gold)' }}>
                        <TrendingUp size={20} />
                        <span style={{ fontWeight: 600 }}>Total Items Sold</span>
                    </div>
                    <span style={{ fontSize: '2rem', fontWeight: 700 }}>
                        {Object.values(aggregatedItems).reduce((a, b) => a + b, 0)}
                    </span>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 'var(--space-lg)', alignItems: 'start' }}>
                <div className="card">
                    <h3 style={{ marginBottom: 'var(--space-md)' }}>Global Item Requirements</h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                        Total quantities needed across all time (Demo).
                        <br />In production, filter by Delivery Date.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {Object.entries(aggregatedItems).map(([itemId, qty]) => (
                            <div key={itemId} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '4px' }}>
                                <span>{getItemName(itemId)}</span>
                                <span style={{ fontWeight: 'bold' }}>{qty}</span>
                            </div>
                        ))}
                    </div>
                    <button className="btn btn-primary" style={{ marginTop: 'var(--space-md)', width: '100%' }}>
                        Print Master Order
                    </button>
                </div>

                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
                        <h3>Recent Orders</h3>
                        <div style={{ position: 'relative' }}>
                            <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                            <input
                                style={{ paddingLeft: '2rem', width: '200px' }}
                                placeholder="Search location..."
                                value={filterText}
                                onChange={e => setFilterText(e.target.value)}
                            />
                        </div>
                    </div>

                    <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                        {filteredOrders.length === 0 && <p className="text-muted">No orders match.</p>}
                        {[...filteredOrders].reverse().map(order => (
                            <div key={order.id} style={{
                                padding: '1rem',
                                borderBottom: '1px solid var(--color-border)',
                                display: 'flex', justifyContent: 'space-between'
                            }}>
                                <div>
                                    <p style={{ fontWeight: 600 }}>{getLocationName(order.locationId)}</p>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{order.date}</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontSize: '0.9rem' }}>{Object.values(order.items).reduce((a, b) => a + b, 0)} items</p>
                                    <p style={{ fontSize: '0.75rem', color: '#34d399' }}>{order.status}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OverallDashboard;
