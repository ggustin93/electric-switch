# Dois-je passer à l'électrique ? · Should I switch to electric?

Bilingual (FR/EN) life-cycle simulator: keep your petrol/diesel car or switch to electric, compare all powertrains, or pit two cars against each other.

```sh
npm install
npm run dev     # http://localhost:5173
npm test        # model invariants (node:test)
npm run build
```

- `src/model.js` holds the pure LCA model with no UI text. `src/model.test.js` covers it.
- `src/i18n.jsx` holds every visible string (FR/EN), assumptions H1–H13 and the sources.
- `src/App.jsx` is the UI (Preact through `preact/compat`, see ADR 0003). `src/styles.css` holds the design tokens (light and dark).
- Production build = **one self-contained `dist/index.html`** (CSS, JS and font inlined, EcoIndex A, see ADR 0004).
- Docs: `PRODUCT.md`, `DESIGN.md` (Impeccable), `CONTEXT.md` (glossary), `docs/adr/`.
