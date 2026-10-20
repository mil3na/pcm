import { Link } from '@tanstack/react-router';
import { StarIcon } from '@radix-ui/react-icons';
import { Button, Card, Container, Flex, Grid, Heading, Text } from '@radix-ui/themes';
import { useFavorites } from '@/features/cards/favorites/FavoritesContext';

function UpcomingStat({ title, description }: { title: string; description: string }) {
    return (
        <Card>
            <Flex direction="column" gap="2">
                <Heading size="3">{title}</Heading>
                <Text color="gray">{description}</Text>
                <Text size="1" color="gray">
                    Coming soon
                </Text>
            </Flex>
        </Card>
    );
}

export function HomePage() {
    const { favoriteIds } = useFavorites();
    const favoriteCount = favoriteIds.length;

    return (
        <Container size="4" py="6">
            <Heading mb="3">Welcome to Pokémon Card Manager</Heading>
            <Text as="p" color="gray" mb="6">
                Keep the cards you love close, and pick up where you left off.
            </Text>
            <Grid columns={{ initial: '1', sm: '2', lg: '3' }} gap="4">
                <Card>
                    <Flex direction="column" gap="3">
                        <Flex align="center" gap="2">
                            <StarIcon aria-hidden="true" />
                            <Heading size="3">Your collection</Heading>
                        </Flex>
                        <Text size="6" weight="bold" align="center">
                            {favoriteCount}
                        </Text>
                        <Text color="gray" align="center">
                            cards saved.
                        </Text>
                        {favoriteCount === 0 && (
                            <Text color="gray">Browse the cards and tap the star on anything you want to save.</Text>
                        )}
                        <Button asChild variant="soft" mt="1">
                            <Link to="/favorites">View favorites</Link>
                        </Button>
                    </Flex>
                </Card>
                <UpcomingStat
                    title="Favorites by type"
                    description="See which Pokémon types show up most in your favorites."
                />
                <UpcomingStat
                    title="Recently favorited"
                    description="Pick up where you left off with cards you saved recently."
                />
            </Grid>
        </Container>
    );
}
