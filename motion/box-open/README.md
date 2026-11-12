# Box-open loader

The Space Works loading animation. The box from the logo opens flap by flap, holds open, folds shut and repeats.
It is drawn from the logo's own paths, so it is always on-brand in both themes.

Open [`demo.html`](demo.html) in a browser to see every variant. Use the "Toggle dark" button to switch themes.

## Files

| File | What it is |
|---|---|
| `box-open.css` | All animation CSS: theme colours, keyframes, the `loop` cycle, the `mono` variant and the reduced-motion rule. |
| `box-open-markup.html` | The SVG markup to put inside the container: one `<svg class="lt">` for light and one `<svg class="dk">` for dark. |
| `demo.html` | A standalone page with the page loader, the inline spinner sizes and the button (mono) variant. |
| `react/` | The React components used by the SpaceWorks app (`LogoLoader`, `BoxSpinner`, `BoxArt`, and `brand/` with the logo hover cycle: `AnimatedLogoMark`, `LogoBoxOverlay`, `animatedLogo.css`), plus the generators in `boxOpen/` and the logo path masters they read. |

## Usage without React

```html
<link rel="stylesheet" href="box-open.css">

<div role="status" aria-label="Loading">
  <div class="sw-box loop" aria-hidden="true" style="width:78px;height:72px">
    <!-- paste box-open-markup.html here -->
  </div>
</div>
```

- The aspect ratio is fixed at **136 : 126**, so the width is the height × 136 / 126.
- The dark artwork shows when `<html>` has the class `dark`.
- Add `mono` (`class="sw-box loop mono"`) to draw it in the surrounding text colour, for example inside a button.
  It uses the one-colour master geometry. Set `--sw-ground` to the button background so all four shut panels
  remain distinct even with cream text; React `BoxArt` reads the opaque host background and updates on theme changes.

## The logo opens on hover and focus

