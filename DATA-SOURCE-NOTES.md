# Data source change

The app now reads the card dump from `public/data/cards.json` instead of calling the Pokémon TCG API. Vite serves it as a static file, so the full collection does not get bundled into the app’s JavaScript.

The dump currently contains 2,138 records and 1,644 unique card IDs. The repeated records are exact duplicates, so the app collapses them. This is a fixed snapshot, not necessarily every card Ash owns; replace `public/data/cards.json` to update it.

The existing Zod card schema validates the dump when it loads. Types and rarities are derived from the collection instead of living in a separate file. TanStack Query owns one shared collection query, and browsing, filtering, substring search, pagination, and card details all use that cached data.

This avoids depending on the API. The trade-off is that the collection stays fixed until the JSON file is replaced. API-specific pieces such as Ky, Lucene escaping, server retry handling, and persisted filter metadata caching were removed.

## Future suggestion

The current collection is small enough that filtering, sorting, and looking up a card with a linear scan should be fine. If the dataset grows or these interactions become noticeably slow, profile them first, then consider adding an ID lookup map or precomputed indexes for the filters that are actually causing a bottleneck.
