# SEO & Marketing

## On-page

- Unique `<title>` and meta description per route via `generateMetadata`.
- Vehicle detail: JSON-LD `Product` + `Offer` schema.
- FAQ page: `FAQPage` schema from `content/` markdown.

## Technical

- `src/app/sitemap.ts` — dynamic sitemap (extend with vehicle slugs from DB).
- `src/app/robots.ts` — block `/admin` and `/api/`.
- Core Web Vitals: migrate images to `next/image`, reduce inline CSS over time.

## Local SEO (Ghana)

- NAP consistency: Accra office, phone, WhatsApp in footer.
- Google Business Profile link in `siteConfig`.
- Target keywords: Korean car import Ghana, Tema clearance, used SUVs Accra.

## Conversion

- Primary CTA: WhatsApp deep links with pre-filled vehicle message.
- Secondary: web lead form → `/api/leads` → CRM.
- Floating AI + WhatsApp buttons (legacy UI).

## Analytics

Set in `.env.local`:

- `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- `NEXT_PUBLIC_META_PIXEL_ID`

Wire in `src/lib/analytics/` when ready.
