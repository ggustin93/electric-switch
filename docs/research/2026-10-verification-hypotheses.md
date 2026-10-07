# Verification of hypotheses H1–H13 and data — October 2026

Method: three independent fact-checks against primary sources (ICCT 2021 and 2025 PDFs, ADEME Base Carbone API, Ember / OWID, Electricity Maps *Grid in Review 2025*, RTE, ICCT/Fraunhofer, Crossref, Nature Communications), carried out on 2026-10-07. Verdicts: ✅ confirmed · ≈ acceptable approximation · ❌ wrong, corrected in v6.1.

## Hypotheses

| # | Claim (v6) | Verdict | Finding | Action v6.1 |
|---|---|---|---|---|
| H1 | Life = min(200 000 km; 18 yrs); "ICCT 243 000 km" | ≈ | Scrappage age BE 18.5, FR 19.8 yrs. ICCT 2025: **20 yrs / 240 000 km** (243 000 is ICCT 2021). <1 % battery replacements (Recurrent). | Text updated |
| H2 | Economic allocation "recognised by ISO 14044"; 15 %/yr | ≈ | §4.3.4.2 step 3, written for co-products; applying it to successive owners is a transposition. Real depreciation is faster in years 1–3 (≈ 41–50 % residual value at 3 yrs). | Wording made precise |
| H3 | Plevin, Delucchi & Creutzig 2014 | ✅ | J. Ind. Ecol. 18(1):73–83, doi:10.1111/jiec.12074 | Full title |
| H4 | Next owner ≈ 12 000 km/yr, falling with age | ✅ | DE 12 000 (KBA), FR 11 700 (SDES 2023), BE ≈ 12 650 | — |
| H5 | LCA consumption-based grid intensities | ≈ | All 14 countries within ±20 % (table below). FR 50 g = ADEME 51.9 g (2024); the "≈ 30 g" was attributed to RTE by mistake (RTE: 19.6 g direct). | DE 380→340, EU 230→210, SE 40→30; text and source notes fixed |
| H6 | Rates "from NECPs / IEA STEPS" | ≈ | Those documents publish RE shares, not g/kWh paths. UK too slow given Clean Power 2030; US optimistic after the 2025 IRA rollback. | UK 4→5 %, US 3→2 %; called a "sensitivity parameter" |
| H7 | E10 2.71, B7 3.10 kgCO₂e/L | ≈ / ✅ | ADEME Base Carbone: **E10 2.69** (2.19 + 0.502 upstream), **B7 3.10** | `EF_ESSENCE = 2.69` |
| H8 | Battery 50–80 kg/kWh; LFP China 50 | ❌ partly | GREET 2024 (ICCT 2025): LFP 52 (EU)–69 (CN), NMC 60–80, **EU sales-weighted average 72.8**. China LFP ≈ 62–69. | LFP China 65; new default "EU average 73" |
| H9 | EV glider +5 % (attributed to Ricardo/ICCT) | ❌ attribution | Ricardo/ICCT: BEV without battery 6.5 t vs ICE 7.2 t, i.e. **−10 %**. ICE production ≈ 5.2 t per vehicle tonne; the model was about 15 % low, and SUV < saloon was inconsistent. | +5 % kept as a stated cautious choice; `fabBase = 5.2 × mass`; diesel = petrol; PHEV +0.7 t |
| H10 | WLTP gap 15–20 %; real consumption | ≈ | OBFCM: petrol +20–24 %, diesel +18 %, BEV +25 %. Real-world petrol, medium segment = **6.9 L** (model: 6.3). | Petrol/diesel consumptions raised (compact 6.9 / 5.8) |
| H11 | PHEV 50 % private / 15 % fleet | ≈ | **45–49 % / 11–15 %** (Plötz et al. 2022); real-world emissions 3.5× type approval (EC 2024) | Text updated, sources added |
| H12 | Tyres < 2 % CO₂; regen braking | ≈ | ICCT: all maintenance ≈ 4 g/km; the extra tyre wear is a fraction of that | Text made precise |
| H13 | ICCT "−73 %" | ✅ | **ICCT 2025**: BEV 63 vs petrol 235 g/km (−73 %); ICCT 2021: −66 to −69 % | Model v6.1 now gives EU −59 %, FR −70 %; the gap is explained |

## Grids (gCO₂e/kWh, consumption basis)

| | v6 | Found (EM 2024/25 · Ember 2024/25) | v6.1 |
|---|---|---|---|
| NO | 30 | 33 / 30 · 30 / 28 | 30 |
| SE | 40 | 22 / 21 · 35 / 35 | **30** |
| FR | 50 | ADEME 51.9 · EM 33 / 32 · Ember 41 | 50 (ADEME basis, stated) |
| ES | 140 | 124 / 132 · 146 / 154 | 140 |
| BE | 150 | 153 / 182 · 127 / 150 | 150 |
| UK | 210 | 175 / 176 · 217 / 217 | 210 (rate 5 %) |
| EU | 230 | Ember EU27 211 / 210 | **210** |
| IT | 300 | 268 / 286 · 281 / 285 | 300 |
| DE | 380 | 335 / 335 · 336 / 330 | **340** |
| US | 380 | Ember 384 / 384 | 380 (rate 2 %) |
| AU | 530 | 554 / 525 | 530 |
| CN | 560 | 560 / 525 | 560 |
| PL | 620 | EM 702 / 677 · Ember 608 / 589 | 620 |
| IN | 700 | 705 / 670 | 700 |

## Wrong or invented sources (corrected)

- [1] Carbone 4 is **2022**, *Les idées reçues sur le **véhicule** électrique* (not 2025, not "voiture").
- [7] **No** Kallitsis, Korre & Kelsall 2024 paper exists in *Nature Communications*. The correct citation is Peiseler et al. (2024), *Carbon footprint distributions of lithium-ion batteries and their materials*, Nat. Commun. 15:10301.
- [8] The title "Life-cycle GHG emissions of passenger cars in Europe" does not exist. It is split into Negri & Bieker (ICCT 2025) [8] and Bieker (ICCT 2021) [14].
- Added: Plötz et al. 2022 [15], EC COM(2024) 122 [16]. Ricardo [12] now names its authors (Hill et al.).

## Not verified (open)
EEA intensity dataset and the IEA WEO 2025 STEPS tables (rates); 15 %/yr depreciation against primary residual-value data; PHEV +6 % / +12 % per-mode penalties; 10 % charging losses (literature range 10–15 %).

## Key URLs
- ICCT 2025: https://theicct.org/wp-content/uploads/2025/07/ID-392-–-Life-cycle-GHG_report_final.pdf
- ICCT 2021: https://theicct.org/wp-content/uploads/2021/07/Global-Vehicle-LCA-White-Paper-A4-revised-v2.pdf
- ADEME Base Carbone API: https://data.ademe.fr/data-fair/api/v1/datasets/base-carboner/lines?q=E10
- Electricity Maps: https://www.electricitymaps.com/grid-in-review-2025/
- Ember via OWID: https://ourworldindata.org/grapher/carbon-intensity-electricity
- Carbone 4: https://www.carbone4.com/files/359_publication_faq_vehicule_electrique.pdf
- Peiseler 2024: https://doi.org/10.1038/s41467-024-54634-y
- Plötz 2022: https://theicct.org/wp-content/uploads/2022/06/real-world-phev-use-jun22-1.pdf
- EC OBFCM 2024: https://climate.ec.europa.eu/document/download/b644dafe-1385-4b56-98d9-21e7e9f3601b_en
