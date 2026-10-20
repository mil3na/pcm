import { queryOptions } from '@tanstack/react-query';
import { loadCardCollection } from '@/features/cards/data/cardCollection';

export function cardCollectionQueryOptions() {
    return queryOptions({
        queryKey: ['card-collection'],
        queryFn: loadCardCollection,
    });
}
