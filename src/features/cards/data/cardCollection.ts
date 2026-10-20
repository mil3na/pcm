import type {
    PokemonTcgCard,
    PokemonTcgCardFilters,
    PokemonTcgCardsPage,
} from '@/features/cards/types';
import { pokemonTcgCardCollectionSchema } from '@/features/cards/types';
import { formatZodIssueSummary } from '@/lib/zodErrors';

export const CARDS_PAGE_SIZE = 12;

export function prepareCardCollection(data: unknown): PokemonTcgCard[] {
    const result = pokemonTcgCardCollectionSchema.safeParse(data);
    if (!result.success) {
        throw new Error(
            `Invalid local card collection (${formatZodIssueSummary(result.error)})`,
            { cause: result.error },
        );
    }

    const uniqueCards = new Map<string, PokemonTcgCard>();
    for (const card of result.data) {
        if (!uniqueCards.has(card.id)) uniqueCards.set(card.id, card);
    }
    return [...uniqueCards.values()];
}

export async function loadCardCollection(): Promise<PokemonTcgCard[]> {
    const response = await fetch(`${import.meta.env.BASE_URL}data/cards.json`);
    if (!response.ok) {
        throw new Error(`Could not load local card collection (HTTP ${response.status})`);
    }

    const data: unknown = await response.json();
    return prepareCardCollection(data);
}

export function getTypesFromCollection(cards: PokemonTcgCard[]): string[] {
    return [...new Set(cards.flatMap((card) => card.types ?? []))].sort((a, b) =>
        a.localeCompare(b),
    );
}

export function getRaritiesFromCollection(cards: PokemonTcgCard[]): string[] {
    return [
        ...new Set(cards.map((card) => card.rarity).filter((rarity): rarity is string => !!rarity)),
    ].sort((a, b) => a.localeCompare(b));
}

export function getCardsFromCollection(
    cards: PokemonTcgCard[],
    page: number,
    filters: PokemonTcgCardFilters = {},
): PokemonTcgCardsPage {
    const matchingCards = cards
        .filter(
            (card) =>
                (!filters.type || card.types?.includes(filters.type)) &&
                (!filters.rarity || card.rarity === filters.rarity),
        )
        .sort((a, b) => a.name.localeCompare(b.name) || a.id.localeCompare(b.id));
    const start = (page - 1) * CARDS_PAGE_SIZE;

    return {
        cards: matchingCards.slice(start, start + CARDS_PAGE_SIZE),
        totalCount: matchingCards.length,
    };
}

export function searchCardsInCollection(
    cards: PokemonTcgCard[],
    name: string,
    page: number,
): PokemonTcgCardsPage {
    const normalizedName = name.trim().toLocaleLowerCase();
    const matchingCards = cards
        .filter((card) => card.name.toLocaleLowerCase().includes(normalizedName))
        .sort((a, b) => a.name.localeCompare(b.name) || a.id.localeCompare(b.id));
    const start = (page - 1) * CARDS_PAGE_SIZE;

    return {
        cards: matchingCards.slice(start, start + CARDS_PAGE_SIZE),
        totalCount: matchingCards.length,
    };
}

export function getCardFromCollection(cards: PokemonTcgCard[], cardId: string): PokemonTcgCard {
    const card = cards.find((item) => item.id === cardId);
    if (!card) throw new Error(`Card "${cardId}" was not found in the local collection`);
    return card;
}
