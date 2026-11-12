# Space Works motion kit

Part of Design System v2.0. Values are copied from the app as shipped in SpaceWorks 0.12.0.

Every animation in the product as a reusable, framework-free template: one folder per family, each with the CSS
(copied unchanged from the app, using the tokens in [`../tokens/tokens.css`](../tokens/tokens.css)), `react/` copies
of the real app files, a standalone `demo.html` (light and dark, honours reduced motion), animated `previews/`
(WebP and GIF) and a README that says what it is, where the app uses it, why, the timing and easing tokens, the
trigger, reduced-motion and dark behaviour, do and don't, and copy-paste usage.

The full catalogue with every trigger and reduced-motion note is [`../docs/motion.md`](../docs/motion.md). The
rules behind it: transform and opacity only, enter decelerates and exit accelerates, nothing on an interaction path
over 240 ms, hover is colour only, reduced motion is a floor, never loop outside a loader, check both themes.

## Folders

| Folder | What it covers |
|---|---|
| [`box-open/`](box-open/README.md) | The box loader (loop), the inline spinner, the in-button mono spinner, the logo hover and focus opening, the cold-start splash opening |
| [`theme-reveal/`](theme-reveal/README.md) | The light/dark switch: a circle growing from the toggle |
| [`search/`](search/README.md) | The shared animated search field |
| [`route-transition/`](route-transition/README.md) | Page change: old out, new in, only the main region |
| [`page-enter/`](page-enter/README.md) | List stagger, sign-in facets and showcase, areas panel and proof |
| [`scroll-reveal/`](scroll-reveal/README.md) | Landing story: pinned hero, handover steps beside a sticky record, reveal on scroll |
| [`overlays/`](overlays/README.md) | Scrim fade, dialog pop, phone sheet, side drawers, menus and popovers |
| [`toast/`](toast/README.md) | Status toast in and out |
| [`sidebar/`](sidebar/README.md) | Sliding section and tab indicator |
| [`collapse/`](collapse/README.md) | Height collapse via grid rows, disclosure chevrons |
| [`skeleton/`](skeleton/README.md) | Still loading placeholders and the progress width |
| [`hover-press/`](hover-press/README.md) | Colour-only hover, press sink, card, row and link hover |
| [`feedback/`](feedback/README.md) | Verify stamp, result arrive, pass tear, logbook, return confetti |
| [`delight/`](delight/README.md) | Logo flap spring and pop, Patch, companion walk, glyph tilt, card tilt and flip |
| [`kiosk-display/`](kiosk-display/README.md) | Display slide fade and the kiosk and TV token override |

## Every animation, where it lives

