import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { entetesSecurite, versHtaccess } from "./entetes.js";

const sha = (t) => `'sha256-${createHash("sha256").update(t).digest("base64")}'`;
const page = `<!doctype html><html><head><style>body{color:red}</style>
<script type="module">console.log("<\\/script")</script>
<script type="application/ld+json">{"@type":"WebApplication"}</script></head><body></body></html>`;
const redirection = `<script>location.replace("/fr/")</script>`;
const csp = (texte) => texte.match(/^ {2}Content-Security-Policy: (.*)$/m)[1];

test("CSP : hache les <script> et <style> en ligne de toutes les pages, sans 'unsafe-inline'", () => {
  const c = csp(entetesSecurite([page, redirection, page]));
  assert.ok(c.includes(sha('console.log("<\\/script")')));
  assert.ok(c.includes(sha('location.replace("/fr/")')));
  assert.ok(c.includes(`style-src ${sha("body{color:red}")}`));
  assert.equal(c.split(sha("body{color:red}")).length, 2, "hash dédoublonné");
  assert.ok(!c.includes("unsafe-inline"));
  // les blocs de données (JSON-LD) ne s'exécutent pas : pas besoin de les autoriser
  assert.ok(!c.includes(sha('{"@type":"WebApplication"}')));
});

test("CSP : rien par défaut, police et masques en data:, Umami seul tiers, pas d'encadrement", () => {
  const c = csp(entetesSecurite([page]));
  for (const d of ["default-src 'none'", "font-src data:", "img-src data:", "connect-src https://cloud.umami.is",
    "base-uri 'none'", "form-action 'none'", "frame-ancestors 'none'"]) assert.ok(c.includes(d), d);
});

test("en-têtes de sécurité attendus, une ligne indentée chacun (format _headers, traduit en .htaccess)", () => {
  const t = entetesSecurite([page]);
  for (const e of ["Strict-Transport-Security: max-age=31536000; includeSubDomains", "X-Content-Type-Options: nosniff",
    "Referrer-Policy: strict-origin-when-cross-origin", "Permissions-Policy: camera=()"]) assert.ok(t.includes(`  ${e}`), e);
  assert.ok(t.split("\n").filter(Boolean).every((l) => /^ {2}[\w-]+: \S/.test(l) && l.length <= 2000));
});

test("un attribut style= serait bloqué par la CSP : la construction échoue", () => {
  assert.throws(() => entetesSecurite(['<div style="color:red"></div>']), /style/);
});

test(".htaccess : en-têtes globaux, Link par chemin (index.html compris), guillemets échappés, https canonique", () => {
  const h = versHtaccess(`/*\n  X-Content-Type-Options: nosniff\n/fr/\n  Link: <https://e.eu/fr/>; rel="alternate"; hreflang="fr"\n`, "https://e.eu");
  assert.match(h, /^Header always set X-Content-Type-Options "nosniff"$/m);
  assert.ok(h.includes(`<If "%{REQUEST_URI} =~ m#^/fr/(index\\.html)?$#">\n  Header always set Link "<https://e.eu/fr/>; rel=\\"alternate\\"; hreflang=\\"fr\\""\n</If>`));
  assert.ok(h.includes("RewriteCond %{HTTP:X-Forwarded-Proto} !https [OR]\nRewriteCond %{HTTP_HOST} !=e.eu\nRewriteRule ^ https://e.eu%{REQUEST_URI} [R=301,L]"));
  assert.ok(!h.includes("%{HTTPS}"), "%{HTTPS} vaut off derrière le proxy Infomaniak : boucle de redirection");
  assert.match(h, /^ErrorDocument 404 \/404\.html$/m);
  assert.equal(h.split("<IfModule mod_headers.c>").length, 2);
});
