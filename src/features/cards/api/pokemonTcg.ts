import ky from 'ky';
import type {
    PokemonTcgCard,
    PokemonTcgCardFilters,
    PokemonTcgCardResponse,
    PokemonTcgCardsPage,
    PokemonTcgCardsResponse,
    PokemonTcgValuesResponse,
} from '@/features/cards/types';

export const CARDS_PAGE_SIZE = 12;
const pokemonTcgApi = ky.create({
    prefix: 'https://api.pokemontcg.io/v2/',
    retry: 0,
});

async function getValues(endpoint: 'types' | 'rarities'): Promise<string[]> {
    const result = await pokemonTcgApi.get(endpoint).json<PokemonTcgValuesResponse>();
    if (!Array.isArray(result.data) || !result.data.every((value) => typeof value === 'string')) {
        throw new Error(`Invalid ${endpoint} response from the Pokémon TCG API`);
    }

    return result.data;
}

export function getTypes(): Promise<string[]> {
    return getValues('types');
}

export function getRarities(): Promise<string[]> {
    return getValues('rarities');
}

export async function getCards(
    page: number,
    filters: PokemonTcgCardFilters = {},
): Promise<PokemonTcgCardsPage> {
    const params = new URLSearchParams({
        page: String(page),
        pageSize: String(CARDS_PAGE_SIZE),
        orderBy: 'name',
    });
    const query = [
        filters.type && `types:${JSON.stringify(filters.type)}`,
        filters.rarity && `rarity:${JSON.stringify(filters.rarity)}`,
    ]
        .filter(Boolean)
        .join(' ');
    if (query) params.set('q', query);

    const result = await pokemonTcgApi
        .get('cards', { searchParams: params })
        .json<PokemonTcgCardsResponse>();
    return { cards: result.data, totalCount: result.totalCount };
}

const luceneSpecialCharacters = new Set('+-&|!(){}[]^"~*?:\\/');

function escapeLuceneSearchTerm(term: string): string {
    return Array.from(term, (character) =>
        /\s/u.test(character) || luceneSpecialCharacters.has(character)
            ? `\\${character}`
            : character,
    ).join('');
}

export async function searchCardsByName(
    name: string,
    page: number,
): Promise<PokemonTcgCardsPage> {
    const params = new URLSearchParams({
        q: `name:*${escapeLuceneSearchTerm(name.trim())}*`,
        page: String(page),
        pageSize: String(CARDS_PAGE_SIZE),
        orderBy: 'name',
    });
    const result = await pokemonTcgApi
        .get('cards', { searchParams: params })
        .json<PokemonTcgCardsResponse>();
    return { cards: result.data, totalCount: result.totalCount };
}

export async function getCard(cardId: string): Promise<PokemonTcgCard> {
    const result = await pokemonTcgApi
        .get(`cards/${encodeURIComponent(cardId)}`)
        .json<PokemonTcgCardResponse>();
    return result.data;
}
