# Portable token architecture

Stable contract: **Space Works Design System v2.1.0**, introduced 2026-11-13 for DSA-004/014/034.
Owner: Space Works design-system maintainers. Implementations: generated web and native **values**; these exports
are not native controls or a claim of tested native component accessibility. Last verified: 2026-11-13.
Latest authority: owner decision 395 (preserve all existing content and token bytes), then decision 397 (ship this
additive contract as v2.1.0). Existing legacy exports and preview assets are retained without deprecation.

## Sources and derivation

Two inputs feed one generator. `tokens.json` remains the frozen source for the existing colour roles, chart,
loader, Aurora card and motion values. [contract.json](contract.json) adds declarative scales and component aliases.
The importer in `scripts/tokens/model.mjs` deduplicates palette samples into primitives and attaches role metadata.
Descriptions and reference tables are generated from that same model, never independently typed into an export.

The app sources were read only from
`C:\Users\shaan\Music\SpaceWorks\SpaceWorks\.claude\worktrees\int-stage-r2final\frontend` on 2026-11-13.
The generator does not depend on that checkout existing; the imported real values are captured here.

| Scale | Values / source | Decisions where sources differ |
|---|---|---|
| Colour | Existing light/dark values, verified against app `src/index.css` | Dark neutral surfaces follow decision 316. Deep Ink islands are local app contexts, not a third global theme. |
| Spacing | 0/4/8/12/16/20/24/28/32/36/40/44/48/56/64 px | `docs/ui-brand-spec.md` E, `docs/ux-spec.md` spacing observations, app controls/rows; 4px grid. Zero is reset. |
| Radius | none 0; sm 6; base 8; md/control 10; lg 12; xl/card 16; 2xl 20; full 9999 px | App `tailwind.config.ts`, `chrome.css`; current UI brand spec E wins over older UX reference radii. |
| Type | 72/76 display; 48/52 heading; 32/38 page/sub; 20/28 panel; 16/24 body/section; 14/20 label; 12/16 caption; 48/56 accent | Exact families, weights, tracking, date/stat/eyebrow/button and mobile roles appear in USAGE; app Tailwind/chrome and UI brand spec D.3. |
| Mobile type | display 44/48; heading 34/40; display-sub 24/30; page 26/32; accent 32/40 | Below 640px, app `chrome.css` plus UI brand spec D.3. These are explicit roles; consumers choose responsive utilities. |
| Shadow/elevation | flat (zero shadow); overlay layers y2 blur6 alpha .06 and y12 blur32 alpha .10 | App Tailwind `shadow-overlay` and UI brand spec E. No intermediate elevated-card scale is invented. Pigment Deep Ink/light, black/dark. |
| Layer | 0,1,2 local; sticky10; fixed20; navigation30; popover40; overlay50; critical60 | Captures app CSS/TSX z-index values. Root menus use40; local popovers can use30 inside their owning stack. Critical60 is a reserved ceiling matching existing app z-index60 uses. |
| Duration | 0/120/180/240 ms core; display-fade400; scroll-reveal640; logo-box-open2200 ms exceptions | Existing motion tokens and `docs/motion.md`; exceptions never replace interaction-path core durations. |
| Easing | standard (.2,0,0,1), enter (.16,1,.3,1), exit (.4,0,1,1), out-soft (.32,.72,0,1) | Existing motion tokens and app Tailwind. |
| Breakpoint | sm640, md768, lg1024, xl1280, 2xl1536, wide1680 px | App media queries and inherited Tailwind 2xl default. UX 375px is a reference viewport, not a min-width breakpoint. |
| Opacity | 0,.06,.10,.30,.35,.40,.60,.70,.80,1 | Shadow alphas; app scrim/30/35/40/70; drag .60 and chart decoration .80 (`docs/motion.md`). No faded text or button-disabled token. |
| Border/focus | 0/1/2/4 px; focus width2, offset2, theme pigment `focus` | App button focus-visible rules; chart casing4; UI brand spec E. |
| Control/layout size | minimum control44; list row56; table row48; sidebar256; sidebar-app264; bottom tabs64 px | Spec sidebar256 retained; app `AppShell.tsx`264 exported separately. Content may grow; safe-area insets are runtime geometry. |

