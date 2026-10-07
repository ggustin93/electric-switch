# Spec — Clarify the modes on arrival (v7)

Status: resolved (v7, 2026-10-07). Remaining: the "your current car" line on the cumulative chart (P1), and measuring the "two cars" usage (P2).
Source: UX/UI expert review, 2026-10-07 (based on Impeccable onboard/critique heuristics), plus an owner request (transport-modes page).

## Problem
- On arrival the lede promises "four questions, a verdict" (the Decision path only), yet three unexplained tabs are shown. "Comparateur" and "Duel" name features, not tasks.
- **Duel ⊂ Comparateur:** its only unique value is crossing categories, a rare case. It still carries its own settings card and a second km slider.
- **Decision vs Comparateur:** both ask for country, km, category and new/used. The Comparateur asks again instead of reusing the answers, and the verdict's link to it doesn't pre-fill anything.
- **Silent shared state:** changing km in Duel changes the Decision verdict without any signal.
- **Diverging conventions:** a new EV carries 100 % of manufacturing in Decision (H3) but economic allocation with resale at 8 years elsewhere. This contradicts PRODUCT.md principle 3, and the same car shows different figures across tabs.

## Target (expert recommendation)
One main path plus exploration, so the job-to-be-done "decide for MY car" comes first.

| Rank | FR | EN | Content |
|---|---|---|---|
| 1 (default) | Ma décision | My decision | 4-step wizard + richer verdict |
| 2 | Explorer | Explore | segmented switch "Toutes les motorisations / Deux voitures" (absorbs Comparateur + Duel) |
| 3 | Se déplacer autrement | Other ways to get around | **owner request**: informational page comparing transport modes per passenger-km (ADEME Impact CO₂ + European sources) |

- A shared **profile bar** ("Belgique · 12 000 km/an · Modifier") on every tab. Country, km, category and new/used are lifted into `App` and never asked twice.
- The **richer verdict** adds the decisive factor (the km/yr threshold where the verdict flips, found by sweeping `decider()`), a live "what if I drove…" km slider, and CTAs "All powertrains for my profile →" and "Compare two specific cars →".
- **Lede:** « Une électrique réduirait-elle l'empreinte carbone de vos trajets, ou l'augmenterait-elle ? Quatre questions, un verdict chiffré en moins d'une minute. » Sources move to a "Méthode et sources" footer.
- **Under step 1:** « Pas de voiture à remplacer ? Comparez toutes les motorisations → »
- **Convention:** one visible rule. Explore gets an advanced setting "Achat neuf : 100 % de la fabrication / partagée entre propriétaires", defaulting to the Decision rule, with a note under the bars. *Needs the model-side decision.*

## Ordered changes
- P0: rename tabs and rewrite lede and CTA (S) · lift segId/etatVE/ageVE into App (M) · profile bar (S) · verdict CTA pre-fills Explore (S)
- P1: Duel becomes an Explore view (M) · decisive factor + "what if" slider (M) · align the new-purchase convention (M) · "your current car" line on the cumulative chart (M) · **"Other ways to get around" page (M)**
- P2: "no car to replace?" link, "Méthode et sources" fold (S) · inline "why we ask" texts instead of "?" (S) · measure usage of the "two cars" view and drop it if marginal (S)

## Open decisions (owner)
1. Accept the 2 tabs + info page structure?
2. New-purchase convention in Explore: 100 % by default (aligned with Decision) or economic allocation?
3. Tie threshold 10 % vs ±20 % uncertainty (carried over from v6).
