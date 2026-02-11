import React, { useState, useEffect } from 'react';
import { getOrders, getLocations, getMenuItems } from '../../services/storage';
import AdminNav from '../../components/AdminNav';

// HQ analytics: Shows aggregated order data with filters
// Calculates totals, averages, and order counts per menu item
const AdminAggregatedData = () => {
    const [orders, setOrders] = useState([]);
    const [locations, setLocations] = useState([]);
    const [menuItems, setMenuItems] = useState([]);

    // Filters
    const [selectedYear, setSelectedYear] = useState('All');
    const [selectedLocation, setSelectedLocation] = useState('All');

    useEffect(() => {
        setOrders(getOrders());
        setLocations(getLocations());
        setMenuItems(getMenuItems());
    }, []);

    // Get unique years from orders
    const years = ['All', ...new Set(orders.map(o => o.date.split('-')[0]))].sort().reverse();

    // Filter Logic
    const filteredOrders = orders.filter(order => {
        const orderYear = order.date.split('-')[0];
        const yearMatch = selectedYear === 'All' || orderYear === selectedYear;
        const locMatch = selectedLocation === 'All' || order.locationId === selectedLocation;
        return yearMatch && locMatch;
    });

    // Aggregate Items
    // Build object with totals and counts for each menu item
    const aggregatedData = filteredOrders.reduce((acc, order) => {
        Object.entries(order.items).forEach(([itemId, qty]) => {
            if (!acc[itemId]) {
                acc[itemId] = {
                    id: itemId,
                    name: menuItems.find(i => i.id === itemId)?.name || itemId,
                    totalQty: 0,
                    orderCount: 0
                };
            }
            acc[itemId].totalQty += qty;
            acc[itemId].orderCount += 1;
        });
        return acc;
    }, {});

    // Sort by total quantity (most popular first)
    const sortedAggregatedData = Object.values(aggregatedData).sort((a, b) => b.totalQty - a.totalQty);

    return (
        <div>
            <h1 style={{ marginBottom: 'var(--space-md)' }}>HQ Management</h1>
            <AdminNav />

            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
                    <h2 style={{ fontSize: '1.25rem' }}>Aggregated Data Analysis</h2>

                    <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                        <select
                            value={selectedYear}
                            onChange={e => setSelectedYear(e.target.value)}
                            style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                        >
                            {years.map(y => <option key={y} value={y}>{y === 'All' ? 'All Years' : y}</option>)}
                        </select>

                        <select
                            value={selectedLocation}
                            onChange={e => setSelectedLocation(e.target.value)}
                            style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                        >
                            <option value="All">All Locations</option>
                            {locations.map(loc => (
                                <option key={loc.id} value={loc.id}>{loc.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: 'var(--color-bg-light)', borderBottom: '2px solid var(--color-border)' }}>
                                <th style={{ padding: '1rem' }}>Item Name</th>
                                <th style={{ padding: '1rem' }}>Total Quantity Sold</th>
                                <th style={{ padding: '1rem' }}>Orders Containing Item</th>
                                <th style={{ padding: '1rem' }}>Avg Qty / Order</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedAggregatedData.length > 0 ? (
                                sortedAggregatedData.map(item => (
                                    <tr key={item.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                        <td style={{ padding: '1rem', fontWeight: 500 }}>{item.name}</td>
                                        <td style={{ padding: '1rem', color: 'var(--color-primary)', fontWeight: 'bold' }}>{item.totalQty}</td>
                                        <td style={{ padding: '1rem' }}>{item.orderCount}</td>
                                        <td style={{ padding: '1rem' }}>{(item.totalQty / item.orderCount).toFixed(1)}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" style={{ padding: '1rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                                        No data found for selected filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div style={{ marginTop: 'var(--space-md)', textAlign: 'right', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                    Total Orders Analyzed: {filteredOrders.length}
                </div>
            </div>
        </div>
    );
};

export default AdminAggregatedData;
