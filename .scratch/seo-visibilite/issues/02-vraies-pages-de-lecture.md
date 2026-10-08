# 02: Real reading pages

**What to build:** « Méthode », « Écoconception » and « Mentions légales » become **real indexable pages** in each language (e.g. `/fr/methode/`), pre-rendered, each with its own title, description, canonical and hreflang. Header and footer links point to them. An old `#methode` link leads to the new page, and hypothesis anchors (`/fr/methode/#h5`) keep working.

**Blocked by:** 01

**Status:** ready-for-agent

- [ ] `/fr/methode/`, `/fr/ecoconception/` and `/fr/mentions/` exist in all 5 languages and return their content without JavaScript
- [ ] Own title, description and canonical on each page; hreflang between the language versions
- [ ] `/fr/#methode` (old link) leads to `/fr/methode/`; `/fr/methode/#h5` scrolls to H5
- [ ] The verdict, the help bubbles and « Retour au simulateur » keep working
- [ ] EcoIndex A on each page (measured); tests pass; CONTEXT.md and ADR (routes) updated
