<picture>
  <source media="(prefers-color-scheme: dark)" srcset="brand/readme/banner-dark.svg">
  <img alt="Space Works Design system" src="brand/readme/banner-light.svg" width="100%">
</picture>

<p align="center">
  <a href="https://spaceworks-labs.github.io/SpaceWorks-Design-System/"><img src="https://img.shields.io/badge/site-spaceworks--labs.github.io-006E63?style=flat-square&labelColor=142C2A" alt="Browse the design system site"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/licence-AGPL--3.0--or--later-006E63?style=flat-square&labelColor=142C2A" alt="Licence: AGPL-3.0-or-later"></a>
</p>

The Space Works design system: brand guidelines, logo masters, icons, fonts, design tokens and the UX
pattern specs. Use it as a git submodule in any Space Works project so every surface draws from one source.

**Version: Space Works Design System v2.0.1** (`VERSION` = `2.0.1`; v2.0 patch), which ships alongside SpaceWorks 0.12.0. What
changed is in [`docs/whats-new-v2.0.md`](docs/whats-new-v2.0.md).

> **Current rule (v2.1.0, 2026-11-13):** `VERSION` now reads `2.1.0`; this is the additive publication target under decision 397, pending its tag and release. The v2.0.1 description above remains release history. (3-N01) — supersedes the version line above; see [current release guidance](docs/current-rules.md#cr-release-01) and [v2.1 notes](docs/whats-new-v2.1.md).

> **Current rule (v2.1.1, 2026-11-13):** `VERSION` reads `2.1.1`. v2.1.0 was tagged and released on 13 November 2026 ([PR #17](https://github.com/SpaceWorks-Labs/SpaceWorks-Design-System/pull/17)); v2.1.1 is its QA patch (see the changelog below). The two version notes above remain release history.

> **Current rule (v2.0.1, 2026-11-13):** Design System v2.0 is independent of app 0.12.0. v2.0.0 was released 2026-11-13; 2.0.1 is the fix checkpoint and ledger 397 sets phase 2 to v2.1.0. Observed at the 2026-11-13 batch baseline: local VERSION still reads 2.0.0 and tag v2.0.0 exists; publication and a target version are different facts. (1A-N01) — supersedes the line above; see [docs/current-rules.md#cr-release-01](docs/current-rules.md#cr-release-01).

```bash
git submodule add https://github.com/SpaceWorks-Labs/SpaceWorks-Design-System.git design
```

**Browse it at [spaceworks-labs.github.io/SpaceWorks-Design-System](https://spaceworks-labs.github.io/SpaceWorks-Design-System/)**: the logo
masters, colours, type, voice, every design token and the UI specs, published from this repository by
`site/` on every push to `main`. To run it locally: `cd site && npm install && npm run dev`.

## Screenshots

> **Added 2026-11-13 (v2.1.0).** The published site, captured from the production build: desktop (1440 px) with light and dark following your GitHub theme, and the phone (390 px) in both. Each thumbnail links to the full image; all 48 files are in [`screenshots/site/`](screenshots/site/).

| Page | Desktop (light / dark by theme) | Phone, light | Phone, dark |
|---|---|---|---|
| Home | <a href="screenshots/site/home-desktop-light.webp"><picture><source media="(prefers-color-scheme: dark)" srcset="screenshots/site/home-desktop-dark.webp"><img alt="Home, desktop" src="screenshots/site/home-desktop-light.webp" width="360"></picture></a> | <a href="screenshots/site/home-phone-light.webp"><img alt="Home, phone, light" src="screenshots/site/home-phone-light.webp" width="90"></a> | <a href="screenshots/site/home-phone-dark.webp"><img alt="Home, phone, dark" src="screenshots/site/home-phone-dark.webp" width="90"></a> |
| Components | <a href="screenshots/site/components-desktop-light.webp"><picture><source media="(prefers-color-scheme: dark)" srcset="screenshots/site/components-desktop-dark.webp"><img alt="Components, desktop" src="screenshots/site/components-desktop-light.webp" width="360"></picture></a> | <a href="screenshots/site/components-phone-light.webp"><img alt="Components, phone, light" src="screenshots/site/components-phone-light.webp" width="90"></a> | <a href="screenshots/site/components-phone-dark.webp"><img alt="Components, phone, dark" src="screenshots/site/components-phone-dark.webp" width="90"></a> |
| Button | <a href="screenshots/site/button-desktop-light.webp"><picture><source media="(prefers-color-scheme: dark)" srcset="screenshots/site/button-desktop-dark.webp"><img alt="Button, desktop" src="screenshots/site/button-desktop-light.webp" width="360"></picture></a> | <a href="screenshots/site/button-phone-light.webp"><img alt="Button, phone, light" src="screenshots/site/button-phone-light.webp" width="90"></a> | <a href="screenshots/site/button-phone-dark.webp"><img alt="Button, phone, dark" src="screenshots/site/button-phone-dark.webp" width="90"></a> |
| Token reference | <a href="screenshots/site/tokens-desktop-light.webp"><picture><source media="(prefers-color-scheme: dark)" srcset="screenshots/site/tokens-desktop-dark.webp"><img alt="Token reference, desktop" src="screenshots/site/tokens-desktop-light.webp" width="360"></picture></a> | <a href="screenshots/site/tokens-phone-light.webp"><img alt="Token reference, phone, light" src="screenshots/site/tokens-phone-light.webp" width="90"></a> | <a href="screenshots/site/tokens-phone-dark.webp"><img alt="Token reference, phone, dark" src="screenshots/site/tokens-phone-dark.webp" width="90"></a> |
| Colour | <a href="screenshots/site/colour-desktop-light.webp"><picture><source media="(prefers-color-scheme: dark)" srcset="screenshots/site/colour-desktop-dark.webp"><img alt="Colour, desktop" src="screenshots/site/colour-desktop-light.webp" width="360"></picture></a> | <a href="screenshots/site/colour-phone-light.webp"><img alt="Colour, phone, light" src="screenshots/site/colour-phone-light.webp" width="90"></a> | <a href="screenshots/site/colour-phone-dark.webp"><img alt="Colour, phone, dark" src="screenshots/site/colour-phone-dark.webp" width="90"></a> |
| Logo | <a href="screenshots/site/logo-desktop-light.webp"><picture><source media="(prefers-color-scheme: dark)" srcset="screenshots/site/logo-desktop-dark.webp"><img alt="Logo, desktop" src="screenshots/site/logo-desktop-light.webp" width="360"></picture></a> | <a href="screenshots/site/logo-phone-light.webp"><img alt="Logo, phone, light" src="screenshots/site/logo-phone-light.webp" width="90"></a> | <a href="screenshots/site/logo-phone-dark.webp"><img alt="Logo, phone, dark" src="screenshots/site/logo-phone-dark.webp" width="90"></a> |
| Motion principles | <a href="screenshots/site/motion-desktop-light.webp"><picture><source media="(prefers-color-scheme: dark)" srcset="screenshots/site/motion-desktop-dark.webp"><img alt="Motion principles, desktop" src="screenshots/site/motion-desktop-light.webp" width="360"></picture></a> | <a href="screenshots/site/motion-phone-light.webp"><img alt="Motion principles, phone, light" src="screenshots/site/motion-phone-light.webp" width="90"></a> | <a href="screenshots/site/motion-phone-dark.webp"><img alt="Motion principles, phone, dark" src="screenshots/site/motion-phone-dark.webp" width="90"></a> |
| Overlays | <a href="screenshots/site/overlays-desktop-light.webp"><picture><source media="(prefers-color-scheme: dark)" srcset="screenshots/site/overlays-desktop-dark.webp"><img alt="Overlays, desktop" src="screenshots/site/overlays-desktop-light.webp" width="360"></picture></a> | <a href="screenshots/site/overlays-phone-light.webp"><img alt="Overlays, phone, light" src="screenshots/site/overlays-phone-light.webp" width="90"></a> | <a href="screenshots/site/overlays-phone-dark.webp"><img alt="Overlays, phone, dark" src="screenshots/site/overlays-phone-dark.webp" width="90"></a> |
| Accessibility | <a href="screenshots/site/accessibility-desktop-light.webp"><picture><source media="(prefers-color-scheme: dark)" srcset="screenshots/site/accessibility-desktop-dark.webp"><img alt="Accessibility, desktop" src="screenshots/site/accessibility-desktop-light.webp" width="360"></picture></a> | <a href="screenshots/site/accessibility-phone-light.webp"><img alt="Accessibility, phone, light" src="screenshots/site/accessibility-phone-light.webp" width="90"></a> | <a href="screenshots/site/accessibility-phone-dark.webp"><img alt="Accessibility, phone, dark" src="screenshots/site/accessibility-phone-dark.webp" width="90"></a> |
| Adoption | <a href="screenshots/site/adoption-desktop-light.webp"><picture><source media="(prefers-color-scheme: dark)" srcset="screenshots/site/adoption-desktop-dark.webp"><img alt="Adoption, desktop" src="screenshots/site/adoption-desktop-light.webp" width="360"></picture></a> | <a href="screenshots/site/adoption-phone-light.webp"><img alt="Adoption, phone, light" src="screenshots/site/adoption-phone-light.webp" width="90"></a> | <a href="screenshots/site/adoption-phone-dark.webp"><img alt="Adoption, phone, dark" src="screenshots/site/adoption-phone-dark.webp" width="90"></a> |
| Current rules | <a href="screenshots/site/current-rules-desktop-light.webp"><picture><source media="(prefers-color-scheme: dark)" srcset="screenshots/site/current-rules-desktop-dark.webp"><img alt="Current rules, desktop" src="screenshots/site/current-rules-desktop-light.webp" width="360"></picture></a> | <a href="screenshots/site/current-rules-phone-light.webp"><img alt="Current rules, phone, light" src="screenshots/site/current-rules-phone-light.webp" width="90"></a> | <a href="screenshots/site/current-rules-phone-dark.webp"><img alt="Current rules, phone, dark" src="screenshots/site/current-rules-phone-dark.webp" width="90"></a> |
| Decisions | <a href="screenshots/site/decisions-desktop-light.webp"><picture><source media="(prefers-color-scheme: dark)" srcset="screenshots/site/decisions-desktop-dark.webp"><img alt="Decisions, desktop" src="screenshots/site/decisions-desktop-light.webp" width="360"></picture></a> | <a href="screenshots/site/decisions-phone-light.webp"><img alt="Decisions, phone, light" src="screenshots/site/decisions-phone-light.webp" width="90"></a> | <a href="screenshots/site/decisions-phone-dark.webp"><img alt="Decisions, phone, dark" src="screenshots/site/decisions-phone-dark.webp" width="90"></a> |

## Contents

> **Current rule (v2.0.1, 2026-11-13):** The current brand book is v2 (50 pages); the retained v1 book is historical (17 pages). The three type families are Gilroy, Outfit and Unbounded. Start with [Current rules](docs/current-rules.md) and use [Voice and content](docs/voice-and-content.md) for product writing. (1A-N02) — supersedes the line above; see [docs/current-rules.md#cr-scope-01](docs/current-rules.md#cr-scope-01).

| Folder | What it holds |
|---|---|
| `brand/` | `space-works-brand-guidelines-v2.pdf` (current, 50 pages, built from `brand/guidelines-v2/`) and `space-works-brand-guidelines-v1.pdf` — the source of truth for logo, colour, type, icons and voice; where they differ, v2 wins |
| `logo/` | Ten vector masters exported directly from Figma, with matching 4× PNGs: `symbol`, `symbol-reversed`, `symbol-one-colour-ink`, `lockup-stacked`, `lockup-stacked-reversed`, `lockup-stacked-one-colour-ink`, `lockup-horizontal`, `lockup-horizontal-reversed`, `lockup-horizontal-one-colour-ink`, `app-icon` |
| `mascot/` | **Patch**, the painted wolf mascot, cut from the approved concept sheets in `mascot/concept/` and traced to vector SVG: `patch.svg` (hero), `patch-animated.webp`/`.svg`/`.gif` (the 7-second sneeze loop) and its eight `frames/`, plus `walk/` (the walking pose, walk cycle and its frames) and `walk-left/` (the approved left-facing walk), with high-resolution PNGs. `mascot/original/` keeps every piece's exact pixels from the sheets (lossless) and `mascot/compressed/` has lighter SVGs, `.svgz` and small WebPs. `mascot/dark/` is every piece with a thin Warm Cream sticker border for dark surfaces only (full SVGs, lossless PNGs, WebPs and GIFs, plus lite SVGs, `.svgz` and small WebPs in `dark/compressed/`). Story and usage rules in `mascot/README.md` |
| `icons/` | `favicon.svg`, PNG app icons (16, 32, 180, 192, 512) and the 1200×630 social card |
| `fonts/` | Gilroy Light and ExtraBold (the free weights only, WOFF2), Outfit and Unbounded (OFL, WOFF2). See `fonts/README.md`. |
| `tokens/` | `tokens.css` (`@font-face` + light/dark colour variables as RGB triplets) and `tokens.json` (the same colours as hex, plus the seven brand colours) |
| `motion/box-open/` | The **box-open loader**, the loading animation used everywhere in Space Works: `box-open.css`, the SVG markup, a standalone `demo.html` and the React components (`LogoLoader`, `BoxSpinner`, `BoxArt`). Usage, sizes, timing and accessibility in `motion/box-open/README.md` |
| `motion/theme-reveal/` | The **theme reveal**, the light/dark switch animation (circle growing from the toggle, 720 ms, cross-fade fallback, instant under reduced motion): `theme-reveal.css`, framework-free `theme-reveal.js`, a standalone `demo.html`, the app's React files and an animated preview. Usage in `motion/theme-reveal/README.md` |
| `motion/README.md` | The **motion kit index**: every animation in the product (49 rows) mapped to a reusable folder (`route-transition/`, `page-enter/`, `scroll-reveal/`, `overlays/`, `toast/`, `sidebar/`, `collapse/`, `skeleton/`, `hover-press/`, `feedback/`, `delight/`, `kiosk-display/`, plus `box-open/`, `theme-reveal/`, `search/`). Each folder has framework-free CSS from the app, `react/` copies, a light/dark `demo.html`, animated previews and a README (where, why, tokens, trigger, reduced motion, dark, do and don't) |
| `docs/` | `motion.md` (**every animation in the product**: where, why, tokens, plus the "which animation to use" guide and the logo hover rule), `theming.md` (**how to implement the light/dark switch** with these tokens: tokens, `html.dark`, pre-paint script, React and plain-JS examples), `ui-brand-spec.md` (token derivations, contrast ratios, states, status pills, type scale, logo use), `ux-spec.md` (**Space Works UX**: our interaction patterns, reusable layouts, navigation and screen specs), `ux-screens-longtail.md` (remaining screens) |
| `docs/` (more) | `product-rules.md` (the product and engineering rules every SpaceWorks-Labs product follows, with a per-product checklist), `decisions.md` (every design decision and its reason), `lessons-learned.md` (what went wrong and what we do now) and `whats-new-v2.0.md` (what's new in Design System v2.0, which ships alongside SpaceWorks 0.12.0) |
| `tokens/previews/` | Rendered previews of the colour tokens, light and dark |
| `screenshots/ux/` | Screenshots of Space Works UX in Space Works Events (light, dark and phone), used by the site's UX pages |
| `site/` | The Starlight website published to GitHub Pages; `scripts/sync-kit.mjs` copies the kit in at build time, and `scripts/split-docs.mjs` lists which long docs are published as an overview plus one page per part (the Markdown here stays one file) |
| `references/yuyu/` | The reference boards from [Yuyu](https://github.com/twilighty-abhi/yuyu) that inspired Space Works UX |

## Brand at a glance

- **Colours:** Deep Ink `#142C2A`, Maker Teal `#006E63`, Workshop Orange `#FF7447`, Citron `#DFFF8F`,
  Sky Blue `#B5CDFF`, Warm Yellow `#FFD447`, Warm Cream `#FFF4E8`. Neutral first, accent second. Never
  orange text on cream. Every status pairs colour with a word or icon.
- **Type:** Gilroy ExtraBold for display headings, Gilroy Light for light display text (the only Gilroy
  weights that ship), Outfit for body and interface text, Unbounded for one short accent phrase per layout.
- **Logo:** use the masters as supplied — no stretching, rotating, recolouring or effects. Clear space is
  a quarter of the symbol height on every side. Symbol at least 48 px; primary lockup at least 180 px wide.
- **Mascot:** Patch, an African painted wolf carrying a wrench. Painted wolves vote by sneezing and look
  after the whole pack, and no two coats are alike. Patch is the friendly face for empty states,
  onboarding and merch; the box symbol stays the logo. See [mascot/README.md](mascot/README.md).
- **Voice:** clear, warm and specific. "No parts added yet. Add your first item." Brand name in copy:
  Space Works. Wordmark: space works.

## Using the tokens

```css
@import "design/tokens/tokens.css";

body { background: rgb(var(--color-bg)); color: rgb(var(--color-ink)); font-family: var(--font-sans); }
h1, h2, h3 { font-family: var(--font-display); font-weight: 600; }
.button-primary { background: rgb(var(--color-accent)); color: rgb(var(--color-on-accent)); }
```

Add the class `dark` to `<html>` for dark mode. The font URLs in `tokens.css` are relative to the
`tokens/` folder.

## Changelog

- **v2.1.1 — QA patch: fixed surfaces, focus, encoding, rules (2026-11-13).** A full QA of the 157-page site at 390, 768, 1280 and 1680 in light and dark. **Fixed surfaces keep their own look:** a light demo card on a dark page drew its loader, inline and logo marks cream-on-cream (blank) because the kit reads `html.dark`; marks on themed cards now carry the kit's forced ground (`g-light` / `g-dark`), kept in step when a demo switches theme, and cards, logo stages and mascot frames keep their own focus ring and Play controls instead of the page theme's (a citron ring on cream measured 1.03:1). **Encoding repair:** em and en dashes, multiplication signs, middle dots and curly quotes written as `?` in v2.1.0 are restored in 27 files (wording unchanged). **Accessibility:** the theming demo's Light/Dark/System radios have one tab stop and arrow keys (DSA-010), task-list checkboxes are named, sideways-scrolling tables are keyboard-reachable, Play/Pause previews drop the contradictory `aria-pressed`, the four kit demos without one get the brand focus ring, and the install command no longer pushes the home, downloads and kit pages sideways on phones. The header badge links to the notes for the version it shows. **Rules:** product rules §2.5 (release images are the frontend and the backend only; object storage is Silo or any S3-compatible store; SW-433) and §12.3 (one README structure for every repository; SW-436). **New guards:** `scripts/check-box-grounds.mjs`, `scripts/check-site-qa.mjs` and `scripts/check-encoding.mjs` (run by the site build); lessons 42 and 43. Findings: `handover/reports/DS-QA-v2.1.1.md` in the SpaceWorks repository.

- **v2.1.0 — publication and adoption (2026-11-13; release target until tagged).** Adds 19 named component references, platform adoption guides, accessibility and content guidance, a current-rules register, release/contribution guidance and portable web/Android/iOS token exports with usage and contrast matrices. The site preserves the full motion READMEs, publishes source examples and checksum downloads, pins installation links from `VERSION`, and generates static preview posters before the build. Motion flow and accessible controls build on the v2.0.1 logo fix; the coloured box follows SW-412 and black-and-white marks retain their documented behaviour. See [What's new in v2.1](docs/whats-new-v2.1.md).

- **v2.0.1 — logo closed state (SW-389).** The shut box now shows all four flaps in the logo's own colours in both themes — top-left and bottom-right green, top-right and bottom-left orange — and each flap keeps its colour through the whole fold, so open and shut read as the same mark. The no-holes, overlap-order, static-rest and reduced-motion guarantees from v2.0 stay. `scripts/check-box-frames.mjs` now checks the four regions by position, previews and the brand guidelines v2 PDF are regenerated, and lesson 40 records why counting colours alone is not enough.

- **Motion kit added in Design System v2.0** in `motion/`: twelve new animation families (route transition, page enter, scroll reveal and pinned hero, overlays, toast, sidebar indicator, collapse and chevrons, skeleton and progress, hover and press, feedback, delight, kiosk and display), each reusable like the box-open loader (CSS copied from the app, `react/` copies, `demo.html`, animated previews checked by `scripts/check-previews.mjs`, README), indexed in `motion/README.md`. `docs/motion.md` gains the animations the audit found missing (splash flight, chevrons, card tilt, logo flap pop and others). The site has a page per family under Motion, plus a "Design decisions" page from `docs/decisions.md`.
- **Theme reveal template** added in `motion/theme-reveal/`: the light-to-dark circle reveal as a reusable template (CSS, framework-free JS with `switchTheme(next, originEl)`, `demo.html`, the app's React files, animated preview checked by `scripts/check-previews.mjs`). `docs/theming.md` gains a "Switch animation" section; the design site's own theme toggle and the Theming demo now use it, and there is a new Motion page, Theme switch.

### v2.0 token sync (ships alongside SpaceWorks 0.12.0)

- **README banner** added: `brand/readme/banner-light.svg` and `banner-dark.svg` (1280×320, rounded corners, the lockup masters, the seven brand colours; text is outlined from Gilroy ExtraBold and Outfit by `brand/readme/make-banner.py`, so GitHub shows the brand fonts; no external references), shown through a `<picture>` that follows the reader's colour scheme.
- **`docs/motion.md` and `docs/theming.md` added.** `motion.md` catalogues every shipped animation (where, why, tokens, trigger, reduced motion, dark), gives the "which animation to use where" defaults and the rules, including the new logo rule: **the Space Works mark opens (one-shot box opening, 1600 ms) on hover and keyboard focus everywhere it appears; it never loops except as the loader; tenant logos never animate; no hover animation on touch; reduced motion shows the static mark.** `theming.md` documents the light/dark switch (token layer, `html.dark`, system preference, pre-paint script, meta theme-color, React and plain examples). `motion/box-open/` documents the hover/focus one-shot usage.

> **Current rule (v2.0.1, 2026-11-13):** SW-367 (2026-11-13) specifies the full hover/focus cycle: fold shut 600 ms then open 1600 ms (2200 ms total), finishing once without restart. The 1600 ms value above is the opening phase only; SW-389 governs the four-colour closed state. (1A-N04) — supersedes the line above; see [docs/current-rules.md#cr-motion-01](docs/current-rules.md#cr-motion-01).
- **Dark theme is one solid black family** (decision 316, superseding the green-tinted dark of 275/300). Neutral
  surfaces only, no green or teal tint; teal, Citron and orange stay accents.
- **Old green-black dark → new solid-black dark** (`:root.dark`, as RGB triplets):
  `bg` 20 44 42 → 0 0 0 · `surface` 25 57 53 → 11 11 11 · `panel` 31 67 63 → 20 20 20 · `hover` 37 77 72 → 28 28 28 ·
  `line` 77 109 103 → 44 44 44 · `outline` 147 161 152 → 120 120 120 · `muted` 199 196 186 → 172 172 172 ·
  `sidebar` 17 53 50 → 11 11 11 · `sidebar-hover` 37 77 72 → 28 28 28 · `accent-soft` / `brand-soft` 26 74 69 → 18 29 28 ·
  `accent-ink` / `brand-ink` / `brand-boundary` 171 200 188 → 128 177 166 · `emphasis-soft` 47 70 64 → 34 26 23 ·
  `success-soft` 44 80 69 → 32 34 27 · `success-ink` 223 255 143 → 233 252 170 · `warn-soft` 47 77 64 → 34 32 23 ·
  `warn-ink` 255 212 71 → 255 222 119 · `info-soft` 42 77 76 → 30 31 34 · `info-ink` 181 205 255 → 203 217 248 ·
  `shadow-color` 20 44 42 → 0 0 0. `ink`, `focus`, the accent fills and the status fills are unchanged.
- **New token `scrim`** (dialog backdrop): light 20 44 42 (Deep Ink), dark 0 0 0.
- **Dark palette re-checked against the app on 2026-11-13:** all 55 `:root.dark` colour tokens match SpaceWorks
  0.12.0 exactly. Added the **chart series tokens** (`--chart-accent/-info/-success/-warn/-danger`, light and dark; dark
  uses the ink/fill variants for contrast) under `chart` in `tokens.json`, and the box loader's colours under `loader`.

> **Current rule (v2.0.1, 2026-11-13):** SW-380 (2026-11-13) uses --chart-1 through --chart-5, the same bright teal/orange/citron/sky/yellow in both themes, with --chart-edge boundaries/casings. The named ink/fill series recipe above is historical; danger is not an ordinary series colour. (1A-N03) — supersedes the line above; see [docs/current-rules.md#cr-chart-01](docs/current-rules.md#cr-chart-01).
- **Box-open loader** added in `motion/box-open/`: the logo box opens, holds, folds shut and repeats (4400 ms
  cycle, 1600 ms one-shot opening, still open logo under reduced motion), with a `mono` variant for buttons.
- **Motion tokens** added (`--sw-dur-*`, `--sw-ease-*`, `--sw-enter-y`, `--sw-pop-*`, `--sw-slide-x`), also under `motion`
  in `tokens.json`. See `docs/ui-brand-spec.md` section E.
- **Aurora card look** (decision 317a) recoloured to the brand: Maker Teal header, Citron ribbon, Warm Cream body, Deep Ink
  text, Workshop Orange tail; layout unchanged. Recorded under `cards.aurora` in `tokens.json`.
- **Fonts** (decision 299): only the free Gilroy weights (Light 300, ExtraBold 800) ship, with Outfit and Unbounded (OFL)
  for everything else; the paid Gilroy weights are removed.

## Credits

**Space Works UX** (the patterns, layouts and interaction details in `docs/ux-spec.md`) is our own
interaction system. It was inspired by [Yuyu](https://github.com/twilighty-abhi/yuyu), whose screens we
studied as reference boards (kept in `references/yuyu/`). The visual identity — colour, type, logo, icons and voice — comes only from the Space Works
brand guidelines in `brand/`.

## Export provenance

The kit was exported from the connected Figma file on 15 October 2026 using MCP Go+.
`brand/figma-styles.json` records source node IDs, all seven paint styles and ten text styles.
`brand/guidelines/` contains all 17 pages as individual SVG and PNG files. The logo library is
also exported as `brand/logo-masters.svg` and `.png`. SVG text is outlined; the editable source remains in Figma.

See [brand/README.md](brand/README.md) for asset selection and [fonts/README.md](fonts/README.md) for font provenance.

## License

Space Works design assets in this repository are licensed under the
**[GNU Affero General Public License v3](LICENSE)** (`AGPL-3.0-or-later`), the same as
[Space Works](https://github.com/SpaceWorks-Labs/SpaceWorks).

Third-party material keeps its own licence and is not relicensed: the fonts in `fonts/` (see
`fonts/LICENSES/` and [fonts/README.md](fonts/README.md)) and the Yuyu reference boards in
`references/yuyu/` (see [Yuyu](https://github.com/twilighty-abhi/yuyu)).
