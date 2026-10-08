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
| **Convention marginale / partagée** (`conv`) | How a new car's manufacturing is counted in « Comparer les voitures » (`Explorer` in code): 100 % (default, like Decision) or economic allocation. | |
| **Profil** | Shared answers (country, km/yr, category, new/used, age, odometer) lifted into `App`. | |
| **Duel** (UI « Deux voitures au choix ») | The second view of « Comparer les voitures »: two cars A and B, each with its own category, powertrain, new/used and, when used, its own age and odometer (`calcConfig`). Each is sold on at the end of the ownership period. | "head-to-head" (ok in EN prose) |
| **Durée de détention** (`detention`) | Years the user keeps the car before resale. Lifted into `App` and shared by both views of « Comparer les voitures ». | |
| **Part électrique PHEV** (`phevShare`) | Share of a plug-in hybrid's km driven on electricity (0–100 %, default 50 %). Set in « Toutes les motorisations » (outside the folds). In the duel each plug-in hybrid has its own value, in its column, starting from that one (`cfg.phevShare`). | "utility factor" (ok in method prose) |
| **Modes** (`MODES`) | Other transport modes, gCO₂e per passenger-km with construction, from ADEME Impact CO₂. Shown as one log-scale chart against the reference « voiture thermique seul·e ». | |
| **Hypothèse Hn / Assumption An** | Numbered assumption (H1–H14). Same index in both languages, prefix differs. | |
| **Page de lecture** (`route.page`) | Hash route inside the single file: `#methode`, `#ecoconception`, `#mentions`. The tool stays mounted but hidden. | "subpage" |
