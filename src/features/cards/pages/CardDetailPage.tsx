import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { useState } from 'react';
import { Button, Container } from '@radix-ui/themes';
import { CardDetails } from '../components/CardDetails';
import { getCard } from '../api/pokemonTcg';
import { ErrorCallout } from '../../../components/ErrorCallout';
import { CenteredSpinner } from '../../../components/CenteredSpinner';

const CARD_TABS = ['general', 'attacks', 'weaknesses'] as const;
type CardTab = (typeof CARD_TABS)[number];

interface CardDetailPageProps {
    cardId: string;
}

export function CardDetailPage({ cardId }: CardDetailPageProps) {
    const [tab, setTab] = useState<CardTab>('general');
    const cardQuery = useQuery({
        queryKey: ['card', cardId],
        queryFn: () => getCard(cardId),
    });

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
