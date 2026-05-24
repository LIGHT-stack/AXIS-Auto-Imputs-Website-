# Legacy prototype

`AxisApp.jsx` was the original single-page app. The UI has been migrated to:

- `src/app/(site)/*` — Next.js routes
- `src/components/axis/*` — structured components
- `src/data/*` — inventory and marketing content
- `src/styles/axis.css` — design system (gold/dark theme)

`npm run sync:legacy` still copies the external prototype here for reference. The live site no longer mounts `LegacyApp` at `/`.
