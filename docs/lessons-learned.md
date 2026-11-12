# Design lessons learned

What the Space Works build got wrong, how it was fixed, and the rule that came out of each fix. It is written
for the people building the other Space Works apps (web, Android, iOS, sibling apps) so they can skip the
mistakes we already paid for.

Most of the pain was colour in light **and** dark. A palette that looks right in one theme quietly fails in the
other: teal that reads well on cream is nearly invisible on black, a pastel pill that is calm on cream glares on
black, a hairline that frames a card on cream disappears on black. So most of this page is about colour. The
rest covers type, motion, components and the process that keeps all of it from drifting.

**How to read a lesson.** Each one has a *Problem* (what went wrong), a *Rule*, the *Values* involved, how it is
*Enforced* (a test, guard or file) and a *Source* (commit hash in the app repo `SpaceWorks` or in this design
repo, or a decision number from the build's decisions ledger). Where a rule is derived from the tokens rather
than from a shipped fix, the lesson says so.

**Words used here.**
- *Token*: a named colour (for example `panel`) instead of a hex value typed into a screen.
- *Contrast ratio*: the WCAG number from 1 to 21 for how far apart two colours are. Text needs 4.5 or more;
  icons, borders and focus rings need 3 or more.
- *Ink*: a colour meant for text and small marks (for example `accent-ink`). A *fill* is a colour meant for a
  filled background, with its own label colour (`on-accent`).
- *Soft*: a quiet, opaque tinted background (for example `success-soft`).

All hex values come from `tokens/tokens.json`. Ratios were computed with the WCAG formula from those values.

---

## The light and dark pairing table

One row per role. Ratios are measured against the background named in the last column. "n/a" means the colour
is not meant to be read against that background. Mobile apps should use these exact values (convert to the
platform colour type) and not re-derive them.

| Role | Light | Dark | Light ratio | Dark ratio | Measured against |
|---|---|---|---|---|---|
| Page background (`bg`) | `#FFF4E8` | `#000000` | n/a | n/a | the page itself |
| Surface | `#F6ECE0` | `#0B0B0B` | 1.08 | 1.07 | `bg` (a layer step, not text) |
| Panel (cards) | `#FFFFFF` | `#141414` | 1.08 | 1.14 | `bg` |
| Hover | `#EFE6DB` | `#1C1C1C` | 1.14 | 1.23 | `bg` |
| Line (hairline, decorative) | `#D5D0C6` | `#2C2C2C` | 1.42 | 1.50 | `bg` (1.54 / 1.32 on `panel`) |
| Outline (control edge) | `#828A83` | `#787878` | 3.27 | 4.76 | `bg` (3.55 / 4.17 on `panel`) |
| Text (`ink`) | `#142C2A` | `#FFF4E8` | 13.60 | 19.36 | `bg` (14.75 / 16.98 on `panel`) |
| Muted text | `#5B6863` | `#ACACAC` | 5.37 | 9.25 | `bg` (5.83 / 8.12 on `panel`) |
| Accent fill (`accent`) | `#006E63` | `#006E63` | 5.68 | 3.41 | `bg` (6.16 / 2.99 on `panel`); never carry meaning alone in dark |
| Label on accent (`on-accent`) | `#FFF4E8` | `#FFF4E8` | 5.68 | 5.68 | the accent fill |
| Accent text and small marks (`accent-ink`) | `#006E63` | `#80B1A6` | 6.16 | 7.68 | `panel` (5.68 / 8.76 on `bg`) |
| Focus ring | `#006E63` | `#DFFF8F` (Citron) | 5.68 | 18.84 | `bg` (6.16 / 16.53 on `panel`) |
| Success fill / label | `#DFFF8F` / `#142C2A` | same | 13.23 | 13.23 | the fill |
| Success text on soft | ink `#536D49`, soft `#FBFFF2` | ink `#E9FCAA`, soft `#20221B` | 5.67 | 14.52 | its own soft |
| Warn fill / label | `#FFD447` / `#142C2A` | same | 10.37 | 10.37 | the fill |
| Warn text on soft | ink `#696834`, soft `#FFFAE9` | ink `#FFDE77`, soft `#222017` | 5.54 | 12.41 | its own soft |
| Info fill / label | `#B5CDFF` / `#142C2A` | same | 9.23 | 9.23 | the fill |
| Info text on soft | ink `#51697B`, soft `#F6F9FF` | ink `#CBD9F8`, soft `#1E1F22` | 5.45 | 11.63 | its own soft |
| Danger (text and fill) | `#B91C1C` | `#FCA5A5` | 6.47 | 9.71 | `panel` (5.96 / 11.06 on `bg`) |
| Label on danger fill | `#FFF4E8` | `#142C2A` | 5.96 | 7.77 | the danger fill |
| Danger card border (`danger-line`) | `#FCA5A5` | `#7C6261` | 1.90 | 3.31 | `panel` (decorative) |
| Emphasis fill (Workshop Orange) | `#FF7447` | `#FF7447` | 2.47 | 7.84 | `bg`; as a fill only, label `#142C2A` is 5.51 in both |
| Emphasis soft | `#FFEEE9` | `#221A17` | 13.11 | 15.76 | text on it (`ink`) |
| Sidebar | `#DFFF8F` (Citron) | `#0B0B0B` | 13.23 | 18.14 | `ink` on the sidebar |
| Sidebar active item | `#006E63` | `#006E63` | 5.68 | 5.68 | `on-accent` label on it |
| Scrim (dialog backdrop) | `#142C2A` | `#000000` | n/a | n/a | see lesson 17 |
| Chart edge (SW-380) | `#142C2A` | `#FFF4E8` | 14.75 | 16.98 | `panel` (12.64 / 18.14 on `surface`, 13.60 / 19.36 on `bg`); the mark boundary |
| Chart fills 1-5 (SW-380) | same bright brand colours | same | 1.11 to 6.16 | 2.99 to 16.53 | `panel`; fills alone may miss 3:1, the edge carries it |
| Chart: danger | `#B91C1C` | `#FCA5A5` | 6.47 | 9.71 | `panel`; not a series colour |
| Loader: box under-face | `#354845` | `#66625D` | 9.70 | 3.04 | `panel` (8.94 / 3.47 on `bg`) |
| Loader: spark | `#142C2A` | `#FFF4E8` | 14.75 | 16.98 | `panel` |
| Loader: seam | `#142C2A` | `#000000` | 14.75 | n/a | `panel`; in dark the seam is the page colour on purpose (lesson 24) |

Things this table shows at a glance:
- Dark outline (4.76) is easier to see than light outline (3.27); dark line is barely there (1.5). That is
  deliberate (lessons 3 and 4).
- Teal as a fill is 3.41 on black and 2.99 on the dark panel. That is below the 4.5 needed for text, which is why
  dark text and icons use `accent-ink` (lesson 5).
- Orange as text on cream is 2.47, so orange is a fill with a dark label, never text (lesson 12).
- Every status fill is the same hex in both themes; only the *text-on-tint* colours change (lessons 9 and 10).

---

## 1. Colour in light and dark

### Surfaces and borders

**1. Dark is one solid black family, with no green tint.**
- *Problem.* The first dark theme (Deep Ink plus Maker Teal surfaces, then a "teal-lit" version) put green-tinted
  layers next to pure black elsewhere (landing, docs). The owner said mixing pure black with green-tinted
  surfaces "is not working out": surfaces seamed against the page and the product looked like two themes.
- *Rule.* Dark is a neutral grey ladder on a true `#000` page. Teal, Citron and Orange are accents, buttons,
  focus and status only, never a surface. The same family applies to every screen: landing, docs, sign-in,
  member area, staff console, admin, TV displays.
- *Values.* `bg #000000`, `surface #0B0B0B`, `panel #141414`, `hover #1C1C1C`, `line #2C2C2C`, `outline #787878`.
  Old green-black set for reference: `bg #142C2A`, `surface #193935`, `panel #1F433F`.
- *Enforced.* `frontend/src/styles/darkTokens.test.ts` asserts every layer has equal R, G and B and that
  hover is lighter than panel, which is lighter than surface. Design repo changelog lists old to new values.
- *Source.* Decisions 225 (AMOLED black), 275, 300 (teal-lit, now superseded), 316 (solid black);
  design repo `5cf062e`, `894cf8c`, `8060ba0`.

**2. Layer by lightness steps, not by borders or shadows.**
- *Problem.* On black, big steps look like glowing slabs and tiny steps are invisible. The ladder is therefore
  small and even: 0, 11, 20, 28.
- *Rule.* Each raised layer is slightly lighter than the one under it (`bg` < `surface` < `panel` < `hover`).
  Never skip a step to make something "pop"; use `accent` or a border instead.
- *Enforced.* `darkTokens.test.ts` checks the order. Ratios: surface 1.07, panel 1.14, hover 1.23 against `bg`.
- *Source.* Decision 316; design repo `8060ba0`.

**3. Hairlines on black are decoration. Control edges use a separate token.**
- *Problem.* A divider that is comfortable on cream (about 1.4:1) is the same ratio on black, so a field with
  only a `line` border is not visibly a field, and anyone with low vision cannot find it.
- *Rule.* `line` is a quiet divider only (1.3 to 1.5:1 in dark) and never the only thing that identifies a
  control. Inputs, segmented controls and any boundary a person must find use `outline`, which is at least 3:1
  on every layer.
- *Values.* Dark `line #2C2C2C` (1.50 on bg, 1.32 on panel), dark `outline #787878` (4.76 / 4.17). Light
  `line #D5D0C6` (1.42), light `outline #828A83` (3.27 / 3.55).
- *Enforced.* Contrast guard test "control boundary": `outline` at least 3 on bg, surface and panel.
- *Source.* Design repo `docs/ui-brand-spec.md` D8, section A.2; `aa251ed`.

**4. Cards on black need a border; cards on cream do not.**
- *Problem.* On cream a white card separates from the page with no border at all. On black a 1.14:1 layer step
  is not enough, and "no shadows" is a brand rule, so the dark sidebar and cards lost their edges.
- *Rule.* In dark, give panels and the sidebar a 1 px `line` border. Do not add shadows to fix it.
- *Values.* Sidebar: `dark:border-r dark:border-line`. Citron search field in light becomes a `surface` field with
  a Citron border and icon in dark (see lesson 20).
- *Enforced.* Component classes in `components/shell/Sidebar.tsx` and `ui/FilterBar.tsx`.
- *Source.* App `6e60c20c4`.

### Text, muted text and accent

**5. Teal is a fill, not a text colour, on dark. Use `accent-ink`.**
- *Problem.* Maker Teal `#006E63` is fine as a button fill, but as text, an icon or a chart line on dark it
  is too dim: 3.41:1 on black and 2.99:1 on the panel (it was 1.76:1 on the earlier green-lit panel, which is
  where the "1.76" note in `chrome.css` comes from). Early dark screens used the fill as text and read as
  washed out.
- *Rule.* Standalone coloured text and small marks use the `*-ink` tokens, never the fill. In light `accent-ink`
  equals the fill; in dark it is a lifted tint of teal. A selected teal fill on dark carries a label or other
  cue and is never the only signal.
- *Values.* Light `accent-ink #006E63` (6.16 on panel); dark `accent-ink #80B1A6` (7.68 on panel). It is Teal
  mixed 50% with Cream.
- *Enforced.* Source guard bans `text-accent`, `text-success` and similar fill-as-text utilities; the contrast
  guard checks every `*-ink` on every background.
- *Source.* App `8b57246d1` (split on-fill ink from text ink), `d619267b1`; decision 316; design spec D2.

**6. Muted text is a neutral grey chosen for the worst background, not "ink at 60%".**
- *Problem.* `text-ink/60` is translucent: its real colour depends on what is behind it, so contrast changed
  per surface and failed on several (for example `text-on-accent/75` on teal measured 3.90:1).
- *Rule.* No translucent text, including `opacity` on a text element. Muted is its own opaque token, tuned to
  4.5:1 or better on every surface it can sit on, including soft fills and `hover`.
- *Values.* Light muted `#5B6863` (worst case 4.72 on `hover`). Dark muted `#ACACAC`, neutral grey 172 (worst
  case 7.07 on soft fills).
- *Enforced.* Source guard rejects `text-*/NN` patterns. Contrast guard covers all text tokens on `bg`,
  `surface`, `panel`, `hover` and the five soft fills.
- *Source.* Design spec D5 and H.1; decision 316 ("muted at least 4.5").

**7. Ink in dark is Cream, not white.**
- *Rule.* Dark body text is Warm Cream `#FFF4E8` (19.36 on black), which keeps the brand warmth and avoids the
  harsh glare of pure white on pure black. The page background in light is the same Cream, so the two themes
  are visual inverses of one pair.
- *Source.* Decisions 225, 316.

### Accent, focus and the Citron ring

**8. Focus is Citron in dark and Teal in light, and always opaque.**
- *Problem.* A teal focus ring is 3.41:1 on black: legal but weak. A ring that is an outline with some alpha
  blends with whatever is under it. `focus:outline-none` had been used and left keyboard users with no ring.
- *Rule.* Every interactive control shows a 2 px ring with a 2 px offset in the dedicated `focus` token, which
  is opaque. Dark uses Citron `#DFFF8F` (18.84 on black). Never remove the outline without replacing it.
- *Values.* Light `focus #006E63`, dark `focus #DFFF8F`. Class pattern:
  `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus`.
- *Enforced.* Contrast guard: `focus` at least 3 on bg, surface, panel, hover, sidebar. `focus:outline-none` is
  banned by a source guard. A11y e2e (axe, Chromium) fails the build on any violation, with no allow-list.
- *Source.* Design repo `5cf062e`; app `2d606d4e1` (accessible controls), `ede1f0052`; INVARIANTS "accessibility
  floor".

### Status colours

**9. Small status marks are solid in both themes; big tinted blocks use soft fills in dark.**
- *Problem.* Pills first used a solid pastel in light and a soft fill plus ink in dark. In dark the soft-pill
  version looked dim and inconsistent next to the same pill in light, and users scanning a table saw different
  colours for the same status. But solid pastel on a full-width callout glared on black.
- *Rule.* Pills, avatars, date chips and identity tiles (small marks) use the solid fill with its fixed dark
  label in both themes. Large areas (callouts, banners) use the solid fill in light and `*-soft` with the tone's
  ink in dark. A status always includes a word; colour is never the only cue.
- *Values.* Success `#DFFF8F`, warn `#FFD447`, info `#B5CDFF`, label `#142C2A` (13.23, 10.37, 9.23). Dark
  callout: `success-soft #20221B` with `success-ink #E9FCAA` (14.52), and the same pattern for warn and info.
- *Enforced.* `components/ui/tones.ts` exports `toneMarkClasses` (small) and `toneSurfaceClasses` (large).
- *Source.* App `6e60c20c4`; design spec D6 and section C.

**10. Fill labels are fixed per tone; text-on-tint colours change per theme. Do not mix the two token sets.**
- *Problem.* The `-ink` tokens were first made theme-adaptive (light in dark mode) and were then used on the
  solid pastel fills too, so labels on a Citron pill turned light in dark and became unreadable. A second
  vocabulary of duplicate colour names (`tone-*`) made it worse: which name a component used was accidental.
- *Rule.* There are two separate families. `on-*` (fixed Deep Ink, or Cream on teal/danger) is only for labels
  sitting on that tone's solid fill. `*-ink` (theme-adaptive) is only for standalone text and for text on a
  `*-soft` background. One vocabulary, no duplicates.
- *Enforced.* Contrast guard: `on-X` on X, X-hover and X-active at least 4.5 for every tone.
- *Source.* App `8b57246d1`, `d619267b1`.

**11. Danger flips both its fill and its label in dark.**
- *Rule.* Light danger is a deep red `#B91C1C` with a Cream label (5.96). Dark danger is a soft red `#FCA5A5`
  with a Deep Ink label (7.77); the same red on black would be 2.8:1 or worse, and a light red text on the dark
  panel is 9.71. Danger is only for destructive actions and errors, never for ordinary attention (use emphasis).
- *Source.* Design spec D4, D10; the brand has no red, so these were sampled from the reference boards.

**12. Orange emphasis is a fill with a dark label, once per layout, and never text.**
- *Problem.* Workshop Orange as text on Cream is 2.47:1.
- *Rule.* Orange is Space Works' own, never tenant-overridable, one bold moment per layout (counters, low-stock
  tags, one call to action). Always a pill or button with the fixed `on-emphasis` label (5.51). Orange standalone
  text is banned.
