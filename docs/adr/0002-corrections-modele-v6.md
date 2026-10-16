# 0002 — v6 model corrections: horizon cap, single tie rule, H13 aligned with the model

Status: accepted (2026-10-07)

## Context
The v6 LCA review (grid of about 26k cases, no NaN or negative values) found these inconsistencies:
1. The Decision tab could count EV years and km beyond the EV's life: age 12 + 12 yrs, or 480 000 km at 40k km/yr.
2. Ties used ratio ≥ 1/0.9 in Decision but max/min − 1 < 0.1 in Duel.
3. H13 claimed "−65 to −75 % vs petrol, consistent with ICCT", but the model gives about −55 % on the EU average and about −70 % for FR/Nordics.
4. Odometer and age were independent (160 000 km at age 0).
5. `borneParAge` ignored the resale case. The "used EV ≈ 6 years" suggestion fired inside the noise band.
6. Text inconsistencies: France 50 g vs a source note of "≈ 30 g"; H10 said charging losses were included while the model adds them; H6 said "geometric mean".

## Decision
1. `horizon = min(years, 200 000 km / kmAn, 18 − ageAtPurchase)`. Both options are compared over the horizon, and the UI says when it was truncated.
2. One `departager(a, b)` with `SEUIL_SERRE = 0.1` everywhere, including the used-EV suggestion.
3. H13 now states the model's own figures and the gap to ICCT. A test pins FR at −65 to −75 % and the EU at −55 to −65 % (the model gives about −60 %).
4. Odometer capped at 30 000 km per year of age (`KM_AN_MAX_COMPTEUR`), with a UI note.
5. `borneParAge` now covers the resale case. The suggestion uses `AGE_SUGGESTION = 6` and the tie rule.
6. Texts fixed: France 50 g is the ADEME consumption value, and RTE ≈ 30 g is domestic generation only. EV consumption is battery-side plus 10 % losses. The mix is the "mean of a geometric decline".

Data were not changed (owner scope: "fix bugs + inconsistencies"). Coal-heavy grids (PL, IN, CN, US) are noted in H5 as likely 10–15 % low.

## Consequences
`src/model.test.js` encodes these invariants.
