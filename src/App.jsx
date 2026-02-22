import React, { useState, useCallback, useMemo, useEffect } from 'react';
import MapView from './MapView';
import Sidebar from './Sidebar';
import ProfileCard from './ProfileCard';
import AddShopForm from './AddShopForm';
import MilestoneToast from './components/MilestoneToast';
import WelcomeModal from './components/WelcomeModal';
import ShopDetailDrawer from './components/ShopDetailDrawer';
import StatsBar from './components/StatsBar';
import CategoryFilter from './components/CategoryFilter';
import ToastNotification from './components/ToastNotification';
import AuthPage from './components/AuthPage';
import AdminLoginPage from './components/AdminLoginPage';
import AdminDashboard from './components/AdminDashboard';
import LeaderboardModal from './components/LeaderboardModal';
import useShops from './hooks/useShops';
import usePoints from './hooks/usePoints';
import useFavorites from './hooks/useFavorites';
import useAuth from './hooks/useAuth';
import { LogOut } from 'lucide-react';

/**
 * Main App — orchestrates all views:
 * 1. Loading → loading screen
 * 2. Not logged in → AuthPage
 * 3. Admin → AdminDashboard
 * 4. User → Map view with sidebar, profile, filters, etc.
 */
export default function App() {
  const {
    currentUser,
    isLoggedIn,
    isAdmin,
    login,
    signup,
    logout,
    resetPassword,
    authLoading,
    roleLoading, // <- Extract roleLoading
  } = useAuth();
  const {
    shops, allShops, pendingShops, approvedShops, rejectedShops,
    addShop, approveShop, rejectShop, removeShop, updateShop,
    loadingShops, refreshShops,
  } = useShops();
  const { points, addPoints, getRank, getProgress } = usePoints(currentUser?.id);
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  // The map should show approved shops AND the user's own submissions (so they can edit them)
  const mapShops = React.useMemo(() => {
    return allShops.filter(s => s.status === 'approved' || (currentUser && s.submittedById === currentUser.id));
  }, [allShops, currentUser]);

  // Check if we're on the secret admin route
  const [isAdminRoute, setIsAdminRoute] = useState(() => window.location.hash === '#/admin');

  useEffect(() => {
    const handleHash = () => setIsAdminRoute(window.location.hash === '#/admin');
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // UI state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAddingMode, setIsAddingMode] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [milestones, setMilestones] = useState([]);
  const [selectedShop, setSelectedShop] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [toast, setToast] = useState(null);

  // Welcome modal — first-time users only
  const [showWelcome, setShowWelcome] = useState(
    () => !localStorage.getItem('marathi-dukandaar-welcomed')
  );

  // Filter by category
  const filteredShops = React.useMemo(() => {
    if (categoryFilter === 'All') return mapShops;
    return mapShops.filter((s) => s.category === categoryFilter);
  }, [mapShops, categoryFilter]);

  // Category counts
  const shopCounts = React.useMemo(() => {
    const counts = {};
    mapShops.forEach((s) => {
      counts[s.category] = (counts[s.category] || 0) + 1;
    });
    return counts;
  }, [mapShops]);

  // ── Handlers ──

  const handleStartAdding = useCallback(() => {
    setIsAddingMode(true);
    setSelectedPosition(null);
    setShowForm(false);
  }, []);

  const handleMapClick = useCallback((latlng) => {
    setSelectedPosition(latlng);
    setShowForm(true);
    setIsAddingMode(false);
  }, []);

  const handleFormSubmit = useCallback(
    async (shopData) => {
      const success = await addShop({
        ...shopData,
        submittedBy: currentUser?.name || 'Anonymous',
        submittedByEmail: currentUser?.email || '',
        submittedById: currentUser?.id || '',
      });

      if (success && !success.error) {
        setShowForm(false);
        setSelectedPosition(null);
        setToast({ message: 'Shop submitted for admin approval! 📝', type: 'success' });
      } else {
        setToast({
          message: success?.error || 'Failed to submit shop. Please check your connection or contact admin.',
          type: 'error'
        });
      }
    },
    [addShop, currentUser]
  );

  const handleCancel = useCallback(() => {
    setShowForm(false);
    setIsAddingMode(false);
    setSelectedPosition(null);
  }, []);

  const dismissMilestone = useCallback(() => {
    setMilestones((prev) => prev.slice(1));
  }, []);

  const handleShopClick = useCallback((shop) => {
    setSelectedShop(shop);
  }, []);

  const handleShareShop = React.useCallback(() => {
    if (!selectedShop) return;
    const text = `🚩 ${selectedShop.name}\n👤 Owner: ${selectedShop.owner_name || 'N/A'}\n📂 ${selectedShop.category}\n📌 ${selectedShop.position[0].toFixed(5)}, ${selectedShop.position[1].toFixed(5)}\n\nDiscovered on Marathi Dukandaar Map!`;
    navigator.clipboard
      .writeText(text)
      .then(() => setToast({ message: 'Shop details copied to clipboard!', type: 'info' }))
      .catch(() => setToast({ message: 'Could not copy to clipboard', type: 'error' }));
  }, [selectedShop]);

  const handleDeleteShop = useCallback(
    (id) => {
      removeShop(id);
      setSelectedShop(null);
      setToast({ message: 'Shop removed.', type: 'success' });
    },
    [removeShop]
  );

  const handleEditShop = useCallback(
    async (id, updateData) => {
      const success = await updateShop(id, updateData);
      if (success) {
        setToast({ message: 'Shop details updated!', type: 'success' });
        // Update selected shop locally so the drawer updates instantly
        setSelectedShop((prev) => (prev && prev.id === id ? { ...prev, ...updateData } : prev));
      } else {
        setToast({ message: 'Failed to update shop.', type: 'error' });
      }
      return success;
    },
    [updateShop]
  );

  // Admin handlers
  const handleApproveShop = useCallback(
    (id) => {
      approveShop(id);
      setToast({ message: 'Shop approved! ✅ It will now appear on the map.', type: 'success' });
    },
    [approveShop]
  );

  const handleRejectShop = useCallback(
    (id) => {
      rejectShop(id);
      setToast({ message: 'Shop rejected. ❌', type: 'info' });
    },
    [rejectShop]
  );

  const rank = getRank();
  const progress = getProgress();

  // ═══ RENDERING ═══

  // Loading state
  // Loading state (either session OR role is loading)
  if (authLoading || roleLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <span className="loading-logo">🚩</span>
          <h2>Loading Marathi Dukandaar...</h2>
          <div className="loading-bar">
            <div className="loading-bar-fill" />
          </div>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!isLoggedIn) {
    // Secret admin route → show admin login page
    if (isAdminRoute) {
      return <AdminLoginPage onLogin={login} />;
    }
    // Regular users → normal auth page
    return <AuthPage onLogin={login} onSignup={signup} onResetPassword={resetPassword} />;
  }

  // Logged in as admin on admin route → Admin Dashboard
  if (isAdmin && isAdminRoute) {
    return (
      <>
        <AdminDashboard
          pendingShops={pendingShops}
          approvedShops={approvedShops}
          rejectedShops={rejectedShops}
          allShops={allShops}
          onApprove={handleApproveShop}
          onReject={handleRejectShop}
          onLogout={() => { logout(); window.location.hash = '#/admin'; }}
          currentUser={currentUser}
        />
        {toast && (
          <ToastNotification message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />
        )}
      </>
    );
  }

  // On admin route but role not yet confirmed as admin
  // → show loading screen while fetchRole is still running
  // (role starts as 'user' and gets updated to 'admin' async)
  if (isAdminRoute && !isAdmin) {
    // If auth or role is still loading, show standard loading screen
    if (authLoading || roleLoading) return null;

    // If role is confirmed as 'user', and we're on admin route, it's Access Denied
    if (currentUser?.role === 'user') {
      return (
        <div className="loading-screen">
          <div className="loading-content">
            <span className="loading-logo">🚫</span>
            <h2>Access Denied</h2>
            <p>You do not have administrative privileges.</p>
            <button
              className="btn-submit"
              style={{ marginTop: '1rem' }}
              onClick={() => { window.location.hash = ''; }}
            >
              Back to Map
            </button>
            <button
              className="btn-cancel"
              style={{ marginTop: '0.5rem', background: 'transparent', border: 'none', color: '#888' }}
              onClick={logout}
            >
              Logout and Try Admin Account
            </button>
          </div>
        </div>
      );
    }
  }

  // Regular user → Map view
  return (
    <div className="app-container">
      <MapView
        shops={filteredShops}
        onMapClick={handleMapClick}
        isAddingMode={isAddingMode}
        onShopClick={handleShopClick}
        isFavorite={isFavorite}
      />

      <Sidebar
        shops={mapShops}
        onAddShop={handleStartAdding}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        onShopClick={handleShopClick}
        isFavorite={isFavorite}
        favorites={favorites}
        onLogout={logout}
        currentUser={currentUser}
      />

      <ProfileCard
        points={points}
        rank={rank}
        progress={progress}
        user={currentUser}
        onClickLeaderboard={() => setShowLeaderboard(true)}
      />

      {/* Category Filter */}
      {shops.length > 0 && (
        <CategoryFilter active={categoryFilter} onChange={setCategoryFilter} shopCounts={shopCounts} />
      )}

      {/* Stats Bar */}
      {shops.length > 0 && <StatsBar shops={shops} favorites={favorites} points={points} />}

      {/* Add Shop Modal */}
      {showForm && selectedPosition && (
        <AddShopForm position={selectedPosition} onSubmit={handleFormSubmit} onCancel={handleCancel} />
      )}

      {/* Shop Detail Drawer */}
      {selectedShop && (
        <ShopDetailDrawer
          shop={selectedShop}
          onClose={() => setSelectedShop(null)}
          isFavorite={favorites.includes(selectedShop.id)}
          onToggleFavorite={toggleFavorite}
          onDelete={handleDeleteShop}
          onEdit={handleEditShop}
          canEdit={isAdmin || (currentUser?.id && selectedShop.submittedById === currentUser.id)}
          onShare={() => {
            navigator.clipboard.writeText(`${window.location.origin}/#shop-${selectedShop.id}`);
            setToast({ message: 'Link copied to clipboard!', type: 'info' });
          }}
        />
      )}{showWelcome && <WelcomeModal onClose={() => setShowWelcome(false)} />}

      {/* Leaderboard */}
      {showLeaderboard && (
        <LeaderboardModal
          onClose={() => setShowLeaderboard(false)}
          currentUser={currentUser}
          currentPoints={points}
        />
      )}

      {/* Milestone Toast */}
      {milestones.length > 0 && <MilestoneToast milestone={milestones[0]} onDismiss={dismissMilestone} />}

      {/* Generic Toast */}
      {toast && (
        <ToastNotification message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />
      )}
    </div>
  );
}
