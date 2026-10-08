import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { transformWithOxc } from "vite";

// Chaque dictionnaire doit avoir exactement les clés du français, avec le même type (texte, fonction, liste…).
const LANGUES = ["fr", "en", "nl", "it", "es"];
const dossier = mkdtempSync(join(tmpdir(), "dico-"));

async function charger(l) {
  const source = readFileSync(new URL(`./i18n/${l}.jsx`, import.meta.url), "utf8");
  const { code } = await transformWithOxc(source, `${l}.jsx`, { jsx: { runtime: "classic", pragma: "h", pragmaFrag: "F" } });
  const fichier = join(dossier, `${l}.mjs`);
  writeFileSync(fichier, `const h = () => ({ jsx: true }), F = 0;\n${code}`);
  return (await import(fichier)).default;
}

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
