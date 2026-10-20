import { queryOptions } from '@tanstack/react-query';
import { getCard } from '@/features/cards/data/cardCollection';

export function cardQueryOptions(cardId: string) {
    return queryOptions({
        queryKey: ['card', cardId],
        queryFn: () => getCard(cardId),
    });
}
