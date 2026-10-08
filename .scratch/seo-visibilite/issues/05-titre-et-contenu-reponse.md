# 05: Title and answer content

**What to build:** Someone who searches « voiture électrique ou thermique », « faut-il passer à l'électrique » or « elektrische auto of benzine » finds **a direct answer in words**:
- the title includes « voiture » (or its equivalent in each language);
- below the tool, a short figured answer (e.g. the switching mileage in Belgium), then 4 to 6 sourced questions and answers (battery, mileage, used, plug-in hybrid, the country's grid);
- everything is pre-rendered, in the 5 languages.

**Blocked by:** 01

**Status:** ready-for-agent

- [ ] Title revised in the 5 languages (FR: « Voiture électrique ou thermique : dois-je passer à l'électrique ? »)
- [ ] Direct answer of ~40–60 words with a number taken from the model, plus 4–6 Q&As, each with a source from the Méthode
- [ ] **The owner validates the figures and wording before going live** (factual claims)
- [ ] Readable without JavaScript; DOM at load measured: EcoIndex A kept (folded content if needed)
- [ ] Translations consistent across the 5 languages (same keys, `src/i18n.test.js` passes)
