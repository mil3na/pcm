# Project Context & Agent Guidelines

## 1. Tech Stack & Environment

- Runtime & Language: Node.js (LTS), TypeScript (Strict Mode)
- Frameworks: React 19, Radix, Vite
- Data & State: TanStack Query
- Package Manager: pnpm

## 2. Common Workflows & Verification Commands

- Install: `pnpm install`
- Dev Server: `pnpm dev`
- Typecheck: `pnpm typecheck` (always verify before concluding tasks)
- Test Suite: `pnpm test` (unit) | `pnpm test:e2e`
- Lint/Format: `pnpm lint`

## 3. Architecture & Code Conventions

- Prefer explicit TypeScript interfaces/types over `any` or loose casts.
- Use functional React components with standard hooks; keep side effects co-located.
- Keep business logic decoupled from presentation components.

## 4. Boundaries & Behavioral Rules

- NEVER install new dependencies without explicit confirmation.
- Do not add conversational fluff or unrequested refactoring outside the scoped task.
- When fixing an error, first run the reproduction command, apply the minimal fix, and verify with tests/typecheck.
- NEVER touch the .md files, unless asked to
