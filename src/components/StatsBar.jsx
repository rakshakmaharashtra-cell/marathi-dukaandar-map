import React from 'react';
import { Store, MapPin, Heart, TrendingUp } from 'lucide-react';
import { useTranslation } from '../i18n.jsx';

/**
 * Stats widget showing community metrics: total shops, favorites, top category, points.
 */
export default function StatsBar({ shops, favorites, points }) {
    const { t } = useTranslation();
    const categoryCounts = {};
    shops.forEach((s) => {
        categoryCounts[s.category] = (categoryCounts[s.category] || 0) + 1;
    });
    const topCategory =
        Object.keys(categoryCounts).length > 0
            ? Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0][0]
            : '—';

    return (
        <div className="stats-bar animate-slide-right">
            <div className="stat-item">
                <div className="stat-icon" style={{ background: 'rgba(59,130,246,0.2)', color: '#3b82f6' }}>
                    <Store size={16} />
                </div>
                <div className="stat-text">
                    <span className="stat-number">{shops.length}</span>
                    <span className="stat-label">{t('stats_shops')}</span>
                </div>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
                <div className="stat-icon" style={{ background: 'rgba(239,68,68,0.2)', color: '#ef4444' }}>
                    <Heart size={16} />
                </div>
                <div className="stat-text">
                    <span className="stat-number">{favorites.length}</span>
                    <span className="stat-label">{t('stats_favorites')}</span>
                </div>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
                <div className="stat-icon" style={{ background: 'rgba(34,197,94,0.2)', color: '#22c55e' }}>
                    <MapPin size={16} />
                </div>
                <div className="stat-text">
                    <span className="stat-number">{topCategory === '—' ? '—' : t(topCategory.toLowerCase().replace(' ', '_'))}</span>
                    <span className="stat-label">{t('top_category')}</span>
                </div>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
                <div className="stat-icon" style={{ background: 'rgba(249,115,22,0.2)', color: '#f97316' }}>
                    <TrendingUp size={16} />
                </div>
                <div className="stat-text">
                    <span className="stat-number">{points}</span>
                    <span className="stat-label">{t('pts')}</span>
                </div>
            </div>
        </div>
    );
}
