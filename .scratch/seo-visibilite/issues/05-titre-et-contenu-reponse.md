# 05: Title and answer content

**What to build:** Someone who searches « voiture électrique ou thermique », « faut-il passer à l'électrique » or « elektrische auto of benzine » finds **a direct answer in words**:
- the title includes « voiture » (or its equivalent in each language);
- below the tool, a short figured answer (e.g. the switching mileage in Belgium), then 4 to 6 sourced questions and answers (battery, mileage, used, plug-in hybrid, the country's grid);
- everything is pre-rendered, in the 5 languages.

**Blocked by:** 01

**Status:** needs-info (awaiting owner validation of figures and wording)

- [ ] Title revised in the 5 languages (FR: « Voiture électrique ou thermique : dois-je passer à l'électrique ? »)
- [ ] Direct answer of ~40–60 words with a number taken from the model, plus 4–6 Q&As, each with a source from the Méthode
- [ ] **The owner validates the figures and wording before going live** (factual claims)
- [ ] Readable without JavaScript; DOM at load measured: EcoIndex A kept (folded content if needed)
- [ ] Translations consistent across the 5 languages (same keys, `src/i18n.test.js` passes)

## Comments

### 2026-10-08 — implémenté, en attente de validation par le propriétaire (chiffres et formulations)

**À valider avant mise en ligne.** Les traductions NL, IT, ES sont des brouillons automatiques (relecture native recommandée).

**1. Titre `<title>` de la page outil** (clé `titre`) — le h1 visible ne change pas (clé `h1` séparée) :
- FR « Voiture électrique ou thermique : dois-je passer à l'électrique ? »
- EN « Electric or petrol car: should I switch to electric? » · NL « Elektrische auto of benzine: moet ik overstappen? » · IT « Auto elettrica o a benzina: devo passare all'elettrico? » · ES « Coche eléctrico o de gasolina: ¿debo pasarme al eléctrico? »
- Pages de lecture : nom de page + nom court (nouvelle clé `nomSite`, l'ancien titre) : « Méthode · Dois-je passer à l'électrique ? », « Questions fréquentes · Dois-je passer à l'électrique ? ».

**2. Intro de l'étape 1** (clé `lede`, aussi meta description ; 55 mots en FR) :
« En Belgique, une compacte électrique émet sur toute sa vie (200 000 km) plus de 60 % de gaz à effet de serre en moins qu'une essence, fabrication de la batterie comprise. Mais remplacer une voiture qui roule encore n'est pas toujours gagnant : vérifiez-le pour votre cas en quatre questions, budget au quotidien compris. »

**3. Nouvelle page `/fr/questions/` « Questions fréquentes »** — intro + 6 réponses (40–80 mots, renvois Hn [n] en texte).

**Chiffres et calcul** (tous recalculés par `src/reponses.test.js` depuis `src/model.js` ; le test échoue si le modèle ou les textes changent) :
- *Vie entière* : compacte (1 350 kg, batterie 55 kWh), batterie moyenne UE 73 kgCO₂e/kWh (H8), neuve, 200 000 km (H1), réseau moyen sur 200 000/15 000 ≈ 13 ans avec décarbonation (H6) — même calcul que le test H13. Belgique : électrique 16,2 t, essence 44,1 t → −63,3 % → écrit « plus de 60 % » (arrondi par défaut à la dizaine, jamais surévalué). Par pays (arrondi à 5 %) : France −70,1 → 70 ; Norvège −71,7 → 70 ; Belgique −63,3 → 65 ; Allemagne −51,5 → 50 ; Pologne −35,2 → 35.
- *Km pivot entre deux neuves* (`kmPivot`, Belgique) : 27 031 km → « environ 27 000 km ».
- *Kilométrage de bascule* (`kmBascule`) avec le profil par défaut de « Ma décision » : Belgique, essence 6,5 L/100 km qui roulerait encore 5 ans, compacte électrique neuve, batterie moyenne UE, décarbonation active → **15 500 km/an** ; même profil avec 8 ans restants → 10 000 km/an.
- *Batterie* : 55 kWh × 73 kg = 4,0 t ; fabrication électrique 11,4 t (glider ×1,05 + batterie, H9) contre 7,0 t pour l'essence (5,2 t/tonne × 1,35 t).
- *Occasion* (`decider`, profil par défaut, électrique de 6 ans, compteur estimé 72 000 km, 12 000 km/an, 5 ans) : part de fabrication 22,5 % → « environ 22 % » ; total 4,2 t contre 10,5 t en gardant la voiture et 13,0 t avec une électrique neuve (verdict par défaut « garder » pour la neuve).
- *Hybride rechargeable* (vie entière, Belgique) : 50 % électrique → −29,5 % → « environ 30 % » ; 15 % électrique → −2,6 % → « environ 3 % » (H11 : 45–50 % particuliers, 11–15 % flottes).

**Questions (FR) :**
1. « L'électrique émet-elle vraiment moins ? » — Oui : 16 tCO₂e contre 44 t sur 200 000 km en Belgique, plus de 60 % de moins ; l'ICCT trouve −73 % (moyenne UE), le modèle est prudent (H13) [8, 14].
2. « À partir de combien de km par an ? » — Entre deux neuves, l'électrique passe devant après ~27 000 km ; pour remplacer une essence qui roulerait encore 5 ans, au-delà de ~15 500 km/an, dès 10 000 km/an si elle pouvait rouler 8 ans (H1, H3) [1, 8, 11].
3. « Et la fabrication de la batterie ? » — ~4 t pour 55 kWh ; 11,4 t pour l'électrique contre 7 t, rattrapé après ~27 000 km ; aucun crédit de recyclage (H8, H9) [7, 8, 12].
4. « Une électrique d'occasion, c'est mieux ? » — Souvent : une électrique de 6 ans vous attribue ~22 % de sa fabrication, 4,2 t contre 10,5 t (garder) et 13 t (neuve) (H2, H3) [10, 11].
5. « Et l'hybride rechargeable ? » — ~30 % de moins qu'une essence à 50 % de roulage électrique (contre plus de 60 % pour l'électrique), ~3 % à 15 % (H11) [15, 16].
6. « Mon pays change-t-il la réponse ? » — −70 % France/Norvège, −65 % Belgique, −50 % Allemagne, −35 % Pologne, décarbonation comprise (H5, H6) [4, 5, 13].

**Écoconception (mesuré, build local + preview, agent-browser après 2,5 s)** : le lien « Questions fréquentes » du pied est payé sans changement visuel (contenu de l'outil en fragment au lieu d'un `<div>` ; le lien « Méthode » de l'en-tête n'a plus de `<nav>` à lui seul). Outil : DOM 93 → 92, 54,6–55,6 ko → 80,2 (A), page Écoconception mise à jour (92 éléments). Questions : DOM 51, 54,9–55,9 ko → 88,5 (A). Méthode : DOM 92, 57,5–58,9 ko → 80,1 (A, toujours au plafond). Écoconception 81,4 (A), Mentions 86,9 (A).

Note : la page racine (`build.mjs`) utilise toujours `titre` EN pour `og:title`/`og:site_name` (désormais le titre long) ; non modifié pour ne pas croiser le ticket 04.
