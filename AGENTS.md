# Repository guide

UNERA marketing website: React 19 + Vite + TanStack Router (file-based) + TypeScript, prerendered
to static HTML at build time. Same stack and deploy model as the H-Hunters site.

- `src/routes/` — `__root.tsx` (shell), `index.tsx` (home), `$slug.tsx` (every other page).
- `src/components/` — `Header` (data-driven mega menu), `Footer`, `A` (router-aware link), `Placeholder`.
- `src/data/nav.json` — the whole mega menu. Edit links here.
- `src/data/pages/<slug>.json` — copy and image URLs for the 154 templated pages.
- `src/generated/PageTemplate.tsx` — the shared layout those 154 pages render through.
- `src/generated/{HomePage,ContactPage,LeadershipPage}.tsx` — the three bespoke pages.
- `src/styles.css` — the original UNERA stylesheet, unchanged.
- Build: `npm run build` → `dist/` (one `index.html` per route + `spa.html` fallback).
- `src/components/sections/` — ported H-Hunters sections (search, quick enquiry, FAQ, engagement models, photo band, process).
- `src/sections.css` — styles for those sections.
