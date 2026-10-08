// Génère les images d'aperçu au partage og/<lang>.png (1200×630), à relancer si le titre ou le
// sous-titre change : node scripts/apercus.mjs. Rendu HTML capturé par agent-browser, puis réduit
// à une palette de 64 couleurs (Pillow) : < 60 ko par image. Les PNG sont versionnés, le build les copie.
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { LOCALE_OG, SOUS_TITRE } from "../src/seo.js";

const racine = fileURLToPath(new URL("..", import.meta.url));
const police = join(racine, "src/assets/bricolage.woff2");
const tmp = mkdtempSync(join(tmpdir(), "apercus-"));
const ab = (...args) => execFileSync("agent-browser", args, { stdio: "inherit" });

// h1 du dictionnaire (texte, <em>, &nbsp;) : déjà du HTML valide
const h1 = (l) => readFileSync(join(racine, `src/i18n/${l}.jsx`), "utf8").match(/^  h1: <>(.*)<\/>,$/m)[1];

// Barres empilées comme dans l'appli : fabrication hachurée + usage plein, thermique puis électrique
const barre = (couleur, fab, usage) => `<div class="barre">
  <span style="width:${fab}px;background:repeating-linear-gradient(135deg,${couleur} 0 5px,#f2f4f1 5px 9px)"></span>
  <span style="width:${usage}px;background:${couleur}"></span></div>`;

const page = (l) => `<!doctype html><meta charset="utf-8"><style>
@font-face { font-family: B; src: url("file://${police}") format("woff2"); font-weight: 600 800; }
* { margin: 0; }
body { width: 1200px; height: 630px; box-sizing: border-box; padding: 76px 84px 72px; background: #f2f4f1; color: #1b231f;
  display: flex; flex-direction: column; font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; }
h1 { font: 800 92px/1.04 B, sans-serif; letter-spacing: -0.025em; max-width: 1000px; text-wrap: balance; }
em { font-style: italic; color: #0b7a5e; }
p { margin-top: 28px; font-size: 36px; line-height: 1.3; color: #4f5b55; max-width: 960px; text-wrap: balance; }
.barres { margin-top: auto; display: grid; gap: 14px; }
.barre { display: flex; height: 30px; }
.barre span:first-child { border-radius: 3px 0 0 3px; }
.barre span:last-child { border-radius: 0 3px 3px 0; }
</style>
<h1>${h1(l)}</h1>
<p>${SOUS_TITRE[l]}</p>
<div class="barres">${barre("#b5441a", 90, 610)}${barre("#0b7a5e", 190, 120)}</div>`;

ab("set", "viewport", "1200", "630");
for (const l of Object.keys(LOCALE_OG)) {
  const html = join(tmp, `${l}.html`);
  writeFileSync(html, page(l));
  ab("open", `file://${html}`);
  ab("wait", "300");
  ab("screenshot", join(tmp, `${l}.png`));
  execFileSync("python3", ["-c", `from PIL import Image
im = Image.open("${join(tmp, `${l}.png`)}").convert("RGB")
im.quantize(64, method=Image.Quantize.MEDIANCUT).save("${join(racine, `og/${l}.png`)}", optimize=True)`], { stdio: "inherit" });
}
