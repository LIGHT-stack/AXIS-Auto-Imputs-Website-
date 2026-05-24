# Inventory Data

## Canonical model

See `src/types/vehicle.ts` and `prisma/schema.prisma`.

## Sources (production)

| Source | Use case |
|--------|----------|
| Manual admin entry | Boutique importer (AXIS today) |
| DMS / dealer feed | XML/JSON nightly sync |
| Auction API (GLOVIS, etc.) | Korea sourcing pipeline |
| CSV import | `scripts/seed-inventory.ts` |

## Seed data

- `src/data/vehicles.seed.ts` — minimal sample for API/tests.
- Full demo set lives in legacy `AxisApp.jsx` until migrated.

## Filters & sort

Implemented in `src/lib/vehicles/filters.ts` (extracted from prototype):

- Brand, category, fuel, drivetrain, status
- Price / mileage ranges
- Full-text search on brand + model + year + trim

## Images

- Use Next.js `<Image>` with `remotePatterns` in `next.config.ts`.
- Store originals in S3 / Cloudinary; serve WebP variants.

## Slugs

Generate URL slugs: `{year}-{brand}-{model}-{id}` e.g. `2018-kia-sportage-1`.
