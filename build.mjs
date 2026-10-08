// Construit une page autonome par langue (dist/fr/, dist/en/…) puis la page racine qui redirige (ADR 0006).
import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { siteUrl, alternates, enTeteLink } from "./src/seo.js";
import { entetesSecurite } from "./src/entetes.js";

const LANGUES = ["fr", "en", "nl", "it", "es"];
const SITE = siteUrl(process.env); // SITE_URL=https://electricornot.eu npm run build
rmSync("dist", { recursive: true, force: true });
for (const l of LANGUES) {
  execFileSync("npx", ["vite", "build", "--logLevel", "warn"], { stdio: "inherit", env: { ...process.env, LANGUE: l } });
}

// Racine « / » : langue mémorisée, sinon celle du navigateur, sinon l'anglais. ≈ 1 ko, pas de JS externe.
const liens = alternates(SITE, LANGUES).map(([l, href]) => `<link rel="alternate" hreflang="${l}" href="${href}" />`).join("\n");
writeFileSync("dist/index.html", `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Dois-je passer à l'électrique ? · Should I switch to electric?</title>
${liens}
<script>
var L = ${JSON.stringify(LANGUES)}, l;
try { l = localStorage.getItem("lang"); } catch (e) {}
if (L.indexOf(l) < 0) { l = (navigator.language || "en").slice(0, 2).toLowerCase(); if (L.indexOf(l) < 0) l = "en"; }
location.replace("/" + l + "/" + location.hash);
</script>
</head>
<body>
<p>${LANGUES.map((l) => `<a href="/${l}/">${l.toUpperCase()}</a>`).join(" · ")}</p>
</body>
</html>
`);
// Page 404 (wrangler.jsonc : not_found_handling) : HTML statique sans JS, jetons du site, clair + sombre, 5 langues.
const INTROUVABLE = {
  fr: ["Page introuvable.", "Retour au simulateur"],
  en: ["Page not found.", "Back to the simulator"],
  nl: ["Pagina niet gevonden.", "Terug naar de simulator"],
  it: ["Pagina non trovata.", "Torna al simulatore"],
  es: ["Página no encontrada.", "Volver al simulador"],
};
writeFileSync("dist/404.html", `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="color-scheme" content="light dark" />
<meta name="robots" content="noindex" />
<title>404 · Page introuvable · Page not found</title>
<style>
:root{--bg:#f2f4f1;--ink:#1b231f;--ink-2:#4f5b55;--accent:#0b7a5e;--line:#dde3de}
@media (prefers-color-scheme:dark){:root{--bg:#0f1512;--ink:#e8eeea;--ink-2:#a3b0a8;--accent:#34be96;--line:#2a352f}}
body{margin:0 auto;max-width:40rem;padding:48px 16px;background:var(--bg);color:var(--ink-2);font:1rem/1.55 system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif}
h1{margin:0 0 24px;padding-bottom:16px;border-bottom:1px solid var(--line);color:var(--ink);font-size:2.5rem;line-height:1.05}
p{margin:0}a{display:inline-block;padding:10px 0;color:var(--accent);font-weight:600}
</style>
</head>
<body>
<h1>404</h1>
${Object.entries(INTROUVABLE).map(([l, [texte, retour]]) => `<p lang="${l}">${texte} <a href="/${l}/" hreflang="${l}">${retour}</a></p>`).join("\n")}
</body>
</html>
`);

// hreflang en en-tête HTTP (Cloudflare _headers) plutôt qu'en <link> : n'alourdit pas le DOM des pages.
// URL absolues, les mêmes que la balise canonique de chaque page (src/seo.js)
const link = enTeteLink(SITE, LANGUES);
// + en-têtes de sécurité, CSP calculée sur toutes les pages finales : à garder en dernier, après toute écriture de HTML
const pages = readdirSync("dist", { recursive: true }).filter((f) => f.endsWith(".html")).map((f) => readFileSync(`dist/${f}`, "utf8"));
writeFileSync("dist/_headers", `/*\n  Link: ${link}\n${entetesSecurite(pages)}`);

console.log("dist/ :", LANGUES.map((l) => `${l}/index.html`).join(", "), "+ index.html, 404.html, _headers");
