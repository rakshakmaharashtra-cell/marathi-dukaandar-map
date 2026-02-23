import React from 'react';
import { Award, TrendingUp, Trophy } from 'lucide-react';

/**
 * Floating profile card — shows rank, points, and progress bar.
 * Clicking it opens the leaderboard.
 */
export default function ProfileCard({ points, rank, progress, user, onClickLeaderboard }) {
    const badges = [];
    if (points >= 50) badges.push({ icon: '🥉', title: 'Bronze Starter' });
    if (points >= 150) badges.push({ icon: '🥈', title: 'Silver Contributor' });
    if (points >= 300) badges.push({ icon: '🥇', title: 'Gold Local Guide' });
    if (points >= 500) badges.push({ icon: '💎', title: 'Diamond Legend' });

    return (
        <div
            className="profile-card animate-slide-right"
            onClick={onClickLeaderboard}
            title="View Top Contributors"
            style={{ cursor: 'pointer' }}
        >
            <div className="profile-header">
                <div className="profile-avatar">
                    <span>{rank.emoji}</span>
                </div>
                <div className="profile-info">
                    <div className="profile-rank-label">{rank.label}</div>
                    <div className="profile-points-value">
                        <Award size={14} />
                        <span>{points} pts</span>
                    </div>
                    {badges.length > 0 && (
                        <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                            {badges.map((b, i) => (
                                <span key={i} title={b.title} style={{ fontSize: '0.8rem', cursor: 'help' }}>
                                    {b.icon}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
                <button className="leaderboard-btn" aria-label="Leaderboard">
                    <Trophy size={16} />
                </button>
            </div>
            <div className="profile-progress-wrap">
                <div className="profile-progress-bar">
                    <div className="profile-progress-fill" style={{ width: `${progress.progress}%` }} />
                </div>
                <div className="profile-next">
                    <TrendingUp size={12} />
                    <span>Next: {progress.nextMilestone} pts</span>
                </div>
            </div>
        </div>
    );
}
