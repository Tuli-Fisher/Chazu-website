import React, { useState } from 'react';
import { getMenuItems, createOrder } from '../services/storage';
import { Send, User } from 'lucide-react';

// Interactive chat-like interface for responding to HQ alerts
// Multi-step wizard: acknowledge → food → drinks → confirm
const ChatInterface = ({ alert, locationId, onComplete }) => {
    // Wizard State
    // Step 0: Acknowledge alert
    // Step 1: Select food items
    // Step 2: Select drinks
    // Step 3: Confirm order
    const [step, setStep] = useState(0);
    const [messages, setMessages] = useState([
        { id: 1, sender: 'system', text: alert.text }
    ]);
    const [cart, setCart] = useState({}); // itemId -> quantity

    // Helper to add user message
    const addUserMessage = (text) => {
        setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text }]);
    };

    // Helper to add system message (with delay for chat feel)
    const addSystemMessage = (text) => {
        setTimeout(() => {
            setMessages(prev => [...prev, { id: Date.now(), sender: 'system', text }]);
        }, 500);
    };

    // Wizard Logic
    const handleStart = () => {
        addUserMessage("I'm ready to order.");
        setStep(1);
        addSystemMessage("Great. Let's start with Food. What food items do you need? (Select from list)");
    };

    const handleItemToggle = (item, qty) => {
        setCart(prev => ({
            ...prev,
            [item.id]: (prev[item.id] || 0) + qty
        }));
    };

    const handleConfirmCategory = () => {
        if (step === 1) {
            addUserMessage("Finished with food.");
            setStep(2);
            addSystemMessage("Understood. Any Drinks?");
        } else if (step === 2) {
            addUserMessage("Finished with drinks.");
            setStep(3);
            generateSummary();
        }
    };

    const generateSummary = () => {
        const menuItems = getMenuItems();
        const summary = Object.entries(cart).map(([id, qty]) => {
            if (qty <= 0) return null;
            const item = menuItems.find(i => i.id === id);
            return `${qty}x ${item?.name}`;
        }).filter(Boolean).join(', ');

        addSystemMessage(`Okay, I have: ${summary || 'Nothing selected'}. Is this correct?`);
    };

    const handleFinalSubmit = (confirmed) => {
        if (confirmed) {
            addUserMessage("Yes, place order.");

            // Create order and mark alert as responded
            createOrder({
                locationId,
                items: cart,
                managerNotes: 'Ordered via Text Alert',
            });

            addSystemMessage("Order received. Thanks!");
            setTimeout(onComplete, 1500);
        } else {
            addUserMessage("No, let me redo it.");
            setCart({});
            setStep(1);
            addSystemMessage("Okay, starting over. What food items do you need?");
        }
    };

    const filteredItems = (type) => {
        return getMenuItems().filter(i => i.type === type);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '600px', border: '1px solid var(--color-border)', borderRadius: '12px', overflow: 'hidden', background: '#fff' }}>

            {/* Header */}
            <div style={{ padding: '1rem', background: 'var(--color-bg-card)', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: 10, height: 10, background: '#10b981', borderRadius: '50%' }} />
                <span style={{ fontWeight: 600 }}>HQ Support</span>
            </div>

            {/* Messages Area */}
            <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', background: 'var(--color-bg-app)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {messages.map(msg => (
                    <div key={msg.id} style={{
                        alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                        maxWidth: '80%',
                    }}>
                        <div style={{
                            padding: '0.75rem 1rem',
                            borderRadius: '12px',
                            background: msg.sender === 'user' ? 'var(--color-primary)' : '#fff',
                            color: msg.sender === 'user' ? '#fff' : 'var(--color-text-main)',
                            boxShadow: msg.sender !== 'user' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
                            borderTopLeftRadius: msg.sender === 'system' ? '0' : '12px',
                            borderTopRightRadius: msg.sender === 'user' ? '0' : '12px',
                        }}>
                            {msg.text}
                        </div>
                    </div>
                ))}
            </div>

            {/* Input / Wizard Area */}
            <div style={{ padding: '1rem', background: '#fff', borderTop: '1px solid var(--color-border)' }}>
                {step === 0 && (
                    <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleStart}>
                        Tap to Respond
                    </button>
                )}

                {(step === 1 || step === 2) && (
                    <div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.5rem', marginBottom: '1rem', maxHeight: '150px', overflowY: 'auto' }}>
                            {filteredItems(step === 1 ? 'food' : 'drink').map(item => (
                                <div key={item.id} style={{
                                    padding: '0.5rem',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: '6px',
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    fontSize: '0.85rem'
                                }}>
                                    <span>{item.name}</span>
                                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                        {cart[item.id] > 0 && <span>{cart[item.id]}</span>}
                                        <button
                                            onClick={() => handleItemToggle(item, 1)}
                                            style={{ background: 'var(--color-bg-app)', padding: '2px 6px', borderRadius: '4px' }}
                                        >+</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleConfirmCategory}>
                            Done adding {step === 1 ? 'Food' : 'Drinks'}
                        </button>
                    </div>
                )}

                {step === 3 && (
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => handleFinalSubmit(false)}>Cancel</button>
                        <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => handleFinalSubmit(true)}>Confirm Order</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatInterface;
