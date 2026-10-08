# 01: Page headers and pre-rendering

**What to build:** Each language page arrives **already filled**: H1, intro and step 1 are readable without JavaScript, and Preact takes over in the browser with no visible jump. Each page also carries in its `<head>` its canonical URL and absolute hreflang links (5 languages + x-default). These are built from a single site-URL variable: workers.dev today, electricornot.eu tomorrow.

**Blocked by:** None (can start immediately)

**Status:** resolved

- [x] `curl /fr/` (and /en/ /nl/ /it/ /es/) returns the H1 and the intro text
- [x] Preact takes over without re-rendering everything: CLS stays at 0, and step-1 interactions work
- [x] Each page has `<link rel="canonical">` and absolute hreflang links matching the HTTP Link header
- [x] The site URL comes from one variable; switching domains does not touch the code
- [x] EcoIndex A on each language page (measured); tests pass

## Comments
- Pre-render at build (`prerendu` plugin, `runnerImport` + `preact-render-to-string`), `hydrate` in `main.jsx`; hash route and guessed country applied in a `useLayoutEffect` after hydration. CLS 0 measured (fr, en); step 1, « Étape suivante », tabs and `#methode` checked in the browser. ADR 0008.
- `SITE_URL` (`src/seo.js`, tested) → canonical tag + absolute hreflang in `dist/_headers` and the root page.
- Trade-off: hreflang stays in the HTTP `Link` header, not in the `<head>`: canonical only gives DOM 93, 54–55 kB → 80.1 (A); +6 hreflang tags → 79.5 (B). Ticket 04's sitemap will carry hreflang too.
