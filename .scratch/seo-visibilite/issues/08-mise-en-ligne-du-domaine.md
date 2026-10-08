# 08: Domain go-live

**What to build:** The site is online at **electricornot.eu**, and the other addresses redirect to it with no loss of ranking:
- buying the domains (owner);
- custom domain on Cloudflare;
- permanent 301 redirects from electricornot.be (and workers.dev);
- registration with Google Search Console and Bing Webmaster Tools, sitemap submitted, IndexNow enabled.

**Blocked by:** 01, 04

**Status:** ready-for-human

- [ ] **Owner:** purchase of electricornot.eu and electricornot.be (+ electriqueoupas.be optional)
- [ ] electricornot.eu serves the site over HTTPS; site variable switched; canonicals and sitemap point to .eu
- [ ] electricornot.be and the workers.dev address 301-redirect to the equivalent .eu page
- [ ] Search Console + Bing Webmaster verified, sitemap submitted, IndexNow active
- [ ] Legal notice (host) and ADR 0005 updated if the host changes

## Comments

### 2026-10-08 — prepared in the code (no change to the live site while the variables are empty)
- `SITE_URL` and `INDEXNOW_KEY` are read from **GitHub repository variables** in the CI (`.github/workflows/deploy.yml`). Empty = current workers.dev address.
- With `INDEXNOW_KEY` set, the build serves `/<key>.txt`. After each deploy, `scripts/indexnow.mjs` sends the sitemap URLs to IndexNow. It never fails the deploy (`src/indexnow.js`, tested).

### Owner checklist (only you can do these steps)
1. **Buy** `electricornot.eu` and `electricornot.be` (+ `electriqueoupas.be` optional).
   - Check whether Cloudflare Registrar sells `.eu` / `.be`; otherwise use a European registrar (Infomaniak, OVHcloud, Gandi…).
2. **Add both domains to Cloudflare** (Free plan, « Add a domain »), then set the **nameservers** given by Cloudflare at the registrar. Wait for « Active ».
3. On the `electricornot.eu` zone, turn off **managed robots.txt / AI Crawl Control** if it is on, so our `robots.txt` (ticket 04) is the one served.
4. **Tell me once both zones are Active.** I will:
   - add the custom domain to `wrangler.jsonc` (`"routes": [{ "pattern": "electricornot.eu", "custom_domain": true }]`) and redeploy (HTTPS is automatic);
   - set the GitHub variables `SITE_URL=https://electricornot.eu` and `INDEXNOW_KEY` (generated), so canonicals, hreflang, sitemap, robots, JSON-LD and OG all switch to `.eu`;
   - set `"workers_dev": false` once `.eu` responds, so the workers.dev address is no longer served (Cloudflare can't 301 a workers.dev host without a Worker script; the address was not promoted).
5. **Redirect `electricornot.be` → `.eu` (301)**, `electricornot.be` zone:
   - DNS: proxied `A @ 192.0.2.1` and `A www 192.0.2.1` records (placeholder IP, normal for a redirect-only zone);
   - Rules → Redirect Rules → new rule: hostname in {`electricornot.be`, `www.electricornot.be`} → **Dynamic**, `concat("https://electricornot.eu", http.request.uri.path)`, **301**, keep the query string.
   - I can do this via the API if you give a token with « Zone → Single Redirect » rights; otherwise it takes 2 minutes in the dashboard.
6. **Google Search Console:** « Domain » property `electricornot.eu` (DNS verification, automatic with Cloudflare), then submit `https://electricornot.eu/sitemap.xml`.
7. **Bing Webmaster Tools:** « Import from Google Search Console » (fast), then check the sitemap.
