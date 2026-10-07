# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

General public, French- and English-speaking, who own a petrol or diesel car and wonder whether switching to electric lowers their carbon footprint. Non-experts: they want a defensible answer in about a minute, then optionally dig into the numbers.

## Product Purpose

An educational simulator, "Dois-je passer à l'électrique ? / Should I switch to electric?". It compares the life-cycle (manufacturing + use) emissions of keeping the current car against switching to an electric one, new or used. It also compares all powertrains, and any two specific cars. Success means the user leaves with a clear verdict, the main driver behind it (usually annual mileage and the grid), and trust in how it was computed.

## Positioning

A personal decision rather than a generic "EV vs petrol" average. The car you already own is sunk carbon; the purchase is marginal; used cars carry an economic-allocation share of manufacturing. Every assumption is numbered (H1–H13 / A1–A13) and sourced.

## Operating Context

Single page with three tabs: a four-step Decision wizard leading to a verdict, a Comparison of all powertrains (with a cumulative-emissions chart and break-even km), and a two-car Head-to-head. Annual mileage, country and battery assumptions are shared across tabs.

## Capabilities and Constraints

- Bilingual FR / EN. Language follows the browser and is remembered locally.
- 14 grids, 5 segments, 5 powertrains, 3 battery footprints. The model lives in `src/model.js`, has no UI text, and is covered by `npm test`.
- Results are orders of magnitude with about ±20 % uncertainty. The verdict calls a tie under a 10 % gap.
- Open decision: brand and publication venue are **undecided**.

## Brand Commitments

None yet (brand undecided).

## Evidence on Hand

Sources [1]–[13] are listed in-app: Carbone 4, RTE, SDES, Ember, Electricity Maps, ADEME, Kallitsis 2024, ICCT, IPCC AR5, ISO 14044, Plevin 2014, Ricardo 2020, IEA WEO. There are no testimonials, user counts or endorsements, and none should be invented.

## Product Principles

1. Answer first, method one click away: verdict and figures before assumptions.
2. Never overstate. Claims must be reproducible by the model; when the model disagrees with a source, say so.
3. Same rule everywhere: one tie threshold and one allocation method across tabs.
4. Plain words over jargon. Technical terms are explained where they appear.

## Accessibility & Inclusion

WCAG 2.2 AA: real radio groups and labels, keyboard tabs, 44 px targets, contrast-checked tokens in light and dark, reduced motion respected, charts with text equivalents.
