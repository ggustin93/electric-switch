// Génère les images d'aperçu au partage og/<lang>.png (1200×630), à relancer si le titre ou le
// sous-titre change : node scripts/apercus.mjs. Rendu HTML capturé par agent-browser, puis réduit
// à une palette de 64 couleurs (Pillow) : < 60 ko par image. Les PNG sont versionnés, le build les copie.
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { LOCALE_OG, SOUS_TITRE } from "../src/seo.js";
import { PAYS, SEGMENTS, BATTERIES, VIE_KM, byId, mixMoyen, calc } from "../src/model.js";

const racine = fileURLToPath(new URL("..", import.meta.url));
const police = join(racine, "src/assets/bricolage.woff2");
const tmp = mkdtempSync(join(tmpdir(), "apercus-"));
const ab = (...args) => execFileSync("agent-browser", args, { stdio: "inherit" });

// h1 du dictionnaire (texte, <em>, &nbsp;) : déjà du HTML valide
const h1 = (l) => readFileSync(join(racine, `src/i18n/${l}.jsx`), "utf8").match(/^  h1: <>(.*)<\/>,$/m)[1];

// Libellés « Essence » / « Électrique » du dictionnaire
const nomMoteur = (l, id) => readFileSync(join(racine, `src/i18n/${l}.jsx`), "utf8").match(new RegExp(`^    ${id}: \\{ nom: "([^"]+)"`, "m"))[1];

// Proportions réelles du modèle (page Questions, Q1) : compacte neuve, Belgique, 200 000 km, batterie UE
const be = byId(PAYS, "BE"), seg = byId(SEGMENTS, "compacte");
const g = mixMoyen(be.g, VIE_KM / 15000, true, be.declin);
const [ess, ev] = ["essence", "ev"].map((m) => calc(m, seg, g, VIE_KM, 1, 0, byId(BATTERIES, "ue").ef));
const px = (t) => Math.round((t / ess.totalT) * 680);

// Barres empilées comme dans l'appli (fabrication hachurée + usage plein), étiquetées : lisibles en vignette
const barre = (couleur, r, nom) => `<div class="barre">
  <span style="width:${px(r.fabTotale)}px;background:repeating-linear-gradient(135deg,${couleur} 0 7px,#f2f4f1 7px 12px)"></span>
  <span style="width:${px(r.usageT)}px;background:${couleur}"></span><b style="color:${couleur}">${nom}</b></div>`;

const page = (l) => `<!doctype html><meta charset="utf-8"><style>
@font-face { font-family: B; src: url("file://${police}") format("woff2"); font-weight: 600 800; }
* { margin: 0; }
body { width: 1200px; height: 630px; box-sizing: border-box; padding: 64px 84px 60px; position: relative; background: #f2f4f1; color: #1b231f;
  display: flex; flex-direction: column; font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; }
h1 { font: 800 100px/1.02 B, sans-serif; letter-spacing: -0.025em; max-width: 1000px; text-wrap: balance; }
em { font-style: italic; color: #0b7a5e; }
p { margin-top: 24px; font-size: 38px; line-height: 1.3; color: #4f5b55; max-width: 960px; text-wrap: balance; }
.barres { margin-top: auto; display: grid; gap: 16px; }
.barre { display: flex; align-items: center; height: 46px; }
.barre span { height: 100%; }
.barre b { margin-left: 18px; font: 700 34px B, sans-serif; }
.site { position: absolute; right: 84px; bottom: 60px; font-size: 30px; color: #4f5b55; }
.barre span:first-child { border-radius: 3px 0 0 3px; }
.barre span:last-child { border-radius: 0 3px 3px 0; }
</style>
<h1>${h1(l)}</h1>
<p>${SOUS_TITRE[l]}</p>
<div class="barres">${barre("#b5441a", ess, nomMoteur(l, "essence"))}${barre("#0b7a5e", ev, nomMoteur(l, "ev"))}</div>
<div class="site">electricornot.eu</div>`;

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
