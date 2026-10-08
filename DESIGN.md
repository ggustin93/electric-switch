---
name: Dois-je passer à l'électrique ?
description: Calm green-and-ink instrument for a personal carbon decision
colors:
  page: "#f2f4f1"
  surface: "#ffffff"
  surface-2: "#e9ede8"
  ink: "#1b231f"
  ink-2: "#4f5b55"
  line: "#dde3de"
  line-control: "#7f8c85"
  accent: "#0b7a5e"
  accent-soft: "#dcefe8"
  verdict-switch: "#0b3d30"
  verdict-keep: "#1b231f"
  verdict-tie: "#3a3320"
  motor-ev: "#0b7a5e"
  motor-hev: "#566f1d"
  motor-phev: "#3d6fb4"
  motor-petrol: "#b5441a"
  motor-diesel: "#6e6259"
typography:
  display:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "2.5rem"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.025em"
  heading:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "1.45rem"
    fontWeight: 600
    lineHeight: 1.2
  body:
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
  chart:
    fontFamily: "system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
  label:
    fontFamily: "system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
rounded:
  xs: "3px"
  sm: "6px"
  md: "12px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.surface}"
    rounded: "{rounded.sm}"
    height: "48px"
  option-selected:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.surface}"
    rounded: "{rounded.sm}"
    height: "44px"
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.md}"
    padding: "24px"
---

# Design System: Dois-je passer à l'électrique ?

## Overview

Operate-mode tool: the interface recedes behind the numbers. Restrained palette, flat cards, one deep-green accent, and dark verdict blocks as the single loud moment. Source of truth: the CSS custom properties in `src/styles.css`. Dark mode redefines the same tokens under `prefers-color-scheme: dark`.

## Colors

### Primary
Accent green `#0b7a5e` (dark mode `#34be96`) is reserved for primary actions, the current selection, the selected-tab underline and links.

### Neutral
Page `#f2f4f1`, surfaces white, ink `#1b231f`. All secondary text uses `--ink-2` `#4f5b55` (6.4:1). Never use lighter greys for text.

### Named Rules
- **Motor colours are data colours.** Each powertrain keeps one hue everywhere (bars, lines, swatches). Inside `.sombre` blocks the `--m-*` tokens swap to their `-d` variants, so contrast holds on dark surfaces.
- **Not colour alone.** Selection carries a drawn check, the winner carries a "Lower emissions" tag, and manufacturing is hatched while use is solid.

## Typography

Ecodesign (ADR 0003): Bricolage Grotesque is one static SemiBold instance (wght 600, opsz 14, from the Google Fonts variable source) subset to the characters of the five dictionaries (13.7 kB, ADR 0006) and inlined in the page (ADR 0004) and used for h1, h2, verdict titles and headline figures only. Everything else uses the system font (no download) with tabular numerals. No third-party font requests. Fixed rem scale with a ratio of about 1.2, with no fluid type. The h1 steps down to 2.1rem below 560 px. Nothing is set below 13 px, and prose is capped at about 65ch.

## Layout

Header: the lede (promise) shows **only on step 1 of « Ma décision »**; afterwards it would push answers down. « Méthode » (500, `--ink-2`, ink + accent underline on hover/current) and the language links (FR EN NL IT ES as quiet `--ink-2` text after a 1 px rule; the current one in ink with the accent underline, like the current page: a set-once setting must not compete with the title) sit in a slim right-aligned bar **above** the h1 (`column-reverse`, h1 stays first in the DOM), so « Dois-je passer à l'électrique ? » fits on one line on desktop. Single 52rem column (was 46rem: charts, the duel and the 5 category cards on one row gain room; prose keeps its 60–70ch caps) with a 16 px gutter. The title sits close to the top (12 px page padding, slim bar). Left-aligned on purpose: a centred title over left-aligned forms would create two reading axes. « Méthode » stays in the header as the trust link ("method one click away").
Background: faint Tabler mobility icons (walk, bike, train, bus, car, scooter) **in the empty margins of wide screens only** (≥ 72rem). `body::before` and `body::after`, one per margin, `--ink` at 5 %, drawn as a CSS mask of a narrow 2-column zigzag tile with `space` repeat, so only whole tiles are placed and no icon is ever cut at the column edge. They scroll with the page (no fixed layer). 0 DOM nodes, theme-aware. Impeccable critique (2026-10-08) preferred removing them; the owner kept them, softened. Sections are cards spaced 16 px apart. Fields are spaced 24 px apart. Two-up grids (verdict figures, duel configs) stack below 560 / 16rem.

## Elevation & Depth

Flat. Cards use a 1 px `--line` border and no shadow. Only popovers may use `--shadow-pop`.

## Shapes

Radius 3 px for bars and swatches, 6 px for controls, 12 px for cards. No pills (the language switch is plain text links).

