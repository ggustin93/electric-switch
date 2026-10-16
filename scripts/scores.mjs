// Scores EcoIndex des pages construites, pour le README : npm run build && node scripts/scores.mjs [lang]
// Même calcul que le garde-fou du build (build.mjs) : nœuds du DOM, 1 requête, poids gzip de la page.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { gzipSync } from "node:zlib";
import { ecoindex, noeuds } from "../src/ecoindex.js";

const lang = process.argv[2] ?? "fr";
const racine = join(new URL("..", import.meta.url).pathname, "dist", lang);
// Lettres officielles : A au-dessus de 80, puis un seuil par lettre
const SEUILS = [[80, "A"], [70, "B"], [55, "C"], [40, "D"], [25, "E"], [10, "F"], [-1, "G"]];
const grade = (score) => SEUILS.find(([seuil]) => score > seuil)[1];
const pages = ["", ...readdirSync(racine).filter((d) => statSync(join(racine, d)).isDirectory())];

console.log(`| Page (/${lang}/) | DOM nodes | Weight (gzip) | EcoIndex |\n|---|---:|---:|---|`);
for (const p of pages) {
  const html = readFileSync(join(racine, p, "index.html"), "utf8");
  const dom = noeuds(html), ko = gzipSync(html).length / 1024, s = ecoindex(dom, 1, ko);
  console.log(`| ${p || "simulator"} | ${dom} | ${ko.toFixed(1)} kB | ${s.toFixed(1)} (${grade(s)}) |`);
}
