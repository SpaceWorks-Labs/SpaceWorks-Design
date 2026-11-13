# Light and dark theming

How to implement the Space Works light/dark switch in any Space Works app, using the palettes in `tokens/`. This
documents what the SpaceWorks app actually does (`frontend/src/lib/theme.ts`, `frontend/public/boot.js`,
`frontend/src/index.css`, `frontend/src/components/ThemeToggle.tsx`). Motion for the switch is in
[`motion.md`](motion.md); the palette and contrast tables are in [`ui-brand-spec.md`](ui-brand-spec.md).

Light is Warm Cream with white cards. Dark is one solid black family (decision 316): `#000000` page, neutral grey
layers, no green tint. Teal, Citron and orange are accents, never surfaces.

## 1. The token layer

`tokens/tokens.css` defines every colour as space-separated RGB triplets, light on `:root`, dark on `:root.dark`:

```css
:root       { color-scheme: light; --color-bg: 255 244 232; --color-ink: 20 44 42;  /* ... */ }
:root.dark  { color-scheme: dark;  --color-bg: 0 0 0;       --color-ink: 255 244 232; --color-surface: 11 11 11;
              --color-panel: 20 20 20; --color-hover: 28 28 28; --color-line: 44 44 44; /* ... */ }
```

**Historical — do not copy (1A-E04):** the following paragraph contains a text-alpha expression retained as history.

Triplets (not hex) so alpha works: `rgb(var(--color-ink) / 0.6)`. Names never change between themes; only values do.
Universal set: `bg`, `surface`, `panel`, `hover`, `line`, `outline`, `ink`, `muted`, `focus`, the accent, emphasis,
success, warn, info and danger families (fill, hover, active, ink, soft). `color-scheme` makes native controls and
scrollbars follow the theme.

