import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { useState } from 'react';
import { Button, Container } from '@radix-ui/themes';
import { FIRST_PAGE } from '@/constants';
import { CardDetails } from '@/features/cards/components/CardDetails';
import type { CardDetailsTab } from '@/features/cards/components/CardDetails';
import { cardQueryOptions } from '@/features/cards/queries';
import { ErrorCallout } from '@/components/ErrorCallout';
import { CenteredSpinner } from '@/components/CenteredSpinner';

interface CardDetailPageProps {
    cardId: string;
}

export function CardDetailPage({ cardId }: CardDetailPageProps) {
    const [tab, setTab] = useState<CardDetailsTab>('general');
    const cardQuery = useQuery(cardQueryOptions(cardId));

    return (
        <Container size="4" py="6">
            <Button asChild variant="ghost" mb="4">
                <Link
                    to="/cards"
                    search={{ page: FIRST_PAGE, type: undefined, rarity: undefined }}
                >
                    ← All cards
                </Link>
            </Button>
            {cardQuery.isPending && <CenteredSpinner label="Loading card" />}
            {cardQuery.isError && (
                <ErrorCallout
                    action={
                        <Button variant="soft" onClick={() => void cardQuery.refetch()}>
                            Try again
                        </Button>
                    }
                >
                    Could not load card: {cardQuery.error.message}
                </ErrorCallout>
            )}
            {cardQuery.isSuccess && (
                <CardDetails card={cardQuery.data} tab={tab} onTabChange={setTab} />
            )}
        </Container>
    );
}
