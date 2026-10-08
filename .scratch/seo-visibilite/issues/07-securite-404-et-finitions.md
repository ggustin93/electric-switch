# 07: Security, 404 page and visual polish

**What to build:** The site **protects its visitors and stays comfortable to use on mobile**:
- security headers (HSTS, nosniff, Referrer-Policy, Permissions-Policy, CSP compatible with the single-page build);
- a real 404 page in the site's style, in 5 languages;
- touch areas of at least 44 px (« ? » help buttons, stepper numbers, language links) and more readable inactive steps.

**Blocked by:** None (can start immediately)

**Status:** resolved

- [x] Security headers present on each response (checked with curl / securityheaders.com), with no regression in the page
- [x] Unknown URL → styled 404 page with a link back to the simulator, `noindex`
- [x] « ? », stepper and language-link touch areas ≥ 44 px; WCAG AA contrast on the inactive steps
- [x] EcoIndex A kept; tests pass

## Comments

- 2026-10-08: `dist/_headers` gets HSTS, nosniff, Referrer-Policy, Permissions-Policy and a hash-based CSP (no `'unsafe-inline'`; `src/entetes.js`, tested), checked with `curl -I` and `wrangler dev`: no CSP violation on /fr/ (Ma décision, Comparer, Se déplacer autrement, #methode). `dist/404.html` (1.4 kB, no JS, 5 languages, `noindex`) is served with status 404 via `not_found_handling`. Touch targets 44 × 44 px measured with `elementFromPoint`; inactive steps 6.4:1 (light) / 8.2:1 (dark). EcoIndex unchanged: DOM 92, 1 request, 53.0 kB → 80.3 (A).
- If pre-rendering adds `style="…"` attributes, the build now fails on purpose: move them to classes, or add `'unsafe-hashes'` with their hashes in `src/entetes.js`.
