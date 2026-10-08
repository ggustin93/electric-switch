# Dois-je passer à l'électrique ? · Should I switch to electric?

Life-cycle simulator in five languages (FR, EN, NL, IT, ES): keep your petrol/diesel car or switch to electric, compare all powertrains, or pit two cars against each other.

```sh
npm install
npm run dev     # http://localhost:5173
npm test        # model invariants (node:test)
npm run build   # one page per language: dist/{fr,en,nl,it,es}/ + root redirect (ADR 0006), 404.html, sitemap.xml, robots.txt, llms.txt, _headers
LANGUE=nl npm run dev   # develop another language
npm run deploy  # manual deploy to Cloudflare Workers (static assets), see wrangler.jsonc
```

Production: https://electric-switch.guillaume-gustin-9.workers.dev

- `src/model.js` holds the pure LCA model with no UI text. `src/model.test.js` covers it.
- `src/i18n/<lang>.jsx` holds every visible string of one language (French is the source), assumptions H1–H14 and the « Mentions légales ». `src/i18n/commun.jsx` holds the sources and the language list. `src/i18n.test.js` checks that every language has the French keys.
- `src/mesure.js` sends optional cookieless Umami events (off until the website ID is set). `src/mesure.test.js` covers it.
- `src/App.jsx` is the UI (plain Preact without `preact/compat`, so SVG attributes are kebab-case; see ADR 0003). Reading pages are hash routes: `#methode`, `#ecoconception`, `#mentions`. `src/styles.css` holds the design tokens (light and dark).
- Production build = **one self-contained `dist/<lang>/index.html` per language** (CSS, JS and font inlined, EcoIndex A, see ADR 0004, 0006), **pre-rendered**: the first screen is already in the HTML and Preact hydrates it (ADR 0008). Also a static `dist/404.html` served for unknown URLs, and `dist/_headers`: hreflang `Link` plus security headers, with a hash-based CSP computed from the built pages (`src/entetes.js`). Any new inline `<script>`/`<style>` is picked up automatically; a `style="…"` attribute in the HTML fails the build.
- **Site URL:** one build variable, `SITE_URL` (default `https://electric-switch.guillaume-gustin-9.workers.dev`, see `src/seo.js`). It feeds each page's `<link rel="canonical">` and the absolute hreflang URLs of the `Link` header (`dist/_headers`). Domain switch: `SITE_URL=https://electricornot.eu npm run build`, no code change.
- **Search engines and AIs:** `dist/sitemap.xml`, `dist/robots.txt` (replaces Cloudflare's managed one: turn off *Managed robots.txt* in the zone if enabled, otherwise Cloudflare prepends its own) and `dist/llms.txt` are built by `build.mjs`; each page carries one JSON-LD block (`src/donnees.js`, ADR 0009). A `<script type="application/ld+json">` counts as a DOM element: pages sit at the EcoIndex A ceiling.
- **Share preview images:** `og/<lang>.png` (committed, copied to `dist/og/`), regenerated with `node scripts/apercus.mjs` when a title changes (needs `agent-browser` and Python Pillow).
- `src/App.jsx` is the UI (plain Preact without `preact/compat`, so SVG attributes are kebab-case; see ADR 0003). Reading pages are real pages, `/fr/methode/`, `/fr/ecoconception/`, `/fr/mentions/`; `src/routes.js` maps paths to pages (ADR 0009). `src/styles.css` holds the design tokens (light and dark).
- Production build = **one self-contained `dist/<lang>/index.html` per language, plus `dist/<lang>/<page>/index.html` per reading page** (CSS, JS and font inlined, EcoIndex A, see ADR 0004, 0006), **pre-rendered**: the first screen is already in the HTML and Preact hydrates it (ADR 0008).
- **Site URL:** one build variable, `SITE_URL` (default `https://electric-switch.guillaume-gustin-9.workers.dev`, see `src/seo.js`). It feeds each page's `<link rel="canonical">` and the absolute hreflang URLs of the `Link` header (`dist/_headers`, one rule per page path). Domain switch: `SITE_URL=https://electricornot.eu npm run build`, no code change.
- Docs: `PRODUCT.md`, `DESIGN.md` (Impeccable), `CONTEXT.md` (glossary), `docs/adr/` (0005: hosting), `docs/research/` (sourced checks), `CHANGELOG.md`.

**Continuous deployment:** every push to `main` runs the tests, then deploys (`.github/workflows/deploy.yml`). One-time setup: GitHub secret `CLOUDFLARE_API_TOKEN` (Cloudflare template « Edit Cloudflare Workers ») and variable `CLOUDFLARE_ACCOUNT_ID`.
