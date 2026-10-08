/* Mesure d'audience sobre (Umami Cloud, UE) : aucun script, aucune requête au chargement,
   aucun cookie. Quelques événements anonymes envoyés seulement quand la personne agit
   (verdict obtenu, onglet ou page ouverts). « Do Not Track » et GPC respectés. */

// website : identifiant public du site dans Umami Cloud (pas un secret). Vide = mesure désactivée.
export const UMAMI = { endpoint: "https://cloud.umami.is/api/send", website: "" };

// Charge utile documentée de POST /api/send. url = page de l'appli (/, /methode…), jamais une saisie.
export function evenement(nom, data, env = globalThis) {
  const loc = env.location ?? { hostname: "", hash: "" };
  const page = (loc.hash || "").slice(1).split("/")[0];
  return {
    type: "event",
    payload: {
      website: UMAMI.website, hostname: loc.hostname, url: `/${page}`,
      language: env.navigator?.language ?? "", name: nom, data,
    },
  };
}

// Envoie un événement si la mesure est configurée et autorisée ; n'interrompt jamais l'interface.
export function mesurer(nom, data, env = globalThis) {
  const nav = env.navigator ?? {};
  if (!UMAMI.website || nav.doNotTrack === "1" || nav.globalPrivacyControl) return false;
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
