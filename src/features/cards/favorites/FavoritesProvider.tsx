import { useCallback, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { ErrorCallout } from '@/components/ErrorCallout';
import { FavoritesContext } from '@/features/cards/favorites/FavoritesContext';
import {
    loadFavorites,
    saveFavorites,
    toggleFavoriteId,
} from '@/features/cards/favorites/favoritesStorage';

export function FavoritesProvider({ children }: { children: ReactNode }) {
    const [initialState] = useState(loadFavorites);
    const [favoriteIds, setFavoriteIds] = useState(initialState.ids);
    const [storageError, setStorageError] = useState(initialState.error);
    const favoriteIdsRef = useRef(favoriteIds);

    const isFavorite = useCallback(
        (cardId: string) => favoriteIds.includes(cardId),
        [favoriteIds],
    );

    const toggleFavorite = useCallback((cardId: string) => {
        const nextIds = toggleFavoriteId(favoriteIdsRef.current, cardId);

        try {
            saveFavorites(nextIds);
            favoriteIdsRef.current = nextIds;
            setFavoriteIds(nextIds);
            setStorageError(undefined);
        } catch (error) {
            setStorageError(
                `Could not save favorites: ${error instanceof Error ? error.message : 'Unknown storage error'}`,
            );
        }
    }, []);

    const value = useMemo(
        () => ({ favoriteIds, storageError, isFavorite, toggleFavorite }),
        [favoriteIds, storageError, isFavorite, toggleFavorite],
    );

    return (
        <FavoritesContext.Provider value={value}>
            {storageError && (
                <ErrorCallout className="favorites-storage-error">
                    {storageError}
                </ErrorCallout>
            )}
            {children}
        </FavoritesContext.Provider>
    );
}
