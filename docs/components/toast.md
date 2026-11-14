---
title: Toast
description: Confirm an off-screen effect or offer compensation for a reversible change.
---

# Toast

## 1. Title and support strip

Confirm an off-screen effect or offer compensation for a reversible change. Stable ID: `SWC-toast`; source IDs: P30, S5, L3, B. Maturity: **proposed**; availability: **documented reference**, not a published component package. Owner: Space Works design-system owner (SpaceWorks Labs); product maintainers own app integration. Documentation introduced/updated for **v2.1.0, planned** under decision 397. Last source verification: **2026-11-13**. Web implementation is described below; Compose/SwiftUI are starter mappings with **no verified component parity**.

## 2. Use it for / choose something else

Use when an effect is off-screen or a row leaves view. Confirm in place when the result remains visible. Never offer Undo for evidence, handovers, audit, payments or settlements; use an explicit consequential confirmation when required.

**Extracted source contract:** [P30 — P30. Undo and confirmation behaviour (R8, R28)](../ux-spec.md#p30-undo-and-confirmation-behaviour-r8-r28) · [S5 — S5. Inventory list (`inventory`) ← R2 header/stat cards + adapted dense table (§5)](../ux-spec.md#s5-inventory-list-inventory--r2-headerstat-cards--adapted-dense-table-5) · [L3 — L3. `ListLayout` — header + callout + stats/tabs + filters + list/table + pagination (R2, R4)](../ux-spec.md#l3-listlayout--header--callout--statstabs--filters--listtable--pagination-r2-r4) · [B — B. Interaction states](../ui-brand-spec.md#b-interaction-states). The purpose, anatomy, variants and dimensions below condense those sections without moving their IDs or anchors. Source P rules describe observed reference boards; B/C and later decisions resolve brand adaptations.

[Authority and implementation status](README.md#authority-and-implementation-status) gives precedence. [Source inventory](source-inventory.json) preserves headings, table cells, code and links for publication checks.

## 3. Live example and complete code

[Full-page runnable example](../../examples/web/component-gallery.html#toast): start `node examples/web/server.mjs` from the repository root, then open `http://localhost:4174/examples/web/component-gallery.html#toast`. Choose Light/Dark, preview width and an applicable state; exercise hover, pressed and focus-visible with real input. Complete source: [HTML](../../examples/web/component-gallery.html), [behaviour](../../examples/web/gallery.mjs), [styles](../../examples/web/styles.css). No app module, network API or build step is required. These are portable reference compositions, not replicas of app exports.

```html
<button type="button" data-toast>Archive sample item</button><aside class="toast-list" aria-label="Notifications"></aside>
```

The linked shell supplies CSS/tokens and any `data-*` behaviour. Static text/native controls remain without JavaScript; modal content has an inline fallback. Copy the complete source for enhancements, not this fragment alone. [First-screen setup](../adoption/plain-html-css.md) shows the whole document.

## 4. Anatomy

Numbered reading-order diagram: `[1] → [2] → [3] → [4]`. Slots and name ownership:

1. One ToastHost mounted for the session.
2. Visible message with optional action, Undo and Dismiss.
3. Separate polite status and assertive error announcement nodes.
4. Session-scoped store with timers and awaited compensation.

## 5. Variants

Store tones success (default), error and info; optional action or async undo/undoKey. Non-error default duration is 8000 ms; errors persist. Busy Undo disables its own controls and changes the label to Undoing…. No arbitrary children API.

| Variant | Choose it for |
| --- | --- |
| Success / info | Confirmed off-screen or row-leaving effect; non-error default 8 seconds. |
| Error | Persistent failure with accurate recovery. |
| Awaited Undo | Reversible compensation only; no money/evidence/handover Undo. |

Native products use platform controls with mapped roles/settings. A web keyboard model does not establish native parity. Gallery variants/states are reference compositions, not undocumented app props.

## 6. States

State handling belongs either to this primitive or the containing task explicitly named below. N/A records a semantic or API limitation, not an omitted requirement.

| State | Presentation / copy | Action, focus, announcement and data |
| --- | --- | --- |
| Default | Required visible name, correct role and truthful current value/context. | Enabled actions follow §8; no automatic announcement for static content. |
| Hover | Use B hover roles without hiding the label or necessary boundary. | No hover-exclusive instructions; child controls retain their own contracts. |
| Pressed | Use B active colours during activation; do not mutate on pointer-down. | Native click/release activates once; optional child actions use Button. |
| Focus-visible | Visible 2 px ring plus offset; ≥3:1 against actual adjacent colour. | Keep focused actions visible above sticky chrome and the software keyboard. |
| Selected | N/A — this primitive is not a choice; IconButton can accept aria-pressed for a genuine toggle. | Caller controls selection; keep values stable through failed persistence. |
| Disabled | Explicit surface/muted/line colours and an understandable prerequisite. | Use native disabled where supported; aria-disabled requires event guards. Consult §11 for unsupported props. |
| Read-only | N/A — no read-only component mode; noneditable information already reads as text. | No read-only API is claimed. For a locked choice, present a labelled static value; native checkbox/radio/select do not honour readOnly. |
| Loading / pending | Awaited Undo displays Undoing… and disables this toast’s controls. | Cancel expiry; retain focus until compensation settles. |
| Empty | No live messages: render no visible rows. | Keep host announcement nodes available. |
| Filtered-empty | N/A — this primitive does not filter results; the affected result region owns this state. | Preserve query and scope, offer Clear filters and announce the result once. |
| Error / retry | Error tone persists until dismissal or resolution; failed Undo becomes an error. | Offer an accurate recovery action, not a misleading remaining Undo. |
| Offline | Keep clearly labelled last-known values and unsent drafts; explain network-only limitations. | Local navigation/editing/Close can remain available. Product owns safe retry/idempotency; queued is not completed. |
| Success | Non-error default is 8000 ms. | Pause expiry on hover/focus/action and never remove a focused control. Source lacks this safeguard; standalone gallery demonstrates it. |
| Interrupted work | Session reset clears rows/timers and invalidates old compensation. | Do not publish an old session result into a new session. |

## 7. Specifications and tokens

P30 specifies bottom-centre mobile/bottom-left main desktop; observed ToastHost is right-aligned, safe-area-aware, bottom 6rem and max width min(24rem,100vw−2rem), max-height 60dvh. This discrepancy is recorded, not silently normalized. Keep toast content out of focused controls’ way.

Load [tokens CSS](../../tokens/tokens.css) once. Theme pairs: `bg/surface/panel` with `ink` or `muted`; fills use matching `on-*`; standalone links/essential accent marks use `accent-ink` or `brand-boundary`. `line` is decorative. No alpha text or opacity-based disabled state. `outline` on hover and raw dark `accent` on panel need special contrast care; use the tested functional boundary role. Geometry described here is a source contract, not a claim that new CSS variables exist. Wrap translation and enlarged text; use min-inline-size:0 and 320 CSS px reflow rather than clipping.

## 8. Interaction / accessibility

Toasts never take focus merely by appearing. Actions/Dismiss are ordinary buttons in Tab order. Await Undo; failed compensation becomes a persistent error. A timed toast must not remove a focused action; pause expiry on hover/focus and during a pending action, and restore a meaningful focus target after explicit dismissal.

| Key / input | Behaviour |
| --- | --- |
| Tab / Enter / Space | Visit/activate actions; never steal focus on arrival. |
| Expiry / dismissal | Pause while focused; return to surviving task control if a focused toast is removed. |

Test name/role/value and reading order with a screen reader. The name contains the visible label. Associate errors with unique description IDs and announce status once without moving focus. Test both themes, 400% zoom, forced colours and reduced motion. Use system colours/visible borders in forced colours; do not suppress adaptation by default. Keep focus clear of sticky chrome. The house target is 44 px; WCAG minimum is 24×24 CSS px with exceptions. Provide click/tap alternatives to dragging. Native integrations test TalkBack/VoiceOver, large type and platform focus. These are required checks, **not claims of completed AT tests**. [Accessibility](../accessibility.md) maps criteria, system contracts and product responsibilities.

## 9. Content

Use precise outcomes: “Item archived.”, “Undoing…”, “Action undone.”, “Couldn’t undo. Refresh and try again.” Do not imply Undo erases an audit trail or restores an irreversible effect.

Sentence case; translated labels and locale-aware plurals/numbers/dates/currency. Never expose raw error codes or invent a count. Money/evidence outcomes require actual confirmed completion and precise auditable consequences.

## 10. Do / don’t

| Do | Don’t / why |
| --- | --- |
| Await compensation and keep failure visible with a recovery route. | Do not auto-dismiss an error or promise Undo for money, evidence or handover records. |
| Use semantic role tokens and complete visible copy. | Do not copy reference hex colours, alpha text or paid Gilroy weights: they bypass the current theme/type contract. |

## 11. Implementation

**Observed API:** `toast(message,{tone?,undo?:()=>Promise<unknown>,undoKey?,duration?,action?:{label,onClick}})` returns id. `dismissToast(id)`, `undoToast(id)`, `invalidateToastUndo(key)`, `clearToasts(context?)`, toastSession and store subscribe/snapshot. ToastHost takes no props. SessionContext and motion modules make this reference app code, not a portable package.

**App source, reference only:** [frontend/src/components/ui/ToastHost.tsx](https://github.com/SpaceWorks-Labs/SpaceWorks/blob/main/frontend/src/components/ui/ToastHost.tsx). Inspected in the supplied `int-stage-r2final` worktree; uncommitted content may differ from upstream main. [Implementation snapshot](implementation-snapshot.json) records exact file hashes. Neighbours: toastStore.ts.

```tsx
// Mount <ToastHost /> once, within the app session context.
toast('Item archived.', { undoKey: `item:${id}`, undo: () => restoreItem(id) });
```

The snippet assumes the source app’s imports/state handlers. It is **not a standalone install**. Observed app dependencies include React 19.2, React Router 7.18, Tailwind 4.3, Lingui 6.10.1 and local motion/session modules. The [separate React starter](../adoption/react-tailwind.md) avoids these app dependencies. Preserve controlled values separately from fetched data. Only validated public/member brand roles take tenant overrides; staff chrome remains Space Works.

**Known limitations:** The observed store has no hover/focus pause and the host has no expiry-focus fallback. Default 8-second timers can remove focused controls; this is a product implementation gap. The standalone gallery demonstrates paused timing and focus recovery. Placement also differs from P30. No compliance claim is made for the existing host.

The standalone gallery uses local sample data/simulated outcomes. Without JS, ordinary content/controls and inline explanations remain; async/modal enhancements require JS. Native source is starter-only, not compiled here.

## 12. Related and maintenance

[Button](button.md) · [Dialog](dialog.md) · [EmptyState](empty-state.md). [Named patterns/layouts](../patterns/README.md) retain P1–P30/L1–L10 and screen backlinks. [Fonts/licences](../../fonts/README.md), [portable logo master](../../brand/logo-masters.svg) and [design-resource availability](../adoption/README.md#design-and-asset-resources) connect the assets; no public editable library or native component download is asserted.

Evidence: source inspection/captured hashes, not an app/site AT certificate. History: first dedicated contract for planned v2.1.0; no API removal introduced here. [Release policy](../releases/versioning.md), [migrations](../releases/migration.md) and [contribution route](../contributing-design-system.md) govern maintenance.

