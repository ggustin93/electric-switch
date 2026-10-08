# Changelog

Notable changes to « Dois-je passer à l'électrique ? ». Format inspired by [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/); versions follow the in-app number.

## [Unreleased]

### Added
- **Dutch, Italian and Spanish**, alongside French and English (ADR 0006):
  - one self-contained page per language: `/fr/`, `/en/`, `/nl/`, `/it/`, `/es/`;
  - the root `/` redirects to the remembered language, else the browser's, else English;
  - the language switch is 5 links and keeps the current reading page (`#methode`…);
  - `hreflang` sent as an HTTP `Link` header, not as tags in the page.
- **Charging country pre-filled** from the device's time zone (e.g. Europe/Brussels → Belgium), else the region of the browser languages (« nl-BE », « en-GB »), else the EU average. Guessed locally, nothing sent; still editable (`paysProbable`, tested).
- **« Comparer les voitures » clarified** (Impeccable clarify):
  - the advanced mode is now called **« Face-à-face »** (EN Head-to-head, NL Duel, IT Testa a testa, ES Cara a cara), instead of « Deux voitures au choix »; the tab keeps its name, since its default view compares 5 powertrains, not two opponents;
  - under the bars: « Chaque motorisation dans la même catégorie : compacte neuve » — the shared category was only visible in the folded profile.
- **Impeccable critique (28/40) applied:**
  - the intro paragraph shows only on step 1 of « Ma décision », so answers come up higher (mobile: the « Étape suivante » button is visible without scrolling);
  - quieter top bar: « Méthode » at the same level as the languages, aligned with the column edge;
  - the mobile stepper stays on one line (labels of the other steps visually hidden, still read by screen readers);
  - verdict sentence capped for reading (54ch), dropdowns capped at 34rem;
  - background motifs softened: 5 %, a narrow tile repeated in whole tiles only (no more half icons), scrolling with the page.
- **Wider column** (46 → 52rem) and the title higher up: charts, the duel and the 5 category cards get more room; text keeps its reading width.
- **Quieter language switch** (Impeccable): plain text links after a thin rule, the current language underlined like the current page, no filled pill.
- **Translation check:** a `src/i18n.test.js` test ensures every language has exactly the French keys and types.

### Changed
- **Lighter pages:** each page holds only its own language, so 51–52 kB instead of 58 kB, 92 elements, EcoIndex A (80.3). Five languages in one page would have given B (≈ 78).
- **Display font** rebuilt from the original (same SemiBold) to cover ñ, ¿, à, ë…: 12.4 → 13.7 kB.
- **Translations:** NL, IT and ES are machine-drafted, checked for structure and rendering. A native review is still to be done.
- **Duel:** the plug-in hybrid electric share moves into the column of the car concerned, with its own value per car (two plug-in hybrids can be charged differently). It starts from the value set in « Toutes les motorisations ».

### Fixed
- **Background motifs barely visible:** now shown from 1024 px wide (was 1150), at 8 % opacity (was 3.5 %), closer to the column. Icons fade out gradually at the column's edge instead of leaving cut-off fragments.
- **Dropdowns:** a drawn chevron with the same inner margin on the right as on the left, in both themes. The native arrow sat against the border.

## [7.4.0] — 2026-10-08

### Added
- **Reading pages « Méthode » and « Écoconception »** (d9ea8c4):
  - linked from the header (« Méthode », next to FR/EN) and from the footer;
  - kept in the same file (`#methode`, `#methode/h5`, `#ecoconception`), so still 1 request;
  - answers are kept when you switch pages, and the browser Back button works;
  - the H1, H2… mentions in the help bubbles and hypotheses are links;
  - the folds at the bottom of the tool page are gone (Impeccable reading: Read mode is separated from Operate mode).
- **« Mentions légales » page** (`#mentions`, footer link): publisher (from pwablo.be/terms), host, personal data, liability, credits and licences.
- **Credit** at the end of the footer: « Conçu et développé par Pwablo. »
- **Lightweight audience measurement (Umami Cloud, EU):**
  - no script, cookie or request at load, so EcoIndex stays A;
  - 3 anonymous events, sent only on action: verdict reached (coarse values: country, category, new/used, km rounded to 5 000), tab opened, reading page opened;
  - « Do Not Track » and GPC respected (`src/mesure.js`, tested);
  - **turned off until the Umami site ID is filled in.**
