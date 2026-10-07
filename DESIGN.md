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
    fontFamily: "Bricolage Grotesque, Instrument Sans, system-ui, sans-serif"
    fontSize: "2.5rem"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.025em"
  heading:
    fontFamily: "Bricolage Grotesque, Instrument Sans, system-ui, sans-serif"
    fontSize: "1.45rem"
    fontWeight: 600
    lineHeight: 1.2
  body:
    fontFamily: "Instrument Sans, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
  chart:
    fontFamily: "Instrument Sans, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
  label:
    fontFamily: "Instrument Sans, system-ui, sans-serif"
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

Two families: Bricolage Grotesque for h1, h2, verdict titles and headline figures, and Instrument Sans for everything else, with tabular numerals. Fixed rem scale with a ratio of about 1.2, with no fluid type. The h1 steps down to 2.1rem below 560 px. Nothing is set below 13 px, and prose is capped at about 65ch.

## Layout

Single 46rem column with a 16 px gutter. Sections are cards spaced 16 px apart. Fields are spaced 24 px apart. Two-up grids (verdict figures, duel configs) stack below 560 / 16rem.

## Elevation & Depth

Flat. Cards use a 1 px `--line` border and no shadow. Only popovers may use `--shadow-pop`.

## Shapes

Radius 3 px for bars and swatches, 6 px for controls, 12 px for cards. Pills only for the language switch.

## Components

- **Tabs:** text with a 2 px accent underline, 44 px tall, roving tabindex and arrow keys. All panels stay mounted, so answers survive tab switches.
- **Stepper:** an `<ol>` with `aria-current="step"`. Completed steps show a drawn check and stay clickable. Focus moves to the step heading.
- **Choices:** native radio inputs styled as segments or cards, with the whole fieldset labelled.
- **Sliders:** label and `<output>` on one row, min and max under the track, `aria-valuetext`.
- **Help:** a 24 px "?" button with a 44 px hit area beside the label (never inside it). It expands a `--surface-2` note, and the control references it via `aria-describedby`.
- **Verdict:** a dark block tinted per verdict, with the sentence first and two figures after; `aria-live="polite"`.
- **Charts:** stacked bars (hatched manufacturing plus solid use) with a text breakdown. The line chart is drawn at its real width with 12 px text, direct end labels and a static pivot marker labelled in km.

## Do's and Don'ts

- Don't add eyebrows above headings, emoji or Unicode glyphs as icons, monospace as decoration, or coloured border-left callouts.
- Don't animate layout properties. Motion stays at 150–400 ms and is disabled under reduced motion.
- Do keep every user-visible string in `src/i18n.jsx`, as whole sentences: no fragment concatenation, no `.toLowerCase()` on translated words except where the dictionary allows it.
