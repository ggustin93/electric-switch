// Dernière simulation « Ma décision », mémorisée sur l'appareil seulement (localStorage) pour retrouver son verdict.
// Rien ne part du navigateur ; la lecture tolère un stockage absent, vide ou corrompu.
const CLE = "simulation";
const FORME = { paysId: "string", kmAn: "number", carb: "string", conso: "number", annees: "number", ageAct: "number",
  segId: "string", etatVE: "string", ageVE: "number", date: "string" }; // kmAct et odo : nombre ou null (estimés)

export function lireSimulation(env = globalThis) {
  try {
    const sv = JSON.parse(env.localStorage?.getItem(CLE) ?? "null");
    if (!sv || Object.entries(FORME).some(([k, t]) => typeof sv[k] !== t)) return null;
    return sv;
  } catch { return null; }
}

export function ecrireSimulation(sv, env = globalThis) {
  try { env.localStorage.setItem(CLE, JSON.stringify(sv)); } catch { /* stockage indisponible */ }
}

export function effacerSimulation(env = globalThis) {
  try { env.localStorage.removeItem(CLE); } catch { /* stockage indisponible */ }
}