- **Duel « Deux voitures au choix »:** each used car has its own age and odometer. The ownership period and the plug-in hybrid electric share are editable and shared with « Toutes les motorisations ». They used to be fixed at 6 years, 80 000 km, 8 years and 50 %, ignoring the sliders.
- **Plug-in hybrid electric share:** a 0–100 % slider, also typable, instead of 3 buttons.
- **Discreet mobility motifs** in the empty margins of wide screens only (CSS mask, 0 DOM nodes, theme colour).
- **Automatic deployment:** each push to `main` installs, runs the tests, builds and deploys to Cloudflare Workers (GitHub Actions, `cloudflare/wrangler-action`). Nothing goes live if a test fails.

### Changed
- **Cumulative chart:** every line always visible, with a static legend using full names (« Hybride rechargeable » instead of « PHEV »). Click-to-highlight buttons were tried and removed as confusing.
- **Hybrids** are shown by default in « Comparer les voitures ».
- **« Comparer : Toutes les motorisations / Deux voitures au choix »** moved to the top of the tab (it was below the profile and easy to miss).
- **Plug-in hybrid electric share** slider moved out of « Réglages avancés », right under the bars, and under the two cars in the duel when one is a plug-in hybrid.
- **Title on one line:** « Méthode » and FR/EN sit in a slim bar above it.
- **Mobile tabs:** three equal columns, icon above the label (the third tab no longer wraps onto its own line).
- **Ecodesign page:** measures on 2 rows of 3, humble and factual wording, limits stated (visits without interaction aren't counted).
- **Footer link to the Ecodesign page:** « EcoIndex A » (accessible name « Écoconception, EcoIndex A »).
- **Search Console:** deferred until there is a custom domain.
- **EcoIndex:** 93 elements, 1 request, 57.8 kB → 80.01 (A). The credit was merged into the footer paragraph to stay at A: a 94th element at load gives B.

### Fixed
- **Chart line styles and axis labels lost** since dropping `preact/compat` (SVG attributes in camelCase). Thick electric/petrol lines, dashed hybrids/diesel, and the axes are back.
- **UI polish:**
  - unit vertically centred on the typed-value field;
  - budget rows aligned with the card (stacked on mobile);
  - space under « Et côté budget ? »;
  - full-width « Aller plus loin » buttons on mobile;
  - no focus box around headings focused by script.
- **« Méthode » heading** rendered grey on the reading pages.

### Docs
- **ADR 0005:** hosting on Cloudflare Workers (Cloudflare, Inc.). EU-only processing is Enterprise-only; European exit options listed.
- **CONTEXT glossary:** Duel, durée de détention, part électrique PHEV, page de lecture.
- **PRODUCT, DESIGN, README and ADR 0004** updated.

### Security
- `.env` added to `.gitignore` (local secrets are never committed); the CI token is stored as a GitHub secret only.
- `cloudflare/wrangler-action` pinned to a commit SHA (v4.1.3); Dependabot for the actions.

## [7.3.0] — 2026-10-07

### Added
- **« Et côté budget ? » block** under the verdict, as a second reading of it. How it evolved during the release (e3361a0 → 23034b6):
  - first a full cost estimate;
  - then the running cost first, with the purchase total folded;
  - then the purchase estimate only in the euro area, with a note on country defaults;
  - finally running cost only (below).
- **Typable values next to every slider** (consumption, mileage, years, age, odometer), synced with the slider. Out-of-range input is clamped back when you leave the field.
- **Finer steps:** consumption to the tenth (3 to 15 L/100 km), mileage by 500 km (100 km when typed), odometer by 1,000 km.
- **Deployed on Cloudflare Workers** (static assets only): `npm run deploy`, config in `wrangler.jsonc`.
- **CHANGELOG** started. Production figures in the app: 58 kB, 92 elements, EcoIndex A 80.

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
- **Lede rewritten twice:**
  - first: what you learn, both options, battery manufacturing included;
  - then: effort first (« En quatre questions »), personal, « vraiment », covers cost, battery as a credibility marker.
- **Transport chart:**
  - dots first shaded by order of magnitude, then given the continuous violet ramp after a UX/dataviz review;
  - a selectable reference (car / electric car / TGV) was tried, then fixed to the car.
- **Ecodesign info** first a section, then a small fold in the footer.
- **Tab « Explorer » renamed « Comparer les voitures »;** the transport page's trip slider and reference buttons removed (no value added).

### Fixed
- **Transport chart:**
  - the dashed reference line is labelled so it explains itself;
  - its label no longer overlaps the axis;
  - no more « 0 kg » trips.

## [7.1.0] — 2026-10-07

### Changed
- **EcoIndex E (31) → B (77):**
  - React → Preact;
  - tabs mounted on first visit, annexes rendered on opening;
  - one self-hosted font instead of Google Fonts, so no third-party requests. ADR 0003.

## [7.0.0] — 2026-10-07

### Chore
- Local worktrees are ignored by git.

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