## Three tiers and alias rules

1. **Primitive**: immutable named palette samples, unit-bearing scales, family/weight, type metrics and shadow layers.
   `primitive.color.hex006e63` is a literal sRGB colour. `primitive.brand.maker-teal` aliases it.
2. **Semantic**: purpose and context, with explicit light/dark pairs. `semantic.color.accent` aliases the palette
   sample; `semantic.color.state-indicator` aliases `semantic.color.accent-ink`. Type is a DTCG composite referencing
   family, weight, size, tracking and line-height primitives. Identical theme values still have explicit pairs.
3. **Component**: named slots referencing semantic roles. `component.tabs.indicator` → state-indicator → accent-ink
   → primitive colour. Button, input, card, overlay and focus geometry reference the system scale. Aurora badge-card
   and box-open loader colours retain their local ownership and every existing value.

Primitive cannot reference semantic/component; semantic cannot reference component. All aliases must resolve,
preserve type and be acyclic in **both** modes. Forward aliases are validated after model creation; unknown names fail.
Global semantic roles are not component styling APIs. Local loader colours must never become a global UI palette.
Chart series1–5 retain order, bright fills and stable identity mapping; chart-danger is explicit negative data,
not a sixth category. Edge/casing plus shape/dash carries distinguishability. Aurora header is teal and therefore
needs on-accent for text, even though the card's main text is Deep Ink in light mode.

## Naming, types and export contract

Reserved DTCG roots: `primitive`, `semantic`, `component`. Reserved additive CSS prefix: `--sw-primitive-*`,
`--sw-semantic-*`, `--sw-component-*`. Legacy `--color-*`, `--chart-*`, `--brand-*`, `--font-*`, `--shadow-color`
and motion `--sw-dur-*` / `--sw-ease-*` / distance names keep their current formats. Do not overwrite them with hex.
Native identifiers use `sw_` and replace dots/hyphens with underscores. Schema/name and export checks reject drift.

