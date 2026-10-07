# 0004 — Single-page build, Preact without compat, subset font: EcoIndex A

Status: accepted (2026-10-07). Extends ADR 0003. Design unchanged.

## Context
After ADR 0003: EcoIndex 77 (B), with DOM 88, 4 requests and 59.5 kB. The owner asked to improve further without touching the design. The Green Claude audit (INR, RGESN 2024 / GR491, installed in `.claude/skills/green-claude`) raised ECO-ARCH-01 (framework weight) and ECO-UX-05 (fonts). Its other hits were checked and found to be false positives: ECO-FRONT-05, BACK-03, BACK-10, HEB-06, and UX-08 (`h2:focus` keeps a `:focus-visible` ring).

Simulated with the CNUMR algorithm before implementing:

| Option | Requests | Weight | Score |
|---|---|---|---|
| ADR 0003 | 4 | 59.5 | 77.0 B |
| Split dictionary per language | 5 | 52 | 76.8 B (worse: +1 request) |
| No compat + subset font + inline CSS | 3 | 48 | 77.9 B |
| **Single page (CSS + JS + font inlined)** | **1** | **≈ 48** | **≈ 81 A** |

## Decision
1. **Preact without `preact/compat`.** Imports come from `preact` and `preact/hooks`, and range sliders listen to `onInput`, since core Preact maps `onChange` to the native `change` event. Saves 4 kB gz.
2. **Subset display font.** `pyftsubset --text-file=src/i18n.jsx` with digits, `kern` only and no hinting: 22.5 → 12.4 kB. It lives in `src/assets/bricolage.woff2`.
3. **Single page.** The `pageUnique` plugin in `vite.config.js` inlines CSS and JS into `index.html`, and the font is inlined into the CSS as a data URI (`assetsInlineLimit`).
4. `kmBascule` is memoised: its sweep of 75 `decider()` calls no longer reruns on every slider movement.

Measured on the production build: **DOM 87, 1 request, 47.7 kB → 81 (A), 0.26 gCO₂e / visit**.

## Trade-offs
- With no separate cache for JS, CSS and font, a returning visitor re-downloads the whole page unless the host answers 304 to an ETag revalidation (Cloudflare Pages and Netlify do by default). Acceptable for a one-shot tool.
- **If you add text with new characters** (accents, symbols) to a display element (h1, h2, verdict, figures), regenerate the font:
  ```sh
  python3 -m venv .venv && .venv/bin/pip install fonttools brotli
  # source font: Bricolage Grotesque variable, wght 600..800, Latin subset (Google Fonts, SIL OFL)
  .venv/bin/pyftsubset bricolage-latin.woff2 --text-file=src/i18n.jsx --text="0123456789 ,.%" \
    --layout-features=kern --no-hinting --desubroutinize --flavor=woff2 --output-file=src/assets/bricolage.woff2
  ```
  A missing glyph falls back to `system-ui`; the page does not break.
- Hosting is still undecided. Prefer a host that is transparent about its energy (ECO-HEB-01) with Brotli enabled (ECO-HEB-02).
