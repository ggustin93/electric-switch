# 0006 — One page per language (FR, EN, NL, IT, ES)

Status: accepted (2026-10-08). Owner's choice among three options (one page per language, everything in one page, Dutch only first).

## Context
The owner wanted Dutch (half of Belgium), Italian and Spanish next to FR/EN. Each dictionary weighs about 8 kB gzipped. With all five in the single self-contained page (ADR 0004), the page would reach about 82 kB and drop to **EcoIndex B (≈ 78)**. The page was already at the A ceiling: 93 elements, 80.01.

## Decision
- **One self-contained page per language:** `/fr/`, `/en/`, `/nl/`, `/it/`, `/es/`. Each contains only its own dictionary. `build.mjs` runs `LANGUE=<l> vite build` five times; the `@langue` alias points to `src/i18n/<l>.jsx`.
- **Root `/`:** a tiny redirect page (≈ 1 kB). It picks the remembered language (`localStorage.lang`), else the browser's, else English, and keeps the hash (`#methode`…).
- **Language switch:** five links (`<a hreflang lang aria-current>`), no longer radios. Clicking one keeps the current hash.
- **hreflang:** sent as an HTTP `Link` header (`dist/_headers`), not as `<link>` tags. Six tags would have added 6 elements and grade B (79.85). Absolute URLs from `SITE_URL` since ADR 0008.
- **Dictionaries:** `src/i18n/{fr,en,nl,it,es}.jsx` share the same keys, checked by `src/i18n.test.js` (same keys and types as French). `src/i18n/commun.jsx` holds what every language shares: `HYP_REFS`, `SOURCES` (original-language titles) and `LANGUES`.
- **Display font:** rebuilt from the Google Fonts variable source, instanced at weight 600, opsz 14, wdth 100 (identical to the previous static SemiBold), then subset to the characters of all five dictionaries: 12.4 → 13.7 kB.

## Result (production build, first load)
Every page: **DOM 92, 1 request, 51–52 kB → EcoIndex 80.3 (A), 0.26 gCO₂e per visit**. That's lighter than the bilingual page (58 kB).

## Trade-offs
- Switching language reloads the page, so answers already given are lost. Rare mid-flow; the hash (reading page) is kept.
- Five builds: about 5 × 1 s locally and in CI.
- The NL, IT and ES translations were machine-drafted and checked for structure and rendering. **A native review is recommended**, especially for the hypotheses and the legal notice, before announcing those languages.
- The root redirect costs one extra request on a visitor's first visit to `/`. Links shared with a language path go straight to the page.

## Regenerating the font
```sh
python3 -m venv .venv && .venv/bin/pip install fonttools brotli
# source: github.com/google/fonts ofl/bricolagegrotesque/BricolageGrotesque[opsz,wdth,wght].ttf (SIL OFL)
.venv/bin/python -c "from fontTools.ttLib import TTFont; from fontTools.varLib import instancer; \
  instancer.instantiateVariableFont(TTFont('Bricolage.ttf'), {'wght': 600, 'opsz': 14, 'wdth': 100}).save('b600.ttf')"
cat src/i18n/*.jsx > texte.txt
.venv/bin/pyftsubset b600.ttf --text-file=texte.txt --text="0123456789 ,.%" --layout-features=kern \
  --no-hinting --desubroutinize --flavor=woff2 --output-file=src/assets/bricolage.woff2
```
