import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/index.css';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { routeTree } from '@/routeTree.gen';
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';
import { QueryClient } from '@tanstack/react-query';
import { HTTPError } from 'ky';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { FavoritesProvider } from '@/features/cards/favorites/FavoritesProvider';
import { queryCachePersister } from '@/lib/queryPersister';

const router = createRouter({ routeTree });
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 12 * 60 * 60 * 1000,
            retry: (failureCount, error) =>
                error instanceof HTTPError &&
                error.response.status === 500 &&
                failureCount < 5,
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30_000),
        },
    },
});

// Lets TanStack Router's types know about your router
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router;
    }
}

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Theme accentColor="amber">
            <PersistQueryClientProvider
                client={queryClient}
                persistOptions={{
                    persister: queryCachePersister,
                    maxAge: 12 * 60 * 60 * 1000,
                    dehydrateOptions: {
                        shouldDehydrateQuery: (query) =>
                            query.state.status === 'success' &&
                            (query.queryKey[0] === 'card-types' ||
                                query.queryKey[0] === 'card-rarities'),
                    },
                }}
            >
                <FavoritesProvider>
                    <RouterProvider router={router} />
                </FavoritesProvider>
            </PersistQueryClientProvider>
        </Theme>
    </StrictMode>,
);
