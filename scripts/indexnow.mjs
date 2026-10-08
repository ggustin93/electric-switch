// Après déploiement (CI) : envoie les URL du sitemap à IndexNow. N'échoue jamais le déploiement.
import { readFileSync } from "node:fs";
import { siteUrl } from "../src/seo.js";
import { cleValide, corpsIndexNow } from "../src/indexnow.js";

const cle = process.env.INDEXNOW_KEY;
if (!cleValide(cle)) { console.log("IndexNow : pas de clé valide, rien envoyé."); process.exit(0); }
const corps = corpsIndexNow(siteUrl(process.env), cle, readFileSync("dist/sitemap.xml", "utf8"));
try {
  const r = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST", headers: { "Content-Type": "application/json; charset=utf-8" }, body: JSON.stringify(corps),
  });
  console.log(`IndexNow : ${corps.urlList.length} URL envoyées, réponse ${r.status}.`);
} catch (e) {
  console.log(`IndexNow : échec réseau (${e.message}), déploiement non affecté.`);
}
