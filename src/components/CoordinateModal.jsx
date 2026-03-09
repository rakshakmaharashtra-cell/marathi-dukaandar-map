import React, { useState } from 'react';
import { X, MapPin } from 'lucide-react';

export default function CoordinateModal({ onClose, onSubmit }) {
    const [lat, setLat] = useState('');
    const [lng, setLng] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const latNum = parseFloat(lat);
        const lngNum = parseFloat(lng);
        if (!isNaN(latNum) && !isNaN(lngNum)) {
            onSubmit({ lat: latNum, lng: lngNum });
        }
    };

    return (
        <div className="modal-overlay animate-fade" onClick={onClose} style={{ zIndex: 10000 }}>
            <div className="add-shop-form animate-pop" onClick={(e) => e.stopPropagation()} style={{ width: '400px', maxWidth: '90%', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', position: 'fixed' }}>
                <div className="form-header">
                    <h2><MapPin size={20} /> Add by Coordinates</h2>
                    <button className="form-close-btn" type="button" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="form-body">
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div>
                            <label className="form-label" htmlFor="lat">Latitude</label>
                            <input
                                id="lat"
                                type="number"
                                step="any"
                                required
                                value={lat}
                                onChange={(e) => setLat(e.target.value)}
                                className="form-input"
                                placeholder="e.g. 19.0760"
                            />
                        </div>
                        <div>
                            <label className="form-label" htmlFor="lng">Longitude</label>
                            <input
                                id="lng"
                                type="number"
                                step="any"
                                required
                                value={lng}
                                onChange={(e) => setLng(e.target.value)}
                                className="form-input"
                                placeholder="e.g. 72.8777"
                            />
                        </div>

                        <div className="form-actions" style={{ marginTop: '10px' }}>
                            <button type="button" className="btn-cancel" onClick={onClose}>
                                Cancel
                            </button>
                            <button type="submit" className="btn-submit" disabled={!lat || !lng}>
                                Set Position
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
