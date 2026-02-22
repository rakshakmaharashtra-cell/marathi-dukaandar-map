import React, { useState } from 'react';
import { X, Heart, Share2, Navigation, Trash2, Clock, MapPin, ChevronLeft, ChevronRight, Edit } from 'lucide-react';
import EditShopModal from './EditShopModal';

const CATEGORY_COLORS = {
    Food: '#ef4444',
    Clothing: '#8b5cf6',
    Services: '#3b82f6',
    Groceries: '#22c55e',
    Electronics: '#f59e0b',
    Other: '#6b7280',
};

/**
 * Full-detail slide-in drawer for a selected shop.
 * Image carousel, shop info, and action buttons.
 */
export default function ShopDetailDrawer({ shop, onClose, isFavorite, onToggleFavorite, onDelete, onShare, onEdit, canEdit }) {
    const [imgIndex, setImgIndex] = useState(0);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const images = shop.images || [];

    const handleDirections = () => {
        const [lat, lng] = shop.position;
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
    };

    const handleDelete = () => {
        if (confirmDelete) {
            onDelete(shop.id);
            onClose();
        } else {
            setConfirmDelete(true);
            setTimeout(() => setConfirmDelete(false), 3000);
        }
    };

    const createdDate = shop.created_at
        ? new Date(shop.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
        : null;

    return (
        <div className="detail-overlay animate-fade" onClick={onClose}>
            <div className="detail-drawer animate-slide-up" onClick={(e) => e.stopPropagation()}>
                <button className="detail-close" onClick={onClose}>
                    <X size={20} />
                </button>

                {/* Image carousel */}
                {images.length > 0 ? (
                    <div className="detail-carousel">
                        <img src={images[imgIndex]} alt={`${shop.name} ${imgIndex + 1}`} className="detail-image" />
                        {images.length > 1 && (
                            <>
                                <button
                                    className="carousel-btn carousel-prev"
                                    onClick={() => setImgIndex((i) => (i - 1 + images.length) % images.length)}
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <button
                                    className="carousel-btn carousel-next"
                                    onClick={() => setImgIndex((i) => (i + 1) % images.length)}
                                >
                                    <ChevronRight size={20} />
                                </button>
                                <div className="carousel-dots">
                                    {images.map((_, i) => (
                                        <div
                                            key={i}
                                            className={`carousel-dot ${i === imgIndex ? 'active' : ''}`}
                                            onClick={() => setImgIndex(i)}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="detail-no-image">
                        <MapPin size={36} />
                        <span>No photos yet</span>
                    </div>
                )}

                {/* Shop info */}
                <div className="detail-body">
                    <div className="detail-header-row">
                        <h2 className="detail-name">{shop.name}</h2>
                        <span
                            className="detail-category"
                            style={{ background: CATEGORY_COLORS[shop.category] || '#6b7280' }}
                        >
                            {shop.category}
                        </span>
                    </div>

                    {shop.owner_name && (
                        <div className="detail-field">
                            <span className="detail-label">Owner</span>
                            <span className="detail-value">👤 {shop.owner_name}</span>
                        </div>
                    )}

                    {shop.description && (
                        <div className="detail-field">
                            <span className="detail-label">About</span>
                            <span className="detail-value">{shop.description}</span>
                        </div>
                    )}

                    {shop.position && (
                        <div className="detail-field">
                            <span className="detail-label">Location</span>
                            <span className="detail-value detail-coords">
                                📌 {shop.position[0]?.toFixed(5)}, {shop.position[1]?.toFixed(5)}
                            </span>
                        </div>
                    )}

                    {createdDate && (
                        <div className="detail-field">
                            <span className="detail-label">Added</span>
                            <span className="detail-value">
                                <Clock size={13} /> {createdDate}
                            </span>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="detail-actions">
                    <button
                        className={`detail-action-btn ${isFavorite ? 'fav-active' : ''}`}
                        onClick={() => onToggleFavorite(shop.id)}
                    >
                        <Heart size={18} fill={isFavorite ? '#ef4444' : 'none'} />
                        <span>{isFavorite ? 'Favorited' : 'Favorite'}</span>
                    </button>
                    <button className="detail-action-btn" onClick={onShare}>
                        <Share2 size={18} />
                        <span>Share</span>
                    </button>
                    <button className="detail-action-btn" onClick={handleDirections}>
                        <Navigation size={18} />
                        <span>Directions</span>
                    </button>
                    {canEdit && (
                        <>
                            <button
                                className="detail-action-btn detail-edit-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsEditing(true);
                                }}
                                style={{ color: '#3b82f6' }}
                            >
                                <Edit size={18} />
                                <span>Edit</span>
                            </button>
                            <button
                                className={`detail-action-btn detail-delete-btn ${confirmDelete ? 'confirm' : ''}`}
                                onClick={handleDelete}
                            >
                                <Trash2 size={18} />
                                <span>{confirmDelete ? 'Confirm?' : 'Delete'}</span>
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Edit Modal */}
            {isEditing && (
                <EditShopModal
                    shop={shop}
                    onClose={() => setIsEditing(false)}
                    onSave={onEdit}
                />
            )}
        </div>
    );
}
