// En-têtes de sécurité (Cloudflare _headers, appliqués à toutes les réponses). Exécuté par build.mjs, pas dans la page.
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
