# AXIS Auto Imports

Premium Korean vehicle import platform for Ghana — professional Next.js codebase with AI-ready APIs, inventory types, and migration path from the original single-file React prototype.

## Quick start

```bash
cd axis-auto-imports
cp .env.example .env.local
npm install
npm run sync:legacy   # copies axis-auto-imports_1.jsx → src/components/legacy/AxisApp.jsx
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — your full legacy UI runs immediately while you migrate page-by-page into `src/components/`.

## Project structure

```
axis-auto-imports/
├── ai/                    # Prompts, RAG, evals (modern AI development)
├── content/               # Legal pages, blog (MD/MDX)
├── docs/                  # Architecture & runbooks
├── infrastructure/        # Docker, deployment notes
├── prisma/                # PostgreSQL schema (vehicles, leads, chat)
├── public/                # Static assets, manifest, robots
├── scripts/               # Seed, sync-legacy, sitemap
└── src/
    ├── app/               # Next.js App Router (pages + API routes)
    ├── components/        # UI by domain (home, inventory, ai, layout)
    ├── config/            # Site metadata & env-driven settings
    ├── data/              # Seed JSON / fixtures
    ├── hooks/             # React hooks
    ├── lib/               # Business logic (vehicles, finance, ai, seo, crm)
    └── types/             # TypeScript contracts
```

## Key routes (planned migration)

| Route | Purpose |
|-------|---------|
| `/` | Home (legacy app today) |
| `/inventory` | Search & filters |
| `/inventory/[slug]` | Vehicle detail + structured data |
| `/tools` | Clearance & currency calculators |
| `/import-process` | 5-step import guide |
| `/about`, `/contact` | Trust & lead capture |
| `/admin` | Dealer dashboard (auth required) |
| `/api/chat` | Streaming AI assistant (Vercel AI SDK) |
| `/api/vehicles` | Inventory API |
| `/api/leads` | Lead capture → CRM |

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [AI development](docs/AI_DEVELOPMENT.md)
- [Inventory & data](docs/INVENTORY_DATA.md)
- [SEO & marketing](docs/SEO_MARKETING.md)
- [Deployment](docs/DEPLOYMENT.md)
- [API reference](docs/API.md)

## Stack

- **Framework:** Next.js 15 (App Router, Turbopack)
- **UI:** React 19, Tailwind CSS 4, Lucide icons
- **AI:** Vercel AI SDK + OpenAI-compatible models
- **Data:** Prisma + PostgreSQL (optional local Docker)
- **Quality:** ESLint, TypeScript, Vitest, Playwright

## License

Proprietary — AXIS Auto Imports.
