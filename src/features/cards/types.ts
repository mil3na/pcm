import { z } from 'zod';

const optionalStringSchema = z
    .string()
    .nullish()
    .transform((value) => value ?? undefined);
const optionalNumberSchema = z
    .number()
    .nullish()
    .transform((value) => value ?? undefined);
const optionalStringArraySchema = z
    .array(z.string())
    .nullish()
    .transform((value) => value ?? undefined);
const optionalNumberArraySchema = z
    .array(z.number())
    .nullish()
    .transform((value) => value ?? undefined);

export const pokemonTcgCardTextSchema = z.object({
    name: z.string(),
    text: z.string(),
});

export const pokemonTcgAbilitySchema = pokemonTcgCardTextSchema.extend({
    type: z.string(),
});

export const pokemonTcgAttackSchema = z.object({
    name: z.string(),
    cost: optionalStringArraySchema,
    convertedEnergyCost: optionalNumberSchema,
    damage: optionalStringSchema,
    text: optionalStringSchema,
});

export const pokemonTcgValueSchema = z.object({
    type: z.string(),
    value: z.string(),
});

export const pokemonTcgSetSchema = z.object({
    id: z.string(),
    name: z.string(),
    series: optionalStringSchema,
    releaseDate: optionalStringSchema,
    total: optionalNumberSchema,
    printedTotal: optionalNumberSchema,
});

const pokemonTcgMarketBaseSchema = z.object({
    url: optionalStringSchema,
    updatedAt: optionalStringSchema,
});

export const pokemonTcgTcgplayerSchema = pokemonTcgMarketBaseSchema.extend({
    prices: z
        .record(z.string(), z.record(z.string(), z.number().nullable()))
        .nullish()
        .transform((value) => value ?? undefined),
});

export const pokemonTcgCardmarketSchema = pokemonTcgMarketBaseSchema.extend({
    prices: z
        .record(z.string(), z.number().nullable())
        .nullish()
        .transform((value) => value ?? undefined),
});

export const pokemonTcgCardSchema = z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    supertype: optionalStringSchema,
    subtypes: optionalStringArraySchema,
    level: optionalStringSchema,
    hp: optionalStringSchema,
    types: optionalStringArraySchema,
    evolvesFrom: optionalStringSchema,
    evolvesTo: optionalStringArraySchema,
    rules: optionalStringArraySchema,
    ancientTrait: pokemonTcgCardTextSchema.nullish().transform((value) => value ?? undefined),
    abilities: z
        .array(pokemonTcgAbilitySchema)
        .nullish()
        .transform((value) => value ?? undefined),
    attacks: z
        .array(pokemonTcgAttackSchema)
        .nullish()
        .transform((value) => value ?? undefined),
    weaknesses: z
        .array(pokemonTcgValueSchema)
        .nullish()
        .transform((value) => value ?? undefined),
    resistances: z
        .array(pokemonTcgValueSchema)
        .nullish()
        .transform((value) => value ?? undefined),
    retreatCost: optionalStringArraySchema,
    convertedRetreatCost: optionalNumberSchema,
    set: pokemonTcgSetSchema.nullish().transform((value) => value ?? undefined),
    number: optionalStringSchema,
    artist: optionalStringSchema,
    rarity: optionalStringSchema,
    flavorText: optionalStringSchema,
    nationalPokedexNumbers: optionalNumberArraySchema,
    legalities: z
        .record(z.string(), z.string())
        .nullish()
        .transform((value) => value ?? undefined),
    regulationMark: optionalStringSchema,
    images: z.object({
        small: z.url(),
        large: optionalStringSchema,
    }),
    tcgplayer: pokemonTcgTcgplayerSchema.nullish().transform((value) => value ?? undefined),
    cardmarket: pokemonTcgCardmarketSchema.nullish().transform((value) => value ?? undefined),
});

export const pokemonTcgCardsResponseSchema = z.object({
    data: z.array(pokemonTcgCardSchema),
    totalCount: z.number().int().nonnegative(),
});

export const pokemonTcgValuesResponseSchema = z.object({
    data: z.array(z.string()),
});

export const pokemonTcgCardResponseSchema = z.object({
    data: pokemonTcgCardSchema,
});

export type PokemonTcgCard = z.infer<typeof pokemonTcgCardSchema>;
export type PokemonTcgCardText = z.infer<typeof pokemonTcgCardTextSchema>;
export type PokemonTcgAbility = z.infer<typeof pokemonTcgAbilitySchema>;
export type PokemonTcgAttack = z.infer<typeof pokemonTcgAttackSchema>;
export type PokemonTcgValue = z.infer<typeof pokemonTcgValueSchema>;
export type PokemonTcgSet = z.infer<typeof pokemonTcgSetSchema>;
export type PokemonTcgTcgplayer = z.infer<typeof pokemonTcgTcgplayerSchema>;
export type PokemonTcgCardmarket = z.infer<typeof pokemonTcgCardmarketSchema>;
export type PokemonTcgCardsPage = {
    cards: PokemonTcgCard[];
    totalCount: number;
};
export interface PokemonTcgCardFilters {
    type?: string;
    rarity?: string;
}
