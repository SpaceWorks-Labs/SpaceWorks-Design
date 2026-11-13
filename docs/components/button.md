---
title: Button
description: Run one clearly named action in the current task.
---

# Button

## 1. Title and support strip

Run one clearly named action in the current task. Stable ID: `SWC-button`; source IDs: P11, P30, S9, L5, B. Maturity: **proposed**; availability: **documented reference**, not a published component package. Owner: Space Works design-system owner, Shaan Shoukath; product maintainers own app integration. Documentation introduced/updated for **v2.1.0, planned** under decision 397. Last source verification: **2026-11-13**. Web implementation is described below; Compose/SwiftUI are starter mappings with **no verified component parity**.

## 2. Use it for / choose something else

Use for Save, Create, Retry and confirmation. Use Link for a destination and IconButton only for a familiar compact action.

**Extracted source contract:** [P11 — P11. Buttons](../ux-spec.md#p11-buttons) · [P30 — P30. Undo and confirmation behaviour (R8, R28)](../ux-spec.md#p30-undo-and-confirmation-behaviour-r8-r28) · [S9 — S9. Makerspace settings (`settings`) ← R5 + R6 + R17](../ux-spec.md#s9-makerspace-settings-settings--r5--r6--r17) · [L5 — L5. `SettingsLayout` — sub-nav + sections of rows + sticky Discard/Save + DangerZone (R5, R6, R16, R17)](../ux-spec.md#l5-settingslayout--sub-nav--sections-of-rows--sticky-discardsave--dangerzone-r5-r6-r16-r17) · [B — B. Interaction states](../ui-brand-spec.md#b-interaction-states). The purpose, anatomy, variants and dimensions below condense those sections without moving their IDs or anchors. Source P rules describe observed reference boards; B/C and later decisions resolve brand adaptations.

> **Authority note (2026-11-13):** P entries retain observed reference-board measurements. Current B/D/E and decisions SW-299/SW-316 govern brand fills, free typography and geometry; do not copy reference black pills, shadows or legacy radii. Original source remains intact.

[Authority and implementation status](README.md#authority-and-implementation-status) gives precedence. [Source inventory](source-inventory.json) preserves headings, table cells, code and links for publication checks.

## 3. Live example and complete code

[Full-page runnable example](../../examples/web/component-gallery.html#button): start `node examples/web/server.mjs` from the repository root, then open `http://localhost:4174/examples/web/component-gallery.html#button`. Choose Light/Dark, preview width and an applicable state; exercise hover, pressed and focus-visible with real input. Complete source: [HTML](../../examples/web/component-gallery.html), [behaviour](../../examples/web/gallery.mjs), [styles](../../examples/web/styles.css). No app module, network API or build step is required. These are portable reference compositions, not replicas of app exports.

```html
<button type="button" class="primary" data-action="save">Save changes</button>
```

The linked shell supplies CSS/tokens and any `data-*` behaviour. Static text/native controls remain without JavaScript; modal content has an inline fallback. Copy the complete source for enhancements, not this fragment alone. [First-screen setup](../adoption/plain-html-css.md) shows the whole document.

## 4. Anatomy

Numbered reading-order diagram: `[1] → [2] → [3] → [4]`. Slots and name ownership:

1. Native button: required action name and click target.
2. Text label: verb plus object; owns the accessible name.
3. Optional leading icon: decorative; pending artwork replaces it.
4. Adjacent reason or outcome: visible text plus description/status relationship.

## 5. Variants

Primary: one filled action per region. Neutral: secondary action. Ghost: low emphasis. Danger outline: opens a consequential confirmation. Filled danger: final confirmation only. Brand: public/member primary with validated tenant pairs.

| Variant | Choose it for |
| --- | --- |
| Primary | One main task action per region. |
| Neutral / ghost | Secondary or low-emphasis action. |
| Danger outline / final danger | Open a consequential confirmation / confirm its irreversible effect. |
| Brand | Validated public/member tenant primary; not staff chrome. |

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
| Loading / pending | Keep context; use task-specific pending copy such as “Saving…”. | Disable only the mutation in progress, announce once and preserve drafts. Fetch state is product-owned unless §11 says otherwise. |
| Empty | N/A — an action/destination is not a result collection; an empty label is invalid. | Never confuse no records with pending, denied access or failure. |
| Filtered-empty | N/A — this primitive does not filter results; the affected result region owns this state. | Preserve query and scope, offer Clear filters and announce the result once. |
| Error / retry | “Couldn’t save/load. Try again.” plus persistent explanation and specific recovery. | Keep the user’s value/context, relate field errors by ID and retry only the failed operation. |
| Offline | Keep clearly labelled last-known values and unsent drafts; explain network-only limitations. | Local navigation/editing/Close can remain available. Product owns safe retry/idempotency; queued is not completed. |
| Success | Show the completed effect and truthful updated value; use precise confirmation. | Announce once without taking focus; visible in-place changes need no redundant toast or invented success prop. |
| Interrupted work | Retain safe drafts/context and say whether completion is known or still unresolved. | Reconcile server/session state before repeating a mutation; never automatically replay irreversible work. |

## 7. Specifications and tokens

44 px minimum control height and target width; 50–52 px full-width auth action only where P11 calls for it. Control radius 10 px, 4 px spacing grid, Outfit 600. B fill/on-fill pairs cover rest/hover/pressed. Cards have no elevation; overlay shadows do not belong on buttons.

Load [tokens CSS](../../tokens/tokens.css) once. Theme pairs: `bg/surface/panel` with `ink` or `muted`; fills use matching `on-*`; standalone links/essential accent marks use `accent-ink` or `brand-boundary`. `line` is decorative. No alpha text or opacity-based disabled state. `outline` on hover and raw dark `accent` on panel need special contrast care; use the tested functional boundary role. Geometry described here is a source contract, not a claim that new CSS variables exist. Wrap translation and enlarged text; use min-inline-size:0 and 320 CSS px reflow rather than clipping.

## 8. Interaction / accessibility

Tab / Shift+Tab: visit enabled buttons. Enter / Space: activate once. Native disabled buttons leave the tab order. A confirmation moves focus into Dialog; closing restores its opener.

| Key / input | Behaviour |
| --- | --- |
| Tab / Shift+Tab | Visit enabled controls. |
| Enter / Space | Activate native button once; href variants use Link behaviour. |

Test name/role/value and reading order with a screen reader. The name contains the visible label. Associate errors with unique description IDs and announce status once without moving focus. Test both themes, 400% zoom, forced colours and reduced motion. Use system colours/visible borders in forced colours; do not suppress adaptation by default. Keep focus clear of sticky chrome. The house target is 44 px; WCAG minimum is 24×24 CSS px with exceptions. Provide click/tap alternatives to dragging. Native integrations test TalkBack/VoiceOver, large type and platform focus. These are required checks, **not claims of completed AT tests**. [Accessibility](../accessibility.md) maps criteria, system contracts and product responsibilities.

## 9. Content

Use “Save changes”, “Saving…”, “Saved.” and “Couldn’t save. Try again.” Explain blocked prerequisites visibly; the ActionControl reason is screen-reader-only unless the product also renders it. Append … for a confirmation, never for a completed action.

Sentence case; translated labels and locale-aware plurals/numbers/dates/currency. Never expose raw error codes or invent a count. Money/evidence outcomes require actual confirmed completion and precise auditable consequences.

## 10. Do / don’t

| Do | Don’t / why |
| --- | --- |
| Pair Save changes with Discard for a dirty settings group; disable only the pending action. | Do not use a filled danger control before confirmation or opacity to communicate disabled state. |
| Use semantic role tokens and complete visible copy. | Do not copy reference hex colours, alpha text or paid Gilroy weights: they bypass the current theme/type contract. |

## 11. Implementation

**Observed API:** `ActionControl({action, primary=false, className=''})`. `Action`: label, href, onClick, icon, pending, pendingLabel, disabled, disabledReason, tone ('default'|'danger'), external, confirms and confirm {title,message,confirmLabel?}. No arbitrary variant prop, submit type or forwarded ref is supplied. Use a native submit button for a form.

**App source, reference only:** [frontend/src/components/ui/ActionControl.tsx](https://github.com/SpaceWorks-Labs/SpaceWorks/blob/main/frontend/src/components/ui/ActionControl.tsx). Inspected in the supplied `int-stage-r2final` worktree; uncommitted content may differ from upstream main. [Implementation snapshot](implementation-snapshot.json) records exact file hashes. Neighbours: shared types, desk CSS and motion modules.

```tsx
<ActionControl primary action={{ label: 'Save changes', pending: saving,
  pendingLabel: 'Saving…', disabled: !dirty, disabledReason: !dirty ? 'No changes to save.' : undefined,
  onClick: save }} />
```

The snippet assumes the source app’s imports/state handlers. It is **not a standalone install**. Observed app dependencies include React 19.2, React Router 7.18, Tailwind 4.3, Lingui 6.10.1 and local motion/session modules. The [separate React starter](../adoption/react-tailwind.md) avoids these app dependencies. Preserve controlled values separately from fetched data. Only validated public/member brand roles take tenant overrides; staff chrome remains Space Works.

**Known limitations:** ActionControl does not await onClick, own fetched state, show success/error or prevent double mutation by itself. Callers must set pending synchronously, await the result, retain entered data and announce outcomes. Its disabledReason is not a visible explanation.

The standalone gallery uses local sample data/simulated outcomes. Without JS, ordinary content/controls and inline explanations remain; async/modal enhancements require JS. Native source is starter-only, not compiled here.

## 12. Related and maintenance

[Link](link.md) · [IconButton](icon-button.md) · [Dialog](dialog.md) · [Toast](toast.md). [Named patterns/layouts](../patterns/README.md) retain P1–P30/L1–L10 and screen backlinks. [Fonts/licences](../../fonts/README.md), [portable logo master](../../brand/logo-masters.svg) and [design-resource availability](../adoption/README.md#design-and-asset-resources) connect the assets; no public editable library or native component download is asserted.

Evidence: source inspection/captured hashes, not an app/site AT certificate. History: first dedicated contract for planned v2.1.0; no API removal introduced here. [Release policy](../releases/versioning.md), [migrations](../releases/migration.md) and [contribution route](../contributing-design-system.md) govern maintenance.

