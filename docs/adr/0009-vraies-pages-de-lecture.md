# 0009 — Reading pages are real pre-rendered pages

Status: accepted (2026-10-08). Extends ADR 0004, 0006 and 0008. Ticket `.scratch/seo-visibilite/issues/02`.

## Context
« Méthode », « Écoconception » and « Mentions légales » were hash routes (`#methode`, `#methode/h5`…) inside each language page: search engines could not index them, and they had no title, description or canonical of their own.

## Decision
1. **One file per page and language:** `/{lang}/methode/`, `/{lang}/ecoconception/`, `/{lang}/mentions/`, same slugs in every language (`src/routes.js`). Each is a self-contained HTML file like the tool page (CSS, JS, font inlined, one request), pre-rendered with its content. `build.mjs` runs one `vite build` per language and page (`LANGUE=nl PAGE=methode` → `dist/nl/methode/index.html`), languages in parallel (≈ 6 s in all).
2. **Same bundle, page from the URL:** `App` takes a `page` prop: the build passes `PAGE` to the pre-render, `main.jsx` passes `pageDuChemin(location.pathname)` to `hydrate`. On a reading page the tool is not rendered at all (no extra DOM).
3. **Head per page:** title « Méthode · Dois-je passer à l'électrique ? » (name from `pages`), description = the page's intro (`methodeIntro`, `ecoIntro`, `mentionsIntro`), canonical `SITE_URL + /{lang}/{page}/`.
4. **hreflang per page in `dist/_headers`:** one rule per exact path, each listing its own language versions (`fichierHeaders`, `src/seo.js`). x-default: the root `/` for the tool, `/en/{page}/` for a reading page.
5. **Links:** header, footer and « Retour au simulateur » are plain links to the real URLs; H links in help bubbles point to `/{lang}/methode/#hN`; the language switch goes to the same page in the other language (keeping `#hN`).
6. **Old links:** on the tool page, `#methode`, `#methode/hN`, `#ecoconception`, `#mentions` are replaced on load by the new URL (`ancienneAncre`, `location.replace`), anchor kept.
7. **Measurement:** the `page` event fires on load of a reading page; its URL is `/methode`… as before (path without the language).

## Trade-offs
- Going to a reading page and back reloads the tool: answers already given are lost (accepted in the ticket).
- Each reading page carries the whole app bundle (≈ 31 kB gzip of JS it barely needs): one bundle, one build path, hydration for the language-switch anchor and the measurement.
- **EcoIndex of Méthode is B** (DOM 140, 58 kB, 1 request → 75.5). 14 hypotheses with 29 source links, 20 sources with 21 `<em>`. Écoconception (DOM 78 → 81.5) and Mentions (DOM 56 → 87.2) are A; the tool page is unchanged (DOM 93, 54.5 kB → 80.1). **Decision (owner, 2026-10-08):** references become plain text « [1, 8, 14] » and source titles lose their italics → Méthode DOM 92, 57 kB → **80.1 (A)**. Sources stay listed right below the hypotheses.
