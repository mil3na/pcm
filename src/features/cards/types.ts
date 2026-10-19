export interface PokemonTcgCard {
    id: string;
    name: string;
    supertype?: string;
    subtypes?: string[];
    level?: string;
    hp?: string;
    types?: string[];
    evolvesFrom?: string;
    evolvesTo?: string[];
    rules?: string[];
    ancientTrait?: PokemonTcgCardText;
    abilities?: PokemonTcgAbility[];
    attacks?: PokemonTcgAttack[];
    weaknesses?: PokemonTcgValue[];
    resistances?: PokemonTcgValue[];
    retreatCost?: string[];
    convertedRetreatCost?: number;
    set?: PokemonTcgSet;
    number?: string;
    artist?: string;
    rarity?: string;
    flavorText?: string;
    nationalPokedexNumbers?: number[];
    legalities?: Record<string, string>;
    regulationMark?: string;
    images: {
        small: string;
        large?: string;
    };
    tcgplayer?: PokemonTcgMarket;
    cardmarket?: PokemonTcgMarket;
}

export interface PokemonTcgCardText {
    name: string;
    text: string;
}

export interface PokemonTcgAbility extends PokemonTcgCardText {
    type: string;
}

export interface PokemonTcgAttack {
    name: string;
    cost?: string[];
    convertedEnergyCost?: number;
    damage?: string;
    text?: string;
}

export interface PokemonTcgValue {
    type: string;
    value: string;
}

export interface PokemonTcgSet {
    id: string;
    name: string;
    series?: string;
    releaseDate?: string;
    total?: number;
    printedTotal?: number;
}

export interface PokemonTcgMarket {
    url?: string;
    updatedAt?: string;
    prices?: Record<string, Record<string, number | null>>;
}

export interface PokemonTcgCardsResponse {
    data: PokemonTcgCard[];
    totalCount: number;
}

export interface PokemonTcgValuesResponse {
    data: string[];
}

export interface PokemonTcgCardResponse {
    data: PokemonTcgCard;
}

export interface PokemonTcgCardsPage {
    cards: PokemonTcgCard[];
    totalCount: number;
}

export interface PokemonTcgCardFilters {
    type?: string;
    rarity?: string;
}
