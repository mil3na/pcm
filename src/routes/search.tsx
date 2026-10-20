import { createFileRoute } from '@tanstack/react-router';
import { useCallback } from 'react';
import { SearchPage } from '@/features/cards/pages/SearchPage';
import { FIRST_PAGE } from '@/constants';
import { parsePageNumber } from '@/lib/searchParams';

function optionalName(value: unknown): string | undefined {
    return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

export const Route = createFileRoute('/search')({
    validateSearch: (search: Record<string, unknown>) => ({
        name: optionalName(search.name),
        page: parsePageNumber(search.page),
    }),
    component: SearchRoute,
});

function SearchRoute() {
    const { name, page } = Route.useSearch();
    const navigate = Route.useNavigate();
    const onSearchChange = useCallback(
        (nextName: string | undefined) => {
            void navigate({
                search: { name: nextName, page: FIRST_PAGE },
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
            name={name}
            page={page}
            onSearchChange={onSearchChange}
            onPageChange={onPageChange}
        />
    );
}
