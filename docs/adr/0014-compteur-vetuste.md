# 0014 — Odometer and wear: equivalent age for the used-car share (H2)

Status: accepted (2026-10-13), after a bug report by the owner. Revises the ADR 0007 finding that "the odometer barely changes the allocation share".

## Context
H2 depreciates value with age only. A high odometer shortens the remaining life (`ageMort`), and the normalisation then spreads the value over fewer years. A 2-year-old used EV with 174 000 km therefore got a **higher** share than with 24 000 km (41 % against 21 %): the more a car has been driven, the more manufacturing it carried. The owner suggested a "wear score" combining age and mileage.

## Decision
- `fenetre()` starts the H2 depreciation from an equivalent age, `ageEq = max(age, odometer / 12 000 km)` (`KM_AN_PARC`, H4), and keeps the real age and the 200 000 km cap for the horizon and the remaining life (H1).
- With the default odometer (age × 12 000 km) or a lower one, nothing changes: Questions, default verdicts and the production comparison are unchanged (0 of 29 400 default verdicts differ).
- Same 2-year-old car: 24 000 km → 21 %, 100 000 km → 8 %, 174 000 km → 3 %.
- Texts: the odometer help and H2 say that a high odometer ages the car like 12 000 km per year.

## Consequences
- High-mileage used EVs carry less manufacturing and are more often worth buying, which matches their lower value.
- New cars and the shared convention for new cars are unchanged (age 0, odometer 0).
- Mileage per year beyond 12 000 km during your own ownership still ages the car by years only; revisit if this matters.