The same artwork plays once (`sw-box hov`, 2200 ms) over the Space Works mark whenever it is hovered or keyboard-focused, everywhere it appears. It starts on the resting (open) logo, folds shut (600 ms, the loader's fold), then opens (1600 ms, the splash opening) back to the resting logo: no hold, no snap at either end.

- In the app every placement uses `components/brand/AnimatedLogoMark.tsx`; a guard test fails if the mark is drawn any other way.
- Without React: on pointer-enter (not `pointerType === "touch"`) or `focusin` that matches `:focus-visible` on the logo's link, mount `<div class="sw-box hov" style="position:absolute;inset:0">` + the markup over the logo's symbol and hide the static symbol paths; remove both on `animationend` of `sw-boxh-w`. Leaving mid-way lets the cycle finish; entering while it runs does not restart it.
- Skip it entirely when `prefers-reduced-motion: reduce` matches (the still mark shows). Touch never starts it.
- Add `g-dark` or `g-light` to force the artwork for a surface that is always dark or light; otherwise it follows `html.dark`.
- Set `--sw-ground` on the container to the colour behind the mark when it is not the page colour (`#FFF4E8` light, `#000` dark): moving flaps are outlined in it, like the gaps in the logo. The React overlay reads it from the first opaque background up the tree.
- The `hov` CSS is in `box-open.css` (generated with the loop; the splash only carries `once`). It never loops outside the loader, tenant logos never animate, and the box never changes size.

Full rules, and every other animation in the product: [`../../docs/motion.md`](../../docs/motion.md).

## When to use which

| Use | Component | Height |
|---|---|---|
| A whole page or panel is loading | `LogoLoader` | 72px (default), centred |
| Buttons, table rows, fields, inline status | `BoxSpinner` | 16–24px (20px default) |
| Inside a filled button | `BoxSpinner mono` | the button's text size |
| A skeleton placeholder | `BoxArt` | matches the placeholder |

Use the box loader everywhere something loads. Don't use a generic spinner.

## Motion

- Opening (one-shot, on the cold-start splash): **1600 ms**.
- Loader cycle (open, hold, fold shut, repeat): **4400 ms**.
- Opening: the top-right flap lifts first, then bottom-left, then top-left and bottom-right together.
- Folding shut is staggered in the reverse order, each flap over half the fold: top-left and bottom-right first, then bottom-left, then top-right. Folding all four together made neighbouring flaps pass through each other.
- Flap transforms are sampled per frame and played with `steps(1, end)`. Browsers glitch when they interpolate between two `matrix()` values near edge-on, so flap matrices are never interpolated; only opacity is.
- **Reduced motion:** under `prefers-reduced-motion: reduce` every animation stops and the still, open logo shows.

## Known-good states

These are checked frame by frame (see "Checking the frames" below); a change that breaks one is a bug.

- **Rest** (the start and end of hover, the end of opening, the loader hold): the static product logo.
  It uses `symbol` geometry in light and `symbol-reversed` geometry with the approved full-colour flap
  palette in dark. Nothing extra is drawn: no cap, no outline, no wall. Explicit one-colour marks stay mono.
- **Shut** (opening start, loader closed hold, middle of hover): one solid cube with four distinct lid quarters.
  Top-left and bottom-right are green (`#006E63`); top-right and bottom-left are orange (`#FF7447`),
  in both themes, exactly as those flaps are when open. All four remain visible. No hole or central slot.
- **Open** (rest): the same two orange and two green flaps, on the logo's original paths.
- **In between:**
  - Every flap keeps its own solid colour on both sides through the full fold. No reverse-face recolouring
    or shading towards a different hue. SW-389 supersedes the earlier one-orange-lid reading of SW-381.
  - The reversed (dark) artwork cuts its side faces short under the front flaps, so a cream cap (the light
    master's full faces) shows behind them from the first frame anything moves. That is what fixed the black
    holes.
  - Moving flaps are outlined in the ground colour so a flap never melts into the face behind it: from the first
    moving frame in dark (with the cap), faded in over the first 12 degrees in light.
  - Flaps are painted in depth order. The top-right flap is drawn twice (`.z0` under the others, `.z1` on
    top) and swaps layer only while it overlaps nothing.

## Checking the frames

`node scripts/check-box-frames.mjs` (from the repo root; optional locally, needs Microsoft Edge like
`make-previews.mjs`) renders exact frames of `box-open.css` and `box-open-markup.html` in light and dark,
for `hov`, `loop`, `once`, the fixed grounds, `mono` and forced colours in both themes. It fails on a hole,
a shut lid without two orange and two green regions in the expected positions (four regions for mono),
a shut frame that differs from a reference box drawn from the geometry, or a resting
frame that differs from the static logo. `--strips <dir>` also writes frame strips. In the app the same rules run
as unit tests (`frontend/src/components/boxOpen/boxOpen.frames.test.ts`).

## Accessibility

- The wrapper has `role="status"` and an `aria-label` (default "Loading"), with matching visually hidden text.
- The artwork is `aria-hidden` and never focusable.
- In a busy button, set `aria-busy="true"` on the button.

## Source of truth

The generators live in the SpaceWorks app at `frontend/src/components/boxOpen/`. Its `boxOpen.sync.test.ts`
keeps the copy inlined in `index.html` (the splash) in step with them. The files here are generated from that
code for SpaceWorks 0.12.0 (Design System v2.0.1): `box-open.css` is `boxOpenCss()`, `boxMonoCss()` and
`boxGroundCss()`; `box-open-markup.html` is `boxOpenSvg()`. Regenerate them after any change to the generators
or the logo masters, never by hand. From the app's `frontend/` directory, run:

```powershell
$env:UPDATE_SPLASH = '1'
$env:SW_BOX_DESIGN_DIR = 'C:\Users\shaan\Music\SpaceWorks\SpaceWorks-Design'
npx vitest run src/components/boxOpen/boxOpen.sync.test.ts --pool=forks --maxWorkers=1
```

This exports the exact generated CSS and SVG, refreshes every embedded demo symbol and copies the React
sources. The regular dark static mark uses `brand/animatedLogo.css` to apply that same flap palette;
`AnimatedLogoMark` keeps explicit `oneColour` marks separate. Previews and guidelines are rebuilt by the
release orchestrator after all design lanes finish.

The React components use Lingui (`t`) for the label and Tailwind utility classes for layout. Swap those for
your own i18n and CSS if you use them outside the app.

## Previews

Rendered from the real `box-open.css` and `box-open-markup.html` (frame-exact, 30 fps, 2x), so they always show
the current colours. Each has a `.gif` twin in `previews/`. The resting open logo is `previews/logo-open-light.png`
and `previews/logo-open-dark.png`.

| | Light | Dark |
|---|---|---|
| Page loader, 72px loop | ![](previews/loader-light.webp) | ![](previews/loader-dark.webp) |
| Inline spinner, 20px row | ![](previews/inline-row-light.webp) | ![](previews/inline-row-dark.webp) |
| Mono button "Saving" | ![](previews/button-saving-light.webp) | ![](previews/button-saving-dark.webp) |
| Logo hover: fold, then open (`.sw-box.hov`, 2200 ms) | ![](previews/logo-hover-light.webp) | ![](previews/logo-hover-dark.webp) |

Rebuild with `node scripts/make-previews.mjs` and verify freshness with `node scripts/check-previews.mjs`
(both from the repo root; see `tokens/README.md`).
