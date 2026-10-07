# Context — glossary

Domain terms used in code (French identifiers) and UI. Use these words; avoid the listed synonyms.

| Term (code) | Meaning | Avoid |
|---|---|---|
| **ACV** / life-cycle | Manufacturing + use emissions, in tCO₂e. End-of-life recycling credit is excluded. | "carbon cost" |
| **Fabrication** (`fabTotale`, `fabAttr`) | Manufacturing footprint: the glider (`fabBase`, ×1.05 for EVs) plus the battery (`battKwh × ef`). `fabAttr` is the share attributed to the user. | "embodied" (ok in prose) |
| **Usage** (`usage`, g/km) | Well-to-wheel fuel, or grid electricity × consumption × 1.1 charging losses. | |
| **Allocation économique** (`partFab`) | Manufacturing shared between successive owners by the value each consumes, with 15 %/yr depreciation (H2). | "km pro-rata" (retired in v5) |
| **Convention marginale** | A new purchase carries 100 % of manufacturing. Used only in the Decision tab (H3). | |
| **Fenêtre de détention** (`fenetre`) | The user's ownership window: km driven, age at start and end, and the next owner's km. | |
| **Repreneur** | The next owner after resale, assumed to drive 12 000 km/yr (H4). | "buyer" |
| **Horizon** (`decider().horizon`) | Years compared in the Decision tab: the user's estimate, capped by the EV's remaining life (200 000 km / 18 yrs). | |
| **Mix moyen** (`mixMoyen`) | Mean grid intensity over the period under a country-specific geometric decline (H6). | "geometric mean" |
| **Kilomètre pivot** (`kmPivot`) | Km at which the EV's cumulative emissions drop below petrol's. `null` means never, `0` means from the start. | "break-even" (ok in EN UI) |
| **Serré / tie** (`departager`, `SEUIL_SERRE`) | Gap under 10 % between two footprints. One rule for all tabs. | "match serré" |
| **Segment / Catégorie** | Vehicle class (citadine … grand SUV). Code says *segment*, UI says *catégorie*. | "gabarit" (retired) |
| **Hypothèse Hn / Assumption An** | Numbered assumption. Same index in both languages, prefix differs. | |
