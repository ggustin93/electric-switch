# 04: Sitemap, robots and structured data

**What to build:** Search engines and AIs find **all pages and understand what the site is**:
- `sitemap.xml` (home pages + reading pages, with language variants) and `robots.txt` (search and AI-search engines allowed, sitemap listed) are generated at build;
- each page carries a compact JSON-LD block: free web application and the publisher Pwablo / Productions Associées ASBL on the home page, technical article on the Méthode page.

**Blocked by:** 02

**Status:** ready-for-agent

- [ ] `/sitemap.xml` lists the 21 URLs with their hreflang alternatives (absolute URLs taken from the site variable)
- [ ] `/robots.txt` replaces Cloudflare's managed file: explicit policy for search and AI bots, `Sitemap:` line
- [ ] One JSON-LD block per page; the Rich Results Test and validator.schema.org pass without errors
- [ ] No FAQPage/HowTo; `sameAs` only with real profiles (pwablo.be, others confirmed by the owner)
- [ ] Optional: `llms.txt` summarising the model and linking the Méthode pages
