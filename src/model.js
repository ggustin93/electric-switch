/* Modèle ACV « Dois-je passer à l'électrique ? » — v6
   Données et fonctions pures, sans texte affiché (les libellés vivent dans i18n.jsx).
   Hypothèses H1–H13 : voir i18n.jsx (STR.*.hyp) et GLOSSARY.md. */

// Mix électriques : intensité ACV (gCO2e/kWh, consommation 2024-25) et
// taux annuel de décarbonation projeté (PNIEC / AIE STEPS) — H5, H6
export const PAYS = [
  { id: "NO", g: 30, declin: 0.005 },
  { id: "SE", g: 30, declin: 0.005 },
  { id: "FR", g: 50, declin: 0.01 },
  { id: "ES", g: 140, declin: 0.05 },
  { id: "BE", g: 150, declin: 0.03 },
  { id: "UK", g: 210, declin: 0.05 },
  { id: "EU", g: 210, declin: 0.035 },
  { id: "IT", g: 300, declin: 0.035 },
  { id: "DE", g: 340, declin: 0.045 },
  { id: "US", g: 380, declin: 0.02 },
  { id: "AU", g: 530, declin: 0.05 },
  { id: "CN", g: 560, declin: 0.035 },
  { id: "PL", g: 620, declin: 0.055 },
  { id: "IN", g: 700, declin: 0.025 },
];

// Consommations réelles (ICCT 2025 / OBFCM) : L/100 km ; VE en kWh/100 km côté batterie
// (pertes de recharge ajoutées à part, H10). Fabrication du thermique (hors batterie) :
// 5,2 tCO2e par tonne de véhicule (Ricardo 2020, repris par l'ICCT), H9.
const FAB_PAR_TONNE = 5.2;
export const SEGMENTS = [
  { id: "citadine", masse: 1150, essence: 6.0, diesel: 5.0, ev: 16.5, battKwh: 42 },
  { id: "compacte", masse: 1350, essence: 6.9, diesel: 5.8, ev: 17.5, battKwh: 55 },
  { id: "berline", masse: 1550, essence: 7.6, diesel: 6.5, ev: 19.0, battKwh: 75 },
  { id: "suv", masse: 1650, essence: 8.4, diesel: 7.1, ev: 20.5, battKwh: 75 },
  { id: "grandsuv", masse: 2200, essence: 10.1, diesel: 8.7, ev: 24.0, battKwh: 100 },
].map((s) => ({ ...s, fabBase: (FAB_PAR_TONNE * s.masse) / 1000 }));

// kgCO2e/kWh — Argonne GREET 2024 via ICCT 2025 ; « ue » = moyenne pondérée des ventes UE (H8)
export const BATTERIES = [
  { id: "nmcEU", ef: 60 },
  { id: "lfp", ef: 65 },
  { id: "ue", ef: 73 },
  { id: "nmcCN", ef: 80 },
];

export const MOTORS = [
  { id: "ev", hybride: false },
  { id: "hev", hybride: true },
  { id: "phev", hybride: true },
  { id: "essence", hybride: false },
  { id: "diesel", hybride: false },
];

export const EF_ESSENCE = 2.69; // kgCO2e/L, SP95-E10 puits à la roue (H7)
export const EF_DIESEL = 3.1; // kgCO2e/L, gazole B7 (H7)
export const GLIDER_EV = 1.05; // H9
export const PERTES_CHARGE = 1.1; // H10
export const VIE_KM = 200000; // H1
export const VIE_ANS = 18; // H1
export const KM_AN_PARC = 12000; // H4
export const DECOTE = 0.15; // H2
export const SEUIL_SERRE = 0.1; // écart relatif sous lequel deux options sont « à égalité »
export const AGE_SUGGESTION = 6; // âge du VE d'occasion suggéré dans le verdict « garder »

export const byId = (list, id) => list.find((x) => x.id === id);

// --- Allocation économique (H2) ---
const valeur = (t) => Math.pow(1 - DECOTE, Math.max(0, t));
// Part de fabrication attribuée à une détention [ageDebut, ageFin],
// normalisée par la valeur consommée sur toute la vie du véhicule.
export function partFab(ageDebut, ageFin, ageMort) {
  const fin = Math.min(ageFin, ageMort);
  const denom = 1 - valeur(ageMort);
  return Math.min(1, Math.max(0, (valeur(ageDebut) - valeur(fin)) / Math.max(denom, 1e-6)));
}

// --- Intensité moyenne du mix sur n années : moyenne d'une décroissance géométrique (H6) ---
export function mixMoyen(g0, annees, actif, r) {
  if (!actif || annees <= 0 || r <= 0) return g0;
  const n = Math.max(1, Math.min(annees, 25));
  return (g0 * (1 - Math.pow(1 - r, n))) / (n * r);
}

