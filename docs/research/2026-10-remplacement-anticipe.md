# Early replacement: how much of the new car's manufacturing should "replace now" carry? (research, 2026-10-13)

Prompted by the owner and a data scientist: `decider` charges 100 % of a new EV's manufacturing (H3) against keeping the petrol car for its remaining life h. But the person would buy a car after h years anyway, so replacing now only brings that purchase forward. Over a long window the extra manufacturing is ≈ manufacturing × h / L. With h / L, a new compact (Belgium, 12 000 km/yr) flips from « garder » to « remplacer » from h ≈ 2 years (owner's computation, not rechecked here).

## 1. Kagawa et al. 2013 (Japan, Eco-car scrappage)
- Global Environmental Change 23(6):1807–1818, doi:10.1016/j.gloenvcha.2013.07.023. **Abstract only** (full text 403; abstract via AGRIS FAO record 65df40ad0f3e94b9e5d691df).
- Abstract: the method accounts for "the rebound effect, driving behavior for older versus new cars and entire lifecycle emissions for during the manufacturing processes of new cars". "CO2 emissions would only decrease if users of the scheme retained their new gasoline passenger vehicles for at least 4.7 years."
- So 4.7 years is a minimum holding time for the **new** car, not the remaining life of the scrapped one. It suggests the new car's manufacturing is charged up front and paid back by use. How it is counted, the counterfactual and the horizon could not be read.

## 2. Kim et al. 2003; Spitzley et al. 2005 (life cycle optimisation)
- Kim, Keoleian, Grande & Bean, Environ. Sci. Technol. 37(23):5407–5413, doi:10.1021/es0345221 (abstract via OpenAlex). Dynamic optimisation over a fixed window (1985–2020) that "determines optimal vehicle lifetimes". It minimises **cumulative** burdens, with material production and manufacturing among the inputs. "A lifetime of 18 yr minimizes cumulative energy and CO2" at 12 000 mi/yr.
- Spitzley, Grande, Keoleian & Kim, Transp. Res. D 10(2):161–175, doi:10.1016/j.trd.2004.12.003. Optimal replacement intervals "over a 36-year period" (secondary summary only).
- In this approach every vehicle in a chain of replacements is counted in full, inside a fixed window. Replacing earlier therefore adds manufacturing only as more replacements in that window. Over many cycles this comes to roughly the h / L logic, not "one extra car". End-of-window handling: not read.

## 3. Scrappage and keep-vs-replace LCAs
- **Lenski, Keoleian & Bolon 2010**, Environ. Res. Lett. 5:044003, doi:10.1088/1748-9326/5/4/044003 (open access, read in full).
  - § 1, p. 2: the programme "moved forward in time the production of new vehicles".
  - § 2.2.3, p. 4: within a fixed window measured in miles (fig. 2), without the programme the consumer "would have only been responsible for the production and disposal of vehicle 1, and a portion of the production and disposal of vehicle 2BAU (we allocate production and disposal impacts by VMT)".
  - Eq. (3), p. 4: extra emissions = p2CARS + d2CARS − (x1/x2)(p2BAU + d2BAU). Here x1 is the miles at early retirement and x2 the expected life. With p2CARS = p2BAU (assumed, § 2.3.4, p. 5), this equals **p × (x2 − x1)/x2, i.e. manufacturing × h / L**.
  - § 2.2.3: these are "not simply inevitable emissions shifted in time … the consumer … would always be responsible for the production of a partial additional vehicle".
  - Counterfactual, § 2.3.2, p. 5: purchases "flow through" the fleet, so the next car would have been new anyway. Remaining life 2.52 years (survey, table 4 note, p. 7).
  - Result (abstract): +0.8 Mt from early manufacturing, against −4.4 Mt net. Charging 100 % would have meant 9.76 t × 677 081 ≈ 6.6 Mt (our arithmetic).
- **Schaubroeck et al. 2020**, Int. J. LCA 25(8):1500–1521, doi:10.1007/s11367-020-01758-0. Abstract only, via springerprofessional.de.
  - Consequential framework for replacing petrol with electric: "For a fixed time span of usage (functional unit)". "Only activities occurring after the decision should be considered".
  - "A ratio for the amount of newly car produced per purchase is introduced."
  - Petrol car scrapped, EV resold: replacing "at any time lowers the impact on climate change".
