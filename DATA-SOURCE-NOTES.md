# Data source change

The app now reads the card dump from `public/data/cards.json` instead of calling the Pokémon TCG API. Vite serves it as a static file, so the full collection does not get bundled into the app’s JavaScript.

The existing Zod card schema validates the dump when it loads. Exact duplicate IDs are collapsed, and types and rarities are derived from the loaded cards instead of living in a separate file. Browsing, filtering, substring search, pagination, and card details all work locally; TanStack Query still handles loading, errors, and caching.

This keeps the app usable without API availability or an API key. The trade-off is that the collection is a fixed snapshot until the JSON file is replaced. API-specific pieces such as Ky, Lucene escaping, server retry handling, and persisted filter metadata caching were removed.
