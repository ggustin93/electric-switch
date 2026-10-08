import { test } from "node:test";
import assert from "node:assert/strict";
import { SITE_URL_DEFAUT, siteUrl, alternates, enTeteLink } from "./seo.js";

test("siteUrl : variable SITE_URL, sinon l'URL par défaut, sans barre finale", () => {
  assert.equal(siteUrl({}), SITE_URL_DEFAUT);
  assert.equal(siteUrl({ SITE_URL: "https://electricornot.eu/" }), "https://electricornot.eu");
});

test("alternates : une URL absolue par langue, puis x-default vers la racine", () => {
  assert.deepEqual(alternates("https://x.eu", ["fr", "en"]), [
    ["fr", "https://x.eu/fr/"], ["en", "https://x.eu/en/"], ["x-default", "https://x.eu/"],
  ]);
});

test("enTeteLink : mêmes URL absolues que les balises, au format de l'en-tête HTTP Link", () => {
  assert.equal(enTeteLink("https://x.eu", ["fr"]),
    '<https://x.eu/fr/>; rel="alternate"; hreflang="fr", <https://x.eu/>; rel="alternate"; hreflang="x-default"');
});
