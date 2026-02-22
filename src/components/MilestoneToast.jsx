import React, { useEffect } from 'react';
import { Trophy, Star, Crown } from 'lucide-react';
import confetti from 'canvas-confetti';

const MILESTONE_META = {
    50: { icon: Star, title: 'First Steps!', desc: 'You earned 50 points — keep going!', color: '#f59e0b' },
    200: { icon: Trophy, title: 'Community Builder!', desc: '200 points! You are making a real difference.', color: '#8b5cf6' },
    500: { icon: Crown, title: 'Dukandaar Legend!', desc: '500 points! You are a true champion of Marathi shops.', color: '#ef4444' },
    1000: { icon: Crown, title: 'Maharathi!', desc: '1000 points! Absolute legend status achieved.', color: '#ec4899' },
    2000: { icon: Crown, title: 'Supreme Guru!', desc: '2000 points! You are unstoppable.', color: '#06b6d4' },
};

/**
 * Celebration toast with confetti for crossing a points milestone.
 */
export default function MilestoneToast({ milestone, onDismiss }) {
    const meta = MILESTONE_META[milestone] || MILESTONE_META[50];
    const IconComponent = meta.icon;

    useEffect(() => {
        confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#ff6f00', '#ff9800', '#ffc107', '#fff', meta.color],
        });

        const timer = setTimeout(() => {
            if (onDismiss) onDismiss();
        }, 4500);

        return () => clearTimeout(timer);
    }, [milestone, onDismiss, meta.color]);

    return (
        <div className="milestone-toast animate-pop" style={{ '--milestone-color': meta.color }}>
            <div className="milestone-icon-ring" style={{ background: meta.color }}>
                <IconComponent size={28} color="#fff" />
            </div>
            <div className="milestone-body">
                <div className="milestone-title">{meta.title}</div>
                <div className="milestone-desc">{meta.desc}</div>
                <div className="milestone-points">{milestone} points reached 🎉</div>
            </div>
            <button className="milestone-close" onClick={onDismiss}>✕</button>
        </div>
    );
}