- *Values.* `emphasis #FF7447`, label `#142C2A`; soft `#FFEEE9` light, `#221A17` dark.
- *Enforced.* Source guard on emphasis text utilities; a test of one emphasis button per page.
- *Source.* INVARIANTS "colour vocabulary"; design spec D3, D10.

### Charts

**13. Chart colours need their own tokens, and a second cue besides colour.**
- *Problem.* The chart default used the same fills as the UI, and dark charts reused light-mode inks, which are
  dim on black. Teal marks on the dark panel were too weak, and a colour-blind reader could not tell two series
  apart.
- *Rule.* Series colours come from a chart token set. A series' colour is chosen by hashing its identity so it
  does not change when sorted or filtered, and each series also gets a dash pattern so colour is never the only
  cue.
- *Values.* Dashes: solid, `8 4`, `2 4`, `10 3 2 3`.
- *Enforced.* `tokens.json` `chart`; `chrome.css` defines `--chart-*`.
- *Source.* Design repo `a1869a2`; app `chrome.css`.
- *Updated by SW-380 (Design System v2.0): same brights plus an edge.* The original rule (light uses the dull
  `*-ink` shades, dark uses `accent-ink` and the brighter fills) is replaced. Series 1-5 are now the five bright
  brand colours (teal, orange, citron, sky, yellow), identical in light and dark, because one brand palette
  should look the same everywhere. The 3:1 graphics contrast that the dull inks used to buy now comes from
  `--chart-edge` instead: a 1px edge on every filled mark and a 4px casing under 2px lines (Deep Ink in light,
  Warm Cream in dark, at least 12:1 on every chart background). Never dull a fill to pass contrast; add or
  strengthen the edge. Red is not a series colour. The `accent-ink` rule in lesson 5 still holds for text.

