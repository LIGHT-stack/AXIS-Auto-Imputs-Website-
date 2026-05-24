# Architecture

## Overview

AXIS is a **dealer / import brokerage** web application: marketing site, inventory discovery, cost tools, lead capture, and admin operations. The codebase follows patterns used by modern automotive retail and marketplace products.

## Layers

```
┌─────────────────────────────────────────────────────────┐
│  Presentation (Next.js App Router, React components)   │
├─────────────────────────────────────────────────────────┤
│  API Routes (/api/*) — chat, vehicles, leads           │
├─────────────────────────────────────────────────────────┤
│  Domain lib (filters, clearance, SEO, CRM adapters)    │
├─────────────────────────────────────────────────────────┤
│  Data — Prisma → PostgreSQL | CMS | DMS feed           │
└─────────────────────────────────────────────────────────┘
```

## Migration strategy

1. **Phase 0 (now):** Legacy single-file app in `src/components/legacy/AxisApp.jsx` rendered at `/`.
2. **Phase 1:** Extract shared data → `src/data`, utils → `src/lib`, types → `src/types`.
3. **Phase 2:** Split routes — `/inventory`, `/inventory/[slug]` with SSR + JSON-LD.
4. **Phase 3:** Replace rule-based chat with `/api/chat` + RAG over inventory docs.
5. **Phase 4:** Admin auth, Prisma-backed CRUD, analytics (GA4, Meta Pixel).

## Industry integrations (stubs in repo)

| Concern | Location | Typical provider |
|---------|----------|------------------|
| Inventory feed | `src/lib/cms/` | DealerCenter, AutoTrader API |
| CRM / leads | `src/lib/crm/` | HubSpot, Salesforce |
| Payments / finance | `src/lib/finance/` | Local bank partners |
| Shipping tracking | `src/lib/logistics/` | Freight forwarder API |
| Analytics | `src/lib/analytics/` | GA4, Meta Pixel |
| Auth (admin) | `src/middleware.ts` | NextAuth, Clerk |

## Security

- Never commit `.env.local` or API keys.
- Admin routes must use real authentication before production.
- Validate all lead/chat payloads with Zod (see `src/app/api/leads/route.ts`).
