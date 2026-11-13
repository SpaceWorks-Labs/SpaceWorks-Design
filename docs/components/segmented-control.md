---
title: SegmentedControl
description: Choose two or three mutually exclusive views of the same object.
---

# SegmentedControl

## 1. Title and support strip

Choose two or three mutually exclusive views of the same object. Stable ID: `SWC-segmented-control`; source IDs: P9, P22, S20, L8, B. Maturity: **proposed**; availability: **documented reference**, not a published component package. Owner: Space Works design-system owner, Shaan Shoukath; product maintainers own app integration. Documentation introduced/updated for **v2.1.0, planned** under decision 397. Last source verification: **2026-11-13**. Web implementation is described below; Compose/SwiftUI are starter mappings with **no verified component parity**.

## 2. Use it for / choose something else

Use for List/Cards or Sign in/Create account when they are local views. Use Tabs for page sections and Radio/Select for a longer form decision. It never replaces navigation tabs.

**Extracted source contract:** [P9 — P9. Segmented control (R9, R11)](../ux-spec.md#p9-segmented-control-r9-r11) · [P22 — P22. Auth split screen (R11)](../ux-spec.md#p22-auth-split-screen-r11) · [S20 — S20. Staff sign-in (`LoginPanel`) ← R11](../ux-spec.md#s20-staff-sign-in-loginpanel--r11) · [L8 — L8. `AuthLayout` (R11) and `CenteredCardLayout` (R12–R15)](../ux-spec.md#l8-authlayout-r11-and-centeredcardlayout-r12r15) · [B — B. Interaction states](../ui-brand-spec.md#b-interaction-states). The purpose, anatomy, variants and dimensions below condense those sections without moving their IDs or anchors. Source P rules describe observed reference boards; B/C and later decisions resolve brand adaptations.

> **Authority note (2026-11-13):** P entries retain observed reference-board measurements. Current B/D/E and decisions SW-299/SW-316 govern brand fills, free typography and geometry; do not copy reference black pills, shadows or legacy radii. Original source remains intact.

[Authority and implementation status](README.md#authority-and-implementation-status) gives precedence. [Source inventory](source-inventory.json) preserves headings, table cells, code and links for publication checks.

## 3. Live example and complete code

[Full-page runnable example](../../examples/web/component-gallery.html#segmented-control): start `node examples/web/server.mjs` from the repository root, then open `http://localhost:4174/examples/web/component-gallery.html#segmented-control`. Choose Light/Dark, preview width and an applicable state; exercise hover, pressed and focus-visible with real input. Complete source: [HTML](../../examples/web/component-gallery.html), [behaviour](../../examples/web/gallery.mjs), [styles](../../examples/web/styles.css). No app module, network API or build step is required. These are portable reference compositions, not replicas of app exports.

```html
<fieldset class="segments"><legend>Inventory view</legend><label class="choice"><input type="radio" name="segment" value="list" checked>List</label><label class="choice"><input type="radio" name="segment" value="cards">Cards</label></fieldset>
```

The linked shell supplies CSS/tokens and any `data-*` behaviour. Static text/native controls remain without JavaScript; modal content has an inline fallback. Copy the complete source for enhancements, not this fragment alone. [First-screen setup](../adoption/plain-html-css.md) shows the whole document.

## 4. Anatomy

Numbered reading-order diagram: `[1] → [2] → [3] → [4]`. Slots and name ownership:

1. Radiogroup with a required label.
2. Two or three button options with role=radio.
3. Selected button: checked and only initial tab stop.
4. Controlled view content: external to the component.

## 5. Variants

Intrinsic inline width or fullWidth equal option widths. Invalid value falls back to the first option. No disabled option, read-only or asynchronous mode is exposed.

| Variant | Choose it for |
| --- | --- |
| Intrinsic | Two or three short local view choices. |
| fullWidth | Equal-width choices fill the form/sheet slot. |

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
| Disabled | N/A — Tabs/SegmentedControl have no disabled-option API. | Omit gated options before render and explain blocked tasks outside the group. |
| Read-only | N/A — no read-only component mode; noneditable information already reads as text. | No read-only API is claimed. For a locked choice, present a labelled static value; native checkbox/radio/select do not honour readOnly. |
| Loading / pending | Keep context; use task-specific pending copy such as “Saving…”. | Disable only the mutation in progress, announce once and preserve drafts. Fetch state is product-owned unless §11 says otherwise. |
| Empty | Do not render an empty choice bar. | Fallback requires at least one option; the product handles no available views. |
| Filtered-empty | N/A — this primitive does not filter results; the affected result region owns this state. | Preserve query and scope, offer Clear filters and announce the result once. |
| Error / retry | “Couldn’t save/load. Try again.” plus persistent explanation and specific recovery. | Keep the user’s value/context, relate field errors by ID and retry only the failed operation. |
| Offline | Keep clearly labelled last-known values and unsent drafts; explain network-only limitations. | Local navigation/editing/Close can remain available. Product owns safe retry/idempotency; queued is not completed. |
| Success | Show the completed effect and truthful updated value; use precise confirmation. | Announce once without taking focus; visible in-place changes need no redundant toast or invented success prop. |
| Interrupted work | Retain safe drafts/context and say whether completion is known or still unresolved. | Reconcile server/session state before repeating a mutation; never automatically replay irreversible work. |

## 7. Specifications and tokens

Actual min-h-11 min-w-11 options, px-4 py-2, 4 px track gap/padding, border-line surface track, selected panel with outline. Brand geometry is 10 px control radius, no control shadow; P9’s observed pill/shadow is historical reference.

Load [tokens CSS](../../tokens/tokens.css) once. Theme pairs: `bg/surface/panel` with `ink` or `muted`; fills use matching `on-*`; standalone links/essential accent marks use `accent-ink` or `brand-boundary`. `line` is decorative. No alpha text or opacity-based disabled state. `outline` on hover and raw dark `accent` on panel need special contrast care; use the tested functional boundary role. Geometry described here is a source contract, not a claim that new CSS variables exist. Wrap translation and enlarged text; use min-inline-size:0 and 320 CSS px reflow rather than clipping.

## 8. Interaction / accessibility

Tab enters the checked choice. Arrow keys wrap, focus and activate; Home/End choose first/last. Space/Enter activate button-backed choices. Tab leaves the group. Keep focus on the chosen option when the content changes.

| Key / input | Behaviour |
| --- | --- |
| Tab / arrows / Home / End | Use the mode-specific route-versus-panel/radio model described above. |
| Enter / Space | Route links use Enter; button-backed panel/radio choices activate natively. |

Test name/role/value and reading order with a screen reader. The name contains the visible label. Associate errors with unique description IDs and announce status once without moving focus. Test both themes, 400% zoom, forced colours and reduced motion. Use system colours/visible borders in forced colours; do not suppress adaptation by default. Keep focus clear of sticky chrome. The house target is 44 px; WCAG minimum is 24×24 CSS px with exceptions. Provide click/tap alternatives to dragging. Native integrations test TalkBack/VoiceOver, large type and platform focus. These are required checks, **not claims of completed AT tests**. [Accessibility](../accessibility.md) maps criteria, system contracts and product responsibilities.

## 9. Content

Use short parallel names (“List”, “Cards”) and a distinct group label (“Inventory view”). Do not include mutable counts if they cause controls to jump in width.

Sentence case; translated labels and locale-aware plurals/numbers/dates/currency. Never expose raw error codes or invent a count. Money/evidence outcomes require actual confirmed completion and precise auditable consequences.

## 10. Do / don’t

| Do | Don’t / why |
| --- | --- |
| Use two or three views and let labels wrap or the group wrap at narrow widths. | Do not invent disabled/readOnly props or copy P9’s reference shadow over brand B/E. |
| Use semantic role tokens and complete visible copy. | Do not copy reference hex colours, alpha text or paid Gilroy weights: they bypass the current theme/type contract. |

## 11. Implementation

**Observed API:** `SegmentedControl({label,value,options:[{value,label}],onChange,fullWidth=false})`. Caller controls value and renders the corresponding content. It does not assign a panel role, URL or fetch state.

**App source, reference only:** [frontend/src/components/ui/SegmentedControl.tsx](https://github.com/SpaceWorks-Labs/SpaceWorks/blob/main/frontend/src/components/ui/SegmentedControl.tsx). Inspected in the supplied `int-stage-r2final` worktree; uncommitted content may differ from upstream main. [Implementation snapshot](implementation-snapshot.json) records exact file hashes. Neighbours: useRovingFocus.ts.

```tsx
<SegmentedControl label='Inventory view' value={view}
  options={[{ value: 'list', label: 'List' }, { value: 'cards', label: 'Cards' }]}
  onChange={setView} fullWidth />
```

The snippet assumes the source app’s imports/state handlers. It is **not a standalone install**. Observed app dependencies include React 19.2, React Router 7.18, Tailwind 4.3, Lingui 6.10.1 and local motion/session modules. The [separate React starter](../adoption/react-tailwind.md) avoids these app dependencies. Preserve controlled values separately from fetched data. Only validated public/member brand roles take tenant overrides; staff chrome remains Space Works.

**Known limitations:** The fallback is visual/semantic only; it does not call onChange to normalize an invalid value. Callers must keep value valid, handle no options before rendering, and provide accessible content and fetched-state handling.

The standalone gallery uses local sample data/simulated outcomes. Without JS, ordinary content/controls and inline explanations remain; async/modal enhancements require JS. Native source is starter-only, not compiled here.

## 12. Related and maintenance

[Tabs](tabs.md) · [Radio](radio.md) · [Select](select.md). [Named patterns/layouts](../patterns/README.md) retain P1–P30/L1–L10 and screen backlinks. [Fonts/licences](../../fonts/README.md), [portable logo master](../../brand/logo-masters.svg) and [design-resource availability](../adoption/README.md#design-and-asset-resources) connect the assets; no public editable library or native component download is asserted.

Evidence: source inspection/captured hashes, not an app/site AT certificate. History: first dedicated contract for planned v2.1.0; no API removal introduced here. [Release policy](../releases/versioning.md), [migrations](../releases/migration.md) and [contribution route](../contributing-design-system.md) govern maintenance.