### Tenant and custom brand colours

**14. A space's own colour may only touch public and member pages, and it must be proven readable in both themes.**
- *Problem.* Tenant colours were stored and shipped but never rendered; when rendered naively, a pale tenant
  colour made white labels fail, and a dark one disappeared on the black page.
- *Rule.* Staff screens never change; they always use the Space Works palette, so every staff role sees the same
  screen. Public and member pages derive their brand fill, label, hover, active, soft and ink from the tenant's
  two colours, separately for light and dark. The label colour is the first of Deep Ink, Cream, white or black
  that reaches 4.5:1 on the fill. The derived ink is blended toward the page-appropriate end until it reaches
  4.5:1 on every surface and soft it can sit on. Orange emphasis is never overridden.
- *Enforced.* `frontend/src/lib/brandColours.ts` (`deriveBrandPalette`, `brandContrastReport`) and its mirror
  in the backend `apps/makerspaces/theme_contrast.py` (the comment in the file says keep them in sync); a
  sweep test accepts all 4,096 three-digit colours in both themes. The server refuses a theme that fails.
- *Source.* App `e023e5a0f`; decision 324; design spec H.5 and section I.

**15. Do not reject a colour. Fix it, and tell the person.**
- *Problem.* An early guard refused mid-tone colours such as `#777` outright, which frustrated space managers.
- *Rule.* Accept any valid colour, then choose a readable label and derive hover and active shades; if a derived
  state would fall below 4.5:1, degrade to the previous algorithm rather than reject. Where a fill is weak
  against the page (below 3:1), show an advisory. Offer a one-click fix that moves the lightness the smallest
  amount (1% steps) until nothing fails.
