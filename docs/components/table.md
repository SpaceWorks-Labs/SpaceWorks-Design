---
title: Table
description: Compare structured records while retaining headers, sorting and selection context.
---

# Table

## 1. Title and support strip

Compare structured records while retaining headers, sorting and selection context. Stable ID: `SWC-table`; source IDs: P14, S5, S15, L3, B. Maturity: **proposed**; availability: **documented reference**, not a published component package. Owner: Space Works design-system owner, Shaan Shoukath; product maintainers own app integration. Documentation introduced/updated for **v2.1.0, planned** under decision 397. Last source verification: **2026-11-13**. Web implementation is described below; Compose/SwiftUI are starter mappings with **no verified component parity**.

## 2. Use it for / choose something else

Use DataTable for comparable rows/columns. Use ListRow/card patterns when a record’s primary action matters more than comparison. Keep dense operational adaptations from UX §5.1.

**Extracted source contract:** [P14 — P14. Tables inside a card (R4, R8, R10)](../ux-spec.md#p14-tables-inside-a-card-r4-r8-r10) · [S5 — S5. Inventory list (`inventory`) ← R2 header/stat cards + adapted dense table (§5)](../ux-spec.md#s5-inventory-list-inventory--r2-headerstat-cards--adapted-dense-table-5) · [S15 — S15. Audit log (`audit`) ← R1/R2 activity rail as a full list + P14](../ux-spec.md#s15-audit-log-audit--r1r2-activity-rail-as-a-full-list--p14) · [L3 — L3. `ListLayout` — header + callout + stats/tabs + filters + list/table + pagination (R2, R4)](../ux-spec.md#l3-listlayout--header--callout--statstabs--filters--listtable--pagination-r2-r4) · [B — B. Interaction states](../ui-brand-spec.md#b-interaction-states). The purpose, anatomy, variants and dimensions below condense those sections without moving their IDs or anchors. Source P rules describe observed reference boards; B/C and later decisions resolve brand adaptations.

> **Authority note (2026-11-13):** P entries retain observed reference-board measurements. Current B/D/E and decisions SW-299/SW-316 govern brand fills, free typography and geometry; do not copy reference black pills, shadows or legacy radii. Original source remains intact.

[Authority and implementation status](README.md#authority-and-implementation-status) gives precedence. [Source inventory](source-inventory.json) preserves headings, table cells, code and links for publication checks.

## 3. Live example and complete code

[Full-page runnable example](../../examples/web/component-gallery.html#table): start `node examples/web/server.mjs` from the repository root, then open `http://localhost:4174/examples/web/component-gallery.html#table`. Choose Light/Dark, preview width and an applicable state; exercise hover, pressed and focus-visible with real input. Complete source: [HTML](../../examples/web/component-gallery.html), [behaviour](../../examples/web/gallery.mjs), [styles](../../examples/web/styles.css). No app module, network API or build step is required. These are portable reference compositions, not replicas of app exports.

```html
<div class="table-scroll" role="region" aria-label="Inventory" tabindex="0"><table><caption>Inventory</caption><thead><tr><th scope="col">Item</th><th scope="col">Status</th></tr></thead><tbody><tr><td>Drill press</td><td>Available</td></tr></tbody></table></div>
```

The linked shell supplies CSS/tokens and any `data-*` behaviour. Static text/native controls remain without JavaScript; modal content has an inline fallback. Copy the complete source for enhancements, not this fragment alone. [First-screen setup](../adoption/plain-html-css.md) shows the whole document.

## 4. Anatomy

Numbered reading-order diagram: `[1] → [2] → [3] → [4] → [5]`. Slots and name ownership:

1. Labelled scroll region with a native semantic table.
2. Optional screen-reader caption and column headers.
3. Optional select-all checkbox and row checkboxes.
4. Cell content with explicit phone roles.
5. Optional sort buttons plus separate Pagination/status region.

## 5. Variants

Comfortable or compact density through listState. Local sort or controlled ordering. Optional controlled selection. Phone roles lead/title/status/detail/hidden; actions placed last. Loading and EmptyState branches are built in; error/offline are product compositions.

| Variant | Choose it for |
| --- | --- |
| Comfortable / compact | Density set through listState; targets remain large. |
| Local / controlled order | Local comparator / server-ordered supplied rows. |
| Selectable | Controlled row IDs and visible-row select-all. |
| Phone roles | Stacked record layout retaining essential data and table semantics. |

Native products use platform controls with mapped roles/settings. A web keyboard model does not establish native parity. Gallery variants/states are reference compositions, not undocumented app props.

## 6. States

State handling belongs either to this primitive or the containing task explicitly named below. N/A records a semantic or API limitation, not an omitted requirement.

| State | Presentation / copy | Action, focus, announcement and data |
| --- | --- | --- |
| Default | Required visible name, correct role and truthful current value/context. | Enabled actions follow §8; no automatic announcement for static content. |
| Hover | Use B hover roles without hiding the label or necessary boundary. | No hover-exclusive instructions; child controls retain their own contracts. |
| Pressed | Use B active colours during activation; do not mutate on pointer-down. | Native click/release activates once; optional child actions use Button. |
| Focus-visible | Visible 2 px ring plus offset; ≥3:1 against actual adjacent colour. | Keep focused actions visible above sticky chrome and the software keyboard. |
| Selected | Checked/current semantics and a non-colour selection mark. | Caller controls selection; keep values stable through failed persistence. |
| Disabled | Explicit surface/muted/line colours and an understandable prerequisite. | Use native disabled where supported; aria-disabled requires event guards. Consult §11 for unsupported props. |
| Read-only | N/A — no read-only component mode; noneditable information already reads as text. | No read-only API is claimed. For a locked choice, present a labelled static value; native checkbox/radio/select do not honour readOnly. |
| Loading / pending | Keep context; use task-specific pending copy such as “Saving…”. | Disable only the mutation in progress, announce once and preserve drafts. Fetch state is product-owned unless §11 says otherwise. |
| Empty | Show absence only after a successful load, with a useful next step. | Never confuse no records with pending, denied access or failure. |
| Filtered-empty | “No items match your filters. Clear filters above.” | Preserve query and scope, offer Clear filters and announce the result once. |
| Error / retry | “Couldn’t save/load. Try again.” plus persistent explanation and specific recovery. | Keep the user’s value/context, relate field errors by ID and retry only the failed operation. |
| Offline | Keep clearly labelled last-known values and unsent drafts; explain network-only limitations. | Local navigation/editing/Close can remain available. Product owns safe retry/idempotency; queued is not completed. |
| Success | Show the completed effect and truthful updated value; use precise confirmation. | Announce once without taking focus; visible in-place changes need no redundant toast or invented success prop. |
| Interrupted work | Retain safe drafts/context and say whether completion is known or still unresolved. | Reconcile server/session state before repeating a mutation; never automatically replay irreversible work. |

## 7. Specifications and tokens

Desktop/tablet table minimum 640 px inside a keyboard-focusable horizontal region. Below md, rows become stacked cards with generated visual detail labels and retained table roles. No page overflow; never hide an essential field via phone='hidden'. Header sort/select controls retain 44 px targets even in compact mode.

Load [tokens CSS](../../tokens/tokens.css) once. Theme pairs: `bg/surface/panel` with `ink` or `muted`; fills use matching `on-*`; standalone links/essential accent marks use `accent-ink` or `brand-boundary`. `line` is decorative. No alpha text or opacity-based disabled state. `outline` on hover and raw dark `accent` on panel need special contrast care; use the tested functional boundary role. Geometry described here is a source contract, not a claim that new CSS variables exist. Wrap translation and enlarged text; use min-inline-size:0 and 320 CSS px reflow rather than clipping.

## 8. Interaction / accessibility

Tab visits the scroll region and interactive header/cell controls; arrows scroll the region where supported. Sort uses native button Enter/Space; selection uses native checkbox Space. This is a table, not an ARIA grid: no invented arrow-cell model. Screen-reader table navigation must still associate headers after mobile reflow.

| Key / input | Behaviour |
| --- | --- |
| Tab / Enter / Space | Visit region/control; activate sort/action or toggle row checkbox. |
| SR table navigation | Read headers and cells; no invented ARIA-grid arrow model. |

Test name/role/value and reading order with a screen reader. The name contains the visible label. Associate errors with unique description IDs and announce status once without moving focus. Test both themes, 400% zoom, forced colours and reduced motion. Use system colours/visible borders in forced colours; do not suppress adaptation by default. Keep focus clear of sticky chrome. The house target is 44 px; WCAG minimum is 24×24 CSS px with exceptions. Provide click/tap alternatives to dragging. Native integrations test TalkBack/VoiceOver, large type and platform focus. These are required checks, **not claims of completed AT tests**. [Accessibility](../accessibility.md) maps criteria, system contracts and product responsibilities.

## 9. Content

Sentence-case column names, units/currency in context, zero as 0 and unknown as a distinct state. “1–24 of 248” is pagination context. Empty and filtered-empty have different copy and recovery. Identify row checkbox names with meaningful object context where numeric IDs are insufficient.

Sentence case; translated labels and locale-aware plurals/numbers/dates/currency. Never expose raw error codes or invent a count. Money/evidence outcomes require actual confirmed completion and precise auditable consequences.

## 10. Do / don’t

| Do | Don’t / why |
| --- | --- |
| Pass caption, stable IDs and a usable phone role for every essential column. | Do not treat supplied ordering as a request for DataTable to sort fetched data or claim selection reaches unseen rows automatically. |
| Use semantic role tokens and complete visible copy. | Do not copy reference hex colours, alpha text or paid Gilroy weights: they bypass the current theme/type contract. |

## 11. Implementation

**Observed API:** `DataTable<T>`: columns[{key,header,render?,sortable?,className?,phone?}], data, getRowId?, selectedIds?, onSelectionChange?, loading?, emptyTitle?, emptyDescription?, emptyAction?, skeletonCols? (compatibility only), ordering?, onOrderingChange?, listState?, caption?. Default row ID is row.id. Passing ordering disables local sort; caller supplies correctly ordered fetched rows.

**App source, reference only:** [frontend/src/components/ui/DataTable.tsx](https://github.com/SpaceWorks-Labs/SpaceWorks/blob/main/frontend/src/components/ui/DataTable.tsx). Inspected in the supplied `int-stage-r2final` worktree; uncommitted content may differ from upstream main. [Implementation snapshot](implementation-snapshot.json) records exact file hashes. Neighbours: ListColumns.tsx, types.ts.

```tsx
<DataTable caption='Inventory' columns={[{ key: 'name', header: 'Item', sortable: true },
  { key: 'status', header: 'Status' }]} data={[{ id: 1, name: 'Drill press', status: 'Available' }]} />
```

The snippet assumes the source app’s imports/state handlers. It is **not a standalone install**. Observed app dependencies include React 19.2, React Router 7.18, Tailwind 4.3, Lingui 6.10.1 and local motion/session modules. The [separate React starter](../adoption/react-tailwind.md) avoids these app dependencies. Preserve controlled values separately from fetched data. Only validated public/member brand roles take tenant overrides; staff chrome remains Space Works.

**Known limitations:** Current loading branch renders LogoLoader, although P14/quality bar describes final-geometry skeletons. Empty branch uses legacy titled EmptyState; P17 calls for one sentence. Preserve these as observed differences rather than asserting the app is compliant. Errors, offline, total count and caption remain caller responsibilities.

The standalone gallery uses local sample data/simulated outcomes. Without JS, ordinary content/controls and inline explanations remain; async/modal enhancements require JS. Native source is starter-only, not compiled here.

## 12. Related and maintenance

[Pagination](pagination.md) · [Checkbox](checkbox.md) · [EmptyState](empty-state.md) · [StatusPill](status-pill.md) · [Skeleton / Loader](skeleton-loader.md). [Named patterns/layouts](../patterns/README.md) retain P1–P30/L1–L10 and screen backlinks. [Fonts/licences](../../fonts/README.md), [portable logo master](../../brand/logo-masters.svg) and [design-resource availability](../adoption/README.md#design-and-asset-resources) connect the assets; no public editable library or native component download is asserted.

Evidence: source inspection/captured hashes, not an app/site AT certificate. History: first dedicated contract for planned v2.1.0; no API removal introduced here. [Release policy](../releases/versioning.md), [migrations](../releases/migration.md) and [contribution route](../contributing-design-system.md) govern maintenance.

