# 0001 — Economic allocation of manufacturing, marginal convention for new purchases

Status: accepted (v5, kept in v6)

## Context
A used car's manufacturing emissions must be split between owners. Up to v4 the split was a km pro-rata plus an ad hoc 90 % coefficient.

## Decision
- Owners share manufacturing by the **value consumed** during their ownership, with 15 %/yr depreciation (ISO 14044 economic allocation). `partFab(ageStart, ageEnd, ageDeath)` normalises by the total value consumed over the vehicle's real life, so the shares sum to 1.
- In the **Decision** tab, buying a **new** EV carries 100 % of manufacturing (consequential / marginal reading, Plevin 2014). The current car's manufacturing is sunk.

## Consequences
The share decreases smoothly with age at purchase, with no thresholds. The Decision tab is deliberately an upper bound for new EVs; the Comparison and Head-to-head tabs use economic allocation for everyone.
