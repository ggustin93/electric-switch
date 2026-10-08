// Construit une page autonome par langue (dist/fr/, dist/en/…) puis la page racine qui redirige (ADR 0006).
import { execFileSync } from "node:child_process";
import { rmSync, writeFileSync } from "node:fs";

const LANGUES = ["fr", "en", "nl", "it", "es"];
rmSync("dist", { recursive: true, force: true });
for (const l of LANGUES) {
  execFileSync("npx", ["vite", "build", "--logLevel", "warn"], { stdio: "inherit", env: { ...process.env, LANGUE: l } });
}

// Racine « / » : langue mémorisée, sinon celle du navigateur, sinon l'anglais. ≈ 1 ko, pas de JS externe.
const liens = LANGUES.map((l) => `<link rel="alternate" hreflang="${l}" href="/${l}/" />`).join("\n");
writeFileSync("dist/index.html", `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Dois-je passer à l'électrique ? · Should I switch to electric?</title>
${liens}
<link rel="alternate" hreflang="x-default" href="/" />
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
// hreflang en en-tête HTTP (Cloudflare _headers) plutôt qu'en <link> : n'alourdit pas le DOM des pages
const link = [...LANGUES.map((l) => `</${l}/>; rel="alternate"; hreflang="${l}"`), `</>; rel="alternate"; hreflang="x-default"`].join(", ");
writeFileSync("dist/_headers", `/*\n  Link: ${link}\n`);

console.log("dist/ :", LANGUES.map((l) => `${l}/index.html`).join(", "), "+ index.html");
