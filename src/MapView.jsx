import React, { useState, useMemo } from 'react';
import Map, { Marker, Popup, GeolocateControl, NavigationControl } from '@vis.gl/react-maplibre';
import maplibregl from 'maplibre-gl';
import { Layers } from 'lucide-react';
import 'maplibre-gl/dist/maplibre-gl.css';

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
                            anchor="bottom"
                            onClick={(e) => {
                                e.originalEvent.stopPropagation();
                                setPopupInfo(shop);
                                if (onShopClick) onShopClick(shop);
                            }}
                        >
                            <div style={{ cursor: 'pointer', position: 'relative' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="42" viewBox="0 0 32 42">
                                    <defs>
                                        <filter id="shadow" x="-20%" y="-10%" width="140%" height="140%">
                                            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.3" />
                                        </filter>
                                    </defs>
                                    <path d="M16 0C7.2 0 0 7.2 0 16c0 12 16 26 16 26s16-14 16-26C32 7.2 24.8 0 16 0z"
                                        fill={color} filter="url(#shadow)" />
                                    <circle cx="16" cy="15" r="7" fill="white" opacity="0.9" />
                                    <text x="16" y="19" textAnchor="middle" fontSize="11" fill={color}>🏪</text>
                                    {isFav && <text x="16" y="8" textAnchor="middle" fontSize="8" fill="#ef4444">♥</text>}
                                </svg>
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

            {/* Adding mode banner */}
            {isAddingMode && (
                <div className="adding-banner animate-bounce-banner">📍 Tap on the map to place your shop</div>
            )}
        </div>
    );
}
