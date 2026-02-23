import React, { useState } from 'react';
import { ShieldCheck, Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';

/**
 * Secret admin login page — accessible via /#/admin.
 * Not linked from anywhere in the app UI.
 */
export default function AdminLoginPage({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        if (!email.trim() || !password) return setError('Enter email and password.');
        setLoading(true);
        const result = await onLogin(email.trim(), password);
        if (!result.success) setError(result.error || 'Login failed.');
        setLoading(false);
    }

    return (
        <div className="auth-page">
            <div className="auth-container animate-pop">
                <div className="auth-brand">
                    <span className="auth-logo-icon">🚩</span>
                    <h1>Admin Login</h1>
                </div>

                <div className="auth-main-content">
                    <div className="admin-login-badge" style={{ margin: '0 0 16px 0' }}>
                        <ShieldCheck size={28} />
                    </div>
                    <h2 className="auth-heading">Restricted Area</h2>
                    <p className="auth-subheading">Sign in with your authorized admin credentials.</p>

                    {error && <div className="auth-error animate-pop">⚠️ {error}</div>}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="auth-field-group">
                            <label>Admin Email</label>
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
                                <button type="button" className="auth-eye-btn" onClick={() => setShowPass((p) => !p)}>
                                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="auth-submit-btn" disabled={loading} style={{ marginTop: '20px' }}>
                            {loading ? <span className="auth-spinner" /> : 'Log in as Admin'}
                        </button>
                    </form>

                    <div className="auth-switch-prompt" style={{ marginTop: '32px' }}>
                        <button type="button" onClick={() => window.location.hash = ''}>
                            ← Back to main site
                        </button>
                    </div>
                </div>
            </div>

            <div className="auth-side-panel animate-fade">
                <svg className="auth-illustration" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Admin/Security specific illustration background */}
                    <circle cx="200" cy="150" r="100" stroke="rgba(255,255,255,0.15)" strokeWidth="4" />
                    <circle cx="200" cy="150" r="60" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeDasharray="6 6" />
                    <rect x="180" y="110" width="40" height="50" rx="20" stroke="rgba(255,255,255,0.4)" strokeWidth="6" />
                    <rect x="160" y="150" width="80" height="60" rx="8" fill="rgba(255,255,255,0.2)" />
                    <circle cx="200" cy="180" r="10" fill="rgba(255,255,255,0.4)" />
                    <path d="M200 190 V200" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
                </svg>
            </div>
        </div>
    );
}
