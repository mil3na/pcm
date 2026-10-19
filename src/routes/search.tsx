import { createFileRoute } from '@tanstack/react-router';
import { useCallback } from 'react';
import { SearchPage } from '@/features/cards/pages/SearchPage';

function optionalName(value: unknown): string | undefined {
    return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function pageNumber(value: unknown): number {
    const page = Number(value);
    return Number.isSafeInteger(page) && page > 0 ? page : 1;
}

export const Route = createFileRoute('/search')({
    validateSearch: (search: Record<string, unknown>) => ({
        name: optionalName(search.name),
        page: pageNumber(search.page),
    }),
    component: SearchRoute,
});

function SearchRoute() {
    const { name, page } = Route.useSearch();
    const navigate = Route.useNavigate();
    const onSearchChange = useCallback(
        (nextName: string | undefined) => {
            void navigate({
                search: { name: nextName, page: 1 },
            });
        },
        [navigate],
    );
    const onPageChange = useCallback(
        (nextPage: number) => {
            void navigate({
                search: (previous) => ({ ...previous, page: nextPage }),
            });
        },
        [navigate],
    );

    return (
        <SearchPage
            key={name ?? ''}
            name={name}
            page={page}
            onSearchChange={onSearchChange}
            onPageChange={onPageChange}
        />
    );
}
