import type { ReactNode } from 'react';
import { Card as RadixCard, Flex, Heading, Tabs, Text } from '@radix-ui/themes';
import type {
    PokemonTcgAttack,
    PokemonTcgCard,
    PokemonTcgValue,
} from '@/features/cards/types';
import { FavoriteButton } from '@/features/cards/components/FavoriteButton';

interface CardDetailsProps {
    card: PokemonTcgCard;
    tab: 'general' | 'attacks' | 'weaknesses';
    onTabChange: (tab: CardDetailsProps['tab']) => void;
}

const CARD_TABS = ['general', 'attacks', 'weaknesses'] as const;

function isCardTab(value: string): value is CardDetailsProps['tab'] {
    return CARD_TABS.some((tab) => tab === value);
}

function InfoRow({ label, value }: { label: string; value?: string }) {
    if (!value) return null;

    return (
        <div className="card-info-row">
            <Text as="span" color="gray" size="2">
                {label}
            </Text>
            <Text as="span" size="2">
                {value}
            </Text>
        </div>
    );
}

function GeneralInfo({ card }: { card: PokemonTcgCard }) {
    const tcgplayerPrices = (market: PokemonTcgCard['tcgplayer']) => {
        if (!market?.prices) return undefined;
        return Object.entries(market.prices)
            .map(([kind, prices]) => {
                const values = Object.entries(prices)
                    .filter((entry): entry is [string, number] => entry[1] !== null)
                    .map(([priceType, price]) => `${priceType}: $${price.toFixed(2)}`);
                return values.length ? `${kind} (${values.join(', ')})` : undefined;
            })
            .filter(Boolean)
            .join('; ');
    };
    const cardmarketPrices = (market: PokemonTcgCard['cardmarket']) => {
        if (!market?.prices) return undefined;
        return Object.entries(market.prices)
            .filter((entry): entry is [string, number] => entry[1] !== null)
            .map(([priceType, price]) => `${priceType}: €${price.toFixed(2)}`)
            .join(', ');
    };

    return (
        <div className="card-info-list">
            <InfoRow label="Card ID" value={card.id} />
            <InfoRow label="Supertype" value={card.supertype} />
            <InfoRow label="Subtypes" value={card.subtypes?.join(', ')} />
            <InfoRow label="Level" value={card.level} />
            <InfoRow label="HP" value={card.hp} />
            <InfoRow label="Types" value={card.types?.join(', ')} />
            <InfoRow label="Evolves from" value={card.evolvesFrom} />
            <InfoRow label="Evolves to" value={card.evolvesTo?.join(', ')} />
            <InfoRow label="Set" value={card.set?.name} />
            <InfoRow label="Set ID" value={card.set?.id} />
            <InfoRow label="Series" value={card.set?.series} />
            <InfoRow label="Set release date" value={card.set?.releaseDate} />
            <InfoRow
                label="Set card count"
                value={
                    card.set &&
                    `${card.set.printedTotal ?? '?'} printed / ${card.set.total ?? '?'} total`
                }
            />
            <InfoRow
                label="Card number"
                value={
                    card.number && card.set
                        ? `${card.number} / ${card.set.printedTotal ?? card.set.total ?? '?'}`
                        : card.number
                }
            />
            <InfoRow label="Artist" value={card.artist} />
            <InfoRow label="Rarity" value={card.rarity} />
            <InfoRow label="Regulation mark" value={card.regulationMark} />
            <InfoRow
                label="National Pokédex numbers"
                value={card.nationalPokedexNumbers?.join(', ')}
            />
            <InfoRow
                label="Legalities"
                value={
                    card.legalities &&
                    Object.entries(card.legalities)
                        .map(([format, status]) => `${format}: ${status}`)
                        .join(', ')
                }
            />
            <InfoRow
                label="Ancient trait"
                value={
                    card.ancientTrait &&
                    `${card.ancientTrait.name}: ${card.ancientTrait.text}`
                }
            />
            <InfoRow
                label="Abilities"
                value={card.abilities
                    ?.map((ability) => `${ability.name} (${ability.type}): ${ability.text}`)
                    .join('; ')}
            />
            <InfoRow label="Rules" value={card.rules?.join(' ')} />
            <InfoRow label="Flavor text" value={card.flavorText} />
            <InfoRow label="TCGplayer prices (USD)" value={tcgplayerPrices(card.tcgplayer)} />
            <InfoRow label="TCGplayer prices updated" value={card.tcgplayer?.updatedAt} />
            <InfoRow
                label="Cardmarket prices (EUR)"
                value={cardmarketPrices(card.cardmarket)}
            />
            <InfoRow label="Cardmarket prices updated" value={card.cardmarket?.updatedAt} />
            {card.tcgplayer?.url && (
                <a href={card.tcgplayer.url} target="_blank" rel="noreferrer">
                    View on TCGplayer
                </a>
            )}
            {card.cardmarket?.url && (
                <a href={card.cardmarket.url} target="_blank" rel="noreferrer">
                    View on Cardmarket
                </a>
            )}
        </div>
    );
}

