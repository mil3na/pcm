import {
    HomeIcon,
    LayersIcon,
    MagnifyingGlassIcon,
    StarIcon,
} from '@radix-ui/react-icons';
import { Link } from '@tanstack/react-router';
import { BrandingTitle } from '@/components/sidebar/BrandingTitle';

export function Sidebar() {
    return (
        <aside className="app-sidebar">
            <BrandingTitle />
            <nav className="sidebar-nav" aria-label="Main navigation">
                <Link
                    to="/"
                    activeOptions={{ exact: true }}
                    activeProps={{ className: 'sidebar-link sidebar-link-active' }}
                    inactiveProps={{ className: 'sidebar-link' }}
                >
                    <HomeIcon aria-hidden="true" />
                    <span>Home</span>
                </Link>
                <Link
                    to="/cards"
                    search={{ page: 1, type: undefined, rarity: undefined }}
                    activeOptions={{ exact: true }}
                    activeProps={{ className: 'sidebar-link sidebar-link-active' }}
                    inactiveProps={{ className: 'sidebar-link' }}
                >
                    <LayersIcon aria-hidden="true" />
                    <span>Cards</span>
                </Link>
                <Link
                    to="/search"
                    search={{ name: undefined, page: 1 }}
                    activeOptions={{ exact: true }}
                    activeProps={{ className: 'sidebar-link sidebar-link-active' }}
                    inactiveProps={{ className: 'sidebar-link' }}
                >
                    <MagnifyingGlassIcon aria-hidden="true" />
                    <span>Search</span>
                </Link>
                <Link
                    to="/favorites"
                    activeOptions={{ exact: true }}
                    activeProps={{ className: 'sidebar-link sidebar-link-active' }}
                    inactiveProps={{ className: 'sidebar-link' }}
                >
                    <StarIcon aria-hidden="true" />
                    <span>Favorites</span>
                </Link>
            </nav>
        </aside>
    );
}
