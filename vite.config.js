import { defineConfig, runnerImport } from "vite";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import preact from "@preact/preset-vite";
import { h } from "preact";
import { renderToString } from "preact-render-to-string";
import { siteUrl, balisesApercu } from "./src/seo.js";
import { chemin, LANGUES } from "./src/routes.js";
import { jsonLd, dateGit, sourcesPage } from "./src/donnees.js";

// Une page par langue (ADR 0006) : LANGUE=nl vite build → dist/nl/index.html avec le seul dictionnaire néerlandais.
// Une page de lecture par fichier (ADR 0009) : LANGUE=nl PAGE=methode vite build → dist/nl/methode/index.html.
// Sans LANGUE (dev, preview) : français, et `vite preview` sert tout dist/.
const LANGUE = process.env.LANGUE || "fr";
const PAGE = process.env.PAGE || "outil";
const SITE = siteUrl(process.env);
const alias = { "@langue": fileURLToPath(new URL(`./src/i18n/${LANGUE}.jsx`, import.meta.url)) };

// Pré-rendu : la page arrive avec le premier écran (titre, intro, onglets, étape 1) déjà dans #root,
// lisible sans JS par les moteurs et les aperçus de liens ; main.jsx l'hydrate. Rendu déterministe :
// l'appli ne lit l'ancre et le pays du navigateur qu'après hydratation (App.jsx).
function prerendu() {
  return {
    name: "prerendu",
    apply: "build",
    async transformIndexHtml(html) {
      const { module } = await runnerImport(fileURLToPath(new URL("./src/App.jsx", import.meta.url)), {
        resolve: { alias }, oxc: { jsx: { runtime: "automatic", importSource: "preact" } }, logLevel: "warn",
      });
      return html.replace('<div id="root" class="page"></div>', () => `<div id="root" class="page">${renderToString(h(module.default, { page: PAGE }))}</div>`);
    },
  };
}

// Page unique : CSS, JS et police sont intégrés au HTML → une seule requête (ADR 0004)
function pageUnique() {
  return {
    name: "page-unique",
    apply: "build",
    enforce: "post",
    generateBundle(_, bundle) {
      const page = bundle["index.html"];
      let html = page.source;
      for (const [nom, fichier] of Object.entries(bundle)) {
        if (nom.endsWith(".css")) {
          html = html.replace(new RegExp(`<link[^>]*href="/${nom}"[^>]*>`), () => `<style>${fichier.source}</style>`);
          delete bundle[nom];
        } else if (nom.endsWith(".js")) {
          const code = fichier.code.replaceAll("</script", "<\\/script");
          html = html.replace(new RegExp(`<script([^>]*) src="/${nom}"></script>`), (_m, attrs) => `<script${attrs}>${code}</script>`);
          delete bundle[nom];
        }
      }
      page.source = html;
    },
  };
}

// <html lang>, titre, description et URL canonique propres à la langue et à la page.
// Les liens hreflang passent par l'en-tête HTTP Link (dist/.htaccess) : 6 balises <link> de plus
// feraient passer la page en EcoIndex B (ADR 0006, 0008). Seule la canonique est dans le <head>.
function enteteLangue() {
  const echapper = (t) => t.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");
  return {
    name: "entete-langue",
    transformIndexHtml(html) {
      // titre, intros et noms de pages (pages: { … }) sont des chaînes simples sur une ligne dans chaque dictionnaire
      const source = readFileSync(new URL(`./src/i18n/${LANGUE}.jsx`, import.meta.url), "utf8");
      const lire = (motif) => JSON.parse(source.match(new RegExp(motif, "m"))[1]);
      const cle = (c) => lire(`^  ${c}: (".*"),$`);
      // Outil : titre complet (« Voiture électrique ou thermique : … »). Page de lecture : son nom suivi du
      // nom court du site (« Méthode · Dois-je passer à l'électrique ? »), description = son introduction
      const intro = { outil: "lede", methode: "methodeIntro", ecoconception: "ecoIntro", mentions: "mentionsIntro", questions: "questionsIntro", apropos: "aproposIntro" }[PAGE];
      const s = {
        titre: PAGE === "outil" ? cle("titre") : `${lire(`^  pages: \\{.*\\b${PAGE}: ("[^"]*")`)} · ${cle("nomSite")}`,
        lede: cle(intro),
      };
      return html
        .replace('<html lang="fr">', `<html lang="${LANGUE}">`)
        .replace(/<title>.*?<\/title>/, `<title>${echapper(s.titre)}</title>`)
        .replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${echapper(s.lede)}" />`)
        .replace("</head>", `<link rel="canonical" href="${SITE}${chemin(LANGUE, PAGE)}" />\n${balisesApercu(SITE, LANGUE)}\n${jsonLd(SITE, LANGUE, PAGE, {
          titre: s.titre, description: s.lede, nomSite: cle("titre"), langues: LANGUES, date: PAGE === "outil" ? undefined : dateGit(sourcesPage(LANGUE)),
        })}\n  </head>`);
    },
  };
}

// Preact sans couche de compatibilité React (−4 ko)
export default defineConfig({
  plugins: [preact({ reactAliasesEnabled: false }), enteteLangue(), prerendu(), pageUnique()],
  resolve: { alias },
  build: {
    assetsInlineLimit: 64 * 1024,
    outDir: process.env.LANGUE ? `dist${chemin(LANGUE, PAGE)}` : "dist",
  },
});
