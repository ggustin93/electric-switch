# Transport-mode footprints — research for the "Other ways to get around" page

Fetched 2026-10-07. Primary source: **ADEME Impact CO₂** API `https://impactco2.fr/api/v1/transport?km=100&displayAll=1` (`&includeConstruction=1`, `&ignoreRadiativeForcing=1` variants; values ÷ 100). Comparison: **UK DESNZ GHG conversion factors 2025** (flat file).

## ADEME Impact CO₂ — gCO₂e per passenger-km

The website shows values **with construction**; the API omits it by default. The page must use the **with construction** column to match the simulator's life-cycle car model.

| Mode | Use only | With construction | Occupancy |
|---|---|---|---|
| Walking | 0 | 0 | – |
| Bike | 0 | 0.2 | – |
| E-bike | 2.2 | 11.0 | – |
| E-scooter (stand-up) | 2.0 | 24.9 | – |
| Petrol moped / scooter | 60.4 | 76.3 | 1 |
| Electric scooter | 20.7 | 59.3 | 1 |
| Motorbike > 250 cc | 140.0 | 214.7 | 1 |
| City bus (thermal) | 113.5 | 122.4 | 10 |
| Electric bus | 9.5 | 21.7 | 10 |
| Tram | 3.8 | 4.3 | 77 % of 263 seats |
| Metro | 4.2 | 4.4 | 78 % of 824 seats |
| RER / Transilien | 6.6 | 9.8 | operator data |
| TER (regional, incl. diesel) | 22.9 | 27.7 | operator data |
| Intercités | 5.8 | 9.0 | operator data |
| TGV | 2.3 | 2.9 | operator data |
| Coach | 33.1 | 37.6 | 30 |
| Thermal car, alone | 110.6 | 142.3 | 1 (ADEME default = medium diesel) |
| Electric car, alone | 12.1 | 67.4 | 1 (French grid) |
| Thermal carpool (2) | 55.3 | 71.1 | 2 |
| Electric carpool (2) | 6.0 | 33.7 | 2 |
| Short-haul plane (incl. non-CO₂ effects) | 224.2 | 224.6 | 104 |
| Short-haul plane (CO₂ only) | 123.2 | 123.6 | 104 |

## DESNZ 2025 (UK) — direct + well-to-tank, construction excluded
National rail 44.4 · tram 36.1 · Underground 35.1 · bus 130.3 · coach 34.3 · domestic flight with RF 262.8 / without 169.0 · BEV per vehicle-km 40.5. Electric rail and tram are 7–9× ADEME's figures because of the UK grid (≈ 177 g/kWh) and diesel trains.

## Caveats the page must state
1. **Construction included** (ADEME site convention). For electric cars, e-bikes and e-scooters, construction makes up 50–90 % of the total.
2. **Average occupancy:** per passenger at average load. A near-empty bus can do worse than a full car.
3. **French grid (≈ 50 g/kWh):** electric modes are 2–8× higher in Belgium, the UK or Germany, but public transport still beats a car driven alone.
4. **Plane:** ADEME includes non-CO₂ effects (×1.8). Show both figures.
5. **Different scopes from the simulator:** ADEME's car does not equal the simulator's car (lifetime, consumption, grid). Use the simulator for cars; this page gives orders of magnitude.
6. **Belgium:** no published SNCB / STIB / De Lijn gCO₂/pkm found (UNVERIFIED).

## Licence and attribution
Data under the Etalab Open Licence (Datagir documentation; version not confirmed). Required citation:
« Source : ADEME, Impact CO₂ (impactco2.fr), données consultées le 07/10/2026 — Licence Ouverte Etalab. »
UK: © Crown copyright, DESNZ GHG Conversion Factors 2025 (OGL v3.0, standard GOV.UK, not confirmed).
The API works without a key but warns that anonymous access may be cut off (a free key is available from impactco2@ademe.fr). **The page uses static values, so no API call is made at runtime.**
