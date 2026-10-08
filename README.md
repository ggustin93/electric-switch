# Dois-je passer à l'électrique ? · Should I switch to electric?

Life-cycle simulator in five languages (FR, EN, NL, IT, ES): keep your petrol/diesel car or switch to electric, compare all powertrains, or pit two cars against each other.

```sh
npm install
npm run dev     # http://localhost:5173
npm test        # model invariants (node:test)
npm run build   # one page per language: dist/{fr,en,nl,it,es}/ + root redirect (ADR 0006)
LANGUE=nl npm run dev   # develop another language
npm run deploy  # manual deploy to Cloudflare Workers (static assets), see wrangler.jsonc
```

Production: https://electric-switch.guillaume-gustin-9.workers.dev

- `src/model.js` holds the pure LCA model with no UI text. `src/model.test.js` covers it.
- `src/i18n/<lang>.jsx` holds every visible string of one language (French is the source), assumptions H1–H14 and the « Mentions légales ». `src/i18n/commun.jsx` holds the sources and the language list. `src/i18n.test.js` checks that every language has the French keys.
- `src/mesure.js` sends optional cookieless Umami events (off until the website ID is set). `src/mesure.test.js` covers it.
- `src/App.jsx` is the UI (plain Preact without `preact/compat`, so SVG attributes are kebab-case; see ADR 0003). Reading pages are hash routes: `#methode`, `#ecoconception`, `#mentions`. `src/styles.css` holds the design tokens (light and dark).
- Production build = **one self-contained `dist/index.html`** (CSS, JS and font inlined, EcoIndex A, see ADR 0004).
- Docs: `PRODUCT.md`, `DESIGN.md` (Impeccable), `CONTEXT.md` (glossary), `docs/adr/` (0005: hosting), `docs/research/` (sourced checks), `CHANGELOG.md`.

**Continuous deployment:** every push to `main` runs the tests, then deploys (`.github/workflows/deploy.yml`). One-time setup: GitHub secret `CLOUDFLARE_API_TOKEN` (Cloudflare template « Edit Cloudflare Workers ») and variable `CLOUDFLARE_ACCOUNT_ID`.
