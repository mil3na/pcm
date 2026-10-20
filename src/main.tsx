import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/index.css';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { routeTree } from '@/routeTree.gen';
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';
import { QueryClient } from '@tanstack/react-query';
import { QueryClientProvider } from '@tanstack/react-query';
import { FavoritesProvider } from '@/features/cards/favorites/FavoritesProvider';
import { QUERY_CACHE_LIFETIME_MS } from '@/constants';

const router = createRouter({ routeTree });
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: QUERY_CACHE_LIFETIME_MS,
            retry: false,
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
            <QueryClientProvider client={queryClient}>
                <FavoritesProvider>
                    <RouterProvider router={router} />
                </FavoritesProvider>
            </QueryClientProvider>
        </Theme>
    </StrictMode>,
);
