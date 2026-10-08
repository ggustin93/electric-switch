# electric-switch

Simulateur pédagogique « Dois-je passer à l'électrique ? » — ACV fabrication + usage (Preact + Vite, ecodesigned: EcoIndex A 80, single-page build; see docs/adr/0003 and 0004). Eco-design rules: project skill `green-claude` (INR); design: `impeccable`.

Run `npm test` after any change to `src/model.js`. UI strings live only in `src/i18n/{fr,en,nl,it,es}.jsx` (same keys, checked by `src/i18n.test.js`; French is the source); one page per language is built by `npm run build` (ADR 0006). Design rules: `DESIGN.md`; product facts: `PRODUCT.md`; UI work uses the project `impeccable` skill.

## Agent skills

### Issue tracker

Issues live as local markdown files under `.scratch/<feature>/`. See `docs/agents/issue-tracker.md`.

### Domain docs

Single-context: one `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.
