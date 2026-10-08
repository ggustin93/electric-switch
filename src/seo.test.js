import { test } from "node:test";
import assert from "node:assert/strict";
import { SITE_URL_DEFAUT, siteUrl, alternates, enTeteLink, fichierHeaders } from "./seo.js";

test("siteUrl : variable SITE_URL, sinon l'URL par défaut, sans barre finale", () => {
  assert.equal(siteUrl({}), SITE_URL_DEFAUT);
  assert.equal(siteUrl({ SITE_URL: "https://electricornot.eu/" }), "https://electricornot.eu");
});

test("alternates : une URL absolue par langue, puis x-default vers la racine", () => {
  assert.deepEqual(alternates("https://x.eu", ["fr", "en"]), [
    ["fr", "https://x.eu/fr/"], ["en", "https://x.eu/en/"], ["x-default", "https://x.eu/"],
  ]);
});

test("alternates d'une page de lecture : ses versions linguistiques, x-default vers l'anglais", () => {
  assert.deepEqual(alternates("https://x.eu", ["fr", "en"], "methode"), [
    ["fr", "https://x.eu/fr/methode/"], ["en", "https://x.eu/en/methode/"], ["x-default", "https://x.eu/en/methode/"],
  ]);
});

test("enTeteLink : mêmes URL absolues que les balises, au format de l'en-tête HTTP Link", () => {
  assert.equal(enTeteLink("https://x.eu", ["fr"]),
    '<https://x.eu/fr/>; rel="alternate"; hreflang="fr", <https://x.eu/>; rel="alternate"; hreflang="x-default"');
});

test("fichierHeaders : chaque chemin porte les hreflang de sa propre page, jamais ceux d'une autre", () => {
  const regles = Object.fromEntries(fichierHeaders("https://x.eu", ["fr", "nl"])
    .split("\n").reduce((acc, ligne) => {
      if (ligne.startsWith("/")) acc.push([ligne, ""]);
      else if (ligne.trim()) acc.at(-1)[1] += ligne.trim();
      return acc;
    }, []));
  assert.deepEqual(Object.keys(regles), [
    "/", "/fr/", "/nl/", "/fr/methode/", "/nl/methode/", "/fr/ecoconception/", "/nl/ecoconception/", "/fr/mentions/", "/nl/mentions/",
  ]);
  assert.equal(regles["/nl/"], `Link: ${enTeteLink("https://x.eu", ["fr", "nl"])}`);
  assert.equal(regles["/fr/methode/"], regles["/nl/methode/"]);
  assert.equal(regles["/fr/methode/"], `Link: ${enTeteLink("https://x.eu", ["fr", "nl"], "methode")}`);
  assert.ok(!regles["/fr/mentions/"].includes("/methode/"));
});
