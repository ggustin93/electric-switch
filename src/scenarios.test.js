// Scénarios et propriétés du modèle : bornes, monotonies, ordres de grandeur de la littérature, profils types.
// Fourchettes larges à dessein : les chiffres publiés sont figés ailleurs (reponses.test.js).
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  PAYS, SEGMENTS, BATTERIES, MODES, PRIX_ENERGIE, ENTRETIEN, VIE_KM, KM_AN_PARC, GLIDER_EV,
  byId, partFab, mixMoyen, calc, fabEV, fenetre, decider, calcConfig, kmPivot, kmBascule, departager, budget,
} from "./model.js";

const P = (id) => byId(PAYS, id);
const S = (id) => byId(SEGMENTS, id);
const UE = byId(BATTERIES, "ue").ef;
const compacte = S("compacte");
const dec = (o) => decider({ decarb: true, efBatt: UE, etatVE: "neuf", ageVE: 0, ...o, pays: P(o.pays), seg: S(o.seg) });
const ctx = (pays, detention, efBatt = UE) => ({ pays: P(pays), kmAn: 12000, decarb: true, efBatt, marginal: true, detention, phevShare: 0.5 });
// VE et thermique de même segment sur VIE_KM, réseau figé ou qui se décarbone (12 000 km/an)
function vieEntiere(paysId, decarb, motor = "ev", phevShare = 0.5) {
  const p = P(paysId), g = mixMoyen(p.g, VIE_KM / KM_AN_PARC, decarb, p.declin);
  const m = calc(motor, compacte, g, VIE_KM, 1, phevShare, UE);
  return { m, ess: calc("essence", compacte, g, VIE_KM, 1, 0, UE) };
}

test("grille de l'interface : décision et duel sans NaN, ni négatif", () => {
  const ok = (x, nom) => assert.ok(!Number.isNaN(x) && x >= 0, nom); // amortiAns = Infinity est permis
  for (const p of PAYS) for (const seg of SEGMENTS) for (const etatVE of ["neuf", "occasion"])
    for (const ageVE of [1, 6, 12]) for (const odoVE of [0, 100000, 190000]) for (const kmAn of [3000, 12000, 40000]) {
      const d = decider({ carb: "diesel", conso: 6, annees: 8, seg, etatVE, ageVE, odoVE, pays: p, kmAn, decarb: true, efBatt: UE });
      for (const k of ["horizon", "km", "fabVE", "tGarder", "tRemplacer", "amortiAns"]) ok(d[k], `${p.id} ${seg.id} ${etatVE} ${ageVE} ${odoVE} ${kmAn} ${k}`);
      const c = calcConfig({ segId: seg.id, motorId: "phev", etat: etatVE === "neuf" ? "neuf" : "occasion", age: ageVE, odo: odoVE },
        { pays: p, kmAn, decarb: true, efBatt: UE, marginal: false, detention: 8, phevShare: 0.5 });
      for (const k of ["totalT", "perKm", "fabAttr"]) ok(c[k], `${p.id} ${seg.id} duel ${k}`);
    }
});

test("monotonies de calc : réseau, batterie, masse, part de recharge du PHEV ; surcoût de fabrication du VE de 35 à 90 %", () => {
  const g = (motor, grid) => calc(motor, compacte, grid, 100000, 1, 0.5, UE).totalT;
  for (const motor of ["ev", "phev"]) assert.ok(g(motor, 50) < g(motor, 150) && g(motor, 150) < g(motor, 600), motor);
  const bat = BATTERIES.map((b) => fabEV(compacte, b.ef));
  assert.deepEqual(bat, [...bat].sort((a, b) => a - b));
  const masse = SEGMENTS.map((s) => fabEV({ ...s, battKwh: 60 }, UE)); // même batterie : suit la masse du segment
  assert.deepEqual(masse, [...masse].sort((a, b) => a - b));
  const phev = (share) => calc("phev", compacte, 150, 100000, 1, share, UE).totalT;
  assert.ok(phev(0) > phev(0.5) && phev(0.5) > phev(1));
  // ICCT/Ricardo : le VE coûte +40 à +80 % de fabrication ; marge d'un cran de chaque côté
  for (const s of SEGMENTS) for (const b of BATTERIES) {
    const r = fabEV(s, b.ef) / s.fabBase;
    assert.ok(r > 1.35 && r < 1.9, `${s.id} ${b.id} ${r}`);
  }
});

