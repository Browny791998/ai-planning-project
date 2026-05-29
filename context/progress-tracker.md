# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Feature 02 — Editor Chrome ✓

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

## In Progress

- None.

## Next Up

- Feature 03 (TBD from feature-specs)

## Open Questions

- None yet.

## Architecture Decisions

- Dark-only theme — no `.dark` class toggle; all vars set in `:root` directly to dark values
- shadcn on Tailwind v4; `@theme inline` maps CSS vars to Tailwind utilities
- Ghost AI tokens: `--bg-*`, `--text-*`, `--accent-*`, `--state-*` → Tailwind utilities `bg-base`, `bg-surface`, `text-copy-primary`, `text-brand`, `bg-accent-dim`, etc.
- Do not modify generated `components/ui/*` files — CLI only

## Session Notes

- Next.js 16.2.6, React 19, Tailwind v4 (`@tailwindcss/postcss`), TypeScript
- shadcn init used: `--base radix --preset nova --yes`
- Font CSS vars: `--font-geist-sans` / `--font-geist-mono` set by next/font on `<html>`; aliased to `--font-sans` / `--font-mono` in `:root`
