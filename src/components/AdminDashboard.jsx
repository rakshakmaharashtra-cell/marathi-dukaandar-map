import React, { useState, useMemo } from 'react';
import {
    ShieldCheck, CheckCircle, XCircle, Clock, Store,
    ChevronDown, ChevronUp, LogOut, MapPin,
    Filter, Search, X,
} from 'lucide-react';

const CATEGORY_COLORS = {
    Food: '#ef4444',
    Clothing: '#8b5cf6',
    Services: '#3b82f6',
    Groceries: '#22c55e',
    Electronics: '#f59e0b',
    Other: '#6b7280',
};

/**
 * Admin dashboard for approving / rejecting shop submissions.
 * Features: stats cards, status filter tabs, search, expandable tickets.
 */
export default function AdminDashboard({
    pendingShops,
    approvedShops,
    rejectedShops,
    allShops,
    onApprove,
    onReject,
    onLogout,
    currentUser,
}) {
    const [statusFilter, setStatusFilter] = useState('pending');
    const [expandedId, setExpandedId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const displayedShops = useMemo(() => {
        let list;
        switch (statusFilter) {
            case 'pending': list = pendingShops; break;
            case 'approved': list = approvedShops; break;
            case 'rejected': list = rejectedShops; break;
            default: list = allShops;
        }

        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            list = list.filter(
                (s) =>
                    s.name?.toLowerCase().includes(term) ||
                    s.owner_name?.toLowerCase().includes(term) ||
                    s.category?.toLowerCase().includes(term)
            );
        }

        return list;
    }, [statusFilter, pendingShops, approvedShops, rejectedShops, allShops, searchTerm]);

    return (
        <div className="admin-page">
            {/* Top Bar */}
            <div className="admin-topbar">
                <div className="admin-topbar-left">
                    <ShieldCheck size={22} />
                    <div>
                        <h1>Admin Dashboard</h1>
                        <p>Marathi Dukandaar Map</p>
                    </div>
                </div>
                <div className="admin-topbar-right">
                    <span className="admin-user-badge">👑 {currentUser?.name}</span>
                    <button className="admin-logout-btn" onClick={onLogout}>
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </div>

            <div className="admin-body">
                {/* Stats Overview */}
                <div className="admin-stats">
                    <div className="admin-stat-card" onClick={() => setStatusFilter('all')}>
                        <div className="admin-stat-icon" style={{ background: 'rgba(59,130,246,0.15)', color: '#3b82f6' }}>
                            <Store size={20} />
                        </div>
                        <div className="admin-stat-info">
                            <span className="admin-stat-number">{allShops.length}</span>
                            <span className="admin-stat-label">Total</span>
                        </div>
                    </div>
                    <div className="admin-stat-card" onClick={() => setStatusFilter('pending')}>
                        <div className="admin-stat-icon" style={{ background: 'rgba(249,115,22,0.15)', color: '#f97316' }}>
                            <Clock size={20} />
                        </div>
                        <div className="admin-stat-info">
                            <span className="admin-stat-number">{pendingShops.length}</span>
                            <span className="admin-stat-label">Pending</span>
                        </div>
                    </div>
                    <div className="admin-stat-card" onClick={() => setStatusFilter('approved')}>
                        <div className="admin-stat-icon" style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e' }}>
                            <CheckCircle size={20} />
                        </div>
                        <div className="admin-stat-info">
                            <span className="admin-stat-number">{approvedShops.length}</span>
                            <span className="admin-stat-label">Approved</span>
                        </div>
                    </div>
                    <div className="admin-stat-card" onClick={() => setStatusFilter('rejected')}>
                        <div className="admin-stat-icon" style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}>
                            <XCircle size={20} />
                        </div>
                        <div className="admin-stat-info">
                            <span className="admin-stat-number">{rejectedShops.length}</span>
                            <span className="admin-stat-label">Rejected</span>
                        </div>
                    </div>
                </div>

                {/* Status Filter Tabs */}
                <div className="admin-filter-tabs">
                    {['pending', 'approved', 'rejected', 'all'].map((status) => (
                        <button
                            key={status}
                            className={`admin-filter-tab ${statusFilter === status ? 'active' : ''}`}
                            onClick={() => setStatusFilter(status)}
                        >
                            {status === 'pending' && <Clock size={14} />}
                            {status === 'approved' && <CheckCircle size={14} />}
                            {status === 'rejected' && <XCircle size={14} />}
                            {status === 'all' && <Filter size={14} />}
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Search */}
                <div className="admin-search">
                    <Search size={16} />
                    <input
                        type="text"
                        placeholder="Search tickets..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button className="admin-search-clear" onClick={() => setSearchTerm('')}>
                            <X size={14} />
                        </button>
                    )}
                </div>

                {/* Tickets List */}
                <div className="admin-tickets">
                    {displayedShops.length === 0 ? (
                        <div className="admin-empty">
                            <Clock size={40} />
                            <p>
                                {statusFilter === 'pending'
                                    ? 'No pending tickets. All caught up! 🎉'
                                    : `No ${statusFilter} shops found.`}
                            </p>
                        </div>
                    ) : (
                        displayedShops.map((shop) => (
                            <div key={shop.id} className={`admin-ticket ${shop.status || 'pending'}`}>
                                {/* Ticket Header */}
                                <div
                                    className="admin-ticket-header"
                                    onClick={() => setExpandedId((prev) => (prev === shop.id ? null : shop.id))}
                                >
                                    <div className="admin-ticket-left">
                                        {shop.images?.length > 0 ? (
                                            <img src={shop.images[0]} alt={shop.name} className="admin-ticket-thumb" />
                                        ) : (
                                            <div className="admin-ticket-thumb-placeholder">
                                                <Store size={18} />
                                            </div>
                                        )}
                                        <div className="admin-ticket-info">
                                            <h4>{shop.name}</h4>
                                            <div className="admin-ticket-meta">
                                                <span
                                                    className="admin-ticket-category"
                                                    style={{ background: CATEGORY_COLORS[shop.category] || '#6b7280' }}
                                                >
                                                    {shop.category}
                                                </span>
                                                <span className="admin-ticket-status-badge" data-status={shop.status || 'pending'}>
                                                    {shop.status === 'approved' && '✅ Approved'}
                                                    {shop.status === 'rejected' && '❌ Rejected'}
                                                    {(!shop.status || shop.status === 'pending') && '⏳ Pending'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="admin-ticket-toggle">
                                        {expandedId === shop.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                    </div>
                                </div>

                                {/* Expanded Details */}
                                {expandedId === shop.id && (
                                    <div className="admin-ticket-details animate-fade">
                                        {shop.owner_name && (
                                            <div className="admin-detail-row">
                                                <span className="admin-detail-label">Owner:</span>
                                                <span>👤 {shop.owner_name}</span>
                                            </div>
                                        )}
                                        {shop.description && (
                                            <div className="admin-detail-row">
                                                <span className="admin-detail-label">Description:</span>
                                                <span>{shop.description}</span>
                                            </div>
                                        )}
                                        {shop.position && (
                                            <div className="admin-detail-row">
                                                <span className="admin-detail-label">Location:</span>
                                                <span>📌 {shop.position[0]?.toFixed(5)}, {shop.position[1]?.toFixed(5)}</span>
                                            </div>
                                        )}
                                        {shop.created_at && (
                                            <div className="admin-detail-row">
                                                <span className="admin-detail-label">Submitted:</span>
                                                <span>
                                                    {new Date(shop.created_at).toLocaleString('en-IN', {
                                                        day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
                                                    })}
                                                </span>
                                            </div>
                                        )}
                                        {shop.submittedBy && (
                                            <div className="admin-detail-row">
                                                <span className="admin-detail-label">Submitted by:</span>
                                                <span>👤 {shop.submittedBy}</span>
                                            </div>
                                        )}

                                        {/* Images */}
                                        {shop.images?.length > 0 && (
                                            <div className="admin-ticket-images">
                                                {shop.images.map((img, i) => (
                                                    <img key={i} src={img} alt={`${shop.name} ${i + 1}`} />
                                                ))}
                                            </div>
                                        )}

                                        {/* Action Buttons (pending only) */}
                                        {(!shop.status || shop.status === 'pending') && (
                                            <div className="admin-ticket-actions">
                                                <button className="admin-btn-approve" onClick={() => onApprove(shop.id)}>
                                                    <CheckCircle size={16} /> Approve
                                                </button>
                                                <button className="admin-btn-reject" onClick={() => onReject(shop.id)}>
                                                    <XCircle size={16} /> Reject
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
