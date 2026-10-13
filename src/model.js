/* Modèle ACV « Dois-je passer à l'électrique ? » — v6
   Données et fonctions pures, sans texte affiché (les libellés vivent dans i18n.jsx).
   Hypothèses H1–H14 : voir i18n.jsx (STR.*.hyp) et GLOSSARY.md. */

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
// (pertes de recharge ajoutées à part, H10 : compacte 18,4 × 1,1 = 20,2 kWh à la prise, ICCT 2025 tab. 4). Fabrication du thermique (hors batterie) :
// 5,2 tCO2e par tonne de véhicule (Ricardo 2020, repris par l'ICCT), H9.
const FAB_PAR_TONNE = 5.2;
export const SEGMENTS = [
  { id: "citadine", masse: 1150, essence: 6.0, diesel: 5.0, ev: 17.3, battKwh: 42 },
  { id: "compacte", masse: 1350, essence: 6.9, diesel: 5.8, ev: 18.4, battKwh: 55 },
  { id: "berline", masse: 1550, essence: 7.6, diesel: 6.5, ev: 20.0, battKwh: 75 },
  { id: "suv", masse: 1650, essence: 8.4, diesel: 7.1, ev: 21.5, battKwh: 75 },
  { id: "grandsuv", masse: 2200, essence: 10.1, diesel: 8.7, ev: 25.2, battKwh: 100 },
].map((s) => ({ ...s, fabBase: (FAB_PAR_TONNE * s.masse) / 1000 }));

