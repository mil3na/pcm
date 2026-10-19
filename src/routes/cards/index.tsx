import { createFileRoute } from '@tanstack/react-router';
import { CardsPage } from '@/features/cards/pages/CardsPage';

function optionalString(value: unknown): string | undefined {
    return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function pageNumber(value: unknown): number {
    const page = Number(value);
    return Number.isSafeInteger(page) && page > 0 ? page : 1;
}

export const Route = createFileRoute('/cards/')({
    validateSearch: (search: Record<string, unknown>) => ({
        page: pageNumber(search.page),
        type: optionalString(search.type),
        rarity: optionalString(search.rarity),
    }),
    component: CardsIndexRoute,
});

function CardsIndexRoute() {
    const { page, type, rarity } = Route.useSearch();
    const navigate = Route.useNavigate();

    return (
        <CardsPage
            page={page}
            type={type}
            rarity={rarity}
            onFiltersChange={(nextType, nextRarity) => {
                void navigate({
                    search: {
                        page: 1,
                        type: nextType,
                        rarity: nextRarity,
                    },
                });
            }}
            onPageChange={(nextPage) => {
                void navigate({
                    search: (previous) => ({ ...previous, page: nextPage }),
                });
            }}
        />
    );
}
