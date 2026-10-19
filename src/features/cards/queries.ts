import { queryOptions } from '@tanstack/react-query';
import { getCard } from '@/features/cards/api/pokemonTcg';

export function cardQueryOptions(cardId: string) {
    return queryOptions({
        queryKey: ['card', cardId],
        queryFn: () => getCard(cardId),
    });
}
