import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Button, Container, Heading, Text, TextField } from '@radix-ui/themes';
import { CardListing } from '@/features/cards/components/CardListing';
import { CARDS_PAGE_SIZE, searchCardsByName } from '@/features/cards/api/pokemonTcg';
import { ErrorCallout } from '@/components/ErrorCallout';
import { CenteredSpinner } from '@/components/CenteredSpinner';

interface SearchPageProps {
    name?: string;
    page: number;
    onSearchChange: (name: string | undefined) => void;
    onPageChange: (page: number) => void;
}

export function SearchPage({ name, page, onSearchChange, onPageChange }: SearchPageProps) {
    const [inputValue, setInputValue] = useState(name ?? '');
    const normalizedInput = inputValue.trim();
    const isSearchSettled = normalizedInput === (name ?? '');

    useEffect(() => {
        if (isSearchSettled) return;

        const timeout = window.setTimeout(() => {
            onSearchChange(normalizedInput || undefined);
        }, 300);

        return () => window.clearTimeout(timeout);
    }, [isSearchSettled, normalizedInput, onSearchChange]);

    const searchQuery = useQuery({
        queryKey: ['card-search', name, page],
        queryFn: () => searchCardsByName(name ?? '', page),
        enabled: Boolean(name) && isSearchSettled,
    });

    return (
        <Container size="4" py="6">
            <Heading mb="4">Search cards</Heading>
            <TextField.Root
                size="3"
                mb="5"
                type="search"
                aria-label="Search cards by name"
                placeholder="Search by card name"
                value={inputValue}
                onChange={(event) => setInputValue(event.currentTarget.value)}
            >
            </TextField.Root>
            {!normalizedInput && (
                <Text color="gray">Enter a card name to search.</Text>
            )}
            {normalizedInput && !isSearchSettled && (
                <CenteredSpinner label="Searching cards" />
            )}
            {name && isSearchSettled && searchQuery.isPending && (
                <CenteredSpinner label="Loading cards" />
            )}
            {name && isSearchSettled && searchQuery.isError && (
                <ErrorCallout
                    action={
                        <Button variant="soft" onClick={() => void searchQuery.refetch()}>
                            Try again
                        </Button>
                    }
                >
                    Could not search cards: {searchQuery.error.message}
                </ErrorCallout>
            )}
            {name &&
                isSearchSettled &&
                searchQuery.isSuccess &&
                (searchQuery.data.cards.length > 0 ? (
                    <CardListing
                        cards={searchQuery.data.cards}
                        page={page}
                        totalPages={Math.max(
                            1,
                            Math.ceil(searchQuery.data.totalCount / CARDS_PAGE_SIZE),
                        )}
                        onPageChange={onPageChange}
                    />
                ) : (
                    <Text color="gray">No cards match “{name}”.</Text>
                ))}
        </Container>
    );
}
