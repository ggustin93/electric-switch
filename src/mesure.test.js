import { test } from "node:test";
import assert from "node:assert/strict";
import { UMAMI, evenement, mesurer } from "./mesure.js";

// Environnement de navigateur simulé : fetch espionné, aucune requête réelle
function env({ dnt = null, gpc = false, pathname = "/fr/", hostname = "electricornot.eu" } = {}) {
  const appels = [];
  return {
    appels,
    location: { hostname, pathname, hash: "#h5" },
    navigator: { language: "fr-BE", doNotTrack: dnt, globalPrivacyControl: gpc },
    fetch: (url, opts) => { appels.push({ url, opts }); return Promise.resolve(); },
  };
}

test("evenement : charge utile Umami documentée, page sans ancre ni saisie", () => {
  const e = evenement("page", { nom: "methode" }, env({ pathname: "/fr/methode/" }));
  assert.equal(e.type, "event");
  assert.equal(e.payload.name, "page");
  assert.equal(e.payload.url, "/methode");
  assert.deepEqual(e.payload.data, { nom: "methode" });
  assert.equal(evenement("verdict", {}, env()).payload.url, "/");
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
