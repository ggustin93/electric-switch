/* Mesure d'audience sobre (Umami Cloud, UE) : aucun script tiers, aucun cookie, aucun identifiant.
   Une page vue à l'ouverture de chaque page, puis des événements anonymes quand la personne agit
   (étape, verdict, onglet, aide, bouton, lien sortant, langue). « Do Not Track », GPC et refus (Mentions) respectés (ADR 0015). */

// website : identifiant public du site dans Umami Cloud (pas un secret). Vide = mesure désactivée.
// hote : seul domaine mesuré ; localhost, preview et toute copie du site n'envoient rien.
export const UMAMI = { endpoint: "https://cloud.umami.is/api/send", website: "e6b2057a-5cf7-4a69-acdf-93b04381c4e9", hote: "electricornot.eu" };

// Seuls les paramètres de campagne sont gardés dans l'URL : jamais une saisie ni une ancre
const UTM = /^utm_(source|medium|campaign|term|content)$/;

// Charge utile documentée de POST /api/send ; sans nom, Umami l'enregistre comme page vue.
export function evenement(nom, data, env = globalThis) {
  const loc = env.location ?? { hostname: "", pathname: "/", search: "" };
  const utm = [...new URLSearchParams(loc.search || "")].filter(([k]) => UTM.test(k));
  const ref = env.document?.referrer || "";
  const payload = {
    website: UMAMI.website, hostname: loc.hostname,
    url: (loc.pathname || "/") + (utm.length ? `?${new URLSearchParams(utm)}` : ""),
    language: env.navigator?.language ?? "", title: env.document?.title ?? "",
    // Provenance externe seulement (origine et chemin, sans paramètres) ; la navigation interne se lit dans les pages vues
    referrer: ref && !ref.includes(`//${loc.hostname}`) ? ref.split(/[?#]/)[0] : "",
    screen: env.screen ? `${env.screen.width}x${env.screen.height}` : "",
  };
  return { type: "event", payload: nom ? { ...payload, name: nom, data } : payload };
}

// Refus demandé par la personne (lien des Mentions) : seule écriture dans le navigateur, faite à sa demande
const CLE_REFUS = "mesure";
export function refuse(env = globalThis) {
  try { return env.localStorage?.getItem(CLE_REFUS) === "non"; } catch { return false; }
}
export function choisirRefus(non, env = globalThis) {
  try { non ? env.localStorage.setItem(CLE_REFUS, "non") : env.localStorage.removeItem(CLE_REFUS); } catch {}
}

// Sobriété : un même événement (nom et données) n'est envoyé qu'une fois par page ; pages vues et verdicts à chaque fois
const envoyes = new Set();

// Envoie si la mesure est configurée et autorisée ; n'interrompt jamais l'interface.
export function mesurer(nom, data, env = globalThis) {
  const nav = env.navigator ?? {};
  if (!UMAMI.website || env.location?.hostname !== UMAMI.hote || nav.doNotTrack === "1" || nav.globalPrivacyControl || refuse(env)) return false;
  if (nom && nom !== "verdict") {
    const cle = `${nom}|${JSON.stringify(data)}`;
    if (envoyes.has(cle)) return false;
    envoyes.add(cle);
  }
  try {
    env.fetch(UMAMI.endpoint, {
      method: "POST", keepalive: true, headers: { "Content-Type": "application/json" },
      body: JSON.stringify(evenement(nom, data, env)),
    }).catch(() => {});
    return true;
  } catch {
    return false;
  }
}

export const vue = (env = globalThis) => mesurer(null, undefined, env);

// Un seul écouteur pour tous les clics : boutons marqués data-ev (et data-id), liens sortants, changement de langue
export function suivreClic(cible, lang, env = globalThis) {
  const el = cible?.closest?.("[data-ev], a[href]");
  if (!el) return false;
  if (el.dataset?.ev) return mesurer(el.dataset.ev, { id: el.dataset.id, lang }, env);
  if (el.hreflang) return mesurer("langue", { de: lang, vers: el.hreflang }, env);
  const url = new URL(el.href, env.location?.href);
  if (!url.protocol.startsWith("http")) return mesurer("contact", { lang }, env); // mailto: l'adresse du site, jamais celle du visiteur
  return url.hostname !== env.location?.hostname && mesurer("sortie", { vers: url.hostname + url.pathname, lang }, env);
}
