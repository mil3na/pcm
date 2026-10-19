import { useCallback, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { ErrorCallout } from '../../../components/ErrorCallout';
import { FavoritesContext } from './FavoritesContext';

const STORAGE_KEY = 'pokemon-tcg-favorite-card-ids';

interface FavoritesState {
    ids: string[];
    error?: string;
}

function loadFavorites(): FavoritesState {
    try {
        if (typeof window === 'undefined') return { ids: [] };
        const storedValue = window.localStorage.getItem(STORAGE_KEY);
        if (!storedValue) return { ids: [] };

        const parsed: unknown = JSON.parse(storedValue);
        if (!Array.isArray(parsed) || !parsed.every((id) => typeof id === 'string')) {
            return {
                ids: [],
                error: 'Saved favorites have an invalid format. Changing favorites will replace the saved list.',
            };
        }

        return { ids: [...new Set(parsed.filter((id) => id.length > 0))] };
    } catch (error) {
        return {
            ids: [],
            error: `Could not read saved favorites: ${error instanceof Error ? error.message : 'Unknown storage error'}`,
        };
    }
}

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
        const currentIds = favoriteIdsRef.current;
        const nextIds = currentIds.includes(cardId)
            ? currentIds.filter((id) => id !== cardId)
            : [...currentIds, cardId];

        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextIds));
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
