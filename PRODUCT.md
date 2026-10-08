# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

General public, speaking French, English, Dutch, Italian or Spanish, who own a petrol or diesel car and wonder whether switching to electric lowers their carbon footprint. Non-experts: they want a defensible answer in about a minute, then optionally dig into the numbers.

## Product Purpose

An educational simulator, "Dois-je passer à l'électrique ? / Should I switch to electric?". It compares the life-cycle (manufacturing + use) emissions of keeping the current car against switching to an electric one, new or used. It also compares all powertrains, and any two specific cars. Success means the user leaves with a clear verdict, the main driver behind it (usually annual mileage and the grid), and trust in how it was computed.

## Positioning

A personal decision rather than a generic "EV vs petrol" average. The car you already own is sunk carbon; the purchase is marginal; used cars carry an economic-allocation share of manufacturing. Every assumption is numbered (H1–H14 / A1–A14) and sourced.

## Operating Context

Single page, three tabs (v7):
1. **My decision**: a 4-step wizard, then the verdict, the decisive mileage threshold and a live "what if" slider.
2. **Compare cars** (« Comparer les voitures », code: `Explorer`): a « Comparer » switch at the top picks « Toutes les motorisations » (default; every powertrain in the profile's category, stated under the bars) or the advanced « Face-à-face » (Duel). Pre-filled from a shared profile (country, km/yr, category, new/used) that is never asked twice. In the duel, each used car has its own age and odometer. The ownership period is shared by both views. The plug-in hybrid electric share sits outside the folds; in the duel it sits in the column of each plug-in hybrid, with its own value.
3. **Other ways to get around**: an informational page with footprints per passenger-km for walking through to the plane (ADEME Impact CO₂, construction included).

## Capabilities and Constraints

- **Ecodesign is a product requirement:** the lowest feasible footprint for the app itself. EcoIndex is measured on every UI change (ADR 0003); currently **A 80**: 1 request, 92 elements, 54.6–55.6 kB per language page (80.2, pre-rendered HTML + canonical link; at the ceiling: measure before adding elements at load), no third party (ADR 0004, 0006). An in-app « Écoconception de ce site » section (footer link) states the measured figures and limits; update it after each measurement.
- **Audience measurement:** Umami Cloud (EU), events only (verdict, tab, reading page), no cookie, nothing at load, DNT/GPC respected. Visits without interaction are not counted. Search Console deferred until a custom domain.
- **Charging country pre-filled** locally (time zone, then language region, else EU average); nothing is sent, and it can be changed at step 1.
- **Five languages: FR, EN, NL, IT, ES**, one self-contained page each (`/fr/`…, ADR 0006). The root `/` redirects to the remembered language, else the browser's, else English. NL/IT/ES are machine-drafted: **native review recommended** before announcing them, especially the hypotheses and the legal notice.
- 14 grids, 5 segments, 5 powertrains, 4 battery footprints. The model lives in `src/model.js`, has no UI text, and is covered by `npm test`.
- Results are orders of magnitude with about ±20 % uncertainty. The verdict calls a tie under a 10 % gap (kept deliberately, because both options share most of the uncertainty).
- **Budget (second reading of the verdict):** shows the **running cost** only (energy + maintenance per year, and energy per 100 km): it's the informative, least uncertain part, and everyone already knows a new car costs money. The purchase price is **not estimated** (purchase-side data would be Belgian everywhere else): one computed sentence says how many years of savings a price gap represents (« chaque tranche de 1 100 € d'écart = un an d'économies ») and invites comparing with a real quote. Promise adjusted to « ce qu'elle changerait à votre budget au quotidien ». Decision validated by a UX expert and a consumer advisor (October 2026). Reviewed by a data scientist, a TCO expert, and UX / climate-communication / consumer-advice experts (October 2026).
- One visible convention: a new car carries 100 % of its manufacturing everywhere by default (H3). "Shared between owners" is an advanced option.
- **Publisher and credit:** published by Productions Associées ASBL / Pwablo (Guillaume Gustin). The « Mentions légales » page (`#mentions`) reuses pwablo.be/terms, and the footer reads « Conçu et développé par Pwablo ». Don't invent legal data. The phone number is omitted because pwablo.be shows two different ones.
- **Hosting:** Cloudflare Workers, legally Cloudflare, Inc. (USA); EU-only processing would need Enterprise (ADR 0005). Moving to a European host is an open option.
- Open decision: brand and custom domain are **undecided** (production is on `workers.dev`).

## Brand Commitments

None yet (brand undecided).

## Evidence on Hand

Sources [1]–[20] are listed in-app on the « Méthode » page (Carbone 4, RTE, SDES, Ember, Electricity Maps, ADEME, ICCT, IPCC AR5, ISO 14044, Eurostat and others), each checked against its primary source (`docs/research/`). There are no testimonials, user counts or endorsements, and none should be invented.

## Product Principles

1. Answer first, method one click away: verdict and figures before assumptions.
2. Never overstate. Claims must be reproducible by the model; when the model disagrees with a source, say so.
3. Same rule everywhere: one tie threshold and one allocation method across tabs.
4. Plain words over jargon. Technical terms are explained where they appear.

## Accessibility & Inclusion

WCAG 2.2 AA: real radio groups and labels, keyboard tabs, 44 px targets, contrast-checked tokens in light and dark, reduced motion respected, charts with text equivalents.
