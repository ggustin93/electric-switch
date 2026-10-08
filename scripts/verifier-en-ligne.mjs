// Après déploiement (FTP en clair, ADR 0010) : chaque fichier de dist/ servi par le site doit être identique
// au build, et la CSP envoyée doit être celle de dist/.htaccess (fichier non servi, vérifié par son effet).
// Sinon le job échoue : contenu altéré pendant l'envoi, ou envoi incomplet.
// Usage : SITE_URL=https://electricornot.eu node scripts/verifier-en-ligne.mjs (après npm run build)
import { readdirSync, readFileSync } from "node:fs";
import { siteUrl } from "../src/seo.js";

const SITE = siteUrl(process.env);
const fichiers = readdirSync("dist", { recursive: true, withFileTypes: true })
  .filter((f) => f.isFile() && f.name !== ".htaccess")
  .map((f) => `${f.parentPath}/${f.name}`.slice("dist/".length));

const ecarts = [];
for (const f of fichiers) {
  const reponse = await fetch(`${SITE}/${f}`, { cache: "no-store" });
  const enLigne = Buffer.from(await reponse.arrayBuffer()); // fetch décompresse le gzip
  if (!reponse.ok || !enLigne.equals(readFileSync(`dist/${f}`))) ecarts.push(`${reponse.status} /${f}`);
}
const csp = readFileSync("dist/.htaccess", "utf8").match(/^Header always set Content-Security-Policy "(.*)"$/m)[1];
if ((await fetch(`${SITE}/fr/`)).headers.get("content-security-policy") !== csp) ecarts.push("CSP différente de dist/.htaccess");

if (ecarts.length) {
  console.error(`En ligne ≠ build (${ecarts.length}) :\n${ecarts.join("\n")}`);
  process.exit(1);
}
console.log(`${SITE} : ${fichiers.length} fichiers et la CSP identiques au build.`);