- **Woody et al. 2024**, Environ. Res.: Energy 1:033002, doi:10.1088/2753-3751/ad63aa (open access).
  - § 3.1, p. 4: "A scrappage policy aims to induce drivers to pull forward their next vehicle purchase."
  - § 2.1, p. 2: purchases under Cash for Clunkers (CfC) were "pulled forward by less than a year".
- **Campbell & Geyer 2026**, Science 393(6811):591–595, doi:10.1126/science.adv5441. Abstract (Crossref): "scrappage-and-replacement yields consistent emissions reductions across most contexts, including the retirement of new ICE vehicles". The UCSC release gives a ≈ 16-year baseline. How manufacturing is counted: not read.
- **Van Wee, Moll & Dirks 2000**, Transp. Res. D 5(2):137–143, doi:10.1016/S1361-9209(99)00030-9. Abstract (IAOR): "reducing the age of the current car fleet may result in an increase of life-cycle CO2 emissions". This is a fleet-level framing, so manufacturing is effectively annualised.
- **Montoya-Torres et al. 2023**, J. Clean. Prod. 423:138661, doi:10.1016/j.jclepro.2023.138661 (abstract). Optimal replacement of a petrol car by an EV "after 8.88 years". Method not read.
- **Gastaldi & Cibrario 2026**, Transp. Eng. 24:100445, doi:10.1016/j.treng.2026.100445 (abstract). Keep-vs-replace tool with "a novel attribution method for sharing production and disposal impacts". Not read.

## 4. Guides and organisations
- **ILCD Handbook** (JRC 2010).
  - § 5.3.4, p. 39: Situation A means the product is "produced only as consequence of the decision… i.e. in addition".
  - § 5.3.2, p. 37: direct foreground changes "are to be modelled as explicit scenarios".
  - A full-text search for "premature", "brought forward" and "existing product" finds nothing on timing. ILCD does not say whether a purchase brought forward counts as additional.
- **ICCT 2021** (Global LCA white paper) and **ICCT 2025** (ID-392): a full-text search finds no keep-vs-replace analysis. Both assess new cars over their whole life.
- **ADEME, avis voitures électriques (Oct. 2022)**: nothing on keeping vs replacing. It supports used EVs ("allongeant la durée de vie du véhicule", p. 2) and retrofit (p. 8).
- **ADEME, Étude Rétrofit (synthèse, 2021)**, librairie.ademe.fr/…/4590-etude-retrofit.html. Three scenarios after 10 years of a diesel: keep, retrofit, or "mise à la casse suivi d'un achat d'un véhicule électrique neuf", over ten years (p. 7). This counts 100 % of the new EV, and ADEME says so itself (p. 8): "arrêter l'analyse à l'année 20 pénalise le scénario de mise à la casse et d'achat d'un véhicule électrique… L'amortissement des émissions de GES de sa fabrication sur ses dernières années n'est donc pas comptabilisé."
- **Carbone 4 FAQ (Feb. 2022)**: nothing on keeping your car. It frames an EV "mis en circulation aujourd'hui à la place d'un hybride léger" (p. 3 of PDF), i.e. a purchase that happens anyway.
- ADEME page "faut-il changer sa voiture": not found.

## 5. Synthesis and recommendation
- **Four conventions are in use:**
  - (a) 100 % within the window: ADEME retrofit, and likely Kagawa. ADEME says this is biased against replacement.
  - (b) Use-share of the next car's manufacturing that the window covers, giving extra = manufacturing × h / L: Lenski, explicit.
  - (c) Chained optimisation over a long window: Kim, Spitzley.
  - (d) Fleet annualisation: Van Wee.
