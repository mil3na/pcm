import { afterEach, describe, expect, it, vi } from 'vitest';
import {
    loadFavorites,
    saveFavorites,
    toggleFavoriteId,
} from '@/features/cards/favorites/favoritesStorage';

function createStorage(initialValue: string | null = null) {
    let storedValue = initialValue;
    return {
        getItem: vi.fn(() => storedValue),
        setItem: vi.fn((_key: string, value: string) => {
            storedValue = value;
        }),
    };
}

afterEach(() => {
    vi.unstubAllGlobals();
});

describe('favorites storage', () => {
    it('loads saved IDs and removes duplicates and empty IDs', () => {
        vi.stubGlobal('window', {
            localStorage: createStorage('["base1-1","base1-1","","base1-2"]'),
        });

        expect(loadFavorites()).toEqual({ ids: ['base1-1', 'base1-2'] });
    });

    it('returns an empty list when no saved value exists', () => {
        vi.stubGlobal('window', { localStorage: createStorage() });

        expect(loadFavorites()).toEqual({ ids: [] });
    });

    it('reports invalid JSON and invalid stored formats', () => {
        vi.stubGlobal('window', { localStorage: createStorage('{') });
        expect(loadFavorites()).toMatchObject({
            ids: [],
            error: expect.stringContaining('Could not read saved favorites'),
        });

        vi.stubGlobal('window', { localStorage: createStorage('["base1-1", 1]') });
        expect(loadFavorites()).toEqual({
            ids: [],
            error: 'Saved favorites have an invalid format. Changing favorites will replace the saved list.',
        });
    });

    it('reports localStorage read failures', () => {
        const storage = createStorage();
        storage.getItem.mockImplementation(() => {
            throw new Error('storage disabled');
        });
        vi.stubGlobal('window', { localStorage: storage });

        expect(loadFavorites()).toEqual({
            ids: [],
            error: 'Could not read saved favorites: storage disabled',
        });
    });

    it('toggles an ID on and off without mutating the original list', () => {
        const currentIds = ['base1-1'];

        expect(toggleFavoriteId(currentIds, 'base1-2')).toEqual(['base1-1', 'base1-2']);
        expect(toggleFavoriteId(currentIds, 'base1-1')).toEqual([]);
        expect(currentIds).toEqual(['base1-1']);
    });

    it('persists the updated favorite IDs', () => {
        const storage = createStorage();
        vi.stubGlobal('window', { localStorage: storage });

        saveFavorites(['base1-1', 'base1-2']);

        expect(storage.setItem).toHaveBeenCalledWith(
            'pokemon-tcg-favorite-card-ids',
            '["base1-1","base1-2"]',
        );
    });

    it('surfaces localStorage write failures to the caller', () => {
        const storage = createStorage();
        storage.setItem.mockImplementation(() => {
            throw new Error('storage full');
        });
        vi.stubGlobal('window', { localStorage: storage });

        expect(() => saveFavorites(['base1-1'])).toThrow('storage full');
    });
});
