# Pokemon Card Manager

## Technology used

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.
Also, good to notice that React Compiler is enabled for this project.

Radix UI is responsible for the reusable components used. Because of time restrictions, I went with the themed version.

For routing, TanStack Router was chosen. It is a well known library that will give everything we'll need for this project out of the box.

For requests, TanStack Query + KY. One manages cache and state, the other replaces native fetch for better error handling.

## Functionalities Implemented

- Browse all cards at `/cards`, with pagination and Pokémon type / rarity filters
- URL-synced card filters and pagination
- Sidebar navigation
- Simple cache: with TanStack Query, we can increase the time for cache invalidation. As this information doesn't change often, we can increase the time to avoid multiple calls
- Favorites are kept in LocalStorage, so it survives a "refresh"
  - As the API is very flaky, a way to do individual retries was implemented, so we can show the cards when they are available
- Error handling
- Loading handling
- Search functionality
  - Debounce so it does not hit the server so often
  - Using wildcard search so we can search for pieces of the name
  -

## Skipped Functionalities

- Translation / internationalization
- Dark theme
- Search fields other than name
- Ordering cards when listed
- Page for sets
