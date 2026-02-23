import React, { useState, useEffect } from 'react';
import { Star, ShieldCheck, UserCheck } from 'lucide-react';
import { supabase } from '../supabaseClient';

export default function ReviewSection({ shop, currentUser, onRefreshShops }) {
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);

    const [localVerified, setLocalVerified] = useState(false);

    useEffect(() => {
        setLocalVerified((shop.verified_by_users?.length || 0) > 0);
    }, [shop]);

    const fetchReviews = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('reviews')
            .select(`*, user(full_name)`)
            .eq('shop_id', shop.id)
            .order('created_at', { ascending: false });

        if (!error && data) {
            // Because auth.users is linked differently sometimes we can't join easily.
            // But we can just fetch basic reviews, and if we don't have user name, we show "User".
            setReviews(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchReviews();
    }, [shop.id]);

    const handleVerify = async () => {
        if (!currentUser || currentUser.role !== 'admin' || localVerified) return;

        setSubmitting(true);
        const updatedVerifications = [currentUser.id];

        try {
            await supabase.from('shops').update({ verified_by_users: updatedVerifications }).eq('id', shop.id);
            setLocalVerified(true);

            if (onRefreshShops) onRefreshShops();
        } catch (err) {
            console.error(err);
        }
        setSubmitting(false);
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!currentUser || !comment.trim()) return;

        setSubmitting(true);
        try {
            // Insert review
            const { error } = await supabase.from('reviews').insert({
                shop_id: shop.id,
                user_id: currentUser.id,
                rating,
                comment: comment.trim()
            });

            if (!error) {
                // Award points for reviewing (10 pts)
                await supabase.rpc('increment_points', { user_id: currentUser.id, amount: 10 });
                setComment('');
                fetchReviews();
            }
        } catch (err) {
            console.error(err);
        }
        setSubmitting(false);
    };

    return (
        <div className="review-section" style={{ padding: '16px', borderTop: '1px solid var(--border)' }}>

            <div className="verification-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-card)', padding: '12px', borderRadius: '8px', marginBottom: '16px', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldCheck size={20} color={localVerified ? '#10b981' : '#9ca3af'} />
                    <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                            {localVerified ? 'Admin Verified' : 'Unverified Shop'}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            {localVerified ? 'This shop has been personally visited and verified by an admin.' : 'This shop has not yet been verified by an admin.'}
                        </div>
                    </div>
                </div>
                {currentUser?.role === 'admin' && !localVerified && (
                    <button
                        onClick={handleVerify}
                        disabled={submitting}
                        style={{ background: 'var(--primary-light)', color: 'var(--primary)', border: 'none', padding: '6px 12px', borderRadius: '16px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', display: 'flex', gap: '4px', alignItems: 'center' }}
                    >
                        <UserCheck size={14} /> Verify
                    </button>
                )}
            </div>

            <h3 style={{ fontSize: '1rem', marginBottom: '12px' }}>Reviews</h3>

            {currentUser ? (
                <form onSubmit={handleSubmitReview} style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
                        {[1, 2, 3, 4, 5].map(star => (
                            <Star
                                key={star}
                                size={20}
                                fill={rating >= star ? '#f59e0b' : 'none'}
                                color={rating >= star ? '#f59e0b' : '#d1d5db'}
                                onClick={() => setRating(star)}
                                style={{ cursor: 'pointer' }}
                            />
                        ))}
                    </div>
                    <textarea
                        className="form-input"
                        placeholder="Write a review..."
                        rows="2"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.9rem' }}
                        required
                    />
                    <button
                        type="submit"
                        disabled={submitting || !comment.trim()}
                        style={{ marginTop: '8px', background: 'var(--primary)', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
                    >
                        Post Review (+10 pts)
                    </button>
                </form>
            ) : (
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                    Log in to leave a review and earn points!
                </div>
            )}

            <div className="review-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {loading ? (
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Loading reviews...</div>
                ) : reviews.length > 0 ? (
                    reviews.map(rev => (
                        <div key={rev.id} style={{ background: 'var(--bg-body)', padding: '12px', borderRadius: '8px' }}>
                            <div style={{ display: 'flex', gap: '2px', marginBottom: '4px' }}>
                                {[1, 2, 3, 4, 5].map(star => (
                                    <Star key={star} size={12} fill={rev.rating >= star ? '#f59e0b' : 'none'} color={rev.rating >= star ? '#f59e0b' : '#d1d5db'} />
                                ))}
                            </div>
                            <div style={{ fontSize: '0.9rem' }}>{rev.comment}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                                {new Date(rev.created_at).toLocaleDateString()}
                            </div>
                        </div>
                    ))
                ) : (
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>No reviews yet. Be the first!</div>
                )}
            </div>
        </div>
    );
}
