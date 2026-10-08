import { PAGES, chemin } from "./routes.js";

// URL du site : une seule variable de build (SITE_URL). Changer de domaine = changer cette valeur.
// Utilisé au build seulement (vite.config.js, build.mjs), jamais dans le JS envoyé au navigateur.
import { readFileSync } from "node:fs";

export const SITE_URL_DEFAUT = "https://electricornot.eu";

export const siteUrl = (env) => (env.SITE_URL || SITE_URL_DEFAUT).replace(/\/+$/, "");

// [hreflang, URL absolue] : la page dans chaque langue, puis x-default : la racine qui redirige
// pour l'outil (ADR 0006), la version anglaise pour une page de lecture (ADR 0009)
export const alternates = (site, langues, page = "outil") => [
  ...langues.map((l) => [l, site + chemin(l, page)]),
  ["x-default", page === "outil" ? `${site}/` : site + chemin("en", page)],
];

export const enTeteLink = (site, langues, page) =>
  alternates(site, langues, page).map(([l, href]) => `<${href}>; rel="alternate"; hreflang="${l}"`).join(", ");

// Texte au format _headers, traduit en dist/.htaccess (src/entetes.js) : une règle par chemin exact, chacun avec les hreflang de sa propre page
export const fichierHeaders = (site, langues) =>
  ["outil", ...PAGES].flatMap((page) =>
    [...(page === "outil" ? ["/"] : []), ...langues.map((l) => chemin(l, page))]
      .map((c) => `${c}\n  Link: ${enTeteLink(site, langues, page)}\n`)).join("");

// Chaîne simple sur une ligne d'un dictionnaire (titre, lede…), lue au build sans charger le JSX
export const lireDico = (lang, cle) => {
  const source = readFileSync(new URL(`./i18n/${lang}.jsx`, import.meta.url), "utf8");
  return JSON.parse(source.match(new RegExp(`^  ${cle}: (".*"),$`, "m"))[1]);
};

// Aperçu au partage (ticket 03) : image 1200×630 par langue, dist/og/<lang>.png (scripts/apercus.mjs)
export const LOCALE_OG = { fr: "fr_BE", en: "en_GB", nl: "nl_BE", it: "it_IT", es: "es_ES" };
// Sous-titre de l'image (et de son texte alternatif), repris des formulations des dictionnaires
export const SOUS_TITRE = {
  fr: "Votre empreinte carbone, fabrication de la batterie comprise",
  en: "Your carbon footprint, battery manufacturing included",
  nl: "Uw CO₂-voetafdruk, inclusief de productie van de batterij",
  it: "La tua impronta di carbonio, produzione della batteria compresa",
  es: "Tu huella de carbono, fabricación de la batería incluida",
};

const echapper = (t) => t.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");

// Sans `page` : le minimum pour les pages de langue. Chaque <meta> compte dans le DOM et la page est
// au plafond de l'EcoIndex A (ADR 0008) : og:image + twitter:card ; titre, description et URL viennent
// de <title>, de la description et de la canonique, que lisent WhatsApp, LinkedIn, Slack, Mastodon, Facebook.
// Avec `page` ({ url, titre, description }) : le jeu complet (page racine, DOM minuscule).
export function balisesApercu(site, lang, page) {
  const image = `${site}/og/${lang}.png`;
  const og = page ? [
    ["og:type", "website"], ["og:site_name", page.titre], ["og:url", page.url],
    ["og:title", page.titre], ["og:description", page.description],
    ["og:image", image], ["og:image:width", "1200"], ["og:image:height", "630"],
    ["og:image:alt", `${page.titre} ${SOUS_TITRE[lang]}`],
    ["og:locale", LOCALE_OG[lang]],
    ...Object.entries(LOCALE_OG).filter(([l]) => l !== lang).map(([, loc]) => ["og:locale:alternate", loc]),
  ] : [["og:image", image]];
  return [...og.map(([p, v]) => `<meta property="${p}" content="${echapper(v)}" />`),
    '<meta name="twitter:card" content="summary_large_image" />'].join("\n");
}
