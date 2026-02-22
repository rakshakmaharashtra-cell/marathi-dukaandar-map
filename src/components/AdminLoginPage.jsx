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
            <div className="auth-bg-decoration" />
            <div className="auth-container animate-pop">
                {/* Admin Brand */}
                <div className="auth-brand">
                    <div className="admin-login-badge">
                        <ShieldCheck size={32} />
                    </div>
                    <h1>Admin Access</h1>
                    <p>Marathi Dukandaar Map — Restricted Area</p>
                </div>

                {error && <div className="auth-error animate-pop">⚠️ {error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="auth-field">
                        <Mail size={16} className="auth-field-icon" />
                        <input
                            type="email"
                            placeholder="Admin email"
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
                        <button type="button" className="auth-eye-btn" onClick={() => setShowPass((p) => !p)}>
                            {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>

                    <button type="submit" className="auth-submit-btn" disabled={loading}>
                        {loading ? <span className="auth-spinner" /> : <ShieldCheck size={18} />}
                        {loading ? 'Authenticating...' : 'Admin Login'}
                    </button>
                </form>

                <div className="auth-footer" style={{ marginTop: '20px' }}>
                    <p>🔒 Only authorized admins may access this page</p>
                </div>
            </div>
        </div>
    );
}
