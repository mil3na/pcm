import { useQueries } from '@tanstack/react-query';
import { Button, Card as RadixCard, Container, Dialog, Flex, Grid, Heading, Spinner, Text } from '@radix-ui/themes';
import { Card } from '@/features/cards/components/Card';
import { cardQueryOptions } from '@/features/cards/queries';
import { useFavorites } from '@/features/cards/favorites/FavoritesContext';

export function FavoritesPage() {
    const { favoriteIds } = useFavorites();
    const cardQueries = useQueries({
        queries: favoriteIds.map(cardQueryOptions),
    });
    const pendingCount = cardQueries.filter((query) => query.isPending).length;

    return (
        <Container size="4" py="6">
            <Heading mb="4">Favorite cards</Heading>
            <Dialog.Root open={pendingCount > 0}>
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
            {favoriteIds.length === 0 && <Text color="gray">You haven’t added any cards to your favorites yet.</Text>}
            {favoriteIds.length > 0 && (
                <Grid columns={{ initial: '1', sm: '2', md: '3', lg: '4' }} gap="4">
                    {cardQueries.map((query, index) => {
                        const cardId = favoriteIds[index];
                        if (query.data) return <Card key={cardId} card={query.data} />;
                        if (!query.isError) return null;

                        return (
                            <RadixCard key={cardId} className="favorite-card-placeholder">
                                <Flex direction="column" align="center" justify="center" gap="3">
                                    <Text align="center">Could not load card {cardId}.</Text>
                                    <Button variant="soft" onClick={() => void query.refetch()}>
                                        Try again
                                    </Button>
                                </Flex>
                            </RadixCard>
                        );
                    })}
                </Grid>
            )}
        </Container>
    );
}
