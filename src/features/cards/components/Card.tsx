import { Link } from '@tanstack/react-router';
import { Card as RadixCard, Text } from '@radix-ui/themes';
import { CARD_IMAGE_HEIGHT, CARD_IMAGE_WIDTH } from '@/constants';
import type { PokemonTcgCard } from '@/features/cards/types';
import { FavoriteButton } from '@/features/cards/components/FavoriteButton';

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
                    className="card-list-image"
                    src={card.images.small}
                    alt=""
                    loading="lazy"
                    width={CARD_IMAGE_WIDTH}
                    height={CARD_IMAGE_HEIGHT}
                />
                <Text as="p" mt="2" weight="medium">
                    {card.name}
                </Text>
            </Link>
        </RadixCard>
    );
}
