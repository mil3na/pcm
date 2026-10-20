import { useQuery } from '@tanstack/react-query';
import { Button, Card as RadixCard, Container, Dialog, Flex, Grid, Heading, Spinner, Text } from '@radix-ui/themes';
import { Card } from '@/features/cards/components/Card';
import { cardCollectionQueryOptions } from '@/features/cards/queries';
import { useFavorites } from '@/features/cards/favorites/FavoritesContext';
import { ErrorCallout } from '@/components/ErrorCallout';

export function FavoritesPage() {
    const { favoriteIds } = useFavorites();
    const collectionQuery = useQuery(cardCollectionQueryOptions());

    return (
        <Container size="4" py="6">
            <Heading mb="4">Favorite cards</Heading>
            <Dialog.Root open={collectionQuery.isPending && favoriteIds.length > 0}>
                <Dialog.Content>
                    <Flex direction="column" align="center" gap="3">
                        <Spinner size="3" aria-label="Loading" />
                        <Dialog.Title mb="0">Loading favorite cards</Dialog.Title>
                        <Dialog.Description align="center">
                            Please wait while your saved cards are loading.
                        </Dialog.Description>
                    </Flex>
                </Dialog.Content>
            </Dialog.Root>
            {collectionQuery.isError && (
                <ErrorCallout
                    action={
                        <Button variant="soft" onClick={() => void collectionQuery.refetch()}>
                            Try again
                        </Button>
                    }
                >
                    Could not load favorite cards: {collectionQuery.error.message}
                </ErrorCallout>
            )}
            {favoriteIds.length === 0 && <Text color="gray">You haven’t added any cards to your favorites yet.</Text>}
            {favoriteIds.length > 0 && collectionQuery.data && (
                <Grid columns={{ initial: '1', sm: '2', md: '3', lg: '4' }} gap="4">
                    {favoriteIds.map((cardId) => {
                        const card = collectionQuery.data.find((item) => item.id === cardId);
                        if (card) return <Card key={cardId} card={card} />;

                        return (
                            <RadixCard key={cardId} className="favorite-card-placeholder">
                                <Text align="center">
                                    Card {cardId} is not present in this collection snapshot.
                                </Text>
                            </RadixCard>
                        );
                    })}
                </Grid>
            )}
        </Container>
    );
}