> **Current rule (v2.0.1, 2026-11-13):** Triplet syntax does not permit translucent text: use opaque ink or muted. Alpha is reserved for explicitly specified compositing roles, not secondary text. (1A-N15) — supersedes the line above; see [docs/current-rules.md#cr-opacity-01](current-rules.md#cr-opacity-01).

**Current example (1A-E04):** `color: rgb(var(--color-muted));` for secondary text; `color: rgb(var(--color-ink));` for primary text.

## 2. The switch

- **State is one class**: `html.dark`. Light is the absence of the class.
- **Preference** is `light`, `dark` or `system`, stored in `localStorage` under `makerspace.theme`. Light is the
  default (or the space's own default look if the visitor has chosen nothing). Nothing follows the device until
  `system` is chosen.
- **`system`** resolves with `matchMedia("(prefers-color-scheme: dark)")` and a live `change` listener; a fixed choice
  ignores OS changes. A `storage` listener keeps other tabs in step.
- **Storage can fail** (private windows, blocked storage): always wrap reads and writes in `try/catch` and still apply
  the theme for the session.
- **No flash**: a tiny script in `<head>`, loaded synchronously before first paint, reads the stored choice and adds
  `dark` to `<html>` (and sets the meta colour). The app ships it as `public/boot.js` rather than an inline script so
  a strict Content-Security-Policy needs no `unsafe-inline`.
- **Browser chrome**: `<meta name="theme-color">` is `#FFF4E8` in light and `#000000` in dark, updated on every
  change.

## 3. Minimal example (HTML, CSS and about 20 lines of JS)

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="theme-color" content="#FFF4E8">
  <link rel="stylesheet" href="tokens/tokens.css">
  <script src="boot.js"></script> <!-- the pre-paint script below; synchronous, before any CSS paints -->
  <style>
    body { margin: 0; background: rgb(var(--color-bg)); color: rgb(var(--color-ink)); font-family: Outfit, sans-serif; }
    .card { background: rgb(var(--color-panel)); border: 1px solid rgb(var(--color-line)); padding: 16px; }
    .card:hover { background: rgb(var(--color-hover)); }
  </style>
</head>
<body>
  <div class="card">Hello <button id="theme">Theme</button></div>
  <script src="theme.js"></script>
</body>
</html>
```

`boot.js` (pre-paint):

```js
(function () {
  try {
    var p = localStorage.getItem("makerspace.theme");
    var dark = p === "dark" || (p === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
    if (dark) document.documentElement.classList.add("dark");
    var m = document.querySelector('meta[name="theme-color"]');
    if (m && dark) m.setAttribute("content", "#000000");
  } catch (e) {}
})();
```

`theme.js` (the switch):

```js
var KEY = "makerspace.theme", media = matchMedia("(prefers-color-scheme: dark)");
function pref() { try { var p = localStorage.getItem(KEY); return /^(light|dark|system)$/.test(p) ? p : "light"; } catch (e) { return "light"; } }
function apply(choice) {
  var dark = choice === "dark" || (choice === "system" && media.matches);
  document.documentElement.classList.toggle("dark", dark);
  var m = document.querySelector('meta[name="theme-color"]'); if (m) m.content = dark ? "#000000" : "#FFF4E8";
}
function choose(choice) { try { localStorage.setItem(KEY, choice); } catch (e) {} apply(choice); }
media.addEventListener("change", function () { if (pref() === "system") apply("system"); });
addEventListener("storage", function (e) { if (e.key === KEY || e.key === null) apply(pref()); });
document.getElementById("theme").onclick = function () {
  choose(document.documentElement.classList.contains("dark") ? "light" : "dark");
};
apply(pref());
```

## Switch animation

The switch can animate: the new theme grows from the toggle as a circle (720 ms, soft edge, cross-fade where View
Transitions are missing, instant under reduced motion). It ships as a template in
[`motion/theme-reveal/`](../motion/theme-reveal/README.md) (`theme-reveal.css`, `theme-reveal.js`, a standalone
`demo.html` and the app's React files). Replace the click handler of the minimal example with:

```html
<link rel="stylesheet" href="theme-reveal.css">
<script src="theme-reveal.js"></script>
<script>
  document.getElementById("theme").onclick = function (e) {
    var dark = document.documentElement.classList.contains("dark");
    SwThemeReveal.switchTheme(dark ? "light" : "dark", e.currentTarget); // stores the choice, sets html.dark and the meta colour
  };
</script>
```

`switchTheme` replaces `choose()` and `apply()` from the example; keep the `boot.js` pre-paint script, since the reveal
only animates changes after the page is up. In React, call `transitionTheme(next, button)` instead of `chooseTheme`.

## 4. The React version

Mirror of `frontend/src/lib/theme.ts` (the app's file also supports a space's default look and storage helpers):

```ts
export type Theme = "light" | "dark";
export type ThemePreference = Theme | "system";
export const THEME_KEY = "makerspace.theme";
const DARK_QUERY = "(prefers-color-scheme: dark)";
let sessionChoice: ThemePreference | undefined; // still works when localStorage is unavailable

function stored(): ThemePreference {
  if (sessionChoice) return sessionChoice;
  try { const v = localStorage.getItem(THEME_KEY); if (v === "light" || v === "dark" || v === "system") return v; } catch { /* ignore */ }
  return "light";
}
const systemTheme = (): Theme => { try { return matchMedia(DARK_QUERY).matches ? "dark" : "light"; } catch { return "light"; } };
export const resolveTheme = (p: ThemePreference): Theme => p === "system" ? systemTheme() : p;

function applyTheme(theme: Theme = resolveTheme(stored())) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  const chrome = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (chrome) chrome.content = theme === "dark" ? "#000000" : "#FFF4E8";
}

/** Call once before React mounts. Returns a cleanup. Only "system" follows the OS. */
export function initializeTheme() {
  sessionChoice = undefined;
  applyTheme();
  const onStorage = (e: StorageEvent) => { if (e.key === THEME_KEY || e.key === null) { sessionChoice = undefined; applyTheme(); } };
  const onSystem = () => { if (stored() === "system") applyTheme(); };
  const media = matchMedia?.(DARK_QUERY);
  addEventListener("storage", onStorage);
  media?.addEventListener("change", onSystem);
  return () => { removeEventListener("storage", onStorage); media?.removeEventListener("change", onSystem); };
}

export function chooseTheme(p: ThemePreference) {
  sessionChoice = p;
  try { localStorage.setItem(THEME_KEY, p); } catch { /* ignore */ }
  applyTheme(resolveTheme(p));
}

// For useSyncExternalStore: components read the painted theme from the class, so any change (toggle, OS, other tab) re-renders.
export const currentTheme = (): Theme => document.documentElement.classList.contains("dark") ? "dark" : "light";
export function subscribeTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
}
```

```tsx
function ThemeToggle() {
  const theme = useSyncExternalStore(subscribeTheme, currentTheme);
  return <button type="button" onClick={() => chooseTheme(theme === "dark" ? "light" : "dark")}>
    {theme === "dark" ? "Light" : "Dark"}
  </button>;
}
```

The app's toggle (`ThemeToggle.tsx`, `ThemeChoice.tsx` for the Light / Dark / System picker) calls `revealTheme`,
which wraps `chooseTheme` in a View Transition circle reveal (see `motion.md`); reduced motion switches instantly.
Call `initializeTheme()` in `main.tsx` before `createRoot(...).render`.

## 5. How components consume tokens

**Historical — do not copy (1A-E05, 1A-E06):** the following intact Plain CSS/Tailwind example predates the opaque text and named soft-fill rules. Do not copy the text alpha, `bg-accent/20` or alpha-capable colour recipes below.

- **Plain CSS**: `background: rgb(var(--color-surface)); color: rgb(var(--color-ink) / 0.8);`.
- **Tailwind**: `darkMode: "class"` and colours mapped to the variables, so `bg-surface`, `text-ink`, `border-line`,
  `bg-accent/20` and `dark:` variants all follow `html.dark`:

  ```ts
  // tailwind.config.ts
  export default { darkMode: "class", theme: { extend: { colors: {
    bg: "rgb(var(--color-bg) / <alpha-value>)", ink: "rgb(var(--color-ink) / <alpha-value>)",
    surface: "rgb(var(--color-surface) / <alpha-value>)", line: "rgb(var(--color-line) / <alpha-value>)" } } } };
  ```

  With Tailwind 4 CSS-first config you can express the same in `@theme` (`--color-ink: rgb(var(--color-ink-rgb))`) or,
  as the app does, keep `@config "../tailwind.config.ts"` in `src/index.css`.
- **Never hard-code a hex** where a token exists. A component that needs a dark-only or light-only look uses an island
  (`.sw-island-dark`), not a one-off colour.

**Current example (1A-E05):** `background: rgb(var(--color-surface)); color: rgb(var(--color-muted));` — opaque secondary text. See [CR-OPACITY-01](current-rules.md#cr-opacity-01).

**Current example (1A-E06):** named opaque roles, Gilroy 800 for display, Outfit 600 for UI headings, and explicit disabled state. Import the shipped tokens and font faces first.

```ts
// Tailwind configuration fragment; no text-alpha or brand-fill-alpha utilities.
export default { darkMode: "class", theme: { extend: { colors: {
  surface: "rgb(var(--color-surface))", ink: "rgb(var(--color-ink))",
  muted: "rgb(var(--color-muted))", line: "rgb(var(--color-line))",
  "accent-soft": "rgb(var(--color-accent-soft))"
} } } };
```

```html
<section class="bg-accent-soft text-ink">
  <h2 style="font-family:var(--font-display);font-weight:800;font-synthesis:none">Inventory</h2>
  <p class="text-muted">Check all quantities and required asset scans before continuing.</p>
  <button type="button" disabled class="disabled:bg-surface disabled:text-muted disabled:border-line disabled:opacity-100">Confirm issue</button>
</section>
```

The shared button component also suppresses disabled hover/press effects; [the explicit state example](ui-brand-spec.md#h1-translucency-bans-codex-1) shows the complete CSS. See [CR-TYPE-01](current-rules.md#cr-type-01), [CR-OPACITY-01](current-rules.md#cr-opacity-01) and [CR-DISABLED-01](current-rules.md#cr-disabled-01).

## The bright brand colours are the same in both themes

Space Works keeps its bright colours identical in light and dark. Only the neutrals (page, surfaces, lines, text)
switch. Do not invent a "dark version" of a brand colour.

| Role | Light | Dark | Same? |
|---|---|---|---|
| Accent / brand fill (Maker Teal) | `#006E63` | `#006E63` | yes |
| Emphasis (Workshop Orange) | `#FF7447` | `#FF7447` | yes |
| Success (Citron) | `#DFFF8F` | `#DFFF8F` | yes |
| Warn (Warm Yellow) | `#FFD447` | `#FFD447` | yes |
| Info (Sky Blue) | `#B5CDFF` | `#B5CDFF` | yes |
| Chart series 1-5 (teal, orange, citron, sky, yellow) | `#006E63` `#FF7447` `#DFFF8F` `#B5CDFF` `#FFD447` | the same | same (with an edge for contrast) |
| Chart edge (`--chart-edge`) | Deep Ink `#142C2A` | Warm Cream `#FFF4E8` | no: the edge is the neutral that carries contrast, so it flips with the page |
| Text on those fills (`on-*`) | Deep Ink / Warm Cream | the same | yes |
| Danger | `#B91C1C` | `#FCA5A5` | no: red is not a brand colour; dark uses a lighter red so it stays readable |
| Focus ring | Maker Teal | Citron | no: teal is too faint on black, Citron is the dark focus colour |
| Sidebar | Citron field | near black `#0B0B0B` | no: a large Citron field on black glares; the dark sidebar is a neutral surface |

What changes in dark is how a colour is used as **text or a thin mark**: use the `*-ink` tokens (for example
`accent-ink` `#80B1A6`, `success-ink` `#E9FCAA`) because the fill colours are too dark or too bright to read as
text on black. Fills, buttons, pills, chart bars and illustrations keep the bright brand colours.

## 6. Artwork per theme

> **Current rule (v2.0.1, 2026-11-13):** The reversed product mark keeps its cream body, but SW-389 (2026-11-13) requires two orange and two green flaps in the closed animated lid in both themes. “Reversed cream” below is not a cream-only animated-lid recipe. (1A-N16) — supersedes the line above; see [docs/current-rules.md#cr-logo-01](current-rules.md#cr-logo-01).

- **Logo**: two drawings, full colour on light (`symbol`, `lockup-*`) and reversed cream on dark
  (`symbol-reversed`, `lockup-*-reversed`). One-colour ink is for print and never recoloured full-colour paths. The
  app's `SpaceWorksLogo` picks by the painted theme and accepts a `ground` override for surfaces that are always dark.
- **Box loader and opening**: the SVG carries both variants (`.lt`, `.dk`); CSS shows `.dk` under `html.dark`, and
  `.g-dark` / `.g-light` force a ground. `mono` variants use `currentColor`. See `motion/box-open/`.
- **Illustrations and Patch**: ship a `-dark` file for each (`/brand/patch/name.webp`, `name-dark.webp`); pick by
  theme. Teal and Citron fields are identical in both themes.
- **Charts** (Design System v2.0, SW-380): `--chart-1` to `--chart-5` are the five bright brand colours, the same
  hex in light and dark. Contrast comes from `--chart-edge`: a 1px edge on every filled mark (bars, slices,
  points, legend swatches) and a 4px casing under every 2px line. Do not dull a series colour. Danger
  (`--chart-danger`) is not a series; use it explicitly for a bad or negative value. Use `rgb(var(--chart-1))`.
- **Splash and meta colour**: splash background `#FFF4E8` (light) and `#000` (dark); `theme-color` follows.

## 7. Contrast rules

Check every text and control colour in both themes against the matrices in `ui-brand-spec.md` (worst light cell 4.65:1,
worst dark 6.71:1). Body text is at least 4.5:1, large text and UI boundaries 3:1; focus rings (Citron in dark) are at
least 3:1 against the surface. Tenant brand colours are proven against both themes before use. Never rely on colour
alone for state.

## 8. Checklist for a new page or component

1. Only tokens, no hex. 2. Open it in light and dark (and with `system` plus the OS flipped). 3. Logo and illustration
use the themed variant. 4. No flash on reload in dark (the pre-paint script is present). 5. Charts use `--chart-1` to `--chart-5` plus `--chart-edge`.
6. New animations behave the same in both themes and under reduced motion.
