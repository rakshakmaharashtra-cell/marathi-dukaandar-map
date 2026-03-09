import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, MapPin, Store, Phone, Navigation } from 'lucide-react';
import { useTranslation } from '../i18n.jsx';

const CATEGORY_COLORS = {
    Food: '#ef4444',
    Clothing: '#8b5cf6',
    Services: '#3b82f6',
    Groceries: '#22c55e',
    Electronics: '#f59e0b',
    Other: '#6b7280',
};

// Haversine formula to get distance in km
function getDistanceInKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

export default function DashboardView({ shops, onBack, onShopClick }) {
    const { t } = useTranslation();
    const [userLocation, setUserLocation] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [locating, setLocating] = useState(true);

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                    setLocating(false);
                },
                (error) => {
                    console.error("Error getting location: ", error);
                    setLocating(false);
                },
                { enableHighAccuracy: true, timeout: 5000 }
            );
        } else {
            setLocating(false);
        }
    }, []);

    // Filter and sort shops
    let processedShops = [...shops];

    if (userLocation) {
        // Calculate distance for all shops
        processedShops = processedShops.map(shop => {
            const distance = getDistanceInKm(
                userLocation.lat, userLocation.lng,
                shop.position[0], shop.position[1]
            );
            return { ...shop, distance };
        });

        // Filter within 1km
        processedShops = processedShops.filter(shop => shop.distance <= 1.0);

        // Sort by closest first
        processedShops.sort((a, b) => a.distance - b.distance);
    } else {
        // Just sort alphabetically if no location
        processedShops.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (searchTerm) {
        processedShops = processedShops.filter(s =>
            s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.category?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-dark)' }}>
            {/* Header */}
            <header style={{ background: 'var(--bg-card)', padding: '15px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '15px', position: 'sticky', top: 0, zIndex: 10 }}>
                <button
                    onClick={onBack}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', padding: '5px' }}
                >
                    <ArrowLeft size={24} />
                </button>
                <div style={{ flex: 1 }}>
                    <h1 style={{ fontSize: '1.2rem', margin: 0, color: 'var(--text-primary)' }}>Local Directory</h1>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={12} /> {locating ? 'Finding your location...' : userLocation ? 'Showing shops within 1km' : 'Location unavailable'}
                    </p>
                </div>
            </header>

            {/* Search */}
            <div style={{ padding: '20px 20px 10px' }}>
                <div className="search-input-wrapper" style={{ background: 'var(--bg-card)' }}>
                    <Search size={18} />
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search for restaurants, stores, services..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ padding: '10px' }}
                    />
                </div>
            </div>

            {/* List */}
            <div style={{ padding: '10px 20px 20px', flex: 1, overflowY: 'auto' }}>
                {locating ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                        <div className="locate-spinner" style={{ margin: '0 auto 15px', borderColor: 'var(--saffron) var(--border) var(--border) var(--border)' }}></div>
                        <p>Finding shops near you...</p>
                    </div>
                ) : processedShops.length === 0 ? (
                    <div className="empty-state" style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)' }}>
                        <Store size={48} color="var(--text-muted)" />
                        <h3>No shops found</h3>
                        <p>{userLocation ? "There seem to be no Marathi shops within 1km of your current location." : "Could not find any matching shops."}</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '15px', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                        {processedShops.map((shop) => (
                            <div
                                key={shop.id}
                                style={{
                                    background: 'var(--bg-card)',
                                    border: '1px solid var(--border)',
                                    borderRadius: 'var(--radius-lg)',
                                    padding: '15px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '12px',
                                    transition: 'var(--transition)',
                                    cursor: 'pointer'
                                }}
                                onClick={() => onShopClick(shop)}
                                onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--saffron)'}
                                onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
                            >
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    {shop.images?.length > 0 ? (
                                        <img src={shop.images[0]} alt={shop.name} style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }} />
                                    ) : (
                                        <div style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                                            <Store size={32} />
                                        </div>
                                    )}
                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                        <h3 style={{ fontSize: '1.1rem', margin: '0 0 4px', color: 'var(--text-primary)' }}>{shop.name}</h3>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                                            <span style={{
                                                background: CATEGORY_COLORS[shop.category] || '#6b7280',
                                                color: '#fff',
                                                padding: '2px 8px',
                                                borderRadius: '12px',
                                                fontSize: '0.7rem',
                                                fontWeight: 600
                                            }}>
                                                {shop.category}
                                            </span>
                                            {shop.distance !== undefined && (
                                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                                    • {shop.distance < 1 ? Math.round(shop.distance * 1000) + 'm' : shop.distance.toFixed(1) + 'km'}
                                                </span>
                                            )}
                                        </div>
                                        {shop.owner_name && <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>👤 {shop.owner_name}</p>}
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                                    {shop.phone && (
                                        <a
                                            href={`tel:${shop.phone}`}
                                            onClick={(e) => e.stopPropagation()}
                                            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '8px', background: 'var(--success)', color: '#fff', textDecoration: 'none', borderRadius: 'var(--radius-md)', fontSize: '0.9rem', fontWeight: 500 }}
                                        >
                                            <Phone size={16} /> Call
                                        </a>
                                    )}
                                    <a
                                        href={`https://www.google.com/maps/dir/?api=1&destination=${shop.position[0]},${shop.position[1]}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '8px', background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-primary)', textDecoration: 'none', borderRadius: 'var(--radius-md)', fontSize: '0.9rem', fontWeight: 500 }}
                                    >
                                        <Navigation size={16} /> Get Directions
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
