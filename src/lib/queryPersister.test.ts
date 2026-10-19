import type { PersistedClient } from '@tanstack/react-query-persist-client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { queryCachePersister } from '@/lib/queryPersister';

const STORAGE_KEY = 'pokemon-tcg-filter-query-cache';

function createStorage(initialValue: string | null = null) {
    let storedValue = initialValue;
    return {
        getItem: vi.fn(() => storedValue),
        setItem: vi.fn((_key: string, value: string) => {
            storedValue = value;
        }),
        removeItem: vi.fn(() => {
            storedValue = null;
        }),
    };
}

function createPersistedClient(): PersistedClient {
    return {
        timestamp: 123,
        buster: 'test',
        clientState: {
            mutations: [],
            queries: [],
        },
    };
}

afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
});

describe('queryCachePersister', () => {
    it('persists and restores a valid query cache', () => {
        const storage = createStorage();
        vi.stubGlobal('window', { localStorage: storage });
        const client = createPersistedClient();

        queryCachePersister.persistClient(client);

        expect(storage.setItem).toHaveBeenCalledWith(STORAGE_KEY, JSON.stringify(client));
        expect(queryCachePersister.restoreClient()).toEqual(client);
    });

    it('returns undefined when there is no stored cache', () => {
        vi.stubGlobal('window', { localStorage: createStorage() });

        expect(queryCachePersister.restoreClient()).toBeUndefined();
    });

    it.each(['{', JSON.stringify({ timestamp: 'invalid' })])(
        'removes malformed persisted data %s',
        (storedValue) => {
            const storage = createStorage(storedValue);
            vi.stubGlobal('window', { localStorage: storage });
            vi.spyOn(console, 'error').mockImplementation(() => undefined);

            expect(queryCachePersister.restoreClient()).toBeUndefined();
            expect(storage.removeItem).toHaveBeenCalledWith(STORAGE_KEY);
        },
    );

    it('reports storage read failures and returns no client', () => {
        const storage = createStorage();
        storage.getItem.mockImplementation(() => {
            throw new Error('storage disabled');
        });
        vi.stubGlobal('window', { localStorage: storage });
        const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

        expect(queryCachePersister.restoreClient()).toBeUndefined();
        expect(consoleError).toHaveBeenCalledWith(
            'Could not read the persisted query cache from localStorage.',
            expect.any(Error),
        );
    });

    it('reports cache write failures', () => {
        const storage = createStorage();
        storage.setItem.mockImplementation(() => {
            throw new Error('storage full');
        });
        vi.stubGlobal('window', { localStorage: storage });
        const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

        queryCachePersister.persistClient(createPersistedClient());

        expect(consoleError).toHaveBeenCalledWith(
            'Could not persist the query cache to localStorage.',
            expect.any(Error),
        );
    });

    it('removes persisted cache data', () => {
        const storage = createStorage(JSON.stringify(createPersistedClient()));
        vi.stubGlobal('window', { localStorage: storage });

        queryCachePersister.removeClient();

        expect(storage.removeItem).toHaveBeenCalledWith(STORAGE_KEY);
    });

    it('reports cache removal failures', () => {
        const storage = createStorage();
        storage.removeItem.mockImplementation(() => {
            throw new Error('storage disabled');
        });
        vi.stubGlobal('window', { localStorage: storage });
        const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

        queryCachePersister.removeClient();

        expect(consoleError).toHaveBeenCalledWith(
            'Could not remove the persisted query cache from localStorage.',
            expect.any(Error),
        );
    });
});