function EntryList<T>({
    entries,
    render,
    getKey,
}: {
    entries?: T[];
    render: (entry: T) => ReactNode;
    getKey: (entry: T) => string;
}) {
    if (!entries?.length) {
        return <Text color="gray">No information available.</Text>;
    }

    return (
        <Flex direction="column" gap="3">
            {entries.map((entry) => (
                <div key={getKey(entry)}>{render(entry)}</div>
            ))}
        </Flex>
    );
}

function AttackDetails({ attack }: { attack: PokemonTcgAttack }) {
    return (
        <RadixCard>
            <Heading size="3" mb="2">
                {attack.name}
            </Heading>
            <div className="card-info-list">
                <InfoRow label="Cost" value={attack.cost?.join(', ')} />
                <InfoRow label="Converted energy cost" value={attack.convertedEnergyCost?.toString()} />
                <InfoRow label="Damage" value={attack.damage} />
                <InfoRow label="Effect" value={attack.text} />
            </div>
        </RadixCard>
    );
}

function ValueDetails({ value }: { value: PokemonTcgValue }) {
    return (
        <Text>
            <strong>{value.type}:</strong> {value.value}
        </Text>
    );
}

export function CardDetails({ card, tab, onTabChange }: CardDetailsProps) {
    return (
        <>
            <Flex align="center" justify="between" gap="3" mb="4">
                <Heading>{card.name}</Heading>
                <FavoriteButton cardId={card.id} cardName={card.name} />
            </Flex>
            <div className="card-details-layout">
                <img
                    className="card-details-image"
                    src={card.images.large ?? card.images.small}
                    alt={`${card.name} Pokémon card`}
                />
                <section className="card-details-content">
                    <Tabs.Root
                        value={tab}
                        onValueChange={(value) => {
                            if (isCardTab(value)) onTabChange(value);
                        }}
                    >
                        <Tabs.List className="card-detail-tabs" aria-label="Card information">
                            <Tabs.Trigger value="general">General info</Tabs.Trigger>
                            <Tabs.Trigger value="attacks">Attacks</Tabs.Trigger>
                            <Tabs.Trigger value="weaknesses">Weaknesses</Tabs.Trigger>
                        </Tabs.List>
                        <Tabs.Content value="general" className="card-detail-panel">
                            <GeneralInfo card={card} />
                        </Tabs.Content>
                        <Tabs.Content value="attacks" className="card-detail-panel">
                            <EntryList
                                entries={card.attacks}
                                getKey={(attack) => attack.name}
                                render={(attack) => <AttackDetails attack={attack} />}
                            />
                        </Tabs.Content>
                        <Tabs.Content value="weaknesses" className="card-detail-panel">
                            <div className="card-info-list">
                                <Heading size="3">Weaknesses</Heading>
                                <EntryList
                                    entries={card.weaknesses}
                                    getKey={(value) => `${value.type}-${value.value}`}
                                    render={(value) => <ValueDetails value={value} />}
                                />
                                <Heading size="3">Resistances</Heading>
                                <EntryList
                                    entries={card.resistances}
                                    getKey={(value) => `${value.type}-${value.value}`}
                                    render={(value) => <ValueDetails value={value} />}
                                />
                                <InfoRow label="Retreat cost" value={card.retreatCost?.join(', ')} />
                                <InfoRow
                                    label="Converted retreat cost"
                                    value={card.convertedRetreatCost?.toString()}
                                />
                            </div>
                        </Tabs.Content>
                    </Tabs.Root>
                </section>
            </div>
        </>
    );
}
