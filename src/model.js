/* Modèle ACV « Dois-je passer à l'électrique ? » — v6
   Données et fonctions pures, sans texte affiché (les libellés vivent dans i18n.jsx).
   Hypothèses H1–H13 : voir i18n.jsx (STR.*.hyp) et CONTEXT.md. */

// Mix électriques : intensité ACV (gCO2e/kWh, consommation 2024-25) et
// taux annuel de décarbonation projeté (PNIEC / AIE STEPS) — H5, H6
export const PAYS = [
  { id: "NO", g: 30, declin: 0.005 },
  { id: "SE", g: 40, declin: 0.005 },
  { id: "FR", g: 50, declin: 0.01 },
  { id: "ES", g: 140, declin: 0.05 },
  { id: "BE", g: 150, declin: 0.03 },
  { id: "UK", g: 210, declin: 0.04 },
  { id: "EU", g: 230, declin: 0.035 },
  { id: "IT", g: 300, declin: 0.035 },
  { id: "DE", g: 380, declin: 0.045 },
  { id: "US", g: 380, declin: 0.03 },
  { id: "AU", g: 530, declin: 0.05 },
  { id: "CN", g: 560, declin: 0.035 },
  { id: "PL", g: 620, declin: 0.055 },
  { id: "IN", g: 700, declin: 0.025 },
];

// Consommations réelles : L/100 km ; VE en kWh/100 km côté batterie
// (pertes de recharge ajoutées à part, H10). fab = glider thermique, tCO2e.
export const SEGMENTS = [
  { id: "citadine", masse: 1150, essence: 5.5, diesel: 4.5, ev: 16.5, battKwh: 42, fabBase: 5.0 },
  { id: "compacte", masse: 1350, essence: 6.3, diesel: 5.2, ev: 17.5, battKwh: 55, fabBase: 6.0 },
  { id: "berline", masse: 1550, essence: 7.0, diesel: 5.8, ev: 19.0, battKwh: 75, fabBase: 7.5 },
  { id: "suv", masse: 1650, essence: 7.8, diesel: 6.4, ev: 20.5, battKwh: 75, fabBase: 7.2 },
  { id: "grandsuv", masse: 2200, essence: 9.5, diesel: 7.8, ev: 24.0, battKwh: 100, fabBase: 10.0 },
];

export const BATTERIES = [
  { id: "lfp", ef: 50 },
  { id: "nmcEU", ef: 60 },
  { id: "nmcCN", ef: 80 },
];

export const MOTORS = [
  { id: "ev", hybride: false },
  { id: "hev", hybride: true },
  { id: "phev", hybride: true },
  { id: "essence", hybride: false },
  { id: "diesel", hybride: false },
];

export const EF_ESSENCE = 2.71; // kgCO2e/L, SP95-E10 puits à la roue (H7)
export const EF_DIESEL = 3.1; // kgCO2e/L, gazole B7 (H7)
export const GLIDER_EV = 1.05; // H9
export const PERTES_CHARGE = 1.1; // H10
export const VIE_KM = 200000; // H1
export const VIE_ANS = 18; // H1
export const KM_AN_PARC = 12000; // H4
export const DECOTE = 0.15; // H2
export const SEUIL_SERRE = 0.1; // écart relatif sous lequel deux options sont « à égalité »
export const AGE_SUGGESTION = 6; // âge du VE d'occasion suggéré dans le verdict « garder »
export const KM_AN_MAX_COMPTEUR = 30000; // borne réaliste compteur / âge (occasion)
export const DUEL = { odo: 80000, age: 6, detention: 8, phevShare: 0.5 };

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
      fabTotale = seg.fabBase + 0.2;
      usage = usageDiesel(seg.diesel);
      break;
    case "hev":
      fabTotale = seg.fabBase + 0.6;
      usage = usageEss * 0.78;
      break;
    case "phev":
      fabTotale = seg.fabBase + 0.4 + (14 * efBatt) / 1000;
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
export function fenetre({ occasion, odo, age, kmAn, revente, detention }) {
  const ageEff = occasion ? age : 0;
  const odoEff = occasion ? Math.min(odo, Math.max(1, ageEff) * KM_AN_MAX_COMPTEUR) : 0;
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
    ratioFab: partFab(ageEff, ageFinVous, ageMort),
    // Vous gardez le véhicule jusqu'à sa limite d'âge, avant sa borne kilométrique
    borneParAge: anneesVous === anneesRest && anneesRest * kmAn < VIE_KM - odoEff,
  };
}

// Verdict entre deux empreintes : "a", "b" ou "serre" (même seuil partout)
export function departager(a, b) {
  if (Math.max(a, b) / Math.min(a, b) - 1 < SEUIL_SERRE) return "serre";
  return a < b ? "a" : "b";
}

// --- Onglet Décision : garder sa thermique ou passer à un VE ---
// Neuf : convention marginale, 100 % de la fabrication (H3).
// Occasion : allocation économique (H2). Horizon borné par la vie restante du VE (H1).
export function decider({ carb, conso, annees, seg, etatVE, ageVE, pays, kmAn, decarb, efBatt }) {
  const ageDebut = etatVE === "neuf" ? 0 : ageVE;
  const horizon = Math.min(annees, VIE_KM / kmAn, VIE_ANS - ageDebut);
  const km = horizon * kmAn;
  const usageVieille = carb === "diesel" ? usageDiesel(conso) : usageEssence(conso);
  const gridG = mixMoyen(pays.g, horizon, decarb, pays.declin);
  const usageVE = usageElec(seg.ev, gridG);
  const fabTot = fabEV(seg, efBatt);
  const partVE = etatVE === "neuf" ? 1 : partFab(ageVE, ageVE + horizon, VIE_ANS);
  const fabVE = fabTot * partVE;
  const tGarder = (usageVieille * km) / 1e6;
  const tRemplacer = fabVE + (usageVE * km) / 1e6;
  const amortiAns = usageVieille > usageVE ? (fabVE * 1e6) / ((usageVieille - usageVE) * kmAn) : Infinity;
  const hzOcc = Math.min(horizon, VIE_ANS - AGE_SUGGESTION);
  const tOccasion =
    fabTot * partFab(AGE_SUGGESTION, AGE_SUGGESTION + hzOcc, VIE_ANS) + (usageVE * hzOcc * kmAn) / 1e6;
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
export function calcConfig(cfg, { pays, kmAn, decarb, efBatt }) {
  const seg = byId(SEGMENTS, cfg.segId);
  const f = fenetre({
    occasion: cfg.etat === "occasion", odo: DUEL.odo, age: DUEL.age,
    kmAn, revente: true, detention: DUEL.detention,
  });
  const gridEff = mixMoyen(pays.g, f.kmVous / kmAn, decarb, pays.declin);
  return { ...calc(cfg.motorId, seg, gridEff, f.kmVous, f.ratioFab, DUEL.phevShare, efBatt), f };
}

// --- Km à partir duquel le VE passe devant l'essence : null si jamais, 0 si d'emblée ---
export function kmPivot(ev, essence, kmMax) {
  const dUsage = essence.usage - ev.usage;
  if (dUsage <= 0) return null;
  const km = ((ev.fabAttr - essence.fabAttr) * 1e6) / dUsage;
  if (km <= 0) return 0;
  return km < kmMax ? km : null;
}
