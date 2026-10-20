import { useQuery } from '@tanstack/react-query';
import { Button, Container, Heading, Text } from '@radix-ui/themes';
import { CardFilters } from '@/features/cards/components/CardFilters';
import { CardListing } from '@/features/cards/components/CardListing';
import { ErrorCallout } from '@/components/ErrorCallout';
import { CenteredSpinner } from '@/components/CenteredSpinner';
import {
    getCardsFromCollection,
    getRaritiesFromCollection,
    getTypesFromCollection,
} from '@/features/cards/data/cardCollection';
import { cardCollectionQueryOptions } from '@/features/cards/queries';
import { CARDS_PAGE_SIZE, FIRST_PAGE } from '@/constants';

interface CardsPageProps {
    page: number;
    type?: string;
    rarity?: string;
    onFiltersChange: (type: string | undefined, rarity: string | undefined) => void;
    onPageChange: (page: number) => void;
}

export function CardsPage({ page, type, rarity, onFiltersChange, onPageChange }: CardsPageProps) {
    const collectionQuery = useQuery(cardCollectionQueryOptions());
    const types = collectionQuery.data ? getTypesFromCollection(collectionQuery.data) : [];
    const rarities = collectionQuery.data ? getRaritiesFromCollection(collectionQuery.data) : [];
    const cardsPage = collectionQuery.data
        ? getCardsFromCollection(collectionQuery.data, page, { type, rarity })
        : undefined;

    return (
        <Container size="4" py="6">
            <Heading mb="4">All cards</Heading>
            <CardFilters
                type={type}
                rarity={rarity}
                types={types}
                rarities={rarities}
                typesDisabled={!collectionQuery.isSuccess}
                raritiesDisabled={!collectionQuery.isSuccess}
                onTypeChange={(nextType) => onFiltersChange(nextType, rarity)}
                onRarityChange={(nextRarity) => onFiltersChange(type, nextRarity)}
                onClear={() => onFiltersChange(undefined, undefined)}
            />
            <Text size="1" color="gray" mb="4" as="p">
                Filters are unavailable until the local card collection has loaded.
            </Text>
            {collectionQuery.isPending && <CenteredSpinner label="Loading cards" />}
            {collectionQuery.isError && (
                <ErrorCallout
                    action={
                        <Button variant="soft" onClick={() => void collectionQuery.refetch()}>
                            Try again
                        </Button>
                    }
                >
                    Could not load card collection: {collectionQuery.error.message}
                </ErrorCallout>
            )}
            {cardsPage &&
                (cardsPage.cards.length > 0 ? (
                    <CardListing
                        cards={cardsPage.cards}
                        page={page}
                        totalPages={Math.max(FIRST_PAGE, Math.ceil(cardsPage.totalCount / CARDS_PAGE_SIZE))}
                        onPageChange={onPageChange}
                    />
                ) : (
                    <Text color="gray">No cards match these filters.</Text>
                ))}
        </Container>
    );
}
