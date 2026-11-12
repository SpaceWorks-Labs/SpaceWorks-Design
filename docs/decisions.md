# Design decisions, with the reason for each

This file keeps every decision that shapes how Space Works looks, moves and is built, **together with the
reason behind it**, so the reason is not lost when the people involved move on.

How to read it:

- **SW-nnn** is the number of the decision in the SpaceWorks decisions ledger (the main product's record of
  everything the owner decided). The numbers match, so you can look the decision up there for the full text.
  A later decision wins over an earlier one; replaced decisions are listed again under
  [Superseded decisions](#superseded-decisions) and are never deleted.
- **DS-n** is a decision that belongs only to this design repository and has no ledger number.
- "The owner" is the project owner. Quotes are the owner's own words from the ledger.
- Where the ledger or the commit history gives no reason, the entry says **Reason not recorded** rather than
  guessing.
- Dates are 2026. App paths (for example `frontend/src/index.css`) point into the main SpaceWorks repository;
  every other path is in this repository.
- Written 13 November 2026, covering decisions up to SW-385.

## Index

| Number | Title | Status |
|---|---|---|
| SW-385 | Design site v2.0: grouped sections, long pages split, wide layout | current |
| SW-383 | Pipelines, versions and releases page (`docs/delivery.md`) | current |
| SW-382 | This release is "Space Works Design System v2.0" | current |
| SW-381 | Logo box animation: one orange face when shut, no holes in dark, frame-checked | current |
| SW-380 | One bright chart palette in light and dark; contrast from edges | current |
| SW-379 | Push to main now; every change ships with tests; this decisions file | current |
| SW-378 | Search field animation | current (template in progress) |
| SW-377 | Every animation becomes a reusable template | current (in progress) |
| SW-376 | Theme-switch animation as a template | current |
| SW-375 | Org-wide rules: hybrid per part, mobile analytics SDKs | current |
| SW-374 | Rename to SpaceWorks-Design-System; dev, then PR, then main; owner-only commits | current |
| SW-373 | Brand guidelines v2 | current |
| SW-372 | README banner with rounded corners and the logo | current |
| DS-1 | Banner text is outlined, not live fonts | current |
| SW-371 | Preview freshness check | current |
| SW-370 | Design images follow the new palette | current (screenshots in progress) |
| SW-369 | Product rules apply to every SpaceWorks-Labs product | current |
| SW-368 | Product and engineering rules page | current |
| SW-367 | Logo hover: fold shut, then open | current |
| SW-366 | "What changed in 0.12.0" page | current |
| SW-365 | Lessons-learned page | current |
| SW-364 | Motion guide and theming guide | current |
| SW-363 | Design site shows the real palette, generated from tokens | current |
| SW-362 | The logo opens on hover and focus, everywhere | current (refined by SW-367) |
| SW-323 | Motion pass across the app | current |
| SW-322 | One loader everywhere: the opening box | current |
| SW-317 | Aurora ID card uses brand colours; loader built from the storyboard | current |
| SW-316 | Dark theme is one solid black family | current |
| SW-313 | Cold-start splash: the box opens and flies to the navbar | current |
| SW-306 | Patch on landing pages (rules) | current |
| SW-300 | Landing scroll story, symbol background, restrained motion | current (dark values superseded by SW-316) |
| SW-299 | Only the free Gilroy weights ship | current |
| SW-277 | The landing page is original, in the app's own design language | current |
| SW-275 | Spaces home and directory with brand character; richer dark palette | partly superseded by SW-316 |
| SW-273 | Settings grouped by task (senior UX pass outcome) | current |
| SW-255 | A senior UX and product review before release | current |
| SW-247 | Tagline "Run the space, not spreadsheets."; "Lending" becomes "Inventory" | current |
| SW-245 | Professional README banner in the main repo | current |
| SW-235 | Ease-of-use pass; design repo synced to the black palette | current |
| SW-225 | Dark mode becomes true black | partly superseded by SW-316 |
| SW-222 | Free Gilroy weights: licence risk accepted | current (restated by SW-299) |
| SW-220 | Designer font is a real Outfit family | current |
| SW-219 | Release 0.12.0 owner choices: fonts | current (dark clause superseded by SW-225) |
| SW-210 | Public makerspace header shows the space's own logo | current |
| SW-204 | Light mode is the default | current |
| SW-168 | README in the Events style, with Patch peeking from a corner | current |
| SW-152 | README banner: Patch only if it still looks professional | superseded by SW-168 |
| SW-151 | README banner: no mascot | superseded by SW-152 |
| SW-128 | Card font library (cards only) | current |
| SW-106 | README poster banner and screenshots | partly superseded |
| SW-57 | Patch on the 404 page only; delight effects | partly superseded by SW-306 and SW-362 |
| SW-56 | Patch for dark surfaces: Warm Cream sticker border | current |
| SW-55 | Patch keeps a Warm Cream card in dark mode | superseded by SW-56 |
| SW-54 | Patch is sourced only from this repo; left-facing walk approved | current |
| SW-51 | Delight effects on by default; dark transition always on | current |
| SW-32 | Original Space Works artwork only | current |
| SW-31 | Everything is built only in the Space Works theme | current (Gilroy 400 to 700 clause superseded by SW-299) |
| SW-22 | Event accent: brand-palette presets only | current |
| SW-12 | Adopt Yuyu's fun elements, redone in our brand | current |
| DS-2 | AGPL-3.0-or-later licence | current |
| DS-3 | Starlight design site on GitHub Pages | current |
| DS-4 | Mobile UX spec and mobile motion stay in the app repos | current |
| DS-5 | Space Works UX is our own spec, inspired by Yuyu | current |
| DS-6 | Patch, the painted wolf mascot | current |
| DS-7 | Brand kit v1 and Figma exports are the source of truth | current |
| DS-8 | Dark token retune, then "teal-lit" dark | superseded by SW-225 then SW-316 |
| DS-9 | Links and Pages move to the SpaceWorks-Labs organisation | current |

Count: 67 entries, 58 from the ledger (SW-) and 9 design-only (DS-). Ledger decisions 219, 220, 222 and the
other fonts and dark-mode steps are listed separately because each one changed the rules at a different date.

---

## Decisions, newest first

### SW-385 — Design site v2.0: grouped sections, long pages split, wide layout
- **Date:** 13 November
- **Decision:** The site is organised like an established design system: Start here, Brand, Foundations, Motion,
  Components and patterns, Content, Rules and Reference, each group collapsed until you open it. Long docs are
  published as an overview (the doc's introduction plus an "On this topic" list) and one page per part; the
  Markdown sources stay single files, the split is defined in `site/scripts/split-docs.mjs`, and links to an anchor
  that moved are rewritten. The content column is wide (76rem) so tables, swatches, demos and matrices use the
  room, while running text keeps a ~72-character line; between 72rem and 90rem the right-hand contents column folds
  into the "On this page" bar so the content is not squeezed; wide matrices pin their first column and scroll
  sideways only when they cannot fit. No content was removed: a content inventory of every heading, paragraph,
  table row, image and link before and after the change matched.
- **Why:** The owner said: "break long pages into splits, proper grouping, and some pages, even though the screen
  has room, look squished; fix that in the design system. A proper v2 update", and "make it a proper design
  system: don't remove any content, but well placed". The rules, decisions and UX spec pages were single walls of
  20,000 to 50,000 pixels, and the reading column was about 690 px wide on a 1280 px laptop.
- **Status:** current.
- **Implemented in:** `site/astro.config.mjs` (sidebar), `site/scripts/split-docs.mjs`, `site/scripts/sync-split.mjs`,
  `site/src/styles/custom.css` (layout), `site/src/content/docs/index.mdx` (home), `site/src/content/docs/foundations.mdx`.

### SW-383 — Pipelines, versions and releases page
- **Date:** 13 November
- **Decision:** `docs/delivery.md` records how every SpaceWorks-Labs repository checks, versions and releases its
  work: the general rules (dev, then PR, then main; required checks; nothing merges red; semver in `VERSION`;
  releases built by CI only when a new `VERSION` reaches main; secrets only in GitHub), the pipeline of each of
  the five stacks, a table of where each repository stands today, and the gaps to close. It is published on the
  site next to the product rules.
- **Why:** The owner said: "in the design system also mention the pipeline — GitHub Actions and workflows,
  version, release and all — per stack". The product rules said what to do in one line; nobody could see which
  repository actually did it, so gaps (no version-bump check on the Next.js apps, no signed Android or iOS
  releases, no CI on the website) stayed invisible.
- **Status:** current.
- **Implemented in:** `docs/delivery.md`, `docs/product-rules.md` (section 12 pointer), `site/scripts/sync-extra.mjs`,
  `site/astro.config.mjs` (sidebar entry).

### SW-382 — This release is "Space Works Design System v2.0"
- **Date:** 13 November
- **Decision:** The design system has its own version: this release is **Space Works Design System v2.0**
  (`VERSION` = `2.0.0`), which ships alongside SpaceWorks 0.12.0. The app's version is named only when describing
  the app. "What changed in 0.12.0" becomes "What's new in v2.0": `docs/whats-new-v2.0.md` (the old
  `docs/design-changes-0.12.0.md` stays as a pointer) and the site page `/whats-new-v2/` (the old `/whats-new/`
  redirects). The site header shows the version.
- **Why:** The design system ships on its own schedule and is used by several products, so tying its name to one
  app's release number confused which version of the kit a product followed. Reason beyond that not recorded.
- **Status:** current.
- **Implemented in:** `VERSION`, `docs/whats-new-v2.0.md`, `README.md` (changelog heading), `site/astro.config.mjs`
  (redirect), `site/src/components/SiteTitle.astro` (badge).

### SW-381 — Logo box animation: one orange face when shut, no holes in dark, frame-checked
- **Date:** 13 November
- **Decision:** The box animation (logo hover `hov`, loader `loop`, splash `once`, `mono`, the forced grounds)
  has defined states and a frame check. Rest is the static logo exactly; shut is one solid cube whose lid is the
  outer pair (top-right over bottom-left), so in light it shows exactly one orange face; a flap changes colour only
  edge-on, showing its outer face past it; the reversed (dark) artwork shows a cream cap behind the front flaps
  from the first moving frame; moving flaps are outlined in the ground colour; flaps are painted in depth order
  (top-right drawn in two layers); the fold is staggered so no flap passes through another. Timings are unchanged
  except the fold's stagger inside the same 600 ms (hover) and 968 ms (loader).
- **Why:** The owner reported two bugs: in dark, "blank black areas" (holes in the box) appeared while the flaps
  moved; in light, "when the box is closed there are two orange faces; closed should show one orange, open shows
  two". Root causes: the reversed master cuts its side faces short under the front flaps and the cap that fills
  them only appeared when the box was nearly shut; the bottom-left flap swapped to teal at 105 degrees instead of
  at edge-on (56), so its orange showed while the lid was still closed, and it was painted under the lid it rises
  in front of; the shut flaps did not reach each other, leaving a slot; and folding all four flaps together made
  neighbours pass through each other. The owner asked to make it "accurate" and checked frame by frame.
- **Status:** current.
- **Implemented in:** `motion/box-open/` (generated `box-open.css` and markup, `react/boxOpen/`, README "Known-good
  states"), `scripts/check-box-frames.mjs`, `docs/motion.md`, `docs/lessons-learned.md` (lesson 39). App:
  `frontend/src/components/boxOpen/` (generator and `boxOpen.frames.test.ts`), `components/brand/`, the
  `index.html` splash.

### SW-380 — One bright chart palette in light and dark; contrast from edges
- **Date:** 13 November
- **Decision:** Chart series use the five bright brand colours (teal, orange, citron, sky, yellow), the same hex
  in light and dark (`--chart-1` to `--chart-5`). The 3:1 contrast for graphics comes from `--chart-edge`: a 1px
  edge on every filled mark and a 4px casing under every 2px line (Deep Ink in light, Warm Cream in dark), with
  the dash patterns kept so colour is never the only cue. Danger red is not a series colour.
- **Why:** The owner said: "use the same bright colours in light and dark too, the bright colours SpaceWorks
  uses, like in charts". One brand palette should look the same everywhere; the old chart set dulled the
  colours (ink shades in light, a mix in dark) to pass contrast. Contrast is solved with edges, not by dulling
  colours.
- **Status:** current. Changes the chart rule of lesson 13 (history kept there).
- **Implemented in:** `tokens/tokens.css`, `tokens/tokens.json` (`chart`), `docs/theming.md`,
  `docs/lessons-learned.md`, `docs/ui-brand-spec.md`, `site/src/components/ThemeDemo.astro`; app
  `frontend/src/styles/chrome.css` and the report chart components.

### SW-379 — Push to main now; every change ships with tests; this decisions file
- **Date:** 13 November
- **Decision:** Push what is finished in this repo to `main` now (dev, then PR, then merge); work still in
  progress follows in later PRs. The product rules state that every change ships with its tests, by change
  type. This file records every design decision with its reason.
- **Why:** The owner wanted the finished work published without waiting for the unfinished lanes, and wanted
  the reasoning kept ("so that the reason is not lost"). Reasons are the first thing lost in a fast build.
- **Status:** current.
- **Implemented in:** `docs/decisions.md` (this file); the testing rule is in `docs/product-rules.md`.

### SW-378 — Search field animation
- **Date:** 13 November
- **Decision:** One shared search field with a focus ring and icon nudge, a shortcut chip that fades on
  focus, the magnifier becoming the small box spinner while loading, a clear button that fades in (Escape
  also clears), and results that fade in with a 4 px rise and at most six staggered items. Reduced motion
  means colour change only.
- **Why:** About 46 search inputs in the app each behaved a little differently. One component removes the
  differences and gives the design system one reference template. Reason beyond that not recorded.
- **Status:** current. In progress: `motion/search/` is not in this repo yet.
- **Implemented in:** app: shared `SearchField` (all search inputs migrated, with a guard test). Design repo
  (planned): `motion/search/`, a preview, a site page and a row in `docs/motion.md`.

### SW-377 — Every animation becomes a reusable template
- **Date:** 13 November
- **Decision:** `docs/motion.md` is checked against the app, and every animation family (route change, page
  enter, scroll reveal, overlays, toast, sidebar, skeleton, hover and press, feedback, kiosk and TV display)
  gets its own `motion/<family>/` folder with token-based CSS and JS, React copies, a light and dark demo, a
  README, animated previews covered by the freshness check, and a site page.
- **Why:** Other apps (Android, iOS, sibling web apps) must be able to copy an animation and get exactly the
  same feel; a description alone drifts. Reason in the ledger is brief; this is the intent of the template
  folders.
- **Status:** current. In progress: only `motion/box-open/` and `motion/theme-reveal/` exist so far.
- **Implemented in:** `motion/`, `docs/motion.md`, `scripts/check-previews.mjs`.

### SW-376 — Theme-switch animation as a template
- **Date:** 13 November
- **Decision:** The light/dark switch animation (a circle growing from the toggle, 720 ms, plain cross-fade
  where unsupported, instant under reduced motion) ships as a copy-paste template, and the design site's own
  toggle uses it.
- **Why:** It is the app's signature theme moment; shipping it as a template lets every product switch theme
  the same way, and using it on the site keeps the template honest. The held final frame exists so the old
  theme never flashes (lesson 29 in `docs/lessons-learned.md`).
- **Status:** current.
- **Implemented in:** `motion/theme-reveal/` (CSS, plain JS, React, demo, preview), `docs/theming.md`,
  `docs/motion.md`. App: the theme toggle component.

### SW-375 — Org-wide rules: hybrid per part, mobile analytics SDKs
- **Date:** 13 November
- **Decision:** For every product, "hybrid" hosting means a choice per part (database, Redis, storage, email,
  website each local or outside), and the installer asks about and checks each. Android and iOS must support
  the same optional analytics providers as the web where an official mobile SDK exists: off by default, set
  per deployment, no personal data, with a client tag. Every gap found becomes a required rule plus a
  per-product "bring up to the rules" checklist; products are updated after 0.12.0.
- **Why:** The products had drifted: the web offered analytics providers the phone apps did not, and "hybrid"
  meant different things in different places. Reason beyond that not recorded.
- **Status:** current.
- **Implemented in:** `docs/product-rules.md` (rules and per-product status matrix).

### SW-374 — Rename to SpaceWorks-Design-System; dev, then PR, then main; owner-only commits
- **Date:** 13 November
- **Decision:** The repository is `SpaceWorks-Labs/SpaceWorks-Design-System` (site at
  `spaceworks-labs.github.io/SpaceWorks-Design-System/`). Work is committed on `dev` by the owner with **no AI
  co-author trailers**, pushed, a pull request is opened to `main`, and for this repository the owner has
  authorised merging it. The site base path and every link move to the new name.
- **Why:** The new name says what the repo is (a system, not just a "design" folder) and matches the org's
  other repos. The pull-request step means the site build and checks run before anything reaches `main`.
  The no-trailer rule (also stated in SW-235 and SW-299) is the owner's choice for this repo; reason not
  recorded. Older commits that already carry trailers are left as they are, history is not rewritten.
- **Status:** current.
- **Implemented in:** `.github/workflows/deploy-site.yml` (builds on pull requests, publishes on push to
  `main`), `site/astro.config.mjs`, `README.md`.

### SW-373 — Brand guidelines v2
- **Date:** 13 November
- **Decision:** A second guidelines PDF, same visual family as v1, updated for release 0.12.0: the solid black
  dark palette and the shift, logo in motion, colour with real contrast ratios, free fonts only, theming,
  motion, Patch on dark, UX and product-rule summaries, accessibility. v1 is kept, not replaced.
- **Why:** v1 predates the black dark theme, the loader and the font change, so it would mislead anyone using
  it alone. Keeping v1 preserves the original approved record. The v2 source is HTML so it can be rebuilt.
- **Status:** current. Files exist in the working tree but were not yet committed when this was written.
- **Implemented in:** `brand/space-works-brand-guidelines-v2.pdf`, `brand/guidelines-v2/`;
  `brand/space-works-brand-guidelines-v1.pdf` stays.

### SW-372 — README banner with rounded corners and the logo
- **Date:** 13 November
- **Decision:** The design repo README gets a rounded-corner banner with the logo (light version on Warm
  Cream, dark version on solid black, switched with a `<picture>` element), a tidied intro and a complete
  Contents table.
- **Why:** The README is the first thing people see on GitHub; the owner asked for a professional first
  impression. Light and dark versions follow the reader's colour scheme.
- **Status:** current.
- **Implemented in:** `brand/readme/banner-light.svg`, `banner-dark.svg`, `make-banner.py`, `README.md`.

### DS-1 — Banner text is outlined, not live fonts
- **Date:** 12 to 13 November
- **Decision:** The banner generator converts the Gilroy and Outfit text into outlined paths instead of
  relying on installed fonts.
- **Why:** GitHub displays SVGs without custom fonts, so live text would fall back to a system font and lose
  the brand type. Outlines show the brand fonts with no font dependency (stated in `make-banner.py`). The
  README changelog's mention of a "system-font fallback stack" describes an earlier approach.
- **Status:** current.
- **Implemented in:** `brand/readme/make-banner.py` (needs `fonttools`), the two banner SVGs.

### SW-371 — Preview freshness check
- **Date:** 13 November
- **Decision:** A lock file holds hashes of `tokens/tokens.json` and `motion/box-open/box-open.css` (and the
  other sources). A check fails if a preview image no longer matches its source. It runs in the deploy
  workflow, next to the site's token-drift check and link validator.
- **Why:** Preview images (palette cards, animated loaders) are generated files; without a check they quietly
  go stale after a token change and the site shows colours the product no longer uses.
- **Status:** current.
- **Implemented in:** `scripts/make-previews.mjs`, `scripts/check-previews.mjs`, `scripts/lib-previews.mjs`,
  `scripts/previews.lock.json`, `.github/workflows/deploy-site.yml`.

### SW-370 — Design images follow the new palette
- **Date:** 13 November
- **Decision:** Palette previews (light, dark, side by side) are generated from `tokens.json`; the box loader
  and the fold-then-open logo hover get animated previews rendered from the real CSS; the 24-plus Space
  Works UX screenshots are recaptured from 0.12.0 under the same file names. Brand guidelines v1 page images
  stay as the original.
- **Why:** Images that are drawn by hand or captured once drift from the real palette. Generating them from
  the tokens and the real CSS means they cannot disagree with the product.
- **Status:** current. Palette and animation previews exist; the screenshot recapture was still in progress.
- **Implemented in:** `tokens/previews/`, `motion/**/preview*`, `screenshots/ux/` (list in
  `screenshots/ux/RECAPTURE.md`).

### SW-369 — Product rules apply to every SpaceWorks-Labs product
- **Date:** 13 November
- **Decision:** `docs/product-rules.md` is widened from one product to all of them (SpaceWorks, Workspace,
  Events, Machines, Inventory, Bookings, Organization, Android, iOS, website, docs): stack, one-line install
  and VPS default, self-host, managed and hybrid, areas and modules, role-based views, file size, money,
  audit trails, analytics, API and mobile parity, tenancy, languages, accessibility, themes, motion, testing
  and release, with a per-product status table checked against the org repos.
- **Why:** The rules were being re-learned product by product. One shared set, with an honest status per
  product, shows where each one still falls short.
- **Status:** current.
- **Implemented in:** `docs/product-rules.md`; site page "Rules".

### SW-368 — Product and engineering rules page
- **Date:** 13 November
- **Decision:** `docs/product-rules.md` records the rules every Space Works product follows (file size about
  200 lines with a 300 ceiling, areas switched off are hidden everywhere, role-based views, tenancy and
  privacy, audit and evidence, API rules, money, languages, accessibility, themes, motion, tokens, testing and
  release). Each rule says why it exists, how to apply it and how SpaceWorks enforces it.
- **Why:** So a new app or contributor can follow the same rules without reading the whole codebase, and so
  each rule carries its reason.
- **Status:** current (widened by SW-369).
- **Implemented in:** `docs/product-rules.md`.

### SW-367 — Logo hover: fold shut, then open
- **Date:** 13 November
- **Decision:** On hover, starting from the resting open logo, the box folds shut and then opens (no hold at
  the end). Leaving mid-way lets the cycle finish, so nothing snaps. The mark's box-open is the one
  hover-motion exception named in the UI spec.
- **Why:** Reason not recorded in the ledger beyond "softened"; the point of the rule is no jump or snap in
  either direction.
- **Status:** current.
- **Implemented in:** `motion/box-open/`, `docs/motion.md`, `docs/ui-brand-spec.md` section E.

### SW-366 — "What changed in 0.12.0" page
- **Date:** 13 November
- **Decision:** A page for designers and the other app teams: the dark-mode shift with before and after per
  token, logo animation, every animation and where it is used, and the UX improvements to copy.
- **Why:** The Android, iOS and sibling web teams need to know exactly what to change to match 0.12.0.
- **Status:** current.
- **Implemented in:** `docs/whats-new-v2.0.md` (first published as `docs/design-changes-0.12.0.md`); site page "What's new in v2.0".

### SW-365 — Lessons-learned page
- **Date:** 13 November
- **Decision:** Every design lesson from the build, written as a rule with the problem, rule, values, how it
  is enforced and its source, plus a light and dark pairing table with contrast ratios. Colour matching in
  light and dark is the main subject.
- **Why:** Dark mode was redone three times in a month and several contrast mistakes were repeated; writing
  the lesson next to the rule stops the next app repeating them.
- **Status:** current.
- **Implemented in:** `docs/lessons-learned.md`; site page.

### SW-364 — Motion guide and theming guide
- **Date:** 13 November
- **Decision:** `docs/motion.md` says which animation to use where (sensible defaults, and what not to
  animate); `docs/theming.md` says how to build the light, dark and system switch with these palettes
  (tokens, `html.dark`, a script that runs before first paint so there is no flash, `theme-color`, logo, chart
  and loader variants, HTML, JS and React examples). The site gets a Theming page with a live switch and
  light and dark side by side on the colour page.
- **Why:** Having tokens without guidance on using them leads to inconsistent motion and flash-of-wrong-theme
  bugs in other apps.
- **Status:** current.
- **Implemented in:** `docs/motion.md`, `docs/theming.md`, site Theming and Motion pages.

### SW-363 — Design site shows the real palette, generated from tokens
- **Date:** 13 November
- **Decision:** The site shows the solid black dark family and the current light set on every page, generated
  from the tokens so it cannot drift, and shows the motion (header logo opens on hover and focus, a Motion
  section with the catalogue, live loader demos and motion tokens).
- **Why:** The site had been showing the old green-tinted dark palette after the app moved on. Colours typed
  by hand into a site are the usual source of this; generating them from the tokens, plus a build check that
  `tokens.css` and `tokens.json` agree value for value, makes drift fail the build.
- **Status:** current.
- **Implemented in:** `site/scripts/sync-kit.mjs`, `site/scripts/check-tokens.mjs`, `site/src/`, `tokens/`.

### SW-362 — The logo opens on hover and focus, everywhere
- **Date:** 13 November
- **Decision:** The Space Works mark plays a one-shot box opening (1600 ms) on pointer hover and keyboard
  focus wherever it appears, through one shared component. It never loops except as the loader. Tenant logos
  never animate. No hover animation on touch devices. Reduced motion shows the still mark.
- **Why:** A small brand moment that is the same everywhere. Touch is excluded because hover effects stick
  after a tap; tenant logos are excluded because they belong to the makerspace, not to us; reduced motion is a
  designed state, not an afterthought.
- **Status:** current (softened by SW-367).
- **Implemented in:** `motion/box-open/`, `docs/motion.md`. App: `AnimatedLogoMark`.

### SW-323 — Motion pass across the app
- **Date:** 11 November
- **Decision:** Route changes use the View Transitions API (content cross-fades with a short upward settle
  while the sidebar and top bar stay still); the sidebar's active marker slides; drawers, dialogs, menus,
  toasts, tabs and accordions share enter and exit motion; one set of timing tokens (120, 180, 240 ms and
  the brand curves); hover and press feedback is colour only. No new dependency, no shadows, gradients or
  glass, transform and opacity only, nothing on the critical path over 240 ms, all off under reduced motion,
  kiosk and TV get fades only.
- **Why:** The owner wanted the experience to feel "peak everywhere" when moving between screens. The
  restrictions keep it fast, accessible and on-brand.
- **Status:** current.
- **Implemented in:** `tokens/tokens.json` (`motion`), `docs/motion.md`, `docs/ui-brand-spec.md` section E.
  App: `frontend/src/index.css`, route transition code.

### SW-322 — One loader everywhere: the opening box
- **Date:** 11 November
- **Decision:** Every loading state uses the box-opening animation. Pages, panels, dialogs and fallbacks use
  the full loader; buttons, table rows and fields use a compact inline box that follows the text colour.
  Ring spinners and grey skeleton blocks used as loading states are removed. Reduced motion shows the still
  open logo; every loader keeps a polite `role="status"` label.
- **Why:** The owner's instruction was to "keep the box opening loading animation everywhere". It gives one
  brand-owned loading cue instead of two looks, and the old ring had its own dark-mode bugs.
- **Status:** current.
- **Implemented in:** `motion/box-open/` (CSS, SVG markup, React `LogoLoader`, `BoxSpinner`, `BoxArt`).
  App: `components/boxOpen/css.ts`.

### SW-317 — Aurora ID card uses brand colours; loader built from the storyboard
- **Date:** 11 November
- **Decision:** The shipped Aurora card template's default colours become the brand palette (Maker Teal
  header, Citron ribbon, Warm Cream body, Deep Ink text, Workshop Orange tail); layout unchanged. The loader
  is finished from the owner's 8-frame storyboard, to be retimed if a video arrives.
- **Why:** Cards should look like Space Works out of the box in every space. Other reasons not recorded.
- **Status:** current.
- **Implemented in:** `tokens/tokens.json` (`cards.aurora`, `loader`), `motion/box-open/`.

### SW-316 — Dark theme is one solid black family
- **Date:** 11 November
- **Decision:** Dark is one neutral family everywhere (landing, spaces, features, docs, sign-in, member area,
  staff console, `/control/`, display screens): page `#000000`, surface `#0B0B0B`, panel `#141414`, hover
  `#1C1C1C`, line `#2C2C2C`, Cream text, muted greys at AA contrast. Teal, Citron and orange are accents only
  (buttons, focus, status, highlights). Token names are unchanged. A correction added the shipped line colour
  as `#2C2C2C`, not the `#262626` first written.
- **Why:** The owner said mixing pure black with green-tinted surfaces "is not working out". Two families on
  one screen looked like a mistake; tinted surfaces cost contrast (teal on the lit panel was about 1.76:1);
  brand colour works better as an accent than as a floor; black is calmer on OLED phones.
- **Status:** current. Supersedes the green-tinted values of SW-275 and SW-300 and the surface part of SW-225.
- **Implemented in:** `tokens/tokens.css`, `tokens/tokens.json` (`dark`), `docs/ui-brand-spec.md`,
  `docs/whats-new-v2.0.md` (before and after per token). App: `frontend/src/index.css`.

### SW-313 — Cold-start splash: the box opens and flies to the navbar
- **Date:** 11 November
- **Decision:** On a cold page load the box unfolds and then flies into the header logo position, once per
  page load, about 1.2 to 1.6 s, shown by a small inline block before the app mounts. Reduced motion gives a
  still image and a fade.
- **Why:** The owner asked for a loading animation of "the SpaceWorks logo closed to open and moving to the
  navbar". The inline block means the first load is never blank.
- **Status:** current.
- **Implemented in:** `docs/motion.md`, `docs/whats-new-v2.0.md`. App: `index.html` inline splash.

### SW-306 — Patch on landing pages (rules)
- **Date:** 11 November
- **Decision:** Patch appears on the landing pages (home, features, spaces where it fits) under the brand
  rules: never inside or beside the box symbol (so not over the tiled-symbol background), counts as the
  section's one bold moment, decorative beside real copy, a still frame under reduced motion, light and dark
  versions from the design system, never recoloured or flipped by CSS.
- **Why:** The owner asked to "use the mascot Patch in landing pages and all". The rules keep the mascot from
  competing with the logo.
- **Status:** current. Replaces the "404 only" scope of SW-57.
- **Implemented in:** `mascot/` and `mascot/dark/`. App: `frontend/public/brand/patch/`.

### SW-300 — Landing scroll story, symbol background, restrained motion
- **Date:** 11 November
- **Decision:** The landing page gets a scroll-driven story (pinned hero scene, product preview rising into
  frame, a sticky stage beside scrolling steps, reveal on scroll), with a full static version for reduced
  motion, short screens and phones. A low-opacity tiled Space Works symbol sits behind the hero and
  overview, edges masked so the centre stays clean. The scroll story favours restraint: calm motion,
  whitespace, one accent at a time. The dark palette is reviewed as one system.
- **Why:** The owner found the landing page lacked the scrolling feel of the SpaceWorks website and asked
  for it to be "professional, clean". Behaviour was modelled on the website; nothing was copied (SW-277).
- **Status:** current, except the green-tinted dark values, replaced by SW-316.
- **Implemented in:** `docs/motion.md` (scroll reveal), `docs/ui-brand-spec.md`. App: landing page.

### SW-299 — Only the free Gilroy weights ship
- **Date:** 11 November (first decided 9 November in SW-219, licence accepted in SW-222)
- **Decision:** Only the free Gilroy weights are used: Light (300) and ExtraBold (800), for light display
  text and display headings. Every other weight, and any place the free files cannot be embedded, uses
  Outfit (SIL Open Font Licence). Unbounded stays as the one accent face. The paid weights (Regular, Medium,
  SemiBold, Bold) are removed and are never to be re-added. Fallback if the free licence ever becomes a
  problem: Outfit everywhere.
- **Why:** The project does not hold a licence for the paid Gilroy weights and the owner is "not planning to
  buy" one. SW-222 recorded that the owner accepts the redistribution risk of the free licence. A note in the
  ledger (SW-276) flags that the free licence restricts making the font files available to third parties,
  which a public repository may do, and that the paid files remain in older git history (history is not
  rewritten).
- **Status:** current.
- **Implemented in:** `fonts/` (Gilroy Light and ExtraBold, Outfit, Unbounded, `fonts/LICENSES/`),
  `tokens/tokens.css` (`@font-face`), `site/public/kit/fonts/`. Commit `7dca9a4`.

### SW-277 — The landing page is original, in the app's own design language
- **Date:** 11 November
- **Decision:** The hub home page is an original landing page built in the app's design language (brand
  guidelines, tokens, colour fields, existing illustrations). Nothing is ported or copied from the separate
  SpaceWorks website repository. Docs are promoted from it.
- **Why:** The owner corrected an earlier plan to port the website: "don't work on SpaceWorks-Website in this
  repo, make a proper landing page for this with the design language."
- **Status:** current (supersedes the first half of SW-277).
- **Implemented in:** App: landing page. Design repo: the tokens and rules it draws on.

### SW-275 — Spaces home and directory with brand character; richer dark palette
- **Date:** 11 November
- **Decision:** The public home is built around the makerspace listing: a compact hero with search, then a
  grid of space cards above the fold with loading, empty, no-results and error states. Cards lead with the
  space's own cover image and logo and show what the space offers, with brand colour only as a fallback. The
  page must be "cool": brand character, hover and focus lift that respects reduced motion, brand
  illustrations in empty states, a sticky search on phones, an equally polished dark version.
- **Why:** The owner wanted a proper main page like the makerspace listing, and later that "Find a space"
  list only makerspaces with image and logo (no "borrow a tool" wording).
- **Status:** partly superseded: the "teal-tinted dark surfaces" part is replaced by SW-316.
- **Implemented in:** App: spaces pages. Design repo: `docs/ux-spec.md` listing patterns.

### SW-273 — Settings grouped by task (senior UX pass outcome)
- **Date:** 11 November
- **Decision:** Space settings are in seven groups (Space, People, Areas, Money, Communication, Integrations,
  Administration) with search and one line of help per page, from one translated catalogue. "Modules" is
  shown as "Areas & add-ons" in user-facing text only. One name per place.
- **Why:** Outcome of the review in SW-255; settings were hard to find. A test enforces help coverage so new
  pages cannot skip it.
- **Status:** current.
- **Implemented in:** `docs/ux-spec.md`. App: `/admin/settings/<section>`.

### SW-255 — A senior UX and product review before release
- **Date:** 10 November
- **Decision:** After every feature lands and before the browser pass, a research-backed review of settings
  and admin information architecture and usability heuristics, with proper grouping of settings.
- **Why:** The owner asked that UX and UI be "proper" "like a senior UX designer / product engineer" once
  all features existed.
- **Status:** current (outcome recorded in SW-273).
- **Implemented in:** Design repo: `docs/ux-spec.md`, `docs/ux-screens-longtail.md`.

### SW-247 — Tagline "Run the space, not spreadsheets."; "Lending" becomes "Inventory"
- **Date:** 10 November
- **Decision:** The product tagline is "Run the space, not spreadsheets.", used as the README banner headline
  and tagline, in the official brand colours (tokens from this repo). User-facing "Lending" becomes
  "Inventory" everywhere.
- **Why:** The owner asked: "change lending everywhere to inventory, also follow the brand colour and tagline".
  The product manages inventory as a whole; lending is one part of it (SW-349 repeats this for the README).
- **Status:** current.
- **Implemented in:** `brand/readme/` banner, `docs/ui-brand-spec.md` voice notes. App: copy and navigation.

### SW-245 — Professional README banner in the main repo
- **Date:** 10 November
- **Decision:** The main repo README gets a professional banner with the logo and rounded corners.
- **Why:** Owner request ("a proper professional README banner with logo, rounded corners and all"). The same
  treatment was later applied to this repo (SW-372).
- **Status:** current.
- **Implemented in:** App: `docs/readme/`. Design repo: `brand/readme/`.

### SW-235 — Ease-of-use pass; design repo synced to the black palette
- **Date:** 10 November
- **Decision:** An ease-of-use pass before release (minimal installer questions, guided first-run setup,
  optional features hidden until switched on, plain-language labels, one-line help). Part (c): sync this
  repo's tokens to the true-black palette, commit as the owner with no trailers, and push to the default
  branch.
- **Why:** The owner asked to "make it easier for users and all". The sync keeps this repo from showing a
  palette the product no longer uses.
- **Status:** current.
- **Implemented in:** `tokens/`, commit `7dca9a4`.

### SW-225 — Dark mode becomes true black
- **Date:** 10 November
- **Decision:** Dark mode uses a `#000` page with near-black raised surfaces, keeping the Maker Teal accent,
  Citron focus and AA contrast. The owner clarified: "keep the dark theme to somewhat that", meaning keep
  its look, hue and hierarchy and only deepen it toward black (smallest token change, no redesign).
- **Why:** Reason not recorded beyond the owner's request; the design-changes page notes true black is
  cheaper and calmer on OLED phones.
- **Status:** partly superseded: the layers above the black page stayed teal-tinted until SW-316 made the
  whole family neutral. Dark `line` stayed as before at this step.
- **Implemented in:** `tokens/tokens.css`, `docs/whats-new-v2.0.md`.

### SW-222 — Free Gilroy weights: licence risk accepted
- **Date:** 9 November
- **Decision:** Use only the free Gilroy weights with Outfit and Unbounded. No commercial licence will be
  purchased. The owner accepts the redistribution risk of the free licence; the fallback is Outfit
  everywhere.
- **Why:** The owner's call after the licence question was raised; no budget for the paid weights.
- **Status:** current (restated by SW-299).
- **Implemented in:** `fonts/README.md`, `fonts/LICENSES/`.

### SW-220 — Designer font is a real Outfit family
- **Date:** 9 November
- **Decision:** The card and certificate designer offers a real `Outfit` font family. A data migration moves
  stored designs from `Gilroy` to `Outfit`.
- **Why:** So the font name in the picker matches what is actually drawn, since the paid Gilroy weights are
  gone.
- **Status:** current.
- **Implemented in:** App: designer font list and a data migration.

### SW-219 — Release 0.12.0 owner choices: fonts
- **Date:** 9 November
- **Decision:** Part (a): free Gilroy weights for display, Outfit for body and interface, Unbounded as the one
  accent face; commercial Gilroy weights removed; dark mode keeps the shipped token palette.
- **Why:** Same as SW-299. The dark-mode clause was then replaced by SW-225.
- **Status:** current for fonts; dark clause superseded by SW-225 and then SW-316.
- **Implemented in:** `fonts/`, `tokens/`.

### SW-210 — Public makerspace header shows the space's own logo
- **Date:** 7 November
- **Decision:** When a makerspace has uploaded a logo, the shared public header shows it instead of the
  Space Works symbol plus the makerspace name, keeping an accessible home name and correct links. Without an
  uploaded image it shows the Space Works symbol and the name.
- **Why:** Reason not recorded. It matches the rule that tenant logos belong to the makerspace and never
  animate (SW-362).
- **Status:** current.
- **Implemented in:** `docs/ui-brand-spec.md` (logo use). App: shared public tenant header.

### SW-204 — Light mode is the default
- **Date:** 7 November
- **Decision:** Space Works starts in light mode. A saved light or dark choice is respected, including across
  tabs and when storage is blocked. A visitor whose system is dark but who has no saved choice still starts
  light.
- **Why:** Reason not recorded. Tests labelled dark must actually select dark.
- **Status:** current.
- **Implemented in:** `docs/theming.md`, `docs/lessons-learned.md` (lesson 29). App: theme provider and the
  pre-paint script.

### SW-168 — README in the Events style, with Patch peeking from a corner
- **Date:** 2 November
- **Decision:** The main README is rebuilt in the style of the sibling Events README: a banner in the brand
  palette with Patch peeking from a corner (the official art, light and dark), a tagline, palette swatches,
  no contributors wall. The banner generator is kept out of the repo.
- **Why:** The owner wanted the README done now, in a familiar proven style, rather than last.
- **Status:** current. Supersedes SW-151 and SW-152 on the mascot question.
- **Implemented in:** `mascot/`, `mascot/dark/` (the art). App: `docs/readme/`.

### SW-152 — README banner: Patch only if it still looks professional
- **Date:** 31 October
- **Decision:** Render two banners, with and without a small Patch; ship the Patch one only if it still
  reads as polished.
- **Why:** The owner left room for the mascot as long as quality held.
- **Status:** superseded by SW-168.
- **Implemented in:** n/a.

### SW-151 — README banner: no mascot
- **Date:** 31 October
- **Decision:** No mascot on the README banner unless the owner later asks.
- **Why:** The owner wanted a clean, professional banner. Superseded the mascot parts of SW-106.
- **Status:** superseded by SW-152.
- **Implemented in:** n/a.

### SW-128 — Card font library (cards only)
- **Date:** 28 October
- **Decision:** The ID card and certificate designer has a font library, including Indic scripts, as the one
  exception to the brand-fonts rule, for cards only (item C-21; the full Google Fonts catalogue, self-hosted).
- **Why:** Cards are printed for people whose names and languages need scripts the brand fonts do not cover.
- **Status:** current. SW-299 still applies to everything that is not a card.
- **Implemented in:** App: card designer.

### SW-106 — README poster banner and screenshots
- **Date:** 25 October
- **Decision:** The README gets a wide poster banner (wordmark, tagline, strip of real product shots, light and
  dark) and a screenshot gallery, done last.
- **Why:** Reason not recorded beyond the owner's request for a "proper poster/banner".
- **Status:** partly superseded: the mascot and "last" parts by SW-151, SW-152 and SW-168.
- **Implemented in:** App: `docs/readme/`.

### SW-57 — Patch on the 404 page only; delight effects
- **Date:** 20 October
- **Decision:** Patch appears only on the 404 page (light and dark sticker). Elsewhere the design system's SVG
  illustrations (loader, moods, companion) are used. The delight effects added then: logo unfold on hover or
  click, seven clicks for Maker mode, brand-shaped confetti on an on-time return, a `sudo make` easter egg,
  first-load stagger, all behind the delight switches, honouring reduced motion, and excluded from kiosk,
  scanner, checkout and payment screens.
- **Why:** The mascot is the "one bold moment", so it was held back until the brand rules were proven. The
  exclusions protect screens where speed and clarity matter.
- **Status:** partly superseded: the "404 only" scope by SW-306; the logo effect by SW-362 and SW-367.
- **Implemented in:** `mascot/README.md` usage rules.

### SW-56 — Patch for dark surfaces: Warm Cream sticker border
- **Date:** 20 October
- **Decision:** The official dark-background Patch has a thin Warm Cream (`#FFF4E8`) die-cut sticker border,
  about 4 px at the 256 px walk-frame size and scaled with size, with the art otherwise untouched. In the
  app's dark mode it replaces the cream card.
- **Why:** The painted coat has dark areas that vanish on black; a light edge keeps Patch readable. It is the
  approved exception to the "no outlines" rule, for dark surfaces only.
- **Status:** current.
- **Implemented in:** `mascot/dark/`, `site/scripts/dark-mascot.mjs`, `mascot/README.md`. Commits `89e618b`,
  `b93db0a`.

### SW-55 — Patch keeps a Warm Cream card in dark mode
- **Date:** 20 October
- **Decision:** In dark mode, keep the Warm Cream card that travels with Patch (contrast rule).
- **Why:** Contrast for the light-coloured art on a dark page.
- **Status:** superseded by SW-56 (a sticker border replaces the card).
- **Implemented in:** n/a.

### SW-54 — Patch is sourced only from this repo; left-facing walk approved
- **Date:** 20 October
- **Decision:** The app takes Patch only from this repository's main branch. The left-facing walk cycle,
  which the owner fixed here, is the approved one.
- **Why:** One source of truth for the mascot art. Reason for the left-facing walk beyond "approved" not
  recorded.
- **Status:** current.
- **Implemented in:** `mascot/walk-left/`. Commits `e7b74a3`, `62a9b9e`.

### SW-51 — Delight effects on by default; dark transition always on
- **Date:** 20 October
- **Decision:** Delight effects and easter eggs are on by default for new and existing spaces and each space
  may switch them off. Reduced motion is still honoured. The dark-mode transition is always on.
- **Why:** Reason not recorded.
- **Status:** current.
- **Implemented in:** `docs/motion.md`. App: delight switches.

### SW-32 — Original Space Works artwork only
- **Date:** 18 October
- **Decision:** Every illustration and glyph is original Space Works artwork (SVG, light and dark variants)
  built from the brand symbol and tokens: mood glyphs, loader, 404 tag, empty-state illustrations, default
  certificate and card templates. No third-party or Yuyu assets. Decorative art is hidden from screen
  readers; meaningful art has alt text.
- **Why:** Brand consistency and licensing safety (no borrowed artwork).
- **Status:** current.
- **Implemented in:** `mascot/`, `logo/`, `icons/`. App: `frontend/src/assets/illustrations/`.

### SW-31 — Everything is built only in the Space Works theme
- **Date:** 18 October
- **Decision:** All new work uses only the Space Works theme: brand guidelines, CSS-variable tokens (light and
  dark), the brand fonts with one Unbounded accent per layout, lucide icons, the app shell, existing
  components, the accessibility floor and the colour vocabulary. No look, fonts, palettes, illustrations or
  copy from Yuyu or any other product.
- **Why:** So the product reads as one brand and nothing borrowed ships by accident. A frontend design review
  checks this explicitly.
- **Status:** current. The clause "Gilroy 400 to 700" was replaced by SW-299.
- **Implemented in:** `tokens/`, `docs/ui-brand-spec.md`.

### SW-22 — Event accent: brand-palette presets only
- **Date:** 18 October
- **Decision:** An event's accent colour is chosen from brand-palette presets, not a free colour picker.
- **Why:** Reason not recorded; it follows from keeping every colour contrast-checked in light and dark
  (compare the tenant-colour lesson in `docs/lessons-learned.md`).
- **Status:** current.
- **Implemented in:** `tokens/tokens.json` brand colours.

### SW-12 — Adopt Yuyu's fun elements, redone in our brand
- **Date:** 18 October
- **Decision:** Adopt Yuyu's new and fun elements, including easter eggs, rebuilt in the Space Works brand.
- **Why:** The owner wanted the delight without the look; see SW-31 and DS-5.
- **Status:** current.
- **Implemented in:** `docs/ux-spec.md`; `references/yuyu/`.

### DS-9 — Links and Pages move to the SpaceWorks-Labs organisation
- **Date:** 26 October
- **Decision:** Documentation links and the Pages site point at the SpaceWorks-Labs GitHub organisation.
- **Why:** The organisation was renamed (from an earlier HQ name); links to the old name would break or
  mislead.
- **Status:** current.
- **Implemented in:** `README.md`, `site/astro.config.mjs`. Commit `de06880`.

### DS-6 — Patch, the painted wolf mascot
- **Date:** 19 to 20 October
- **Decision:** The mascot is Patch, an African painted wolf with a wrench, inside a Maker Teal badge. It is
  cut from the approved concept sheets and traced to vector without redrawing; the exact original pixels are
  kept (lossless) alongside lighter compressed copies. Patch is the friendly face for empty states,
  onboarding and merch; the box symbol stays the logo.
- **Why:** Painted wolves match the product's values: no two coats alike (a community of different makers),
  they vote by sneezing (the community decides together), they look after the whole pack (a commons, nobody
  left behind), they succeed as a team, and they are endangered. The name "Patch" nods to the patchwork coat,
  to repair and maker culture, and to a software patch. Other animals were already taken by other brands.
- **Status:** current.
- **Implemented in:** `mascot/` (see `mascot/README.md`). Commits `114a64b`, `fc22f06`, `8cad666`.

### DS-5 — Space Works UX is our own spec, inspired by Yuyu
- **Date:** 15 and 19 October
- **Decision:** The UX pattern specs are named Space Works UX and written in our own words and screens, with
  Yuyu credited as the inspiration and its reference boards kept under `references/yuyu/`. Screenshots of
  Space Works UX in the Events app, light, dark and phone, feed the site's UX pages.
- **Why:** Reason not recorded beyond the commit message: "Make the UX spec our own". The intent is to learn
  from a good reference without copying it (see SW-31). Note that later decisions SW-129 to SW-131 and SW-130
  settle how code from the same reference may be reused in the app; they do not change this spec.
- **Status:** current.
- **Implemented in:** `docs/ux-spec.md`, `docs/ux-screens-longtail.md`, `screenshots/ux/`, `references/yuyu/`.
  Commits `d4907b0`, `3661b75`, `85064b5`, `c9bf941`.

### DS-4 — Mobile UX spec and mobile motion stay in the app repos
- **Date:** 16 October
- **Decision:** The mobile-only UX specification and mobile motion additions are removed from this repo and
  kept in the app repositories. Brand assets and tokens are unchanged.
- **Why:** At the owner's request; reason beyond that not recorded. Mobile apps are built separately (the
  Android and iOS repos) and own their own behaviour.
