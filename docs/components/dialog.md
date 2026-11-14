---
title: Dialog
description: Focus attention on a bounded task or consequential confirmation.
---

# Dialog

## 1. Title and support strip

Focus attention on a bounded task or consequential confirmation. Stable ID: `SWC-dialog`; source IDs: P16, P30, S9, L5, B. Maturity: **proposed**; availability: **documented reference**, not a published component package. Owner: Space Works design-system owner (SpaceWorks Labs); product maintainers own app integration. Documentation introduced/updated for **v2.1.0, planned** under decision 397. Last source verification: **2026-11-13**. Web implementation is described below; Compose/SwiftUI are starter mappings with **no verified component parity**.

## 2. Use it for / choose something else

Use for a short modal task, irreversible confirmation or critical choice. Use Drawer for contextual detail and an inline error for a failed field. Reversible routine actions use immediate effect plus Undo where allowed.

**Extracted source contract:** [P16 — P16. Danger zone (R5, R10)](../ux-spec.md#p16-danger-zone-r5-r10) · [P30 — P30. Undo and confirmation behaviour (R8, R28)](../ux-spec.md#p30-undo-and-confirmation-behaviour-r8-r28) · [S9 — S9. Makerspace settings (`settings`) ← R5 + R6 + R17](../ux-spec.md#s9-makerspace-settings-settings--r5--r6--r17) · [L5 — L5. `SettingsLayout` — sub-nav + sections of rows + sticky Discard/Save + DangerZone (R5, R6, R16, R17)](../ux-spec.md#l5-settingslayout--sub-nav--sections-of-rows--sticky-discardsave--dangerzone-r5-r6-r16-r17) · [B — B. Interaction states](../ui-brand-spec.md#b-interaction-states). The purpose, anatomy, variants and dimensions below condense those sections without moving their IDs or anchors. Source P rules describe observed reference boards; B/C and later decisions resolve brand adaptations.

[Authority and implementation status](README.md#authority-and-implementation-status) gives precedence. [Source inventory](source-inventory.json) preserves headings, table cells, code and links for publication checks.

## 3. Live example and complete code

[Full-page runnable example](../../examples/web/component-gallery.html#dialog): start `node examples/web/server.mjs` from the repository root, then open `http://localhost:4174/examples/web/component-gallery.html#dialog`. Choose Light/Dark, preview width and an applicable state; exercise hover, pressed and focus-visible with real input. Complete source: [HTML](../../examples/web/component-gallery.html), [behaviour](../../examples/web/gallery.mjs), [styles](../../examples/web/styles.css). No app module, network API or build step is required. These are portable reference compositions, not replicas of app exports.

```html
<details><summary>Review deletion consequences</summary><p>This permanently deletes the draft.</p><button type="button" data-open="dialog-demo">Open confirmation</button></details><dialog id="dialog-demo" aria-labelledby="dialog-title"><h3 id="dialog-title">Delete draft?</h3><p>This permanently deletes the draft.</p><form method="dialog"><button value="cancel">Cancel</button><button value="confirm">Delete draft</button></form></dialog>
```

The linked shell supplies CSS/tokens and any `data-*` behaviour. Static text/native controls remain without JavaScript; modal content has an inline fallback. Copy the complete source for enhancements, not this fragment alone. [First-screen setup](../adoption/plain-html-css.md) shows the whole document.

## 4. Anatomy

Numbered reading-order diagram: `[1] → [2] → [3] → [4] → [5]`. Slots and name ownership:

1. Opener: remembered focus target.
2. Modal layer/scrim: background becomes inert.
3. Panel with role=dialog and visible h2 name.
4. Scrollable body: optional description and fields.
5. Optional footer actions and explicit Close: remain reachable.

## 5. Variants

Modal size='md' (max-w-lg) or 'xl' (max-w-4xl), backdrop='plain' or 'blur'. Phones render as a bottom sheet. ConfirmDialog composes Modal with message, pending and optional safePrimary to emphasise Cancel.

| Variant | Choose it for |
| --- | --- |
| md / xl | Bounded standard task / wide content. |
| ConfirmDialog | Named consequence plus explicit Cancel/confirm. |
| Phone sheet | Responsive Modal presentation; no separate Sheet export. |

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

Viewport-capped panel, independently scrolling body, safe-area padding and keyboard-safe field reveal. Layer z-50, shadow-overlay only. Phone footer stacks/wraps; desktop footer wraps at the end. Never crop task controls at 320 px or enlarged text.

Load [tokens CSS](../../tokens/tokens.css) once. Theme pairs: `bg/surface/panel` with `ink` or `muted`; fills use matching `on-*`; standalone links/essential accent marks use `accent-ink` or `brand-boundary`. `line` is decorative. No alpha text or opacity-based disabled state. `outline` on hover and raw dark `accent` on panel need special contrast care; use the tested functional boundary role. Geometry described here is a source contract, not a claim that new CSS variables exist. Wrap translation and enlarged text; use min-inline-size:0 and 320 CSS px reflow rather than clipping.

## 8. Interaction / accessibility

Open: app focuses first rendered focusable descendant, or panel if none. Tab/Shift+Tab wrap in the top layer. Escape closes only the top layer unless already prevented. Closing restores the connected opener; missing opener falls back to body in the source. Products must supply a meaningful fallback when deleting the opener.

| Key / input | Behaviour |
| --- | --- |
| Tab / Shift+Tab | Cycle within the top modal layer; keep background inert. |
| Escape / Close | Dismiss according to parent cancellation policy; restore connected opener or meaningful product fallback. |

Test name/role/value and reading order with a screen reader. The name contains the visible label. Associate errors with unique description IDs and announce status once without moving focus. Test both themes, 400% zoom, forced colours and reduced motion. Use system colours/visible borders in forced colours; do not suppress adaptation by default. Keep focus clear of sticky chrome. The house target is 44 px; WCAG minimum is 24×24 CSS px with exceptions. Provide click/tap alternatives to dragging. Native integrations test TalkBack/VoiceOver, large type and platform focus. These are required checks, **not claims of completed AT tests**. [Accessibility](../accessibility.md) maps criteria, system contracts and product responsibilities.

## 9. Content

Name the object and actual consequence; use “Delete draft” instead of “OK”. A safe alternative is explicit Cancel. Explain pending cancellation honestly; do not close before an unresolved irreversible operation is known.

Sentence case; translated labels and locale-aware plurals/numbers/dates/currency. Never expose raw error codes or invent a count. Money/evidence outcomes require actual confirmed completion and precise auditable consequences.

## 10. Do / don’t

| Do | Don’t / why |
| --- | --- |
| Keep Cancel first where it is safest, explain permanent consequences and test nested focus restoration. | Do not show unrelated modal tasks simultaneously or treat disabling confirm as preventing Escape. |
| Use semantic role tokens and complete visible copy. | Do not copy reference hex colours, alpha text or paid Gilroy weights: they bypass the current theme/type contract. |

## 11. Implementation

**Observed API:** `Modal({open,onClose,title,children,footer?,size='md',backdrop='plain'})`. `ConfirmDialog({open,title,message,confirmLabel?,cancelLabel?,tone='default',onConfirm,onCancel,pending=false,safePrimary=false})`. The parent owns open/pending and callback completion. ConfirmDialog pending disables action buttons; onClose still calls onCancel.

**App source, reference only:** [frontend/src/components/ui/Modal.tsx](https://github.com/SpaceWorks-Labs/SpaceWorks/blob/main/frontend/src/components/ui/Modal.tsx). Inspected in the supplied `int-stage-r2final` worktree; uncommitted content may differ from upstream main. [Implementation snapshot](implementation-snapshot.json) records exact file hashes. Neighbours: ConfirmDialog.tsx, dialogFocus.ts, OverlayPortal.tsx.

```tsx
<ConfirmDialog open={open} title='Delete draft?' message='This permanently deletes the draft.'
  confirmLabel='Delete draft' tone='danger' pending={pending}
  onCancel={() => setOpen(false)} onConfirm={deleteDraft} />
```

The snippet assumes the source app’s imports/state handlers. It is **not a standalone install**. Observed app dependencies include React 19.2, React Router 7.18, Tailwind 4.3, Lingui 6.10.1 and local motion/session modules. The [separate React starter](../adoption/react-tailwind.md) avoids these app dependencies. Preserve controlled values separately from fetched data. Only validated public/member brand roles take tenant overrides; staff chrome remains Space Works.

**Known limitations:** Initial focus is DOM-first, not automatically the safest control or heading. Modal has no aria-describedby prop; give long content its own structure. ConfirmDialog does not await onConfirm or change pending text. Parent must preserve data and choose cancellation policy; backdrop/Escape can still invoke onClose while pending.

The standalone gallery uses local sample data/simulated outcomes. Without JS, ordinary content/controls and inline explanations remain; async/modal enhancements require JS. Native source is starter-only, not compiled here.

## 12. Related and maintenance

[Drawer / Sheet](drawer-sheet.md) · [Button](button.md) · [Toast](toast.md). [Named patterns/layouts](../patterns/README.md) retain P1–P30/L1–L10 and screen backlinks. [Fonts/licences](../../fonts/README.md), [portable logo master](../../brand/logo-masters.svg) and [design-resource availability](../adoption/README.md#design-and-asset-resources) connect the assets; no public editable library or native component download is asserted.

Evidence: source inspection/captured hashes, not an app/site AT certificate. History: first dedicated contract for planned v2.1.0; no API removal introduced here. [Release policy](../releases/versioning.md), [migrations](../releases/migration.md) and [contribution route](../contributing-design-system.md) govern maintenance.

