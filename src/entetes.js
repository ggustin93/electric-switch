// En-têtes de sécurité (appliqués à toutes les réponses, écrits dans dist/.htaccess). Exécuté par build.mjs, pas dans la page.
// CSP stricte sans 'unsafe-inline' : la page unique (ADR 0004) n'a que des <script>/<style> en ligne,
// autorisés un à un par leur empreinte SHA-256, calculée sur les pages finales de dist/.
import { createHash } from "node:crypto";

const empreinte = (t) => `'sha256-${createHash("sha256").update(t).digest("base64")}'`;
const BLOC = /<(script|style)\b([^>]*)>([\s\S]*?)<\/\1>/g;

export function entetesSecurite(pages) {
  const scripts = new Set(), styles = new Set();
  for (const html of pages) {
    for (const [, balise, attrs, contenu] of html.matchAll(BLOC)) {
      if (balise === "style") styles.add(empreinte(contenu));
      else if (!/\bsrc=|json/.test(attrs)) scripts.add(empreinte(contenu)); // JSON-LD : données, jamais exécutées
    }
    // Un attribut style="" (ex. prérendu) serait bloqué sans 'unsafe-inline' : on échoue au build plutôt qu'en ligne.
    if (/<[^>]+\sstyle=/.test(html.replace(BLOC, ""))) throw new Error("attribut style= en ligne : bloqué par la CSP (src/entetes.js)");
  }
  const csp = [
    "default-src 'none'",
    `script-src ${[...scripts].join(" ")}`,
    `style-src ${[...styles].join(" ")}`,
    "font-src data:", // police intégrée (ADR 0004)
    "img-src data:", // icônes en masques CSS
    "connect-src https://cloud.umami.is", // événements Umami (src/mesure.js)
    "base-uri 'none'",
    "form-action 'none'",
    "frame-ancestors 'none'",
  ].join("; ");
  return [
    "Strict-Transport-Security: max-age=31536000; includeSubDomains",
    "X-Content-Type-Options: nosniff",
    "Referrer-Policy: strict-origin-when-cross-origin",
    "Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), accelerometer=(), gyroscope=(), magnetometer=(), browsing-topics=()",
    `Content-Security-Policy: ${csp}`,
  ].map((l) => `  ${l}\n`).join("");
}

// dist/.htaccess (Apache, Infomaniak, ADR 0010) : traduit le texte au format _headers ci-dessus (+ fichierHeaders, src/seo.js).
// Bloc « /* » → toutes les réponses ; chemin exact → <If>, index.html compris (DirectoryIndex sert /fr/ par /fr/index.html).
// <IfModule mod_headers.c> : sans le module, le site reste en ligne (pas d'erreur 500), les en-têtes manquent ; vérifier par curl -I.
export function versHtaccess(texte, site) {
  const valeur = (v) => `"${v.replaceAll("\\", "\\\\").replaceAll('"', '\\"')}"`;
  const regles = [];
  for (const ligne of texte.split("\n").filter(Boolean)) {
    const entete = ligne.match(/^ {2}([\w-]+): (.*)$/);
    if (!entete) regles.push({ chemin: ligne, entetes: [] });
    else regles.at(-1).entetes.push(`Header always set ${entete[1]} ${valeur(entete[2])}`);
  }
  const blocs = regles.flatMap(({ chemin, entetes }) => chemin === "/*" ? entetes
    : [`<If "%{REQUEST_URI} =~ m#^${chemin}(index\\.html)?$#">`, ...entetes.map((e) => `  ${e}`), "</If>"]);
  return [
    "ErrorDocument 404 /404.html",
    // http:// et tout autre nom d'hôte (www., IP) → https://domaine canonique, en 301. Derrière le proxy Infomaniak,
    // %{HTTPS} vaut toujours off (boucle de redirection) : le protocole d'origine est dans X-Forwarded-Proto.
    "RewriteEngine On",
    "RewriteCond %{HTTP:X-Forwarded-Proto} !https [OR]",
    `RewriteCond %{HTTP_HOST} !=${new URL(site).host}`,
    `RewriteRule ^ ${site}%{REQUEST_URI} [R=301,L]`,
    // Pas de page contact : /contact mène à « Signaler une erreur » d'À propos (NE : garder le # tel quel)
    "RewriteRule ^([a-z]{2})/contact/?$ /$1/apropos/#contact [R=301,NE,L]",
    "RewriteRule ^contact/?$ /fr/apropos/#contact [R=301,NE,L]",
    "<IfModule mod_headers.c>",
    // Revalidation à chaque visite, 304 si l'ETag n'a pas changé (ADR 0004) ; gzip est actif par défaut chez Infomaniak
    'Header always set Cache-Control "public, max-age=0, must-revalidate"',
    ...blocs,
    "</IfModule>",
    "",
  ].join("\n");
}
