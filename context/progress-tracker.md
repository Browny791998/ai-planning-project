# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Feature 05 — Prisma Schema & Data Layer ✓

## Current Goal

- Awaiting next feature spec.

## Completed

- Boilerplate cleanup (stripped globals.css, removed SVGs, minimal page.tsx)
- Design system: shadcn/ui (v4.8.2, Nova/Radix preset) + lucide-react installed
- `lib/utils.ts` with `cn()` (clsx + tailwind-merge)
- `components/ui/`: Button, Card, Dialog, Input, Tabs, Textarea, ScrollArea
- `globals.css`: dark-only theme — all shadcn semantic vars + Ghost AI custom tokens wired via `@theme inline`
- `components/editor/editor-navbar.tsx`: fixed top navbar, sidebar toggle with PanelLeftOpen/PanelLeftClose, left/center/right sections
- Auth (Feature 03):
  - `@clerk/ui` installed (v1.14.0)
  - `proxy.ts` at project root — protected-first `clerkMiddleware`, public routes driven by `NEXT_PUBLIC_CLERK_SIGN_IN_URL` / `NEXT_PUBLIC_CLERK_SIGN_UP_URL` env vars
  - `app/layout.tsx` — `ClerkProvider` wraps root layout with `ui` from `@clerk/ui`, dark `theme` from `@clerk/ui/themes`, CSS variable overrides via `appearance.variables` and `appearance.elements`
  - `app/page.tsx` — server component redirects authenticated users to `/editor`, unauthenticated to `/sign-in`
  - `app/sign-in/[[...sign-in]]/page.tsx` and `app/sign-up/[[...sign-up]]/page.tsx` — 50/50 two-panel layout; left panel hidden on mobile
  - `components/editor/editor-navbar.tsx` — `UserButton` added to right section
- Prisma Schema & Data Layer (Feature 05):
  - `prisma/models/project.prisma` — `ProjectStatus` enum (`DRAFT`/`ARCHIVED`), `Project` model (ownerId, name, optional description, status, canvasJsonPath, timestamps, indexes on ownerId and createdAt), `ProjectCollaborator` model (projectId cascade, email, createdAt, unique on projectId/email, indexes on email and projectId/createdAt)
  - `lib/prisma.ts` — cached singleton; branches on `DATABASE_URL`: `prisma+postgres://` → Accelerate via `@prisma/extension-accelerate`; otherwise direct `@prisma/adapter-pg`; `global.prismaGlobal` cache for dev hot-reload
  - Migration `20260531021505_init_project_models` applied; client generated to `app/generated/prisma/`
  - `@prisma/extension-accelerate` installed
- Project Dialogs & Editor Home (Feature 04):
  - `hooks/use-project-dialogs.ts` — `useProjectDialogs` hook (dialog/form/loading state, slug derivation); `ProjectDialogsContext` + `useEditorDialogs` for consuming context; `MOCK_MY_PROJECTS` / `MOCK_SHARED_PROJECTS`
  - `components/editor/project-dialogs.tsx` — Create (name input + live slug preview), Rename (prefilled input, Enter submits), Delete (destructive confirm) dialogs
  - `components/editor/editor-home.tsx` — home screen: heading, description, New Project button wired to Create dialog via context
  - `components/editor/project-sidebar.tsx` — mock project list in My Projects/Shared tabs; hover actions (Pencil/Trash) on owned projects only; New Project button opens Create dialog; mobile backdrop scrim closes sidebar on tap
  - `components/editor/editor-shell.tsx` — provides `ProjectDialogsContext`, calls `useProjectDialogs`, renders `ProjectDialogs` alongside shell
  - `app/editor/page.tsx` — renders `<EditorShell><EditorHome /></EditorShell>`

## In Progress

- None.

## Next Up

- Feature 06 (TBD from feature-specs)

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
- Dialog/form state lives in `useProjectDialogs` hook; shared via `ProjectDialogsContext` provided by `EditorShell`; consumed by `ProjectSidebar` and `EditorHome` via `useEditorDialogs`

## Session Notes

- Next.js 16.2.6, React 19, Tailwind v4 (`@tailwindcss/postcss`), TypeScript
- shadcn init used: `--base radix --preset nova --yes`
- Font CSS vars: `--font-geist-sans` / `--font-geist-mono` set by next/font on `<html>`; aliased to `--font-sans` / `--font-mono` in `:root`
- `@clerk/nextjs` v7.4.2, `@clerk/ui` v1.14.0
