# Changelog

Notable changes to « Dois-je passer à l'électrique ? ». Format inspired by [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/); versions follow the in-app number.

## [Unreleased]

### Added
- **Lightweight audience measurement (Umami Cloud, EU):**
  - no script, cookie or request at load, so EcoIndex stays A;
  - 3 anonymous events, sent only on action: verdict reached (coarse values: country, category, new/used, km rounded to 5 000), tab opened, reading page opened;
  - « Do Not Track » and GPC respected (`src/mesure.js`, tested);
  - **turned off until the Umami site ID is filled in.**
- **Plug-in hybrid electric share:** a 0–100 % slider, also typable, instead of 3 buttons.
- **Cumulative chart legend:** visible title and full names (« Hybride rechargeable » instead of « PHEV »).

### Changed
- **Hybrids** are shown by default in « Comparer les voitures ».
- **Footer link to the Ecodesign page:** « EcoIndex A » (accessible name « Écoconception, EcoIndex A »).
- **Search Console:** deferred until there is a custom domain.

### Fixed
- **Chart line styles and axis labels lost** since dropping `preact/compat` (SVG attributes in camelCase). Thick electric/petrol lines, dashed hybrids/diesel, and the axes are back.

### Security
- `.env` added to `.gitignore` (local secrets are never committed); the CI token is stored as a GitHub secret only.
- `cloudflare/wrangler-action` pinned to a commit SHA (v4.1.3); Dependabot for the actions.

### Added
- **Reading pages « Méthode » and « Écoconception »:**
  - linked from the header (« Méthode », next to FR/EN) and from the footer;
  - kept in the same file (`#methode`, `#methode/h5`, `#ecoconception`), so still 1 request;
  - answers are kept when you switch pages, and the browser Back button works;
  - the H1, H2… mentions in the help bubbles and hypotheses are links;
  - the folds at the bottom of the tool page are gone (Impeccable reading: Read mode is separated from Operate mode).
- **Automatic deployment:** each push to `main` installs, runs the tests, builds and deploys to Cloudflare Workers (GitHub Actions, `cloudflare/wrangler-action@v4`). Nothing goes live if a test fails.

## [7.3.0] — 2026-10-07

### Added
- **Typable values next to every slider** (consumption, mileage, years, age, odometer), synced with the slider. Out-of-range input is clamped back when you leave the field.
- **Finer steps:** consumption to the tenth (3 to 15 L/100 km), mileage by 500 km (100 km when typed), odometer by 1,000 km.
- **Deployed on Cloudflare Workers** (static assets only): `npm run deploy`, config in `wrangler.jsonc`.

### Changed
- **The budget shows the running cost only:** energy + maintenance per year and per 100 km, at country-specific prices, with home charging. The purchase price is **no longer estimated**: outside Belgium, about 80 % of it was Belgian data.
  - One sentence with no country-specific price says how many years of savings a price gap represents, and invites comparing with a real quote. Validated by a UX expert and a consumer advisor.
- **Intro promise:** « … et ce qu'elle changerait à votre budget au quotidien ».
- **H14 « Budget à l'usage »** rewritten. The Berylls depreciation source was removed (no longer used).

### Fixed
- **Budget, after three independent reviews** (data scientist, cost-of-ownership expert, UX writer):
  - Breakdown that didn't add up to the gap; rounding mismatches.
  - « Recharge publique 2 fois plus chère » corrected to 1.5 to 2 times; Belgian incentive link removed (no premium for private buyers in 2026).
  - Belgian electricity 0.36 €/kWh (Eurostat 2026-S1).
  - « Too close to call » rule wrong with negative totals; display of « −0 € ».

## [7.2.0] — 2026-10-07

### Added
- **« Se déplacer autrement » chart:**
  - log scale 0.1 → 300 gCO₂e/km;
  - Tabler transport icons, with a lightning bolt for the electric variant;
  - violet sequential colour tied to the axis, validated for colour blindness;
  - « voiture thermique seul·e » reference and a ratio on each row (« 49 fois moins »);
  - ADEME caveats folded under the chart.
- **Tab icons** drawn as CSS masks (0 DOM nodes).
- **Small ecodesign section in the footer:** measured figures, limits, references.
- **Project skills:** Green Claude (Institut du Numérique Responsable, RGESN 2024 / GR491) and Impeccable.

### Changed
- **EcoIndex A (≈ 80/100):**
  - single self-contained page (CSS, JS and font inlined), so 1 request;
  - Preact without the compatibility layer;
  - display font cut down to the characters used (12 kB).
- **Tab « Explorer » renamed « Comparer les voitures »;** the transport page's trip slider and reference buttons removed (no value added).

## [7.1.0] — 2026-10-07

### Changed
- **EcoIndex E (31) → B (77):**
  - React → Preact;
  - tabs mounted on first visit, annexes rendered on opening;
  - one self-hosted font instead of Google Fonts, so no third-party requests. ADR 0003.

## [7.0.0] — 2026-10-07

### Added
- **« Se déplacer autrement » page:** footprint per passenger-km for 22 modes (ADEME Impact CO₂, construction included).
- **Verdict:** the mileage threshold where it tips over, and a live « Et si je roulais… » slider.

### Changed
- **Navigation « Ma décision · Explorer · Se déplacer autrement »:**
  - shared profile (country, km, category, new/used), never asked twice;
  - Comparateur and Duel merged;
  - a single convention: a new car carries 100 % of its manufacturing.

## [6.1.0] — 2026-10-07

### Fixed
- **Hypotheses H1–H13 checked against primary sources:**
  - two citations that didn't exist (Kallitsis 2024, ICCT title) and Carbone 4 wrongly dated;
  - grids (DE, EU, SE);
  - E10 2.69, China LFP battery 65 kg/kWh;
  - manufacturing at 5.2 t per tonne;
  - real-world consumptions. See `docs/research/2026-10-verification-hypotheses.md`.

## [6.0.0] — 2026-10-07

### Added
- **Vite + Preact/React project:**
  - pure, tested model;
  - FR/EN bilingual;
  - Impeccable design (AA tokens, dark mode, accessibility).

### Fixed
- **Model corrections (ADR 0002):**
  - horizon capped at the EV's life;
  - a single 10 % rule for « too close to call »;
  - H13 aligned with the model.
