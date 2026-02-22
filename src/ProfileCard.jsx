import React from 'react';
import { Award, TrendingUp, Trophy } from 'lucide-react';

/**
 * Floating profile card — shows rank, points, and progress bar.
 * Clicking it opens the leaderboard.
 */
export default function ProfileCard({ points, rank, progress, user, onClickLeaderboard }) {
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
