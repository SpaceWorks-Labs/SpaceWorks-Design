---
title: Drawer / Sheet
description: Show contextual detail or a focused task above the current screen.
---

# Drawer / Sheet

## 1. Title and support strip

Show contextual detail or a focused task above the current screen. Stable ID: `SWC-drawer-sheet`; source IDs: P3, P30, S6, L4, B. Maturity: **proposed**; availability: **documented reference**, not a published component package. Owner: Space Works design-system owner, Shaan Shoukath; product maintainers own app integration. Documentation introduced/updated for **v2.1.0, planned** under decision 397. Last source verification: **2026-11-13**. Web implementation is described below; Compose/SwiftUI are starter mappings with **no verified component parity**.

## 2. Use it for / choose something else

Use a detail drawer for inspection without losing list context and a phone sheet for a short task. Use a routed DetailLayout for a shareable full page or a Dialog for a concise confirmation.

**Extracted source contract:** [P3 — P3. Detail header with back link, identity chip and underline tabs (R7–R10)](../ux-spec.md#p3-detail-header-with-back-link-identity-chip-and-underline-tabs-r7r10) · [P30 — P30. Undo and confirmation behaviour (R8, R28)](../ux-spec.md#p30-undo-and-confirmation-behaviour-r8-r28) · [S6 — S6. Inventory item detail ← R7 (detail header + tabs) + R5 (settings rows, danger zone)](../ux-spec.md#s6-inventory-item-detail--r7-detail-header--tabs--r5-settings-rows-danger-zone) · [L4 — L4. `DetailLayout` — back + identity + title/status/meta + actions + underline tabs + main/aside (R7–R10)](../ux-spec.md#l4-detaillayout--back--identity--titlestatusmeta--actions--underline-tabs--mainaside-r7r10) · [B — B. Interaction states](../ui-brand-spec.md#b-interaction-states). The purpose, anatomy, variants and dimensions below condense those sections without moving their IDs or anchors. Source P rules describe observed reference boards; B/C and later decisions resolve brand adaptations.

[Authority and implementation status](README.md#authority-and-implementation-status) gives precedence. [Source inventory](source-inventory.json) preserves headings, table cells, code and links for publication checks.

## 3. Live example and complete code

[Full-page runnable example](../../examples/web/component-gallery.html#drawer-sheet): start `node examples/web/server.mjs` from the repository root, then open `http://localhost:4174/examples/web/component-gallery.html#drawer-sheet`. Choose Light/Dark, preview width and an applicable state; exercise hover, pressed and focus-visible with real input. Complete source: [HTML](../../examples/web/component-gallery.html), [behaviour](../../examples/web/gallery.mjs), [styles](../../examples/web/styles.css). No app module, network API or build step is required. These are portable reference compositions, not replicas of app exports.

```html
<button type="button" data-open="drawer-demo">Open item details</button><dialog id="drawer-demo" class="drawer" aria-labelledby="drawer-title"><h3 id="drawer-title">Drill press</h3><p>Available for supervised use.</p><form method="dialog"><button>Close</button></form></dialog><noscript><p>Drill press: available for supervised use.</p></noscript>
```

The linked shell supplies CSS/tokens and any `data-*` behaviour. Static text/native controls remain without JavaScript; modal content has an inline fallback. Copy the complete source for enhancements, not this fragment alone. [First-screen setup](../adoption/plain-html-css.md) shows the whole document.

## 4. Anatomy

Numbered reading-order diagram: `[1] → [2] → [3] → [4] → [5]`. Slots and name ownership:

1. Trigger/context row: return destination.
2. Scrim and modal dialog panel.
3. Title and explicit Close action.
4. Scrollable content with safe-area padding.
5. Optional task actions inside content: caller owns them.

## 5. Variants

DetailDrawer edge='right' default or 'left' for phone navigation. Full-width phone detail; md+ caps to min(48rem,100vw). Modal supplies the bottom-sheet phone variant. There is no generic Sheet export or drag-handle API.

| Variant | Choose it for |
| --- | --- |
| Right detail drawer | Inspect an object while retaining list context. |
| Left drawer | Phone navigation context with same modal focus contract. |
| Modal phone sheet | Short task via Modal; native starter demo is a reference composition. |

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
| Disabled | N/A for the layer container; disable individual footer actions if needed. | Pending does not automatically prevent Escape/scrim; parent owns cancellation. |
| Read-only | N/A — no read-only component mode; noneditable information already reads as text. | No read-only API is claimed. For a locked choice, present a labelled static value; native checkbox/radio/select do not honour readOnly. |
| Loading / pending | Keep title and Close visible; body supplies Loading details… or pending form feedback. | Do not reset first-field focus on rerender. Parent owns fetched state and cancellation. |
| Empty | Show absence only after a successful load, with a useful next step. | Never confuse no records with pending, denied access or failure. |
| Filtered-empty | N/A — this primitive does not filter results; the affected result region owns this state. | Preserve query and scope, offer Clear filters and announce the result once. |
| Error / retry | “Couldn’t save/load. Try again.” plus persistent explanation and specific recovery. | Keep the user’s value/context, relate field errors by ID and retry only the failed operation. |
| Offline | Keep clearly labelled last-known values and unsent drafts; explain network-only limitations. | Local navigation/editing/Close can remain available. Product owns safe retry/idempotency; queued is not completed. |
| Success | Show the completed effect and truthful updated value; use precise confirmation. | Announce once without taking focus; visible in-place changes need no redundant toast or invented success prop. |
| Interrupted work | Retain safe drafts/context and say whether completion is known or still unresolved. | Reconcile server/session state before repeating a mutation; never automatically replay irreversible work. |

## 7. Specifications and tokens

Drawer h-full w-full with safe-area header/body; md max-width 48rem. Body min-h-0 min-w-0 and independent vertical scroll; overlay elevation only. Modal sheet has viewport-capped body and safe-area-aware footer. A handle is decorative; closing must have a button.

Load [tokens CSS](../../tokens/tokens.css) once. Theme pairs: `bg/surface/panel` with `ink` or `muted`; fills use matching `on-*`; standalone links/essential accent marks use `accent-ink` or `brand-boundary`. `line` is decorative. No alpha text or opacity-based disabled state. `outline` on hover and raw dark `accent` on panel need special contrast care; use the tested functional boundary role. Geometry described here is a source contract, not a claim that new CSS variables exist. Wrap translation and enlarged text; use min-inline-size:0 and 320 CSS px reflow rather than clipping.

## 8. Interaction / accessibility

Same stack-aware entry, Tab trap, Escape and opener restoration as Dialog. Close button is always available. Background must not receive focus while modal. When content includes search Escape, honour defaultPrevented before closing. No drag gesture is required.

| Key / input | Behaviour |
| --- | --- |
| Tab / Shift+Tab | Cycle within the top modal layer; keep background inert. |
| Escape / Close | Dismiss according to parent cancellation policy; restore connected opener or meaningful product fallback. |

Test name/role/value and reading order with a screen reader. The name contains the visible label. Associate errors with unique description IDs and announce status once without moving focus. Test both themes, 400% zoom, forced colours and reduced motion. Use system colours/visible borders in forced colours; do not suppress adaptation by default. Keep focus clear of sticky chrome. The house target is 44 px; WCAG minimum is 24×24 CSS px with exceptions. Provide click/tap alternatives to dragging. Native integrations test TalkBack/VoiceOver, large type and platform focus. These are required checks, **not claims of completed AT tests**. [Accessibility](../accessibility.md) maps criteria, system contracts and product responsibilities.

## 9. Content

Use the inspected object as title. State “Couldn’t load this item. Retry.” inside the body, retain the Close action, and explain an interrupted draft before discarding it.

Sentence case; translated labels and locale-aware plurals/numbers/dates/currency. Never expose raw error codes or invent a count. Money/evidence outcomes require actual confirmed completion and precise auditable consequences.

## 10. Do / don’t

| Do | Don’t / why |
| --- | --- |
| Restore focus to the selected row or a nearby list heading if that row has disappeared. | Do not make swipe the sole way to close or place unscrollable fields under a phone keyboard. |
| Use semantic role tokens and complete visible copy. | Do not copy reference hex colours, alpha text or paid Gilroy weights: they bypass the current theme/type contract. |

## 11. Implementation

**Observed API:** `DetailDrawer({open,title,onClose,children,edge='right'})`. `Modal` supplies responsive sheet behaviour, not a separate Drawer.sheet prop. Uses OverlayPortal, app presence, dialogFocus and keyboardSafe. No footer, fetch, snap-point, swipe or loading prop exists on DetailDrawer.

**App source, reference only:** [frontend/src/components/ui/DetailDrawer.tsx](https://github.com/SpaceWorks-Labs/SpaceWorks/blob/main/frontend/src/components/ui/DetailDrawer.tsx). Inspected in the supplied `int-stage-r2final` worktree; uncommitted content may differ from upstream main. [Implementation snapshot](implementation-snapshot.json) records exact file hashes. Neighbours: Modal.tsx, dialogFocus.ts, keyboardSafe.ts.

```tsx
<DetailDrawer open={open} title='Drill press' edge='right' onClose={() => setOpen(false)}>
  <p>Available for supervised use.</p>
</DetailDrawer>
```

The snippet assumes the source app’s imports/state handlers. It is **not a standalone install**. Observed app dependencies include React 19.2, React Router 7.18, Tailwind 4.3, Lingui 6.10.1 and local motion/session modules. The [separate React starter](../adoption/react-tailwind.md) avoids these app dependencies. Preserve controlled values separately from fetched data. Only validated public/member brand roles take tenant overrides; staff chrome remains Space Works.

**Known limitations:** The source title truncates with a title attribute; products should ensure an accessible full title and useful long-text presentation. Edge placement depends on the app motion CSS. The sample uses native dialog for portability and does not reproduce the app animation or claim a reusable native sheet.

The standalone gallery uses local sample data/simulated outcomes. Without JS, ordinary content/controls and inline explanations remain; async/modal enhancements require JS. Native source is starter-only, not compiled here.

## 12. Related and maintenance

[Dialog](dialog.md) · [Menu](menu.md) · [Table](table.md). [Named patterns/layouts](../patterns/README.md) retain P1–P30/L1–L10 and screen backlinks. [Fonts/licences](../../fonts/README.md), [portable logo master](../../brand/logo-masters.svg) and [design-resource availability](../adoption/README.md#design-and-asset-resources) connect the assets; no public editable library or native component download is asserted.

Evidence: source inspection/captured hashes, not an app/site AT certificate. History: first dedicated contract for planned v2.1.0; no API removal introduced here. [Release policy](../releases/versioning.md), [migrations](../releases/migration.md) and [contribution route](../contributing-design-system.md) govern maintenance.

