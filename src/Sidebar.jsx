import React, { useState } from 'react';
import { Search, Plus, X, Menu, Store, Heart, Clock, LogOut } from 'lucide-react';
import { useTranslation } from './i18n.jsx';

const CATEGORY_COLORS = {
    Food: '#ef4444',
    Clothing: '#8b5cf6',
    Services: '#3b82f6',
    Groceries: '#22c55e',
    Electronics: '#f59e0b',
    Other: '#6b7280',
};

/**
 * Collapsible sidebar with search, tabs (All / Favorites / Recent), shop list,
 * and add-shop action.
 */
export default function Sidebar({ shops, onAddShop, isOpen, setIsOpen, onShopClick, isFavorite, favorites, onLogout, currentUser }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('all'); // 'all' | 'favorites' | 'recent'
    const { t, language, toggleLanguage } = useTranslation();

    // Filter by search
    let filtered = shops.filter(
        (s) =>
            s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (s.owner_name && s.owner_name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Filter by tab
    if (activeTab === 'favorites') {
        filtered = filtered.filter((s) => favorites.includes(s.id));
    } else if (activeTab === 'recent') {
        filtered = [...filtered].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 10);
    }

    return (
        <>
            {/* Mobile toggle */}
            <button className="mobile-menu-btn" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle sidebar">
                {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            <div className={`sidebar ${isOpen ? 'open' : ''}`}>
                {/* Header */}
                <div className="sidebar-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="sidebar-logo">
                        <span className="logo-icon">🚩</span>
                        <div>
                            <h1>{t('app_title')}</h1>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Made in Maharashtra</p>
                        </div>
                    </div>
                    <button
                        onClick={toggleLanguage}
                        style={{ background: 'var(--primary-light)', color: 'var(--primary)', border: 'none', padding: '6px 12px', borderRadius: '16px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', transition: '0.2s' }}
                    >
                        {language === 'en' ? 'मराठी' : 'English'}
                    </button>
                </div>

                {/* Add Shop Button */}
                <div className="sidebar-actions">
                    <button
                        className="btn-add-shop"
                        onClick={() => {
                            onAddShop();
                            setIsOpen(false);
                        }}
                    >
                        <Plus size={18} />
                        {t('add_shop')}
                    </button>
                </div>

                {/* Search */}
                <div className="sidebar-search">
                    <div className="search-input-wrapper">
                        <Search size={16} />
                        <input
                            type="text"
                            className="search-input"
                            placeholder={t('search_shops')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <button className="search-clear" onClick={() => setSearchTerm('')}>
                                <X size={14} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Tabs */}
                <div className="sidebar-tabs">
                    <button
                        className={`sidebar-tab ${activeTab === 'all' ? 'active' : ''}`}
                        onClick={() => setActiveTab('all')}
                    >
                        <Store size={14} />
                        All ({shops.length})
                    </button>
                    <button
                        className={`sidebar-tab ${activeTab === 'favorites' ? 'active' : ''}`}
                        onClick={() => setActiveTab('favorites')}
                    >
                        <Heart size={14} />
                        Favorites ({favorites.length})
                    </button>
                    <button
                        className={`sidebar-tab ${activeTab === 'recent' ? 'active' : ''}`}
                        onClick={() => setActiveTab('recent')}
                    >
                        <Clock size={14} />
                        Recent
                    </button>
                </div>

                {/* Shop List */}
                <div className="sidebar-shops">
                    {filtered.length === 0 ? (
                        <div className="empty-state">
                            {activeTab === 'favorites' ? (
                                <>
                                    <Heart size={32} />
                                    <p>No favorites yet. Click the heart on any shop to bookmark it!</p>
                                </>
                            ) : (
                                <>
                                    <Store size={32} />
                                    <p>{shops.length === 0 ? 'No shops yet. Be the first to add one!' : 'No matching shops found.'}</p>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="shop-list">
                            {filtered.map((shop) => {
                                const fav = isFavorite(shop.id);
                                return (
                                    <div className="shop-card" key={shop.id} onClick={() => onShopClick && onShopClick(shop)}>
                                        <div className="shop-card-top">
                                            {shop.images?.length > 0 ? (
                                                <img src={shop.images[0]} alt={shop.name} className="shop-card-thumb" />
                                            ) : (
                                                <div className="shop-card-thumb-placeholder">
                                                    <Store size={20} />
                                                </div>
                                            )}
                                            <div className="shop-card-info">
                                                <h4>{shop.name}</h4>
                                                <span
                                                    className="shop-badge"
                                                    style={{ background: CATEGORY_COLORS[shop.category] || '#6b7280' }}
                                                >
                                                    {shop.category}
                                                </span>
                                            </div>
                                            {fav && <Heart size={14} className="shop-card-fav-icon" fill="#ef4444" color="#ef4444" />}
                                        </div>
                                        {shop.owner_name && <div className="shop-card-owner">👤 {shop.owner_name}</div>}
                                        {shop.description && <div className="shop-card-desc">{shop.description}</div>}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="sidebar-footer">
                    <div className="sidebar-user-row">
                        <span className="sidebar-user-name">👋 {currentUser?.name || 'User'}</span>
                        <div style={{ display: 'flex', gap: '6px' }}>
                            {currentUser?.role === 'admin' && (
                                <button
                                    className="sidebar-logout-btn"
                                    style={{ color: 'var(--saffron)', borderColor: 'var(--saffron)' }}
                                    onClick={() => window.location.hash = '#/admin'}
                                    title="Go to Admin Dashboard"
                                >
                                    Admin
                                </button>
                            )}
                            <button className="sidebar-logout-btn" onClick={onLogout} title="Logout">
                                <LogOut size={16} />
                                Logout
                            </button>
                        </div>
                    </div>
                    <p>Made with ❤️ for Marathi Manus 🚩</p>
                </div>
            </div>

            {/* Mobile overlay */}
            {isOpen && <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />}
        </>
    );
}