- (b) and (c) assume the person replaces the car at its end of life anyway ("flow through"). (a) amounts to assuming no next car.
- **Recommendation for « Décision »:**
  - The objection holds for the question "now or at the end of its life?". Use Lenski eq. (3) as the default: manufacturing × h / L_EV, with h being the old car's remaining life.
  - Keep 100 % as an upper bound, shown in the note. This is the same pattern as H2 and the remaining share in ADR 0012.
  - H3 stays valid for "which car to buy when I must buy one".
  - Hypothesis to display: « Votre voiture actuelle aurait de toute façon été remplacée dans h ans par une électrique comparable : remplacer maintenant avance cette fabrication de h ans, on en compte h / L. Si vous n'auriez plus racheté de voiture, comptez 100 %. »
  - Also state that the old car must be scrapped. If it is resold and still driven, the avoided use is lost (Woody § 3.1, p. 4).
- **Limits of h / L:**
  - It assumes the later car is the same EV with the same manufacturing footprint. A later EV probably has a lower one, which would push the share above h / L. A thermal next car brings in Lenski's Effect 2.
  - The long-run reading rests on a window of x1 + x2 (Lenski fig. 2).

## 6. Public guidance and carbon amortisation (added 2026-10-13)
Question from the owner: what do ADEME, Carbone 4 and the ICCT say about keeping or replacing a working petrol car, and what is "amortissement carbone"? Bilan Carbone, GHG Protocol and the base Nos Gestes Climat rule are in `2026-10-allocation-occasion.md` § 3 and are not repeated here.

### 6.1 ADEME
- **Agir pour la transition (particuliers)**: no keep-vs-replace page. The site returns 403 to scripts. Read through the Wayback Machine: the URL listing (CDX, `agirpourlatransition.ademe.fr/particuliers/*`) contains no page on changing or keeping one's car.
  - « Comment choisir une voiture ou un deux-roues moins polluant ? » (23 March 2023, `/particuliers/conso/conso-responsable/comment-choisir-voiture-deux-roues-moins-polluant`, snapshot 2025-10-15): about labels, fuels, hybrids and EVs. It does not mention manufacturing, or keeping the current car.
  - « Prime à la conversion » (`/particuliers/finances/aides-deplacements/prime-a-conversion`, snapshot 2025-09-08): eligibility only. Nothing on keeping a car or on manufacturing.
  - The infographic « 10 gestes pour économiser l'énergie lors de ses déplacements » (librairie.ademe.fr/ged/7442): "Entretenir régulièrement son véhicule". Nothing on replacement.
- **ADEME Infos, « Regards croisés : voiture électrique, gare à la "solution miracle" »** (Oct. 2024, read via Wayback): B.-O. Ducreux (ADEME) says "C'est la fabrication de la batterie qui est responsable de près de 50 % de cette empreinte carbone… privilégier de petites voitures". Nothing on when to replace.
- **« Le véhicule le plus écologique est celui qu'on a déjà »**: not found in any ADEME source. It turns up only on third-party sites (fiches-auto.fr). A close variant, "celui qu'on n'achète pas", comes from a CAA-Québec podcast, not from ADEME. **Do not attribute it to ADEME.**
- **Nos Gestes Climat** (ADEME / incubateur-ademe, repo commit b6c5755, 2026-10-12):
  - `data/empreinte/transport/voiture.publicodes`, rule `transport . voiture . amortissement`: "l'amortissement du véhicule est fonction du nombre de km parcourus, au regard du nombre de km maximal correspondant au gabarit du véhicule". Formula: `1 / durée de vie en km`, 230 000 km (19 years × ~12 000 km).
  - Why: an earlier non-linear amortisation over 10 years was meant "décourager l'achat neuf". It was dropped partly because the tool also suggests an EV, "fortement pénalisant s'il est acheté neuf dans l'empreinte carbone individuelle".
  - `transport . voiture . construction`, note: "nous ne considérons pas l'amortissement complet d'une voiture… sa contruction ne sera jamais nulle". An old car still carries its construction share per km.
  - Action « Opter pour une voiture électrique » (`data/actions/mobilités/mobilités.publicodes`): formula `transport . voiture - recalcul`, i.e. this year's footprint minus the same footprint recomputed with an EV. Note: "L'action peut-être négative si le véhicule initial est relativement vieux et que l'on fait peu de kilomètres."
  - Our reading of the formula: both sides carry construction per km. So over h years the action charges (C_EV − C_thermal) × h / L, not C_EV × h / L. It treats the switch as a change of steady state, not as extra manufacturing against a sunk old car. It never mentions timing or bringing a purchase forward.
