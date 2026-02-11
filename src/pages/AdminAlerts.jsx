import React, { useState, useEffect } from 'react';
import { getAlerts, createAlert, getLocations, getOrders } from '../services/storage';
import { Send, MessageSquare, CheckCircle, Clock } from 'lucide-react';

// HQ page: Send broadcast alerts to all location managers
// Shows response tracking (how many locations have responded)
const AdminAlerts = () => {
    const [alerts, setAlerts] = useState([]);
    const [locations, setLocations] = useState([]);
    const [newAlertText, setNewAlertText] = useState('');
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        refreshData();
        // Poll for updates (simulating real-time responses)
        const interval = setInterval(refreshData, 5000);
        return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    const refreshData = () => {
        setAlerts(getAlerts().reverse()); // Most recent first
        setLocations(getLocations());
    };

    const handleSendAlert = (e) => {
        e.preventDefault();
        if (!newAlertText.trim()) return;

        setIsSending(true);
        // Simulate network delay
        setTimeout(() => {
            createAlert(newAlertText);
            setNewAlertText('');
            setIsSending(false);
            refreshData();
        }, 800);
    };

    const getResponseCount = (alert) => {
        return alert.respondedLocations ? alert.respondedLocations.length : 0;
    };

    return (
        <div>
            <div style={{ marginBottom: 'var(--space-lg)' }}>
                <h1>Text Alerts</h1>
                <p style={{ color: 'var(--color-text-muted)' }}>Send daily prompts to location managers.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 'var(--space-lg)', alignItems: 'start' }}>

                {/* Compose Area */}
                <div className="card">
                    <h3 style={{ marginBottom: 'var(--space-md)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Send size={20} className="text-primary" /> New Broadcast
                    </h3>
                    <form onSubmit={handleSendAlert}>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Message Prompt</label>
                            <textarea
                                value={newAlertText}
                                onChange={(e) => setNewAlertText(e.target.value)}
                                rows={4}
                                placeholder="e.g. Good morning! What is your order for the Downtown delivery today?"
                                style={{ resize: 'vertical' }}
                            />
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={isSending || !newAlertText.trim()}
                            >
                                {isSending ? 'Sending...' : 'Send to All Locations'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Status / History */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                    {alerts.map(alert => (
                        <div key={alert.id} className="card" style={{
                            borderLeft: alert.active ? '4px solid var(--color-primary)' : '4px solid var(--color-border)',
                            opacity: alert.active ? 1 : 0.8
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    color: alert.active ? 'var(--color-primary)' : 'var(--color-text-muted)'
                                }}>
                                    {alert.active ? 'ACTIVE' : 'SENT'}
                                </span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                                    {new Date(alert.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                            <p style={{ fontStyle: 'italic', marginBottom: '1rem', color: 'var(--color-text-main)' }}>
                                "{alert.text}"
                            </p>

                            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '0.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        <MessageSquare size={14} /> Only Responses
                                    </span>
                                    <span style={{ fontWeight: 600 }}>
                                        {getResponseCount(alert)} / {locations.length}
                                    </span>
                                </div>
                                {/* Progress bar */}
                                <div style={{
                                    height: '4px',
                                    background: 'var(--color-border)',
                                    borderRadius: '2px',
                                    marginTop: '0.5rem',
                                    overflow: 'hidden'
                                }}>
                                    <div style={{
                                        height: '100%',
                                        width: `${(getResponseCount(alert) / locations.length) * 100}%`,
                                        background: 'var(--color-accent)'
                                    }} />
                                </div>
                            </div>
                        </div>
                    ))}
                    {alerts.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-dim)' }}>
                            No alerts sent yet.
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default AdminAlerts;
