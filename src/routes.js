// Pages du site (ADR 0009) : l'outil en /{langue}/, chaque page de lecture en /{langue}/{page}/,
// pré-rendue dans son propre fichier HTML. Mêmes adresses dans toutes les langues.
export const PAGES = ["methode", "ecoconception", "mentions"];
export const LANGUES = ["fr", "en", "nl", "it", "es"];

export const chemin = (lang, page = "outil") => `/${lang}/${page === "outil" ? "" : `${page}/`}`;

// "/fr/methode/" → "methode" ; toute autre adresse → "outil"
export function pageDuChemin(pathname) {
  const page = pathname.split("/")[2];
  return PAGES.includes(page) ? page : "outil";
}

// Anciens liens en ancre sur la page outil (#methode, #methode/h5…) → nouvelle adresse, sinon null
export function ancienneAncre(hash, lang) {
  const [page, ancre] = hash.slice(1).split("/");
  return PAGES.includes(page) ? chemin(lang, page) + (ancre ? `#${ancre}` : "") : null;
}
