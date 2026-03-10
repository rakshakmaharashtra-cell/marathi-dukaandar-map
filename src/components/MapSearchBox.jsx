import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X, Loader2 } from 'lucide-react';

export default function MapSearchBox({ shops = [], userLocation, onSelectShop, onSelectLocation }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

    const handleSearch = (text) => {
        setQuery(text);

        const trimmed = text.trim().toLowerCase();
        if (trimmed.length < 1) {
            setResults([]);
            setShowDropdown(false);
            return;
        }

        setShowDropdown(true);

        // Check if user is asking for nearby
        const isNearMe = trimmed.includes('near me') || trimmed.includes('nearby');
        const cleanText = trimmed.replace(/near me|nearby/g, '').trim();

        // Calculate distances for all shops (using map center as user location)
        const shopsWithDistance = shops.map(shop => {
            let distance = null;
            if (userLocation && userLocation.latitude && shop.position) {
                // Haversine formula
                const R = 6371; // km
                const dLat = (shop.position[0] - userLocation.latitude) * Math.PI / 180;
                const dLon = (shop.position[1] - userLocation.longitude) * Math.PI / 180;
                const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos(userLocation.latitude * Math.PI / 180) * Math.cos(shop.position[0] * Math.PI / 180) *
                    Math.sin(dLon / 2) * Math.sin(dLon / 2);
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                distance = R * c;
            }
            return { ...shop, distance };
        });

        // Filter valid matches based on real search text (ignoring "near me")
        let matched = shopsWithDistance;

        if (cleanText.length > 0) {
            matched = shopsWithDistance.filter(shop => {
                const matchName = shop.name?.toLowerCase().includes(cleanText);
                const matchCategory = shop.category?.toLowerCase().includes(cleanText);
                const matchDesc = shop.description?.toLowerCase().includes(cleanText);
                const matchOwner = shop.owner_name?.toLowerCase().includes(cleanText);
                return matchName || matchCategory || matchDesc || matchOwner;
            });
        }

        // Sort results
        if (userLocation) {
            // If location is known, sort by distance, closest first
            matched.sort((a, b) => (a.distance || 0) - (b.distance || 0));
        }

        // Limit results to top 6
        setResults(matched.slice(0, 6));
    };

    const handleSelect = (shop) => {
        onSelectLocation({
            longitude: shop.position[1],
            latitude: shop.position[0],
            zoom: 16 // Zoom in tightly
        });
        if (onSelectShop) onSelectShop(shop);
        setShowDropdown(false);
        setQuery('');
    };

    return (
        <div className="map-search-container">
            <div style={{
                display: 'flex',
                alignItems: 'center',
                background: 'var(--bg-glass)',
                backdropFilter: 'blur(16px)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border)',
                padding: '8px 16px',
                boxShadow: 'var(--shadow-md)',
                transition: 'var(--transition)'
            }}>
                <Search size={18} color="var(--text-muted)" />
                <input
                    type="text"
                    placeholder="Search shops, food, services..."
                    value={query}
                    onChange={(e) => handleSearch(e.target.value)}
                    style={{
                        flex: 1,
                        border: 'none',
                        background: 'transparent',
                        padding: '6px 10px',
                        outline: 'none',
                        color: 'var(--text-primary)',
                        fontSize: '0.9rem'
                    }}
                />
                {query ? (
                    <button onClick={() => { setQuery(''); setResults([]); setShowDropdown(false); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                        <X size={16} color="var(--text-muted)" />
                    </button>
                ) : null}
            </div>

            {showDropdown && query.length > 0 && (
                <div className="animate-slide-up" style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    left: 0,
                    width: '100%',
                    background: 'var(--bg-card)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                    boxShadow: 'var(--shadow-lg)',
                    overflow: 'hidden'
                }}>
                    {results.length > 0 ? results.map((shop, i) => (
                        <button
                            key={shop.id || i}
                            onClick={() => handleSelect(shop)}
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                background: 'transparent',
                                border: 'none',
                                borderBottom: i < results.length - 1 ? '1px solid var(--border)' : 'none',
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '10px',
                                cursor: 'pointer',
                                textAlign: 'left',
                                transition: 'var(--transition)'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                            <MapPin size={16} color="var(--saffron)" style={{ flexShrink: 0, marginTop: '2px' }} />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: '500', lineHeight: 1.2 }}>
                                    {shop.name}
                                </span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    <span style={{ color: 'var(--primary)', fontWeight: '600' }}>{shop.category}</span>
                                    {shop.distance !== null && ` • ${shop.distance < 1 ? (shop.distance * 1000).toFixed(0) + 'm' : shop.distance.toFixed(1) + 'km'}`}
                                    {shop.description ? ` • ${shop.description.substring(0, 25)}...` : ''}
                                </span>
                            </div>
                        </button>
                    )) : (
                        <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                            No shops found matching "{query}"
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