- *Enforced.* `frontend/src/lib/colourFix.ts` (`issuesOf`, `suggestFix`); `colourSurfaces.ts` explains in the
  settings screen which surfaces use which colour (staff: none; member and public: derived; printed and TV:
  link colour only).
- *Source.* App `e023e5a0f`, `3c534e6a9` (colours panel in the staff console); decision 324; design spec H.5.

### Logos and illustrations

**16. Use the supplied logo variant for each surface. Never recolour the symbol.**
- *Rule.* There are three families: full colour (for light grounds), reversed Cream (for dark grounds) and
  one-colour Deep Ink (for single-colour print). Dark mode swaps `lockup-stacked.svg` for
  `lockup-stacked-reversed.svg`, and the same for the horizontal lockup and the symbol. The monochrome marks
  have a hollow opening so all four flaps stay visible, which is why recolouring the full-colour symbol is not
  equivalent. Keep clear space of a quarter of the symbol height; symbol at least 48 px, stacked lockup at
  least 180 px wide.
- *Enforced.* `SpaceWorksLogo` takes `ground: "light" | "dark"`, maps only to the supplied files, clamps size
  to the minimums and has no colour or transform passthrough. Tenant logos are shown as supplied and never
  animate.
- *Source.* Design spec F; design repo `logo/`; decision 362.

