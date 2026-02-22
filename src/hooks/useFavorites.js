import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'marathi-dukandaar-favorites';

/**
 * Favorites hook — stores bookmarked shop IDs in localStorage.
 */
export default function useFavorites() {
    const [favorites, setFavorites] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    }, [favorites]);

    const toggleFavorite = useCallback((shopId) => {
        setFavorites((prev) =>
            prev.includes(shopId) ? prev.filter((id) => id !== shopId) : [...prev, shopId]
        );
    }, []);

    const isFavorite = useCallback(
        (shopId) => favorites.includes(shopId),
        [favorites]
    );

    return { favorites, toggleFavorite, isFavorite };
}
