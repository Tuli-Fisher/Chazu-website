import React, { useState } from 'react';
import AdminNav from '../../components/AdminNav';
import { CreditCard, Heart, DollarSign } from 'lucide-react';

const AdminFinance = () => {
    // Donation State
    const [donationName, setDonationName] = useState('');
    const [donationAmount, setDonationAmount] = useState('');
    const [donationNote, setDonationNote] = useState('');

    // Payment State
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [payAmount, setPayAmount] = useState('');

    const handleDonation = (e) => {
        e.preventDefault();
        alert(`Donation of $${donationAmount} from ${donationName} recorded! (Demo)`);
        setDonationName('');
        setDonationAmount('');
        setDonationNote('');
    };

    const handlePayment = (e) => {
        e.preventDefault();
        alert(`Charge of $${payAmount} to card ending in ${cardNumber.slice(-4)} processed! (Demo)`);
        setCardNumber('');
        setExpiry('');
        setCvv('');
        setPayAmount('');
    };

    return (
        <div>
            <h1 style={{ marginBottom: 'var(--space-md)' }}>HQ Management</h1>
            <AdminNav />

            <h2>Finance & POS</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 'var(--space-lg)', marginTop: 'var(--space-md)' }}>

                {/* Donations Panel */}
                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
                        <Heart color="#ec4899" />
                        <h3 style={{ margin: 0 }}>Record Donation</h3>
                    </div>

                    <form onSubmit={handleDonation} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.9rem' }}>Donor Name</label>
                            <input
                                required
                                value={donationName}
                                onChange={e => setDonationName(e.target.value)}
                                placeholder="Anonymous"
                                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.9rem' }}>Amount ($)</label>
                            <input
                                required
                                type="number"
                                min="0" step="0.01"
                                value={donationAmount}
                                onChange={e => setDonationAmount(e.target.value)}
                                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.9rem' }}>Note (Optional)</label>
                            <textarea
                                value={donationNote}
                                onChange={e => setDonationNote(e.target.value)}
                                rows={3}
                                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
                            />
                        </div>
                        <button className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
                            Log Donation
                        </button>
                    </form>
                </div>

                {/* Credit Card Processing */}
                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
                        <CreditCard color="#3b82f6" />
                        <h3 style={{ margin: 0 }}>Process Card Payment</h3>
                    </div>

                    <form onSubmit={handlePayment} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.9rem' }}>Amount ($)</label>
                            <div style={{ position: 'relative' }}>
                                <DollarSign size={16} style={{ position: 'absolute', left: '8px', top: '10px', color: '#888' }} />
                                <input
                                    required
                                    type="number"
                                    min="0" step="0.01"
                                    value={payAmount}
                                    onChange={e => setPayAmount(e.target.value)}
                                    style={{ width: '100%', padding: '0.5rem 0.5rem 0.5rem 2rem', borderRadius: '4px', border: '1px solid #ddd' }}
                                />
                            </div>
                        </div>

                        <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.8rem', textTransform: 'uppercase', color: '#64748b' }}>Card Number</label>
                                <input
                                    required
                                    placeholder="0000 0000 0000 0000"
                                    value={cardNumber}
                                    onChange={e => setCardNumber(e.target.value)}
                                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.8rem', textTransform: 'uppercase', color: '#64748b' }}>Expiry</label>
                                    <input
                                        required
                                        placeholder="MM/YY"
                                        value={expiry}
                                        onChange={e => setExpiry(e.target.value)}
                                        style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.8rem', textTransform: 'uppercase', color: '#64748b' }}>CVV</label>
                                    <input
                                        required
                                        placeholder="123"
                                        value={cvv}
                                        onChange={e => setCvv(e.target.value)}
                                        style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
                                    />
                                </div>
                            </div>
                        </div>

                        <button className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
                            Charge Card
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
};

export default AdminFinance;
