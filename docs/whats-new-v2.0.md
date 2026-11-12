# What's new in v2.0

What changed in design and UX in **Space Works Design System v2.0**, which ships alongside SpaceWorks 0.12.0.

For designers and the teams building the other Space Works apps (Android, iOS, sibling web apps). It says what
moved in release 0.12.0, why, and what each app should change to match. For the reasons behind the colour rules
read [`lessons-learned.md`](lessons-learned.md); for every animation in detail read [`motion.md`](motion.md); for
how to wire up the theme switch read [`theming.md`](theming.md).

Decision numbers (for example 316) refer to the build's decisions ledger. Commit hashes are in this repo unless
marked "app".

---

## 1. The dark-mode shift

### The story

Dark mode was redone three times in one month. Each step fixed a real problem and created the next one.

| When | Decision / commit | Dark look | What was wrong |
|---|---|---|---|
| Before 15 Oct 2026 | early tokens | Grey-green dark | Contrast was too low in places; `894cf8c` (15 Oct) retuned the dark tokens for contrast. |
| 15 to 16 Oct | `5cf062e`; app `a770d92b0` | **Teal-lit**: Deep Ink `#142C2A` page, teal-lit panels (`#193935`, `#1F433F`), Citron focus | Teal marks were about 1.76:1 on the lit panel, so teal text and charts were too dim. Many status pills turned into dim soft fills. |
| 10 Nov | decision 225 | **True black (AMOLED)** page `#000`, but the layers above it stayed teal-lit | Owner: "keep the dark theme to somewhat that", only deepen it. |
| 11 Nov (morning) | decision 275, 300 | Black page, teal-tinted surfaces and borders, desaturated accents | A mix of pure black and green-tinted layers: surfaces seamed against the page. The UX pass also had to lift dark `line` for button borders (it measured 2.97:1 on the panel); decision 316 then split roles properly: `line` quiet, `outline` for control edges. |
| 11 Nov | **decision 316**; `8060ba0` | **One solid black neutral family**, no green anywhere in a surface | This is what ships. Owner: mixing pure black with green-tinted surfaces "is not working out". |

### Why it changed, in plain words

1. **Two families on one screen fight.** Black next to dark green looks like a mistake, not a design.
2. **Tinted surfaces cost contrast.** Teal on a teal-lit panel is dim; teal on neutral black is better and the
   lifted `accent-ink` fixes the rest.
3. **Brand colour works better as an accent than as a floor.** Teal, Citron and Orange now only appear in
   buttons, focus rings, links and status, so they stand out against neutral black.
4. **True black is cheaper and calmer on OLED phones**, which matters most for the mobile apps.

### Before and after, every dark token

Values are RGB triplets as in `tokens/tokens.css`; hex is in `tokens/tokens.json`. "Old" is the green-black dark
the app and this repo shipped before decision 316.

| Token | Old (teal-lit) | New (solid black) | New hex |
|---|---|---|---|
| `bg` | 20 44 42 | 0 0 0 | `#000000` |
| `surface` | 25 57 53 | 11 11 11 | `#0B0B0B` |
| `panel` | 31 67 63 | 20 20 20 | `#141414` |
| `hover` | 37 77 72 | 28 28 28 | `#1C1C1C` |
| `line` | 77 109 103 | 44 44 44 | `#2C2C2C` |
| `outline` | 147 161 152 | 120 120 120 | `#787878` |
| `muted` | 199 196 186 | 172 172 172 | `#ACACAC` |
| `sidebar` | 17 53 50 | 11 11 11 | `#0B0B0B` |
| `sidebar-hover` | 37 77 72 | 28 28 28 | `#1C1C1C` |
| `accent-soft`, `brand-soft` | 26 74 69 | 18 29 28 | `#121D1C` |
| `accent-ink`, `brand-ink`, `brand-boundary` | 171 200 188 | 128 177 166 | `#80B1A6` |
| `emphasis-soft` | 47 70 64 | 34 26 23 | `#221A17` |
| `success-soft` | 44 80 69 | 32 34 27 | `#20221B` |
| `success-ink` | 223 255 143 | 233 252 170 | `#E9FCAA` |
| `warn-soft` | 47 77 64 | 34 32 23 | `#222017` |
| `warn-ink` | 255 212 71 | 255 222 119 | `#FFDE77` |
| `info-soft` | 42 77 76 | 30 31 34 | `#1E1F22` |
| `info-ink` | 181 205 255 | 203 217 248 | `#CBD9F8` |
| `shadow-color` | 20 44 42 | 0 0 0 | `#000000` |
| `scrim` (new token) | n/a | 0 0 0 | `#000000` (light: `#142C2A`) |

