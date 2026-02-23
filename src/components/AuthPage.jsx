import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, LogIn, UserPlus, ShieldCheck } from 'lucide-react';

/**
 * Authentication page — Login / Sign Up / Forgot Password.
 */
export default function AuthPage({ onLogin, onSignup, onResetPassword, onLoginWithGoogle }) {
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
            {/* LEFT SIDE - Form Content */}
            <div className="auth-container animate-pop">
                <div className="auth-brand">
                    <span className="auth-logo-icon">🚩</span>
                    <h1>Marathi Dukandaar</h1>
                </div>

                <div className="auth-main-content">
                    {tab === 'login' && <h2 className="auth-heading">Welcome back</h2>}
                    {tab === 'signup' && <h2 className="auth-heading">Create an account</h2>}
                    {tab === 'forgot' && <h2 className="auth-heading">Forgot Password</h2>}

                    <p className="auth-subheading">
                        {tab === 'login' && 'Please enter your details to sign in.'}
                        {tab === 'signup' && 'Join us to discover & support Marathi businesses.'}
                        {tab === 'forgot' && "Enter your email and we'll send a reset link."}
                    </p>

                    {/* Messages */}
                    {error && <div className="auth-error animate-pop">⚠️ {error}</div>}
                    {success && <div className="auth-success animate-pop">✅ {success}</div>}

                    {/* LOGIN FORM */}
                    {tab === 'login' && (
                        <form onSubmit={handleLogin} className="auth-form">
                            <div className="auth-field-group">
                                <label>Email address</label>
                                <div className="auth-field">
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        autoFocus
                                        required
                                    />
                                </div>
                            </div>

                            <div className="auth-field-group">
                                <label>Password</label>
                                <div className="auth-field">
                                    <input
                                        type={showPass ? 'text' : 'password'}
                                        placeholder="••••••••"
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
                            </div>

                            <div className="auth-form-options">
                                <label className="auth-remember">
                                    <input type="checkbox" />
                                    <span>Remember for 30 days</span>
                                </label>
                                <button type="button" className="auth-forgot-link" onClick={() => switchTab('forgot')}>
                                    Forgot password
                                </button>
                            </div>

                            <button type="submit" className="auth-submit-btn" disabled={loading}>
                                {loading ? <span className="auth-spinner" /> : 'Sign in'}
                            </button>

                            {/* Google Sign In Placeholder (will be hooked up shortly) */}
                            <button type="button" className="auth-google-btn" onClick={onLoginWithGoogle}>
                                <svg className="auth-google-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                Sign in with Google
                            </button>
                        </form>
                    )}

                    {/* SIGN UP FORM */}
                    {tab === 'signup' && (
                        <form onSubmit={handleSignup} className="auth-form">
                            <div className="auth-field-group">
                                <label>Full name</label>
                                <div className="auth-field">
                                    <input
                                        type="text"
                                        placeholder="Enter your name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        autoFocus
                                        required
                                    />
                                </div>
                            </div>

                            <div className="auth-field-group">
                                <label>Email address</label>
                                <div className="auth-field">
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="auth-field-group">
                                <label>Password</label>
                                <div className="auth-field">
                                    <input
                                        type={showPass ? 'text' : 'password'}
                                        placeholder="At least 6 characters"
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
                            </div>

                            <button type="submit" className="auth-submit-btn" disabled={loading} style={{ marginTop: '16px' }}>
                                {loading ? <span className="auth-spinner" /> : 'Create Account'}
                            </button>

                            <button type="button" className="auth-google-btn" onClick={onLoginWithGoogle}>
                                <svg className="auth-google-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                Sign up with Google
                            </button>
                        </form>
                    )}

                    {/* FORGOT PASSWORD FORM */}
                    {tab === 'forgot' && (
                        <form onSubmit={handleForgot} className="auth-form">
                            <div className="auth-field-group">
                                <label>Email address</label>
                                <div className="auth-field">
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        autoFocus
                                        required
                                    />
                                </div>
                            </div>

                            <button type="submit" className="auth-submit-btn" disabled={loading} style={{ marginTop: '16px' }}>
                                {loading ? <span className="auth-spinner" /> : 'Send Reset Link'}
                            </button>

                            <div className="auth-switch-prompt" style={{ marginTop: '16px' }}>
                                <button type="button" onClick={() => switchTab('login')}>
                                    ← Back to log in
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Footer Links */}
                    {tab === 'login' && (
                        <div className="auth-switch-prompt">
                            Don't have an account?
                            <button type="button" onClick={() => switchTab('signup')}>Sign up</button>
                        </div>
                    )}

                    {tab === 'signup' && (
                        <div className="auth-switch-prompt">
                            Already have an account?
                            <button type="button" onClick={() => switchTab('login')}>Log in</button>
                        </div>
                    )}
                </div>
            </div>

            {/* RIGHT SIDE - Purple Illustration Panel */}
            <div className="auth-side-panel animate-fade">
                {/* SVG Illustration Placeholder that resembles the one provided */}
                <svg className="auth-illustration" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Background abstract elements */}
                    <circle cx="200" cy="150" r="120" stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeDasharray="4 4" />
                    <path d="M50 100 Q 150 50 250 150 T 400 100" stroke="rgba(255,255,255,0.2)" fill="none" strokeWidth="2" />
                    <path d="M0 250 Q 100 200 200 280 T 400 220" stroke="rgba(255,255,255,0.15)" fill="none" strokeWidth="2" />
                    <circle cx="80" cy="80" r="4" fill="rgba(255,255,255,0.4)" />
                    <circle cx="320" cy="60" r="6" fill="rgba(255,255,255,0.3)" />
                    <circle cx="340" cy="240" r="5" fill="rgba(255,255,255,0.5)" />
                    <circle cx="60" cy="260" r="3" fill="rgba(255,255,255,0.2)" />

                    {/* Fake UI window in the graphic */}
                    <rect x="100" y="80" width="200" height="140" rx="10" fill="#ffffff" opacity="0.1" />
                    <rect x="120" y="100" width="60" height="8" rx="4" fill="#ffffff" opacity="0.4" />
                    <rect x="120" y="120" width="100" height="6" rx="3" fill="#ffffff" opacity="0.2" />
                    <rect x="120" y="135" width="140" height="6" rx="3" fill="#ffffff" opacity="0.2" />
                    <rect x="120" y="150" width="80" height="6" rx="3" fill="#ffffff" opacity="0.2" />
                    <rect x="120" y="175" width="60" height="24" rx="12" fill="#ffffff" opacity="0.3" />

                    {/* Checkmark circle */}
                    <circle cx="260" cy="185" r="30" fill="#ffffff" opacity="0.2" />
                    <path d="M245 185 L255 195 L275 175" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
        </div>
    );
}
