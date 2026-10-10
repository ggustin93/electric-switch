# Changelog

Notable changes to « Dois-je passer à l'électrique ? ». Format inspired by [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/); versions follow the in-app number.

## [Unreleased]

### Added
- **Audience measurement live:** Umami Cloud website ID set in `src/mesure.js` (events only: verdict, tab, reading page; nothing when the simulator loads, one event when a reading page opens; no cookie, Do Not Track and GPC respected; only on `electricornot.eu`, never on localhost or a preview). Contact address for the account: `contact@electricornot.eu`, an Infomaniak redirect to the owner.
- **« À propos » page** (`/{lang}/apropos/`, 5 languages, JSON-LD `AboutPage`): what the simulator is for, who made it (the « Qui a fait ce simulateur » paragraph, moved from the legal notice), where the figures come from (Carbone 4, ADEME, ICCT, Ember, Electricity Maps, version), ecodesign, and a contact to report errors (contact@electricornot.eu, redirected to the owner). Linked first in the footer.
- **Energy prices updated every week** (ADR 0011; `scripts/prix.mjs`, `.github/workflows/prix.yml`, Thursdays): fuel from the EC Weekly Oil Bulletin (Monday prices with taxes), household electricity from Eurostat `nrg_pc_204` (latest semester published per country), written to `src/prix.json` at build time; the site redeploys only when a price changes. No request at runtime (EcoIndex unchanged). A failing source or an implausible value keeps the previous prices. The budget note now shows each country's data date. Non-EU countries (UK, US, AU, CN, IN, Norway fuel) stay hand-entered.
- **« Garder votre voiture » on the cumulative chart** (« Comparer les voitures »): once « Ma décision » step 2 is answered, a dotted line shows the current car kept: from 0 t (manufacturing already paid) at its real consumption, until the end of its remaining life. Its end value equals the verdict's « garder » figure (`voitureActuelle`, `src/model.js`, tested). 5 languages; initial DOM unchanged (90).
- **Search engines:** Google Search Console verified for `electricornot.eu` (DNS TXT, sitemap submitted); IndexNow active (`INDEXNOW_KEY` set, sitemap URLs sent after each deploy).

