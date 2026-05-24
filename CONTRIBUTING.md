# Contributing

## Branching

- `main` — production-ready
- `develop` — integration
- `feature/*` — new pages or APIs

## Before PR

```bash
npm run lint
npm run typecheck
npm run build
```

## Code style

- Match existing patterns in `src/lib` and `src/types`.
- Prefer extracting logic from `legacy/AxisApp.jsx` over duplicating.
- No secrets in commits.

## Docs

Update relevant files in `docs/` when changing APIs or architecture.
