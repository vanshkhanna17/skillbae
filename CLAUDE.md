# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Dev server:** `yarn start` (Vite, port 5173 by default)
- **Build:** `yarn build` (runs `tsc -b && vite build`)
- **Lint:** `yarn lint` (ESLint for `.ts`/`.tsx` files)
- **Preview production build:** `yarn preview`
- **No test runner is configured.** There are no test scripts or testing libraries.

## Environment Variables

Required in `.env` (prefixed with `VITE_`):
- `VITE_API_BASE_URL` — backend API base URL
- `VITE_API_WS_URL` — WebSocket URL

Optional: `VITE_APP_NAME`, `VITE_ENV`. Types declared in `src/env.d.ts`. All env access goes through `src/config/config.ts` — never use `import.meta.env` directly elsewhere.

## Architecture

React 19 + TypeScript + Vite. Uses yarn as package manager.

**Provider stack** (in `main.tsx`): `BrowserRouter` → `QueryClientProvider` → `ThemeProvider` (MUI) → `AuthProvider`. Order matters — AuthProvider depends on React Query.

**Auth flow:** Cookie-based sessions with in-memory access tokens. `src/lib/tokenStore.ts` holds the access token in a module-scoped variable (not localStorage). `src/api/baseApi.ts` provides `fetchWithRetry` and `postPutRequests` — both automatically attempt a token refresh on 401, then retry once. All API calls use `credentials: "include"` for cookie transport.

**API layer:** `src/api/baseApi.ts` is the HTTP foundation. Domain APIs (`authApi.ts`, `feedApi.ts`) build on top of it. No Axios — raw `fetch` throughout.

**WebSocket:** `src/hooks/useWS.ts` wraps `react-use-websocket` with a topic-based pub/sub pattern. Messages are `{ topic, payload }`. Components subscribe to topics and receive payloads. `src/lib/wsManager.ts` controls reconnection policy (blocked on logout, allowed on login). WS close code `4001` triggers a redirect to `/login`.

**Routing:** `src/routes/AppRoutes.tsx`. All authenticated routes wrap in `ProtectedRoute`, which renders the nav + content grid layout. Unauthenticated users get redirected to `/login`.

**Forms:** React Hook Form + Zod schemas (in `src/schemas/`). The `@hookform/resolvers` package bridges them.

**Rich text:** TipTap editor for post creation. Post content is HTML, sanitized with DOMPurify before rendering via `dangerouslySetInnerHTML`.

**Path alias:** `@/` maps to `src/` (configured in `vite.config.ts`).

## Code Style

- Prettier: double quotes, semicolons, trailing commas, 100 char print width
- ESLint auto-removes unused imports (`unused-imports` plugin). Unused vars with `_` prefix are allowed.
- Husky + lint-staged runs ESLint `--fix` on staged `.js`/`.jsx`/`.ts`/`.tsx` files at commit time
- MUI v7 with a custom theme (`src/theme/`): Poppins for headings, Lato for body text
- CSS custom properties defined in `src/theme/colors.css` (e.g., `--color-primary`, `--size`, `--container-size`)
