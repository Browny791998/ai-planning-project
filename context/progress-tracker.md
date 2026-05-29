# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Feature 03 — Auth ✓

## Current Goal

- Awaiting next feature spec.

## Completed

- Boilerplate cleanup (stripped globals.css, removed SVGs, minimal page.tsx)
- Design system: shadcn/ui (v4.8.2, Nova/Radix preset) + lucide-react installed
- `lib/utils.ts` with `cn()` (clsx + tailwind-merge)
- `components/ui/`: Button, Card, Dialog, Input, Tabs, Textarea, ScrollArea
- `globals.css`: dark-only theme — all shadcn semantic vars + Ghost AI custom tokens wired via `@theme inline`
- `components/editor/editor-navbar.tsx`: fixed top navbar, sidebar toggle with PanelLeftOpen/PanelLeftClose, left/center/right sections
- `components/editor/project-sidebar.tsx`: floating overlay sidebar, slides in from left, Projects header + close button, My Projects / Shared tabs (empty state), full-width New Project button
- Auth (Feature 03):
  - `@clerk/ui` installed (v1.14.0)
  - `proxy.ts` at project root — protected-first `clerkMiddleware`, public routes driven by `NEXT_PUBLIC_CLERK_SIGN_IN_URL` / `NEXT_PUBLIC_CLERK_SIGN_UP_URL` env vars
  - `app/layout.tsx` — `ClerkProvider` wraps root layout with `ui` from `@clerk/ui`, dark `theme` from `@clerk/ui/themes`, CSS variable overrides via `appearance.variables`
  - `app/page.tsx` — server component redirects authenticated users to `/editor`, unauthenticated to `/sign-in` (middleware also enforces protection)
  - `app/editor/page.tsx` — editor shell moved here; protected by middleware
  - `app/sign-in/[[...sign-in]]/page.tsx` — two-panel layout (left: logo + tagline + feature list; right: Clerk `<SignIn />`); left panel hidden on small screens
  - `app/sign-up/[[...sign-up]]/page.tsx` — same two-panel layout with Clerk `<SignUp />`
  - `components/editor/editor-navbar.tsx` — `UserButton` added to right section

## In Progress

- None.

## Next Up

- Feature 04 (TBD from feature-specs)

## Open Questions

- None.

## Architecture Decisions

- Dark-only theme — no `.dark` class toggle; all vars set in `:root` directly to dark values
- shadcn on Tailwind v4; `@theme inline` maps CSS vars to Tailwind utilities
- Ghost AI tokens: `--bg-*`, `--text-*`, `--accent-*`, `--state-*` → Tailwind utilities `bg-base`, `bg-surface`, `text-copy-primary`, `text-brand`, `bg-accent-dim`, etc.
- Do not modify generated `components/ui/*` files — CLI only
- Clerk middleware lives in `proxy.ts` (Next.js 16 convention), not `middleware.ts`
- `@clerk/ui` bundled UI (not CDN) — `ui` prop on `ClerkProvider` enables `@clerk/ui/themes` and typed appearance using `theme` key (not legacy `baseTheme`)
- Clerk appearance overrides use `var(--css-token)` references — no hardcoded colors

## Session Notes

- Next.js 16.2.6, React 19, Tailwind v4 (`@tailwindcss/postcss`), TypeScript
- shadcn init used: `--base radix --preset nova --yes`
- Font CSS vars: `--font-geist-sans` / `--font-geist-mono` set by next/font on `<html>`; aliased to `--font-sans` / `--font-mono` in `:root`
- `@clerk/nextjs` v7.4.2, `@clerk/ui` v1.14.0
