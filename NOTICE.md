# Third-party notices

The code of this repository is under the [MIT licence](LICENSE). It embeds or reuses the following third-party work, each under its own licence.

| Work | Where | Licence | Obligation |
|---|---|---|---|
| **Tabler Icons** © Paweł Kuna, [tabler.io/icons](https://tabler.io/icons) | `src/icones.jsx` (paths merged into one `<path>` per icon) | [MIT](https://github.com/tabler/tabler-icons/blob/main/LICENSE) | keep this notice |
| **Bricolage Grotesque** © Mathieu Triay, [ateliertriay.fr/bricolage](https://ateliertriay.fr/bricolage) | `src/assets/bricolage.woff2` (subset: Latin glyphs used by the titles) | [SIL Open Font License 1.1](https://openfontlicense.org) | keep the licence with the font; not sold on its own |
| **ADEME, Impact CO₂** — emission factors of transport modes (gCO₂e per passenger-km), API v1, retrieved 2026-10-07 | `src/model.js` (`MODES`), tab « Se déplacer autrement » | [Licence Ouverte 2.0 (Etalab)](https://www.etalab.gouv.fr/licence-ouverte-open-licence/) | cite source and date (done on the page and in `docs/research/2026-10-modes-de-transport.md`) |
| **Energy prices** — EU Weekly Oil Bulletin (European Commission), Eurostat electricity prices | `src/prix.json`, refreshed weekly by `scripts/prix.mjs` | EU open data (reuse with attribution) | cite source (done on the Method page) |

Isolated figures taken from published studies (Carbone 4, ICCT, Ember, Electricity Maps, IPCC AR5, Ricardo, Argonne GREET, Nos Gestes Climat, …) are cited as facts with their references on the Method page (`/{lang}/methode/`) and in `docs/research/`; they are not databases copied into this repository.
