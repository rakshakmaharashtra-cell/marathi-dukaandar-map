import React, { useState, useMemo } from 'react';
import Map, { Marker, Popup, GeolocateControl, NavigationControl } from '@vis.gl/react-maplibre';
import maplibregl from 'maplibre-gl';
import { Layers, Utensils, Shirt, Wrench, ShoppingCart, Smartphone, Package, Store } from 'lucide-react';
import 'maplibre-gl/dist/maplibre-gl.css';
import MapSearchBox from './components/MapSearchBox';

// Category colors for custom markers
const CATEGORY_COLORS = {
    Food: '#ef4444',
    Clothing: '#8b5cf6',
    Services: '#3b82f6',
    Groceries: '#22c55e',
    Electronics: '#f59e0b',
    Other: '#6b7280',
};

// Map tile layers transformed for MapLibre raster structure
const MAP_LAYERS = [
    {
        id: 'default',
        label: 'Default',
        url: 'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '&copy; OpenStreetMap',
        thumb: 'https://a.tile.openstreetmap.org/5/15/10.png',
    },
    {
        id: 'satellite',
        label: 'Satellite',
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        attribution: '&copy; Esri',
        thumb: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/5/10/15',
    },
    {
        id: 'terrain',
        label: 'Terrain',
        url: 'https://a.tile.opentopomap.org/{z}/{x}/{y}.png',
        attribution: '&copy; OpenTopoMap',
        thumb: 'https://a.tile.opentopomap.org/5/15/10.png',
    },
    {
        id: 'dark',
        label: 'Dark',
        url: 'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
        attribution: '&copy; CARTO',
        thumb: 'https://a.basemaps.cartocdn.com/dark_all/5/15/10.png',
    },
    {
        id: 'light',
        label: 'Light',
        url: 'https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
        attribution: '&copy; CARTO',
        thumb: 'https://a.basemaps.cartocdn.com/light_all/5/15/10.png',
    },
];

const makeRasterStyle = (layer) => ({
    version: 8,
    sources: {
        'raster-tiles': {
            type: 'raster',
            tiles: [layer.url],
            tileSize: 256,
            attribution: layer.attribution,
            maxzoom: 19,
        },
    },
    layers: [
        {
            id: 'simple-tiles',
            type: 'raster',
            source: 'raster-tiles',
            minzoom: 0,
            maxzoom: 22,
        },
    ],
});

/**
 * Full-screen map with shop markers, geolocation, layer switcher,
 * and click-to-add functionality.
 */
