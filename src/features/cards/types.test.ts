import { describe, expect, it } from 'vitest';
import {
    pokemonTcgCardSchema,
    pokemonTcgCardsResponseSchema,
    pokemonTcgValuesResponseSchema,
} from '@/features/cards/types';

const validCard = {
    id: 'base1-1',
    name: 'Alakazam',
    images: {
        small: 'https://images.pokemontcg.io/base1/1.png',
        large: 'https://images.pokemontcg.io/base1/1_hires.png',
    },
    tcgplayer: {
        prices: {
            holofoil: {
                low: 1.25,
                mid: 2.5,
                market: null,
            },
        },
    },
    cardmarket: {
        prices: {
            averageSellPrice: 2.45,
            lowPrice: 1.5,
            reverseHoloAvg30: null,
        },
    },
};

describe('Pokémon TCG response schemas', () => {
    it('accepts cards with the distinct provider price shapes', () => {
        const result = pokemonTcgCardSchema.parse(validCard);

        expect(result.tcgplayer?.prices?.holofoil?.low).toBe(1.25);
        expect(result.cardmarket?.prices?.averageSellPrice).toBe(2.45);
        expect(result.cardmarket?.prices?.reverseHoloAvg30).toBeNull();
    });

    it('normalizes null optional card fields to undefined', () => {
        const result = pokemonTcgCardSchema.parse({
            ...validCard,
            rarity: null,
            attacks: null,
            cardmarket: null,
        });

        expect(result.rarity).toBeUndefined();
        expect(result.attacks).toBeUndefined();
        expect(result.cardmarket).toBeUndefined();
    });

    it('rejects cards missing required fields or containing malformed images', () => {
        expect(
            pokemonTcgCardSchema.safeParse({
                ...validCard,
                images: { small: 42 },
            }).success,
        ).toBe(false);

        expect(
            pokemonTcgCardSchema.safeParse({
                ...validCard,
                id: '',
            }).success,
        ).toBe(false);
    });

    it('validates card-list and string-value response envelopes', () => {
        expect(
            pokemonTcgCardsResponseSchema.safeParse({
                data: [validCard],
                totalCount: 1,
            }).success,
        ).toBe(true);
        expect(pokemonTcgValuesResponseSchema.safeParse({ data: ['Fire'] }).success).toBe(true);
        expect(
            pokemonTcgCardsResponseSchema.safeParse({
                data: [validCard],
                totalCount: -1,
            }).success,
        ).toBe(false);
        expect(pokemonTcgValuesResponseSchema.safeParse({ data: [1] }).success).toBe(false);
    });
});
