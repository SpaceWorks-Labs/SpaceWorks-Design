# Motion in Space Works

The catalogue of every animation and transition in the shipped app (SpaceWorks 0.12.0): where it is used, why it
exists, which tokens it reads, what triggers it, and what it does under reduced motion and in dark. App paths are
relative to `frontend/src/` in the SpaceWorks repository. Tokens are in `tokens/tokens.css` (`--sw-dur-*`,
`--sw-ease-*`, `--sw-enter-y`, `--sw-pop-*`, `--sw-slide-x`; mirrored in the app at `styles/motionTokens.css` and
`lib/motion/motion.ts`). Brand-spec section E has the token values. Every family below has a reusable, framework-free copy in [`motion/`](../motion/README.md) (CSS, React copies, a live demo and a README per family). How the theme switch itself works is in
[`theming.md`](theming.md).

Defaults for every row unless it says otherwise: **reduced motion** = `styles/motion.css` forces animation and
transition durations to 0.01 ms, the JS side (`lib/motion`) skips View Transitions and exit delays, and the token
durations and distances become 0; **dark** = motion is colour-neutral, so nothing changes between themes except where
a row says so.

## Which animation to use, where

Use the listed default **whenever the situation occurs**. Do not invent a new animation for a situation that has one.

| Situation | Use | Tokens / timing | Do not |
|---|---|---|---|
| A whole page or panel is loading | `LogoLoader` (box loop), 72 px, centred, with a status label | 4400 ms loop | a generic spinner, a progress bar for unknown time |
| A button is busy (save, submit) | `BoxSpinner mono` in the button, `aria-busy="true"` on it | 16 to 24 px, `currentColor` | change the button width; show a spinner and a label that disagree |
| Inline field, table row or small area is loading | `BoxSpinner` (20 px) or `BoxArt` sized to the placeholder, plus a `Skeleton` shape for lists | same loop | skeleton shimmer sweeps; spinners on every row at once |
| Route change | `TransitionLink` / `useTransitionNavigate` (View Transition on `[data-sw-main]` only) | old out 90 ms, new in `--sw-dur-slow` + 8 px rise | animate the sidebar or top bar; block navigation on the animation |
| Sidebar or tab section switch | `useSlideIndicator` (one box sliding) | `transform` over `--sw-dur-base`, `--sw-ease-standard` | repaint each item's highlight separately |
| Open or close a dialog, drawer, menu, popover, toast | `usePresence` + `sw-fx-pop` (dialog), `sw-fx-drawer` (side panel), `sw-fx-menu`, `sw-fx-toast`, `sw-fx-fade` (scrim) | enter 120 to 240 ms decelerate, exit 120 to 180 ms accelerate | unmount instantly without the exit; leave a closing layer focusable (it must be inert) |
| Expand or collapse a group | `Collapse` / `Disclosure` (`sw-collapse`) | grid rows 0fr to 1fr, 180 ms open, 120 ms close | animate `height` |
| List or dashboard items first appear | `StaggerGroup` (first eight children) | 200 ms, 30 ms apart, 6 px | stagger long lists, or re-run on every refetch |
| Scroll reveals on marketing pages | `data-reveal` blocks, once | 640 ms, opacity and transform | reveal on hover; replay on scroll back up; hide content from reduced-motion users |
| Hover on cards, buttons, links, rows | colour only | 120 ms, `--sw-ease-standard` | translate, scale, lift or shadow on hover |
| The Space Works logo | `AnimatedLogoMark` (folds shut and opens back on hover and focus-visible) | 2200 ms once: fold 600 ms + opening 1600 ms | loop it; animate a tenant logo; animate on touch |
| Success or confirm feedback | status toast (`sw-fx-toast`); card verify stamp; return confetti only with delight on | 180 ms in, 120 ms out; stamp 420 ms | confetti in staff or kiosk flows; sound |
| Empty state | still artwork or Patch frame, no loop | none (Patch frame 0) | looping mascots in staff chrome |
| Kiosk and TV screens | fades only (`.sw-kiosk`, `.sw-tv` zero the distances); display slide fade 400 ms | no slide, scale or loops | anything that keeps repainting while idle |
| Theme switch | `revealTheme` (circle growing from the toggle); copy-paste template in [`motion/theme-reveal/`](../motion/theme-reveal/README.md) | 720 ms | animate individual surfaces separately |

