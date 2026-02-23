import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../supabaseClient';

// Read admin emails from environment variable (comma-separated)
const ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

// Rate limiting config
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 60_000; // 60 seconds

/**
 * Authentication hook — manages Supabase auth session, user role, and login security.
 *
 * Security features:
 * - Admin emails read from env var (not hardcoded in source)
 * - Login rate limiting (5 attempts → 60s lockout)
 * - Automatic session management via Supabase
 */
export default function useAuth() {
    const [currentUser, setCurrentUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [roleLoading, setRoleLoading] = useState(true); // Track role fetch specifically
    const [loginAttempts, setLoginAttempts] = useState(0);
    const [lockoutUntil, setLockoutUntil] = useState(null);
    const lockoutTimer = useRef(null);

    // Build a lightweight user object from Supabase auth user
    const mapUser = useCallback(
        (sbUser) => ({
            id: sbUser.id,
            email: sbUser.email,
            name: sbUser.user_metadata?.full_name || sbUser.email.split('@')[0],
            role: 'user',
        }),
        []
    );

    // Fetch the real role + name from the profiles table
    const fetchRole = useCallback(async (sbUser) => {
        setRoleLoading(true); // Start loading role
        const isEnvAdmin = ADMIN_EMAILS.includes(sbUser.email?.toLowerCase());

        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('role, full_name')
                .eq('id', sbUser.id)
                .single();

            if (error) {
                console.error('Profile fetch error:', error.message);
            }

            const dbRole = !error && data?.role ? data.role : 'user';
            const finalRole = isEnvAdmin ? 'admin' : dbRole;

            console.log(`Auth verification: Email=${sbUser.email}, EnvAdmin=${isEnvAdmin}, DBRole=${dbRole}, Final=${finalRole}`);

            setCurrentUser((prev) =>
                prev ? { ...prev, role: finalRole, name: data?.full_name || prev.name } : null
            );
        } catch (e) {
            console.error('Profile catch error:', e.message);
            if (isEnvAdmin) {
                setCurrentUser((prev) => (prev ? { ...prev, role: 'admin' } : null));
            }
        } finally {
            setRoleLoading(false); // Done loading role
        }
    }, []);

    useEffect(() => {
        // 1. Read existing session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                setCurrentUser(mapUser(session.user));
                fetchRole(session.user);
            } else {
                setRoleLoading(false); // No session = no role to load
            }
            setAuthLoading(false);
        });

        // 2. Listen for future auth events
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!session?.user) {
                setCurrentUser(null);
                setAuthLoading(false);
                setRoleLoading(false); // Stop loading role if logged out
                return;
            }
            setCurrentUser(mapUser(session.user));
            fetchRole(session.user);
            setAuthLoading(false);
        });

        return () => {
            subscription.unsubscribe();
            if (lockoutTimer.current) clearTimeout(lockoutTimer.current);
        };
    }, [mapUser, fetchRole]);

    // --- Rate limiting helpers ---

    const isLockedOut = useCallback(() => {
        if (!lockoutUntil) return false;
        if (Date.now() < lockoutUntil) return true;
        // Lockout expired
        setLockoutUntil(null);
        setLoginAttempts(0);
        return false;
    }, [lockoutUntil]);

    const getRemainingLockout = useCallback(() => {
        if (!lockoutUntil) return 0;
        return Math.max(0, Math.ceil((lockoutUntil - Date.now()) / 1000));
    }, [lockoutUntil]);

    const recordFailedAttempt = useCallback(() => {
        setLoginAttempts((prev) => {
            const next = prev + 1;
            if (next >= MAX_LOGIN_ATTEMPTS) {
                const until = Date.now() + LOCKOUT_DURATION_MS;
                setLockoutUntil(until);
                // Auto-clear lockout after duration
                lockoutTimer.current = setTimeout(() => {
                    setLockoutUntil(null);
                    setLoginAttempts(0);
                }, LOCKOUT_DURATION_MS);
            }
            return next;
        });
    }, []);

    // --- Auth actions ---

    const login = useCallback(
        async (email, password) => {
            if (isLockedOut()) {
                return {
                    success: false,
                    error: `Too many attempts. Try again in ${getRemainingLockout()} seconds.`,
                    lockedOut: true,
                };
            }

            const { error } = await supabase.auth.signInWithPassword({ email, password });

            if (error) {
                recordFailedAttempt();
                const remaining = MAX_LOGIN_ATTEMPTS - loginAttempts - 1;
                const suffix = remaining > 0 ? ` (${remaining} attempts remaining)` : '';
                return { success: false, error: error.message + suffix };
            }

            // Success — reset attempts
            setLoginAttempts(0);
            setLockoutUntil(null);
            return { success: true };
        },
        [isLockedOut, getRemainingLockout, recordFailedAttempt, loginAttempts]
    );

    const signup = useCallback(async (name, email, password) => {
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { full_name: name },
                emailRedirectTo: window.location.origin,
            },
        });
        if (error) return { success: false, error: error.message };

        // Keep session alive — Supabase won't allow re-login if email isn't confirmed
        return { success: true, message: '✅ Account created! Logging you in...' };
    }, []);

    const loginWithGoogle = useCallback(async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin
            }
        });
        if (error) {
            return { success: false, error: error.message };
        }
    }, []);

    const logout = useCallback(async () => {
        await supabase.auth.signOut();
        Object.keys(localStorage).forEach((key) => {
            if (key.startsWith('marathi-') || key.startsWith('sb-')) {
                localStorage.removeItem(key);
            }
        });
        setCurrentUser(null);
    }, []);

    const resetPassword = useCallback(async (email) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin,
        });
        return error ? { success: false, error: error.message } : { success: true };
    }, []);

    return {
        currentUser,
        isLoggedIn: !!currentUser,
        isAdmin: currentUser?.role === 'admin',
        login,
        loginWithGoogle,
        signup,
        logout,
        resetPassword,
        authLoading,
        roleLoading, // Expose roleLoading state
        // Expose rate limiting state for UI
        loginAttempts,
        isLockedOut: isLockedOut(),
        lockoutSeconds: getRemainingLockout(),
    };
}
