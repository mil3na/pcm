import { createFileRoute } from '@tanstack/react-router';
import { Container, Heading, Text } from '@radix-ui/themes';

export const Route = createFileRoute('/')({
    component: Home,
});

function Home() {
    return (
        <Container size="3" py="6">
            <Heading mb="3">Welcome to Pokémon Card Manager</Heading>
            <Text as="p" color="gray" mb="4">
                Browse the card collection, search for Pokémon cards, and save your favorites.
            </Text>
        </Container>
    );
}
