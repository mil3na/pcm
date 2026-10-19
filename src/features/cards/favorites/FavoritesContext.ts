import { createContext, useContext } from 'react';

export interface FavoritesContextValue {
    favoriteIds: string[];
    storageError?: string;
    isFavorite: (cardId: string) => boolean;
    toggleFavorite: (cardId: string) => void;
}

export const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function useFavorites(): FavoritesContextValue {
    const context = useContext(FavoritesContext);
    if (!context) {
        throw new Error('useFavorites must be used within a FavoritesProvider');
    }
    return context;
}