test("allocation : avant + vous + repreneur = 100 % de la fabrication", () => {
  for (const [a, b] of [[3, 5], [0, 8], [1, 2]]) assert.ok(Math.abs(partFab(0, a, 8) + partFab(a, b, 8) + partFab(b, 8, 8) - 1) < 1e-9);
  for (const age of [0, 3, 6, 10]) {
    const f = fenetre({ occasion: true, odo: age * KM_AN_PARC, age, kmAn: 12000, revente: true, detention: 5 });
    const somme = partFab(0, f.ageEff, f.ageMort) + f.ratioFab + partFab(f.ageFinVous, f.ageMort, f.ageMort);
    assert.ok(Math.abs(somme - 1) < 1e-9, `âge ${age}`);
  }
});

test("bascule : premier palier de 500 km où remplacer l'emporte ; verdict et amortissement concordent", () => {
  const base = { carb: "essence", conso: 6.5, annees: 5, seg: compacte, etatVE: "neuf", ageVE: 0, decarb: true, efBatt: UE };
  for (const paysId of ["FR", "BE", "DE", "PL"]) {
    const params = { ...base, pays: P(paysId) };
    const k = kmBascule(params);
    const gagne = (kmAn) => { const v = decider({ ...params, kmAn }); return v.tRemplacer <= v.tGarder; };
    if (k === null) { assert.ok(!gagne(40000), paysId); continue; }
    assert.ok(gagne(k), paysId);
    assert.ok(k === 3000 || !gagne(k - 500), `${paysId} palier précédent`);
  }
  for (const kmAn of [3000, 9000, 20000, 40000]) for (const annees of [2, 5, 10]) {
    const v = decider({ ...base, pays: P("BE"), kmAn, annees });
    assert.equal(v.amortiAns <= v.horizon, v.tRemplacer <= v.tGarder, `${kmAn} ${annees}`);
    if (v.verdict === "remplacer") assert.ok(v.tRemplacer < v.tGarder);
    if (v.verdict === "garder") assert.ok(v.tRemplacer > v.tGarder);
  }
});

test("monotonie : plus de km/an, l'avantage du VE neuf ne recule pas ; plus de compteur, l'horizon ne s'allonge pas", () => {
  // Réseau figé : le rapport remplacer/garder ne remonte jamais. Réseau décarboné : l'horizon peut être tronqué à 200 000 km
  // (non-monotonie voulue, ADR 0002), on ne contrôle donc que le verdict.
  const base = { carb: "essence", conso: 7, annees: 6, seg: "compacte", pays: "BE" };
  const rang = { garder: 0, serre: 1, remplacer: 2 };
  let ratio = Infinity, prec = 0;
  for (let kmAn = 3000; kmAn <= 40000; kmAn += 1000) {
    const fige = dec({ ...base, kmAn, decarb: false });
    assert.ok(fige.tRemplacer / fige.tGarder <= ratio + 1e-12, `${kmAn}`);
    ratio = fige.tRemplacer / fige.tGarder;
    const v = rang[dec({ ...base, kmAn }).verdict];
    assert.ok(v >= prec, `verdict ${kmAn}`); prec = v;
  }
  let h = Infinity;
  for (let odoVE = 0; odoVE <= 190000; odoVE += 10000) {
    const x = dec({ ...base, kmAn: 15000, etatVE: "occasion", ageVE: 4, odoVE }).horizon;
    assert.ok(x <= h + 1e-12, `odo ${odoVE}`); h = x;
  }
});

test("départager : symétrique, seuil de 10 % exclu côté « serré »", () => {
  for (const [a, b] of [[1, 3], [5, 5.2], [-4, -1], [-1, 2], [0, 3]]) {
    const r = departager(a, b), inv = departager(b, a);
    assert.equal(r, { a: "b", b: "a", serre: "serre" }[inv], `${a} ${b}`);
  }
  assert.equal(departager(1, 1.0999), "serre");
  assert.equal(departager(1, 1.1), "a");
});

test("pivot : ordres de grandeur, VE neuf compacte vs essence neuve, 200 000 km", () => {
  const pivot = (paysId, decarb) => {
    const { m, ess } = vieEntiere(paysId, decarb);
    return kmPivot(m, ess, VIE_KM);
  };
  const dans = (x, min, max, nom) => assert.ok(x > min && x < max, `${nom} ${x}`);
  dans(pivot("FR", false), 15000, 35000, "FR");
  dans(pivot("EU", false), 20000, 45000, "EU");
  dans(pivot("PL", false), 45000, 110000, "PL");
  assert.ok(pivot("NO", false) <= pivot("FR", false));
  assert.ok(pivot("PL", true) < pivot("PL", false));
});

