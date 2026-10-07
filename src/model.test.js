import { test } from "node:test";
import assert from "node:assert/strict";
import {
  PAYS, SEGMENTS, BATTERIES, MOTORS, VIE_ANS, VIE_KM, byId,
  partFab, mixMoyen, calc, fenetre, decider, kmPivot, kmBascule, budget, departager,
} from "./model.js";

test("grille : empreintes finies et positives, part de fabrication dans [0,1]", () => {
  for (const p of PAYS) for (const seg of SEGMENTS) for (const b of BATTERIES)
    for (const kmAn of [3000, 12000, 40000]) for (const occasion of [false, true])
      for (const revente of [false, true]) {
        const f = fenetre({ occasion, odo: 160000, age: 15, kmAn, revente, detention: 8 });
        assert.ok(f.ratioFab >= 0 && f.ratioFab <= 1);
        assert.ok(f.kmVous <= VIE_KM);
        for (const m of MOTORS) {
          const r = calc(m.id, seg, mixMoyen(p.g, 8, true, p.declin), f.kmVous, f.ratioFab, 0.5, b.ef);
          assert.ok(Number.isFinite(r.perKm) && r.perKm > 0, `${p.id} ${seg.id} ${m.id}`);
        }
      }
});

test("allocation : neuf gardé jusqu'à la casse = 100 %, monotone", () => {
  assert.equal(fenetre({ occasion: false, kmAn: 12000, revente: false }).ratioFab, 1);
  assert.ok(Math.abs(partFab(0, VIE_ANS, VIE_ANS) - 1) < 1e-9);
  assert.ok(partFab(3, 8, 18) < partFab(3, 10, 18));
  // une détention au-delà de la fin de vie ne compte pas d'années fantômes
  assert.equal(partFab(12, 24, 18), partFab(12, 18, 18));
});

test("mix : moyenne décroissante, inchangée sans décarbonation", () => {
  assert.equal(mixMoyen(230, 8, false, 0.035), 230);
  assert.ok(mixMoyen(230, 8, true, 0.035) < 230);
  assert.ok(mixMoyen(230, 12, true, 0.035) < mixMoyen(230, 6, true, 0.035));
});

test("H13 : VE vs essence sur 200 000 km — France −65 à −75 %, UE −55 à −65 %", () => {
  const seg = byId(SEGMENTS, "compacte");
  const ecart = (paysId) => {
    const p = byId(PAYS, paysId);
    const g = mixMoyen(p.g, VIE_KM / 15000, true, p.declin);
    const ev = calc("ev", seg, g, VIE_KM, 1, 0, 73);
    const ess = calc("essence", seg, g, VIE_KM, 1, 0, 73);
    return 1 - ev.totalT / ess.totalT;
  };
  assert.ok(ecart("FR") > 0.65 && ecart("FR") < 0.75, `FR ${ecart("FR")}`);
  assert.ok(ecart("EU") > 0.55 && ecart("EU") < 0.65, `EU ${ecart("EU")}`);
});

test("décision : horizon borné, verdict cohérent avec l'amortissement", () => {
  const base = {
    carb: "essence", conso: 6.5, seg: byId(SEGMENTS, "compacte"), pays: byId(PAYS, "BE"),
    decarb: true, efBatt: 60,
  };
  const occ = decider({ ...base, annees: 12, etatVE: "occasion", ageVE: 12, kmAn: 12000 });
  assert.equal(occ.horizon, 6);
  assert.ok(occ.tronque);
  const neuf = decider({ ...base, annees: 12, etatVE: "neuf", ageVE: 0, kmAn: 40000 });
  assert.equal(neuf.km, VIE_KM);
  for (const kmAn of [3000, 8000, 15000, 30000]) for (const annees of [1, 3, 6, 10]) {
    const v = decider({ ...base, annees, etatVE: "neuf", ageVE: 0, kmAn });
    if (v.verdict === "remplacer") assert.ok(v.amortiAns < v.horizon);
    if (v.verdict === "garder") assert.ok(v.amortiAns > v.horizon);
  }
});

test("bascule : seuil cohérent avec le verdict, plus haut sur un réseau carboné", () => {
  const base = { carb: "essence", conso: 6.5, annees: 5, seg: byId(SEGMENTS, "compacte"), etatVE: "neuf", ageVE: 0, decarb: true, efBatt: 73 };
  const be = kmBascule({ ...base, pays: byId(PAYS, "BE") });
  const pl = kmBascule({ ...base, pays: byId(PAYS, "PL") });
  assert.ok(be > 3000 && be < 40000, `BE ${be}`);
  assert.ok(pl === null || pl > be, `PL ${pl}`);
  const juste = decider({ ...base, pays: byId(PAYS, "BE"), kmAn: be });
  assert.ok(juste.tRemplacer <= juste.tGarder);
});

test("convention marginale : un neuf revendu porte 100 % de sa fabrication", () => {
  const f = fenetre({ occasion: false, kmAn: 12000, revente: true, detention: 8, marginal: true });
  assert.equal(f.ratioFab, 1);
  assert.ok(fenetre({ occasion: false, kmAn: 12000, revente: true, detention: 8 }).ratioFab < 1);
});

test("pivot : null si jamais rattrapé, 0 si d'emblée devant", () => {
  assert.equal(kmPivot({ usage: 200, fabAttr: 10 }, { usage: 150, fabAttr: 6 }, 1e5), null);
  assert.equal(kmPivot({ usage: 20, fabAttr: 5 }, { usage: 150, fabAttr: 6 }, 1e5), 0);
  assert.ok(Math.abs(kmPivot({ usage: 50, fabAttr: 10 }, { usage: 150, fabAttr: 6 }, 1e5) - 40000) < 1e-6);
});

test("départager : totaux négatifs ou nuls (budget)", () => {
  assert.equal(departager(-500, 300), "a");
  assert.equal(departager(0, 0), "serre");
  assert.equal(departager(-2667, -1371), "a"); // écart réel de 1 300 € sur ~2 700 : pas « serré »
  assert.equal(departager(100, 105), "serre"); // valeurs positives : règle inchangée
});

test("budget : énergie, revente et valeur résiduelle cohérentes", () => {
  const base = {
    carb: "essence", conso: 7, horizon: 5, kmAn: 12000, seg: byId(SEGMENTS, "compacte"), etatVE: "neuf", ageVE: 0,
    prix: { essence: 1.8, diesel: 1.7, elec: 0.3 }, prixNeufVE: 35000, valeurActuelle: 5000,
    entretien: { thermique: 0.06, electrique: 0.04 },
  };
  const b = budget(base);
  assert.ok(Math.abs(b.energieGarder - 60000 * 7 * 1.8 / 100) < 1e-6);
  assert.ok(b.residuelle < b.achat && b.residuelle > 0);
  // plus on roule, plus l'électrique devient avantageux
  assert.ok(budget({ ...base, kmAn: 30000 }).remplacer - budget({ ...base, kmAn: 30000 }).garder
    < b.remplacer - b.garder);
  // borne et frais annuels alourdissent l'électrique ; une décote plus faible l'allège
  assert.ok(budget({ ...base, wallbox: 1200, autresFraisAn: 300 }).remplacer - b.remplacer === 1200 + 5 * 300);
  assert.ok(budget({ ...base, decoteVE: 0.15 }).remplacer < b.remplacer);
  // une occasion coûte moins à l'achat qu'une neuve
  assert.ok(budget({ ...base, etatVE: "occasion", ageVE: 4 }).achat < b.achat);
});
