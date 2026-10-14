import { test } from "node:test";
import assert from "node:assert/strict";
import { UMAMI, evenement, mesurer, vue, suivreClic, refuse, choisirRefus } from "./mesure.js";

// Environnement de navigateur simulé : fetch espionné, aucune requête réelle
function env({ dnt = null, gpc = false, pathname = "/fr/", hostname = "electricornot.eu", search = "", referrer = "" } = {}) {
  const appels = [];
  return {
    appels,
    location: { hostname, pathname, search, hash: "#h5", href: `https://${hostname}${pathname}${search}` },
    document: { referrer, title: "Titre" },
    navigator: { language: "fr-BE", doNotTrack: dnt, globalPrivacyControl: gpc },
    fetch: (url, opts) => { appels.push({ url, opts }); return Promise.resolve(); },
  };
}

test("evenement : charge utile Umami documentée, chemin avec langue, ni ancre ni saisie, UTM gardés", () => {
  const e = evenement("verdict", { verdict: "garder" }, env({ pathname: "/fr/methode/", search: "?km=1&utm_source=lkd" }));
  assert.equal(e.type, "event");
  assert.equal(e.payload.name, "verdict");
  assert.equal(e.payload.url, "/fr/methode/?utm_source=lkd");
  assert.deepEqual(e.payload.data, { verdict: "garder" });
  const v = evenement(null, undefined, env({ referrer: "https://www.google.com/search?q=x" })).payload;
  assert.ok(!("name" in v), "sans nom = page vue");
  assert.equal(v.referrer, "https://www.google.com/search");
  assert.equal(evenement(null, undefined, env({ referrer: "https://electricornot.eu/fr/" })).payload.referrer, "");
});

test("mesurer : désactivée sans identifiant, hors production (localhost, preview), respecte Do Not Track et GPC", () => {
  const sans = env();
  UMAMI.website = "";
  assert.equal(mesurer("verdict", {}, sans), false);
  assert.equal(sans.appels.length, 0);

  UMAMI.website = "id-test";
  for (const e of [env({ dnt: "1" }), env({ gpc: true }), env({ hostname: "localhost" }), env({ hostname: "www.electricornot.eu" })]) {
    assert.equal(mesurer("verdict", {}, e), false);
    assert.equal(e.appels.length, 0);
  }

  const ok = env();
  assert.equal(mesurer("verdict", { verdict: "garder" }, ok), true);
  assert.equal(ok.appels.length, 1);
  assert.equal(ok.appels[0].url, UMAMI.endpoint);
  assert.equal(JSON.parse(ok.appels[0].opts.body).payload.website, "id-test");
  UMAMI.website = "";
});

test("vue et suivreClic : page vue, bouton marqué, lien sortant, langue, lien interne ignoré", () => {
  UMAMI.website = "id-test";
  const corps = (e) => JSON.parse(e.appels.at(-1).opts.body).payload;
  const e = env();
  assert.equal(vue(e), true);
  assert.ok(!("name" in corps(e)));
  const el = (attrs) => ({ closest: () => attrs });
  suivreClic(el({ dataset: { ev: "cta", id: "duel" } }), "fr", e);
  assert.deepEqual([corps(e).name, corps(e).data], ["cta", { id: "duel", lang: "fr" }]);
  suivreClic(el({ dataset: {}, hreflang: "nl", href: "https://electricornot.eu/nl/" }), "fr", e);
  assert.deepEqual(corps(e).data, { de: "fr", vers: "nl" });
  suivreClic(el({ dataset: {}, href: "https://impactco2.fr/outils/transport?x=1" }), "fr", e);
  assert.deepEqual([corps(e).name, corps(e).data.vers], ["sortie", "impactco2.fr/outils/transport"]);
  const n = e.appels.length;
  assert.equal(suivreClic(el({ dataset: {}, href: "/fr/methode/" }), "fr", e), false);
  assert.equal(suivreClic({ closest: () => null }, "fr", e), false);
  assert.equal(e.appels.length, n);
  UMAMI.website = "";
});

test("refus et sobriété : rien après « Ne pas être mesuré », un clic identique n'est envoyé qu'une fois, le verdict toujours", () => {
  UMAMI.website = "id-test";
  const stock = new Map();
  const e = { ...env(), localStorage: { getItem: (k) => stock.get(k) ?? null, setItem: (k, v) => stock.set(k, v), removeItem: (k) => stock.delete(k) } };
  assert.equal(mesurer("aide", { id: "km-unique" }, e), true);
  assert.equal(mesurer("aide", { id: "km-unique" }, e), false);
  assert.equal(mesurer("verdict", { verdict: "x" }, e), true);
  assert.equal(mesurer("verdict", { verdict: "x" }, e), true);
  choisirRefus(true, e);
  assert.equal(refuse(e), true);
  assert.equal(vue(e), false);
  choisirRefus(false, e);
  assert.equal(vue(e), true);
  UMAMI.website = "";
});
