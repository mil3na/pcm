const STORAGE_KEY = 'pokemon-tcg-favorite-card-ids';

export interface FavoritesState {
    ids: string[];
    error?: string;
}

export function loadFavorites(): FavoritesState {
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

export function toggleFavoriteId(currentIds: string[], cardId: string): string[] {
    return currentIds.includes(cardId)
        ? currentIds.filter((id) => id !== cardId)
        : [...currentIds, cardId];
}

export function saveFavorites(ids: string[]): void {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}