**17. Scrims and shadows on black: decide deliberately.** *(Derived from the tokens, not from a shipped fix.)*
- *Rule.* The dialog scrim token is Deep Ink in light and pure black in dark. Because a black scrim over a black
  page changes nothing, a dark dialog gets its separation from being a raised `panel` with a 1 px `line` border,
  not from the backdrop. The shadow colour is also black in dark, so overlay shadows add almost nothing there:
  do not rely on them. Cards carry no shadows in either theme; only popovers, menus, modals, drawers and toasts
  get the one overlay shadow.
- *Values.* `scrim` light `#142C2A`, dark `#000000`; `--shadow-color` light `20 44 42`, dark `0 0 0`; overlay
  shadow `0 2px 6px rgb(var(--shadow-color)/.06), 0 12px 32px rgb(var(--shadow-color)/.10)`.
- *Source.* Design repo `tokens.json`, README changelog (scrim added in v2.0); design spec E.

**18. The mascot on dark gets a thin Cream sticker border.**
- *Problem.* Patch's thick dark outline nearly vanishes on dark surfaces: 1.0 to 2.3:1 against Deep Ink, against
  6 to 14.5:1 on Warm Cream. The first fix put Patch on a Cream card in dark mode.
- *Rule.* Use `mascot/dark/` on dark surfaces only: a 4 px-per-256 px Warm Cream die-cut border, art untouched,
  same canvas so a dark file drops in for its light twin. Use the plain files on light surfaces. The border is
  the one approved exception to the "no outlines" rule. Pick the file from the page theme so only one downloads.
- *Enforced.* `site/scripts/dark-mascot.mjs` builds the dark set from the originals; app serves light and dark
  files by theme.
- *Source.* Design repo `89e618b`, `b93db0a`; app `5b1c10029`, `48b48f1b0`; decisions 55, 56, 57.