- **Status:** current.
- **Implemented in:** Commit `6bcbd0a` (removal); commit `3c61599` added them first.

### DS-3 — Starlight design site on GitHub Pages
- **Date:** 16 October
- **Decision:** The design system is browsable as a Starlight website published to GitHub Pages from `site/`
  on every push to `main`. The site copies the kit in at build time.
- **Why:** Reason not recorded beyond the commit. In practice it makes the logo masters, colours, type, voice,
  tokens and specs viewable without cloning, and later (SW-363) keeps the displayed palette in step with the
  tokens.
- **Status:** current.
- **Implemented in:** `site/`, `.github/workflows/deploy-site.yml`, `site/scripts/sync-kit.mjs`. Commit `fd28f82`.

### DS-2 — AGPL-3.0-or-later licence
- **Date:** 16 October
- **Decision:** The design system is licensed under AGPL-3.0-or-later.
- **Why:** Reason not recorded in the commit or the ledger. It matches the main product's licence.
- **Status:** current.
- **Implemented in:** `LICENSE`. Commit `a13c512`.

### DS-7 — Brand kit v1 and Figma exports are the source of truth
- **Date:** 15 October
- **Decision:** The approved brand kit (guidelines v1 PDF, ten logo masters exported from Figma, icons, fonts,
  tokens and UX specs) is published here, and projects use the repo as a git submodule so every surface draws
  from one source.
