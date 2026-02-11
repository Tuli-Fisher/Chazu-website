import React, { useState, useEffect } from 'react';
import { getLocations, saveLocations } from '../../services/storage';
import AdminNav from '../../components/AdminNav';
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react';

// HQ page: Manage locations (add, edit, delete)
const AdminLocations = () => {
    const [locations, setLocations] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    const [newLocName, setNewLocName] = useState('');

    // Edit state - tracks which location is being edited
    const [editId, setEditId] = useState(null);
    const [editName, setEditName] = useState('');

    useEffect(() => {
        setLocations(getLocations());
    }, []);

    const handleAdd = () => {
        if (!newLocName.trim()) return;
        // Generate unique ID using timestamp
        const newId = `loc-${Date.now()}`;
        const newLoc = { id: newId, name: newLocName.trim() };
        const updated = [...locations, newLoc];
        setLocations(updated);
        saveLocations(updated);
        setNewLocName('');
        setIsAdding(false);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this location?')) {
            const updated = locations.filter(l => l.id !== id);
            setLocations(updated);
            saveLocations(updated);
        }
    };

    const startEdit = (loc) => {
        setEditId(loc.id);
        setEditName(loc.name);
    };

    const saveEdit = () => {
        const updated = locations.map(l => l.id === editId ? { ...l, name: editName } : l);
        setLocations(updated);
        saveLocations(updated);
        setEditId(null);
    };

    return (
        <div>
            <h1 style={{ marginBottom: 'var(--space-md)' }}>HQ Management</h1>
            <AdminNav />

            <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
                    <h2>Locations Management</h2>
                    <button
                        className="btn btn-primary"
                        onClick={() => setIsAdding(true)}
                        disabled={isAdding}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <Plus size={18} /> Add Location
                    </button>
                </div>

                {isAdding && (
                    <div style={{
                        background: 'var(--color-bg-light)', padding: '1rem', borderRadius: 'var(--radius-md)',
                        marginBottom: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center',
                        border: '1px solid var(--color-primary)'
                    }}>
                        <input
                            autoFocus
                            placeholder="Location Name"
                            value={newLocName}
                            onChange={e => setNewLocName(e.target.value)}
                            style={{ flex: 1, padding: '0.5rem' }}
                        />
                        <button className="btn btn-primary" onClick={handleAdd}>Save</button>
                        <button className="btn btn-secondary" onClick={() => setIsAdding(false)}>Cancel</button>
                    </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {locations.map(loc => (
                        <div key={loc.id} style={{
                            padding: '1rem',
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-md)',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            background: '#fff'
                        }}>
                            {editId === loc.id ? (
                                <div style={{ display: 'flex', gap: '0.5rem', flex: 1 }}>
                                    <input
                                        value={editName}
                                        onChange={e => setEditName(e.target.value)}
                                        style={{ flex: 1, padding: '0.25rem' }}
                                    />
                                    <button onClick={saveEdit} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'green' }}><Save size={18} /></button>
                                    <button onClick={() => setEditId(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'gray' }}><X size={18} /></button>
                                </div>
                            ) : (
                                <>
                                    <div>
                                        <h3 style={{ fontSize: '1rem', margin: 0 }}>{loc.name}</h3>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>ID: {loc.id}</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            onClick={() => startEdit(loc)}
                                            style={{ padding: '0.5rem', background: 'var(--color-bg-light)', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                        >
                                            <Edit2 size={16} color="var(--color-text-main)" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(loc.id)}
                                            style={{ padding: '0.5rem', background: '#fee2e2', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                        >
                                            <Trash2 size={16} color="#ef4444" />
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminLocations;
