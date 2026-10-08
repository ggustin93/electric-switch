# SEO and visibility: spec

Source: `/claude-seo:seo audit` of 2026-10-08 (9 specialists) and the domain decision (3 experts + Codex). SEO health score **48/100**.

## Problem
The product is strong but nearly invisible to search engines and AI. The scores are performance 96, visual 84, and agent accessibility 100. The pages arrive empty, though: `<div id="root">` plus JavaScript, with 5–6 readable words. Google renders late, while Bing, link previews and AI crawlers (ChatGPT, Perplexity, Claude) see nothing. The reading pages are `#` anchors and cannot be indexed.

## Decisions already taken
- **Domain:** `electricornot.eu` as the main domain, plus `electricornot.be` as a 301 redirect. Optional: `electriqueoupas.be` as a redirect to `/fr/`. All were available on 2026-10-08 (DNS Belgium / EURid registries).
- **Ecodesign:** every ticket must keep EcoIndex **A** on each language page. Measure with `scratchpad/measure.sh` or equivalent, and update the Écoconception page if the figures change.
- **One page per language**, kept as-is (ADR 0006). The site URL becomes a build variable, so the domain switch is one value to change.
- **Not to do:** FAQPage and HowTo structured data. Google has dropped these rich results.

## Out of scope (backlog)
- Shareable result links (the verdict state kept in the URL).
- Satellite articles: « Électrique d'occasion : bilan carbone », « Bilan carbone par pays », NL « Loont een EV in België? ».
- Off-site work: Belgian press (RTBF, Le Soir, VRT, De Standaard), Test-Achats/Testaankoop, r/belgium, a short video per language, a Wikidata item.

## Success indicators
- `curl` on each page returns the H1 and the intro text.
- Search Console: 20–21 pages indexed.
- First impressions on « voiture électrique ou thermique ».
- Rich Results Test and schema.org validator pass with no errors.