test("vie entière : le gain du VE suit la propreté du réseau, dans des fourchettes de la littérature", () => {
  const gain = (id) => { const { m, ess } = vieEntiere(id, true); return 1 - m.totalT / ess.totalT; };
  const ordre = ["NO", "FR", "BE", "EU", "DE", "PL", "IN"].map(gain);
  assert.deepEqual(ordre, [...ordre].sort((a, b) => b - a));
  const dans = (id, min, max) => assert.ok(gain(id) > min && gain(id) < max, `${id} ${gain(id)}`);
  dans("DE", 0.4, 0.6); dans("PL", 0.15, 0.45); dans("IN", 0.05, 0.35);
});

test("écart ICCT : réseau 78 g, 240 000 km, carrosserie ×0,9 → gain UE de 68 à 78 %", () => {
  // Même modèle, trois hypothèses de l'ICCT : l'écart de −60 % à −73 % s'explique entièrement par elles (H1, H6, H9)
  const km = 240000, g = 78;
  const ev = calc("ev", compacte, g, km, 1, 0, UE);
  const ess = calc("essence", compacte, g, km, 1, 0, UE);
  const evICCT = ev.totalT - compacte.fabBase * (GLIDER_EV - 0.9);
  const gain = 1 - evICCT / ess.totalT;
  assert.ok(gain > 0.68 && gain < 0.78, `${gain}`);
});

test("motorisations : HEV −10 à −25 %, ordre VE < PHEV 90 % < PHEV 50 % < HEV en Belgique, PHEV peu rechargé ≈ essence", () => {
  const be = (m, share) => vieEntiere("BE", true, m, share).m.totalT;
  const ess = vieEntiere("BE", true).ess.totalT;
  const hev = 1 - be("hev") / ess;
  assert.ok(hev > 0.1 && hev < 0.25, `${hev}`);
  assert.ok(be("ev") < be("phev", 0.9) && be("phev", 0.9) < be("phev", 0.5) && be("phev", 0.5) < be("hev"));
  assert.ok(Math.abs(be("phev", 0.15) / ess - 1) < 0.1);
  assert.ok(vieEntiere("PL", false, "phev", 0.15).m.totalT >= vieEntiere("PL", false).ess.totalT);
});

test("part de fabrication : occasion de 6 ans gardée 5 ans de 15 à 35 %, neuf de 50 à 70 % (100 % en marginal)", () => {
  const f = (o) => fenetre({ kmAn: 12000, revente: true, detention: 5, ...o }).ratioFab;
  const occ = f({ occasion: true, age: 6, odo: 72000 }), neuf = f({ occasion: false });
  assert.ok(occ > 0.15 && occ < 0.35, `${occ}`);
  assert.ok(neuf > 0.5 && neuf < 0.7, `${neuf}`);
  assert.equal(f({ occasion: false, marginal: true }), 1);
});

test("profils : petit rouleur → garder (l'occasion gagne), gros rouleur → remplacer, VTC tronqué, retraité polonais", () => {
  // a : citadine essence, FR, 5 000 km/an
  const a = { carb: "essence", conso: 6, annees: 4, seg: "citadine", pays: "FR", kmAn: 5000 };
  assert.equal(dec(a).verdict, "garder");
  assert.ok(dec(a).suggererOccasion);
  assert.equal(dec({ ...a, etatVE: "occasion", ageVE: 6 }).verdict, "remplacer");
  assert.ok(budget({ ...a, seg: S(a.seg), prix: PRIX_ENERGIE.FR, entretien: ENTRETIEN }).economieUsageAn > 0);
  // b : SUV diesel, DE, 30 000 km/an
  const b = { carb: "diesel", conso: 7, annees: 6, seg: "suv", pays: "DE", kmAn: 30000 };
  assert.equal(dec(b).verdict, "remplacer");
  assert.ok(budget({ ...b, seg: S(b.seg), prix: PRIX_ENERGIE.DE, entretien: ENTRETIEN }).economieUsageAn > 1500);
  // c : VTC belge, VE de 2 ans et 90 000 km roulant 40 000 km/an : 110 000 km restants
  const c = dec({ carb: "diesel", conso: 6.5, annees: 4, seg: "berline", pays: "BE", kmAn: 40000, etatVE: "occasion", ageVE: 2, odoVE: 90000 });
  assert.ok(c.tronque && Math.abs(c.horizon - 2.75) < 1e-9);
  assert.equal(c.verdict, "remplacer");
  // d : retraité polonais, diesel citadine, 5 000 km/an : garder, et il faut rouler plus qu'en France
  const d = { carb: "diesel", conso: 5, annees: 8, seg: "citadine", pays: "PL", kmAn: 5000 };
  assert.equal(dec(d).verdict, "garder");
  const bascule = (pays) => kmBascule({ ...d, seg: S(d.seg), pays: P(pays), etatVE: "neuf", ageVE: 0, decarb: true, efBatt: UE }) ?? Infinity; // null = jamais
  assert.ok(bascule("PL") > bascule("FR"));
});

