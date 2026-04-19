# AGENTS

## Project Context

- App: Magnum School Admin (Next.js App Router).
- State: Zustand for UI and user profile state.
- Auth: NextAuth credentials + OTP, session JWT stored in HttpOnly cookie.
- API access: Always via `/api/proxy/**` (server-side token handling).
- Font: Lato (local, required across UI).

## Development Rules

- Do not expose access/refresh tokens to the client.
- Use `MAGNUM_API_BASE_URL` for the backend API base (server-only env var).
- Use `/api/proxy` for client requests (no public API base URL).
- Keep auth endpoints public and all other routes secured by proxy.

## Scripts (pnpm)

- `pnpm dev`
- `pnpm lint`
- `pnpm build`

## Where to Look

- API proxy: `src/app/api/proxy/[...path]/route.ts`
- Auth options: `src/lib/auth.ts`
- API clients: `src/lib/api/enhancedApiClient.ts`
- Global layout: `src/app/layout.tsx`
