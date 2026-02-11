import React, { useState, useEffect } from 'react';
import { getOrders, getLocations, getMenuItems } from '../../services/storage';
import AdminNav from '../../components/AdminNav';
import { Printer, CheckCircle, XCircle, Share2, Mail } from 'lucide-react';

// HQ view: Shows which locations have submitted orders for selected date
// Displays master production list (aggregated items needed)
const AdminDailyOperations = () => {
    const [orders, setOrders] = useState([]);
    const [locations, setLocations] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // Default today

    useEffect(() => {
        setOrders(getOrders());
        setLocations(getLocations());
        setMenuItems(getMenuItems());
    }, []);

    // 1. Identify Missing Orders
    // Which locations have an order for the selected date?
    const ordersForDate = orders.filter(o => o.date === selectedDate);
    const submittedLocationIds = ordersForDate.map(o => o.locationId);

    // 2. Aggregate Requirements for Selected Date
    // Sum up all quantities needed for each menu item across all orders
    const dailyRequirements = ordersForDate.reduce((acc, order) => {
        Object.entries(order.items).forEach(([itemId, qty]) => {
            acc[itemId] = (acc[itemId] || 0) + qty;
        });
        return acc;
    }, {});

    const printPage = () => {
        window.print();
    };

    // Generate email report with location status and master list
    const handleShare = () => {
        const dateStr = selectedDate;

        let reportText = `Chazu Daily Operations Report - ${dateStr}\n\n`;

        // Missing Status
        reportText += `LOCATION STATUS\n`;
        reportText += `----------------\n`;
        locations.forEach(loc => {
            const hasSubmitted = submittedLocationIds.includes(loc.id);
            reportText += `${loc.name}: ${hasSubmitted ? '[OK] Received' : '[MISSING]'}\n`;
        });

        // Master List
        reportText += `\nMASTER PRODUCTION LIST\n`;
        reportText += `----------------------\n`;
        if (Object.keys(dailyRequirements).length === 0) {
            reportText += `No items ordered for this date yet.\n`;
        } else {
            Object.entries(dailyRequirements).forEach(([itemId, qty]) => {
                const itemName = menuItems.find(i => i.id === itemId)?.name || itemId;
                reportText += `${itemName}: ${qty}\n`;
            });
        }

        const subject = encodeURIComponent(`Daily Operations Report - ${dateStr}`);
        const body = encodeURIComponent(reportText);

        window.location.href = `mailto:?subject=${subject}&body=${body}`;
    };

    return (
        <div>
            {/* Hide Nav on Print */}
            <div className="no-print">
                <h1 style={{ marginBottom: 'var(--space-md)' }}>HQ Management</h1>
                <AdminNav />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }} className="no-print">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <h2 style={{ margin: 0 }}>Daily Operations</h2>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={e => setSelectedDate(e.target.value)}
                        style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                    />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                        onClick={handleShare}
                        className="btn btn-secondary"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <Mail size={18} /> Email Report
                    </button>
                    <button
                        onClick={printPage}
                        className="btn btn-primary"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <Printer size={18} /> Print Sheet
                    </button>
                </div>
            </div>

            <div className="print-container">
                {/* Header for Print */}
                <div className="only-print" style={{ display: 'none', marginBottom: '2rem', borderBottom: '2px solid black', paddingBottom: '1rem' }}>
                    <h1>Daily Operations Sheet</h1>
                    <p>Date: {selectedDate}</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)' }}>

                    {/* Column 1: Missing / Submitted Locations */}
                    <div className="card">
                        <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>Location Status</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {locations.map(loc => {
                                const hasSubmitted = submittedLocationIds.includes(loc.id);
                                return (
                                    <div key={loc.id} style={{
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                        padding: '0.75rem',
                                        borderRadius: 'var(--radius-md)',
                                        background: hasSubmitted ? 'rgba(52, 211, 153, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                        border: `1px solid ${hasSubmitted ? '#34d399' : '#ef4444'}`
                                    }}>
                                        <span style={{ fontWeight: 500 }}>{loc.name}</span>
                                        {hasSubmitted ? (
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#059669', fontSize: '0.9rem' }}>
                                                <CheckCircle size={16} /> Order Received
                                            </span>
                                        ) : (
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#dc2626', fontSize: '0.9rem', fontWeight: 600 }}>
                                                <XCircle size={16} /> MISSING
                                            </span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Column 2: Master Pick List */}
                    <div className="card">
                        <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>Master Production List</h3>
                        {Object.keys(dailyRequirements).length === 0 ? (
                            <p style={{ color: 'var(--color-text-muted)' }}>No items ordered for this date yet.</p>
                        ) : (
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <tbody>
                                    {Object.entries(dailyRequirements).map(([itemId, qty]) => {
                                        const itemName = menuItems.find(i => i.id === itemId)?.name || itemId;
                                        return (
                                            <tr key={itemId} style={{ borderBottom: '1px solid #eee' }}>
                                                <td style={{ padding: '0.5rem 0' }}>{itemName}</td>
                                                <td style={{ padding: '0.5rem 0', fontWeight: 'bold', textAlign: 'right' }}>{qty}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Notes Section for Print */}
                <div className="only-print card" style={{ display: 'none', marginTop: '2rem', height: '200px', border: '1px dashed #ccc' }}>
                    <h3>Notes / Anomalies</h3>
                </div>

            </div>

            {/* Print styles - hide UI elements, show print-only content */}
            <style>{`
                @media print {
                    .no-print { display: none !important; }
                    .only-print { display: block !important; }
                    body { background: white; color: black; }
                    .card { box-shadow: none; border: 1px solid #ccc; break-inside: avoid; }
                    .layout header { display: none; } /* Hide main layout header */
                    main { padding: 0 !important; margin: 0 !important; }
                    .print-container { width: 100%; margin: 0; }
                }
            `}</style>
        </div>
    );
};

export default AdminDailyOperations;
