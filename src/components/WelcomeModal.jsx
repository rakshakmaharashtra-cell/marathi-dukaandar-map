import React, { useState } from 'react';
import { ChevronRight, Sparkles } from 'lucide-react';

const STEPS = [
    {
        icon: '🚩',
        title: 'Welcome to Marathi Dukandaar Map!',
        desc: 'A community-driven platform to discover and support Marathi-owned businesses in your area.',
    },
    {
        icon: '📍',
        title: 'Add Shops to the Map',
        desc: "Click the \"Add New Shop\" button, tap on the map to set a location, and fill in the details. It's that simple!",
    },
    {
        icon: '🏆',
        title: 'Earn Points & Climb Ranks',
        desc: 'Every shop you add earns you 50 points. Level up from Sahayak (Helper) to Peshwa (Prime Minister)!',
    },
    {
        icon: '❤️',
        title: 'Favorite & Share',
        desc: 'Bookmark your favorite shops, share them with friends, and help grow the Marathi business community.',
    },
];

/**
 * Welcome / onboarding modal shown to first-time users (4-step carousel).
 */
export default function WelcomeModal({ onClose }) {
    const [step, setStep] = useState(0);

    const handleFinish = () => {
        localStorage.setItem('marathi-dukandaar-welcomed', 'true');
        onClose();
    };

    return (
        <div className="modal-overlay animate-fade" onClick={handleFinish}>
            <div className="welcome-modal animate-pop" onClick={(e) => e.stopPropagation()}>
                {/* Progress dots */}
                <div className="welcome-dots">
                    {STEPS.map((_, i) => (
                        <div key={i} className={`welcome-dot ${i === step ? 'active' : i < step ? 'done' : ''}`} />
                    ))}
                </div>

                <div className="welcome-icon">{STEPS[step].icon}</div>
                <h2 className="welcome-title">{STEPS[step].title}</h2>
                <p className="welcome-desc">{STEPS[step].desc}</p>

                <div className="welcome-actions">
                    {step > 0 && (
                        <button className="welcome-btn-back" onClick={() => setStep((s) => s - 1)}>
                            Back
                        </button>
                    )}
                    {step < STEPS.length - 1 ? (
                        <button className="welcome-btn-next" onClick={() => setStep((s) => s + 1)}>
                            Next <ChevronRight size={16} />
                        </button>
                    ) : (
                        <button className="welcome-btn-start" onClick={handleFinish}>
                            <Sparkles size={16} /> Let's Go!
                        </button>
                    )}
                </div>

                <button className="welcome-skip" onClick={handleFinish}>
                    Skip
                </button>
            </div>
        </div>
    );
}
