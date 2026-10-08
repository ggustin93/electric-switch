// Construit une page autonome par langue (dist/fr/, dist/en/…) puis la page racine qui redirige (ADR 0006).
import { execFileSync } from "node:child_process";
import { cpSync, rmSync, writeFileSync } from "node:fs";
import { siteUrl, alternates, enTeteLink, balisesApercu, lireDico } from "./src/seo.js";

const LANGUES = ["fr", "en", "nl", "it", "es"];
const SITE = siteUrl(process.env); // SITE_URL=https://electricornot.eu npm run build
rmSync("dist", { recursive: true, force: true });
for (const l of LANGUES) {
  execFileSync("npx", ["vite", "build", "--logLevel", "warn"], { stdio: "inherit", env: { ...process.env, LANGUE: l } });
}
// Images d'aperçu au partage (générées par scripts/apercus.mjs), jamais chargées par les pages
cpSync("og", "dist/og", { recursive: true });

// Racine « / » : langue mémorisée, sinon celle du navigateur, sinon l'anglais. ≈ 1 ko, pas de JS externe.
const liens = alternates(SITE, LANGUES).map(([l, href]) => `<link rel="alternate" hreflang="${l}" href="${href}" />`).join("\n");
writeFileSync("dist/index.html", `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Dois-je passer à l'électrique ? · Should I switch to electric?</title>
${liens}
${balisesApercu(SITE, "en", { url: `${SITE}/`, titre: lireDico("en", "titre"), description: lireDico("en", "lede") })}
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
// hreflang en en-tête HTTP (Cloudflare _headers) plutôt qu'en <link> : n'alourdit pas le DOM des pages.
// URL absolues, les mêmes que la balise canonique de chaque page (src/seo.js)
writeFileSync("dist/_headers", `/*\n  Link: ${enTeteLink(SITE, LANGUES)}\n`);

console.log("dist/ :", LANGUES.map((l) => `${l}/index.html`).join(", "), "+ index.html");
