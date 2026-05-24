# Deployment

## Vercel (recommended)

1. Push repo to GitHub.
2. Import project in Vercel; set root directory `axis-auto-imports`.
3. Add environment variables from `.env.example`.
4. Connect PostgreSQL (Vercel Postgres, Neon, or Supabase).
5. Run `npx prisma migrate deploy` in build step or manually.

## Build

```bash
npm run sync:legacy   # CI: ensure AxisApp.jsx exists
npm run build
```

## Docker (optional)

```bash
cd infrastructure
docker compose up -d
```

Provides local PostgreSQL for Prisma development.

## Pre-launch checklist

- [ ] Replace demo admin login with NextAuth / Clerk
- [ ] Real WhatsApp number in env
- [ ] SSL + `NEXT_PUBLIC_SITE_URL` production URL
- [ ] Privacy policy & terms pages from `content/legal/`
- [ ] GA4 / Meta Pixel verified
- [ ] Submit sitemap in Google Search Console
