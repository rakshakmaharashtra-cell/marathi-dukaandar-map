import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';

const MILESTONES = [50, 200, 500, 1000, 2000];

const RANKS = [
    { min: 0, label: 'Sahayak (Helper)', tKey: 'sahayak', emoji: '🌱' },
    { min: 50, label: 'Mavla (Soldier)', tKey: 'mavla', emoji: '⚔️' },
    { min: 200, label: 'Sardar (Commander)', tKey: 'sardar', emoji: '🛡️' },
    { min: 500, label: 'Sarsenapati (General)', tKey: 'sarsenapati', emoji: '🚩' },
    { min: 1000, label: 'Peshwa (Prime Minister)', tKey: 'peshwa', emoji: '👑' },
];

/**
 * Gamification hook — manages points, ranks, and milestones.
 *
 * Accepts `userId` as a parameter (no internal useAuth import)
 * to avoid circular hook dependencies.
 *
 * Primary source: Supabase profiles table.
 * Fallback: localStorage.
 */
export default function usePoints(userId) {
    const [points, setPoints] = useState(0);

    useEffect(() => {
        if (!userId) {
            setPoints(0);
            return;
        }

        async function fetchPoints() {
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('points')
                    .eq('id', userId)
                    .single();

                if (!error && data && typeof data.points === 'number') {
                    setPoints(data.points);
                    return;
                }
            } catch {
                // profiles table might not be set up
            }

            // Fallback to localStorage
            try {
                const saved = localStorage.getItem('marathi-dukandaar-points');
                setPoints(saved ? parseInt(saved, 10) : 0);
            } catch {
                setPoints(0);
            }
        }

        fetchPoints();
    }, [userId]);

    /**
     * Add points optimistically. Returns an array of crossed milestones.
     * The DB trigger handles the real server-side award.
     */
    const addPoints = useCallback((n) => {
        let crossed = [];
        setPoints((prev) => {
            const next = prev + n;
            crossed = MILESTONES.filter((m) => prev < m && next >= m);
            try {
                localStorage.setItem('marathi-dukandaar-points', String(next));
            } catch { /* ignore */ }
            return next;
        });
        return crossed;
    }, []);

    const getRank = useCallback(() => {
        for (let i = RANKS.length - 1; i >= 0; i--) {
            if (points >= RANKS[i].min) return RANKS[i];
        }
        return RANKS[0];
    }, [points]);

    const getProgress = useCallback(() => {
        const nextMilestone = MILESTONES.find((m) => m > points) || MILESTONES[MILESTONES.length - 1];
        const prevMilestone = [...MILESTONES].reverse().find((m) => m <= points) || 0;
        const range = nextMilestone - prevMilestone;
        const progress = range > 0 ? ((points - prevMilestone) / range) * 100 : 100;
        return { nextMilestone, progress: Math.min(progress, 100) };
    }, [points]);

    return { points, addPoints, getRank, getProgress, MILESTONES };
}
