import { defineConfig } from "vite";
import preact from "@preact/preset-vite";

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

// Preact sans couche de compatibilité React (−4 ko)
export default defineConfig({
  plugins: [preact({ reactAliasesEnabled: false }), pageUnique()],
  build: { assetsInlineLimit: 64 * 1024 },
});