- **Why:** One place for the brand, so apps do not keep private copies that drift. Seven brand colours,
  "neutral first, accent second", and "never orange text on cream" come from the same kit.
- **Status:** current (v1 kept when v2 was added, see SW-373).
- **Implemented in:** `brand/`, `logo/`, `icons/`, `tokens/`, `README.md`. Commits `a15a280`, `0ff2c38`,
  `8225ce1`.

---

## Superseded decisions

These are kept so the history and the reasons for each change stay visible. Each links to what replaced it.

### The dark theme chain: grey-green, teal-lit, true black, solid black

| Step | Decision | What it was | Replaced by |
|---|---|---|---|
| 1 | Early tokens (before 15 October) | A grey-green dark palette | the DS-8 retune |
| 2 | DS-8 (15 October, `894cf8c`) | Dark tokens retuned for contrast | the teal-lit set |
| 3 | DS-8 (16 October, `5cf062e`) | "Teal-lit" dark: Deep Ink `#142C2A` page, lit teal panels `#193935` and `#1F433F`, Citron focus | SW-225 |
| 4 | SW-225 (10 November) | Page goes true black `#000`, but layers above it stay teal-tinted | SW-316 |
| 5 | SW-275 and SW-300 addendum (11 November, morning) | Black page with teal-tinted surfaces and borders, desaturated accents | SW-316 |
| 6 | **SW-316 (11 November)** | **One solid black neutral family (current)** | nothing |

