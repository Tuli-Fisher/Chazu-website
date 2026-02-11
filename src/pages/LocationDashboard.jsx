import { useState, useEffect } from 'react';
import { getSession, getOrdersByLocation, createOrder, updateOrder, deleteOrder, getDailyMenu, getMenuItems, getLatestAlert, markAlertResponded } from '../services/storage';
import { Plus, Clock, Calendar, Trash2, Edit2 } from 'lucide-react';
import ChatInterface from '../components/ChatInterface';

// Main dashboard for location managers
// Shows active alerts, allows creating/editing orders, displays order history
const LocationDashboard = () => {
    const session = getSession();
    const [orders, setOrders] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [showNewOrder, setShowNewOrder] = useState(false);

    // New Order State
    const [cart, setCart] = useState({}); // Object mapping itemId -> quantity
    const [notes, setNotes] = useState('');
    const [editingOrderId, setEditingOrderId] = useState(null);
    const [activeAlert, setActiveAlert] = useState(null);

    useEffect(() => {
        if (session?.locationId) {
            setOrders(getOrdersByLocation(session.locationId));
            setMenuItems(getDailyMenu()); // Only shows available items

            // Check for alerts that haven't been responded to
            const alert = getLatestAlert();
            if (alert && !alert.respondedLocations.includes(session.locationId)) {
                setActiveAlert(alert);
            }
        }
    }, [session?.locationId]);

    // Update cart quantity, removing item if quantity reaches 0
    const handleQuantityChange = (itemId, delta) => {
        setCart(prev => {
            const current = prev[itemId] || 0;
            const next = Math.max(0, current + delta);
            if (next === 0) {
                const { [itemId]: _, ...rest } = prev;
                return rest;
            }
            return { ...prev, [itemId]: next };
        });
    };

    const handleSubmitOrder = (e) => {
        e.preventDefault();
        if (Object.keys(cart).length === 0) return;

        if (editingOrderId) {
            // Update existing order
            updateOrder({
                id: editingOrderId,
                locationId: session.locationId,
                items: cart,
                managerNotes: notes,
                date: new Date().toISOString().split('T')[0],
                status: orders.find(o => o.id === editingOrderId)?.status || 'submitted',
            });
        } else {
            // Create new order
            createOrder({
                locationId: session.locationId,
                items: cart,
                managerNotes: notes,
            });
        }

        // Refresh orders list
        setOrders(getOrdersByLocation(session.locationId));
        setShowNewOrder(false);
        setEditingOrderId(null);
        setCart({});
        setNotes('');
    };

    const handleEdit = (order) => {
        setCart(order.items);
        setNotes(order.managerNotes || '');
        setEditingOrderId(order.id);
        setShowNewOrder(true);
    };

    const handleDelete = (orderId) => {
        if (confirm('Are you sure you want to delete this order?')) {
            deleteOrder(orderId);
            setOrders(getOrdersByLocation(session.locationId));
        }
    };

    // Helper to create readable summary of order items
    const getBriefSummary = (itemsMap) => {
        const totalCount = Object.values(itemsMap).reduce((a, b) => a + b, 0);
        const itemNames = Object.keys(itemsMap).map(id => {
            const item = menuItems.find(i => i.id === id);
            return item ? `${itemsMap[id]}x ${item.name}` : '';
        }).join(', ');
        return { totalCount, description: itemNames };
    };

    const handleCancel = () => {
        setShowNewOrder(false);
        setEditingOrderId(null);
        setCart({});
        setNotes('');
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
                <div>
                    <h1 style={{ fontSize: '2rem' }}>Dashboard</h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>Manage orders for {session?.locationId} (ID)</p>
                </div>
                {!showNewOrder && !activeAlert && (
                    <button className="btn btn-primary" onClick={() => {
                        setMenuItems(getDailyMenu()); // Refresh menu in case it changed
                        setShowNewOrder(true);
                    }}>
                        <Plus size={20} /> New Order
                    </button>
                )}
            </div>

            {/* Show active alert if one exists and hasn't been responded to */}
            {activeAlert && (
                <div style={{ marginBottom: 'var(--space-xl)' }}>
                    <h2 style={{ marginBottom: 'var(--space-sm)', color: 'var(--color-primary)' }}>Broadcast Message</h2>
                    <ChatInterface
                        alert={activeAlert}
                        locationId={session.locationId}
                        onComplete={() => {
                            markAlertResponded(activeAlert.id, session.locationId);
                            setActiveAlert(null);
                            setOrders(getOrdersByLocation(session.locationId)); // Refresh orders
                        }}
                    />
                </div>
            )}

            {/* Order form - shown when creating or editing */}
            {showNewOrder ? (
                <div className="card" style={{ marginBottom: 'var(--space-xl)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-md)' }}>
                        <h2>{editingOrderId ? 'Edit Order' : 'Create Daily Order'}</h2>
                        <button className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
                    </div>

                    <form onSubmit={handleSubmitOrder}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
                            {menuItems.map(item => (
                                <div key={item.id} style={{
                                    background: 'rgba(255,255,255,0.05)',
                                    padding: '1rem',
                                    borderRadius: '8px',
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                }}>
                                    <span style={{ fontWeight: 500 }}>{item.name}</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <button type="button" className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem' }} onClick={() => handleQuantityChange(item.id, -1)}>-</button>
                                        <span style={{ width: '20px', textAlign: 'center' }}>{cart[item.id] || 0}</span>
                                        <button type="button" className="btn btn-primary" style={{ padding: '0.25rem 0.5rem' }} onClick={() => handleQuantityChange(item.id, 1)}>+</button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{ marginBottom: 'var(--space-md)' }}>
                            <label>Special Instructions (Optional)</label>
                            <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. Extra napkins, delivery by 8am..." />
                        </div>

                        <div style={{ textAlign: 'right' }}>
                            <button type="submit" className="btn btn-primary" disabled={Object.keys(cart).length === 0}>
                                {editingOrderId ? 'Update Order' : 'Submit Order'}
                            </button>
                        </div>
                    </form>
                </div>
            ) : null}

            {/* Order history list */}
            <div className="card">
                <h3 style={{ marginBottom: 'var(--space-md)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Clock size={20} className="text-muted" /> Order History
                </h3>

                {orders.length === 0 ? (
                    <p style={{ color: 'var(--color-text-dim)', textAlign: 'center', padding: '2rem' }}>No orders found.</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {/* Show most recent orders first */}
                        {[...orders].reverse().map(order => {
                            const summary = getBriefSummary(order.items);
                            return (
                                <div key={order.id} style={{
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    padding: '1rem', borderBottom: '1px solid var(--color-border)'
                                }}>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.25rem' }}>
                                            <span style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>{order.date}</span>
                                            <span style={{
                                                fontSize: '0.75rem',
                                                padding: '0.1rem 0.5rem',
                                                borderRadius: '1rem',
                                                background: order.status === 'completed' ? 'rgba(52, 211, 153, 0.2)' : 'rgba(251, 191, 36, 0.2)',
                                                color: order.status === 'completed' ? '#34d399' : '#fbbf24'
                                            }}>
                                                {order.status.toUpperCase()}
                                            </span>
                                        </div>
                                        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                                            {summary.totalCount} items: {summary.description}
                                        </p>
                                    </div>
                                    <div style={{ textAlign: 'right', fontSize: '0.8rem', color: 'var(--color-text-dim)', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                                        <span>ID: {order.id.slice(-6)}</span>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                onClick={() => handleEdit(order)}
                                                className="btn btn-secondary"
                                                style={{ padding: '0.25rem', display: 'flex', alignItems: 'center' }}
                                                title="Edit Order"
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(order.id)}
                                                className="btn btn-secondary"
                                                style={{ padding: '0.25rem', color: '#f87171', display: 'flex', alignItems: 'center' }}
                                                title="Delete Order"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LocationDashboard;
