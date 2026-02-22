import React from 'react';
import { X, Trophy, Medal } from 'lucide-react';

const MOCK_USERS = [
    { id: 'mock-1', name: 'Ramesh Patil', points: 3450, rank: '👑 Peshwa' },
    { id: 'mock-2', name: 'Sneha Deshmukh', points: 2800, rank: '👑 Peshwa' },
    { id: 'mock-3', name: 'Vivek Kadam', points: 1950, rank: '👑 Peshwa' },
    { id: 'mock-4', name: 'Pooja Joshi', points: 1200, rank: '👑 Peshwa' },
    { id: 'mock-5', name: 'Amit Shinde', points: 850, rank: '🚩 Sarsenapati' },
    { id: 'mock-6', name: 'Rahul Pawar', points: 400, rank: '🛡️ Sardar' },
];

/**
 * Leaderboard modal showing top contributors.
 * Mixes mock data with the current user's real points.
 */
export default function LeaderboardModal({ onClose, currentUser, currentPoints }) {
    const combined = [
        ...MOCK_USERS,
        {
            id: currentUser?.id || 'you',
            name: (currentUser?.name || 'You') + ' (You)',
            points: currentPoints,
            isCurrentUser: true,
        },
    ];

    const uniqueIds = new Set();
    const leaderboard = combined
        .sort((a, b) => b.points - a.points)
        .filter((user) => {
            if (uniqueIds.has(user.id)) return false;
            uniqueIds.add(user.id);
            return true;
        })
        .slice(0, 10);

    return (
        <div className="modal-overlay animate-fade" onClick={onClose}>
            <div className="leaderboard-modal animate-slide-up" onClick={(e) => e.stopPropagation()}>
                <div className="leaderboard-header">
                    <div>
                        <h2>🏆 Top Contributors</h2>
                        <p>The heroes building the Marathi Dukandaar map</p>
                    </div>
                    <button className="form-close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="leaderboard-list">
                    {leaderboard.map((user, index) => (
                        <div
                            key={user.id}
                            className={`leaderboard-item ${user.isCurrentUser ? 'current-user-highlight' : ''}`}
                        >
                            <div className="leaderboard-rank">
                                {index === 0 ? (
                                    <Trophy size={20} fill="#f59e0b" color="#f59e0b" />
                                ) : index === 1 ? (
                                    <Medal size={20} fill="#94a3b8" color="#94a3b8" />
                                ) : index === 2 ? (
                                    <Medal size={20} fill="#b45309" color="#b45309" />
                                ) : (
                                    `#${index + 1}`
                                )}
                            </div>
                            <div className="leaderboard-info">
                                <h4>{user.name}</h4>
                                {user.rank && <span>{user.rank}</span>}
                            </div>
                            <div className="leaderboard-points">
                                <span>{user.points}</span> pts
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
