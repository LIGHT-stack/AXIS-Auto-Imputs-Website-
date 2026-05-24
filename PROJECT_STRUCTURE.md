# Project structure reference

```
axis-auto-imports/
├── .github/workflows/ci.yml
├── ai/
│   ├── evals/chat-quality.json
│   ├── prompts/              # system, sales, vehicle Q&A
│   └── rag/README.md
├── content/
│   ├── blog/                 # MDX articles (SEO)
│   └── legal/                # privacy, terms
├── docs/                     # ARCHITECTURE, AI, API, DEPLOYMENT, …
├── infrastructure/           # docker-compose (Postgres)
├── prisma/schema.prisma
├── public/                   # manifest, favicon, images
├── scripts/
│   ├── sync-legacy.mjs
│   └── seed-inventory.ts
└── src/
    ├── app/
    │   ├── api/chat|vehicles|leads/
    │   ├── layout.tsx, page.tsx, globals.css
    │   ├── robots.ts, sitemap.ts
    │   └── (future) inventory/, tools/, admin/
    ├── components/
    │   ├── legacy/           # AxisApp.jsx (your prototype)
    │   ├── layout/           # Header, Footer, Nav
    │   ├── home/             # Hero, Featured, FAQ
    │   ├── inventory/        # Card, filters, detail
    │   ├── tools/            # Calculators
    │   ├── ai/               # ChatWidget (streaming)
    │   └── ui/               # Buttons, tags, shared
    ├── config/site.ts
    ├── data/vehicles.seed.ts
    ├── hooks/
    ├── lib/
    │   ├── ai/, analytics/, crm/, finance/, seo/, vehicles/
    │   └── cms/              # DMS feed adapters (stub)
    ├── middleware.ts
    └── types/vehicle.ts
```
