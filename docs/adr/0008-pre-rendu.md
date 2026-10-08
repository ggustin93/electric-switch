# 0008 — Pre-rendered pages, canonical URL, one site-URL variable

Status: accepted (2026-10-08). Extends ADR 0004 and 0006. Hash routes replaced by real reading pages: ADR 0009. Ticket `.scratch/seo-visibilite/issues/01`.

## Context
The SEO audit (score 48/100) found the language pages empty: `<div id="root">` plus JavaScript. Google renders late; Bing, link previews and AI crawlers saw 5–6 words. The domain will move from workers.dev to `electricornot.eu`.

## Decision
1. **Build-time pre-render.** The `prerendu` plugin (`vite.config.js`, build only) loads `src/App.jsx` with Vite's `runnerImport` (same `@langue` alias, Preact JSX) and inserts `preact-render-to-string` output into `#root`. `src/main.jsx` calls `hydrate` instead of `render`. Still one self-contained HTML per language, one request.
2. **Deterministic first render.** The server has no `location` or `navigator`: `App` starts on the tool page with country « EU », then a `useLayoutEffect` applies the hash route (`#methode`…) and the guessed country (`paysProbable`) right after hydration, before the browser paints. Folded content (`Repli`, unvisited tabs) is not rendered, as on the client, so the DOM count at load is unchanged.
3. **One site-URL variable.** `SITE_URL` (default the workers.dev URL, `src/seo.js`) builds the `<link rel="canonical">` of each page, and the absolute hreflang URLs of the HTTP `Link` header (`dist/_headers`) and of the root page.
4. **hreflang stays in the HTTP header**, not in the `<head>` (ADR 0006). Measured: canonical only → DOM 93, 54–55 kB → **80.1 (A)**; canonical + 6 hreflang tags → DOM 99 → 79.5 (B). The sitemap (ticket 04) carries them too.

## Trade-offs
- Before the JS runs (a few ms on a single 55 kB response), the country select shows « Moyenne UE », and a `#methode` link shows the tool first. No layout shift (CLS 0 measured).
- Each language build renders the app once in Node: about +0.3 s per language.
- Any new browser API read during render must be deferred to an effect, or the pre-render breaks the build (no `window` in Node).
