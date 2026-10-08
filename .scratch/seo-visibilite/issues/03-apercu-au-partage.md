# 03: Link preview when shared

**What to build:** A link pasted into WhatsApp, LinkedIn, Slack or Mastodon shows **a title, a sentence and an image** in the page's language. Each language has its own preview image (1200×630), light and readable, in the visual identity (Bricolage title, green accent).

**Blocked by:** 01

**Status:** ready-for-agent

- [ ] `og:title`, `og:description`, `og:image`, `og:url`, `og:locale` and `twitter:card` on each page
- [ ] One 1200×630 image per language, light (target < 60 KB), separate from the page (it does not weigh on the first load)
- [ ] Preview checked with a share debugger (LinkedIn Post Inspector or similar)
- [ ] EcoIndex A kept (the image is not loaded by the page)
