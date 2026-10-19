import { createFileRoute } from '@tanstack/react-router';
import { FavoritesPage } from '@/features/cards/pages/FavoritesPage';

export const Route = createFileRoute('/favorites')({
    component: FavoritesPage,
});
