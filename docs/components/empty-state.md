---
title: EmptyState
description: Explain why expected content is absent and point to the next useful step.
---

# EmptyState

## 1. Title and support strip

Explain why expected content is absent and point to the next useful step. Stable ID: `SWC-empty-state`; source IDs: P17, S2, S5, L3, B. Maturity: **proposed**; availability: **documented reference**, not a published component package. Owner: Space Works design-system owner, Shaan Shoukath; product maintainers own app integration. Documentation introduced/updated for **v2.1.0, planned** under decision 397. Last source verification: **2026-11-13**. Web implementation is described below; Compose/SwiftUI are starter mappings with **no verified component parity**.

## 2. Use it for / choose something else

Use only after a successful load with no records, or no filtered matches. Use Loader for unresolved data and inline error/Retry for failure. Do not disguise a permission denial or offline fetch as an empty list.

**Extracted source contract:** [P17 — P17. Empty states (R4, R6, R3 preview)](../ux-spec.md#p17-empty-states-r4-r6-r3-preview) · [S2 — S2. Requests list (`requests`) ← R2 (tabs + rows) + R8 (inline actions)](../ux-spec.md#s2-requests-list-requests--r2-tabs--rows--r8-inline-actions) · [S5 — S5. Inventory list (`inventory`) ← R2 header/stat cards + adapted dense table (§5)](../ux-spec.md#s5-inventory-list-inventory--r2-headerstat-cards--adapted-dense-table-5) · [L3 — L3. `ListLayout` — header + callout + stats/tabs + filters + list/table + pagination (R2, R4)](../ux-spec.md#l3-listlayout--header--callout--statstabs--filters--listtable--pagination-r2-r4) · [B — B. Interaction states](../ui-brand-spec.md#b-interaction-states). The purpose, anatomy, variants and dimensions below condense those sections without moving their IDs or anchors. Source P rules describe observed reference boards; B/C and later decisions resolve brand adaptations.

> **Authority note (2026-11-13):** P entries retain observed reference-board measurements. Current B/D/E and decisions SW-299/SW-316 govern brand fills, free typography and geometry; do not copy reference black pills, shadows or legacy radii. Original source remains intact.

[Authority and implementation status](README.md#authority-and-implementation-status) gives precedence. [Source inventory](source-inventory.json) preserves headings, table cells, code and links for publication checks.

## 3. Live example and complete code

[Full-page runnable example](../../examples/web/component-gallery.html#empty-state): start `node examples/web/server.mjs` from the repository root, then open `http://localhost:4174/examples/web/component-gallery.html#empty-state`. Choose Light/Dark, preview width and an applicable state; exercise hover, pressed and focus-visible with real input. Complete source: [HTML](../../examples/web/component-gallery.html), [behaviour](../../examples/web/gallery.mjs), [styles](../../examples/web/styles.css). No app module, network API or build step is required. These are portable reference compositions, not replicas of app exports.

```html
<div class="empty"><p>No items match your filters. Clear filters above to see all inventory.</p><button type="button" data-clear-filters>Clear filters</button></div>
```

The linked shell supplies CSS/tokens and any `data-*` behaviour. Static text/native controls remain without JavaScript; modal content has an inline fallback. Copy the complete source for enhancements, not this fragment alone. [First-screen setup](../adoption/plain-html-css.md) shows the whole document.

## 4. Anatomy

Numbered reading-order diagram: `[1] → [2] → [3] → [4]`. Slots and name ownership:

1. Dashed noninteractive container.
2. One centred situation-and-next-step sentence (P17).
3. Existing visible control named in the sentence.
4. Optional action slot when a matching action is needed locally.

## 5. Variants

Current message+Action branch; legacy title/description/ReactNode-action branch. Truly empty versus filtered-empty versus a deliberately empty preview are different content cases. P17’s current recipe has no heading or illustration.

| Variant | Choose it for |
| --- | --- |
| Message + optional Action | Current P17 situation/next-step recipe. |
| Filtered-empty | Preserve query and offer Clear filters. |
| Legacy title branch | Observed compatibility API; differs from P17, not the preferred new recipe. |

Native products use platform controls with mapped roles/settings. A web keyboard model does not establish native parity. Gallery variants/states are reference compositions, not undocumented app props.

## 6. States

State handling belongs either to this primitive or the containing task explicitly named below. N/A records a semantic or API limitation, not an omitted requirement.

| State | Presentation / copy | Action, focus, announcement and data |
| --- | --- | --- |
| Default | One centred sentence naming the situation and next step. | Keep filter focus; current message branch is role=status. |
| Hover | N/A — this container/artwork is not interactive. | No hover-exclusive instructions; child controls retain their own contracts. |
| Pressed | N/A — this primitive has no activation. | Native click/release activates once; optional child actions use Button. |
| Focus-visible | N/A — content/artwork is not a Tab stop. | Keep focused actions visible above sticky chrome and the software keyboard. |
| Selected | N/A — this primitive is not a choice; IconButton can accept aria-pressed for a genuine toggle. | Caller controls selection; keep values stable through failed persistence. |
| Disabled | N/A — noninteractive information remains readable. | Use native disabled where supported; aria-disabled requires event guards. Consult §11 for unsupported props. |
| Read-only | N/A — no read-only component mode; noneditable information already reads as text. | No read-only API is claimed. For a locked choice, present a labelled static value; native checkbox/radio/select do not honour readOnly. |
| Loading / pending | N/A — unresolved, failed or offline fetches are not empty outcomes. | Use Loader or an explicit persistent error/offline block with Retry. |
| Empty | Successful zero records: No items yet. Use Add item above. | Only point to visible, permitted controls. |
| Filtered-empty | “No items match your filters. Clear filters above.” | Preserve query and scope, offer Clear filters and announce the result once. |
| Error / retry | N/A — unresolved, failed or offline fetches are not empty outcomes. | Use Loader or an explicit persistent error/offline block with Retry. |
| Offline | N/A — unresolved, failed or offline fetches are not empty outcomes. | Use Loader or an explicit persistent error/offline block with Retry. |
| Success | N/A — records replace the empty block. | Announce a changed result count once after a user action. |
| Interrupted work | Retain safe drafts/context and say whether completion is known or still unresolved. | Reconcile server/session state before repeating a mutation; never automatically replay irreversible work. |

## 7. Specifications and tokens

Actual min-h-32, dashed line border, rounded-2xl, p-6 and gap-3, 15 px muted sentence max-w-md. Brand geometry uses card radius 16 px; do not copy reference radius 12 in P17 as a universal token. Let text wrap at 320 px and 200% text.

Load [tokens CSS](../../tokens/tokens.css) once. Theme pairs: `bg/surface/panel` with `ink` or `muted`; fills use matching `on-*`; standalone links/essential accent marks use `accent-ink` or `brand-boundary`. `line` is decorative. No alpha text or opacity-based disabled state. `outline` on hover and raw dark `accent` on panel need special contrast care; use the tested functional boundary role. Geometry described here is a source contract, not a claim that new CSS variables exist. Wrap translation and enlarged text; use min-inline-size:0 and 320 CSS px reflow rather than clipping.

## 8. Interaction / accessibility

The explanatory block is not a Tab stop. Its optional action follows normal Button behaviour. When results become empty, retain filter focus and announce the change once; do not force focus onto the paragraph.

| Key / input | Behaviour |
| --- | --- |
| Tab to optional action | Container is not focusable; child action uses native Button keys. |

Test name/role/value and reading order with a screen reader. The name contains the visible label. Associate errors with unique description IDs and announce status once without moving focus. Test both themes, 400% zoom, forced colours and reduced motion. Use system colours/visible borders in forced colours; do not suppress adaptation by default. Keep focus clear of sticky chrome. The house target is 44 px; WCAG minimum is 24×24 CSS px with exceptions. Provide click/tap alternatives to dragging. Native integrations test TalkBack/VoiceOver, large type and platform focus. These are required checks, **not claims of completed AT tests**. [Accessibility](../accessibility.md) maps criteria, system contracts and product responsibilities.

## 9. Content

“No items yet. Use Add item above to start your inventory.” differs from “No items match your filters. Clear filters above.” Mention only controls actually visible and allowed. Avoid blame and decorative imagery.

Sentence case; translated labels and locale-aware plurals/numbers/dates/currency. Never expose raw error codes or invent a count. Money/evidence outcomes require actual confirmed completion and precise auditable consequences.

## 10. Do / don’t

| Do | Don’t / why |
| --- | --- |
| State the situation plus the next step, with permission-aware controls. | Do not show “No records” after a request failed or offer Create when the user lacks that capability. |
| Use semantic role tokens and complete visible copy. | Do not copy reference hex colours, alpha text or paid Gilroy weights: they bypass the current theme/type contract. |

## 11. Implementation

**Observed API:** `EmptyStateProps = {message:string,action?:Action} | {title:string,description?:string,action?:ReactNode}`. Presence of message chooses the current branch: paragraph role=status plus optional ActionControl. Legacy branch renders an h3 and description. No loading/error/offline props exist.

**App source, reference only:** [frontend/src/components/ui/EmptyState.tsx](https://github.com/SpaceWorks-Labs/SpaceWorks/blob/main/frontend/src/components/ui/EmptyState.tsx). Inspected in the supplied `int-stage-r2final` worktree; uncommitted content may differ from upstream main. [Implementation snapshot](implementation-snapshot.json) records exact file hashes. Neighbours: shared types, desk CSS and motion modules.

```tsx
<EmptyState message='No items match your filters. Clear filters above to see all inventory.'
  action={{ label: 'Clear filters', onClick: clearFilters }} />
```

The snippet assumes the source app’s imports/state handlers. It is **not a standalone install**. Observed app dependencies include React 19.2, React Router 7.18, Tailwind 4.3, Lingui 6.10.1 and local motion/session modules. The [separate React starter](../adoption/react-tailwind.md) avoids these app dependencies. Preserve controlled values separately from fetched data. Only validated public/member brand roles take tenant overrides; staff chrome remains Space Works.

**Known limitations:** Legacy callers, including DataTable, still use a heading branch that differs from P17. Current message branch uses role=status; products must avoid duplicate result announcements and ensure status is inserted after a relevant update. No empty illustration should be inferred from the app.

The standalone gallery uses local sample data/simulated outcomes. Without JS, ordinary content/controls and inline explanations remain; async/modal enhancements require JS. Native source is starter-only, not compiled here.

## 12. Related and maintenance

[Table](table.md) · [TextField and SearchField](text-field.md) · [Skeleton / Loader](skeleton-loader.md). [Named patterns/layouts](../patterns/README.md) retain P1–P30/L1–L10 and screen backlinks. [Fonts/licences](../../fonts/README.md), [portable logo master](../../brand/logo-masters.svg) and [design-resource availability](../adoption/README.md#design-and-asset-resources) connect the assets; no public editable library or native component download is asserted.

Evidence: source inspection/captured hashes, not an app/site AT certificate. History: first dedicated contract for planned v2.1.0; no API removal introduced here. [Release policy](../releases/versioning.md), [migrations](../releases/migration.md) and [contribution route](../contributing-design-system.md) govern maintenance.

