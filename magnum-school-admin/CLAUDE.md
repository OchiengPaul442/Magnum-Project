# CLAUDE

## Architecture

- Next.js App Router with Lato font as the baseline UI font.
- Zustand replaces Redux for UI + user profile state.
- NextAuth credentials + OTP; refresh handled server-side.

## Security & Sessions

- Never access or store access tokens in client state.
- All browser calls must go through `/api/proxy/**`.
- Backend base URL is `MAGNUM_API_BASE_URL` (server env only).

## Observability

- Sentry is enabled via `@sentry/nextjs` configs:
  - `sentry.client.config.ts`
  - `sentry.server.config.ts`
  - `sentry.edge.config.ts`

## Scripts

- `pnpm dev`
- `pnpm lint`
- `pnpm build`
