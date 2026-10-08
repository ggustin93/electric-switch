# 07: Security, 404 page and visual polish

**What to build:** The site **protects its visitors and stays comfortable to use on mobile**:
- security headers (HSTS, nosniff, Referrer-Policy, Permissions-Policy, CSP compatible with the single-page build);
- a real 404 page in the site's style, in 5 languages;
- touch areas of at least 44 px (« ? » help buttons, stepper numbers, language links) and more readable inactive steps.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] Security headers present on each response (checked with curl / securityheaders.com), with no regression in the page
- [ ] Unknown URL → styled 404 page with a link back to the simulator, `noindex`
- [ ] « ? », stepper and language-link touch areas ≥ 44 px; WCAG AA contrast on the inactive steps
- [ ] EcoIndex A kept; tests pass
