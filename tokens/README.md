# Tokens

`tokens.json` is the source of truth for every colour role (light and dark), motion value, chart and loader colour.
`tokens.css` is the CSS form of the same values.

**Added for v2.1.0 (2026-11-13):** The portable contract adds the missing scales and role aliases beside these
unchanged legacy files. Read [ARCHITECTURE.md](ARCHITECTURE.md) for the three tiers, derivation, platform units,
theme pairs and tenant overrides; [USAGE.md](USAGE.md) for every semantic/component role; and the generated
[contrast matrix](contrast-matrix.md) ([JSON](contrast-matrix.json)) for permitted and failing pairings.
Run `node scripts/tokens/generate.mjs` then `node scripts/tokens/validate.mjs` from the repository root.
The new generator writes `portable.css`, DTCG JSON, a Tailwind preset, Android and iOS exports, and reference tables.
It never rewrites `tokens.json`, `tokens.css` or previews. See [BATCH-3-HANDOFF.md](BATCH-3-HANDOFF.md) for site wiring.

## Palette previews

Generated from `tokens.json`, so they cannot show an old palette. Each role is a labelled swatch with its hex,
grouped as surfaces/text, accent, brand, emphasis, success, warn, info, danger, sidebar, scrim, chart and loader.

| Light | Dark |
|---|---|
| ![Light palette](previews/palette-light.png) | ![Dark palette](previews/palette-dark.png) |

![Light and dark side by side](previews/palette-light-vs-dark.png)

The editable SVG of each image sits beside it in `previews/` (`palette-*.svg`).

## Regenerating and checking the previews

```sh
node scripts/make-previews.mjs      # rebuild every palette + motion preview, rewrite scripts/previews.lock.json
node scripts/check-previews.mjs     # exit 1 if tokens.json / box-open.css / box-open-markup.html changed since
```

The generator needs Microsoft Edge (set `EDGE_PATH` to override its location) and `sharp` (taken from
`site/node_modules`). The check needs only Node: it compares SHA-256 hashes of the sources against
`scripts/previews.lock.json` and confirms every preview file exists. Run the generator after editing a token.
