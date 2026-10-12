import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { transformWithOxc } from "vite";

// Chaque dictionnaire doit avoir exactement les clés du français, avec le même type (texte, fonction, liste…).
const LANGUES = ["fr", "en", "nl", "it", "es"];
const dossier = mkdtempSync(join(tmpdir(), "dico-"));

async function importer(l) {
  const source = readFileSync(new URL(`./i18n/${l}.jsx`, import.meta.url), "utf8");
  const { code } = await transformWithOxc(source, `${l}.jsx`, { jsx: { runtime: "classic", pragma: "h", pragmaFrag: "F" } });
  const fichier = join(dossier, `${l}.mjs`);
  writeFileSync(fichier, `const h = () => ({ jsx: true }), F = 0;\n${code}`);
  return import(fichier);
}
const charger = async (l) => (await importer(l)).default;

function cles(o, prefixe = "") {
  return Object.entries(o).flatMap(([k, v]) => {
    const nature = v?.jsx ? "jsx" : Array.isArray(v) ? "liste" : typeof v;
    return nature === "object" && v ? cles(v, `${prefixe}${k}.`) : [`${prefixe}${k}:${nature}`];
  });
}

test("dictionnaires : mêmes clés et mêmes types dans toutes les langues", async () => {
  const fr = cles(await charger("fr")).sort();
  for (const l of LANGUES.slice(1)) {
    const d = await charger(l);
    assert.equal(d.code, l);
    assert.deepEqual(cles(d).filter((c) => !c.startsWith("code:") && !c.startsWith("locale:")).sort(),
      fr.filter((c) => !c.startsWith("code:") && !c.startsWith("locale:")), `clés différentes en ${l}`);
  }
});

test("sources : une URL ou un DOI pour chacune, date de mise à jour de la méthode au format ISO", async () => {
  const { SOURCES, SOURCES_URL, METHODE_MAJ } = await importer("commun");
  assert.equal(SOURCES_URL.length, SOURCES.length);
  for (const u of SOURCES_URL) assert.match(u, /^(https:\/\/\S+|doi:10\.\d{4,}\/\S+)$/);
  assert.match(METHODE_MAJ, /^\d{4}-\d{2}-\d{2}$/);
});

test("renvois d'hypothèse : chaque langue n'utilise que son préfixe (fr/es H1, en/nl A1, it I1)", () => {
  for (const l of LANGUES) {
    const source = readFileSync(new URL(`./i18n/${l}.jsx`, import.meta.url), "utf8");
    const prefixe = source.match(/^  prefixeHyp: "([A-Z])"/m)[1];
    const etrangers = [...source.matchAll(/\b([HAI])\d{1,2}\b/g)].filter((m) => m[1] !== prefixe).map((m) => m[0]);
    assert.deepEqual(etrangers, [], `${l} : renvois avec un autre préfixe que ${prefixe}`);
  }
});
