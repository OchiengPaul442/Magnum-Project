# Magnum Admin Dashboard

Modern admin dashboard for Magnum built with Next.js, Tailwind CSS, and shadcn UI. The UI follows the Magnum palette, Lato typography, and the visual style referenced in the provided designs.

## Features

- Admin-only screens mapped to Admin Dashboard APIs (schools, students, parents, vendors, cards, sales, accounts, transactions, activity logs, roles).
- Secure API proxy to avoid exposing the backend base URL in client requests.
- Auth flow with OTP verification and protected routes.
- Reusable, responsive components with loading, empty, and error states.
- Sentry error tracking and loglevel logging.

## Local Development

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

Create `.env.local` using `.env.example`.

```dotenv
MAGNUM_API_BASE_URL=https://your-backend.example
NEXT_PUBLIC_LOG_LEVEL=info
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_DSN=
```

### API Proxy

All browser API calls go to `/api/**` (same-origin). The Next.js route handler forwards requests to `MAGNUM_API_BASE_URL`, keeping the backend URL out of client bundles and network tabs.

## Scripts

```bash
pnpm lint
pnpm build
pnpm start
```

## Design Notes

- Uses Lato and the Magnum palette.
- Mobile-first layout with responsive tables and navigation.
- Branding uses `public/logos/logo.png`.

## License

See LICENSE for usage restrictions.
