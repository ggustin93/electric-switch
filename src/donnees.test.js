import { test } from "node:test";
import assert from "node:assert/strict";
import { sitemap, robots, ROBOTS_NOMMES, llmsTxt, jsonLd, dateGit } from "./donnees.js";
import { PAGES } from "./routes.js";

const LANGUES = ["fr", "en", "nl", "it", "es"];
const lireJsonLd = (balise) => JSON.parse(balise.match(/^<script type="application\/ld\+json">(.*)<\/script>$/)[1]);

test("sitemap : la racine + 5 outils + 5 × chaque page de lecture, URL absolues", () => {
  const xml = sitemap("https://x.eu", LANGUES);
  const locs = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
  assert.equal(locs.length, 1 + LANGUES.length * (1 + PAGES.length));
  assert.equal(locs[0], "https://x.eu/");
  assert.ok(locs.includes("https://x.eu/nl/") && locs.includes("https://x.eu/es/mentions/"));
  assert.match(xml, /^<\?xml version="1.0" encoding="UTF-8"\?>\n<urlset xmlns="http:\/\/www.sitemaps.org\/schemas\/sitemap\/0.9" xmlns:xhtml="http:\/\/www.w3.org\/1999\/xhtml">/);
  assert.doesNotMatch(xml, /priority|changefreq/);
});

test("sitemap : hreflang de chaque page, x-default racine (outil) ou anglais (lecture)", () => {
  const xml = sitemap("https://x.eu", LANGUES);
  const entree = (loc) => xml.split("\n").find((l) => l.includes(`<loc>${loc}</loc>`));
  assert.equal((entree("https://x.eu/fr/").match(/xhtml:link/g)).length, 6);
  assert.match(entree("https://x.eu/fr/"), /hreflang="x-default" href="https:\/\/x.eu\/"/);
  assert.match(entree("https://x.eu/it/methode/"), /hreflang="x-default" href="https:\/\/x.eu\/en\/methode\/"/);
  assert.match(entree("https://x.eu/it/methode/"), /hreflang="nl" href="https:\/\/x.eu\/nl\/methode\/"/);
});

test("sitemap : lastmod par langue quand une date est connue, rien sinon", () => {
  const xml = sitemap("https://x.eu", ["fr", "en"], (l) => (l === "fr" ? "2026-10-01" : undefined));
  assert.match(xml, /<loc>https:\/\/x.eu\/fr\/methode\/<\/loc><lastmod>2026-10-01<\/lastmod>/);
  assert.match(xml, /<loc>https:\/\/x.eu\/en\/<\/loc><xhtml:link/);
});

test("robots : tout admis, pas d'entraînement, robots de recherche nommés, sitemap", () => {
  const txt = robots("https://x.eu");
  assert.match(txt, /^User-agent: \*\nContent-Signal: search=yes, ai-input=yes, ai-train=no\nAllow: \/\n/);
  for (const r of ROBOTS_NOMMES) assert.match(txt, new RegExp(`^User-agent: ${r}$`, "m"));
  assert.ok(["Googlebot", "Bingbot", "OAI-SearchBot", "ChatGPT-User", "PerplexityBot", "Claude-SearchBot", "Claude-User"].every((r) => ROBOTS_NOMMES.includes(r)));
  assert.equal(txt.match(/Content-Signal/g).length, 2); // un robot nommé ignore le groupe « * »
  assert.doesNotMatch(txt, /Disallow/);
  assert.match(txt, /\nSitemap: https:\/\/x.eu\/sitemap.xml\n$/);
});

