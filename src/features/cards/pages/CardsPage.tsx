import { useQuery } from '@tanstack/react-query';
import { Button, Container, Heading, Text } from '@radix-ui/themes';
import { CardFilters } from '@/features/cards/components/CardFilters';
import { CardListing } from '@/features/cards/components/CardListing';
import { ErrorCallout } from '@/components/ErrorCallout';
import { CenteredSpinner } from '@/components/CenteredSpinner';
import { CARDS_PAGE_SIZE, FIRST_PAGE } from '@/constants';
import { getCards, getRarities, getTypes } from '@/features/cards/api/pokemonTcg';

interface CardsPageProps {
    page: number;
    type?: string;
    rarity?: string;
    onFiltersChange: (type: string | undefined, rarity: string | undefined) => void;
    onPageChange: (page: number) => void;
}

export function CardsPage({ page, type, rarity, onFiltersChange, onPageChange }: CardsPageProps) {
    const typesQuery = useQuery({
        queryKey: ['card-types'],
        queryFn: getTypes,
    });
    const raritiesQuery = useQuery({
        queryKey: ['card-rarities'],
        queryFn: getRarities,
    });
    const cardsQuery = useQuery({
        queryKey: ['cards', page, type, rarity],
        queryFn: () => getCards(page, { type, rarity }),
    });

    return (
        <Container size="4" py="6">
            <Heading mb="4">All cards</Heading>
            <CardFilters
                type={type}
                rarity={rarity}
                types={typesQuery.data ?? []}
                rarities={raritiesQuery.data ?? []}
                typesDisabled={typesQuery.isPending || typesQuery.isError}
                raritiesDisabled={raritiesQuery.isPending || raritiesQuery.isError}
                onTypeChange={(nextType) => onFiltersChange(nextType, rarity)}
                onRarityChange={(nextRarity) => onFiltersChange(type, nextRarity)}
                onClear={() => onFiltersChange(undefined, undefined)}
            />
            <Text size="1" color="gray" mb="4" as="p">
                Filters are only available when API data is successfully loaded. If you see greyed filters, please try
                again later.
            </Text>
            {cardsQuery.isPending && <CenteredSpinner label="Loading cards" />}
            {cardsQuery.isError && (
                <ErrorCallout
                    action={
                        <Button variant="soft" onClick={() => void cardsQuery.refetch()}>
                            Try again
                        </Button>
                    }
                >
                    Could not load cards: {cardsQuery.error.message}
                </ErrorCallout>
            )}
            {cardsQuery.isSuccess &&
                (cardsQuery.data.cards.length > 0 ? (
                    <CardListing
                        cards={cardsQuery.data.cards}
                        page={page}
                        totalPages={Math.max(
                            FIRST_PAGE,
                            Math.ceil(cardsQuery.data.totalCount / CARDS_PAGE_SIZE),
                        )}
                        onPageChange={onPageChange}
                    />
                ) : (
                    <Text color="gray">No cards match these filters.</Text>
                ))}
        </Container>
    );
}
