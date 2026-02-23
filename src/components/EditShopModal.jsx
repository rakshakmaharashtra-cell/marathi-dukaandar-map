import React, { useState } from 'react';
import { X, Check } from 'lucide-react';

const CATEGORIES = [
    { value: 'Food', label: '🍛 Food' },
    { value: 'Clothing', label: '👕 Clothing' },
    { value: 'Services', label: '🔧 Services' },
    { value: 'Groceries', label: '🛒 Groceries' },
    { value: 'Electronics', label: '📱 Electronics' },
    { value: 'Other', label: '📦 Other' },
];

export default function EditShopModal({ shop, onClose, onSave }) {
    const [formData, setFormData] = useState({
        name: shop.name || '',
        owner_name: shop.owner_name || '',
        category: shop.category || 'Food',
        description: shop.description || '',
        phone: shop.phone || '',
        opening_hours: shop.opening_hours || '',
    });
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        const success = await onSave(shop.id, formData);
        setSubmitting(false);
        if (success) {
            onClose();
        }
    };

    return (
        <div className="admin-login-overlay animate-fade" style={{ zIndex: 9999 }} onClick={onClose}>
            <div className="modal-card animate-slide-up" style={{
                maxWidth: '450px',
                width: '90%',
                background: 'var(--bg-card)',
                borderRadius: 'var(--radius-lg)',
                padding: '24px',
                boxShadow: 'var(--shadow-lg)'
            }} onClick={(e) => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div>
                        <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)' }}>Edit Shop Details</h2>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>Update information for {shop.name}</p>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)' }}>
                        <X size={20} />
                    </button>
                </div>

                <form className="modal-form" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Shop Name *</label>
                        <input
                            type="text"
                            name="name"
                            className="form-input"
                            style={{ padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Owner Name</label>
                        <input
                            type="text"
                            name="owner_name"
                            className="form-input"
                            style={{ padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}
                            value={formData.owner_name}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Category *</label>
                        <select
                            name="category"
                            className="form-input"
                            style={{ padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}
                            value={formData.category}
                            onChange={handleChange}
                            required
                        >
                            {CATEGORIES.map(cat => (
                                <option key={cat.value} value={cat.value}>
                                    {cat.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            name="description"
                            className="form-input"
                            style={{ padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                        />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div className="form-group">
                            <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Phone</label>
                            <input
                                type="text"
                                name="phone"
                                className="form-input"
                                style={{ padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Hours</label>
                            <input
                                type="text"
                                name="opening_hours"
                                className="form-input"
                                style={{ padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}
                                value={formData.opening_hours}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="auth-actions">
                        <button type="submit" className="btn-submit" disabled={submitting}>
                            {submitting ? 'Saving...' : <><Check size={18} /> Save Changes</>}
                        </button>
                        <button type="button" className="btn-cancel" onClick={onClose} disabled={submitting}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
