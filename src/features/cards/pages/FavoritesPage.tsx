import { useQueries } from '@tanstack/react-query';
import { Button, Card as RadixCard, Container, Flex, Grid, Heading, Text } from '@radix-ui/themes';
import { Card } from '../components/Card';
import { getCard } from '../api/pokemonTcg';
import { useFavorites } from '../favorites/FavoritesContext';
import { CenteredSpinner } from '../../../components/CenteredSpinner';

export function FavoritesPage() {
    const { favoriteIds } = useFavorites();
    const cardQueries = useQueries({
        queries: favoriteIds.map((cardId) => ({
            queryKey: ['card', cardId],
            queryFn: () => getCard(cardId),
        })),
    });
    const pendingCount = cardQueries.filter((query) => query.isPending).length;

    return (
        <Container size="4" py="6">
            <Heading mb="4">Favorite cards</Heading>
            {favoriteIds.length === 0 && (
                <Text color="gray">You haven’t added any cards to your favorites yet.</Text>
            )}
            {pendingCount > 0 && (
                <CenteredSpinner
                    label="Loading favorite cards"
                    className={favoriteIds.length > pendingCount ? 'centered-spinner-compact' : undefined}
                />
            )}
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
                                    <Button
                                        variant="soft"
                                        onClick={() => void query.refetch()}
                                    >
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
