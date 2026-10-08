# 06: Trust signals

**What to build:** A visitor, a journalist or an AI can **check who made the tool and how**:
- a short « Qui a fait ce simulateur » section: Pwablo, independence, no funding from carmakers or energy suppliers;
- a visible « Méthode mise à jour le … » date;
- a working link (or DOI) for each of the 20 sources.

**Blocked by:** 02

**Status:** needs-info (awaiting owner validation of the « Qui a fait » wording)

- [ ] « Qui a fait ce simulateur » section in the 5 languages, with wording validated by the owner — implemented (first section of Mentions légales), **wording to validate by owner**
- [x] Méthode update date visible (end of the Méthode intro) — structured data: constant `METHODE_MAJ` exported from `src/i18n/commun.jsx` for ticket 04
- [x] The 20 sources have a URL or DOI, checked as reachable
- [x] EcoIndex A kept

## Comments

**Placement.** A heading + paragraph on Méthode (95 elements) gave 79.7 (B). So the section opens the **Mentions légales** page (DOM 56 → 60, 86.0 A), and the update date is appended to the Méthode intro paragraph (no new element). Méthode: DOM 92, 60.3 kB → 80.03 (A, at the ceiling); tool page DOM 93, 56.3 kB → 80.05 (A). Local measurements; the Écoconception page figures (production, 55 kB) should be re-measured after deploy.

**FR text to validate by owner** (« Qui a fait ce simulateur »). Facts from Mentions légales / PRODUCT.md: name, Pwablo, Brussels (address), no personal data collected. **Not in the repo, to confirm:** « designer et développeur indépendant », and the independence claim (no funding from carmakers or energy suppliers, no ads).

> Guillaume Gustin (Pwablo, pwablo.be), designer et développeur indépendant à Bruxelles, a conçu et développé ce simulateur. Son but est pédagogique : donner une réponse honnête à votre situation, y compris quand la meilleure option est de garder votre voiture. Le simulateur ne reçoit aucun financement de constructeurs automobiles ni de fournisseurs d'énergie, n'affiche aucune publicité et ne collecte aucune donnée personnelle.

EN/NL/IT/ES are translations of this text (machine-drafted, native review recommended).

**Source URLs** (`SOURCES_URL`, checked 08/10/2026; plain text, not links, for EcoIndex A):

| # | URL / DOI | Check |
|---|---|---|
| 1 | https://www.carbone4.com/files/359_publication_faq_vehicule_electrique.pdf | 200 |
| 2 | https://analysesetdonnees.rte-france.com/bilan-electrique-2025/emissions | 200 (« BE 2025 - Émissions ») |
| 3 | https://www.statistiques.developpement-durable.gouv.fr/chiffres-cles-du-climat-france-europe-et-monde-edition-2025 | 200 (title matches) |
| 4 | https://ember-energy.org/data/yearly-electricity-data/ | 200 |
| 5 | https://www.electricitymaps.com/data/methodology | 200 |
| 6 | https://base-empreinte.ademe.fr/ | 200 |
| 7 | doi:10.1038/s41467-024-54634-y | 200, Crossref metadata matches |
| 8 | https://theicct.org/publication/electric-cars-life-cycle-analysis-emissions-europe-jul25/ | 200 |
| 9 | https://www.ipcc.ch/site/assets/uploads/2018/02/ipcc_wg3_ar5_annex-iii.pdf | 200 |
| 10 | https://www.iso.org/standard/38498.html | bot challenge (Cloudflare) to curl and headless browser; URL confirmed as ISO 14044:2006 by search index |
| 11 | doi:10.1111/jiec.12074 | DOI resolves (302 to Wiley, 403 to bots); Crossref metadata matches |
| 12 | doi:10.2834/91418 | resolves to the Publications Office page, title checked in browser |
| 13 | https://www.iea.org/reports/world-energy-outlook-2025 | 200 |
| 14 | https://theicct.org/wp-content/uploads/2021/07/Global-Vehicle-LCA-White-Paper-A4-revised-v2.pdf | 200 |
| 15 | https://theicct.org/wp-content/uploads/2022/06/real-world-phev-use-jun22-1.pdf | 200 |
| 16 | https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:52024DC0122 | 202 bot challenge to curl; title checked in browser |
| 17 | https://impactco2.fr/ | 200 |
| 18 | https://energy.ec.europa.eu/data-and-analysis/weekly-oil-bulletin_en | 200 |
| 19 | https://ec.europa.eu/eurostat/databrowser/view/nrg_pc_204/default/table | 200 |
| 20 | https://theicct.org/wp-content/uploads/2023/10/ICCT-Study-Cost-Ownership-BEV-Germany.pdf | 200 |

Unverified: none fully; #10 (ISO) is the only one not opened directly (bot wall).