What never animates: layout properties, text content swaps in forms, validation errors (they appear, they do not
bounce), focus rings, data tables on sort or filter, anything while a person is typing.

## Rules

> **Current rule (v2.0.1, 2026-11-13):** Use the token defaults and named non-blocking brand exceptions below. Ledger 399 (2026-11-13) additionally requires symmetric enter/exit choreography, token timing, interruption handling, focus/announcements and reduced-motion end states. Catalogue observations are not blanket exceptions to the colour-only product-hover rule. (1A-N37) — supersedes the line above; see [docs/current-rules.md#cr-motion-01](current-rules.md#cr-motion-01).

1. **The Space Works mark opens on hover and keyboard focus, everywhere it appears.** One-shot box opening: from
   the resting logo it folds shut (600 ms) and opens back (1600 ms), 2200 ms in all, no hold, so nothing snaps at
   either end. Once started it always finishes (leaving mid-way does not cut it; re-entering does not restart it). It
   never loops except as the loading indicator. Tenant (makerspace) logos never animate. No hover
   animation on touch devices (pointer-enter of a touch pointer never starts it; keyboard focus-visible does). Reduced motion shows
   the static mark. It never takes focus and never changes the mark's size.
2. **Every logo placement uses the one shared component** (`components/brand/AnimatedLogoMark.tsx`); a guard test
   fails the build if the mark is drawn any other way. Never fork the geometry or keyframes: the opening is
   generated from the logo masters (`components/boxOpen/`).
3. **Product motion is colour only on hover**: hover and active change colour (120 ms); nothing translates, scales
   or lifts. The mark's box-open is the single, deliberate exception (also named in brand-spec section E), because it
   is the brand, not product chrome.
4. **Transform and opacity only.** No animating layout properties (height collapses use grid rows 1fr to 0fr).
5. **Enter decelerates, exit accelerates**, and exits are shorter than entrances (`--sw-ease-enter` /
   `--sw-ease-exit`; 120 to 240 ms). Nothing on an interaction path runs longer than 240 ms. Longer motion
   (landing story, theme switch, box opening) is page-level or brand-level and never blocks input.
6. **Motion shows what changed**, it does not decorate: arrival of a layer, a move to a new place, loading, a
   confirmed result. If removing the animation loses no information, keep it short or drop it.
7. **Reduced motion is a floor, not a flag**: every animation has a still equivalent that carries the same
   information. Kiosk and TV screens zero the distances and keep only fades.
8. **Never loop outside a loader.** The only exceptions are decorative and switched off by reduced motion (the 404
   pet's sleeping "z" and the delight companion walk).
9. **Both themes, every time**: a new animation is reviewed in light and dark (see "Dark theme on every page").

## Tokens

| Token | Value | Used for |
|---|---|---|
| `--sw-dur-fast` | 120 ms | press, hover, exits, menus |
| `--sw-dur-base` | 180 ms | overlays entering, indicators, collapse |
| `--sw-dur-slow` | 240 ms | route settle, drawers |
| `--sw-ease-standard` | `cubic-bezier(0.2,0,0,1)` | most movement |
| `--sw-ease-enter` | `cubic-bezier(0.16,1,0.3,1)` | arrivals |
| `--sw-ease-exit` | `cubic-bezier(0.4,0,1,1)` | departures |
| `--sw-enter-y` / `--sw-pop-scale` / `--sw-pop-offset` / `--sw-slide-x` | 8 px / 0.98 / 4 px / 100 % | distances (zero on kiosk, TV and reduced motion) |

## Catalogue

### Brand

| Name | Where (files) | Why | Tokens / timing | Trigger | Reduced motion | Dark |
|---|---|---|---|---|---|---|
| **Mark opening on hover / focus** | Every Space Works logo: public header (`components/layouts/PublicHeader.tsx`), hub header and footer (`features/hub/HubHeader.tsx`, `HubFooter.tsx`), staff and member sidebar (`components/shell/Sidebar.tsx`), mobile top bar (`shell/MobileTopBar.tsx`), sign-in and centred-card layouts (`layouts/AuthLayout.tsx`, `CenteredCardLayout.tsx`), kiosk header (`layouts/KioskLayout.tsx`), public footers (`layouts/PublicLayout.tsx`, `components/SiteFooter.tsx`), space brand fallback (`components/MakerspaceBrand.tsx`), stats TV (`features/stats/PublicStatsTvPage.tsx`), card verify (`features/cards/CardVerifyPage.tsx`), space picker badge (`features/staff/MakerspacePicker.tsx`). One component: `components/brand/AnimatedLogoMark.tsx` | The mark is the product's signature: the box is what Space Works hands out, and opening it confirms the link is live without moving layout | 2200 ms, once: the box starts at the resting logo, folds shut (600 ms, staggered: top-left and bottom-right, then bottom-left, then top-right, so no flap passes through another), then opens (1600 ms, the splash opening: top-right, bottom-left, then top-left and bottom-right) back to the resting logo, with arcs and sparks; shut it is one solid cube whose lid shows one orange face; faces change colour only edge-on; flap matrices are sampled and stepped, never interpolated. Frame-checked by `scripts/check-box-frames.mjs`. Fixed box, no size change | JS starts it on pointer-enter (mouse or pen, never touch) or keyboard focus-visible of the mark or its link or button; removed on `animationend`. Leaving mid-way lets the cycle finish; re-entering while it runs does not restart it | Never starts; the still mark | Reversed artwork (cream, `.dk`) is chosen from the surface; the overlay uses the same choice (`g-light` / `g-dark`) |
| **Cold-start splash** | `index.html` (generated block), `lib/splash.ts` | First paint of a cold load: the box opens, then flies into the header logo (`data-sw-logo-target`) | Same 1600 ms opening | Page load | Still open logo | Follows `html.dark` (cream on `#FFF4E8`, or on `#000`) |
| **Box loader (loop)** | `components/LogoLoader.tsx` (route fallbacks in `App.tsx`, card designer, query loading states) | Something is loading for an unknown time; one brand-owned indicator | 4400 ms: open, hold, fold shut, repeat | Mounted while loading | Still open logo | Reversed artwork in dark |
| **Box spinner / BoxArt (mono)** | `components/BoxSpinner.tsx` (about 370 use sites: buttons, rows, fields, placeholders) | Inline and in-button busy state | Same cycle, 16 to 24 px, `mono` = `currentColor` | While busy | Still logo | `currentColor`: follows the button text in both themes |
| **Search field** | `components/ui/SearchField.tsx` + `SearchField.css` (one shared field; used by `FilterBar` on `/spaces`, the landing hero and the organization directory, the docs palette `features/docs/DocsSearchPalette.tsx`, the staff palette `features/staff/CommandPalette.tsx`, help, features, settings hub, member directory, makerspace discovery, public inventory, galleries, event and booking discovery, and every staff picker and filter, 50+ sites) | One search input everywhere, so focus, loading and clearing feel the same: the border and magnifier answer focus, the box spinner answers a running query, and the clear button and Escape make resetting one gesture | Focus: border to the focus token, magnifier to `accent-ink` with a 2 px nudge (180 ms, `--sw-ease-enter`), shortcut chip fades out (120 ms); loading: magnifier fades out and the 16 px mono `BoxSpinner` fades in (120 ms); clear button fades and scales 0.9 to 1 (120 ms); dropdown rises 4 px and fades (`--sw-dur-base`, enter), first six rows stagger 20 ms, "No results" fades in; optional width grow 72 % to 100 % of a reserved slot (240 ms) | Focus-within, a query in flight (`loading`), text present, Escape clears | Colour changes only: no nudge, scale, rise, stagger or width change; the spinner swap stays (it is the loader) | Tokens only: focus border is Citron in dark, teal in light |
| **Logo flap wobble (delight)** | `components/delight/logoUnfold.css` (`LogoDelight.tsx`) | Optional playful extra when interface effects are on; the hidden-while-opening static flaps keep it from clashing | 460 ms spring, rotation only | Hover, focus-visible, click, only with delight on | None | Same |

> **Current rule (v2.0.1, 2026-11-13):** The Brand table’s one-orange-face and edge-on recolouring clauses are superseded by SW-389 (2026-11-13): top-left/bottom-right remain green and top-right/bottom-left remain orange, all four visible and solid in light and dark throughout the animation. Mono keeps four distinct regions. (1A-N36) — supersedes the line above; see [docs/current-rules.md#cr-logo-01](current-rules.md#cr-logo-01).

### Navigation and page change

| Name | Where | Why | Tokens / timing | Trigger | Reduced motion | Dark |
|---|---|---|---|---|---|---|
| **Route transition** | `lib/motion/TransitionLink.tsx`, `useTransitionNavigate.ts`, `routeTransition.ts`, `RouteTransitionGate.tsx`, `styles/motionRoute.css`; only `[data-sw-main]` animates | A page change reads as one move while the sidebar and top bar stay put | Old out 90 ms (exit ease); new in over `--sw-dur-slow` after 70 ms with an 8 px rise (enter ease). Settles after 160 ms if the page is slow; never blocks navigation | Plain left-click on a `TransitionLink`, push navigation; back/forward and unwrapped links get the CSS fade (`.sw-route-enter`) | No View Transition; instant | None |
| **Scroll restoration** | `lib/motion/ScrollManager.tsx` | Return to where you were on back; top on a new page | Instant | Navigation | `scroll-behavior: auto` | None |
| **Sliding indicator** | `lib/motion/useSlideIndicator.ts`; sidebar (`components/shell/Sidebar.tsx`), tabs | Shows the current section by moving one box, not repainting the list | `transform` over `--sw-dur-base`, standard ease; resize updates skip the transition | Section or tab change | Instant | Colours from tokens |
| **Section collapse** | `components/ui/Collapse.tsx`, `components/shell/Disclosure.tsx`, `styles/motion.css` | Opening a group keeps neighbours in view | Grid rows 0fr to 1fr plus opacity; 180 ms open, 120 ms close | Toggle | Instant | None |
| **Theme switch** | `components/delight/themeReveal.ts`, `lib/themeTransition.ts`; template: [`motion/theme-reveal/`](../motion/theme-reveal/README.md) | The new theme grows from the toggle, so the change reads as chosen, not a flash | 720 ms circular reveal (View Transition mask); cross-fade where unsupported | Theme toggle | Instant switch | It is the light/dark switch |

### Layers: dialogs, drawers, menus, toasts

All carry `data-state="open|closed"`; `lib/motion/usePresence.ts` keeps them mounted for the exit and makes them
inert while closing. Styles: `styles/motionOverlay.css`.

| Name | Where | Why | Tokens / timing | Reduced motion | Dark |
|---|---|---|---|---|---|
| **Fade** (`sw-fx-fade`) | scrims behind dialogs and drawers | The layer arrives without a jump | in 180 ms standard, out 120 ms exit | Instant | Scrim from tokens |
| **Pop** (`sw-fx-pop`) | `components/ui/Modal.tsx`, `layouts/FilterPopover.tsx`, `features/presence/PresenceCheckInSheet.tsx` | The dialog arrives from just in front (0.98 scale, 4 px), so focus lands on something that visibly appeared | in 180 ms enter ease, out 120 ms | Instant | Same |
| **Sheet** (`sw-sheet-in/out`) | bottom sheets on phones | Rises from the edge it docks to | 2 x `--sw-enter-y` | Instant | Same |
| **Drawer** (`sw-fx-drawer`) | `components/ui/DetailDrawer.tsx`, `shell/SidebarDrawer.tsx`, `features/docs/DocsLayout.tsx` | Side panels slide from the side they sit on, so closing has an obvious direction | in 240 ms, out 180 ms; `-left` variants | Instant | Same |
| **Menu** (`sw-fx-menu`) | `components/ui/OverflowMenu.tsx`, user menu, popovers | Anchored menus drop 4 px from the trigger | 120 ms both ways | Instant | Same |
| **Toast** (`sw-fx-toast`) | status toasts | Status arrives without stealing focus | in 180 ms, out 120 ms | Instant | Tone colours from tokens |

### Feedback and state

| Name | Where | Why | Tokens / timing | Trigger | Reduced motion | Dark |
|---|---|---|---|---|---|---|
| **Press and hover colour** | buttons, links, rows (`styles/motion.css`, `features/hub/hub.css`) | The control answers: colour eases in, pressing sinks to 0.98 | 120 ms colour; focus ring untouched | Hover, active | Instant | Hover fills are dark-family tokens |
| **Stagger rise** | `components/layouts/StaggerGroup.tsx`, `layouts.css` (`sw-stagger-rise`) | First load of a list or dashboard reads as assembled in order; first eight children only | 200 ms, 30 ms apart, 6 px | First load | None | Same |
| **Skeleton** | `components/ui/Skeleton.tsx`, DataTable loading rows | Reserves the shape of what is coming | Static shape plus the box spinner | While loading | Static | Surface tokens |
| **Return confetti** | `components/delight/ReturnConfetti.tsx`, `confetti.css` | Celebrates a completed return (delight on only) | about 1.1 s burst, brand colours | Return confirmed | None | Brand colours |
| **Delight touches** | `components/delight/delight.css` (`sw-pass-tear`, `sw-result-arrive`, `sw-companion-walk`, `sw-logbook-open`) | Small human moments on passes, results, the logbook | 360 ms ease-out; walk loops 4 s | Mount (delight on only) | None | Same |
| **Patch (404 pet and moments)** | `components/delight/NotFoundPatch.tsx`, `PatchMoment.tsx`, `patch.css` | The 404 and a few still moments have a mascot; never in staff chrome | 960 ms frame trot x2; "z" loop 2400 ms; print fade 1600 ms | Mount, hover | Still frame | `-dark.webp` sheets |
| **Card verify stamp** | `features/cards/cardVerify.css` | A valid card check lands with one stamp | 420 ms | Valid result | None | Same |
| **Handover wizard steps** | `features/staff/handover/HandoverWizard.tsx` | Step change in the guided handover | Shared fade and rise tokens | Step change | Instant | Same |

### Landing and hub (public)

| Name | Where | Why | Tokens / timing | Trigger | Reduced motion | Dark |
|---|---|---|---|---|---|---|
| **Pinned hero sequence** | `features/hub/landing/HeroSection.tsx`, `useScrollSequence.ts`, `landing-scroll.css` | Scrolling walks the visitor from promise to the real console to the overview in one sticky scene | Scroll-driven transform and opacity, smoothstep; ranges lift 0 to 0.25, rise 0 to 0.38, zoom 0.55 to 0.84, reveal 0.86 to 1; 300 svh tall; `will-change` only while moving | Scroll, 768 px and wider | Static page, top to bottom | `bg` and `surface` tokens; console artwork has dark variants |
| **Handover steps beside a sticky record** | `HandoverScrolly.tsx`, `landing-scroll.css` | The record changes as each step reaches the middle: shows the evidence trail forming | Border and text colour 240 ms ease-out | Scroll | Steps stack, no transitions | Tokens |
| **Reveal on scroll** | `data-reveal` blocks, `landing-scroll.css` | Sections arrive once as they enter; never on hover | 640 ms `cubic-bezier(0.2,0.7,0.2,1)`, opacity and transform | In view, once | Visible at once | Same |
| **Areas panel and story proof** | `AreasSection.tsx`, `StorySections.tsx`, `hub.css` | Switching an area swaps panel and proof so the change is noticed | 360 ms enter ease; clip-path wipe for the panel | Selection change | None | Same |
| **Brand facets and sign-in showcase** | `components/BrandFacets.tsx`, `styles/fields.css` (`sw-facet-in`, `sw-rise`) | Brand panel entrance on sign-in, once, never on hover | 640 ms and 480 ms, `cubic-bezier(0.32,0.72,0,1)` | Page load | None | Island-dark panel in light; black family in dark |

### Kiosk and displays

| Name | Where | Why | Tokens / timing | Reduced motion |
|---|---|---|---|---|
| **Display slide fade** | `features/spaceDisplay/display.css` (`sw-display-fade`) | One opacity fade per slide so a Raspberry Pi stays idle between slides | 400 ms ease-out | None |
| **Kiosk and TV tokens** | `.sw-kiosk`, `.sw-tv` (`styles/motionTokens.css`) | Shared screens must not slide or scale; fades only | Distances zeroed | n/a |

### Found in the audit (small, easy to miss)

Every motion rule in the app source was swept for `@keyframes`, `animation`, `transition`, View Transitions, `animate()`, the motion tokens, Tailwind `transition-*`, IntersectionObserver and `scrollIntoView`. These were not listed above. (Every animation, one row each with its kit folder, is listed in [`motion/README.md`](../motion/README.md): 49 in all.)

| Name | Where (files) | Why | Tokens / timing | Trigger | Reduced motion | Dark |
|---|---|---|---|---|---|---|
| **Cold-start splash flight and fade** | `lib/splash.ts` (Web Animations `animate()`) | After the box opens (1700 ms) the splash mark flies to the header logo, then the splash fades, so the first paint hands over without a jump | Flight 520 ms `cubic-bezier(0.22,1,0.36,1)`, fade 200 ms (150 ms under reduced motion), waits up to 3 s for the target | Page load | Fade only, 150 ms | Splash ground follows `html.dark` |
| **Disclosure chevrons** | `components/shell/SidebarSection.tsx` (180 deg), `components/ui/CollapsibleSection.tsx` (90 deg), `components/card-designer/InspectorSection.tsx` (90 deg), `features/hub/landing/FaqSection.tsx` (plus to 45 deg, 200 ms), `features/docs/docs.css` (`sw-doc-nav-chevron`, 160 ms `cubic-bezier(0.16,1,0.3,1)`) | The arrow turns with the section it controls, so the state reads before the content moves | `transform` over `--sw-dur-base` (Tailwind `transition-transform`) or the listed time | Toggle | Instant | None |
| **Docs drawer scrim** | `features/docs/docs.css` (`.sw-doc-drawer-scrim::before`) | The tint is a pseudo-element so its fade does not fade the opaque panel (a child of the scrim) | Same as `sw-fx-fade`: 180 ms in, 120 ms out | Open, close | Instant | Scrim token |
| **Hover colour on cards, tabs and directory rows** | `features/landing/SpaceCard.tsx`, `features/hub/hub.css`, `features/hub/featuresPage/features.css`, `features/docs/docs.css`, `features/discover/spaces/spaces.css`, `features/staff/SettingsSectionNav.tsx`, `components/layouts/SettingsNav.tsx`, `MemberRegisterList.tsx`, `ProductCard.tsx` (stepper) | Same colour-only rule as buttons, applied to cards, links, tabs and pager rows | 120 ms (`transition-colors` or `transition: color 120ms, background-color 120ms`) | Hover, focus | Instant | Token fills |
| **Hover opacity and drag dim** | `features/staff/eventProgramme/AnalyticsColumns.tsx` (bar to 80 %), `eventParticipation/CrewRowCard.tsx` (60 % while dragging) | Marks the bar under the pointer and the row being reordered | `transition-opacity` | Hover, drag | Bars: `motion-reduce:transition-none` | Same |
| **Progress width** | `features/cards/cardJobs.tsx` (`motion-safe:transition-[width]`) | A card job's progress bar grows to the new value instead of jumping | Tailwind default 150 ms | Progress update | Instant | Token fill |
| **Holographic card tilt and flip** | `features/members/wallet/HolographicCard.tsx` | The member's printed card follows the pointer (or the phone tilt) and flips front to back | `perspective(1200px)`, rotate up to 9 deg, flip 180 deg, 650 ms `cubic-bezier(0.32,0.72,0,1)`; updates throttled to one per animation frame | Pointer move (not touch), device orientation, flip button; delight on only | Instant flip, no tilt | Same |
| **Logo flap spring and pop** | `components/delight/logoUnfold.css` | With delight on, the four flaps of the mark turn a few degrees on hover or focus and spring back; a click pop overshoots | Hover 460 ms and pop 560 ms, `cubic-bezier(0.34,1.56,0.64,1)`; rotate 7, 7, 5, 5 deg (pop 13, 13, 9, 9) | Hover, focus-visible, click; delight on only | None | Same |
| **Glyph tilt** | `components/delight/delight.css` (`.sw-delight-glyph:hover`) | A small decorative glyph turns -3 deg under the pointer | 120 ms | Hover, pointer devices only | None | Same |
| **Root cross-fade** | `components/delight/delight.css` (`::view-transition-old/new(root)`) | Any View Transition that is not the route or theme one cross-fades the page | 180 ms | A root View Transition | `animation: none` | Same |
| **Pet walk, naps and paw prints** | `components/delight/NotFoundPatch.tsx` (requestAnimationFrame), `patch.css` | The 404 pet follows the pointer, naps when idle and leaves paw prints that fade | Sprite frame stepped from the walk sheet; prints fade over 1600 ms | Pointer on the 404 page | Not mounted | `-dark` sprite sheets |
| **Smooth scroll to a target** | `features/hub/landing/HandoverScrolly.tsx` (centre), `features/community/member/JoinButton.tsx`, `features/kiosk/KioskReplayRecoveryPanel.tsx`, `features/printing/PublicPrintRequestPage.tsx` | Brings the result of an action into view | Browser `behavior: smooth` | Selection or submit | `behavior: auto` (also forced by the reduced-motion floor) | None |
| **Scroll-driven state with no motion of its own** | `features/docs/DocsToc.tsx`, `components/layouts/SettingsNav.tsx`, `features/discover/spaces/SpacesToolbar.tsx` (stuck state), `features/hub/landing/useInView.ts`, `PatchMoment.tsx` (starts the trot) | IntersectionObservers that only set a state (current section, stuck, in view); any visible change is the colour transition above | n/a | Scroll | n/a | n/a |

## Dark theme on every page

Dark is one solid black family (decision 316): `#000` page, neutral grey layers, no green tint; teal, Citron and
orange are accents only. The implementation guide is [`theming.md`](theming.md); this is the summary.

- **How every page switches.** One class on `<html>`: `html.dark`. Every colour is a token (`--color-*` RGB
  triplets) redefined under `:root.dark`; components read tokens, never hexes. The landing page and every other page
  (public, member, staff, auth, kiosk, docs) share the same tokens, so switching is one class flip.
- **What changes besides tokens.** (1) The **logo artwork**: full colour (`lt`) on light, reversed cream (`dk`) on
  dark; the box-open artwork contains both. (2) **Illustrations and Patch sheets** have `-dark` variants. (3)
  **Fields**: teal and citron are identical in both themes; the Deep Ink field and sign-in brand panel use
  `.sw-island-dark`. (4) **Separation**: dark uses `--color-line` borders instead of shadows. (5) **Mono artwork**
  follows `currentColor`.
- **The landing page.** Hero, pinned sequence, handover scrolly, areas, FAQ and footer use `bg`, `surface`, `panel`,
  `line` and `ink`, so they switch with the class; the console preview artwork has dark variants; the self-host band
  is an island-dark in light and part of the black family in dark.
- **The rule.** Every page and every new animation is checked in both themes before it ships. A mark on a surface
  that is always dark (an ink island) must be given the dark ground so it uses the reversed artwork; text must meet
  the contrast tables in `docs/ui-brand-spec.md`; no hex colour is hard-coded where a token exists.
