import React from 'react';
import { Map, LayoutList, Navigation, Sparkles, LogOut } from 'lucide-react';
import { useTranslation } from '../i18n.jsx';

export default function LandingPage({ onSelect, onLogout, currentUser }) {
    const { t } = useTranslation();

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative', overflowX: 'hidden', overflowY: 'auto', background: 'var(--bg-dark)' }}>

            {/* Animated SaaS Blobs */}
            <div className="saas-blob saffron"></div>
            <div className="saas-blob blue"></div>

            {/* Nav */}
            <nav style={{ zIndex: 10, padding: '24px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.8rem' }}>🚩</span>
                    <h1 style={{ color: 'var(--text-primary)', fontSize: '1.25rem', fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>{t('app_title')}</h1>
                </div>
                {currentUser && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>
                            👋 {currentUser.name}
                        </span>
                        <button
                            onClick={onLogout}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '6px',
                                background: 'transparent', border: '1px solid var(--border)',
                                color: 'var(--text-primary)', padding: '6px 14px',
                                borderRadius: 'var(--radius-xl)', cursor: 'pointer',
                                fontSize: '0.85rem', fontWeight: 600, transition: 'var(--transition)'
                            }}
                            onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--text-muted)'; }}
                            onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}
                        >
                            <LogOut size={14} /> Logout
                        </button>
                    </div>
                )}
            </nav>

            {/* Main Content */}
            <main className="animate-fade" style={{ zIndex: 10, display: 'flex', flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '0 20px 40px' }}>

                <div style={{ textAlign: 'center', marginBottom: '60px', maxWidth: '700px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--bg-glass)', border: '1px solid var(--border)', padding: '6px 16px', borderRadius: '100px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--saffron)', marginBottom: '24px', backdropFilter: 'blur(10px)', boxShadow: 'var(--shadow-sm)' }}>
                        <Sparkles size={14} /> New Generation SaaS UI
                    </div>

                    <h2 style={{
                        fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                        fontWeight: 800,
                        lineHeight: 1.1,
                        letterSpacing: '-1.5px',
                        marginBottom: '20px',
                        color: 'transparent',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        backgroundImage: 'linear-gradient(100deg, var(--text-primary) 20%, var(--text-muted) 100%)'
                    }}>
                        Explore Maharashtra business in seconds.
                    </h2>

                    <p style={{ color: 'var(--text-secondary)', fontSize: 'clamp(1rem, 2vw, 1.2rem)', fontWeight: 400, margin: '0 auto', maxWidth: '500px', lineHeight: 1.6 }}>
                        Seamlessly discover native shops around you with our interactive map or ultra-fast local directory.
                    </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '24px', width: '100%', flexWrap: 'wrap', maxWidth: '900px' }}>
                    {/* Map Card */}
                    <button
                        onClick={() => onSelect('map')}
                        style={{
                            flex: '1 1 300px',
                            background: 'var(--bg-glass)',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-xl)',
                            padding: '40px 32px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            textAlign: 'left',
                            gap: '24px',
                            cursor: 'pointer',
                            transition: 'var(--transition)',
                            boxShadow: 'var(--shadow-md)',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.borderColor = 'var(--saffron)';
                            e.currentTarget.style.transform = 'translateY(-6px)';
                            e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.borderColor = 'var(--border)';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                        }}
                    >
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'linear-gradient(90deg, var(--saffron), var(--info))' }}></div>
                        <div style={{ background: 'var(--saffron-glow)', padding: '16px', borderRadius: 'var(--radius-md)', color: 'var(--saffron)', display: 'inline-flex' }}>
                            <Map size={32} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', letterSpacing: '-0.5px' }}>Interactive Map</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>
                                Pan and zoom through an ultra-smooth vector map. Explore rich details of businesses across cities, villages, and highways.
                            </p>
                        </div>
                    </button>

                    {/* Dashboard Card */}
                    <button
                        onClick={() => onSelect('dashboard')}
                        style={{
                            flex: '1 1 300px',
                            background: 'var(--bg-glass)',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-xl)',
                            padding: '40px 32px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            textAlign: 'left',
                            gap: '24px',
                            cursor: 'pointer',
                            transition: 'var(--transition)',
                            boxShadow: 'var(--shadow-md)',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.borderColor = 'var(--info)';
                            e.currentTarget.style.transform = 'translateY(-6px)';
                            e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.borderColor = 'var(--border)';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                        }}
                    >
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'linear-gradient(90deg, var(--info), var(--saffron))' }}></div>
                        <div style={{ background: 'rgba(59, 130, 246, 0.15)', padding: '16px', borderRadius: 'var(--radius-md)', color: 'var(--info)', display: 'inline-flex' }}>
                            <LayoutList size={32} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', letterSpacing: '-0.5px' }}>Local Directory</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>
                                Need a service fast? See every shop automatically sorted by GPS distance within a 1km radius of your precise location.
                            </p>
                        </div>
                    </button>
                </div>
            </main>

            <footer style={{ zIndex: 10, padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Made with ❤️ for Marathi Manus 🚩
            </footer>
        </div>
    );
}