- **Impact CO₂** (ADEME, repo commit 83976ce, 2026-10-12): `src/utils/publicodes/extractVoitureValues.ts` imports the Nos Gestes Climat model and takes `transport . voiture . construction au kilomètre`. So it uses the same per-km amortisation. It has no keep-vs-replace tool.
- **CGDD (French ministry, not ADEME), Théma Essentiel « Prime à la conversion des véhicules : bilan… pour 2021 »** (Sept. 2022, ecologie.gouv.fr PDF):
  - p. 1: the measure brings forward replacements and "engendre néanmoins un surcoût lié à l'anticipation du remplacement du véhicule". p. 3: "anticipation d'un an en moyenne".
  - The bring-forward is costed **in euros** (≈ 1 260 € per user, with the dearer car). CO₂ is −160 000 t for 2021, from gCO₂/km.
  - A full-text search finds no "fabrication" or production emissions. The 4-page summary does not count manufacturing at all. The method Théma (2020, ref. [2]) was not read.

### 6.2 Carbone 4
- **FAQ VE (Feb. 2022)**: nothing on keeping a car. A full-text search for garder, remplac, casse, prime and neuf finds nothing (§ 4 above).
- **« Les idées reçues sur la voiture électrique »** (carbone4.com/fr/articles/analyse-faq-voiture-electrique, June 2025), Q1: "nous avons retenu une durée de vie de 12 ans pour les véhicules, conformément aux standards de comptabilité carbone en entreprise. En réalité, un véhicule circule plutôt une vingtaine d'années". Q2: "tout véhicule électrique mis en circulation aujourd'hui à la place d'un véhicule thermique permet de fait de réduire les émissions… sur sa durée de vie".
  - This is a new-vs-new comparison: each car carries 100 % of its manufacturing over its own life. It does not address scrapping a car that still runs.
  - Q12 points to retrofit and the used market as ways to go electric "sans la barrière de l'achat d'un véhicule neuf".
- **MyCO2**: the method itself was not found. The Jan. 2022 article « Empreinte carbone française moyenne, comment est-elle calculée ? » is top-down (national accounts) and says nothing on amortisation.
  - The ABC referential (below) states that MyCO2 uses "une durée de vie de 16 ans" from a CGDD study. That is a secondary statement, not MyCO2's own documentation.
- **ABC / ADEME referential « Empreinte Carbone Personnelle »** (empreinte-carbone-personnelle.com, by the ABC working group "soutenu par l'ADEME"):
  - Car page, Règle: manufacturing, distribution and end of life "doivent être amorties sur la durée de vie du véhicule et réparties entre le nombre de passagers moyen".
  - Biens d'équipement page: amortisation "est toutefois complexe, sujette à interprétation et tournée vers le passé (i.e. des émissions du passé sont attribuées à l'année n…)".
  - Nothing on early replacement. The construction (housing) page mentions, as future work, a "projection d'empreinte future au moment d'un choix de vie comme un déménagement".

### 6.3 ICCT
- **Bieker & Mock, "Green vehicle replacement programs as a response to the COVID-19 crisis"**, ICCT briefing, 31 May 2020 (theicct.org/wp-content/uploads/2021/06/Vehicle-replacement-programs-COVID-Jun2020.pdf). Read in full. **This is h / L, stated explicitly.**
  - p. 7: "Considering that the programs pull forward vehicle replacements that would otherwise happen later, the additional production and avoided usage GHG emissions both account with an amount proportional to the time they were shifted."
  - p. 8 (Umweltprämie 2009): cars scrapped at 14.3 years against a usual 15, so "replaced only one year early. Accordingly, the production GHG emissions are only attributed with the proportion of one year over a vehicle lifetime of 15 years" (6 t → ≈ 2 g CO₂e/km). The net effect falls from −3 % to 0 % once the counterfactual replacement a year later is counted.
  - p. 13, fn. 64; p. 14 (2020 hypothetical, Germany): 2005 cars "would likely be replaced within the next three years regardless", over an 18-year life. BEV manufacturing 8–10 t gives "proportionate GHG emission of the earlier production… 6 g CO₂e/km" (our check: 9 t × 3/18 ÷ 252 000 km ≈ 6 g/km). Result: −62 % against replacement 3 years later by an average 2020 car.
  - Fn. 64 also says that assuming the later car equals a 2020 average is "considered conservative". This is the same limit as § 5 (a cleaner later car).
