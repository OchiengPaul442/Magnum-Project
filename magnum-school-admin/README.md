# Magnum School Admin

Modern admin dashboard for Magnum schools.

## Development

```bash
pnpm install
pnpm dev
```

## Environment

Create `.env.local`:

```bash
MAGNUM_API_BASE_URL=https://your-backend.example/
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000

# Optional Sentry
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_DSN=
SENTRY_ORG=
SENTRY_PROJECT=
```

Browser API calls go to `/api/proxy/**`. Auth flows use the same proxy path, and the proxy treats auth endpoints as public so login, OTP, and password-reset requests do not require a JWT.

## Scripts

```bash
pnpm lint
pnpm build
pnpm start
```
