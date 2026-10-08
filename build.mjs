// Construit une page autonome par langue (dist/fr/, dist/en/…, ADR 0006) et par page de lecture
// (dist/fr/methode/…, ADR 0009), puis la page racine qui redirige.
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { rmSync, writeFileSync } from "node:fs";
import { siteUrl, alternates, fichierHeaders } from "./src/seo.js";
import { PAGES } from "./src/routes.js";

const LANGUES = ["fr", "en", "nl", "it", "es"];
const SITE = siteUrl(process.env); // SITE_URL=https://electricornot.eu npm run build
rmSync("dist", { recursive: true, force: true });
// Langues en parallèle ; dans une langue, l'outil d'abord : son build vide dist/{langue}/
await Promise.all(LANGUES.map(async (l) => {
  for (const page of ["outil", ...PAGES]) {
    const { stderr } = await promisify(execFile)("npx", ["vite", "build", "--logLevel", "warn"], { env: { ...process.env, LANGUE: l, PAGE: page } });
    process.stderr.write(stderr);
  }
}));

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
// hreflang en en-tête HTTP (Cloudflare _headers) plutôt qu'en <link> : n'alourdit pas le DOM des pages.
// URL absolues, les mêmes que la balise canonique de chaque page (src/seo.js)
// Une règle par chemin exact : chaque page annonce ses propres versions linguistiques.
writeFileSync("dist/_headers", fichierHeaders(SITE, LANGUES));

console.log(`dist/ : ${LANGUES.length} langues × ${1 + PAGES.length} pages (${["", ...PAGES].map((p) => `${p}${p && "/"}index.html`).join(", ")}) + index.html`);