export const usageEssence = (L100) => (L100 / 100) * EF_ESSENCE * 1000; // g/km
export const usageDiesel = (L100) => (L100 / 100) * EF_DIESEL * 1000;
export const usageElec = (kWh100, gridG) => (kWh100 / 100) * PERTES_CHARGE * gridG;
export const fabEV = (seg, efBatt) => seg.fabBase * GLIDER_EV + (seg.battKwh * efBatt) / 1000;

// --- Empreinte d'une motorisation sur une détention ---
export function calc(motorId, seg, gridG, kmVous, ratioFab, phevShare, efBatt) {
  let fabTotale, usage;
  const usageEss = usageEssence(seg.essence);
  switch (motorId) {
    case "essence":
      fabTotale = seg.fabBase;
      usage = usageEss;
      break;
    case "diesel":
      fabTotale = seg.fabBase;
      usage = usageDiesel(seg.diesel);
      break;
    case "hev":
      fabTotale = seg.fabBase + 0.6;
      usage = usageEss * 0.78;
      break;
    case "phev":
      fabTotale = seg.fabBase + 0.7 + (14 * efBatt) / 1000;
      usage = phevShare * usageElec(seg.ev * 1.12, gridG) + (1 - phevShare) * usageEss * 1.06;
      break;
    default: // ev
      fabTotale = fabEV(seg, efBatt);
      usage = usageElec(seg.ev, gridG);
  }
  const fabAttr = fabTotale * ratioFab;
  const usageT = (usage * kmVous) / 1e6;
  const totalT = fabAttr + usageT;
  return { motorId, fabTotale, fabAttr, usage, usageT, totalT, perKm: (totalT * 1e6) / kmVous };
}

// --- Fenêtre de détention : km parcourus et part de fabrication ---
// marginal : un achat neuf porte 100 % de sa fabrication (H3), même revendu ensuite
export function fenetre({ occasion, odo, age, kmAn, revente, detention, marginal = false }) {
  const ageEff = occasion ? age : 0;
  // Le compteur saisi (celui de l'annonce) est respecté : la vraie borne est la fin de vie à 200 000 km
  const odoEff = occasion ? odo : 0;
  const anneesRest = Math.max(1, VIE_ANS - ageEff);
  const anneesVous = revente ? Math.min(detention, anneesRest) : anneesRest;
  const kmVous = Math.max(3000, Math.min(VIE_KM - odoEff, anneesVous * kmAn));
  const ageFinVous = ageEff + kmVous / kmAn;
  const kmRepreneur = revente
    ? Math.max(0, Math.min(VIE_KM - odoEff - kmVous, (VIE_ANS - ageFinVous) * KM_AN_PARC))
    : 0;
  const ageMort = revente ? ageFinVous + kmRepreneur / KM_AN_PARC : ageFinVous;
  return {
    kmVous, kmRepreneur, odoEff, ageEff, ageFinVous, ageMort,
    ratioFab: marginal && !occasion ? 1 : partFab(ageEff, ageFinVous, ageMort),
    // Vous gardez le véhicule jusqu'à sa limite d'âge, avant sa borne kilométrique
    borneParAge: anneesVous === anneesRest && anneesRest * kmAn < VIE_KM - odoEff,
  };
}

// Années qu'une voiture peut encore rouler (H1 : 18 ans ou 200 000 km, la première borne atteinte),
// arrondies et ramenées à l'échelle du curseur (1 à 12 ans)
export function anneesRestantes({ age, km, kmAn }) {
  const reste = Math.min(VIE_ANS - age, (VIE_KM - km) / kmAn);
  return Math.min(12, Math.max(1, Math.round(reste)));
}

// Verdict entre deux empreintes : "a", "b" ou "serre" (même seuil partout)
export function departager(a, b) {
  if (a > 0 && b > 0) {
    if (Math.max(a, b) / Math.min(a, b) - 1 < SEUIL_SERRE) return "serre";
  } else {
    // Totaux nuls ou négatifs (budget : revente élevée) : écart rapporté à la plus grande valeur absolue
    const m = Math.max(Math.abs(a), Math.abs(b));
    if (m === 0 || Math.abs(a - b) / m < SEUIL_SERRE) return "serre";
  }
  return a < b ? "a" : "b";
}