test("profils du duel : PHEV jamais rechargé pire que l'essence en Italie, grand SUV chinois norvégien, repères ADEME", () => {
  const t = (motorId, phevShare, x = ctx("IT", 8), segId = "compacte") => calcConfig({ segId, motorId, etat: "neuf", phevShare }, x).totalT;
  assert.ok(t("phev", 0) > t("essence") && t("essence") > t("phev", 0.5) && t("phev", 0.5) > t("ev"));
  // grand SUV nmcCN vs citadine essence, Norvège : à égalité à 8 ans, nettement devant sur la vie
  const cn = ctx("NO", 8, byId(BATTERIES, "nmcCN").ef);
  assert.ok(Math.abs(t("ev", 0, cn, "grandsuv") / t("essence", 0, cn, "citadine") - 1) < 0.1);
  const cn18 = ctx("NO", 18, byId(BATTERIES, "nmcCN").ef);
  assert.ok(t("ev", 0, cn18, "grandsuv") < 0.7 * t("essence", 0, cn18, "citadine"));
  // repères ADEME (voiture électrique française : même ordre de grandeur ; thermique : entre 1 et 2 fois)
  const { m, ess } = vieEntiere("FR", true);
  const mode = (id) => MODES.flatMap((f) => f.modes).find(([n]) => n === id)[1];
  assert.ok(m.perKm > 0.7 * mode("voitureElec") && m.perKm < 1.3 * mode("voitureElec"));
  assert.ok(ess.perKm > mode("voitureThermique") && ess.perKm < 2 * mode("voitureThermique"));
});

test("pivot : un VE meilleur partout (usage et fabrication) vaut 0, pas null", () => {
  // PL, réseau figé : VE grand SUV d'occasion (9 ans, 108 000 km) vs citadine essence neuve
  assert.equal(kmPivot({ usage: 163.7, fabAttr: 2.67 }, { usage: 161.4, fabAttr: 3.56 }, VIE_KM), 0);
  assert.equal(kmPivot({ usage: 163.7, fabAttr: 4 }, { usage: 161.4, fabAttr: 3.56 }, VIE_KM), null);
});

test("décision : VE d'occasion déjà en fin de vie, horizon nul et pas de total négatif", () => {
  // 17 ans, compteur par défaut 204 000 km : au-delà de la borne de 200 000 km (H1)
  const v = dec({ carb: "essence", conso: 6, annees: 5, seg: "compacte", pays: "BE", kmAn: 12000, etatVE: "occasion", ageVE: 17 });
  assert.equal(v.horizon, 0);
  assert.ok(v.tRemplacer >= 0 && v.tGarder >= 0);
});

test("point mort belge cohérent avec l'étude des 5 voitures les plus vendues en Belgique (26 000 à 36 000 km contre une essence)", () => {
  // Réseau belge selon les sources 2025 (H5) : Ember 150 g, Electricity Maps 182 g ; batterie UE, 200 000 km
  const be = P("BE");
  const pivot = (segId, g, vs = "essence") => {
    const s = S(segId);
    return kmPivot(calc("ev", s, g, VIE_KM, 1, 0, UE), calc(vs, s, g, VIE_KM, 1, 0, UE), VIE_KM);
  };
  for (const segId of ["citadine", "compacte", "suv"])
    for (const g of [mixMoyen(be.g, VIE_KM / KM_AN_PARC, true, be.declin), 182]) {
      const km = pivot(segId, g);
      assert.ok(km > 20000 && km < 45000, `${segId} ${g} ${km}`);
    }
  assert.ok(pivot("compacte", 182) < 35000);
  // chiffre publié (« environ 25 000 à 30 000 km », page Questions) : la compacte au réseau belge qui se décarbone
  const publie = pivot("compacte", mixMoyen(be.g, VIE_KM / KM_AN_PARC, true, be.declin));
  assert.ok(publie > 25000 && publie < 30000, `${publie}`);
  // face à un hybride, il faut rouler davantage (l'étude : 43 000 km contre une Yaris hybride)
  assert.ok(pivot("compacte", 182, "hev") > pivot("compacte", 182));
});