### What stayed the same

`ink` (Cream `#FFF4E8`), `focus` (Citron `#DFFF8F`), the accent fills (Maker Teal `#006E63`, hover
`#02675D`, active `#046158`), `emphasis` (Workshop Orange `#FF7447`), the solid status fills (Citron, Warm
Yellow, Sky Blue) and their Deep Ink labels, and danger (`#FCA5A5` in dark). Token **names** are unchanged, so
code that uses names needs no edits. The whole light palette is also unchanged.

New in the same release: chart series tokens and loader colours for both themes (`a1869a2`, see
`tokens/tokens.json`), and the `scrim` token.

### What every app must change to follow

1. **Replace the dark values** with the table above. Do not keep any green-tinted surface or border.
2. **Page is `#000`**, layers step up 11, 20, 28. Do not add a custom "elevated" grey.
3. **Text and icons use `*-ink`**, not the fill (teal text on dark is `#80B1A6`).
4. **Controls get `outline`**, not `line`. `line` is a quiet divider (1.5:1).
5. **Status chips**: solid fill plus dark label for small marks in both themes; soft plus ink only for large
   banners in dark.
6. **Charts** use the `chart.dark` list, with a dash pattern per series.
7. **Logo**: reversed Cream lockups on dark; **Patch**: `mascot/dark/` with the Cream sticker border.
8. **Dark illustrations and print artwork keep Deep Ink**; the Deep Ink "island" (a dark panel inside a light page)
   re-joins the black family when the page is dark.
9. **Mobile**: use the system dark switch as the default signal only if the product wants it (the web app defaults
   to light and respects a saved choice); follow the black values on OLED.
10. Re-run your contrast checks (lesson 35) and check every screen in both themes (lesson 34).

### Screenshots

Folders in the main checkout under `handover/screenshots-0.12.0/` (not copied here):
- `dark-black/`: the final solid-black dark on the home, spaces, features, docs, sign-in and display screens,
  at 1440 and 390 px.
- `home-and-dark/`: "after" captures of the console (dashboard, list, drawer, dialog, settings) and the spaces
  page in states (loading, error, no results, offline), light and dark.
- `hub-scroll/`: the landing scroll story in light, dark, phone and reduced motion, plus
  `console-dashboard-dark-before.png` and `console-dashboard-dark-after.png` for a direct before and after.
- `loader/`: the box loader in both themes.

---

## 2. Logo animation

Three related things, all from the same artwork (the box symbol that opens):

1. **Cold-start splash.** On a cold page load the box opens, then flies into the header logo. An inline block in
   `index.html` shows it so the first load is never blank. Once per page load, about 1.2 to 1.6 s. (Decision 313.)
2. **Box loader.** The loop (4400 ms: open, hold, fold shut, repeat) is the one loading indicator everywhere.
   Pages and panels use the full `LogoLoader`; buttons, rows and fields use the compact `BoxSpinner`, with a
   `mono` variant that draws in the text colour. Replaces ring spinners and skeleton-as-loading. (Decision 322.)
3. **Hover and focus opening (the logo rule).** The Space Works mark plays the one-shot opening (1600 ms) on
   pointer hover and keyboard focus, everywhere it appears: navbar, landing header and footer, console sidebar,
   member header, auth panel, docs, mobile bar and error pages, through one shared component
   (`AnimatedLogoMark`). (Decision 362.)

