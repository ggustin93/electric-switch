# 0011 — Energy prices refreshed weekly at build time, never at runtime

Status: accepted (2026-10-09).

## Context
The budget card (« Et côté budget ? ») uses default energy prices per country. They were hand-entered (`PRIX_ENERGIE` in `src/model.js`) and went stale: pump prices move weekly, Eurostat publishes household electricity every semester. Fetching live prices from the page would add third-party requests and break EcoIndex A (ADR 0004).

## Decision
- The table lives in **`src/prix.json`** (per country: `essence`, `diesel`, `elec`, plus `carbDate` and `elecPeriode`, the dates of the data). `src/model.js` re-exports it as `PRIX_ENERGIE`.
- **`scripts/prix.mjs`**, run every Thursday by **`.github/workflows/prix.yml`**, updates it from two free, reusable EU sources:
  - fuel: the EC **Weekly Oil Bulletin** xlsx (Monday prices with taxes, €/1000 L, stable download link), read with `unzip` and a regex (no dependency);
  - electricity: **Eurostat `nrg_pc_204`** (band 2,500–4,999 kWh, all taxes, €/kWh), the latest semester published *per country*, so periods may differ between countries (shown in the note).
- If a price changed, the workflow commits `src/prix.json` and starts `deploy.yml` (a push with `GITHUB_TOKEN` does not trigger other workflows). Otherwise nothing happens.
- A failing source, a changed format or an implausible value (fuel outside 0.80–4 €/L, electricity outside 0.05–1 €/kWh) **keeps the previous prices** of that source; the job never breaks the site.
- Non-EU countries (UK, US, AU, CN, IN, Norway fuel) stay hand-entered (`carbDate`/`elecPeriode` null; the note then says « source nationale »).
- The budget note shows the data date of the chosen country; the visitor can still type their own prices.

## Trade-offs
- Eurostat is an average of all contracts (fixed, variable, social tariff), not today's offer, with a 4–6 month lag. Good enough for an order of magnitude; the editable field covers the rest.
- The Oil Bulletin link is a document ID, not an API: if the Commission changes it, prices freeze silently (warning in the job log). Check the « Prix » workflow log if the fuel date stops moving.
- National real-time sources (France, Spain, Italy) exist but would mean one parser per country; rejected for now. Belgium publishes maximum prices only as PDF.
