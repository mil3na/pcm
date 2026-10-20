import { describe, expect, it } from 'vitest';
import {
    getCardFromCollection,
    getCardsFromCollection,
    getRaritiesFromCollection,
    getTypesFromCollection,
    prepareCardCollection,
    searchCardsInCollection,
} from '@/features/cards/data/cardCollection';

function createCard(id: string, name: string, fields: Record<string, unknown> = {}) {
    return {
        id,
        name,
        images: { small: `https://example.com/${id}.png` },
        ...fields,
    };
}

const cards = prepareCardCollection([
    createCard('b-1', 'Bulbasaur', {
        types: ['Grass', 'Poison'],
        rarity: 'Common',
    }),
    createCard('p-1', 'Pikachu', {
        types: ['Lightning'],
        rarity: 'Rare',
    }),
    createCard('p-2', 'Pikachu V', {
        types: ['Lightning'],
        rarity: 'Rare Holo V',
    }),
    createCard('b-1', 'Bulbasaur', {
        types: ['Grass', 'Poison'],
        rarity: 'Common',
    }),
]);

describe('local card collection', () => {
    it('validates the collection and collapses exact duplicate IDs', () => {
        expect(cards).toHaveLength(3);
        expect(cards.map((card) => card.id)).toEqual(['b-1', 'p-1', 'p-2']);
        expect(() => prepareCardCollection({ data: [] })).toThrow(
            'Invalid local card collection',
        );
    });

    it('derives sorted unique types and rarities', () => {
        expect(getTypesFromCollection(cards)).toEqual(['Grass', 'Lightning', 'Poison']);
        expect(getRaritiesFromCollection(cards)).toEqual(['Common', 'Rare', 'Rare Holo V']);
    });

    it('filters by type and rarity, sorts by name, and returns the total', () => {
        const result = getCardsFromCollection(cards, 1, {
            type: 'Lightning',
            rarity: 'Rare',
        });

        expect(result.cards.map((card) => card.id)).toEqual(['p-1']);
        expect(result.totalCount).toBe(1);
    });

    it('paginates the filtered, sorted results', () => {
        const largerCollection = prepareCardCollection([
            ...cards,
            ...Array.from({ length: 12 }, (_, index) =>
                createCard(`extra-${index}`, `Extra ${index}`),
            ),
        ]);
        const result = getCardsFromCollection(largerCollection, 2);

        expect(result.cards).toHaveLength(3);
        expect(result.totalCount).toBe(15);
    });

    it('searches card names by case-insensitive substring', () => {
        const result = searchCardsInCollection(cards, 'PIKA', 1);

        expect(result.cards.map((card) => card.name)).toEqual(['Pikachu', 'Pikachu V']);
        expect(result.totalCount).toBe(2);
    });

    it('finds details by ID and reports missing cards', () => {
        expect(getCardFromCollection(cards, 'p-1').name).toBe('Pikachu');
        expect(() => getCardFromCollection(cards, 'missing')).toThrow(
            'Card "missing" was not found in the local collection',
        );
    });
});