**19. Illustrations and brand artwork get light and dark twins.**
- *Rule.* Every illustration, empty-state glyph and landing graphic ships as a light and dark pair, chosen by
  theme (for example with a `<picture>` element and `prefers-color-scheme` or the app's own `html.dark`). Dark
  artwork keeps its Deep Ink content rather than going teal-tinted. README banners and ID/badge templates also
  ship both (card templates recolour only the text that sits on the card background in dark).
- *Source.* Decisions 32, 56; INVARIANTS cards.

**20. Photos and the Citron field on black.** *(Partly derived.)*
- *Rule.* The light console search field is a Citron slab with Deep Ink text; on a black page a full Citron slab
  glares. In dark the console search becomes a `surface` field with a Citron border and a Citron-ink icon, so
  the brand cue survives without a bright block. The public hero search keeps the Citron field in both themes,
  because it sits on a teal field. Uploaded photos and tenant logos are never recoloured; give them a `line`
  border on black if their edge would merge with the page.
- *Enforced.* `FilterBar` has `variant: "console" | "hero"`.
- *Source.* App `6e60c20c4`.

**21. A dark island inside a light page must re-join the black family when the page goes dark.**
- *Problem.* The Deep Ink panel kept for light mode (`.sw-island-dark`) showed a green field on a black page.
- *Rule.* In dark, the island is re-mapped to the same black family. Use the island only as the light-mode
  inverted panel.
- *Enforced.* `:root.dark .sw-island-dark` block in `index.css`, checked by `darkTokens.test.ts`.
- *Source.* Design spec D1; decision 316.

---

## 2. Typography

**22. Ship only fonts you are allowed to ship.**
- *Problem.* Gilroy Regular, Medium, SemiBold and Bold are paid weights, and the repos shipped them with no
  licence.
- *Rule.* Display headings use Gilroy ExtraBold (800); light display text uses Gilroy Light (300). Everything
  else (body, labels, controls, IDs) uses Outfit 400 to 700, which is open licence. Unbounded 500 to 600 is the
  one accent face, for one short phrase per layout. Anywhere the free Gilroy files cannot be embedded (PDF
  engines) falls back to Outfit. The paid weights are removed from every repo.
- *Values.* `display` Gilroy 800 / 300, `sans` Outfit 400 to 700, `accent` Unbounded 500 to 600.
- *Enforced.* `fonts/` holds only the free files; source guard bans obsolete fonts.
- *Source.* Decision 299; design repo `7dca9a4`.

**23. Display sizes must shrink on phones.**
- *Problem.* The display face at desktop size (for example 56 px) overflowed or wrapped badly on a 360 px
  screen, and a bold face read as too heavy at small sizes.
- *Rule.* Under 640 px the type scale drops: display 44/48, display-sub 24/30, heading 34/40, accent 32/40
  (size / line height in px). Titles on phones need room, so give the header enough height.
- *Enforced.* `styles/chrome.css` media query at `max-width: 639px`.
- *Source.* App `chrome.css`; `2d606d4e1` (phone titles).

---

## 3. Motion

**24. Never let the browser interpolate between two `matrix()` transforms.**
- *Problem.* The box-open logo flaps are 3D-looking folds drawn with `matrix()` transforms. The browser blends
  two matrices by decomposing them, which drifts the hinge and flickers (the "matrix glitch") when a flap goes
  edge-on.
- *Rule.* Sample the flap transform once per frame (96 samples for the one-shot, 160 for the loop) and play
  with `steps(1, end)`, so no matrix is ever interpolated. Only opacity may interpolate, and every opacity
  sample is emitted so a ramp is not smeared across a gap. In dark the seam line uses the page colour so it
  disappears against black.
- *Values.* One-shot 1600 ms; loop cycle 4400 ms; dark box under-face `#66625D`, seam `#000000`.
- *Enforced.* Generated keyframes in `components/boxOpen/css.ts`; design repo `motion/box-open/`.
- *Source.* App `96018635f`; design repo `0f6fb57`.

**25. Reduced motion is a first-class design, not a bug fix.**
- *Rule.* Under `prefers-reduced-motion: reduce`, durations drop to about 0, distances are zeroed, only fades
  remain, scroll behaviour is instant, and the loader and logo show their still (open) frame. Kiosk and TV
  displays get only fades. A scroll story needs a full static fallback for reduced motion, short viewports and
  phones.
- *Values.* Tokens: durations 120 / 180 / 240 ms; curves `cubic-bezier(0.2,0,0,1)` standard,
  `(0.16,1,0.3,1)` enter, `(0.4,0,1,1)` exit; enter distance 8 px; pop scale 0.98. Nothing on the critical path
  longer than 240 ms. Transform and opacity only, no new animation dependency.
- *Enforced.* Global reduced-motion block in `chrome.css`; `tokens.json` `motion`.
- *Source.* Decisions 300, 323; design spec E.

**26. No hover animation on touch.**
- *Problem.* Hover effects stick on touch screens (the "hover" state stays after a tap).
- *Rule.* Gate hover animation on `@media (hover: hover)` and gate everything on
  `prefers-reduced-motion: no-preference`.
- *Source.* Decision 362; design repo `motion/box-open/README.md`.

**27. The logo-hover rule: the mark opens once on hover and focus, everywhere, except tenant logos.**
- *Rule.* The Space Works mark plays the one-shot box opening (1600 ms) on pointer hover and keyboard focus
  wherever it appears (navbar, landing, sidebar, member header, auth panel, docs, mobile bar, error pages)
  through one shared component; leaving returns the still mark. It never loops except as the loader, tenant
  logos never animate, and under reduced motion it stays static.
- *Source.* Decision 362; design repo `docs/motion.md`.

**28. Use one loader everywhere: the box that opens.**
- *Problem.* Ring spinners and grey skeleton blocks gave two different loading looks, and the ring had its own
  dark-mode bugs (see 29).
- *Rule.* Pages, panels, sections, dialogs, cards and Suspense fallbacks show the full box loader. Small inline
  spots (buttons, table rows, fields, pickers) show the compact version of the same artwork. Every loading state
  keeps a polite `role="status"` label; under reduced motion it shows the still open logo. A cold start shows an
  inline splash before the app mounts so the first load is never blank.
- *Source.* Decisions 313, 322; app `96018635f`.

**29. Switching theme should animate, but never flash the old theme.**
- *Rule.* The theme switch reveals the new theme as a circle from the toggle (final frame held so the old theme
  never flashes), with a plain colour cross-fade where View Transitions are unsupported, and an instant swap with
  reduced motion. The default is light, with explicit saved choices respected, including across tabs and when
  storage is blocked; an OS-dark visitor without a saved choice starts light.
- *Enforced.* Tests labelled dark must select and verify actual dark mode.
- *Source.* App `f91f4c3b8`; decision 204.

---

## 4. Components

**30. Skeletons, spinners and sidebars each needed dark-specific fixes.**
- *Problem.* The skeleton block used the `line` colour, which is nearly the page colour on black, so loading
  states vanished. The ring spinner's track and teal head were nearly invisible on a dark panel. The sidebar
  lost its edge on black and its in-sidebar search field was a bright slab.
- *Rule.* Skeleton blocks use `line` in light and `hover` in dark. A ring spinner uses `focus` for the moving
  head (teal in light, Citron in dark). The dark sidebar is the `surface` layer with a `line` right border, and
  its inner controls use `panel` and `hover`. (Most of this is now superseded by the box loader, lesson 28, but
  the colour reasoning still applies to any placeholder.)
- *Source.* App `6e60c20c4`.

**31. Buttons with a loader use the mono variant.**
- *Rule.* Inside a filled button the loader draws in the button's text colour (`mono`), at the button's text
  size, so it reads on teal, Citron, Orange or red fills alike. A loading button keeps its width and its label
  or a status text.
- *Source.* Design repo `motion/box-open/README.md`; decision 322.

**32. Every button variant has rest, hover and active states that all pass.**
- *Rule.* Hover and active are separate tokens (`accent-hover`, `accent-active`, and so on) with the label
  tested on each (teal: 5.68 / 6.24 / 6.78). Disabled is explicit (`surface` fill, `muted` text, `line` border)
  and never done with `opacity-50`. Controls are 44 px tall, radius 10 px, no hover lift or shadow.
- *Enforced.* Contrast guard "fill labels".
- *Source.* Design spec B; app contrast tests.

**33. Make every control reachable and visible with the keyboard.**
- *Rule.* A skip link needs a target that always renders (`tabIndex={-1}`), outside loading or module gates.
  Collapsed content is unmounted, not hidden-but-present. Scrollable regions (charts, finance tables) get a
  named keyboard target. Accessible names must match the visible label.
- *Source.* INVARIANTS "accessibility floor"; app `2d606d4e1`, `024a84fd8`.

---

## 5. Process

**34. Check every page in both themes, before and after merging.**
- *Problem.* Several of the above bugs (invisible skeletons, washed-out teal text, glaring pills) were visible
  only in dark and only on some pages. Unit tests with no real colour compositing cannot see them.
- *Rule.* Every screen is reviewed in light and dark, at phone and desktop width, including empty, error and
  loading states. Automated checks: axe in unit tests catches structure only; the browser (Chromium) accessibility
  suite checks WCAG 2.1 AA including real contrast and runs on light and dark journeys. A violation is a red build
  with no allow-list.
- *Source.* INVARIANTS "accessibility floor"; decision 32; app `2d606d4e1` (28 light/dark journeys).

**35. Write the contrast math as tests that read the real tokens.**
- *Problem.* A palette spec in prose and a palette in CSS drift apart.
- *Rule.* A test reads the token file, strips comments, and asserts every text ink at 4.5:1 on every neutral and
  soft background, every fill label at rest/hover/active at 4.5:1, focus and outline at 3:1, and that each
  neutral is a documented mix (provenance). Source guards ban alpha text, alpha tints, fill-as-text, obsolete
  fonts and off-palette hex outside the brand file. Keep `:root {` and `:root.dark {` blocks literal so the
  parser can read them.
- *Enforced.* `backend/tests/test_frontend_theme_contrast.py`, `frontend/src/styles/darkTokens.test.ts`,
  `frontend/src/lib/brandColours.test.ts`.
- *Source.* Design spec section I; app `d619267b1`.

**36. One token source, generated into every consumer. Never hard-code colours in a second place.**
- *Problem.* The hosted design site hard-coded colours in its own stylesheet and kept showing an old dark
  palette after the app moved to solid black. The design repo's own spec and PDF also lagged the code (the PDF
  still predates decision 299, and the spec's ratios had to be recomputed after 316).
- *Rule.* `tokens/tokens.json` and `tokens/tokens.css` are the source. The site, docs tables, README swatches and
  mobile token files are generated from them (or checked against them), never retyped. After any palette change,
  recompute every ratio and list old to new values in the changelog so other apps can sync. Check that the app
  and the design repo agree (the 2026-11-13 check found all 55 dark tokens identical).
- *Source.* Decision 363; design repo `aa251ed`, `8060ba0`, `a1869a2`.

**37. Name tokens by role and keep the names stable when values change.**
- *Rule.* `bg`, `surface`, `panel`, `accent-ink` and the rest describe jobs, not colours. When dark was
  redesigned three times in a month, the token names never changed, so screens needed no edits. If a rename is
  unavoidable (for example `secondary` to `brand`), map every call site; a blind rename hides differences such
  as an ink that was fixed in one family and adaptive in another.
- *Source.* Decisions 275, 300, 316 ("token names stay"); app `d619267b1`.

**38. Keep a "do not regress" list, and add to it the moment something breaks.**
- *Rule.* Each lesson above that has an enforcement is also a regression check. When a bug is found only in one
  theme, add the assertion that would have caught it before fixing the screen.
- *Source.* App `docs/INVARIANTS.md`.

**39. Define an animation's states and check its frames, not only its curves.**
- *Problem.* The logo box animation had smooth curves and passing tests, yet in dark black holes opened in the
  side of the box while the flaps moved, and in light the closed box showed two orange faces. Each piece was right
  on its own: the dark master cuts its faces short under the front flaps (a cap filled them, but only near shut);
  a flap's colour switched at a chosen angle instead of when it turned edge-on; the rising flap was painted under
  the lid it stands in front of; and four flaps folding together passed through each other. Nobody had written
  down what a correct frame looks like, so nothing failed.
- *Rule.* Write the states down first (rest = the static logo exactly; shut = one solid shape, one orange face;
  colour changes only edge-on; paint order = depth order) and test them on rendered frames in both themes: exact
  frames (pause, rewind with a negative `animation-delay`), the whole cycle at 60 fps, on a loud page colour so
  transparency shows. A shape drawn in two masters (light and reversed) must be checked in both: what one master
  covers, the other may leave open.
- *Enforced.* `scripts/check-box-frames.mjs` (headless Edge); app `boxOpen.frames.test.ts`.
- *Source.* Decision 381; design repo `motion/box-open/README.md` "Known-good states".

---

## For Android, iOS and sibling apps

- Use the hex values in `tokens/tokens.json`. Define two colour sets (light and dark) with the same role names.
  Do not use the platform's automatic dark inversion.
- Follow the pairing table: text on `panel`, labels on fills, `outline` for control edges, `focus` for focus.
- Teal as a fill needs a label; teal as text or icon in dark is `accent-ink`.
- Status chips use the solid fill with the dark label in both themes; large banners use soft plus ink in dark.
- Draw the mascot from `mascot/dark/` and the logo from the reversed set on dark surfaces.
- Honour the platform's reduce-motion setting; the loader shows its still frame. No hover animation on touch.
- Verify with the platform's contrast tooling in both themes on every screen, as in lesson 34.

## The five lessons that cost the most

1. Dark is one neutral black family; tints and mixed families fight the page (lesson 1).
2. Do not use a fill as text; dark text and icons need the `*-ink` tokens (lessons 5, 10).
3. Controls need an `outline` edge; `line` is decoration on black (lesson 3).
4. Tenant colours must be derived and proven in both themes, and fixed rather than rejected (lessons 14, 15).
5. One generated token source, plus tests that read it, stops every consumer drifting (lessons 35, 36).
