# 04: Sitemap, robots and structured data

**What to build:** Search engines and AIs find **all pages and understand what the site is**:
- `sitemap.xml` (home pages + reading pages, with language variants) and `robots.txt` (search and AI-search engines allowed, sitemap listed) are generated at build;
- each page carries a compact JSON-LD block: free web application and the publisher Pwablo / Productions Associées ASBL on the home page, technical article on the Méthode page.

**Blocked by:** 02

**Status:** resolved

- [x] `/sitemap.xml` lists the 21 URLs with their hreflang alternatives (absolute URLs taken from the site variable)
- [x] `/robots.txt` replaces Cloudflare's managed file: explicit policy for search and AI bots, `Sitemap:` line
- [x] One JSON-LD block per page; the Rich Results Test and validator.schema.org pass without errors
- [x] No FAQPage/HowTo; `sameAs` only with real profiles (pwablo.be, others confirmed by the owner)
- [x] Optional: `llms.txt` summarising the model and linking the Méthode pages

## Comments
- 2026-10-08 (agent): built by `build.mjs` from `src/donnees.js` (tested): `dist/sitemap.xml` (21 URLs + hreflang, commit-date `lastmod`), `dist/robots.txt`, `dist/llms.txt`; one JSON-LD `@graph` per page via the `entete-langue` plugin. EcoIndex A kept everywhere by dropping the `.page` wrapper (`#root.page`): tool 93 el. / 55 kB → 80.1, Méthode 92 / 58 kB → 80.1. Note in ADR 0009.
- Owner to do: turn off Cloudflare *Managed robots.txt* if enabled (it prepends its own rules to `dist/robots.txt`); run the Rich Results Test and validator.schema.org on the deployed URLs. The Software App rich result needs `aggregateRating`/`review`, which we do not have: it stays ineligible (not a markup error).
