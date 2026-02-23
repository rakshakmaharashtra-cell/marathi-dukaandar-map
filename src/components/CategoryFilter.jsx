import React, { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { useTranslation } from '../i18n.jsx';

const CATEGORIES = [
    { value: 'All', icon: '🗺️', tKey: 'all_cat', color: '#f97316' },
    { value: 'Food', icon: '🍛', tKey: 'food', color: '#ef4444' },
    { value: 'Clothing', icon: '👕', tKey: 'clothing', color: '#8b5cf6' },
    { value: 'Services', icon: '🔧', tKey: 'services', color: '#3b82f6' },
    { value: 'Groceries', icon: '🛒', tKey: 'groceries', color: '#22c55e' },
    { value: 'Electronics', icon: '📱', tKey: 'electronics', color: '#f59e0b' },
    { value: 'Other', icon: '📦', tKey: 'other', color: '#6b7280' },
];

/**
 * Floating horizontal filter bar for category filtering on the map.
 */
export default function CategoryFilter({ active, onChange, shopCounts }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const { t } = useTranslation();

    return (
        <div className="category-filter-container">
            {!isExpanded ? (
                <button
                    className="category-filter-toggle animate-pop"
                    onClick={() => setIsExpanded(true)}
                    title={t('filters_title')}
                >
                    <Filter size={16} />
                    <span>{t('filters')}</span>
                    {active !== 'All' && <span className="active-dot" title={`Active: ${active}`} />}
                </button>
            ) : (
                <div className="category-filter-bar animate-pop">
                    <button
                        className="filter-chip close-btn"
                        onClick={() => setIsExpanded(false)}
                        title="Close filters"
                    >
                        <X size={16} />
                    </button>
                    {CATEGORIES.map((cat) => {
                        const count = cat.value === 'All' ? null : shopCounts[cat.value] || 0;
                        return (
                            <button
                                key={cat.value}
                                className={`filter-chip ${active === cat.value ? 'active' : ''}`}
                                onClick={() => onChange(cat.value)}
                                style={active === cat.value ? { background: cat.color, borderColor: cat.color } : {}}
                            >
                                {cat.icon} {t(cat.tKey)}
                                {count !== null && <span className="filter-count">{count}</span>}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
