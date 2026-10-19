import { Link } from '@tanstack/react-router';
import { Card as RadixCard, Text } from '@radix-ui/themes';
import type { PokemonTcgCard } from '../types';
import { FavoriteButton } from './FavoriteButton';

interface CardProps {
    card: PokemonTcgCard;
}

export function Card({ card }: CardProps) {
    return (
        <RadixCard className="card-tile">
            <div className="card-favorite-button">
                <FavoriteButton cardId={card.id} cardName={card.name} />
            </div>
            <Link
                to="/cards/$cardId"
                params={{ cardId: card.id }}
                search={{}}
                className="card-link"
                aria-label={`View details for ${card.name}`}
            >
                <img
                    src={card.images.small}
                    alt=""
                    loading="lazy"
                    style={{ display: 'block', width: '100%' }}
                />
                <Text as="p" mt="2" weight="medium">
                    {card.name}
                </Text>
            </Link>
        </RadixCard>
    );
}
