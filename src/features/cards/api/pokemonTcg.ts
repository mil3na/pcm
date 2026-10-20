import ky from 'ky';
import type {
    PokemonTcgCard,
    PokemonTcgCardFilters,
    PokemonTcgCardsPage,
} from '@/features/cards/types';
import {
    pokemonTcgCardResponseSchema,
    pokemonTcgCardsResponseSchema,
    pokemonTcgValuesResponseSchema,
} from '@/features/cards/types';
import { CARDS_PAGE_SIZE } from '@/constants';
import { escapeLuceneSearchTerm } from '@/lib/luceneSearch';
import { formatZodIssueSummary } from '@/lib/zodErrors';
import { z } from 'zod';

const pokemonTcgApi = ky.create({
    prefix: 'https://api.pokemontcg.io/v2/',
    retry: 0,
});

function parseApiResponse<T extends z.ZodType>(
    schema: T,
    response: unknown,
    endpoint: string,
): z.output<T> {
    const result = schema.safeParse(response);
    if (result.success) return result.data;

    throw new Error(
        `Invalid ${endpoint} response from the Pokémon TCG API (${formatZodIssueSummary(result.error)})`,
        { cause: result.error },
    );
}

async function getValues(endpoint: 'types' | 'rarities'): Promise<string[]> {
    const response = await pokemonTcgApi.get(endpoint).json<unknown>();
    const result = parseApiResponse(pokemonTcgValuesResponseSchema, response, endpoint);
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

    const response = await pokemonTcgApi
        .get('cards', { searchParams: params })
        .json<unknown>();
    const result = parseApiResponse(pokemonTcgCardsResponseSchema, response, 'cards');
    return { cards: result.data, totalCount: result.totalCount };
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
    const response = await pokemonTcgApi
        .get('cards', { searchParams: params })
        .json<unknown>();
    const result = parseApiResponse(pokemonTcgCardsResponseSchema, response, 'card search');
    return { cards: result.data, totalCount: result.totalCount };
}

export async function getCard(cardId: string): Promise<PokemonTcgCard> {
    const response = await pokemonTcgApi
        .get(`cards/${encodeURIComponent(cardId)}`)
        .json<unknown>();
    const result = parseApiResponse(pokemonTcgCardResponseSchema, response, 'card');
    return result.data;
}