## Components

- **Tabs:** « Ma décision · Comparer les voitures · Se déplacer autrement » (each with a Tabler icon drawn as a CSS mask: balance, bar chart, route). Labels name the task, not the action: « Explorer » was renamed for clarity. Text with a 2 px accent underline, 44 px tall. Below 560 px they become three equal columns with the icon above a wrapping label. Roving tabindex and arrow keys. All panels stay mounted, so answers survive tab switches.
- **Site navigation:** a « Méthode » link in the header (an `aria-current` underline, like the tabs) and a row of links in the footer (« Méthode · EcoIndex A · Mentions légales »), then the disclaimer paragraph ending with the credit « Conçu et développé par Pwablo. » (same paragraph: one element less, see the EcoIndex budget). The reading pages (`#methode`, `#ecoconception`, `#mentions`) are **Read** surfaces: prose capped at 68ch, Bricolage h3s, numbered anchors, and a « Retour au simulateur » link. The tool stays mounted but hidden while they are shown.
- **Profile bar:** a `<details>` summary showing "Votre profil · Belgique · 12 000 km/an · compacte neuve · Modifier" that opens the shared controls.
- **Stepper:** an `<ol>` with `aria-current="step"`. Completed steps show a drawn check and stay clickable. Focus moves to the step heading. Below 560 px it stays on one row: labels of non-current steps are visually hidden (`font-size: 0`, still read by screen readers).
- **Choices:** native radio inputs styled as segments or cards, with the whole fieldset labelled.
- **Sliders:** label and a typable number field on one row (unit centred on the field, value clamped on blur), min and max under the track, `aria-valuetext`. A slider that drives a visible result (e.g. the PHEV electric share) stays **outside** « Réglages avancés ».
- **Help:** a 24 px "?" button with a 44 px hit area beside the label (never inside it). It expands a `--surface-2` note, and the control references it via `aria-describedby`.
- **Verdict:** a dark block tinted per verdict, with the sentence first (capped at 54ch) and two figures after; `aria-live="polite"`. « Comparer les voitures » opens on a second, smaller dark block (best gCO₂e/km): it is that tab's verdict.
- **Selects** are capped at 34rem: a short label doesn't need the whole column.
- **Icons:** Tabler Icons paths (MIT), one stroke weight (1.75), `--ink-2`, each merged into a single `<path>` (`src/icones.jsx`). A small accent lightning bolt marks the electric variant only where a combustion twin exists (bike, bus, car, moped). Used only where they aid recognition: the transport modes.
- **Orders-of-magnitude chart:** a log-scale dot plot (0.1 → 300 g/km, decade gridlines), one row per mode sorted ascending. Dot colour **follows its position on the log axis**, continuously. It uses a sequential violet ramp (`--seq-lo/mid/hi`, interpolated in OKLab, light: lilac → indigo; dark: reversed lightness). Violet is the one hue no powertrain uses. The ramp was validated with the dataviz `--ordinal` check on 6 samples in both themes, low end ≥ 2:1, and position and value always carry the information too. The legend is a gradient strip drawn under the axis labels. Deliberately not green→red: it would clash with the powertrain colours (orange = petrol, green = electric), fail red-green colour blindness and read as a moral verdict, a dashed reference line at « voiture thermique seul·e » (the user's status quo; fixed: a selector was tried and dropped as low value), with the ratio to it under each mode name (« 49 fois moins », « autant » within the 10 % tie rule), and the value plus per-trip mass on every row (it doubles as the table). Built in HTML/CSS (gradients for gridlines), with the axis as a header row of the same grid.
- **Charts:** stacked bars (hatched manufacturing plus solid use) with a text breakdown. The line chart is drawn at its real width with 12 px text, direct end labels and a static pivot marker labelled in km. **All lines are always visible**, with a static legend (`<ul>`, dash swatch + full name). Click-to-highlight buttons were tried and dropped as confusing.
- **Budget rows:** `<dl>` aligned with the card. Below 40rem each value goes under its label.
- **« Aller plus loin »:** primary, secondary and text buttons. Full width below 40rem.
- **Script-focused headings** (step and page changes, `tabindex="-1"`) show no focus ring: they aren't controls.

## Do's and Don'ts

- Don't add eyebrows above headings, emoji or Unicode glyphs as icons, monospace as decoration, or coloured border-left callouts.
- Don't add a web font, a third-party request, or a DOM-heavy component without measuring the EcoIndex (ADR 0003). Keep closed content unrendered (`Repli`) and tabs mounted on first visit only.
- Don't animate layout properties. Motion stays at 150–400 ms and is disabled under reduced motion.
- Do keep every user-visible string in `src/i18n/<lang>.jsx` (all five languages, same keys), as whole sentences: no fragment concatenation, no `.toLowerCase()` on translated words except where the dictionary allows it.
