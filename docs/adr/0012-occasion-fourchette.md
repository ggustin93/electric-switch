# 0012 — Used cars: H2 by default, the remaining share as a high estimate

Status: accepted (2026-10-12), after six agent reviews (LCA, carbon accounting, data science, three primary-source checks). Research: `docs/research/2026-10-allocation-occasion.md`.

## Context
In « Ma décision », a new EV carried 100 % of its manufacturing (H3, ADR 0001) and a one-year-old used EV 14 % (H2) for the same year of use. The owner proposed a continuous rule: the buyer carries all the manufacturing the car has left (100 % new, ≈ 85–90 % at one year).
- The jump comes from mixing H3 (no resale credit) with H2 (resale credit built in).
- The remaining share is continuous with H3 and shares Bilan Carbone's principle ("durée restante d'amortissement").
- But summed over owners it counts a car ≈ 3.3 times, which is not an allocation under ILCD or PEF; no study shows that a used purchase triggers new production; as the Decision default it flips 20 of 27 test verdicts towards « garder ».

## Decision
- **Model:** the remaining share, min(1 − odometer / 200 000 km, 1 − age / 18 years), is described in H2 and H3 as the high estimate. Since 2026-10-13 it is no longer computed (see the « Ma décision » point).
- **« Ma décision »:** H2 for used EVs, one figure in the note under the odometer. Amended 2026-10-13 after three scientific reviews: a used purchase triggering a new one is improbable (77 % of purchases are used cars, the market adjusts mostly by keeping old cars longer, no measured substitution), so the card no longer shows the high estimate or a « Voir ce calcul » link for used EVs (it appeared in 39 % of used cases and its « up to 75 % » exceeds 100 % over owners). The range stays in H2 and H3; one line under « remplacer » says the current car is assumed scrapped.
- **« Comparer » / Duel** (amended 2026-10-13, one logic everywhere): the marginal convention is renamed « Comptée à l'achat »; it counts 100 % for a new car and H2 for a used one, as in « Ma décision » and as in production before this ADR. A first version applied the remaining share there (51 % → 94 % for a one-year-old car kept 5 years), which made the two tabs disagree; it was reverted before release. « Partagée entre propriétaires » applies H2 to new cars too. The convention note always shows; the resale note shows for used cars and with the shared convention.
- **Méthode:** H2 states the range as its limitation; H3 describes the remaining share and says it exceeds 100 % over owners.

## Consequences
- Decision verdicts, the used-EV suggestion and Questions answers are unchanged (`reponses.test.js` untouched).
- Used cars are counted the same way (H2) in every tab; the remaining share is only shown as a high estimate.
- The jump between new and used remains in « Ma décision », but it is now shown and bounded instead of hidden.
- Revisit if a study measures the substitution between used and new purchases.