export default function MapView({ shops, onMapClick, isAddingMode, onShopClick, isFavorite }) {
    const [viewState, setViewState] = useState({
        longitude: 72.8777,
        latitude: 19.076,
        zoom: 7,
    });

    const [layerIndex, setLayerIndex] = useState(0);
    const [showLayerMenu, setShowLayerMenu] = useState(false);
    const [popupInfo, setPopupInfo] = useState(null);
    const currentLayer = MAP_LAYERS[layerIndex];
    const mapStyle = useMemo(() => makeRasterStyle(currentLayer), [currentLayer]);

    const handleMapClick = (event) => {
        if (isAddingMode && onMapClick) {
            // event.lngLat is {lng, lat}
            onMapClick({ lat: event.lngLat.lat, lng: event.lngLat.lng });
        } else {
            setPopupInfo(null);
        }
    };

    return (
        <div className="map-area">
            <Map
                {...viewState}
                onMove={(evt) => setViewState(evt.viewState)}
                style={{ width: '100%', height: '100%' }}
                mapStyle={mapStyle}
                mapLib={maplibregl}
                onClick={handleMapClick}
                cursor={isAddingMode ? 'crosshair' : 'grab'}
                maxZoom={19}
            >
                <GeolocateControl position="bottom-right" style={{ marginBottom: '120px' }} />
                <NavigationControl position="bottom-right" style={{ marginBottom: '160px' }} showCompass={false} />

                {shops.map((shop) => {
                    const color = CATEGORY_COLORS[shop.category] || '#f97316';
                    const isFav = isFavorite && isFavorite(shop.id);
                    return (
                        <Marker
                            key={shop.id}
                            longitude={shop.position[1]}
                            latitude={shop.position[0]}
                            anchor="center"
                            onClick={(e) => {
                                e.originalEvent.stopPropagation();
                                setPopupInfo(shop);
                                if (onShopClick) onShopClick(shop);
                            }}
                        >
                            <div style={{
                                cursor: 'pointer',
                                position: 'relative',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center'
                            }}>
                                <div style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    backgroundColor: color,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.3), 0 0 0 3px var(--bg-card)',
                                    position: 'relative',
                                    transition: 'transform 0.2s',
                                }}
                                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.15) translateY(-4px)'}
                                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                >
                                    {/* Icon */}
                                    <div style={{ color: '#fff', display: 'flex' }}>
                                        {shop.category === 'Food' ? <Utensils size={16} /> :
                                            shop.category === 'Clothing' ? <Shirt size={16} /> :
                                                shop.category === 'Services' ? <Wrench size={16} /> :
                                                    shop.category === 'Groceries' ? <ShoppingCart size={16} /> :
                                                        shop.category === 'Electronics' ? <Smartphone size={16} /> :
                                                            <Store size={16} />}
                                    </div>

                                    {/* Pin bottom indicator */}
                                    <div style={{
                                        position: 'absolute',
                                        bottom: '-8px',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        width: '0',
                                        height: '0',
                                        borderLeft: '6px solid transparent',
                                        borderRight: '6px solid transparent',
                                        borderTop: `8px solid var(--bg-card)`,
                                        zIndex: -1
                                    }}></div>
                                    <div style={{
                                        position: 'absolute',
                                        bottom: '-4px',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        width: '0',
                                        height: '0',
                                        borderLeft: '4px solid transparent',
                                        borderRight: '4px solid transparent',
                                        borderTop: `6px solid ${color}`,
                                    }}></div>
                                    {isFav && (
                                        <div style={{
                                            position: 'absolute', top: '-4px', right: '-4px',
                                            background: 'var(--bg-card)', borderRadius: '50%', width: '12px', height: '12px',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            boxShadow: 'var(--shadow-sm)'
                                        }}>
                                            <span style={{ fontSize: '8px', color: '#ef4444' }}>♥</span>
                                        </div>
                                    )}
                                </div>
                                {viewState.zoom >= 14 && (
                                    <div className="animate-fade" style={{
                                        marginTop: '6px',
                                        backgroundColor: 'var(--bg-glass)',
                                        backdropFilter: 'blur(8px)',
                                        WebkitBackdropFilter: 'blur(8px)',
                                        padding: '4px 10px',
                                        borderRadius: 'var(--radius-xl)',
                                        fontSize: '0.75rem',
                                        fontWeight: '600',
                                        color: 'var(--text-primary)',
                                        boxShadow: 'var(--shadow-sm)',
                                        border: '1px solid var(--border)',
                                        whiteSpace: 'nowrap',
                                    }}>
                                        {shop.name}
                                    </div>
                                )}
                            </div>
                        </Marker>
                    );
                })}

                {popupInfo && (
                    <Popup
                        longitude={popupInfo.position[1]}
                        latitude={popupInfo.position[0]}
                        anchor="bottom"
                        offset={[0, -42]}
                        onClose={() => setPopupInfo(null)}
                        closeOnClick={false}
                        maxWidth="300px"
                    >
                        <div className="popup-content">
                            {popupInfo.images?.length > 0 && (
                                <div className="popup-images">
                                    {popupInfo.images.slice(0, 3).map((img, i) => (
                                        <img key={i} src={img} alt={`${popupInfo.name} ${i + 1}`} className="popup-image" />
                                    ))}
                                </div>
                            )}
                            <div className="popup-name">{popupInfo.name}</div>
                            {popupInfo.owner_name && <div className="popup-owner">👤 {popupInfo.owner_name}</div>}
                            <span
                                className="popup-badge"
                                style={{ background: CATEGORY_COLORS[popupInfo.category] || '#6b7280' }}
                            >
                                {popupInfo.category}
                            </span>
                            {popupInfo.description && <div className="popup-desc">{popupInfo.description}</div>}
                            <div className="popup-coords">
                                📌 {popupInfo.position[0]?.toFixed(4)}, {popupInfo.position[1]?.toFixed(4)}
                            </div>
                            <button
                                className="popup-detail-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (onShopClick) onShopClick(popupInfo);
                                }}
                            >
                                View Details →
                            </button>
                        </div>
                    </Popup>
                )}
            </Map>

            {/* Layer Switcher */}
            <div className="layer-switcher-wrap" style={{ bottom: '220px' }}>
                <button
                    className="map-control-btn layer-btn"
                    onClick={() => setShowLayerMenu((prev) => !prev)}
                    title="Map type"
                >
                    <Layers size={20} />
                </button>
                {showLayerMenu && (
                    <div className="layer-panel animate-pop" onClick={(e) => e.stopPropagation()}>
                        <div className="layer-panel-header">
                            <span>Map type</span>
                            <button className="layer-panel-close" onClick={() => setShowLayerMenu(false)}>
                                ✕
                            </button>
                        </div>
                        <div className="layer-grid">
                            {MAP_LAYERS.map((layer, i) => (
                                <button
                                    key={layer.id}
                                    className={`layer-tile ${i === layerIndex ? 'active' : ''}`}
                                    onClick={() => {
                                        setLayerIndex(i);
                                        setShowLayerMenu(false);
                                    }}
                                >
                                    <img src={layer.thumb} alt={layer.label} className="layer-tile-img" />
                                    <span className="layer-tile-label">{layer.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Map Search Overlay */}
            {!isAddingMode && (
                <MapSearchBox
                    shops={shops}
                    userLocation={viewState}
                    onSelectShop={(shop) => {
                        setPopupInfo(shop);
                        if (onShopClick) onShopClick(shop);
                    }}
                    onSelectLocation={(loc) => setViewState({
                        ...viewState,
                        ...loc,
                        transitionDuration: 1000 // Smooth panning transition to the location
                    })}
                />
            )}

            {/* Adding mode banner */}
            {isAddingMode && (
                <div className="adding-banner animate-bounce-banner">📍 Tap on the map to place your shop</div>
            )}
        </div>
    );
}
