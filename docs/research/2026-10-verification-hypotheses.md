# Verification of hypotheses H1–H13 and data — October 2026

Method: three independent fact-checks against primary sources (ICCT 2021 and 2025 PDFs, ADEME Base Carbone API, Ember / OWID, Electricity Maps *Grid in Review 2025*, RTE, ICCT/Fraunhofer, Crossref, Nature Communications), carried out on 2026-10-07. Verdicts: ✅ confirmed · ≈ acceptable approximation · ❌ wrong, corrected in v6.1.

## Hypotheses

| # | Claim (v6) | Verdict | Finding | Action v6.1 |
|---|---|---|---|---|
| H1 | Life = min(200 000 km; 18 yrs); "ICCT 243 000 km" | ≈ | Scrappage age BE 18.5, FR 19.8 yrs. ICCT 2025: **20 yrs / 240 000 km** (243 000 is ICCT 2021). <1 % battery replacements (Recurrent). | Text updated |
| H2 | Economic allocation "recognised by ISO 14044"; 15 %/yr | ≈ | §4.3.4.2 step 3, written for co-products; applying it to successive owners is a transposition. Real depreciation is faster in years 1–3 (≈ 41–50 % residual value at 3 yrs). | Wording made precise; 12/10: limit stated (H2 vs H3 do not join up; 1 yr of a 1-yr-old car = 13.9 % in the model, ≈ 20 % with 25 %/yr for 3 yrs then 15 %, residual 42 % at 3 yrs; reverses beyond ~5 yrs); 13/10: range H2 – remaining share shown, see `2026-10-allocation-occasion.md` and ADR 0012 |
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

## Second check, 12/10/2026

Prompted by an external study of Belgium's five best-selling cars (BE grid 180 g/kWh, break-even 26,000–36,000 km against petrol, 43,000 km against a Yaris hybrid). Three reviews: Questions page (data scientist), sources for A1/A5–A7, sources for A8–A14. **Read** = seen in the source; *deduced* = our calculation.

| A | Finding | Decision |
|---|---|---|
| A1 | **Read** Febelauto 2025: scrappage age 18.7 years (BE); SDES 2026: 20.0 years (FR, 2025) | Figures updated, sources [22], [23] added |
| A5 | **Read** BE: Ember 149.8 g (2025); Electricity Maps 153.2 g (2024), 181.7 g (2025); ULiège (Attia 2026, not peer-reviewed) 131.4 g. RTE: 19.6 g direct, 29 g life cycle (2025) | BE kept at 150 g; range and RTE life-cycle value stated in A5 |
| A6 | *Deduced*: BE intensity rose ~19 % in 2025 (reactor closures) | A6 states −3 %/yr is a long-term average |
| A7 | **Read** Base Carbone: E10 2.69 (id 13988), B7 3.10 (id 25775); 2.79 / 3.16 are archived lines (2016). DESNZ 2025 petrol average blend ≈ 2.65 WtW | Unchanged; archived values named |
| A8 | **Read** ICCT 2025 tab. 2 (GREET): NMC622 EU 60, China 80; LFP China 69, EU 52; EU average 72.8 | LFP 65 → **69**; « NMC · Asie » → « NMC · Chine » |
| A9 | **Read** ICCT 2021 tab. A.1: 5.2 t/t, includes a partial recycling credit | Ref [14] added; « no recycling credit » now reads « for the battery » |
| A10 | **Read** ICCT 2025 tab. 4: compact BEV 20.2 kWh/100 km at the plug, losses included; model gave 19.25 | EV consumption **+5 %** (compact 18.4 × 1.1 = 20.2) |
| A11 | **Read** Dornoff (ICCT 2026, ~920,000 PHEVs, OBFCM): real electric share 26 % → 17 % (2021–2023), emissions 3.5–4.6 × type approval. ICCT 2025: PHEV +0.7 t, 13.3 kWh; HEV −23 % petrol, no manufacturing surplus | Default share 50 % → **30 %**; hybrid parameters now sourced [8], source [21] added |
| A14 | **Read** ICCT 2023 tab. A2: ID.3 €0.046/km, Golf €0.054/km | 0.04 sourced via [20]; 0.07 presented as an estimate |

Effects on published figures: Belgian break-even now stated as a range, about 25,000 to 30,000 km (city car to SUV, grid 131–182 g); switch point 16,000 km/yr (was 15,500); EU intro 50 to 60 % (frozen grid / decarbonising). Questions page: ranges instead of single figures where the sensitivity is large (A1 grid, Germany and Poland frozen vs decarbonising, PHEV 0 to 2 % in fleets). The external study's 2.85 kg/L petrol factor could not be traced in DESNZ 2025.

Still open: Nowtricity (134 g), IEA STEPS tables, the 10–15 % charging-loss range, TNO's real-world EV gap series.

## Maintenance cost of an older combustion car (A14), 12/10/2026

No study publishes a €/km maintenance cost by vehicle age; ADAC itself says its new-car flat rates are only a rough approximation for a 10-year-old car. **Read**: CCFA 2025 (from INSEE national accounts), household spending on « entretien, réparation, pièces détachées et accessoires » €41.4 bn in 2024; SDES Bilan annuel des transports 2024, French-registered cars drove 440 bn km in mainland France. *Deduced*: ≈ €0.094/km for the average car (fleet age 11.8 years), about €0.09–0.11/km once company cars (maintenance not paid by households) are set aside, accessories and two-wheelers being in the other direction. DAT-Report 2025 (GfK, 2,062 owners): 1.03 services per car a year at €389, i.e. ≈ €0.03/km for servicing alone (repairs by age only in the paid full report). ICCT 2023: new ID.3 €0.046/km, new Golf €0.054/km (≈ 15 % less for the EV at equal age).

Decision: keep 0.07 (older combustion car) and 0.04 (new EV); A14 now says 0.07 is below the French average and that the gap shown mostly reflects age. Sources [24] CCFA, [25] SDES added.

## Correction, 12/10/2026: what the 17–26 % PHEV figure means

Dornoff (ICCT 2026, table 1, p. 7) is explicit: the fleet-average EDS of 26 %, 21 %, 17 % (2021–2023) « does not reflect the share of distance a PHEV is actually driven on electricity »; it is the electric share that makes type-approval CO₂ equal real-world CO₂. The real share of distance in charge-depleting mode is 46 % (2021) to 42 % (2023), but the engine often runs in that mode. The model's `phevShare` is an emission-equivalent electric share, so the 30 % default stands; the texts (H11, Questions Q5, GLOSSARY) said « real electric driving » and now say « emissions equivalent to 17–26 % electric driving ». Found during the ICCT reliability review (LCA, data-science and carbon-accounting agents): ICCT judged reliable for orders of magnitude (reviewed by JRC, Ricardo, Joanneum; inputs public; figures match COM(2024) 122 and Peiseler 2024), funded mainly by climate foundations, no published uncertainty ranges.
