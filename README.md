# Pokemon Card Manager

A React application for browsing Pokémon TCG cards, searching by name, viewing card details and prices, and saving favorites.

## Technology used

- **React 19 and TypeScript** provide the component-based UI and type-safe application code.
- **Vite** provides the development server with hot module replacement (HMR) and the production build.
- **React Compiler** is enabled through the Vite React plugin to optimize React components.
- **Radix Themes** provides the reusable UI components and theming. Because of time restrictions, I chose the themed version rather than building a custom component system.
- **TanStack Router** provides file-based routing, typed route search parameters, and route-based code splitting.
- **TanStack Query** manages server state, loading and error states, retries, and caching. The default stale time is 12 hours to avoid repeatedly requesting data that does not change often. Successful card type and rarity metadata is also persisted in local storage.
- **Ky** is the HTTP client for the Pokémon TCG REST API; it provides a concise API over `fetch` and consistent HTTP errors.
- **Zod** validates API response data at runtime. TypeScript types are inferred from the schemas so the API data has a single source of truth.
- **Vitest** runs unit tests for search helpers, URL parameter parsing, API schemas, favorites storage, and query-cache persistence.
- **Oxlint** checks the code for lint issues.
- **Fira Code**, loaded from Google Fonts, is used as the application font to improve legibility.
- **pnpm** manages project dependencies and scripts.

## Design approach

The interface uses Radix Themes for consistent controls and layout primitives, with an amber accent, a persistent sidebar for the main destinations, and a compact icon-based navigation layout on mobile. Card details are organized into tabs so general information, attacks, weaknesses, and prices are easy to scan. The design is intentionally simple and focused on finding and inspecting cards.

## Functionalities Implemented

- Browse all cards at `/cards`, with pagination and Pokémon type / rarity filters.
- Card filters, pagination, and search term/page are synchronized with the URL, so views can be bookmarked or shared.
- Sidebar navigation to Home, Cards, Search, and Favorites.
- Card detail pages at `/cards/:cardId`, with general information, attacks, weaknesses/resistances, and prices.
- TCGplayer prices in USD and Cardmarket prices in EUR, with links to the corresponding marketplace pages when available.
- Favorites are kept in LocalStorage so they survive a page refresh.
  - Each favorite is loaded independently and has its own retry action, so an unavailable card does not prevent other favorites from being shown.
- Error handling for API failures, invalid API response data, and local-storage failures.
- Loading handling for requests.
  - On `/favorites`, loading is shown as a blocking overlay while favorite cards are loading.
- Empty states for searches with no results, no matching filters, an empty Favorites page, and cards without price information.
- Search functionality by card name.
  - Search is debounced so it does not send a request on every keystroke.
  - Wildcard search allows matching parts of a card name.
- API requests returning HTTP 500 are retried up to five times with exponential backoff.
- Responsive mobile layout, including a compact, icon-based sidebar.
- Keyboard navigation through semantic links and controls, with accessible names for icon-only mobile navigation.
- Lazy-loaded card images reserve their aspect ratio to reduce layout shifts.
- Unit tests run with `pnpm test`.

## Skipped Functionalities

- Translation / internationalization.
- Dark theme.
- Search fields other than name.
- Ordering cards when listed.
- Page for sets.
- Further improved error messages beyond the current API validation summaries and retry actions.
- Random card feature on home screen.
- Better component alignment on mobile.
- Better prices print / presentation.
- Better keyboard utilization

## Submission

- Live app or video demo: [pcm @ vercel](https://pcm-mauve.vercel.app/)
- Public source repository: [this repo](https://github.com/mil3na/pcm)

## Development

Install dependencies:

```sh
pnpm install
```

Start the development server:

```sh
pnpm dev
```

Other project commands:

```sh
pnpm test       # Run unit tests
pnpm typecheck  # Run the TypeScript project checks
pnpm lint       # Run Oxlint
pnpm build      # Type-check and create a production build
pnpm preview    # Preview the production build locally
```

The app requests data directly from the Pokémon TCG API. API availability may vary, so request retries and retry actions are provided where appropriate.
