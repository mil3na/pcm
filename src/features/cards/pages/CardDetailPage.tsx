import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { useState } from 'react';
import { Button, Container } from '@radix-ui/themes';
import { CardDetails } from '@/features/cards/components/CardDetails';
import type { CardDetailsTab } from '@/features/cards/components/CardDetails';
import { cardCollectionQueryOptions } from '@/features/cards/queries';
import { ErrorCallout } from '@/components/ErrorCallout';
import { CenteredSpinner } from '@/components/CenteredSpinner';

interface CardDetailPageProps {
    cardId: string;
}

export function CardDetailPage({ cardId }: CardDetailPageProps) {
    const [tab, setTab] = useState<CardDetailsTab>('general');
    const collectionQuery = useQuery(cardCollectionQueryOptions());
    const card = collectionQuery.data?.find((item) => item.id === cardId);

    return (
        <Container size="4" py="6">
            <Button asChild variant="ghost" mb="4">
                <Link
                    to="/cards"
                    search={{ page: 1, type: undefined, rarity: undefined }}
                >
                    ← All cards
                </Link>
            </Button>
            {collectionQuery.isPending && <CenteredSpinner label="Loading card" />}
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
            {collectionQuery.isSuccess && !card && (
                <ErrorCallout>Card “{cardId}” was not found in the local collection.</ErrorCallout>
            )}
            {card && (
                <CardDetails card={card} tab={tab} onTabChange={setTab} />
            )}
        </Container>
    );
}
