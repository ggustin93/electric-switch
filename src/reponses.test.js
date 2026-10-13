// Chiffres des textes de réponse (intro de l'outil, page Questions, ticket 05) : chacun est recalculé ici
// par le modèle et doit se retrouver, formaté dans la langue, dans les 5 dictionnaires. Changer une
// hypothèse du modèle fait échouer ce test tant que les textes ne sont pas mis à jour.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { PAYS, SEGMENTS, BATTERIES, VIE_KM, byId, mixMoyen, calc, decider, kmBascule, kmPivot } from "./model.js";
import { lireDico } from "./seo.js";

// Compacte (catégorie par défaut), batterie moyenne UE, neuve, toute sa vie : 200 000 km,
// réseau moyen sur 200 000 / 15 000 ≈ 13 ans avec décarbonation (même calcul que le test H13)
const seg = byId(SEGMENTS, "compacte");
const ef = byId(BATTERIES, "ue").ef;
// options : réseau figé (decarb false) ou autre intensité de départ g (gCO2e/kWh), autre catégorie segId
const vie = (paysId, motor, phev = 0.5, { decarb = true, g, segId = "compacte" } = {}) => {
  const p = byId(PAYS, paysId);
  return calc(motor, byId(SEGMENTS, segId), mixMoyen(g ?? p.g, VIE_KM / 15000, decarb, p.declin), VIE_KM, 1, phev, ef);
};
const ecart = (paysId, motor = "ev", phev, opt) => 1 - vie(paysId, motor, phev, opt).totalT / vie(paysId, "essence", 0, opt).totalT;
// Profil par défaut de « Ma décision » (App.jsx) : Belgique, essence à 6,5 L/100 km qui roulerait encore 5 ans, 12 000 km/an
const profil = { carb: "essence", conso: 6.5, annees: 5, seg, etatVE: "neuf", ageVE: 3, pays: byId(PAYS, "BE"), decarb: true, efBatt: ef, kmAn: 12000 };
const occasion = decider({ ...profil, etatVE: "occasion", ageVE: 6 });

const r1 = (x) => Math.round(x * 10) / 10;
const pc5 = (x) => Math.round(x * 20) * 5; // pourcentage arrondi à 5 près
const pc10bas = (x) => Math.floor(x * 10) * 10; // « plus de … % » : arrondi par défaut, jamais surévalué
// Réseau belge selon les sources 2025 (H5) : 131 g (ULiège) à 182 g (Electricity Maps)
const RESEAU_BE = [131, 182];
// Point mort en Belgique, citadine à SUV, réseau 131 à 182 g : bornes arrondies à 5 000 km
const pivots = ["citadine", "compacte", "suv"].flatMap((segId) => RESEAU_BE.map((g) =>
  kmPivot(vie("BE", "ev", 0, { g, segId }), vie("BE", "essence", 0, { g, segId }), VIE_KM)));
const PIVOT_BE = [Math.min(...pivots), Math.max(...pivots)].map((km) => Math.round(km / 5000) * 5000);
const pcBas = (x) => Math.max(0, Math.round(x * 100)); // PHEV peu rechargé : jamais « moins de 0 % »

const CHIFFRES = {
  lede: [pc10bas(ecart("BE"))],
  questions: [
    [Math.round(vie("BE", "ev").totalT), Math.round(vie("BE", "essence").totalT), Math.round(ecart("BE") * 100),
      ...RESEAU_BE.map((g) => Math.round(ecart("BE", "ev", 0, { g }) * 100)).sort((a, b) => a - b)],
    [...PIVOT_BE, kmBascule(profil), kmBascule({ ...profil, annees: 8 })],
    [seg.battKwh, ef, r1((seg.battKwh * ef) / 1000), r1(vie("BE", "ev").fabTotale), r1(vie("BE", "essence").fabTotale), ...PIVOT_BE],
    [Math.round(occasion.partVE * 100), r1(occasion.tRemplacer), r1(occasion.tGarder), r1(decider(profil).tRemplacer)],
    // Compteurs embarqués 17 à 26 %, défaut 30 % ; enquêtes 45 à 50 % ; flottes 11 à 15 % (H11)
    [17, 26, 30, 45, 50, pc5(ecart("BE", "phev", 0.5)), pc5(ecart("BE", "phev", 0.3)), pcBas(ecart("BE", "phev", 0.11)), pcBas(ecart("BE", "phev", 0.15))],
    // Belgique : chiffre exact, comme en Q1 ; Allemagne et Pologne : réseau figé puis qui se décarbone
    [pc5(ecart("FR")), pc5(ecart("NO")), Math.round(ecart("BE") * 100),
      ...["DE", "PL"].flatMap((p) => [pc5(ecart(p, "ev", 0, { decarb: false })), pc5(ecart(p))])],
  ],
};

const LANGUES = ["fr", "en", "nl", "it", "es"];
const espaces = (t) => t.replace(/[\s  ]+/g, " ");
const mots = (t) => espaces(t).trim().split(" ").length;
function questions(lang) {
  const source = readFileSync(new URL(`./i18n/${lang}.jsx`, import.meta.url), "utf8");
  const bloc = source.split("\n  questions: [\n")[1].split("\n  ],\n")[0];
  return bloc.split("\n").map((l) => JSON.parse(l.trim().replace(/,$/, "")));
}
function contient(texte, n, locale) {
  const f = espaces(new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(n)).replace(/[.,]/g, "\\$&");
  return new RegExp(`(^|[^\\d.,])${f}(?![\\d]|[.,]\\d)`).test(espaces(texte));
}

test("les chiffres du modèle restent ceux qu'annoncent les textes (Belgique, profil par défaut)", () => {
  assert.deepEqual(CHIFFRES, {
    lede: [60],
    questions: [
      [16, 44, 63, 60, 64], [25000, 30000, 16000, 10000], [55, 73, 4, 11.4, 7, 25000, 30000], [22, 4.3, 10.5, 13.1],
      [17, 26, 30, 45, 50, 30, 15, 0, 2], [70, 70, 63, 45, 50, 15, 35],
    ],
  });
});

for (const lang of LANGUES) {
  test(`${lang} : intro de 40 à 60 mots et 6 questions-réponses de 40 à 80 mots, chiffres du modèle compris`, () => {
    // Toutes les erreurs d'une langue d'un coup (longueur et chiffres), pour corriger en un seul passage
    const locale = lireDico(lang, "locale");
    const lede = lireDico(lang, "lede");
    const erreurs = [];
    if (mots(lede) < 40 || mots(lede) > 60) erreurs.push(`intro : ${mots(lede)} mots (40 à 60)`);
    for (const n of CHIFFRES.lede) if (!contient(lede, n, locale)) erreurs.push(`intro : ${n} absent`);
    const qr = questions(lang);
    assert.equal(qr.length, CHIFFRES.questions.length);
    qr.forEach(([q, r], i) => {
      if (!q.endsWith("?")) erreurs.push(`${q} : pas de « ? »`);
      if (mots(r) < 40 || mots(r) > 80) erreurs.push(`${q} : ${mots(r)} mots (40 à 80)`);
      for (const n of CHIFFRES.questions[i]) if (!contient(r, n, locale)) erreurs.push(`${q} : ${n} absent`);
    });
    assert.deepEqual(erreurs, []);
  });
}
