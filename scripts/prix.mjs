// Mise à jour des prix par défaut du budget (src/prix.json), lancée chaque semaine par .github/workflows/prix.yml.
// Carburants : Weekly Oil Bulletin de la Commission (xlsx, prix TTC du lundi, €/1000 L).
// Électricité : Eurostat nrg_pc_204 (ménages 2 500-5 000 kWh, toutes taxes, €/kWh), dernier semestre publié par pays.
// Une source en panne ou un fichier au format inattendu : on garde les prix précédents de cette source (jamais d'échec du build).
// Pays hors UE (UK, US, AU, CN, IN, carburant NO) : saisis à la main, jamais touchés ici.
import { readFileSync, writeFileSync, mkdtempSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";

const FICHIER = new URL("../src/prix.json", import.meta.url);
const BULLETIN = "https://energy.ec.europa.eu/document/download/264c2d0f-f161-4ea3-a777-78faae59bea0_en";
const NOMS = { Belgium: "BE", France: "FR", Germany: "DE", Italy: "IT", Spain: "ES", Sweden: "SE", Poland: "PL" };
const EUROSTAT_GEO = { BE: "BE", FR: "FR", DE: "DE", IT: "IT", ES: "ES", SE: "SE", PL: "PL", NO: "NO", EU: "EU27_2020" };
const EUROSTAT = "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/nrg_pc_204?format=JSON&lang=EN"
  + "&nrg_cons=KWH2500-4999&unit=KWH&tax=I_TAX&currency=EUR&lastTimePeriod=2"
  + Object.values(EUROSTAT_GEO).map((g) => `&geo=${g}`).join("");

const arrondi = (x, n) => Math.round(x * 10 ** n) / 10 ** n;
const plausible = (x, min, max) => x >= min && x <= max; // garde-fou : une unité qui change ne passe pas

// Feuille du bulletin : A2 = date (numéro de série Excel), puis une ligne par pays : nom, Euro-super 95, gazole.
export function lireBulletin(feuille, chaines) {
  const textes = [...chaines.matchAll(/<si>([\s\S]*?)<\/si>/g)].map((m) => m[1].replace(/<[^>]+>/g, ""));
  const cellules = {};
  for (const [, ref, attrs, v] of feuille.matchAll(/<c r="([A-Z]+\d+)"([^>]*)><v>([^<]*)<\/v><\/c>/g))
    cellules[ref] = attrs.includes('t="s"') ? textes[+v] : +v;
  const date = new Date(Date.UTC(1899, 11, 30) + cellules.A2 * 864e5).toISOString().slice(0, 10);
  const pays = {};
  for (let r = 3; cellules[`A${r}`] !== undefined; r++) {
    const nom = String(cellules[`A${r}`]);
    const code = nom.includes("EUR27") ? "EU" : NOMS[nom];
    if (code && plausible(cellules[`B${r}`], 800, 4000) && plausible(cellules[`C${r}`], 800, 4000))
      pays[code] = { essence: arrondi(cellules[`B${r}`] / 1000, 2), diesel: arrondi(cellules[`C${r}`] / 1000, 2) };
  }
  if (!/^20\d\d-/.test(date) || !pays.BE) throw new Error("bulletin pétrolier : format inattendu");
  return { date, pays };
}

// JSON-stat Eurostat (dimensions geo × time, autres filtrées à 1) : dernier semestre disponible par pays.
export function lireEurostat(json) {
  const geo = json.dimension.geo.category.index;
  const temps = Object.entries(json.dimension.time.category.index).sort((a, b) => b[1] - a[1]);
  const nt = temps.length;
  const pays = {};
  for (const [code, g] of Object.entries(EUROSTAT_GEO)) {
    for (const [periode, t] of temps) {
      const v = json.value[geo[g] * nt + t];
      if (plausible(v, 0.05, 1)) { pays[code] = { elec: arrondi(v, 3), elecPeriode: periode }; break; }
    }
  }
  return pays;
}

export function fusionner(prix, bulletin, eurostat) {
  const res = structuredClone(prix);
  for (const [code, p] of Object.entries(bulletin?.pays ?? {})) Object.assign(res[code], p, { carbDate: bulletin.date });
  for (const [code, p] of Object.entries(eurostat ?? {})) Object.assign(res[code], p);
  return res;
}

async function tenter(nom, f) {
  try { return await f(); } catch (e) { console.warn(`${nom} : ${e.message}, prix précédents conservés`); return null; }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const bulletin = await tenter("bulletin pétrolier", async () => {
    const r = await fetch(BULLETIN);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const xlsx = join(mkdtempSync(join(tmpdir(), "bulletin-")), "b.xlsx");
    writeFileSync(xlsx, Buffer.from(await r.arrayBuffer()));
    const lire = (f) => execFileSync("unzip", ["-p", xlsx, f], { encoding: "utf8" });
    return lireBulletin(lire("xl/worksheets/sheet1.xml"), lire("xl/sharedStrings.xml"));
  });
  const eurostat = await tenter("Eurostat", async () => {
    const r = await fetch(EUROSTAT);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return lireEurostat(await r.json());
  });
  const prix = JSON.parse(readFileSync(FICHIER, "utf8"));
  writeFileSync(FICHIER, JSON.stringify(fusionner(prix, bulletin, eurostat), null, 2) + "\n");
  console.log(`carburants : ${bulletin?.date ?? "inchangés"} ; électricité : ${eurostat ? Object.keys(eurostat).length + " pays" : "inchangée"}`);
}
