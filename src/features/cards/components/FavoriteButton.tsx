import { StarFilledIcon, StarIcon } from '@radix-ui/react-icons';
import { IconButton } from '@radix-ui/themes';
import { useFavorites } from '../favorites/FavoritesContext';

interface FavoriteButtonProps {
    cardId: string;
    cardName: string;
}

export function FavoriteButton({ cardId, cardName }: FavoriteButtonProps) {
    const { isFavorite, toggleFavorite } = useFavorites();
    const favorite = isFavorite(cardId);

    return (
        <IconButton
            type="button"
            variant={favorite ? 'solid' : 'soft'}
            color={favorite ? 'amber' : 'gray'}
            aria-label={favorite ? `Remove ${cardName} from favorites` : `Add ${cardName} to favorites`}
            aria-pressed={favorite}
            onClick={() => toggleFavorite(cardId)}
        >
            {favorite ? <StarFilledIcon aria-hidden="true" /> : <StarIcon aria-hidden="true" />}
        </IconButton>
    );
}
