// EcoIndex d'une page construite (méthode officielle CNUMR, cnumr/EcoIndex_python) : garde-fou du build.
// Chaque page tient en 1 requête (JS et CSS en ligne) ; le poids est celui du HTML compressé (gzip).
// Mesures officielles du 12/10/2026 (api.ecoindex.fr) : Questions 82 nœuds → 93, Méthode 98 → 92, même compte qu'ici.
const QUANTILES = {
  dom: [0, 47, 75, 159, 233, 298, 358, 417, 476, 537, 603, 674, 753, 843, 949, 1076, 1237, 1459, 1801, 2479, 594601],
  req: [0, 2, 15, 25, 34, 42, 49, 56, 63, 70, 78, 86, 95, 105, 117, 130, 147, 170, 205, 281, 3920],
  ko: [0, 1.37, 144.7, 319.53, 479.46, 631.97, 783.38, 937.91, 1098.62, 1265.47, 1448.32, 1648.27, 1876.08, 2142.06,
    2465.37, 2866.31, 3401.59, 4155.73, 5400.08, 8037.54, 223212.26],
};
const position = (bornes, v) => {
  const i = bornes.findIndex((b, j) => v < bornes[j + 1]);
  return i + (v - bornes[i]) / (bornes[i + 1] - bornes[i]);
};
export const ecoindex = (dom, req, ko) =>
  Math.round(100 - (5 * (3 * position(QUANTILES.dom, dom) + 2 * position(QUANTILES.req, req) + position(QUANTILES.ko, ko))) / 6);

// Éléments du document, hors enfants des <svg> ; contenu des <script> et <style> ignoré
export function noeuds(html) {
  let n = 0, svg = 0;
  const balises = html.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, "<$1>").matchAll(/<(\/?)([a-zA-Z][\w-]*)[^>]*?(\/?)>/g);
  for (const [, fin, nom, auto] of balises) {
    const estSvg = nom.toLowerCase() === "svg";
    if (fin) { if (estSvg && svg) svg--; continue; }
    if (svg) { if (estSvg && !auto) svg++; continue; }
    n++;
    if (estSvg && !auto) svg = 1;
  }
  return n;
}