- **Shaikh, "Canadian Passenger Vehicle Scrappage Policy Analysis"**, prepared for the ICCT, Oct. 2020 (theicct.org/wp-content/uploads/2021/06/Canada-PV-scrappage-oct2020.pdf). Printed p. 15: "a pro-rated CO2 output from the early production of the vehicle; 10 years earlier than otherwise". This uses a 25-year lifespan and 10 years of remaining life, giving +2.2 t for EV/PHEV over 10 years. Footnote xiv takes manufacturing data from Bieker & Mock. The exact pro-rata formula is not written out.
- Other ICCT scrappage pages (India, Brazil fleet renewal) return 403 to scripts and were not read.

### 6.4 Other primary sources
- **T&E**, "Ministers call for scrapping schemes to be coordinated, T&E wants them scrapped" (12 March 2009): "a significant amount of a car's lifetime energy consumption comes in its manufacture", so benefits are "modest or non-existent". Qualitative, with no counting rule. No newer T&E piece was found.
- **The Shift Project**, interim report « Automobile et mobilités routières » (30 June 2026, 57 slides): a full-text search for casse, anticipation, durée de vie and retrofit finds no keep-vs-replace analysis. Retrofit is listed as a lever (p. 38).
- **Fraunhofer ISI, ADAC, TCS**: no primary page on keeping vs replacing was found in this pass.
- **Cour des comptes**: no evaluation of the prime à la conversion's CO₂ balance was found. Press reports cite 2018–2019 remarks on weak evaluation, which were not read.

### 6.5 What "amortissement carbone" means in each framework
- **Bilan Carbone** (see allocation-occasion § 3): spread over the **use period in the organisation**, which may be shorter than the physical life. Our reading: early replacement shortens that period and raises the yearly charge, and the new good carries 100 % over its own use. Nothing explicit on replacement.
- **GHG Protocol Scope 3**: no amortisation, 100 % in the year of purchase (allocation-occasion § 3).
- **Nos Gestes Climat / Impact CO₂**: per km over 230 000 km, construction never fully amortised. The EV action compares steady states (§ 6.1).
- **ABC referential / MyCO2**: per year over the vehicle life (16 years reported for MyCO2, 19 for NGC). Described as "tournée vers le passé".
- **None of these frameworks has a rule for replacing a working car early.** They are footprint conventions (who carries which emissions in a given year), not decision rules (what changes if I act now). Only the ICCT briefing, a decision analysis, states a rule for bringing a purchase forward.

### 6.6 Synthesis
| Organisation | What it says on keeping vs replacing | How it counts manufacturing | Source |
|---|---|---|---|
| ADEME (Agir, avis 2022, Infos) | Nothing found. Supports used EVs, retrofit and small batteries | LCA per car over its life | § 6.1; § 4 |
| ADEME, Étude Rétrofit 2021 | Compares keep / retrofit / scrap + new EV | 100 % of the new EV in a 10-year window, which ADEME says is biased against scrapping | § 4 |
| Nos Gestes Climat / Impact CO₂ (ADEME) | EV action "peut-être négative" if old car and few km | Per km over 230 000 km; action = (C_EV − C_thermal) × km / 230 000 per year | voiture.publicodes, mobilités.publicodes |
| CGDD (ministry), prime à la conversion | Bring-forward ≈ 1 year, costed in euros | Not counted in the CO₂ balance | Théma Sept. 2022, p. 1, 3 |
| Carbone 4 | EV "mis en circulation à la place d'un thermique" reduces emissions; nothing on scrapping a working car | 100 % per car over 12 years (new vs new) | Article June 2025, Q1–Q2; FAQ 2022 |
| ABC referential (ADEME-supported) / MyCO2 | Nothing | Per year over life (16 / 19 years) | empreinte-carbone-personnelle.com, page Voiture |
| ICCT (Bieker & Mock 2020) | Early BEV replacement cuts GHG 62–93 % against later replacement | **Proportional to time shifted: manufacturing × h / L** | Briefing, p. 7, 8, 13–14 |
| ICCT-commissioned (Shaikh 2020) | EV-only scrappage best | "Pro-rated… early production", 10 of 25 years | Printed p. 15 |
| T&E (2009) | Scrappage benefits "modest or non-existent" | Qualitative only | Press release |

