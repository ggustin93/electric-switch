# 0003 — Low-carbon stack: Vite + Preact (not Astro)

Status: accepted (2026-10-07), branch `eco/low-carbon`

## Context
New owner criterion: the app itself must have the lowest possible carbon footprint (ecodesign). The option of moving to Astro was raised. v7 baseline, measured on the production build at first load, scored with the official CNUMR EcoIndex algorithm:

| | DOM | Requests | Weight | EcoIndex | GHG / visit |
|---|---|---|---|---|---|
| v7 (React 19, Google Fonts, 3 tabs mounted) | 654 | 9 | ≈ 196 kB | **31 — E** | 0.28 g |
| v7-eco (this ADR) | 88 | 4 | 59.5 kB | **77 — B** | 0.26 g |

Weight before the change: React + app 92 kB gz, 5 Google Fonts woff2 files ≈ 97 kB (third-party), CSS 4.4 kB.

## Decision
Stay on **Vite**. Replace React with **Preact** through `@preact/preset-vite`, which aliases `react` to `preact/compat`, so the code is unchanged. Also:
1. Tabs are mounted on first visit only (`visites`), then kept mounted to preserve answers.
2. Annexes (hypotheses, sources, "how to read") are rendered only when opened (`Repli`). Anchors `#src-n` open and scroll to the target.
3. Fonts: **one** self-hosted Bricolage Grotesque file (variable wght 600–800, Latin subset, 22 kB, SIL OFL) for display only. Body text uses the system font. No third-party requests remain (also better for privacy and GDPR).
4. The "?" help icon is a CSS mask instead of inline SVG (0 DOM nodes).

## Why not Astro
- The product is **one** page that is interactive end to end: each slider recomputes verdict, bars and chart. Astro islands would ship the same component JS (Preact) for almost the whole page, so the JS gain is about 0.
- What Astro would bring here: static HTML for the annexes and the transport page. Those are now rendered only on demand, which captures most of that DOM gain for free.
- The cost would be a second framework, a rewrite of the entry and i18n routing, and more build tooling, for a gain of about 0.01 gCO₂e per visit in EcoIndex terms.
- **Revisit Astro** if the site grows content pages (articles, a per-country FAQ, `/fr` and `/en` routes for SEO). It becomes the right tool once content outweighs the interactive tool. Meanwhile, `@preact/preset-vite` offers `prerender` should SEO need static HTML.

## Not done here (superseded by ADR 0004, which reaches A with a single-page build)
Grade A (≥ 80) would need ≈ 50 DOM nodes and 2 requests:
- Inline the CSS (−1 request).
- Drop the display font (−22 kB, −1 request, but it is part of the visual identity).
- Ship only the active language (≈ −8 kB gz, but +1 request for EN).
- Subset the font to the glyphs actually used (needs fontTools).

## Consequences
React-specific APIs must stay within what `preact/compat` supports. Measure again after any UI change: `npm run build && npm run preview`, then count DOM / requests / weight at first load.
