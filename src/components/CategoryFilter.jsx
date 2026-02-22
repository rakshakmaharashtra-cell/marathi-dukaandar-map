import React, { useState } from 'react';
import { Filter, X } from 'lucide-react';

const CATEGORIES = [
    { value: 'All', label: '🗺️ All', color: '#f97316' },
    { value: 'Food', label: '🍛 Food', color: '#ef4444' },
    { value: 'Clothing', label: '👕 Clothing', color: '#8b5cf6' },
    { value: 'Services', label: '🔧 Services', color: '#3b82f6' },
    { value: 'Groceries', label: '🛒 Groceries', color: '#22c55e' },
    { value: 'Electronics', label: '📱 Electronics', color: '#f59e0b' },
    { value: 'Other', label: '📦 Other', color: '#6b7280' },
];

/**
 * Floating horizontal filter bar for category filtering on the map.
 */
export default function CategoryFilter({ active, onChange, shopCounts }) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="category-filter-container">
            {!isExpanded ? (
                <button
                    className="category-filter-toggle animate-pop"
                    onClick={() => setIsExpanded(true)}
                    title="Show Filters"
                >
                    <Filter size={16} />
                    <span>Filters</span>
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
                                {cat.label}
                                {count !== null && <span className="filter-count">{count}</span>}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
