# 03: Link preview when shared

**What to build:** A link pasted into WhatsApp, LinkedIn, Slack or Mastodon shows **a title, a sentence and an image** in the page's language. Each language has its own preview image (1200×630), light and readable, in the visual identity (Bricolage title, green accent).

**Blocked by:** 01

**Status:** resolved

- [x] `og:title`, `og:description`, `og:image`, `og:url`, `og:locale` and `twitter:card` on each page — adapted for the EcoIndex budget: language pages carry `og:image` + `twitter:card`; title, sentence and URL come from `<title>`, the meta description and the canonical link (the fallback every target platform reads). The root page `/` carries the full set.
- [x] One 1200×630 image per language, light (target < 60 KB), separate from the page (it does not weigh on the first load) — `og/<lang>.png`, 15–18 kB, copied to `dist/og/`
- [ ] Preview checked with a share debugger (LinkedIn Post Inspector or similar) — needs the deployed URL; tags and image checked locally (curl, `vite preview`)
- [x] EcoIndex A kept (the image is not loaded by the page)

## Comments

2026-10-08 — `balisesApercu(site, lang, page?)` in `src/seo.js` (tested), called from the `entete-langue` plugin (`vite.config.js`) and `build.mjs` (root). Images: `scripts/apercus.mjs` (agent-browser screenshot of an HTML template using `src/assets/bricolage.woff2`, Pillow 64-colour palette).

EcoIndex: the page was at the A ceiling (DOM 93 at 55.8 kB = 80.07; 94 = 79.98, B). Full set (~14 tags) → DOM ~107 → B. Paid for 2 tags without visual change: removed `<meta name="color-scheme">` (inline CSS sets `color-scheme`, light and dark) and the wrapper `<div>` of `Decision` (now a fragment, unstyled). Result per page: DOM 93, 55.2–56.1 kB → 80.06–80.10 (A). Any further head tag (og:title, og:image:alt…) needs one more DOM saving first. Known gap: X/Twitter may want `og:title`/`twitter:title` for the large card; Facebook/LinkedIn/WhatsApp/Slack/Mastodon fall back to `<title>`.

To do after deploy: run LinkedIn Post Inspector / opengraph.xyz on `/fr/` and `/`.
