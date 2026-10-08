import { defineConfig } from "vite";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import preact from "@preact/preset-vite";

// Une page par langue (ADR 0006) : LANGUE=nl vite build → dist/nl/index.html avec le seul dictionnaire néerlandais.
// Sans LANGUE (dev, preview) : français, et `vite preview` sert tout dist/.
const LANGUE = process.env.LANGUE || "fr";

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

// <html lang>, titre et description propres à la langue de la page.
// Les liens hreflang passent par l'en-tête HTTP Link (dist/_headers) : 0 élément DOM (EcoIndex)
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
        .replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${echapper(s.lede)}" />`);
    },
  };
}

// Preact sans couche de compatibilité React (−4 ko)
export default defineConfig({
  plugins: [preact({ reactAliasesEnabled: false }), enteteLangue(), pageUnique()],
  resolve: { alias: { "@langue": fileURLToPath(new URL(`./src/i18n/${LANGUE}.jsx`, import.meta.url)) } },
  build: {
    assetsInlineLimit: 64 * 1024,
    outDir: process.env.LANGUE ? `dist/${LANGUE}` : "dist",
  },
});
