import { test } from "node:test";
import assert from "node:assert/strict";
import { lireSimulation, ecrireSimulation, effacerSimulation } from "./sauvegarde.js";

const stock = new Map();
const env = { localStorage: { getItem: (k) => stock.get(k) ?? null, setItem: (k, v) => stock.set(k, v), removeItem: (k) => stock.delete(k) } };
const sv = { paysId: "BE", kmAn: 12000, carb: "essence", conso: 6.9, annees: 5, ageAct: 10, kmAct: null, segId: "compacte", etatVE: "neuf", ageVE: 3, odo: null, date: "2026-10-16T10:00:00.000Z" };

test("sauvegarde : aller-retour, forme vérifiée, stockage absent ou corrompu toléré", () => {
  assert.equal(lireSimulation(env), null);
  ecrireSimulation(sv, env);
  assert.deepEqual(lireSimulation(env), sv);
  stock.set("simulation", JSON.stringify({ ...sv, kmAn: "12000" }));
  assert.equal(lireSimulation(env), null, "type inattendu");
  stock.set("simulation", "{pas du json");
  assert.equal(lireSimulation(env), null);
  effacerSimulation(env);
  assert.equal(stock.has("simulation"), false);
  assert.equal(lireSimulation({}), null);
  ecrireSimulation(sv, {}); // ne lève pas
});
