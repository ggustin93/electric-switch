# Context — glossary

Domain terms used in code (French identifiers) and UI. Use these words; avoid the listed synonyms.

| Term (code) | Meaning | Avoid |
|---|---|---|
| **ACV** / life-cycle | Manufacturing + use emissions, in tCO₂e. End-of-life recycling credit is excluded. | "carbon cost" |
| **Fabrication** (`fabTotale`, `fabAttr`) | Manufacturing footprint: the glider (`fabBase`, ×1.05 for EVs) plus the battery (`battKwh × ef`). `fabAttr` is the share attributed to the user. | "embodied" (ok in prose) |
| **Usage** (`usage`, g/km) | Well-to-wheel fuel, or grid electricity × consumption × 1.1 charging losses. | |
| **Allocation économique** (`partFab`) | Manufacturing shared between successive owners by the value each consumes, with 15 %/yr depreciation (H2). | "km pro-rata" (retired in v5) |
| **Convention marginale** | A new purchase carries 100 % of manufacturing (H3). The default everywhere since v7. | |
| **Fenêtre de détention** (`fenetre`) | The user's ownership window: km driven, age at start and end, and the next owner's km. | |
| **Repreneur** | The next owner after resale, assumed to drive 12 000 km/yr (H4). | "buyer" |
| **Horizon** (`decider().horizon`) | Years compared in the Decision tab: the user's estimate, capped by the EV's remaining life (200 000 km / 18 yrs). | |
| **Mix moyen** (`mixMoyen`) | Mean grid intensity over the period under a country-specific geometric decline (H6). | "geometric mean" |
| **Kilomètre pivot** (`kmPivot`) | Km at which the EV's cumulative emissions drop below petrol's. `null` means never, `0` means from the start. | "break-even" (ok in EN UI) |
| **Serré / tie** (`departager`, `SEUIL_SERRE`) | Gap under 10 % between two footprints. One rule for all tabs. | "match serré" |
| **Segment / Catégorie** | Vehicle class (citadine … grand SUV). Code says *segment*, UI says *catégorie*. | "gabarit" (retired) |
| **Kilométrage de bascule** (`kmBascule`) | The lowest km/yr (3 000 to 40 000) at which replacing beats keeping, shown under the verdict. | |
| **Convention marginale / partagée** (`conv`) | How a new car's manufacturing is counted in Explore: 100 % (default, like Decision) or economic allocation. | |
| **Profil** | Shared answers (country, km/yr, category, new/used, age, odometer) lifted into `App`. | |
| **Modes** (`MODES`) | Other transport modes, gCO₂e per passenger-km with construction, from ADEME Impact CO₂. Shown as one log-scale chart against the reference « voiture thermique seul·e ». | |
| **Hypothèse Hn / Assumption An** | Numbered assumption. Same index in both languages, prefix differs. | |