| Animation | Folder | Where | Why |
|---|---|---|---|
| Mark opening on hover and focus | `box-open/` | Every Space Works logo placement (`AnimatedLogoMark`) | The brand signature; shows the link is live without moving layout |
| Cold-start splash opening | `box-open/` | `index.html`, `lib/splash.ts` | First paint hands over to the header logo |
| Cold-start splash flight and fade | `box-open/` | `lib/splash.ts` | The mark flies to the header logo (520 ms), then the splash fades (200 ms) |
| Box loader (loop) | `box-open/` | `LogoLoader` route fallbacks and panels | One brand loading indicator |
| Box spinner and mono | `box-open/` | `BoxSpinner` (buttons, rows, fields) | Inline and in-button busy state |
| Theme switch reveal | `theme-reveal/` | `themeReveal.ts`, `themeTransition.ts` | The new theme grows from the toggle |
| Animated search field | `search/` | Shared search field | See its README |
| Route transition (View Transition) | `route-transition/` | `lib/motion/*`, `motionRoute.css` | A page change reads as one move; chrome stays still |
| Route fallback fade (`sw-route-enter`) | `route-transition/` | Back and forward, unwrapped links | Same move without the API |
| Scroll restoration | `route-transition/` | `ScrollManager.tsx` | Back returns to where you were |
| Root cross-fade | `route-transition/` | `delight.css` | Non-route View Transitions fade the page (180 ms) |
| Stagger rise | `page-enter/` | `StaggerGroup`, `layouts.css` | First load reads as assembled in order |
| Facet entrance | `page-enter/` | `BrandFacets`, `fields.css` | Sign-in panel entrance, once |
| Showcase rise | `page-enter/` | `fields.css` (`sw-auth-showcase`) | Sign-in cards arrive in turn |
| Areas panel wipe | `page-enter/` | `AreasSection`, `hub.css` | A switched area is noticed |
| Story proof rise | `page-enter/` | `StorySections`, `hub.css` | A new proof row lands |
| Handover wizard step change | `page-enter/` | `HandoverWizard.tsx` | Shared fade and rise tokens |
| Pinned hero sequence | `scroll-reveal/` | `HeroSection`, `useScrollSequence` | Promise to console to overview in one scene |
| Handover steps beside sticky record | `scroll-reveal/` | `HandoverScrolly` | The evidence trail forms as steps pass |
| Reveal on scroll | `scroll-reveal/` | `data-reveal` blocks | Sections arrive once |
| Smooth scroll to target | `scroll-reveal/` | `HandoverScrolly`, `JoinButton`, kiosk recovery, print request | Bring the result into view |
| Scrim fade | `overlays/` | Dialogs, drawers, docs drawer scrim | The layer arrives without a jump |
| Dialog pop | `overlays/` | `Modal`, `FilterPopover`, `PresenceCheckInSheet` | Arrives from just in front |
| Bottom sheet | `overlays/` | Dialogs under 640 px | Rises from the edge it docks to |
| Drawer (right and left) | `overlays/` | `DetailDrawer`, `SidebarDrawer`, `DocsLayout` | Slides from its own edge |
| Menu and popover | `overlays/` | `OverflowMenu`, user menu, popovers | Drops 4 px from the trigger |
| Presence (exit keeps mounted) | `overlays/` | `usePresence.ts` | Exits can play and the layer is inert while closing |
| Status toast | `toast/` | `ToastHost` | Status without stealing focus |
| Sliding indicator (sidebar) | `sidebar/` | `Sidebar`, `useSlideIndicator` | One box shows the current section |
| Tab underline slide | `sidebar/` | Staff panel tabs | Same hook on tabs |
| Section collapse | `collapse/` | `Collapse`, `Disclosure`, sidebar "More" | A group opens without losing neighbours |
| Disclosure chevrons | `collapse/` | Sidebar, collapsible and inspector sections, FAQ, docs nav | The arrow reports the state |
| Skeleton placeholder | `skeleton/` | `Skeleton`, DataTable loading rows | Reserves the shape; box spinner inside |
| Progress width | `skeleton/` | `cardJobs.tsx` | Progress eases to its value |
| Press and hover colour | `hover-press/` | Buttons, tabs, nav items (`motion.css`) | The control answers; press sinks to 0.98 |
| Hover colour on cards, rows, links, tabs | `hover-press/` | Space cards, hub, docs, directory, settings nav | Same colour-only rule |
| Hover opacity and drag dim | `hover-press/` | Analytics bars, crew rows | Marks the hovered or dragged item |
| Card verify stamp | `feedback/` | `CardVerifyPage` | A valid check lands with one stamp |
| Return confetti | `feedback/` | `ReturnConfetti` | Celebrates a completed return (delight on only) |
| Result arrive, pass tear, logbook open | `feedback/` | `delight.css` | Small human moments (delight on only) |
| Logo flap spring and pop | `delight/` | `logoUnfold.css` | Playful flaps (delight on only) |
| Patch: pet walk, naps, paw prints | `delight/` | `NotFoundPatch` | The 404 pet |
| Patch moment trot | `delight/` | `PatchMoment` | Still moment that trots once |
| Patch "z" | `delight/` | `patch.css` | Sleeping decoration (loops, decorative) |
| Companion walk | `delight/` | `Companion` | Decorative walk (loops, decorative) |
| Glyph tilt | `delight/` | `delight.css` | -3 deg under the pointer |
| Card tilt and flip | `delight/` | `HolographicCard` | The printed card follows the pointer |
| Display slide fade | `kiosk-display/` | `spaceDisplay/display.css` | One fade per slide; a Pi stays idle |
| Kiosk and TV token override | `kiosk-display/` | `.sw-kiosk`, `.sw-tv` | Fades only on shared screens |

## Previews and checks

Animated WebP and GIF previews (light and dark, each under 400 KB) are in every folder's `previews/`. They are
rendered in headless Edge from the same CSS by `node scripts/make-previews.mjs motion-kit`, with every CSS
animation and transition paused and seeked to an exact time per frame. `node scripts/check-previews.mjs` fails when
any family's CSS, demo page or preview is stale or missing.

## Using a family

1. Link `tokens/tokens.css` (it defines the motion tokens and both themes: dark is the class `dark` on `<html>`).
2. Link the family stylesheet and copy the markup from its `demo.html`.
3. Check it in light and dark, and with `prefers-reduced-motion: reduce`.
