/* Données communes à toutes les langues : références des hypothèses, sources, langues disponibles. */

// Références [n] de chaque hypothèse H1–H14 (communes à toutes les langues)
export const HYP_REFS = [[1, 8, 14], [10], [11], [3, 8], [2, 4, 5, 6, 9], [4, 13], [6], [7, 8], [8, 12], [8, 16], [15, 16], [8], [8, 14], [18, 19, 20]];

// Langues publiées : une page par langue (/fr/, /en/…), nom affiché dans sa propre langue
export const LANGUES = [["fr", "Français"], ["en", "English"], ["nl", "Nederlands"], ["it", "Italiano"], ["es", "Español"]];

// Titres des sources dans leur langue d'origine
export const SOURCES = [
  <>Carbone 4 (2022). Les idées reçues sur le véhicule électrique. carbone4.com.</>,
  <>RTE (2026). Bilan électrique 2025 — Émissions de gaz à effet de serre.</>,
  <>SDES / CGDD (2025). Chiffres clés du climat — Édition 2025.</>,
  <>Ember (2025). Yearly Electricity Data &amp; European Electricity Review.</>,
  <>Electricity Maps (2025). Carbon intensity data (lifecycle), IPCC AR5 factors.</>,
  <>ADEME (2025). Base Empreinte® / Base Carbone®.</>,
  <>Peiseler, L., Schenker, V., Schatzmann, K., Pfister, S., Wood, V. &amp; Schmidt, T. (2024). “Carbon footprint distributions of lithium-ion batteries and their materials”. Nature Communications 15, 10301.</>,
  <>Negri, M. &amp; Bieker, G. (2025). Life-cycle greenhouse gas emissions from passenger cars in the European Union: A 2025 update and key factors to consider. ICCT.</>,
  <>IPCC (2014). AR5 WGIII, Annex III.</>,
  <>ISO 14044 (2006). Environmental management — Life cycle assessment — Requirements and guidelines, § allocation.</>,
  <>Plevin, R., Delucchi, M. &amp; Creutzig, F. (2014). “Using Attributional Life Cycle Assessment to Estimate Climate-Change Mitigation Benefits Misleads Policy Makers”. Journal of Industrial Ecology 18(1), 73–83.</>,
  <>Hill, N. et al. — Ricardo, ifeu, E4tech, for the European Commission (2020). Determining the environmental impacts of conventional and alternatively fuelled vehicles through LCA.</>,
  <>IEA (2025). World Energy Outlook, STEPS scenario.</>,
  <>Bieker, G. (2021). A global comparison of the life-cycle greenhouse gas emissions of combustion engine and electric passenger cars. ICCT.</>,
  <>Plötz, P. et al. (2022). Real-world usage of plug-in hybrid vehicles in Europe. ICCT / Fraunhofer ISI.</>,
  <>European Commission (2024). Report on real-world CO₂ emissions of cars and vans based on on-board fuel consumption monitoring data, COM(2024) 122.</>,
  <>ADEME (2026). Impact CO₂ — comparateur des modes de transport. impactco2.fr, API v1, consulté le 07/10/2026. Licence Ouverte Etalab.</>,
  <>European Commission (2026). Weekly Oil Bulletin, prices of 5 October 2026.</>,
  <>Eurostat (2026). Electricity prices for household consumers (nrg_pc_204), 2025-S2, band DC.</>,
  <>Morrison, K. &amp; Wappelhorst, S. (2023). Are battery electric vehicles cost competitive? An income-based analysis for the German market. ICCT.</>,
];

// Adresse de chaque source (même ordre que SOURCES), vérifiée joignable le 08/10/2026.
// Affichée en texte, pas en lien : 20 <a> feraient sortir la page Méthode de l'EcoIndex A.
export const SOURCES_URL = [
  "https://www.carbone4.com/files/359_publication_faq_vehicule_electrique.pdf",
  "https://analysesetdonnees.rte-france.com/bilan-electrique-2025/emissions",
  "https://www.statistiques.developpement-durable.gouv.fr/chiffres-cles-du-climat-france-europe-et-monde-edition-2025",
  "https://ember-energy.org/data/yearly-electricity-data/",
  "https://www.electricitymaps.com/data/methodology",
  "https://base-empreinte.ademe.fr/",
  "doi:10.1038/s41467-024-54634-y",
  "https://theicct.org/wp-content/uploads/2025/07/ID-392-%E2%80%93-Life-cycle-GHG_report_final.pdf",
  "https://www.ipcc.ch/site/assets/uploads/2018/02/ipcc_wg3_ar5_annex-iii.pdf",
  "https://www.iso.org/standard/38498.html",
  "doi:10.1111/jiec.12074",
  "doi:10.2834/91418",
  "https://www.iea.org/reports/world-energy-outlook-2025",
  "https://theicct.org/wp-content/uploads/2021/07/Global-Vehicle-LCA-White-Paper-A4-revised-v2.pdf",
  "https://theicct.org/wp-content/uploads/2022/06/real-world-phev-use-jun22-1.pdf",
  "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:52024DC0122",
  "https://impactco2.fr/",
  "https://energy.ec.europa.eu/data-and-analysis/weekly-oil-bulletin_en",
  "https://ec.europa.eu/eurostat/databrowser/view/nrg_pc_204/default/table",
  "https://theicct.org/wp-content/uploads/2023/10/ICCT-Study-Cost-Ownership-BEV-Germany.pdf",
];

// Dernière mise à jour de la méthode (ISO 8601) : affichée sur la page Méthode, reprise dans les données structurées.
export const METHODE_MAJ = "2026-10-08";
