import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';

/**
 * Shop data hook — full CRUD with approval workflow.
 *
 * - New shops are inserted with status 'pending'
 * - Admin approves / rejects shops
 * - Only approved shops are exposed as `shops` (for map + sidebar)
 * - `allShops` includes every status (for admin dashboard)
 */
export default function useShops() {
    const [allShops, setAllShops] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchShops = useCallback(async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('shops')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setAllShops(data || []);
        } catch (err) {
            console.error('Error fetching shops:', err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // Initial fetch
        fetchShops();

        // Listen for auth state changes (e.g., user logs in as admin)
        // This ensures they get the full list of shops under the new RLS policy
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            fetchShops();
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [fetchShops]);

    // Insert a new shop (pending status)
    const addShop = useCallback(async (shopData) => {
        try {
            const { data, error } = await supabase
                .from('shops')
                .insert([{ status: 'pending', ...shopData }])
                .select()
                .single();

            if (error) throw error;
            setAllShops((prev) => [data, ...prev]);
            return data;
        } catch (err) {
            console.error('Error adding shop:', err.message);
            console.error('Failed shop data:', shopData);
            return { error: err.message };
        }
    }, []);

    // Approve a pending shop
    const approveShop = useCallback(async (id) => {
        try {
            const { error } = await supabase
                .from('shops')
                .update({ status: 'approved', approved_at: new Date().toISOString() })
                .eq('id', id);

            if (error) throw error;
            fetchShops();
        } catch (err) {
            console.error('Error approving shop:', err.message);
        }
    }, [fetchShops]);

    // Reject a pending shop
    const rejectShop = useCallback(async (id) => {
        try {
            const { error } = await supabase
                .from('shops')
                .update({ status: 'rejected', rejected_at: new Date().toISOString() })
                .eq('id', id);

            if (error) throw error;
            fetchShops();
        } catch (err) {
            console.error('Error rejecting shop:', err.message);
        }
    }, [fetchShops]);

    // Delete a shop
    const removeShop = useCallback(async (id) => {
        try {
            const { error } = await supabase.from('shops').delete().eq('id', id);
            if (error) throw error;
            setAllShops((prev) => prev.filter((s) => s.id !== id));
        } catch (err) {
            console.error('Error deleting shop:', err.message);
        }
    }, []);

    // Update an existing shop
    const updateShop = useCallback(async (id, updateData) => {
        try {
            const { error } = await supabase
                .from('shops')
                .update(updateData)
                .eq('id', id);

            if (error) throw error;
            fetchShops();
            return true;
        } catch (err) {
            console.error('Error updating shop:', err.message);
            return false;
        }
    }, [fetchShops]);

    // Computed views
    const approvedShops = allShops.filter((s) => s.status === 'approved');
    const pendingShops = allShops.filter((s) => !s.status || s.status === 'pending');
    const rejectedShops = allShops.filter((s) => s.status === 'rejected');

    return {
        shops: approvedShops,
        allShops,
        pendingShops,
        approvedShops,
        rejectedShops,
        addShop,
        approveShop,
        rejectShop,
        removeShop,
        updateShop, // <-- Exported
        loadingShops: loading,
        refreshShops: fetchShops,
    };
}
