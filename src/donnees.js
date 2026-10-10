// Données pour les moteurs et les IA (ticket 04) : sitemap.xml, robots.txt, llms.txt, JSON-LD.
// Utilisé au build seulement (vite.config.js, build.mjs), jamais dans le JS envoyé au navigateur.
import { execFileSync } from "node:child_process";
import { alternates } from "./seo.js";
import { PAGES, chemin } from "./routes.js";

// Date (AAAA-MM-JJ) du dernier commit touchant ces fichiers ; undefined hors dépôt git
export function dateGit(fichiers) {
  try {
    return execFileSync("git", ["log", "-1", "--format=%cs", "--", ...fichiers], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim() || undefined;
  } catch { return undefined; }
}
// Sources d'une page dans une langue : son contenu vient de l'appli, du modèle et du dictionnaire
export const sourcesPage = (lang) => ["src/App.jsx", "src/model.js", "src/i18n/commun.jsx", `src/i18n/${lang}.jsx`];

const echapperXml = (t) => t.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll('"', "&quot;");

// La racine, puis chaque page dans chaque langue, avec ses versions linguistiques (mêmes hreflang que dist/.htaccess).
// date(lang) → lastmod ou undefined (lang null : la racine). Ni priority ni changefreq (ignorés par Google).
export function sitemap(site, langues, date = () => undefined) {
  const url = (loc, page, d) => `<url><loc>${echapperXml(loc)}</loc>${d ? `<lastmod>${d}</lastmod>` : ""}${alternates(site, langues, page)
    .map(([l, href]) => `<xhtml:link rel="alternate" hreflang="${l}" href="${echapperXml(href)}"/>`).join("")}</url>`;
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${[url(`${site}/`, "outil", date(null)),
    ...["outil", ...PAGES].flatMap((page) => langues.map((l) => url(site + chemin(l, page), page, date(l))))].join("\n")}
</urlset>
`;
}

// robots.txt du site : moteurs de recherche et IA de recherche/réponse admis,
// pas d'entraînement (Content-Signal). Un robot nommé ignore le groupe « * » : le signal est répété.
export const ROBOTS_NOMMES = ["Googlebot", "Bingbot", "OAI-SearchBot", "ChatGPT-User", "PerplexityBot", "Claude-SearchBot", "Claude-User"];
export const robots = (site) => `User-agent: *
Content-Signal: search=yes, ai-input=yes, ai-train=no
Allow: /

${ROBOTS_NOMMES.map((r) => `User-agent: ${r}`).join("\n")}
Content-Signal: search=yes, ai-input=yes, ai-train=no
Allow: /

Sitemap: ${site}/sitemap.xml
`;

// llms.txt : résumé Markdown et liens vers la Méthode de chaque langue. entrees : [{ lang, titre, lede, intro }]
export const llmsTxt = (site, entrees) => `# ${entrees.map((e) => e.titre).join(" · ")}

> ${entrees.find((e) => e.lang === "en")?.lede ?? entrees[0].lede}

Free educational simulator: life-cycle carbon footprint (manufacturing, battery included, plus use) and running costs of keeping your car versus switching to an electric one. 14 countries, numbered assumptions, open sources. No account, no tracking cookies.

## Method (assumptions and sources)

${entrees.map((e) => `- [Method (${e.lang})](${site}${chemin(e.lang, "methode")}): ${e.intro}`).join("\n")}

## Simulator

${entrees.map((e) => `- [${e.titre} (${e.lang})](${site}${chemin(e.lang)})`).join("\n")}
`;

// Éditeur du site : seulement des profils réels dans sameAs
export const ORGANISATION = {
  "@type": "Organization",
  "@id": "https://pwablo.be/#organisation",
  name: "Productions Associées ASBL",
  alternateName: "Pwablo",
  url: "https://pwablo.be",
  email: "hello@pwablo.be",
  address: { "@type": "PostalAddress", addressLocality: "Bruxelles", addressCountry: "BE" },
  sameAs: ["https://pwablo.be"],
};

// Auteur (signal E-E-A-T de la Méthode et d'À propos) ; aucun sameAs tant qu'aucun profil réel n'est fourni
export const AUTEUR = {
  "@type": "Person",
  "@id": "https://pwablo.be/#guillaume-gustin",
  name: "Guillaume Gustin",
  alternateName: "Pwablo",
  jobTitle: "Ingénieur logiciel indépendant",
  url: "https://pwablo.be",
  address: { "@type": "PostalAddress", addressLocality: "Bruxelles", addressCountry: "BE" },
  affiliation: { "@id": ORGANISATION["@id"] },
};

// Un bloc JSON-LD (@graph) par page. Un <script> compte dans le DOM (EcoIndex) : un seul, compact.
// p : { titre (titre de la page), description, nomSite (titre de l'outil), date, langues }
// Ni FAQPage ni HowTo (spec). JSON-LD = données, jamais exécutées : hors CSP script-src (src/entetes.js).
export function jsonLd(site, lang, page, p) {
  const editeur = { "@id": ORGANISATION["@id"] };
  const appli = { "@type": "WebApplication", name: p.nomSite, url: site + chemin(lang) };
  const graphe = page === "outil" ? [
    ORGANISATION,
    { "@type": "WebSite", name: p.nomSite, url: `${site}/`, inLanguage: p.langues, publisher: editeur },
    {
      ...appli, description: p.description, inLanguage: p.langues,
      applicationCategory: "EducationalApplication", operatingSystem: "Any", browserRequirements: "Requires JavaScript",
      isAccessibleForFree: true, offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
      publisher: editeur,
    },
  ] : [{
    "@type": { methode: "TechArticle", apropos: "AboutPage" }[page] ?? "WebPage",
    [page === "methode" ? "headline" : "name"]: p.titre, description: p.description, inLanguage: lang,
    url: site + chemin(lang, page), ...(p.date && { dateModified: p.date }),
    ...(page === "methode" && { author: AUTEUR, publisher: ORGANISATION, about: appli }),
    ...(page === "apropos" && { mainEntity: AUTEUR, author: { "@id": AUTEUR["@id"] } }),
    ...(page !== "methode" && { publisher: ORGANISATION, isPartOf: appli }),
  }];
  // « < » échappé : le contenu ne peut pas fermer la balise
  return `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": graphe }).replaceAll("<", "\\u003c")}</script>`;
}
