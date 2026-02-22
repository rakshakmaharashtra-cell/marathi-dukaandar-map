import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, LogIn, UserPlus, ShieldCheck } from 'lucide-react';

/**
 * Authentication page — Login / Sign Up / Forgot Password.
 */
export default function AuthPage({ onLogin, onSignup, onResetPassword }) {
    const [tab, setTab] = useState('login'); // 'login' | 'signup' | 'forgot'
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    function switchTab(t) {
        setTab(t);
        setError('');
        setSuccess('');
        setName('');
        setEmail('');
        setPassword('');
    }

    async function handleLogin(e) {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (!email.trim() || !password) return setError('Enter email and password.');
        setLoading(true);
        const result = await onLogin(email.trim(), password);
        if (!result.success) setError(result.error || 'Login failed.');
        setLoading(false);
    }

    async function handleSignup(e) {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (!name.trim()) return setError('Enter your full name.');
        if (!email.trim()) return setError('Enter your email.');
        if (password.length < 6) return setError('Password must be at least 6 characters.');
        setLoading(true);
        const result = await onSignup(name.trim(), email.trim(), password);
        if (!result.success) {
            setError(result.error || 'Signup failed.');
        } else {
            setSuccess(result.message || 'Account created! Please log in.');
            // Switch to login tab so user can log in manually
            setTimeout(() => setTab('login'), 1500);
        }
        setLoading(false);
    }

    async function handleForgot(e) {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (!email.trim()) return setError('Enter your email.');
        setLoading(true);
        const result = await onResetPassword(email.trim());
        if (!result.success) {
            setError(result.error || 'Could not send reset email.');
        } else {
            setSuccess('Password reset email sent! Check your inbox.');
        }
        setLoading(false);
    }

    return (
        <div className="auth-page">
            <div className="auth-bg-decoration" />

            <div className="auth-container animate-pop">
                {/* Brand */}
                <div className="auth-brand">
                    <span className="auth-logo-icon">🚩</span>
                    <h1>Marathi Dukandaar Map</h1>
                    <p>Discover &amp; support Marathi businesses in your community</p>
                </div>

                {/* Tabs */}
                {tab !== 'forgot' && (
                    <div className="auth-tabs">
                        <button
                            className={`auth-tab ${tab === 'login' ? 'active' : ''}`}
                            onClick={() => switchTab('login')}
                        >
                            <LogIn size={16} /> Login
                        </button>
                        <button
                            className={`auth-tab ${tab === 'signup' ? 'active' : ''}`}
                            onClick={() => switchTab('signup')}
                        >
                            <UserPlus size={16} /> Sign Up
                        </button>
                    </div>
                )}

                {/* Messages */}
                {error && <div className="auth-error animate-pop">⚠️ {error}</div>}
                {success && <div className="auth-success animate-pop">✅ {success}</div>}

                {/* LOGIN */}
                {tab === 'login' && (
                    <form onSubmit={handleLogin} className="auth-form">
                        <div className="auth-field">
                            <Mail size={16} className="auth-field-icon" />
                            <input
                                type="email"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoFocus
                                required
                            />
                        </div>
                        <div className="auth-field">
                            <Lock size={16} className="auth-field-icon" />
                            <input
                                type={showPass ? 'text' : 'password'}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="auth-eye-btn"
                                onClick={() => setShowPass((p) => !p)}
                            >
                                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>

                        <button type="button" className="auth-forgot-link" onClick={() => switchTab('forgot')}>
                            Forgot Password?
                        </button>

                        <button type="submit" className="auth-submit-btn" disabled={loading}>
                            {loading ? <span className="auth-spinner" /> : <LogIn size={18} />}
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                )}

                {/* SIGN UP */}
                {tab === 'signup' && (
                    <form onSubmit={handleSignup} className="auth-form">
                        <div className="auth-field">
                            <User size={16} className="auth-field-icon" />
                            <input
                                type="text"
                                placeholder="Full name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                autoFocus
                                required
                            />
                        </div>
                        <div className="auth-field">
                            <Mail size={16} className="auth-field-icon" />
                            <input
                                type="email"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="auth-field">
                            <Lock size={16} className="auth-field-icon" />
                            <input
                                type={showPass ? 'text' : 'password'}
                                placeholder="Password (min 6 characters)"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                minLength={6}
                                required
                            />
                            <button
                                type="button"
                                className="auth-eye-btn"
                                onClick={() => setShowPass((p) => !p)}
                            >
                                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                        <button type="submit" className="auth-submit-btn" disabled={loading}>
                            {loading ? <span className="auth-spinner" /> : <UserPlus size={18} />}
                            {loading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>
                )}

                {/* FORGOT PASSWORD */}
                {tab === 'forgot' && (
                    <form onSubmit={handleForgot} className="auth-form">
                        <p className="auth-forgot-desc">Enter your email and we'll send a reset link.</p>
                        <div className="auth-field">
                            <Mail size={16} className="auth-field-icon" />
                            <input
                                type="email"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoFocus
                                required
                            />
                        </div>
                        <button type="submit" className="auth-submit-btn" disabled={loading}>
                            {loading ? <span className="auth-spinner" /> : <Mail size={18} />}
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                        <button type="button" className="auth-forgot-link" onClick={() => switchTab('login')}>
                            ← Back to Login
                        </button>
                    </form>
                )}

                {/* Footer */}
                <div className="auth-admin-hint">
                    <ShieldCheck size={14} />
                    <span>Admin access is role-protected</span>
                </div>
                <div className="auth-footer">
                    <p>Made with ❤️ for Marathi Manus 🚩</p>
                </div>
            </div>
        </div>
    );
}