// --- Onglet Décision : garder sa thermique ou passer à un VE ---
// Neuf : convention marginale, 100 % de la fabrication (H3).
// Occasion : allocation économique (H2). Horizon borné par la vie restante du VE (H1).
export function decider({ carb, conso, annees, seg, etatVE, ageVE, odoVE = ageVE * KM_AN_PARC, pays, kmAn, decarb, efBatt }) {
  const occasion = etatVE !== "neuf";
  const ageDebut = occasion ? ageVE : 0;
  // Même fenêtre que « Comparer » : le compteur réduit la vie restante (borne 200 000 km), une même règle partout
  const fen = (detention) => fenetre({ occasion: true, odo: odoVE, age: ageVE, kmAn, revente: true, detention });
  const odoEff = occasion ? fen(annees).odoEff : 0;
  const horizon = Math.min(annees, (VIE_KM - odoEff) / kmAn, VIE_ANS - ageDebut);
  const km = horizon * kmAn;
  const usageVieille = carb === "diesel" ? usageDiesel(conso) : usageEssence(conso);
  const gridG = mixMoyen(pays.g, horizon, decarb, pays.declin);
  const usageVE = usageElec(seg.ev, gridG);
  const fabTot = fabEV(seg, efBatt);
  const partVE = occasion ? fen(horizon).ratioFab : 1;
  const fabVE = fabTot * partVE;
  const tGarder = (usageVieille * km) / 1e6;
  const tRemplacer = fabVE + (usageVE * km) / 1e6;
  const amortiAns = usageVieille > usageVE ? (fabVE * 1e6) / ((usageVieille - usageVE) * kmAn) : Infinity;
  // Occasion suggérée : 6 ans, compteur moyen (12 000 km/an), même fenêtre
  const odoSugg = AGE_SUGGESTION * KM_AN_PARC;
  const hzOcc = Math.min(horizon, VIE_ANS - AGE_SUGGESTION, (VIE_KM - odoSugg) / kmAn);
  const partOccSugg = fenetre({ occasion: true, odo: odoSugg, age: AGE_SUGGESTION, kmAn, revente: true, detention: hzOcc }).ratioFab;
  const tOccasion = fabTot * partOccSugg + (usageVE * hzOcc * kmAn) / 1e6;
  const tGarderOcc = (usageVieille * hzOcc * kmAn) / 1e6;
  const VERDICTS = { a: "remplacer", b: "garder", serre: "serre" };
  return {
    horizon, km, usageVieille, usageVE, fabVE, partVE, tGarder, tRemplacer, amortiAns,
    tronque: horizon < annees,
    verdict: VERDICTS[departager(tRemplacer, tGarder)],
    suggererOccasion:
      (etatVE === "neuf" || ageVE < AGE_SUGGESTION - 1) && departager(tOccasion, tGarderOcc) === "a",
    tOccasion, tGarderOcc,
  };
}

// --- Onglet Duel : une configuration { segId, motorId, etat } ---
export function calcConfig(cfg, { pays, kmAn, decarb, efBatt, marginal, detention, phevShare }) {
  const seg = byId(SEGMENTS, cfg.segId);
  const f = fenetre({
    occasion: cfg.etat === "occasion", odo: cfg.odo, age: cfg.age,
    kmAn, revente: true, detention, marginal,
  });
  const gridEff = mixMoyen(pays.g, f.kmVous / kmAn, decarb, pays.declin);
  return { ...calc(cfg.motorId, seg, gridEff, f.kmVous, f.ratioFab, cfg.phevShare ?? phevShare, efBatt), f };
}

// --- Kilométrage annuel à partir duquel remplacer devient préférable (curseur 3 000 à 40 000 km/an).
// 3000 si l'électrique gagne déjà au minimum, null s'il ne gagne jamais.
export function kmBascule(params) {
  for (let kmAn = 3000; kmAn <= 40000; kmAn += 500) {
    const v = decider({ ...params, kmAn });
    if (v.tRemplacer <= v.tGarder) return kmAn;
  }
  return null;
}

// --- Pays de recharge probable, deviné localement (rien n'est envoyé) : fuseau horaire d'abord
// (il dit où l'on vit), puis la région des langues du navigateur (« nl-BE », « en-GB »), sinon la moyenne UE.
const FUSEAUX = {
  "Europe/Oslo": "NO", "Europe/Stockholm": "SE", "Europe/Paris": "FR", "Europe/Madrid": "ES", "Atlantic/Canary": "ES",
  "Europe/Brussels": "BE", "Europe/London": "UK", "Europe/Rome": "IT", "Europe/Berlin": "DE", "Europe/Warsaw": "PL",
  "Asia/Kolkata": "IN", "Asia/Calcutta": "IN", "Asia/Shanghai": "CN",
};
export function paysProbable({ fuseau = "", langues = [] } = {}) {
  if (FUSEAUX[fuseau]) return FUSEAUX[fuseau];
  if (fuseau.startsWith("Australia/")) return "AU";
  if (/^America\/(New_York|Chicago|Denver|Phoenix|Los_Angeles|Anchorage|Detroit)$|^Pacific\/Honolulu$/.test(fuseau)) return "US";
  for (const l of langues) {
    const region = l.split("-")[1]?.toUpperCase();
    const id = region === "GB" ? "UK" : region;
    if (id && PAYS.some((p) => p.id === id)) return id;
  }
  return "EU";
}

