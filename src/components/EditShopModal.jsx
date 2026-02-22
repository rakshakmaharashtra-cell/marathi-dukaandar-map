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
        <div className="admin-login-overlay animate-fade" onClick={onClose}>
            <div className="auth-card animate-slide-up" style={{ maxWidth: '500px', width: '90%' }} onClick={(e) => e.stopPropagation()}>
                <div className="auth-header">
                    <h2>Edit Shop Details</h2>
                    <p>Update information for {shop.name}</p>
                    <button className="detail-close" onClick={onClose} style={{ top: '16px', right: '16px' }}>
                        <X size={20} />
                    </button>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Shop Name *</label>
                        <input
                            type="text"
                            name="name"
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
                            value={formData.owner_name}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Category *</label>
                        <select
                            name="category"
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
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                        />
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
