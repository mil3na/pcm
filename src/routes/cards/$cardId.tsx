import { createFileRoute } from '@tanstack/react-router';
import { CardDetailPage } from '../../features/cards/pages/CardDetailPage';

export const Route = createFileRoute('/cards/$cardId')({
    component: CardDetailRoute,
});

function CardDetailRoute() {
    const { cardId } = Route.useParams();
    return <CardDetailPage cardId={cardId} />;
}