- **DS-8 — Dark token retune, then "teal-lit" dark** (15 and 16 October). *Why:* the first dark values had
  low contrast in places, so they were retuned, then the dark mode was given a brand look with Deep Ink and
  Maker Teal surfaces. *What went wrong:* teal marks were about 1.76:1 on the lit panel, so teal text and
  charts were too dim and many status pills became dim soft fills. *Status:* superseded by SW-225, then
  SW-316.
- **Why each step changed:** the black page (SW-225) was meant as the smallest change to the teal-lit look,
  but putting black next to green-tinted layers made surfaces seam against the page. The morning pass of
  11 November kept the tint and had to lift the dark `line` just to make button borders readable (2.97:1).
  SW-316 then split the roles properly (`line` for quiet dividers, `outline` for control edges) and removed
  every green tint from surfaces.

### The font chain: paid Gilroy weights removed

- **SW-31 (18 October)** said "Gilroy 400 to 700 with one Unbounded accent per layout". **Superseded by
  SW-219(a), SW-222 and SW-299:** the paid weights (Regular, Medium, SemiBold, Bold) are removed; only
  Light 300 and ExtraBold 800 ship, with Outfit for everything else. *Why:* no licence for the paid weights
  and no plan to buy one (see SW-299).
- **SW-128 (28 October)** keeps its card-only font-library exception; it was not replaced.