test("llms.txt : titre, résumé, un lien Méthode par langue", () => {
  const txt = llmsTxt("https://x.eu", [
    { lang: "fr", titre: "Électrique ?", lede: "Intro FR", intro: "Comment FR" },
    { lang: "en", titre: "Electric?", lede: "Intro EN", intro: "How EN" },
  ]);
  assert.match(txt, /^# Électrique \? · Electric\?\n\n> Intro EN\n/);
  assert.match(txt, /- \[Method \(fr\)\]\(https:\/\/x.eu\/fr\/methode\/\): Comment FR/);
  assert.match(txt, /- \[Method \(en\)\]\(https:\/\/x.eu\/en\/methode\/\): How EN/);
});

const P = { titre: "T", description: "D", nomSite: "Électrique ?", date: "2026-10-01", langues: LANGUES };

test("JSON-LD outil : éditeur, site et application gratuite, un seul bloc compact", () => {
  const balise = jsonLd("https://x.eu", "fr", "outil", P);
  assert.doesNotMatch(balise, /\n/);
  const { "@context": ctx, "@graph": g } = lireJsonLd(balise);
  assert.equal(ctx, "https://schema.org");
  assert.deepEqual(g.map((n) => n["@type"]), ["Organization", "WebSite", "WebApplication"]);
  const [org, site, app] = g;
  assert.equal(org.name, "Productions Associées ASBL");
  assert.equal(org.alternateName, "Pwablo");
  assert.deepEqual(org.sameAs, ["https://pwablo.be"]);
  assert.equal(org.address.addressCountry, "BE");
  assert.equal(site.url, "https://x.eu/");
  assert.equal(site.publisher["@id"], org["@id"]);
  assert.equal(app.url, "https://x.eu/fr/");
  assert.equal(app.applicationCategory, "EducationalApplication");
  assert.equal(app.isAccessibleForFree, true);
  assert.deepEqual(app.offers, { "@type": "Offer", price: "0", priceCurrency: "EUR" });
  assert.deepEqual(app.inLanguage, LANGUES);
  assert.ok(app.browserRequirements);
  assert.doesNotMatch(balise, /FAQPage|HowTo/);
});

test("JSON-LD Méthode : article technique de l'auteur (personne), publié par l'éditeur, sur l'application, daté", () => {
  const [art] = lireJsonLd(jsonLd("https://x.eu", "nl", "methode", P))["@graph"];
  assert.equal(art["@type"], "TechArticle");
  assert.equal(art.headline, "T");
  assert.equal(art.inLanguage, "nl");
  assert.equal(art.url, "https://x.eu/nl/methode/");
  assert.equal(art.dateModified, "2026-10-01");
  assert.equal(art.author["@type"], "Person");
  assert.equal(art.author.name, "Guillaume Gustin");
  assert.deepEqual(art.author.affiliation, { "@id": art.publisher["@id"] });
  assert.equal(art.publisher.name, "Productions Associées ASBL");
  assert.deepEqual(art.about, { "@type": "WebApplication", name: "Électrique ?", url: "https://x.eu/nl/" });
});

test("JSON-LD À propos : AboutPage dont l'entité principale est l'auteur", () => {
  const [page] = lireJsonLd(jsonLd("https://x.eu", "fr", "apropos", P))["@graph"];
  assert.equal(page["@type"], "AboutPage");
  assert.equal(page.mainEntity.name, "Guillaume Gustin");
  assert.deepEqual(page.author, { "@id": page.mainEntity["@id"] });
  assert.equal(page.mainEntity.sameAs, undefined); // seulement des profils réels
});

test("JSON-LD autres pages : simple WebPage ; sans date, pas de dateModified ; « < » échappé", () => {
  const balise = jsonLd("https://x.eu", "fr", "mentions", { ...P, date: undefined, description: "a </script> b" });
  assert.doesNotMatch(balise.slice(0, -9), /<\//);
  const [page] = lireJsonLd(balise)["@graph"];
  assert.equal(page["@type"], "WebPage");
  assert.equal(page.description, "a </script> b");
  assert.equal("dateModified" in page, false);
});

test("dateGit : date AAAA-MM-JJ du dernier commit, undefined pour un fichier inconnu", () => {
  assert.match(dateGit(["package.json"]), /^\d{4}-\d{2}-\d{2}$/);
  assert.equal(dateGit(["n-existe-pas.txt"]), undefined);
});
