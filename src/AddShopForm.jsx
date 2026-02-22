import React, { useState, useRef } from 'react';
import { X, Check, ImagePlus, Trash2, MapPin } from 'lucide-react';

const CATEGORIES = [
    { value: 'Food', label: '🍛 Food & Snacks' },
    { value: 'Clothing', label: '👕 Clothing' },
    { value: 'Services', label: '🔧 Services' },
    { value: 'Groceries', label: '🛒 Groceries (Kirana)' },
    { value: 'Electronics', label: '📱 Electronics' },
    { value: 'Other', label: '📦 Other' },
];

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

/**
 * Modal form for adding a new shop.
 * Supports multiple image upload (base64), category chips, auto-populated coordinates.
 */
export default function AddShopForm({ position, onSubmit, onCancel }) {
    const [name, setName] = useState('');
    const [ownerName, setOwnerName] = useState('');
    const [category, setCategory] = useState('Food');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    const lat = position ? position.lat.toFixed(6) : '19.076000';
    const lng = position ? position.lng.toFixed(6) : '72.877700';

    const handleImageChange = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setIsUploading(true);
        try {
            const newImages = await Promise.all(
                files.map(async (file) => ({
                    base64: await fileToBase64(file),
                    name: file.name,
                }))
            );
            setImages((prev) => [...prev, ...newImages].slice(0, 5));
        } catch (err) {
            console.error('Image upload error:', err);
        }
        setIsUploading(false);

        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const removeImage = (index) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    // Strip HTML tags and limit length to prevent XSS
    function sanitizeText(text, maxLength = 500) {
        return text.replace(/<[^>]*>/g, '').trim().slice(0, maxLength);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const cleanName = sanitizeText(name, 100);
        const cleanOwner = sanitizeText(ownerName, 100);
        const cleanDesc = sanitizeText(description, 1000);

        if (!cleanName || !cleanOwner) return;

        onSubmit({
            name: cleanName,
            owner_name: cleanOwner,
            category,
            description: cleanDesc,
            images: images.map((img) => img.base64),
            position: [parseFloat(lat), parseFloat(lng)],
        });
    };

    return (
        <div className="modal-overlay animate-fade" onClick={onCancel}>
            <div className="add-shop-form animate-pop" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="form-header">
                    <div>
                        <h2>🏪 Add New Shop</h2>
                        <p className="form-subtitle">Help grow the Marathi business community</p>
                    </div>
                    <button className="form-close-btn" onClick={onCancel} aria-label="Close">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Name + Owner */}
                    <div className="form-grid">
                        <div className="form-group">
                            <label>
                                Shop Name <span className="required">*</span>
                            </label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="e.g. Peshwe Bhel Center"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                autoFocus
                            />
                        </div>
                        <div className="form-group">
                            <label>
                                Owner Name <span className="required">*</span>
                            </label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="e.g. Rahul Patil"
                                value={ownerName}
                                onChange={(e) => setOwnerName(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Category */}
                    <div className="form-group">
                        <label>Category</label>
                        <div className="category-chips">
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat.value}
                                    type="button"
                                    className={`category-chip ${category === cat.value ? 'active' : ''}`}
                                    onClick={() => setCategory(cat.value)}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            className="form-input"
                            rows="2"
                            placeholder="Famous for... specialties..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    {/* Image Upload */}
                    <div className="form-group">
                        <label>
                            Shop Images <span className="optional">(up to 5)</span>
                        </label>
                        <div className="image-upload-area">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                multiple
                                className="file-input-hidden"
                                id="shop-images"
                                onChange={handleImageChange}
                            />
                            <label htmlFor="shop-images" className="image-upload-trigger">
                                <ImagePlus size={24} />
                                <span>{isUploading ? 'Processing...' : 'Click to add images'}</span>
                            </label>
                        </div>
                        {images.length > 0 && (
                            <div className="image-preview-grid">
                                {images.map((img, i) => (
                                    <div key={i} className="image-preview-item">
                                        <img src={img.base64} alt={img.name} />
                                        <button
                                            type="button"
                                            className="image-remove-btn"
                                            onClick={() => removeImage(i)}
                                            aria-label="Remove image"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Coordinates */}
                    <div className="coords-box">
                        <MapPin size={16} />
                        <span>
                            Location: {lat}, {lng}
                        </span>
                    </div>

                    {/* Submit */}
                    <div className="form-buttons">
                        <button type="button" className="btn-cancel" onClick={onCancel}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-submit" disabled={!name.trim() || !ownerName.trim()}>
                            <Check size={18} />
                            Add Shop (+50 pts)
                        </button>
                    </div>
                </form>

                <div className="form-hint">🎉 You'll earn 50 points for this contribution!</div>
            </div>
        </div>
    );
}