// kgCO2e/kWh — Argonne GREET 2024 via ICCT 2025 tab. 2 (NMC622 Europe 60, LFP Chine 69, NMC Chine 80) ; « ue » = moyenne pondérée des ventes UE (H8)
export const BATTERIES = [
  { id: "nmcEU", ef: 60 },
  { id: "lfp", ef: 69 },
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

// --- Part restante (H3, borne haute) : fabrication que la voiture n'a pas encore « consommée » à l'achat,
// au plus petit des deux ratios (km sur VIE_KM, âge sur VIE_ANS), sans crédit à la revente. Neuve : 1.
// Additionnée sur les propriétaires successifs, elle dépasse 100 % : estimation haute, pas une allocation.
export const partRestante = (odo, age) => Math.max(0, Math.min(1 - odo / VIE_KM, 1 - age / VIE_ANS));

// --- Intensité moyenne du mix sur n années : moyenne d'une décroissance géométrique (H6) ---
export function mixMoyen(g0, annees, actif, r) {
  if (!actif || annees <= 0 || r <= 0) return g0;
  const n = Math.max(1, Math.min(annees, 25));
  return (g0 * (1 - Math.pow(1 - r, n))) / (n * r);
}

export const usageEssence = (L100) => (L100 / 100) * EF_ESSENCE * 1000; // g/km
export const usageDiesel = (L100) => (L100 / 100) * EF_DIESEL * 1000;
export const usageThermique = (carb, L100) => (carb === "diesel" ? usageDiesel(L100) : usageEssence(L100));
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
    // Hybrides (H11, ICCT 2025 tab. 1 et 4) : HEV −22 % d'essence (ICCT −23 %), +0,6 t de fabrication (prudent : ICCT 0).
    // PHEV : +0,7 t et 14 kWh (ICCT +0,7 t, 13,3 kWh) ; +12 % de kWh en électrique, +6 % d'essence en thermique
    // (ICCT ≈ +18 % et +10 % : légèrement favorable au PHEV).
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

// --- Accroche (phrase d'accueil) : compacte électrique neuve vs essence neuve sur VIE_KM, batterie UE, 12 000 km/an.
// Arrondi à 10 (le modèle n'est pas plus précis) ; min = réseau figé, max = réseau qui se décarbone.
// États-Unis et Australie : la consommation d'essence est européenne, le gain y serait sous-estimé → moyenne UE.
const ACCROCHE_HORS = ["US", "AU"];
export function gainAccroche(pays) {
  if (ACCROCHE_HORS.includes(pays.id)) pays = byId(PAYS, "EU");
  const seg = byId(SEGMENTS, "compacte");
  const efBatt = byId(BATTERIES, "ue").ef;
  const gain = (decarb) => {
    const g = mixMoyen(pays.g, VIE_KM / KM_AN_PARC, decarb, pays.declin);
    const ev = calc("ev", seg, g, VIE_KM, 1, 0, efBatt).totalT;
    const ess = calc("essence", seg, g, VIE_KM, 1, 0, efBatt).totalT;
    return Math.round((1 - ev / ess) * 10) * 10;
  };
  return { paysId: pays.id, min: gain(false), max: gain(true) };
}

// --- Fenêtre de détention : km parcourus et part de fabrication ---
// marginal : un achat neuf porte 100 % de sa fabrication (H3), même revendu ensuite ; une occasion reste en H2 partout (ADR 0012)
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
// Neuf : fabrication avancée (borne basse) et 100 % (H3, borne haute) ; le verdict ne tranche que si elles concordent.
// Occasion : allocation économique (H2), avec la part restante comme borne haute (partHaute). Horizon borné par la vie restante du VE (H1).
export function decider({ carb, conso, annees, seg, etatVE, ageVE, odoVE = ageVE * KM_AN_PARC, pays, kmAn, decarb, efBatt }) {
  const occasion = etatVE !== "neuf";
  const ageDebut = occasion ? ageVE : 0;
  // Même fenêtre que « Comparer » : le compteur réduit la vie restante (borne 200 000 km), une même règle partout
  const fen = (detention) => fenetre({ occasion: true, odo: odoVE, age: ageVE, kmAn, revente: true, detention });
  const odoEff = occasion ? fen(annees).odoEff : 0;
  // ≥ 0 : un VE déjà en fin de vie (compteur ou âge au-delà des bornes H1) n'a plus d'horizon
  const horizon = Math.max(0, Math.min(annees, (VIE_KM - odoEff) / kmAn, VIE_ANS - ageDebut));
  const km = horizon * kmAn;
  const usageVieille = usageThermique(carb, conso);
  const gridG = mixMoyen(pays.g, horizon, decarb, pays.declin);
  const usageVE = usageElec(seg.ev, gridG);
  const fabTot = fabEV(seg, efBatt);
  const partVE = occasion ? fen(horizon).ratioFab : 1;
  const fabVE = fabTot * partVE;
  const tGarder = (usageVieille * km) / 1e6;
  const tRemplacer = fabVE + (usageVE * km) / 1e6;
  // Neuve : borne basse = fabrication avancée de h ans (Lenski et al. 2010, éq. 3 ; ICCT 2020), si la prochaine voiture
  // aurait de toute façon été une électrique comparable. Borne haute = 100 % (H3). Occasion : une seule valeur (H2).
  const partAvancee = occasion ? partVE : Math.min(1, horizon / Math.min(VIE_ANS, VIE_KM / kmAn));
  const tRemplacerBas = fabTot * partAvancee + (usageVE * km) / 1e6;
  // Occasion : estimation haute = toute la fabrication qui lui reste (ADR 0012), affichée seulement si elle change le verdict
  const partHaute = occasion ? partRestante(odoEff, ageDebut) : 1;
  const tRemplacerHaut = fabTot * partHaute + (usageVE * km) / 1e6;
  const amortiAns = usageVieille > usageVE ? (fabVE * 1e6) / ((usageVieille - usageVE) * kmAn) : Infinity;
  // Occasion suggérée : 6 ans, compteur moyen (12 000 km/an), même fenêtre
  const odoSugg = AGE_SUGGESTION * KM_AN_PARC;
  const hzOcc = Math.min(horizon, VIE_ANS - AGE_SUGGESTION, (VIE_KM - odoSugg) / kmAn);
  const partOccSugg = fenetre({ occasion: true, odo: odoSugg, age: AGE_SUGGESTION, kmAn, revente: true, detention: hzOcc }).ratioFab;
  const tOccasion = fabTot * partOccSugg + (usageVE * hzOcc * kmAn) / 1e6;
  const tGarderOcc = (usageVieille * hzOcc * kmAn) / 1e6;
  const VERDICTS = { a: "remplacer", b: "garder", serre: "serre" };
  // Verdict tranché seulement si les deux bornes concordent ; sinon « serré », selon la prochaine voiture (ADR 0013)
  const vHaut = departager(tRemplacer, tGarder), vBas = departager(tRemplacerBas, tGarder);
  const verdict = vHaut === "a" ? "a" : vBas === "b" ? "b" : "serre";
  return {
    horizon, km, usageVieille, usageVE, fabVE, partVE, partHaute, tGarder, tRemplacer, amortiAns,
    fabTot, partAvancee, tRemplacerBas, tRemplacerHaut,
    selonAchat: occasion && departager(tRemplacerHaut, tGarder) !== departager(tRemplacer, tGarder),
    tronque: horizon < annees,
    verdict: VERDICTS[verdict],
    selonProchaine: vHaut !== vBas,
    suggererOccasion:
      (etatVE === "neuf" || ageVE < AGE_SUGGESTION - 1) && departager(tOccasion, tGarderOcc) === "a",
    tOccasion, tGarderOcc,
  };
}

// Voiture actuelle gardée (courbe cumulée de « Comparer ») : fabrication déjà payée, usage seul, jusqu'à sa fin de vie
export function voitureActuelle({ carb, conso, annees, kmAn, kmMax }) {
  return { usage: usageThermique(carb, conso), kmFin: Math.min(kmMax, annees * kmAn) };
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
// 3000 si l'électrique gagne déjà au minimum, null s'il ne gagne jamais. Premier franchissement seulement :
// d'occasion, quand la borne de 200 000 km tronque l'horizon, le verdict peut ensuite repasser à « garder » (ADR 0002).
// cle : le total comparé (« tRemplacerBas » : neuve en fabrication avancée, ADR 0013 ; « tRemplacerHaut » : occasion en part restante, ADR 0012)
export function kmBascule(params, cle = "tRemplacer") {
  for (let kmAn = 3000; kmAn <= 40000; kmAn += 500) {
    const v = decider({ ...params, kmAn });
    if (v[cle] <= v.tGarder) return kmAn;
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
  // VE jamais rattrapé à l'usage : devant d'emblée si sa fabrication attribuée est aussi plus faible
  if (dUsage <= 0) return ev.fabAttr <= essence.fabAttr ? 0 : null;
  const km = ((ev.fabAttr - essence.fabAttr) * 1e6) / dUsage;
  if (km <= 0) return 0;
  return km < kmMax ? km : null;
}

// --- Prix par défaut du budget (€, modifiables dans l'appli ; sources : docs/research/2026-10-budget.md) ---
// src/prix.json, mis à jour chaque semaine par scripts/prix.mjs : carburant €/L TTC du Bulletin pétrolier UE
// (carbDate, lundi des prix) et électricité domestique €/kWh TTC Eurostat nrg_pc_204 (elecPeriode, semestre).
// Hors UE (carbDate/elecPeriode null), saisis à la main : GOV.UK et Ofgem T4 2026, EIA, NO/CN/IN globalpetrolprices.
export { default as PRIX_ENERGIE } from "./prix.json" with { type: "json" };
// Entretien + pneus €/km : électrique 0,04 (ICCT 2023 : ID.3 0,046 ; ADAC 2026 : ≥ 1/3 moins cher que le
// thermique) ; voiture thermique ancienne déjà payée 0,07 (réparations et pièces d'usure en plus), prudent : moyenne
// française ≈ 0,09 à 0,11 €/km (ménages 41,4 Md€ en 2024, CCFA d'après l'INSEE, pour 440 Md de km, SDES).
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
