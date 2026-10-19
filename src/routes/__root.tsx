import { createRootRoute, Outlet } from '@tanstack/react-router';
import { Sidebar } from '@/components/sidebar/Sidebar';

export const Route = createRootRoute({
    component: RootLayout,
});

function RootLayout() {
    return (
        <div className="app-shell">
            <Sidebar />
            <main className="app-main">
                <Outlet />
            </main>
        </div>
    );
}