The JSON exports follow [DTCG Format 2025.10](https://www.designtokens.org/tr/2025.10/format/) and
[Colour 2025.10](https://www.designtokens.org/tr/2025.10/color/): `$type`, `$value`, `$description`, `{path}` aliases,
sRGB colour objects, dimension/duration objects, cubicBezier arrays, typography and shadow composites.
`$extensions.org.spaceworks` contains usage, exclusions, legacy name, scope and override policy. Themes are separate
DTCG documents with **the same path inventory**, avoiding a proprietary `$value.light` format inside DTCG values.
The input schema is [schema.json](../scripts/tokens/schema.json); it is not misrepresented as a DTCG schema.

| Output | Import / runtime meaning |
|---|---|
| [portable.css](portable.css) | Imports the unchanged `tokens.css`, including its font registration. New colour variables are complete CSS colours, not RGB triplets. Root light; `html.dark` dark. |
| [dtcg/light.tokens.json](dtcg/light.tokens.json), [dark](dtcg/dark.tokens.json) | All tiers, typed values and aliases. Import with a DTCG-aware tool. |
| [tailwind.preset.cjs](tailwind.preset.cjs) | `presets: [require('./tokens/tailwind.preset.cjs')]` in a Tailwind config; Tailwind 4 can load that config with `@config`. Import portable.css once. Preset is not a content scanner/plugin. |
| [android/values/tokens.xml](android/values/tokens.xml), [values-night](android/values-night/tokens.xml) | Copy resource files to app `res/values` and `res/values-night`. DayNight resolves mode; colour/dimen/integer resources are native types. |
| [android/SpaceWorksTokens.kt](android/SpaceWorksTokens.kt) | `SpaceWorksTokens.Light` / `.Dark`, Compose `Color`, `Dp`, `TextUnit`, `CubicBezierEasing` and typed SwShadow/SwTypography. Requires Compose UI and animation-core. Host selects theme from `isSystemInDarkTheme()` or explicit preference. |
| [ios/SpaceWorksTokens.swift](ios/SpaceWorksTokens.swift) | SwiftUI `SpaceWorksTokens.Light` / `.Dark`; host selects from environment colorScheme or explicit preference. Duration is seconds. Shadow and type are typed value records. |
| [ios/SpaceWorks.xcassets](ios/SpaceWorks.xcassets/Contents.json) | Add the asset catalog to the target; each semantic/component colour has universal light + dark luminosity entries. `Color("sw_semantic_color_ink", bundle: …)` resolves appearance; supply the resource-owning bundle. |
| [usage.json](usage.json), [USAGE.md](USAGE.md) | Every semantic/component role with purpose, use/exclusion, both values, legacy/CSS path, alias, scope, contrast partner and deprecation=false. |
| [contrast-matrix.json](contrast-matrix.json), [Markdown](contrast-matrix.md) | Exhaustive diagnostic pair rows, replacements, required allowed pairs and scrim composites. Tests compare unrounded ratios. |
| [exports-manifest.json](exports-manifest.json) | SHA-256 inventory of all generated UTF-8/LF files. Validation permits only checkout CRLF/LF conversion. Do not edit artifacts or this manifest manually. |

## Units and native consumption

Web dimensions are px; typography in the Tailwind preset converts px to rem using the captured **16px reference**.
Line height is unitless; tracking becomes em in Tailwind and absolute dimension in DTCG/CSS. The typography shorthand
is a CSS `font` value; apply `*-letter-spacing` separately (it is not part of the CSS font shorthand). Per-field
`*-font-family`, `*-font-size`, `*-font-weight`, `*-line-height` variables are also exported, including component types.

Android uses 1 design px → 1dp for geometry, 1sp for font sizes/line height/tracking. Primitive type-size resources
are sp; composite typography applies sp to all text metrics. Numeric layer values map to Compose zIndex floats.
Duration is integer ms. Fractional opacity and cubicBezier/fontFamily/shadow/typography values in XML are quoted,
nontranslated strings containing DTCG-compatible resolved JSON: use Compose records for direct typed consumption.
Do not feed a multi-layer CSS shadow into Android elevation: implement the provided shadow layers if exact visual
matching is required. Colour resources use #AARRGGBB; all standalone colours are opaque. Shadow alpha stays exact
in composite JSON and uses float Color constructors in Compose.

iOS uses design px → points for geometry; type records are reference point sizes. Host registration must map the
family/weight to the actual installed font face, use `Font.custom(..., relativeTo:)` / UIFontMetrics / @ScaledMetric,
and scale line height and tracking with the text. Do not freeze Dynamic Type with fixed frames. `SwCubicBezier`
maps to `Animation.timingCurve`; durations are seconds. `SwShadow` preserves blur/spread/offset rather than claiming
SwiftUI `.shadow(radius:)` is a pixel-identical CSS box-shadow implementation. Select theme records explicitly or use
dynamic asset colours. Native font files/registration, safe areas, control semantics and accessibility are host work.
Neither a native SDK build nor assistive-technology testing is implied by Node export validation.

For motion, web inherits reduced-motion and kiosk/TV values from legacy variables; the additive durations also zero
under `prefers-reduced-motion`. Native hosts set all durations to zero for reduce-motion, zero translations and set
pop-scale to one; retain visible content and announcements. Kiosk/TV keep fades with zero movement. `slide-x` is a
fraction (1 = 100% of the moving element), not a 1dp distance. Native hosts calculate it from measured bounds.

## Tenant and owner overrides

Only the **brand** family can be tenant-overridden, only in public/stranger-facing contexts. `primary_color` seeds
brand fill; optional `accent_color` seeds brand-ink. Override **together, for each mode**: brand, brand-hover,
brand-active, on-brand, brand-soft, brand-ink, brand-boundary. Do not override accent, focus, emphasis, statuses,
neutral surfaces/text or sidebar; staff screens remain the Space Works system palette. Geometry and typography
are not tenant branding. The owner (not a tenant) can switch control radius from10 to9999 using
`--sw-semantic-radius-control`; place overrides after portable.css at root or on a local `data-sw-tenant` element
where component aliases are rebound.

Legacy web overrides are space-separated RGB triplets on an element carrying `data-sw-tenant`. The portable CSS
rebinds semantic/component aliases on that same element in both root themes, avoiding inherited custom-property
aliases being resolved against a parent's brand. Keep the seven computed brand variables together. For DTCG/native,
derive both tenant records and re-resolve the same aliases instead of changing one already-resolved native constant.
No unchecked tenant colour should reach a required foreground/background pair.

Tenant derivation follows UI brand spec H.5: label candidates Deep Ink, Warm Cream, white, then black (tenant-only
functional fallback); hover/active move away from label; soft is strongest mix up to12% over panel preserving fixed
text ≥4.55; link ink mixes toward Ink/light or Cream/dark until ≥4.5 on the ten permitted grounds. Required checks:
on-brand on brand/default/hover/active; brand-ink on bg/surface/panel/hover/brand-soft and the five existing soft fills;
ink, muted and five fixed inks on brand-soft; brand-boundary ≥3 against its permitted adjacent grounds. The default
matrix certifies the shipped palette only; tenant overrides must run the same calculations on their actual values.

Copy [tenant.default.json](tenant.default.json), replace the seven brand-family values in **both** modes after
derivation, then run `node scripts/tokens/validate.mjs --tenant path/to/paired-brand.json`. This checks the 50
required tenant pairings across ten grounds and forbids fixed-role overrides. It validates computed colours;
it does not implement the app's seed-to-palette derivation, tenant scoping or account configuration for a host.

## Contrast and focus policy

Fill, on-fill, text ink and boundary are distinct roles. A passing filled button label does not prove a thin selected
mark has enough contrast. Use [the generated matrix](contrast-matrix.md), including default/hover/pressed/selected,
sidebar, soft grounds and component aliases. Normal text ≥4.5; large text and necessary icons/boundaries/state/focus
≥3. The matrix documents every failing diagnostic pairing without changing the original token. Recommendations are
recomputed on each exact ground. Quiet dividers and disabled controls have exemptions, not a blanket PASS label.
Focus on a filled control requires an external gap exposing the neutral surroundings, sufficient visible area,
no clipping, focus-visible behaviour and forced-colours support in the host control. The token matrix does not
measure focus appearance area, obscuration, full rendered pixels or forced-colour behaviour.

> **Current rule (v2.1.0, 2026-11-13; DSA-014):** Legacy outline on light hover fails 3:1. Dark accent/default,
> hover and active fills fail as essential thin marks on some panel/hover grounds. Keep those values and select
> `boundary-strong` (light muted / dark outline), `state-indicator` (accent-ink), or tenant brand-boundary instead,
> subject to the exact pairing in the matrix. `line` and `danger-line` remain decorative. This note adds a restriction
> to the historical control/underline guidance; batch 1A owns corresponding notes beside original spec statements.

## Generate, validate and extend

```sh
node scripts/tokens/generate.mjs
node scripts/tokens/validate.mjs
node --test scripts/tokens/contract.test.mjs
node scripts/check-previews.mjs
node site/scripts/check-tokens.mjs
```

Node built-ins only; no package install, network access, external app checkout or native SDK required. The generator
writes **only** its owned artifacts beneath tokens/. Validator is read only: validates source schema, descriptions,
types, theme pairs, alias targets/types/cycles/tier direction, frozen legacy bytes (apart from checkout line endings), all exports and both directions of
generated inventory, plus required contrast pairs and replacement ratios. A new/missing/stale native asset fails.
`legacy-lock.json` records the pre-batch bytes of tokens.json/tokens.css. The generator never refreshes that baseline.

Add a semantic/component alias in contract.json; use a paired alias or a common `ref`. Add scale entries there;
do not edit generated values. New token kinds need typed model validation and every export mapping before release.
Run generation, validation and failure-path tests; review the matrix and usage reference. Large generated files are
data artifacts; generator modules stay small. Do not regenerate motion previews in a token-only batch: the preview
check can fail for other lanes' motion work, which the integration owner regenerates once. Site wiring is recorded
in [BATCH-3-HANDOFF.md](BATCH-3-HANDOFF.md), not implemented by this batch.
