# 0005 — Hosting: Cloudflare Workers static assets (Cloudflare, Inc.)

Status: accepted (2026-10-08). Revisit if a European host becomes a product commitment.

## Context
ADR 0004 left hosting open. The app is one self-contained `index.html` of about 58 kB, with no server code, no personal data and no cookies. The owner asked whether a European Cloudflare entity could be named as host in the « Mentions légales ».

## Decision
- Host on **Cloudflare Workers static assets** (`wrangler.jsonc`, `assets.directory: ./dist`), deployed by GitHub Actions on every push to `main` once `npm test` passes.
- The legal host is **Cloudflare, Inc.**, 101 Townsend Street, San Francisco, CA 94107, USA. Self-serve customers in the EU contract with Cloudflare, Inc., and Cloudflare's DPA names that entity. There is no European Cloudflare entity to cite.
- EU-only processing (Data Localization Suite: Regional Services and Customer Metadata Boundary) is an **Enterprise add-on**. We don't use it: on the free plan, Belgian visitors are in practice served from European data centres, but nothing guarantees it.

## Why this is acceptable
- No personal data is processed. Cloudflare only sees visitors' IP addresses in its edge logs. The optional audience events go to Umami Cloud (EU), not to Cloudflare.
- 304/ETag revalidation and Brotli are on by default, which matches ADR 0004's trade-off and ECO-HEB-02.

## Trade-offs and exit
- Not aligned with a "hosted in Europe" message, nor with ECO-HEB-01: Cloudflare doesn't publish energy data per customer.
- Leaving is cheap: one static file, and only the deploy step changes. EU candidates to compare before moving: Bunny.net (SI), Scaleway or OVHcloud (FR), statichost.eu, Codeberg Pages (DE). If we move, update the « Mentions légales » host block (`mentions` in `src/i18n.jsx`) and this ADR.

Sources: [Cloudflare DPA](https://www.cloudflare.com/dpa), [Cloudflare customer agreements](https://www.cloudflare.com/legal/terms/), [Data Localization Suite](https://blog.cloudflare.com/introducing-the-cloudflare-data-localization-suite/).
