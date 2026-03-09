import React from 'react';
import { Map, LayoutList, MapPin } from 'lucide-react';
import { useTranslation } from '../i18n.jsx';

export default function LandingPage({ onSelect }) {
    const { t } = useTranslation();

    return (
        <div className="landing-page animate-fade" style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-dark)' }}>
            <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🚩</div>
                <h1 style={{ color: 'var(--saffron)', fontSize: '2rem', marginBottom: '10px' }}>{t('app_title')}</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>How would you like to explore Marathi businesses today?</p>
            </div>

            <div style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center', gap: '20px', padding: '20px', flexWrap: 'wrap' }}>
                <button
                    onClick={() => onSelect('map')}
                    style={{
                        flex: '1 1 300px',
                        maxWidth: '400px',
                        background: 'var(--bg-card)',
                        border: '2px solid var(--border)',
                        borderRadius: 'var(--radius-xl)',
                        padding: '40px 20px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '20px',
                        cursor: 'pointer',
                        transition: 'var(--transition)',
                        boxShadow: 'var(--shadow-md)',
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--saffron)'; e.currentTarget.style.transform = 'translateY(-5px)'; }}
                    onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                    <div style={{ background: 'var(--saffron-glow)', padding: '20px', borderRadius: '50%', color: 'var(--saffron)' }}>
                        <Map size={48} />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: '8px' }}>Interactive Map</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5' }}>Explore shops visually on the map. Find exactly where businesses are located across Maharashtra.</p>
                    </div>
                </button>

                <button
                    onClick={() => onSelect('dashboard')}
                    style={{
                        flex: '1 1 300px',
                        maxWidth: '400px',
                        background: 'var(--bg-card)',
                        border: '2px solid var(--border)',
                        borderRadius: 'var(--radius-xl)',
                        padding: '40px 20px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '20px',
                        cursor: 'pointer',
                        transition: 'var(--transition)',
                        boxShadow: 'var(--shadow-md)',
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--saffron)'; e.currentTarget.style.transform = 'translateY(-5px)'; }}
                    onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                    <div style={{ background: 'var(--saffron-glow)', padding: '20px', borderRadius: '50%', color: 'var(--saffron)' }}>
                        <LayoutList size={48} />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: '8px' }}>Local Directory</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5' }}>JustDial style list view. Instantly see businesses within a 1km radius around you.</p>
                    </div>
                </button>
            </div>

            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                Made with ❤️ for Marathi Manus
            </div>
        </div>
    );
}
