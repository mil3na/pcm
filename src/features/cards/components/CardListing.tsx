import { Button, Flex, Grid, Text } from '@radix-ui/themes';
import type { PokemonTcgCard } from '../types';
import { Card } from './Card';

interface CardListingProps {
    cards: PokemonTcgCard[];
    page?: number;
    totalPages?: number;
    onPageChange?: (page: number) => void;
}

export function CardListing({ cards, page, totalPages, onPageChange }: CardListingProps) {
    return (
        <>
            <Grid columns={{ initial: '1', sm: '2', md: '3', lg: '4' }} gap="4">
                {cards.map((card) => (
                    <Card key={card.id} card={card} />
                ))}
            </Grid>
            {page !== undefined && totalPages !== undefined && onPageChange && (
                <Flex align="center" justify="center" gap="3" mt="5">
                    <Button
                        variant="soft"
                        disabled={page <= 1}
                        onClick={() => onPageChange(page - 1)}
                    >
                        Previous
                    </Button>
                    <Text size="2">
                        Page {page} of {totalPages}
                    </Text>
                    <Button
                        variant="soft"
                        disabled={page >= totalPages}
                        onClick={() => onPageChange(page + 1)}
                    >
                        Next
                    </Button>
                </Flex>
            )}
        </>
    );
}
