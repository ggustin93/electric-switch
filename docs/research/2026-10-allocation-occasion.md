# Used cars: how much manufacturing should a buyer carry? (research, 2026-10-12)

Prompted by the owner: a new EV counted 100 % of its manufacturing (H3), a one-year-old used EV 14 % (H2) for the same year of use. Is a continuous rule ("100 % new, ≈ 90 % at one year…") more correct?
Six agents reviewed it: an LCA expert, a carbon-accounting expert and a data scientist, then three independent checks against primary sources. Decision: [ADR 0012](../adr/0012-occasion-fourchette.md).

## 1. Where the jump comes from
- H3 (new purchase, marginal) gives no credit at resale. H2 (used, economic allocation) does, implicitly. Mixing the two readings makes the jump; it is not an error inside H2.
- With a resale credit, "take on the remaining value at purchase, hand it back at resale" nets to exactly H2. The two rules differ only on that credit.

## 2. Options compared
Share of a compact EV's manufacturing (12 000 km/yr, H1 life ≈ 15 years by value). Computed with `src/model.js`.

| Used EV | Kept | (a) H2 | (b) remaining (value) | (c) H2, realistic depreciation* | (d) smoothed hybrid** |
|---|---|---|---|---|---|
| 0 yr | 1 yr | 16 % | 100 % | 26 % | 100 % |
| 1 yr | 1 yr | 14 % | 84 % | 20 % | 87 % |
| 1 yr | 3 yr | 35 % | 84 % | 41 % | 90 % |
| 3 yr | 3 yr | 25 % | 59 % | 17 % | 71 % |
| 6 yr | 3 yr | 16 % | 33 % | 10 % | 47 % |
| 10 yr | to the end | 14 % | 14 % | 9 % | 31 % |

\* ≈ 25 %/yr for 3 years, then 15 %; residual value 42 % at 3 years, inside the 41–50 % of `2026-10-verification-hypotheses.md` (H2).
\** H2 + (1 − H2) × 0.85^age. Ad hoc, no source.

Remaining share by odometer, as implemented: `partRestante(odo, age) = max(0, min(1 − odo / 200 000, 1 − age / 18))`. 27 000 km at 1 year → 86.5 %; 72 000 km at 6 years → 64 %.

## 3. Primary sources
**Standards and LCA literature**
- ILCD Handbook (JRC 2010, EUR 24708), § 5.3.4 p. 38: Situation A, "decision support… to inform the purchase of products… the product can be assumed to be produced only as consequence of the decision… i.e. in addition". This supports counting a **new** purchase at 100 % (H3).
- ILCD provision VI.b.ii.3 (§ 7.9.3 p. 270–271): in attributional modelling, reuse impacts are shared "across the many uses including the initial production"; market value only second, and only if "justified".
- PEF Recommendation (EU) 2021/2279, Annex I, § 4.4.9.2: manufacturing divided by the total number of uses ("600 grams per bottle / 10 reuses"), so the shares sum to 100 %. The CFF "A" factor (§ 4.4.8.2, 0.2–0.8) is for recycled material, not an intact used product.
- ISO 14044 § 4.3.4.2 hierarchy (avoid allocation, then physical relation, then other relations such as economic value): **not read in the paid standard**, from a secondary summary only (NCASI).
- Plevin, Delucchi & Creutzig 2014, J. Ind. Ecol. 18(1):73–83, doi:10.1111/jiec.12074: abstract only (full text refused). Attributional LCA "is not predictive of real-world impacts"; about biofuel policy, not vehicles or used purchases.
- Zink & Geyer 2017, J. Ind. Ecol. 21(3):593–602, doi:10.1111/jiec.12545 (abstract): circular activities "can increase overall production", so reuse does not displace new production one for one.
- No standard or peer-reviewed paper found that sets an allocation rule between successive car owners.

**Carbon-accounting frameworks**
- Bilan Carbone, annex 1, « Immobilisations » (bilancarbone-methode.com): a good bought partly amortised (refurbished IT, reuse…) counts "les émissions amorties que sur la durée restante d'amortissement du bien"; if the previous use is unknown, "estimations conservatrices (i.e des durées de précédente utilisation relativement faible)". Amortisation runs over the use period within the organisation (example: a fleet renewed every 3 years), not the physical life. No default duration for vehicles found.
- GHG Protocol, Scope 3 Calculation Guidance, category 2, box 2.1 p. 36: "companies should not depreciate, discount, or amortize the emissions from the production of capital goods over time". Nothing on used goods.
- Nos Gestes Climat, `data/empreinte/transport/voiture.publicodes` (commit b257972, 2026-10-06): amortisation = 1 / lifetime in km, **230 000 km and 19 years** (not 200 000 / 18); no notion of a used car.
- ADEME 2022, refurbished devices (§ 2.2 p. 23–25): reference approach by substitution, "aucune charge n'est attribuée au produit reconditionné par rapport à sa première vie"; alternative approach: a remaining charge if refurbished before the end of the first theoretical life.

**Market evidence (does a used purchase avoid a new one?)**
- Leard, JAERE 9(1), 2022, doi:10.1086/715814: long-run price elasticity of total new-car demand −0.34.
- Jacobsen & van Benthem, AER 105(3), 2015, doi:10.1257/aer.20130935: scrappage elasticity −0.7 to used-car prices; the market adjusts largely by keeping old cars longer.
- No study found that measures how many new purchases a recent used purchase triggers or avoids.

**Life and battery (supports H1)**
- Nguyen-Tien et al., Nature Energy 10:354 (2025), doi:10.1038/s41560-024-01698-1: UK EVs live 18.4 years (petrol 18.7), ≈ 200 000 km.
- Geotab (22 700 EVs, Jan 2026): 2.3 %/yr capacity loss on average. Recurrent via US DOE (FOTW 1339): 1.5 % battery replacements outside recalls (2011–2023 models). No reason to treat the battery apart.

## 4. Simulation: remaining share as the Decision default
Compact, Belgium, petrol 6.9 L, EU battery, decarbonising grid; 8 000 / 12 000 / 20 000 km/yr × horizons 1 / 3 / 6 years × used EV 1 / 3 / 6 years old.
- **20 of 27 verdicts change**, 17 to « garder » and 3 to « serré », none to « remplacer ».
- The used-EV suggestion (6 years) disappears for the low-mileage profile. Questions Q4 would go from 22 % to 64 % (4.3 t → 9.0 t).
- Summed over owners changing every 3 years, remaining shares count one car ≈ 3.3 times.

## 5. Conclusion
- The real effect of buying used lies **between H2 (low, sums to 100 %) and the remaining share (high, sums to more than 100 %)**. No data settles it.
- H2 stays the Decision default; the note shows both figures. The "counted at purchase" convention of « Comparer » applies the remaining share to used cars, consistent with H3.
- Wording rules learnt: say "inspired by" Nos Gestes Climat, never "follows"; Bilan Carbone's "conservative" means a short previous use, the opposite of taking `min(…)`; ISO 14044 is cited from a summary until read.

## Not verified
ISO 14044 text; Plevin 2014 full text; Allacker et al. 2017 (Int J LCA 22:1441) beyond the reference; the 15 %/yr depreciation itself; the Belgian 18.5-year scrappage age (Febelauto via press gives 17.6).
