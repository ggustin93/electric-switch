// URL du site : une seule variable de build (SITE_URL). Changer de domaine = changer cette valeur.
// Utilisé au build seulement (vite.config.js, build.mjs), jamais dans le JS envoyé au navigateur.
export const SITE_URL_DEFAUT = "https://electric-switch.guillaume-gustin-9.workers.dev";

export const siteUrl = (env) => (env.SITE_URL || SITE_URL_DEFAUT).replace(/\/+$/, "");

// [hreflang, URL absolue] : chaque langue, puis x-default vers la racine qui redirige (ADR 0006)
export const alternates = (site, langues) => [...langues.map((l) => [l, `${site}/${l}/`]), ["x-default", `${site}/`]];

export const enTeteLink = (site, langues) =>
  alternates(site, langues).map(([l, href]) => `<${href}>; rel="alternate"; hreflang="${l}"`).join(", ");
