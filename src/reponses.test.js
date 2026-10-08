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
const vie = (paysId, motor, phev = 0.5) => {
  const p = byId(PAYS, paysId);
  return calc(motor, seg, mixMoyen(p.g, VIE_KM / 15000, true, p.declin), VIE_KM, 1, phev, ef);
};
const ecart = (paysId, motor = "ev", phev) => 1 - vie(paysId, motor, phev).totalT / vie(paysId, "essence").totalT;
// Profil par défaut de « Ma décision » (App.jsx) : Belgique, essence à 6,5 L/100 km qui roulerait encore 5 ans, 12 000 km/an
const profil = { carb: "essence", conso: 6.5, annees: 5, seg, etatVE: "neuf", ageVE: 3, pays: byId(PAYS, "BE"), decarb: true, efBatt: ef, kmAn: 12000 };
const occasion = decider({ ...profil, etatVE: "occasion", ageVE: 6 });

const r1 = (x) => Math.round(x * 10) / 10;
const pc5 = (x) => Math.round(x * 20) * 5; // pourcentage arrondi à 5 près
const pc10bas = (x) => Math.floor(x * 10) * 10; // « plus de … % » : arrondi par défaut, jamais surévalué

const CHIFFRES = {
  lede: [pc10bas(ecart("BE"))],
  questions: [
    [Math.round(vie("BE", "ev").totalT), Math.round(vie("BE", "essence").totalT), Math.round(ecart("BE") * 100)],
    [Math.round(kmPivot(vie("BE", "ev"), vie("BE", "essence"), VIE_KM) / 1000) * 1000, kmBascule(profil), kmBascule({ ...profil, annees: 8 })],
    [seg.battKwh, ef, r1((seg.battKwh * ef) / 1000), r1(vie("BE", "ev").fabTotale), r1(vie("BE", "essence").fabTotale)],
    [Math.round(occasion.partVE * 100), r1(occasion.tRemplacer), r1(occasion.tGarder), r1(decider(profil).tRemplacer)],
    [pc5(ecart("BE", "phev", 0.5)), 15, Math.round(ecart("BE", "phev", 0.15) * 100)],
    ["FR", "NO", "BE", "DE", "PL"].map((p) => (p === "BE" ? Math.round(ecart(p) * 100) : pc5(ecart(p)))), // Belgique : chiffre exact, comme en Q1
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
    questions: [[16, 44, 63], [27000, 15500, 10000], [55, 73, 4, 11.4, 7], [22, 4.2, 10.5, 13], [30, 15, 3], [70, 70, 63, 50, 35]],
  });
});

for (const lang of LANGUES) {
  test(`${lang} : intro de 40 à 60 mots et 6 questions-réponses de 40 à 80 mots, chiffres du modèle compris`, () => {
    const locale = lireDico(lang, "locale");
    const lede = lireDico(lang, "lede");
    assert.ok(mots(lede) >= 40 && mots(lede) <= 60, `intro : ${mots(lede)} mots`);
    for (const n of CHIFFRES.lede) assert.ok(contient(lede, n, locale), `intro sans ${n}`);
    const qr = questions(lang);
    assert.equal(qr.length, CHIFFRES.questions.length);
    qr.forEach(([q, r], i) => {
      assert.ok(q.endsWith("?"), q);
      assert.ok(mots(r) >= 40 && mots(r) <= 80, `${q} : ${mots(r)} mots`);
      for (const n of CHIFFRES.questions[i]) assert.ok(contient(r, n, locale), `${q} : ${n} absent`);
    });
  });
}
