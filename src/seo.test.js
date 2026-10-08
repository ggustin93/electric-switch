import { test } from "node:test";
import assert from "node:assert/strict";
import { SITE_URL_DEFAUT, siteUrl, alternates, enTeteLink, balisesApercu, lireDico, SOUS_TITRE, LOCALE_OG } from "./seo.js";

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

test("balisesApercu : page de langue = image absolue + grande carte, rien d'autre (budget DOM, EcoIndex A)", () => {
  assert.equal(balisesApercu("https://x.eu", "nl"),
    '<meta property="og:image" content="https://x.eu/og/nl.png" />\n<meta name="twitter:card" content="summary_large_image" />');
});

test("balisesApercu : jeu complet pour la page racine, locale et alternatives, texte échappé", () => {
  const html = balisesApercu("https://x.eu", "en", { url: "https://x.eu/", titre: 'A "B" & C', description: "D" });
  for (const m of [
    '<meta property="og:type" content="website" />',
    '<meta property="og:url" content="https://x.eu/" />',
    '<meta property="og:title" content="A &quot;B&quot; &amp; C" />',
    '<meta property="og:image:width" content="1200" />',
    '<meta property="og:image:alt" content="A &quot;B&quot; &amp; C Your carbon footprint, battery manufacturing included" />',
    '<meta property="og:locale" content="en_GB" />',
    '<meta property="og:locale:alternate" content="fr_BE" />',
  ]) assert.ok(html.includes(m), m);
  assert.ok(!html.includes('alternate" content="en_GB'));
  assert.deepEqual(Object.keys(SOUS_TITRE), Object.keys(LOCALE_OG));
});

test("lireDico : chaîne simple d'un dictionnaire", () => {
  assert.equal(lireDico("en", "titre"), "Should I switch to electric?");
});
