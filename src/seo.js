import { PAGES, chemin } from "./routes.js";

// URL du site : une seule variable de build (SITE_URL). Changer de domaine = changer cette valeur.
// Utilisé au build seulement (vite.config.js, build.mjs), jamais dans le JS envoyé au navigateur.
export const SITE_URL_DEFAUT = "https://electric-switch.guillaume-gustin-9.workers.dev";

export const siteUrl = (env) => (env.SITE_URL || SITE_URL_DEFAUT).replace(/\/+$/, "");

// [hreflang, URL absolue] : la page dans chaque langue, puis x-default : la racine qui redirige
// pour l'outil (ADR 0006), la version anglaise pour une page de lecture (ADR 0009)
export const alternates = (site, langues, page = "outil") => [
  ...langues.map((l) => [l, site + chemin(l, page)]),
  ["x-default", page === "outil" ? `${site}/` : site + chemin("en", page)],
];

export const enTeteLink = (site, langues, page) =>
  alternates(site, langues, page).map(([l, href]) => `<${href}>; rel="alternate"; hreflang="${l}"`).join(", ");

// dist/_headers (Cloudflare) : une règle par chemin exact, chacun avec les hreflang de sa propre page
export const fichierHeaders = (site, langues) =>
  ["outil", ...PAGES].flatMap((page) =>
    [...(page === "outil" ? ["/"] : []), ...langues.map((l) => chemin(l, page))]
      .map((c) => `${c}\n  Link: ${enTeteLink(site, langues, page)}\n`)).join("");