### The mascot and banner chain

- **SW-55** (keep the Warm Cream card in dark mode) is replaced by **SW-56** (a thin sticker border).
- **SW-57's** "Patch on the 404 page only" is replaced in part by **SW-306** (landing pages under brand rules).
- **SW-151** (no mascot on the banner) was refined by **SW-152** (only if it looks professional), then
  settled by **SW-168** (Patch peeking from a corner).
- **SW-106's** "banner last" was replaced by **SW-168** (README now).

### Other replaced details

- **SW-225** (true black) and **SW-219(a)** ("dark keeps the shipped palette") are replaced on their palette
  values by **SW-316**.
- **SW-277** first said to port the SpaceWorks website's landing page into the app; its own correction in the
  same decision says not to copy anything and to build an original page.
- **SW-362** (logo opens on hover) was softened by **SW-367** (fold shut, then open; no hold).
- **DS-1** replaces the earlier README-banner text approach (system-font fallback stack) described in the
  README changelog.
- The guidelines v1 PDF (15 October) is **not** superseded; v2 (SW-373) sits beside it. The v1
  PDF predates SW-299 and SW-316, and `docs/ui-brand-spec.md` says so.

---

## How to record a decision

Add every new design decision here, in the same change that makes it, so the reason is written down while
people still remember it.

