import { test } from "node:test";
import assert from "node:assert/strict";
import { lireBulletin, lireEurostat, fusionner } from "../scripts/prix.mjs";
import prix from "./prix.json" with { type: "json" };

const chaines = "<sst><si><t>in EUR</t></si><si><t>CE/EC/EG EUR27_2020 (IV)\nWeighted average</t></si><si><t>Belgium</t></si><si><t>Malta</t></si></sst>";
const c = (ref, v, s = "") => `<c r="${ref}"${s}><v>${v}</v></c>`;
const feuille = c("A1", 0, ' t="s"') + c("A2", 46300)
  + c("A3", 1, ' s="1" t="s"') + c("B3", 2010.4) + c("C3", 2150)
  + c("A4", 2, ' t="s"') + c("B4", 1958.53) + c("C4", 2348.78)
  + c("A5", 3, ' t="s"') + c("B5", 1.34) + c("C5", 2100); // €/L au lieu de €/1000 L : rejeté

test("lireBulletin : date du lundi, €/1000 L → €/L, EU et pays connus, valeurs aberrantes rejetées", () => {
  assert.deepEqual(lireBulletin(feuille, chaines), {
    date: "2026-10-05",
    pays: { EU: { essence: 2.01, diesel: 2.15 }, BE: { essence: 1.96, diesel: 2.35 } },
  });
  assert.throws(() => lireBulletin(c("A2", 46300), chaines), /format inattendu/);
});

test("lireEurostat : dernier semestre publié par pays, sinon le précédent", () => {
  const json = {
    dimension: { geo: { category: { index: { BE: 0, IT: 1 } } }, time: { category: { index: { "2025-S2": 0, "2026-S1": 1 } } } },
    value: { 0: 0.3499, 1: 0.3575, 2: 0.2966 },
  };
  assert.deepEqual(lireEurostat(json), {
    BE: { elec: 0.358, elecPeriode: "2026-S1" },
    IT: { elec: 0.297, elecPeriode: "2025-S2" },
  });
});

test("fusionner : source absente = prix conservés ; pays hors UE jamais touchés", () => {
  const res = fusionner(prix, { date: "2027-01-04", pays: { BE: { essence: 1.5, diesel: 1.6 } } }, null);
  assert.deepEqual(res.BE, { ...prix.BE, essence: 1.5, diesel: 1.6, carbDate: "2027-01-04" });
  assert.deepEqual(res.UK, prix.UK);
  assert.deepEqual(fusionner(prix, null, null), prix);
});

test("prix.json : chaque pays a ses trois prix et la date de ses sources", () => {
  for (const [code, p] of Object.entries(prix)) {
    for (const k of ["essence", "diesel", "elec"]) assert.ok(p[k] > 0, `${code}.${k}`);
    assert.ok(p.carbDate === null || /^\d{4}-\d\d-\d\d$/.test(p.carbDate), code);
    assert.ok(p.elecPeriode === null || /^\d{4}-S[12]$/.test(p.elecPeriode), code);
  }
});
