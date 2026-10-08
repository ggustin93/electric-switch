# 0007 — Odometer in « Ma décision »: one ownership window everywhere

Status: accepted (2026-10-08), after a data-science review and a UX review.

## Context
In « Ma décision », a used EV was described by its age only. `decider()` attributed manufacturing with `partFab(age, age + horizon, VIE_ANS)`, so the end of life was fixed at 18 years, and its horizon ignored the odometer. « Comparer les voitures » already used `fenetre()`: odometer, the 200 000 km cap, and the next owner's km. Two rules for the same question broke the product principle « une même règle partout ».

## Findings (data scientist)
- **Allocation share:** the odometer barely changes it (±0.05). We did not add a mileage term to the 15 %/yr value curve: that would be false precision against ±20 %.
- **Remaining life:** this is where the odometer matters. Example: an EV bought at 6 years with 150 000 km has only 50 000 km left, about 4.2 years and not 8.
  - The old model credited it with usage savings it could not deliver: R/G was up to 0.15 too favourable, close to the tie band on coal-heavy grids.
  - It is the same class of bug as ADR 0002 item 1.

## Decision
- **Model:** `decider()` takes `odoVE` (default `ageVE × 12 000 km`, H4) and reuses `fenetre()` with resale for the used case:
  - horizon = min(years, (200 000 − odometer) / km per year, 18 − age);
  - the share is `fenetre(…).ratioFab`;
  - the used-EV suggestion (6 years) uses the same window with 72 000 km.
- **UI:**
  - A « Kilométrage au compteur » field appears under « Âge à l'achat » when « D'occasion » is chosen (the same component as in « Comparer »).
  - It is estimated at age × 12 000 km and follows the age until the person types the listing's value. The state is shared with « Comparer » (`null` = estimated).
  - The note now says the share depends on age and mileage, in plain words (5 languages).
- **Tests:**
  - `decider().partVE` equals `fenetre().ratioFab`;
  - with 150 000 km on the odometer, the horizon is ≈ 4.2 years;
  - a higher odometer never lengthens the horizon;
  - the default odometer is age × 12 000 km;
  - a new car is unchanged.

## Consequences
High-mileage used EVs get a shorter, more honest comparison period. No verdict flipped in the reviewed samples.