**The rules for the hover opening**
- It plays once and returns to the still mark. It never loops except as the loader.
- **Reduced motion:** the mark stays static (and the loader shows the still, open logo).
- **Touch:** no hover animation on touch devices. Gate on `@media (hover: hover)`, so there is no stuck state.
- **Tenant logos never animate.** Only the Space Works mark does.
- Correct in light and dark: the artwork follows the theme (under-face `#354845` light, `#66625D` dark).
- The flap transforms are played with `steps(1, end)` so the browser never interpolates matrices (lesson 24).

Details: [`motion.md`](motion.md) and [`../motion/box-open/README.md`](../motion/box-open/README.md).

---

## 3. Every animation, and where it is used

A compact index. The full catalogue (files, tokens, trigger, reduced motion, dark notes) is in
[`motion.md`](motion.md).

Tokens: durations 120 / 180 / 240 ms; curves standard `(0.2,0,0,1)`, enter `(0.16,1,0.3,1)`, exit `(0.4,0,1,1)`.
Reduced motion zeroes durations and distances and leaves fades only. Kiosk and TV zero distances.

| Animation | Used in | Why |
|---|---|---|
| Box loader (loop) | Page, panel, dialog and Suspense loading | One brand-owned loading cue |
| Box spinner (mono) | Buttons, table rows, fields | Inline busy state that follows text colour |
| Cold-start splash | First paint of a cold load | Never a blank first screen |
| Logo hover and focus opening | Every Space Works mark | Brand moment, one-shot, never on touch |
| Route transition | Main content area only; sidebar and top bar stay still | A page change reads as one move |
| Scroll restoration | Every navigation | Back returns to where you were; a new page starts at the top |
| Sliding indicator | Sidebar and tabs | Shows the section by moving one box |
| Collapse / disclosure | Sidebar groups, settings sections | Neighbours stay in view |
| Theme switch | Theme toggle | Circular reveal; cross-fade fallback; instant if reduced motion |
| Fade, pop, sheet, drawer, menu, toast | Scrims, dialogs, phone sheets, side panels, menus, status toasts | Layers arrive from where they dock |
| Press and hover colour | Buttons, links, rows | Colour only, 120 ms; no lift or shadow |
| Stagger rise | First load of lists and dashboards | Reads as assembled in order; first eight items only |
| Skeleton | Placeholder shapes in lists | Reserves layout; shape plus the box loader |
| Landing scroll story | `/` (pinned hero, sticky handover record, reveal on scroll, areas panel) | Walks a visitor from promise to the real console |
| Sign-in brand facets | Sign-in screens | One entrance, never on hover |
| Display slide fade | TV and space display | One 400 ms fade, so a Pi stays idle |
| Kiosk and TV tokens | `.sw-kiosk`, `.sw-tv` | No slide, scale or loops on shared screens |
| Delight (opt-in) | Return confetti, pass tear, Patch on the 404 | Small human moments; never in staff or kiosk flows |

---

## 4. UX improvements in 0.12.0

Each item: what the user now experiences, then the pattern other apps should copy.

**1. Easier to start (decision 235).** The installer asks the fewest questions, with Enter-defaults and one clear
finish; the first admin gets a guided setup (name, logo, hours, areas, invite staff) and a "next steps" checklist;
optional features stay hidden until switched on; labels are plain language with one-line help; the docs lead
with a five-minute quickstart. *Copy:* ask areas not modules, hide what is off, never show internal words
("tenant", "capability", "module key").

**2. Settings grouped by the owner's mental model (decisions 255, 273).** Space settings are in seven groups
(Space, People, Areas, Money, Communication, Integrations, Administration) with search and one line of help per
page, from one translated catalogue (a test enforces coverage). Pages that live on their own tab appear in their
group as links; area pages and Settings link to each other. "Modules" became "Areas and add-ons" in user-facing
text only. Platform settings use the same grouping. *Copy:* group by what the person is trying to do, help text
on every row, search over all settings, one name per thing (the repair shelf had five names).

**3. Area views per role (decision 241).** Inventory, Machine, Event and Booking managers see their whole area
(finance, to-buy, consumables, repairs, warranties, reports, audit), grouped by machine type then machine; the
Space Manager sees the same combined, grouped by area with totals and an area filter. *Copy:* narrow the console
to the role, but give each role everything for its own area.

