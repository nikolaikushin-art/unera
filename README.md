# UNERA — Universal Economic Reform Alliance

Institutional website for UNERA, rebuilt from the original static HTML as a **React 19 + Vite +
TanStack Router + TypeScript** application, using the same stack and deployment model as the
H-Hunters site. Content, copy, logos, navigation and styling are carried over from the original.

## Quick start

Requires Node.js 22.

```sh
npm install
npm run dev        # http://localhost:3000
npm run build      # client build + SSR bundle + prerender → dist/
npm run preview
npm run typecheck
```

`npm run build` prerenders **179 routes** to `dist/<route>/index.html` (full HTML for SEO and
instant paint); the React app then takes over in the browser. `dist/spa.html` is the fallback for
unknown URLs (see `vercel.json`).

## Deploy

**Vercel:** import the repository, leave the Root Directory empty, framework preset *Other*.
`vercel.json` already sets the build command, `dist` output and SPA rewrite. No environment variables.

**GitHub:** push to `main`; `.github/workflows/ci.yml` runs typecheck + build.

## Structure

| Path | What it is |
| --- | --- |
| `src/routes/` | `__root.tsx` shell, `index.tsx` home, `$slug.tsx` for all other pages |
| `src/components/Header.tsx` | Top bar, header, 5 mega menus and mobile menu as React state (replaces `main.js`) |
| `src/data/nav.json` | Mega-menu content (5 menus, 32 panels) |
| `src/data/pages/*.json` | Per-page copy for the 154 templated pages |
| `src/generated/` | Page template and bespoke pages converted from the original HTML |
| `public/assets/` | Logos, team photos, globe image (unchanged originals) |

The "topic-aware" sections that `js/main.js` used to inject at runtime (page command centre,
footer focus bar, personalised headings) are now part of each page's data, so they are in the
prerendered HTML rather than appearing after load.

## Sections ported from NK&CO and H-Hunters

Everything is added on top of the original layout. The mega menu, header and every original section are unchanged.

**Home** (20 sections, each a different layout, no repeats):
practice hero (NK&CO structure) → metric strip → big statement → sectors gallery → layer model → photo band → regions grid → reform frameworks (chain / funnel / curve / equation) → announced-vs-delivered comparison → image mosaic → ambition × capacity matrix → mandate timeline → principles → topic chips → insights row → process timeline → engagement ledger → contact cards → insights subscribe → FAQ.

**All 154 content pages: unique closing sections.** Each page gets its own photograph plus two more
layouts drawn from eight designs (questions, engagement ledger, related pages, readiness checklist,
comparison, matrix, layer model; the photo spotlight is always present), in a page-specific order. Copy is composed from that page's own
content and label. Checked at build time of this delivery: 154 distinct photographs, 154 distinct
extras texts, no photo shared with the home page. Logic: `src/lib/page-extras.ts`.

**Coverage of the H-Hunters library:** `docs/SECTION-INVENTORY.md` lists all 391 exported section components with their status (covered by an equivalent UNERA layout, replaced by UNERA's original, not applicable, or layout pattern not yet ported).

**Contact:** its own FAQ (contacting UNERA), different from the home FAQ.

**Everywhere:** site search (Ctrl/Cmd+K or "Search" in the top bar), slide-over enquiry form,
floating Enquire button, back-to-top.

Code is in `src/components/sections/`, styles in `src/sections.css`, restyled with UNERA's tokens
rather than H-Hunters' Tailwind theme.

**About NK&CO:** nkco's own site was not available to this build. What is carried over is what H-Hunters
had already taken from it: the NK&CO hero structure and its 19-photograph NK&CO import (in
`src/lib/photo-library.ts`, keys starting `nk`). `docs/nkco-photo-allocation-from-h-hunters.csv` is
H-Hunters' record of how those photographs were allocated.

Engagement, FAQ, checklist and framework **copy is draft wording written for this site: please review before launch.**

**Imagery (all of it is in the repo):**
- `public/images/studio/` — the three H-Hunters studio photographs (used on the site).
- `public/images/h-hunters/` — every other local H-Hunters image (brand marks and leadership portraits). Kept for reference and **not displayed**: they are H-Hunters' people and branding.
- `src/lib/photo-library.ts` — the complete H-Hunters photo library, 647 photographs as remote URLs, grouped by theme. `src/lib/photos.ts` holds the curated subset used by the sections.

## Enquiry forms

Forms validate inline and include consent and a honeypot. Copy `.env.example` to `.env`:
set `VITE_ENQUIRY_ENDPOINT` to POST JSON to a service (Formspree etc.), otherwise the form opens
a pre-filled email to `VITE_ENQUIRY_EMAIL` (default `secretariat@unera.world`). On Vercel, add
these as environment variables. The original contact-page form is unchanged and still has no backend.

## Images

Unera's original pages and the H-Hunters photo library reference stock photos by URL (Unsplash, plus a few Pexels).
To bundle them locally, run once on a machine with internet access:

```sh
npm run images:localize
```

It downloads each photo to `public/images/unsplash/` and rewrites the references.

## Known gaps carried over from the original site

- **22 pages are linked but were never built** (e.g. `/privacy`, `/terms`, `/accessibility`,
  `/procurement`, `/secondments`, `/proposals`, `/technical-assistance`). They now resolve to a
  "this page is being prepared" placeholder (`noindex`) instead of a 404. The list is derived
  from `src/data/missing-pages.json` plus the three footer legal pages.
- The contact form has no backend (it did not in the original). Connect Formspree, Resend or a
  Vercel function before launch.
- The language switcher on the home page (EN/FR/ES/AR) is visual only, as before.