- The only organisation that states a rule for a purchase brought forward, the ICCT, uses **h / L**, the same rule as Lenski eq. (3). It applies the same assumption that the old car would have been replaced anyway, by a comparable car.
- ADEME's one keep-vs-replace comparison (Rétrofit 2021) counts **100 %** and says itself that this penalises scrapping. Its calculators (Nos Gestes Climat, Impact CO₂) amortise per km and, through the EV action, charge even less than h / L (only the EV-minus-thermal difference).
- Carbone 4 and the personal-footprint frameworks only compare new cars or spread a footprint per year. They say nothing about timing, so they support neither 100 % nor h / L for this question.
- No organisation found says "keep your car rather than replace it" as a general rule, with a source. The phrase attributed to ADEME could not be traced.

## 7. Deep-research cross-check (added 2026-10-13)
Workflow `/deep-research`: 6 search angles, 24 sources fetched, 25 claims put to 3-vote adversarial checks (22 confirmed, 3 refuted).
- **Three conventions coexist and can flip a borderline verdict** (3-0):
  - 100 % of the new car's manufacturing, old car sunk: payback studies (Kagawa 2013, Campbell & Geyer 2026, Ricardo/DG CLIMA 2016 scrappage model) and, by analogy, the GHG Protocol capital-goods rule;
  - the brought-forward share p(1 − x1/x2): Lenski 2010, also ICCT (Bieker & Mock 2020, section 6.3);
  - amortisation by km or depreciation period: Nos Gestes Climat, Bilan Carbone-style inventories. These are footprint conventions, not keep-vs-replace methods.
- **For a decision, 100 % (upper bound) or the brought-forward share are defensible**; plain amortisation over the EV's life understates the extra burden of replacing early (synthesis).
- **Even at 100 %, replacement by a BEV usually pays off over the old car's remaining life:** Campbell & Geyer 2026 (Science 393(6811):591–595), US, fixed 16-year window: about −50 % when replacing a 2-year-old car, 92 % of scenarios lower (2-1 vote, from secondary coverage). Carbone 4's 30 000–40 000 km break-even (2022) is new-vs-new and must not be reused for early replacement (3-0).
- **When it pays off** (medium): high mileage, low-carbon grid, long holding of the new car, old car scrapped rather than resold; very low mileage (under ≈ 3 000 km/yr, Carbone 4) or a resold old car can make it neutral.
- **Nos Gestes Climat** dropped an earlier front-loaded 10-year amortisation and now amortises by km (3-0).
- **Refuted:** the ICCT German scrappage design (0-3) and that Schaubroeck 2020 applies a production ratio below 100 % by default (1-2).

## Not verified
- Full texts and methods of Kagawa 2013, Kim 2003, Spitzley 2005, Van Wee 2000, Schaubroeck 2020, Campbell & Geyer 2026, Montoya-Torres 2023 and Gastaldi & Cibrario 2026 (paywalls or 403). In particular: how Kagawa counts manufacturing, and how Kim and Spitzley handle the end of the window.
- ADEME's « faut-il changer sa voiture » page: none on the Agir site (archived listing, § 6.1). Pages blocked to scripts (ADEME guide « Bouger autrement au quotidien », librairie 5790) were not read.
- The owner's "flips at 2 years" result.
- MyCO2's own method document (16 years is from the ABC referential, not MyCO2). CGDD method Théma 2020 for the prime à la conversion. Cour des comptes reports on the prime. ICCT India and Brazil scrappage pages (403).
- Shaikh 2020's exact pro-rata formula (footnote xiv gives only the data source).
- The phrase « le véhicule le plus écologique est celui qu'on a déjà »: no primary source found.