**4. One loader everywhere (decision 322).** Every loading state is the box opening; inline spots use the small
version. *Copy:* one loading indicator, with a polite status label and a still version for reduced motion.

**5. Page transitions and scroll behaviour (decision 323).** Content cross-fades with a short upward settle while
the sidebar and top bar stay still; the active sidebar item slides to the new one; going back restores your scroll
position and a new page starts at the top; the mobile drawer, dialogs, menus, popovers and toasts share the same
enter and exit motion. Focus moves to the page only on a real page change, so typing in a search box is no
longer interrupted by a query change. *Copy:* animate content, not chrome; restore scroll on back, reset on forward;
transform and opacity only; never block navigation on an animation.

**6. A scrolling product page, and a features page (decisions 300, 340a).** The front page tells a sample loan
step by step with a pinned hero, a sticky record and reveal on scroll; it becomes a plain static page for reduced
motion and phones. The "Find a space near you" section left the page (the Spaces link and `/spaces` stay). A
Features page lists every area and module, built from the app's own catalogue so it cannot drift. A switch
(`HUB_LANDING_ENABLED`) lets a space show its own home instead. *Copy:* a motion-rich story always has a static
fallback.

**7. A better spaces list (decision 275).** A compact hero with search, a responsive grid visible above the fold,
a sticky search on phones, and real loading, empty, no-results, offline and error-with-retry states, in both
themes (see `home-and-dark/`). *Copy:* design all five states, not only the full one.

**8. Machine service for every machine type (decision 340b).** The separate Printing module is gone; 3D printers,
lasers, CNC and cutters are machine types inside one Machine service, with consumables per type and one "Add a
machine type" setup. *Copy:* one workflow with types beats one module per machine.

**9. Card Studio (decisions 344, 345).** One designer for member cards, staff IDs, badges, tickets and
certificates: Quick mode for a fast start, Advanced for a full canvas (layers, guides and snapping, rulers, bleed
and safe zone, undo and redo, version compare), uploaded backgrounds, bulk photo matching by file name, an
optional background eraser run by the space itself with a member opt-out notice, seven barcode types, and
print-ready PDF. Built-in looks come in light and dark. *Copy:* offer a simple mode and an advanced mode on the
same document, and show the consent notice where the photo is taken.

**10. Web and app use in analytics (decision 357).** Counts-only daily activity per channel (web, iOS, Android,
API client) in a platform report and a space-manager variant that shows phone channels only when the mobile
module is on. *Copy:* tag every telemetry event with a `client`, and report counts, not people.

**11. Colour settings that fix themselves (decision 324, lesson 15).** A space picks two colours; the product
shows which surfaces use them (staff: none; members and public: derived; printed and TV: link colour), checks
both themes, and offers a one-click fix. *Copy:* explain where a setting applies, and fix rather than refuse.

**12. Shared patterns, copy and accessibility (UX pass, decision 255).** Highlights: a shared `Pagination` and
`ConfirmDialog` replaced ad-hoc pagers and native confirms; whole translated sentences with plurals instead of
fragments; no raw status codes (labels with a word); sticky bulk-action bar with "Clear selection"; dialogs
close only when the press and release both land on the backdrop (dragging a text selection out no longer closes
them) and always show a close button; error toasts announced as alerts; the Filters button names its active
count ("Filters, 3 active"); routed tabs are plain links; one checkbox and radio size; interactive borders use
`outline`; search placeholders are visibly lighter than typed text. *Copy:* every list uses the shared pager,
every destructive action a real confirm dialog, every error a retry.

**13. Command palette and search.** The palette matches both names of a page ("Home" and "dashboard",
"Notifications" and "Inbox") and the settings search covers every page including tab pages. *Copy:* search
matches synonyms, not only the label.

Source for items 2, 5 and 12: `handover/reports/UX-PASS-0.12.0.md` in the main checkout; release notes in
`docs/release-0.12.0.md` of the app repository.
