# 01: Page headers and pre-rendering

**What to build:** Each language page arrives **already filled**: H1, intro and step 1 are readable without JavaScript, and Preact takes over in the browser with no visible jump. Each page also carries in its `<head>` its canonical URL and absolute hreflang links (5 languages + x-default). These are built from a single site-URL variable: workers.dev today, electricornot.eu tomorrow.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] `curl /fr/` (and /en/ /nl/ /it/ /es/) returns the H1 and the intro text
- [ ] Preact takes over without re-rendering everything: CLS stays at 0, and step-1 interactions work
- [ ] Each page has `<link rel="canonical">` and absolute hreflang links matching the HTTP Link header
- [ ] The site URL comes from one variable; switching domains does not touch the code
- [ ] EcoIndex A on each language page (measured); tests pass
