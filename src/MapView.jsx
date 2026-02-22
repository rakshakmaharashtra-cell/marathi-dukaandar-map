import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import { Crosshair, Layers } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix default marker icon (Vite bundling issue)
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

// Category colors for custom markers
const CATEGORY_COLORS = {
    Food: '#ef4444',
    Clothing: '#8b5cf6',
    Services: '#3b82f6',
    Groceries: '#22c55e',
    Electronics: '#f59e0b',
    Other: '#6b7280',
};

// Map tile layers
const MAP_LAYERS = [
    {
        id: 'default',
        label: 'Default',
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
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
        url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
        attribution: '&copy; OpenTopoMap',
        thumb: 'https://a.tile.opentopomap.org/5/15/10.png',
    },
    {
        id: 'dark',
        label: 'Dark',
        url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
        thumb: 'https://a.basemaps.cartocdn.com/dark_all/5/15/10.png',
    },
    {
        id: 'light',
        label: 'Light',
        url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
        attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
        thumb: 'https://a.basemaps.cartocdn.com/light_all/5/15/10.png',
    },
    {
        id: 'watercolor',
        label: 'Watercolor',
        url: 'https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg',
        attribution: '&copy; Stadia Maps &copy; Stamen Design',
        thumb: 'https://tiles.stadiamaps.com/tiles/stamen_watercolor/5/15/10.jpg',
    },
];

// Create a custom colored SVG marker icon
function createShopIcon(category, isFav) {
    const color = CATEGORY_COLORS[category] || '#f97316';
    const heart = isFav ? `<text x="16" y="8" text-anchor="middle" font-size="8" fill="#ef4444">♥</text>` : '';
    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="42" viewBox="0 0 32 42">
      <defs>
        <filter id="shadow" x="-20%" y="-10%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity="0.3"/>
        </filter>
      </defs>
      <path d="M16 0C7.2 0 0 7.2 0 16c0 12 16 26 16 26s16-14 16-26C32 7.2 24.8 0 16 0z"
            fill="${color}" filter="url(#shadow)"/>
      <circle cx="16" cy="15" r="7" fill="white" opacity="0.9"/>
      <text x="16" y="19" text-anchor="middle" font-size="11" fill="${color}">🏪</text>
      ${heart}
    </svg>`;
    return L.divIcon({
        html: svg,
        className: 'custom-marker-icon',
        iconSize: [32, 42],
        iconAnchor: [16, 42],
        popupAnchor: [0, -42],
    });
}

// Click handler for adding-mode
function ClickHandler({ onClick }) {
    useMapEvents({
        click(e) {
            if (onClick) onClick(e.latlng);
        },
    });
    return null;
}

// Geolocation control
function LocateControl() {
    const map = useMap();
    const [locating, setLocating] = useState(false);
    const [userPos, setUserPos] = useState(null);
    const [accuracy, setAccuracy] = useState(0);

    const handleLocate = (e) => {
        e.stopPropagation();
        setLocating(true);
        map.locate({ setView: true, maxZoom: 16, enableHighAccuracy: true });

        map.once('locationfound', (ev) => {
            setLocating(false);
            setUserPos(ev.latlng);
            setAccuracy(ev.accuracy);
        });

        map.once('locationerror', (ev) => {
            setLocating(false);
            alert('Could not find your location: ' + ev.message);
        });
    };

    return (
        <>
            {userPos && (
                <>
                    <Circle
                        center={userPos}
                        radius={accuracy}
                        pathOptions={{ color: '#f97316', fillColor: '#f97316', fillOpacity: 0.1, weight: 1 }}
                    />
                    <Marker position={userPos}>
                        <Popup>
                            <div style={{ textAlign: 'center', fontWeight: 600 }}>📍 You are here</div>
                        </Popup>
                    </Marker>
                </>
            )}

            <button
                className="map-control-btn locate-btn"
                onClick={handleLocate}
                title="Find my location"
                disabled={locating}
            >
                {locating ? <span className="locate-spinner" /> : <Crosshair size={20} />}
            </button>
        </>
    );
}

/**
 * Full-screen map with shop markers, geolocation, layer switcher,
 * and click-to-add functionality.
 */
export default function MapView({ shops, onMapClick, isAddingMode, onShopClick, isFavorite }) {
    const center = [19.076, 72.8777]; // Mumbai default
    const [layerIndex, setLayerIndex] = useState(0);
    const [showLayerMenu, setShowLayerMenu] = useState(false);
    const currentLayer = MAP_LAYERS[layerIndex];

    return (
        <div className="map-area">
            <MapContainer
                center={center}
                zoom={7}
                scrollWheelZoom={true}
                style={{ width: '100%', height: '100%' }}
                zoomControl={false}
            >
                <TileLayer key={currentLayer.id} attribution={currentLayer.attribution} url={currentLayer.url} />

                {isAddingMode && <ClickHandler onClick={onMapClick} />}
                <LocateControl />

                {/* Shop markers */}
                {shops.map((shop) => (
                    <Marker
                        key={shop.id}
                        position={shop.position}
                        icon={createShopIcon(shop.category, isFavorite && isFavorite(shop.id))}
                        eventHandlers={{
                            click: () => {
                                if (onShopClick) onShopClick(shop);
                            },
                        }}
                    >
                        <Popup maxWidth={300} minWidth={220}>
                            <div className="popup-content">
                                {shop.images?.length > 0 && (
                                    <div className="popup-images">
                                        {shop.images.slice(0, 3).map((img, i) => (
                                            <img key={i} src={img} alt={`${shop.name} ${i + 1}`} className="popup-image" />
                                        ))}
                                    </div>
                                )}
                                <div className="popup-name">{shop.name}</div>
                                {shop.owner_name && <div className="popup-owner">👤 {shop.owner_name}</div>}
                                <span
                                    className="popup-badge"
                                    style={{ background: CATEGORY_COLORS[shop.category] || '#6b7280' }}
                                >
                                    {shop.category}
                                </span>
                                {shop.description && <div className="popup-desc">{shop.description}</div>}
                                <div className="popup-coords">
                                    📌 {shop.position[0]?.toFixed(4)}, {shop.position[1]?.toFixed(4)}
                                </div>
                                <button
                                    className="popup-detail-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (onShopClick) onShopClick(shop);
                                    }}
                                >
                                    View Details →
                                </button>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            {/* Layer Switcher */}
            <div className="layer-switcher-wrap">
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