// --- Autres modes de transport : gCO2e par personne et par km, fabrication comprise.
// ADEME Impact CO₂, API v1, consultée le 07/10/2026 (réseau français ; voir docs/research).
export const MODES = [
  { famille: "actif", modes: [["marche", 0], ["velo", 0.2], ["vae", 11.0], ["trottinette", 24.9]] },
  { famille: "collectif", modes: [["tgv", 2.9], ["tram", 4.3], ["metro", 4.4], ["intercites", 9.0], ["rer", 9.8], ["busElec", 21.7], ["ter", 27.7], ["autocar", 37.6], ["busThermique", 122.4]] },
  { famille: "voiture", modes: [["covoitElec", 33.7], ["voitureElec", 67.4], ["covoitThermique", 71.1], ["voitureThermique", 142.3]] },
  { famille: "deuxRoues", modes: [["scooterElec", 59.3], ["scooter", 76.3], ["moto", 214.7]] },
  { famille: "avion", modes: [["avionCO2", 123.6], ["avion", 224.6]] },
];

// --- Km à partir duquel le VE passe devant l'essence : null si jamais, 0 si d'emblée ---
export function kmPivot(ev, essence, kmMax) {
  const dUsage = essence.usage - ev.usage;
  if (dUsage <= 0) return null;
  const km = ((ev.fabAttr - essence.fabAttr) * 1e6) / dUsage;
  if (km <= 0) return 0;
  return km < kmMax ? km : null;
}

// --- Prix par défaut du budget (€, modifiables dans l'appli ; sources : docs/research/2026-10-budget.md) ---
// Carburant €/L : Bulletin pétrolier UE 05/10/2026 ; GOV.UK ; EIA ; NO/CN/IN globalpetrolprices (à défaut).
// Électricité €/kWh domestique TTC : Eurostat nrg_pc_204 2025-S2 ; UK plafond Ofgem T4 2026 ; US EIA.
// Conversions BCE du 07/10/2026.
export const PRIX_ENERGIE = {
  NO: { essence: 2.78, diesel: 2.63, elec: 0.192 },
  SE: { essence: 1.59, diesel: 2.12, elec: 0.271 },
  FR: { essence: 2.21, diesel: 2.36, elec: 0.256 },
  ES: { essence: 1.85, diesel: 1.92, elec: 0.267 },
  BE: { essence: 1.96, diesel: 2.35, elec: 0.36 }, // électricité : Eurostat 2026-S1 (CREG T4 2026 : 32 à 38 c)
  UK: { essence: 2.07, diesel: 2.36, elec: 0.311 },
  EU: { essence: 2.0, diesel: 2.15, elec: 0.29 },
  IT: { essence: 2.07, diesel: 2.27, elec: 0.297 },
  DE: { essence: 2.14, diesel: 2.24, elec: 0.387 },
  US: { essence: 1.03, diesel: 1.47, elec: 0.164 },
  AU: { essence: 1.28, diesel: 1.53, elec: 0.243 },
  CN: { essence: 1.23, diesel: 1.11, elec: 0.071 },
  PL: { essence: 1.52, diesel: 1.76, elec: 0.271 },
  IN: { essence: 1.0, diesel: 0.91, elec: 0.063 },
};
// Entretien + pneus €/km : électrique 0,04 (ICCT 2023 : ID.3 0,046 ; ADAC 2026 : ≥ 1/3 moins cher que le
// thermique) ; voiture thermique ancienne déjà payée 0,07 (réparations et pièces d'usure en plus).
export const ENTRETIEN = { thermique: 0.07, electrique: 0.04 };

// --- Budget à l'usage (€/an) : énergie + entretien, recharge à domicile ---
// Hors périmètre, assumé : prix d'achat du véhicule, assurance, taxes, financement (choix du propriétaire :
// ces postes dépendent du marché de chaque pays et noieraient l'information utile ; H14).
export function budget({ carb, conso, kmAn, seg, prix, entretien }) {
  const energie100Garder = conso * prix[carb];
  const energie100VE = seg.ev * PERTES_CHARGE * prix.elec;
  const usageGarderAn = (kmAn * energie100Garder) / 100 + kmAn * entretien.thermique;
  const usageVEAn = (kmAn * energie100VE) / 100 + kmAn * entretien.electrique;
  return { usageGarderAn, usageVEAn, economieUsageAn: usageGarderAn - usageVEAn, energie100Garder, energie100VE };
}