### Changed
- **Méthode intro and À propos « Portée et choix méthodologiques », solution-oriented:** they now say that several choices deliberately work against the electric car (shorter lifetime than the ICCT, no recycling credit, full manufacturing for a new purchase), so a conclusion in favour of electric is robust; exclusions are framed as the focus of the tool; « not an ISO 14040/44 LCA, not peer-reviewed » kept, with « public, sourced and tested assumptions ». 5 languages.
- **« À propos » rewritten** (UX, SEO and academic review, academic tone, 7 sections): Origine et objet (the question among the author's friends), Portée et limites (one indicator; not counted; decision-oriented framing; ±20 % is an order of magnitude; not an ISO 14040/44 LCA, no critical or peer review), Auteur et indépendance (no link with the bodies cited), Recours à l'intelligence artificielle (generative AI helped write part of the code and texts and search the literature; values checked against primary sources; the simulator itself uses no AI), Sources et méthode (tests, code not public yet, how to cite), Sobriété numérique, Signaler une erreur. Meta description names the author and sources. JSON-LD: author `Person` (Guillaume Gustin) as the AboutPage `mainEntity` and the Méthode `author`. 5 languages.
- **Écoconception page, solution-oriented:** the intro leads with the result (1 request, 57 Ko, EcoIndex A); the first item presents the Infomaniak hosting with figures from its impact report (100 % renewable electricity, PUE 1.085 in 2024, servers kept up to 15 years, ISO 14001/50001, B Corp, heat reuse in Geneva), attributed to the host and linked in the references; « Limites » becomes a short « Précisions ». No carbon-neutrality claim. 5 languages.
- **H3** (Méthode): « lecture de type conséquentiel, appliquée à la fabrication », consistent with the average grid mix of H5.
- **Header title links home** on reading pages (not on the simulator, where a reload would erase the answers). **Copy:** Écoconception intro shortened, measure heading « Mesure en ligne du 08/10/2026 »; the modes comparison fold « À lire avant de comparer », which sits after the chart, is now « Hypothèses et limites ». 5 languages.
- **Méthode intro rewritten** (data-scientist + UX review): states the unit (CO₂e over the whole life), the two items added, how manufacturing is counted (new: all; second-hand: a share by value; kept: none), the average grid that decarbonises, what is not counted (end of life, maintenance, infrastructure) and the ±20 % order of magnitude. The old wording « la part de sa fabrication qui vous revient » was only true for second-hand cars. 5 languages; also feeds the page description and llms.txt.
- **Footer credit** in the display font with a decorative « ✦ » (CSS, hidden from screen readers, 0 DOM element).
- **« À propos » contact** is now contact@electricornot.eu (redirects to the owner).
- **Sources 18–19** (Oil Bulletin, Eurostat) no longer name a fixed date: prices are refreshed weekly and dated in the budget.
- **Budget, country is a link:** in « Et côté budget ? », the country name in « prix : Belgique » takes you back to step 1 with focus on the country field (the country is guessed, so it can go unnoticed). No new string; the country still drives both the grid mix and the default prices.
- **Écoconception page, audience line:** « aucune requête au chargement » now says « du simulateur » and that a reading page sends one event when it opens (it was true of the simulator only). 5 languages.
- **Hosting moved to Infomaniak** (ADR 0010, replaces 0005): `electricornot.eu` on the free Starter web hosting that comes with the domain (Switzerland, Infomaniak Network SA). `build.mjs` writes `dist/.htaccess` instead of Cloudflare's `_headers` (same security headers, CSP hashes and per-page hreflang `Link`, plus 404 page, 301 to `https://electricornot.eu`, gzip, revalidation with 304; `versHtaccess`, `src/entetes.js`, tested). Deploy mirrors `dist/` over FTP with `lftp` (Starter offers no TLS), then checks over HTTPS that every file and the CSP match the build (`scripts/verifier-en-ligne.mjs`); wrangler removed. « Mentions légales » host block and the hosting sentence of « Écoconception » updated in the 5 languages.
- **Footer:** links + credit only; the disclaimer (±20 %, sources, version) moved to « À propos ». Same element count on the tool page (90).
- **« Ma décision » intro lighter** (≈ 52 → 48 words, still the short answer and meta description): « sur sa vie », « pas toujours gagnant »; the grid-decarbonisation condition is kept. 5 languages.
- **Header:** the 5 language links become a « FR ▾ » menu to the right of the title; « Méthode » leaves the header (it stays in the footer). On mobile the bar above the title disappears. Same element count (EcoIndex A unchanged).
- **Intros:** « Ma décision » intro (the short answer) shortened; « Se déplacer autrement » intro shortened to one sentence; every tab intro now sits in a light accent frame; the Méthode page now opens by explaining how the calculation works. 5 languages.
- **« Comparer les voitures »:** the « Empreinte totale par motorisation » title opens the card, with « Votre profil » under its subtitle (same in face-à-face).
- **Budget block reduced to one sentence** (UX + data-scientist review, « less is more »): « À l'usage (prix : Belgique), l'électrique vous coûte environ 1 100 € de moins par an. » The two rows (same scope per year, energy alone per 100 km, now labelled), the scope note (home charging, the saving drops with public charging) and the energy prices sit in one fold, « Détail et vos prix de l'énergie ». The payback sentence is removed: without purchase price or resale value, it only restated the yearly gap and misled about « the full price ». 5 languages.
- **Docs:** `CONTEXT.md` renamed `GLOSSARY.md` (current mattpocock/skills convention); references updated.

### Fixed
- **Mobile view (Impeccable adapt):** the language links no longer touch the screen edge; cards and verdict use 16 px padding, so content gains 16 px of width; the verdict sentence drops to body size (9 → 6 lines, figures in the first screen).
- **« 6,6 fois moins »** (Se déplacer autrement) no longer breaks across two lines.
- **« Modifier mes réponses »** (Aller plus loin): no horizontal padding, so its text lines up with the buttons' edge instead of sitting ~24 px to the right; on desktop it now fits on the same row.

### Removed
- **« Pas de voiture à remplacer ? Comparez toutes les motorisations »** under step 1: redundant with the « Comparer les voitures » tab. The tool page drops to 90 elements (more EcoIndex headroom).

## [7.5.0] — 2026-10-08

### Added
- **Dutch, Italian and Spanish** alongside French and English, one self-contained page per language (`/fr/` … `/es/`, ADR 0006):
  - the root `/` redirects to the remembered language, else the browser's, else English;
  - display font rebuilt to cover ñ, ¿, à, ë… (13.7 kB);
  - a key-parity test ensures every language has the French keys.
  - NL/IT/ES are machine-drafted: **native review still to do**.
- **Search visibility (SEO audit 48/100 → tickets 01–07, `.scratch/seo-visibilite/`):**
  - **pre-rendered pages** (ADR 0008): title, intro and step 1 in the raw HTML; Preact hydrates them;
  - **real reading pages** (ADR 0009): `/{lang}/methode/`, `/ecoconception/`, `/mentions/`, `/questions/`, each with its own title, description and canonical; old `#methode` links redirect;
  - **share preview**: one 1200×630 image per language, `og:image` + `twitter:card`;
  - **`sitemap.xml`** (26 URLs with hreflang), **`robots.txt`** (search and AI-search bots allowed, `Content-Signal: ai-train=no`), **`llms.txt`**, one **JSON-LD** block per page (WebApplication, Organization, TechArticle);
  - hreflang sent as HTTP `Link` headers, page by page; absolute URLs from a single `SITE_URL` variable.
- **« Questions courantes » page** (5 languages): six sourced answers computed by the model and re-checked by three experts (data scientist, LCA, fact-checker). The tool's title becomes « Voiture électrique ou thermique : dois-je passer à l'électrique ? », and the intro gives a figured answer with its conditions.
- **Trust signals:**
  - « Qui a fait ce simulateur » opens the Mentions légales page (Guillaume Gustin, Pwablo, ingénieur logiciel indépendant à Bruxelles; no funding from carmakers or energy suppliers, no ads, no personal data);
  - « Méthode mise à jour le 8 octobre 2026 »;
  - each of the 20 sources has a verified URL or DOI.
- **Odometer in « Ma décision »** (ADR 0007): a used EV's remaining life is capped by its odometer (200 000 km), with the same ownership window as « Comparer ».
  - The odometer is estimated at age × 12 000 km until typed, marked « km (estimé) ».
  - The typed value is always respected (the old 30 000 km/yr cap is removed).
- **Help to estimate « Encore combien d'années roulerait-elle ? »** from the car's age and odometer (H1).
- **Charging country pre-filled locally** from the time zone, then the language region, else the EU average. Nothing is sent.
- **404 page** in 5 languages, static, no JS.
- **Domain switch prepared** (ticket 08): `SITE_URL` and `INDEXNOW_KEY` are GitHub variables; an IndexNow ping runs after each deploy. Owner checklist in the ticket.

### Changed
- **« Comparer les voitures »:**
  - the « Comparer » switch sits outside the cards;
  - one main card per mode;
  - bars and cumulative curve side by side on wide screens (5/12 – 7/12);
  - quiet light summary panels, so the dark block is reserved for the « Ma décision » verdict;
  - « Face-à-face » replaces « Deux voitures au choix », with each car's own age, odometer and plug-in hybrid share;
  - « Chaque motorisation dans la même catégorie : … » is stated under the bars.
- **Layout and typography (Impeccable critique 28/40, then layout/typeset/clarify passes):**
  - one 60rem column edge for everything;
  - title higher up;
  - one intro sentence per tab, under the tabs;
  - quieter language links;
  - mobile tabs in three columns;
  - one-line mobile stepper;
  - footer in a 2 × 2 grid on mobile;
  - reading pages uniform (full-column card, 68ch text).
- **Background motifs:** only in the empty margins of wide screens, 5 %, whole tiles, scrolling with the page.
- **Méthode page:** references as plain text « [1, 8, 14] », sources without italics → EcoIndex A.

### Fixed
- Battery range made consistent between H8 and the help bubble (medians 62–74 kgCO₂e/kWh, over 100 depending on material origin); source [20] retitled (Morrison & Wappelhorst 2023).
- Touch targets ≥ 44 px; upcoming stepper steps readable (contrast 2.7 → 6.4:1); drawn select chevron; typed-value unit centred.

### Security
- Security headers on every response: HSTS, nosniff, Referrer-Policy, Permissions-Policy, and a CSP with SHA-256 hashes computed at build time (no `'unsafe-inline'`).

### Ecodesign
- Every page stays **EcoIndex A**: tool pages 92 elements, ~56 kB; Méthode 92 elements, at the threshold (80.0); Questions, Écoconception and Mentions 81–89. 1 request per page.

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
