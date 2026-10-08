# 02: Real reading pages

**What to build:** « Méthode », « Écoconception » and « Mentions légales » become **real indexable pages** in each language (e.g. `/fr/methode/`), pre-rendered, each with its own title, description, canonical and hreflang. Header and footer links point to them. An old `#methode` link leads to the new page, and hypothesis anchors (`/fr/methode/#h5`) keep working.

**Blocked by:** 01

**Status:** resolved

- [x] `/fr/methode/`, `/fr/ecoconception/` and `/fr/mentions/` exist in all 5 languages and return their content without JavaScript
- [x] Own title, description and canonical on each page; hreflang between the language versions
- [x] `/fr/#methode` (old link) leads to `/fr/methode/`; `/fr/methode/#h5` scrolls to H5
- [x] The verdict, the help bubbles and « Retour au simulateur » keep working
- [ ] EcoIndex A on each page (measured); tests pass; CONTEXT.md and ADR (routes) updated — **all except Méthode (B)**, see Comments

## Comments

2026-10-08 — Done (ADR 0009). One `vite build` per language and page (`PAGE=methode`…), same bundle, page chosen from the path (`src/routes.js`, tested); per-path hreflang rules in `dist/_headers` (`fichierHeaders`, tested); old hash links redirected on load with the anchor kept; `page` measurement event fires on load. New key `mentionsIntro` (meta description of Mentions légales, 5 languages).

Measured (vite preview, agent-browser, 1 request each, fr and nl identical):

| Page | DOM | gzip | EcoIndex |
|---|---|---|---|
| Tool `/fr/` | 93 | 54.5 kB | 80.1 A (unchanged) |
| `/fr/methode/` | 140 | 58.0 kB | **75.5 B** |
| `/fr/ecoconception/` | 78 | 55.0 kB | 81.5 A |
| `/fr/mentions/` | 56 | 54.4 kB | 87.2 A |

**Méthode cannot reach A as is**: its article alone is 105 elements (34 `li`, 29 `[n]` source links, 14 `strong`, 21 `em` in sources). A needs DOM ≤ 93 at 58 kB; dropping the JS (≈ 27 kB) is not enough on its own (DOM 140 → 76.9). Options, decision pending:
1. Source refs as plain text « [3, 7] » instead of 29 links, and sources without `<em>` (titles in quotes): DOM ≈ 90 → ≈ 80.3 (A). Loses click-to-source and italics.
2. Split Méthode into « Hypothèses » (`/methode/`) and « Sources » (`/sources/`), refs linking across: both pages ≈ 85–95 DOM → A. One more page per language.
3. Accept B for Méthode (it used to load on top of the whole tool, ≈ 200 elements) and state it on the Écoconception page.
