import type { PersistedClient, Persister } from '@tanstack/react-query-persist-client';

const STORAGE_KEY = 'pokemon-tcg-filter-query-cache';

function isPersistedClient(value: unknown): value is PersistedClient {
    if (typeof value !== 'object' || value === null) return false;

    return (
        'timestamp' in value &&
        typeof value.timestamp === 'number' &&
        'buster' in value &&
        typeof value.buster === 'string' &&
        'clientState' in value &&
        typeof value.clientState === 'object' &&
        value.clientState !== null
    );
}

function removeInvalidCache(): void {
    try {
        window.localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.error('Could not remove the invalid persisted query cache.', error);
    }
}

export const queryCachePersister: Persister = {
    persistClient(persistedClient) {
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(persistedClient));
        } catch (error) {
            console.error('Could not persist the query cache to localStorage.', error);
        }
    },
    restoreClient() {
        let storedClient: string | null;
        try {
            storedClient = window.localStorage.getItem(STORAGE_KEY);
        } catch (error) {
            console.error('Could not read the persisted query cache from localStorage.', error);
            return undefined;
        }
        if (!storedClient) return undefined;

        try {
            const parsed: unknown = JSON.parse(storedClient);
            if (isPersistedClient(parsed)) return parsed;
            console.error('The persisted query cache has an invalid format.');
        } catch (error) {
            console.error('Could not parse the persisted query cache.', error);
        }

        removeInvalidCache();
        return undefined;
    },
    removeClient() {
        try {
            window.localStorage.removeItem(STORAGE_KEY);
        } catch (error) {
            console.error('Could not remove the persisted query cache from localStorage.', error);
        }
    },
};