**Format.** Copy an existing entry and keep these fields, in this order:

```
### SW-nnn or DS-n — Short title
- **Date:** day and month (all dates are in the current year; add the year if not)
- **Decision:** one or two plain sentences. What is now true.
- **Why:** the reason. This is the point of the file. If you do not know the reason, write
  "Reason not recorded" instead of guessing.
- **Status:** current, or "superseded by SW-xxx / DS-n", or "partly superseded by ...".
- **Implemented in:** design repo paths, and app paths if the app changed too.
```

**Numbering.**
- A decision that is also in the SpaceWorks decisions ledger keeps **its ledger number** with the prefix
  `SW-`, so the two files can be cross-referenced.
- A decision that belongs only to this design repo and has no ledger number is numbered **DS-1, DS-2, ...**,
  continuing from the highest DS number in this file (the next is **DS-10**). DS numbers are never reused.
- Also add a row to the [Index](#index) and update the count.

**Rules.**
- **Always record the reason**, in plain English. Quote the owner where the words explain the choice.
- **Never delete or rewrite a decision.** When one is replaced, change its status to "superseded by ..." and
  list it under [Superseded decisions](#superseded-decisions) with what replaced it and why.
- Explain any internal word the first time ("ledger", "lane", "token") in one short phrase.
- No private data: no emails, secrets or personal names (the GitHub organisation name is fine).
- Prefer the ledger's own words for the reason. If the reason is only in a commit message or a chat, copy the
  essential sentence into the entry.
- A change that adds or changes a rule also updates the matching doc (`docs/ui-brand-spec.md`,
  `docs/motion.md`, `docs/theming.md`, `docs/product-rules.md`) in the same pull request.


### SW-389 — Four visible flaps keep their own colours when shut
- **Date:** 13 November
- **Decision:** In both themes the closed logo lid shows all four flap regions: top-left and bottom-right
  green (`#006E63`), top-right and bottom-left orange (`#FF7447`). Each flap keeps that colour on both sides
  throughout the animation. Explicit mono and forced-colours variants keep four separate regions in one colour.
- **Why:** The owner asked for "in closed also make sure 2 orange and 2 green". This supersedes SW-381's
  one-orange-lid interpretation and its cream-only reversed lid. Hiding two flaps or recolouring a reverse face
  obscures the mark's four-flap arrangement.
- **Status:** current; supersedes SW-381's closed-lid colour rule. Its no-hole, depth-order, static-rest and
  reduced-motion rules remain current. Ships with Design System v2.0.1 and SpaceWorks 0.12.0.
- **Implemented in:** `motion/box-open/` (generated CSS, markup, demo and React sources),
  `scripts/check-box-frames.mjs`; app `frontend/src/components/boxOpen/`, `components/brand/` and the
  generated splash block in `frontend/index.html`. The regular reversed product mark retains the reversed
  geometry and cream body, using the same approved flap palette as the light mark; explicit mono is unchanged.

Index addition: [SW-389 — Four visible flaps keep their own colours when shut](#sw-389--four-visible-flaps-keep-their-own-colours-when-shut).

### SW-405 — Every project has its own landing page and feature docs, built from this system
- **Date:** 13 November
- **Decision:** Every Space Works project except the Android and iOS apps has its own landing page — with its
  GitHub repository, release and install, docs, licence and changelog links — and its own feature docs inside
  the product (one page per area, sources in the repository's `docs/`), both built from this design system's
  rules, tokens, components, logo, motion and voice. The native apps link to the hub's landing page and docs.
  The separate SpaceWorks-Docs site is retired.
- **Why:** The owner asked that every project present itself the way SpaceWorks does and take everything from
  the design system, so the family reads as one and the rules cannot drift per project.
- **Status:** current. Rule text: [product rules §12.1](product-rules.md#121-landing-page-and-feature-docs-every-project-except-the-native-apps).
