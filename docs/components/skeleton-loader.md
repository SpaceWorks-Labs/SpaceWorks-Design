---
title: Skeleton / Loader
description: Show that requested content is pending without inventing data or completion.
---

# Skeleton / Loader

## 1. Title and support strip

Show that requested content is pending without inventing data or completion. Stable ID: `SWC-skeleton-loader`; source IDs: P14, P17, S5, L3, B. Maturity: **proposed**; availability: **documented reference**, not a published component package. Owner: Space Works design-system owner, Shaan Shoukath; product maintainers own app integration. Documentation introduced/updated for **v2.1.0, planned** under decision 397. Last source verification: **2026-11-13**. Web implementation is described below; Compose/SwiftUI are starter mappings with **no verified component parity**.

## 2. Use it for / choose something else

Use a layout-preserving placeholder for an initial result load and a named inline loader for a pending action. Use a determinate ProgressBar only when an actual fraction is known. EmptyState is for a completed empty result.

**Extracted source contract:** [P14 — P14. Tables inside a card (R4, R8, R10)](../ux-spec.md#p14-tables-inside-a-card-r4-r8-r10) · [P17 — P17. Empty states (R4, R6, R3 preview)](../ux-spec.md#p17-empty-states-r4-r6-r3-preview) · [S5 — S5. Inventory list (`inventory`) ← R2 header/stat cards + adapted dense table (§5)](../ux-spec.md#s5-inventory-list-inventory--r2-headerstat-cards--adapted-dense-table-5) · [L3 — L3. `ListLayout` — header + callout + stats/tabs + filters + list/table + pagination (R2, R4)](../ux-spec.md#l3-listlayout--header--callout--statstabs--filters--listtable--pagination-r2-r4) · [B — B. Interaction states](../ui-brand-spec.md#b-interaction-states). The purpose, anatomy, variants and dimensions below condense those sections without moving their IDs or anchors. Source P rules describe observed reference boards; B/C and later decisions resolve brand adaptations.

[Authority and implementation status](README.md#authority-and-implementation-status) gives precedence. [Source inventory](source-inventory.json) preserves headings, table cells, code and links for publication checks.

## 3. Live example and complete code

[Full-page runnable example](../../examples/web/component-gallery.html#skeleton-loader): start `node examples/web/server.mjs` from the repository root, then open `http://localhost:4174/examples/web/component-gallery.html#skeleton-loader`. Choose Light/Dark, preview width and an applicable state; exercise hover, pressed and focus-visible with real input. Complete source: [HTML](../../examples/web/component-gallery.html), [behaviour](../../examples/web/gallery.mjs), [styles](../../examples/web/styles.css). No app module, network API or build step is required. These are portable reference compositions, not replicas of app exports.

```html
<section aria-label="Inventory loading" aria-busy="true"><p role="status">Loading inventory…</p><div class="placeholder" aria-hidden="true"></div><label for="upload-progress">Uploading evidence</label><progress id="upload-progress" max="100" value="40">40%</progress></section>
```

The linked shell supplies CSS/tokens and any `data-*` behaviour. Static text/native controls remain without JavaScript; modal content has an inline fallback. Copy the complete source for enhancements, not this fragment alone. [First-screen setup](../adoption/plain-html-css.md) shows the whole document.

## 4. Anatomy

Numbered reading-order diagram: `[1] → [2] → [3] → [4]`. Slots and name ownership:

1. Busy region: product owns aria-busy.
2. One named status: Loading inventory… rather than repeated per row.
3. Decorative box artwork: hidden from assistive technology.
4. Optional real progress value and label, or a static final-geometry placeholder.

## 5. Variants

Skeleton({className}) decorative box; SkeletonRows({rows=5,cols}) table rows; Spinner({label?,size=24}) delegates to BoxSpinner. BoxSpinner({label?,size=20,className?,mono=false}) named status. ProgressBar({value,label,tone?}) clamps a finite fraction to 0–100 percent. These are separate APIs.

| Variant | Choose it for |
| --- | --- |
| Decorative Skeleton/Rows | Caller owns the single status and busy region. |
| Spinner / BoxSpinner | Named inline task loading, static logo under reduced motion. |
| Determinate ProgressBar | Known finite fraction and label. |
| Indeterminate composition | Unknown progress: named status or native progress without value. |

Native products use platform controls with mapped roles/settings. A web keyboard model does not establish native parity. Gallery variants/states are reference compositions, not undocumented app props.

## 6. States

State handling belongs either to this primitive or the containing task explicitly named below. N/A records a semantic or API limitation, not an omitted requirement.

| State | Presentation / copy | Action, focus, announcement and data |
| --- | --- | --- |
| Default | Decorative still placeholder plus one named loading status. | Product exposes aria-busy on the affected region. |
| Hover | N/A — this container/artwork is not interactive. | No hover-exclusive instructions; child controls retain their own contracts. |
| Pressed | N/A — this primitive has no activation. | Native click/release activates once; optional child actions use Button. |
| Focus-visible | N/A — content/artwork is not a Tab stop. | Keep focused actions visible above sticky chrome and the software keyboard. |
| Selected | N/A — this primitive is not a choice; IconButton can accept aria-pressed for a genuine toggle. | Caller controls selection; keep values stable through failed persistence. |
| Disabled | N/A — noninteractive information remains readable. | Use native disabled where supported; aria-disabled requires event guards. Consult §11 for unsupported props. |
| Read-only | N/A — no read-only component mode; noneditable information already reads as text. | No read-only API is claimed. For a locked choice, present a labelled static value; native checkbox/radio/select do not honour readOnly. |
| Loading / pending | Unknown: named status/indeterminate progress. Known: labelled finite fraction. | Update visible/semantic progress together; hide repeated artwork from AT. |
| Empty | N/A — pending is not a completed empty result. | Replace with EmptyState on successful zero results. |
| Filtered-empty | N/A while a result is unresolved. | Show filtered-empty only after successful completion. |
| Error / retry | Stop loader; explain failure and offer Retry. | Clear busy state and preserve previous content/draft. |
| Offline | Keep clearly labelled last-known values and unsent drafts; explain network-only limitations. | Local navigation/editing/Close can remain available. Product owns safe retry/idempotency; queued is not completed. |
| Success | Replace placeholder with content; clear aria-busy. | Announce meaningful completion once, never every animation frame. |
| Interrupted work | Retain safe drafts/context and say whether completion is known or still unresolved. | Reconcile server/session state before repeating a mutation; never automatically replay irreversible work. |

## 7. Specifications and tokens

Artwork is generally 16–24 px inline; loader size/space follows the occupied region. Motion durations/distances come from shipped tokens; reduced motion is a still open logo. Real ProgressBar is h-1 with line track; ensure necessary fill/track boundaries pass for actual tone and background. Reserve space to avoid layout shift.

Load [tokens CSS](../../tokens/tokens.css) once. Theme pairs: `bg/surface/panel` with `ink` or `muted`; fills use matching `on-*`; standalone links/essential accent marks use `accent-ink` or `brand-boundary`. `line` is decorative. No alpha text or opacity-based disabled state. `outline` on hover and raw dark `accent` on panel need special contrast care; use the tested functional boundary role. Geometry described here is a source contract, not a claim that new CSS variables exist. Wrap translation and enlarged text; use min-inline-size:0 and 320 CSS px reflow rather than clipping.

## 8. Interaction / accessibility

Decorative loader and progress are not Tab stops. Preserve existing focus during refresh. Completion clears aria-busy and announces a meaningful outcome once; error replaces the pending message with a persistent explanation and Retry. Never loop forever without a recovery path.

| Key / input | Behaviour |
| --- | --- |
| Reading order | Decorative/progress content is not a Tab stop; no activation. |
| Retry child | On failure offer ordinary native button keyboard behaviour. |

Test name/role/value and reading order with a screen reader. The name contains the visible label. Associate errors with unique description IDs and announce status once without moving focus. Test both themes, 400% zoom, forced colours and reduced motion. Use system colours/visible borders in forced colours; do not suppress adaptation by default. Keep focus clear of sticky chrome. The house target is 44 px; WCAG minimum is 24×24 CSS px with exceptions. Provide click/tap alternatives to dragging. Native integrations test TalkBack/VoiceOver, large type and platform focus. These are required checks, **not claims of completed AT tests**. [Accessibility](../accessibility.md) maps criteria, system contracts and product responsibilities.

## 9. Content

Use task-specific “Loading inventory…” or “Uploading 2 of 5 files…”. For unknown progress omit the number. On interruption say whether the upload was saved or must be retried; do not announce every animation frame.

Sentence case; translated labels and locale-aware plurals/numbers/dates/currency. Never expose raw error codes or invent a count. Money/evidence outcomes require actual confirmed completion and precise auditable consequences.

## 10. Do / don’t

| Do | Don’t / why |
| --- | --- |
| Keep one loading status, hide repeated artwork and use a real fraction for determinate progress. | Do not expose decorative skeleton rows as loaded records or use an unlabeled progressbar. |
| Use semantic role tokens and complete visible copy. | Do not copy reference hex colours, alpha text or paid Gilroy weights: they bypass the current theme/type contract. |

## 11. Implementation

**Observed API:** Skeleton and SkeletonRows are aria-hidden artwork wrappers/cells; callers supply the single loading announcement. ProgressBar requires a value fraction and label; no indeterminate flag exists. Use native progress without value or a named status for unknown progress. Do not pass fabricated percentages.

**App source, reference only:** [frontend/src/components/ui/Skeleton.tsx](https://github.com/SpaceWorks-Labs/SpaceWorks/blob/main/frontend/src/components/ui/Skeleton.tsx). Inspected in the supplied `int-stage-r2final` worktree; uncommitted content may differ from upstream main. [Implementation snapshot](implementation-snapshot.json) records exact file hashes. Neighbours: Spinner.tsx, ProgressBar.tsx, ../BoxSpinner.tsx.

```tsx
<section aria-busy={loading} aria-label='Inventory'>
  {loading ? <><p role='status'>Loading inventory…</p><Skeleton className='min-h-32' /></> : content}
</section>
<ProgressBar value={completed / total} label='Uploading evidence' />
```

The snippet assumes the source app’s imports/state handlers. It is **not a standalone install**. Observed app dependencies include React 19.2, React Router 7.18, Tailwind 4.3, Lingui 6.10.1 and local motion/session modules. The [separate React starter](../adoption/react-tailwind.md) avoids these app dependencies. Preserve controlled values separately from fetched data. Only validated public/member brand roles take tenant overrides; staff chrome remains Space Works.

**Known limitations:** Despite its name Skeleton renders a box, not final-geometry bars; DataTable renders LogoLoader. The quality bar’s final-geometry guidance remains normative. Static placeholders in the starter are reference compositions, not claimed existing app exports. Dynamic progress contrast still requires validation.

The standalone gallery uses local sample data/simulated outcomes. Without JS, ordinary content/controls and inline explanations remain; async/modal enhancements require JS. Native source is starter-only, not compiled here.

## 12. Related and maintenance

[EmptyState](empty-state.md) · [Table](table.md) · [Button](button.md). [Named patterns/layouts](../patterns/README.md) retain P1–P30/L1–L10 and screen backlinks. [Fonts/licences](../../fonts/README.md), [portable logo master](../../brand/logo-masters.svg) and [design-resource availability](../adoption/README.md#design-and-asset-resources) connect the assets; no public editable library or native component download is asserted.

Evidence: source inspection/captured hashes, not an app/site AT certificate. History: first dedicated contract for planned v2.1.0; no API removal introduced here. [Release policy](../releases/versioning.md), [migrations](../releases/migration.md) and [contribution route](../contributing-design-system.md) govern maintenance.

