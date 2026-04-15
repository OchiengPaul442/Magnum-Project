<!-- BEGIN:nextjs-agent-rules -->

# Magnum Admin Dashboard Agent Rules

## Next.js Safety

- This is NOT the Next.js you know. APIs, conventions, and file structure may differ.
- Read the relevant guide in `node_modules/next/dist/docs/` before changing Next.js code.
- Heed deprecation notices and follow the current app router conventions.

## API Usage

- Use Admin Dashboard APIs only. Do NOT use School Dashboard APIs.
- All browser calls must go through same-origin `/api/**` so the backend base URL is never exposed.
- Server proxy uses `MAGNUM_API_BASE_URL` (server-only). Never reference it in client code.
- Protected requests use `Authorization: Token <token>`; login and OTP verification must skip auth headers.

## Data + Security

- Use UUID `id` values for mutations; show friendly IDs for display/search only.
- Never render OTPs, login PINs, card PINs, refresh tokens, or raw secrets.

## UI + Styling

- Use Lato, the Magnum palette, and shadcn UI components.
- Keep layouts mobile-first and responsive across screen sizes.
- Prefer reusable components in `components/shared` and `components/ui`.
- Use the logo in `public/logos/logo.png` for branding.

## Repo Hygiene

- Update `.env.example` whenever new env vars are added.
- Keep `.env.local` out of git.
<!-- END:nextjs-agent-rules -->
