import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Button, Container, Heading, Text, TextField } from '@radix-ui/themes';
import { CARDS_PAGE_SIZE, FIRST_PAGE, SEARCH_DEBOUNCE_MS } from '@/constants';
import { CardListing } from '@/features/cards/components/CardListing';
import { searchCardsInCollection } from '@/features/cards/data/cardCollection';
import { ErrorCallout } from '@/components/ErrorCallout';
import { CenteredSpinner } from '@/components/CenteredSpinner';
import { cardCollectionQueryOptions } from '@/features/cards/queries';

interface SearchPageProps {
    name?: string;
    page: number;
    onSearchChange: (name: string | undefined) => void;
    onPageChange: (page: number) => void;
}

export function SearchPage({ name, page, onSearchChange, onPageChange }: SearchPageProps) {
    const [inputValue, setInputValue] = useState(name ?? '');
    const [previousName, setPreviousName] = useState(name);
    const normalizedInput = inputValue.trim();
    const isSearchSettled = normalizedInput === (name ?? '');

    if (name !== previousName) {
        setPreviousName(name);
        setInputValue(name ?? '');
    }

    useEffect(() => {
        if (isSearchSettled) return;

        const timeout = window.setTimeout(() => {
            onSearchChange(normalizedInput || undefined);
        }, SEARCH_DEBOUNCE_MS);

        return () => window.clearTimeout(timeout);
    }, [isSearchSettled, normalizedInput, onSearchChange]);

    const collectionQuery = useQuery(cardCollectionQueryOptions());
    const searchPage =
        name && isSearchSettled && collectionQuery.data
            ? searchCardsInCollection(collectionQuery.data, name, page)
            : undefined;

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
            ></TextField.Root>
            {!normalizedInput && <Text color="gray">Enter a card name to search.</Text>}
            {normalizedInput && !isSearchSettled && <CenteredSpinner label="Searching cards" />}
            {name && isSearchSettled && collectionQuery.isPending && <CenteredSpinner label="Loading cards" />}
            {name && isSearchSettled && collectionQuery.isError && (
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
            {searchPage &&
                (searchPage.cards.length > 0 ? (
                    <CardListing
                        cards={searchPage.cards}
                        page={page}
                        totalPages={Math.max(FIRST_PAGE, Math.ceil(searchPage.totalCount / CARDS_PAGE_SIZE))}
                        onPageChange={onPageChange}
                    />
                ) : (
                    <Text color="gray">No cards match “{name}”.</Text>
                ))}
        </Container>
    );
}
