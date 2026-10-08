import { defineConfig, runnerImport } from "vite";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import preact from "@preact/preset-vite";
import { h } from "preact";
import { renderToString } from "preact-render-to-string";
import { siteUrl } from "./src/seo.js";

// Une page par langue (ADR 0006) : LANGUE=nl vite build → dist/nl/index.html avec le seul dictionnaire néerlandais.
// Sans LANGUE (dev, preview) : français, et `vite preview` sert tout dist/.
const LANGUE = process.env.LANGUE || "fr";
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
      return html.replace('<div id="root"></div>', () => `<div id="root">${renderToString(h(module.default))}</div>`);
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

// <html lang>, titre, description et URL canonique propres à la langue de la page.
// Les liens hreflang passent par l'en-tête HTTP Link (dist/_headers) : 6 balises <link> de plus
// feraient passer la page en EcoIndex B (ADR 0006, 0008). Seule la canonique est dans le <head>.
function enteteLangue() {
  const echapper = (t) => t.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");
  return {
    name: "entete-langue",
    transformIndexHtml(html) {
      // titre et lede sont des chaînes simples sur une ligne dans chaque dictionnaire
      const source = readFileSync(new URL(`./src/i18n/${LANGUE}.jsx`, import.meta.url), "utf8");
      const lire = (cle) => JSON.parse(source.match(new RegExp(`^  ${cle}: (".*"),$`, "m"))[1]);
      const s = { titre: lire("titre"), lede: lire("lede") };
      return html
        .replace('<html lang="fr">', `<html lang="${LANGUE}">`)
        .replace(/<title>.*?<\/title>/, `<title>${echapper(s.titre)}</title>`)
        .replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${echapper(s.lede)}" />`)
        .replace("</head>", `<link rel="canonical" href="${SITE}/${LANGUE}/" />\n  </head>`);
    },
  };
}

// Preact sans couche de compatibilité React (−4 ko)
export default defineConfig({
  plugins: [preact({ reactAliasesEnabled: false }), enteteLangue(), prerendu(), pageUnique()],
  resolve: { alias },
  build: {
    assetsInlineLimit: 64 * 1024,
    outDir: process.env.LANGUE ? `dist/${LANGUE}` : "dist",
  },
});
