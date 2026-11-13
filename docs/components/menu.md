---
title: Menu
description: Reveal a small set of secondary actions for the current context.
---

# Menu

## 1. Title and support strip

Reveal a small set of secondary actions for the current context. Stable ID: `SWC-menu`; source IDs: P14, P16, S5, L3, B. Maturity: **proposed**; availability: **documented reference**, not a published component package. Owner: Space Works design-system owner, Shaan Shoukath; product maintainers own app integration. Documentation introduced/updated for **v2.1.0, planned** under decision 397. Last source verification: **2026-11-13**. Web implementation is described below; Compose/SwiftUI are starter mappings with **no verified component parity**.

## 2. Use it for / choose something else

Use OverflowMenu for uncommon row/header actions. Keep the next step inline. Use Select for choosing a field value, and ordinary links for primary navigation.

**Extracted source contract:** [P14 — P14. Tables inside a card (R4, R8, R10)](../ux-spec.md#p14-tables-inside-a-card-r4-r8-r10) · [P16 — P16. Danger zone (R5, R10)](../ux-spec.md#p16-danger-zone-r5-r10) · [S5 — S5. Inventory list (`inventory`) ← R2 header/stat cards + adapted dense table (§5)](../ux-spec.md#s5-inventory-list-inventory--r2-headerstat-cards--adapted-dense-table-5) · [L3 — L3. `ListLayout` — header + callout + stats/tabs + filters + list/table + pagination (R2, R4)](../ux-spec.md#l3-listlayout--header--callout--statstabs--filters--listtable--pagination-r2-r4) · [B — B. Interaction states](../ui-brand-spec.md#b-interaction-states). The purpose, anatomy, variants and dimensions below condense those sections without moving their IDs or anchors. Source P rules describe observed reference boards; B/C and later decisions resolve brand adaptations.

[Authority and implementation status](README.md#authority-and-implementation-status) gives precedence. [Source inventory](source-inventory.json) preserves headings, table cells, code and links for publication checks.

## 3. Live example and complete code

[Full-page runnable example](../../examples/web/component-gallery.html#menu): start `node examples/web/server.mjs` from the repository root, then open `http://localhost:4174/examples/web/component-gallery.html#menu`. Choose Light/Dark, preview width and an applicable state; exercise hover, pressed and focus-visible with real input. Complete source: [HTML](../../examples/web/component-gallery.html), [behaviour](../../examples/web/gallery.mjs), [styles](../../examples/web/styles.css). No app module, network API or build step is required. These are portable reference compositions, not replicas of app exports.

```html
<details><summary>More actions for Drill press</summary><a href="#table">View history</a><button type="button" data-action="archive">Archive</button></details>
```

The linked shell supplies CSS/tokens and any `data-*` behaviour. Static text/native controls remain without JavaScript; modal content has an inline fallback. Copy the complete source for enhancements, not this fragment alone. [First-screen setup](../adoption/plain-html-css.md) shows the whole document.

## 4. Anatomy

Numbered reading-order diagram: `[1] → [2] → [3] → [4]`. Slots and name ownership:

1. Named trigger with haspopup, expanded and controls.
2. Anchored role=menu popup.
3. Menuitem link/button with action label and optional icon/reason.
4. Optional confirmation layer after the menu closes.

## 5. Variants

Overflow ellipsis by default; showLabel adds label plus ChevronDown. mobileActions are shown below md; actions are always shown. Popup alignment adapts near the left viewport edge. No submenus or checked-menu-item API exists.

| Variant | Choose it for |
| --- | --- |
| Overflow ellipsis | Rare contextual actions. |
| showLabel | Named action group trigger with ChevronDown. |
| mobileActions | Extra actions below md, not duplicate visible controls. |

Native products use platform controls with mapped roles/settings. A web keyboard model does not establish native parity. Gallery variants/states are reference compositions, not undocumented app props.

## 6. States

State handling belongs either to this primitive or the containing task explicitly named below. N/A records a semantic or API limitation, not an omitted requirement.

| State | Presentation / copy | Action, focus, announcement and data |
| --- | --- | --- |
| Default | Required visible name, correct role and truthful current value/context. | Enabled actions follow §8; no automatic announcement for static content. |
| Hover | Use B hover roles without hiding the label or necessary boundary. | No hover-exclusive instructions; child controls retain their own contracts. |
| Pressed | Use B active colours during activation; do not mutate on pointer-down. | Native click/release activates once; optional child actions use Button. |
| Focus-visible | Visible 2 px ring plus offset; ≥3:1 against actual adjacent colour. | Keep focused actions visible above sticky chrome and the software keyboard. |
| Selected | N/A — this is an action menu without checked-menu-item API. | Use Select/Radio for a value. |
| Disabled | Explicit surface/muted/line colours and an understandable prerequisite. | Use native disabled where supported; aria-disabled requires event guards. Consult §11 for unsupported props. |
| Read-only | N/A — no read-only component mode; noneditable information already reads as text. | No read-only API is claimed. For a locked choice, present a labelled static value; native checkbox/radio/select do not honour readOnly. |
| Loading / pending | Keep context; use task-specific pending copy such as “Saving…”. | Disable only the mutation in progress, announce once and preserve drafts. Fetch state is product-owned unless §11 says otherwise. |
| Empty | No actions/mobileActions: render null. | Never show a trigger which opens an empty menu. |
| Filtered-empty | N/A — this primitive does not filter results; the affected result region owns this state. | Preserve query and scope, offer Clear filters and announce the result once. |
| Error / retry | “Couldn’t save/load. Try again.” plus persistent explanation and specific recovery. | Keep the user’s value/context, relate field errors by ID and retry only the failed operation. |
| Offline | Keep clearly labelled last-known values and unsent drafts; explain network-only limitations. | Local navigation/editing/Close can remain available. Product owns safe retry/idempotency; queued is not completed. |
| Success | Show the completed effect and truthful updated value; use precise confirmation. | Announce once without taking focus; visible in-place changes need no redundant toast or invented success prop. |
| Interrupted work | Retain safe drafts/context and say whether completion is known or still unresolved. | Reconcile server/session state before repeating a mutation; never automatically replay irreversible work. |

## 7. Specifications and tokens

44 px item targets, p-1 popup, w-64 capped to viewport minus 2rem, max-height min(60dvh,28rem) with internal scroll. Panel fill and overlay shadow; wrap long labels. Do not use decorative line as the only boundary for an essential state.

Load [tokens CSS](../../tokens/tokens.css) once. Theme pairs: `bg/surface/panel` with `ink` or `muted`; fills use matching `on-*`; standalone links/essential accent marks use `accent-ink` or `brand-boundary`. `line` is decorative. No alpha text or opacity-based disabled state. `outline` on hover and raw dark `accent` on panel need special contrast care; use the tested functional boundary role. Geometry described here is a source contract, not a claim that new CSS variables exist. Wrap translation and enlarged text; use min-inline-size:0 and 320 CSS px reflow rather than clipping.

## 8. Interaction / accessibility

Trigger Enter/Space or ArrowDown opens at first item; ArrowUp opens at last. Popup arrows/Home/End wrap; printable characters perform single-character prefix search; Enter/Space activates. Escape closes/restores trigger. Tab closes (source restores trigger before default Tab); verify forward/backward destination in the composed page. Outside pointer and blur close.

| Key / input | Behaviour |
| --- | --- |
| Trigger arrows / Enter / Space | Open at first/last appropriate item. |
| Arrows / Home / End / characters | Traverse visible menuitems and single-character prefix search. |
| Escape / Tab | Close; source restoration/default Tab behaviour needs composition verification. |

Test name/role/value and reading order with a screen reader. The name contains the visible label. Associate errors with unique description IDs and announce status once without moving focus. Test both themes, 400% zoom, forced colours and reduced motion. Use system colours/visible borders in forced colours; do not suppress adaptation by default. Keep focus clear of sticky chrome. The house target is 44 px; WCAG minimum is 24×24 CSS px with exceptions. Provide click/tap alternatives to dragging. Native integrations test TalkBack/VoiceOver, large type and platform focus. These are required checks, **not claims of completed AT tests**. [Accessibility](../accessibility.md) maps criteria, system contracts and product responsibilities.

## 9. Content

Use verb-plus-object labels. Context belongs in the trigger’s accessible label; a disabled reason belongs with its item and should also be available visibly where necessary. Confirmation labels end in ….

Sentence case; translated labels and locale-aware plurals/numbers/dates/currency. Never expose raw error codes or invent a count. Money/evidence outcomes require actual confirmed completion and precise auditable consequences.

## 10. Do / don’t

| Do | Don’t / why |
| --- | --- |
| Keep one common action inline and place rare alternatives here. | Do not fill menus with forms, navigation trees or arbitrary disabled controls. |
| Use semantic role tokens and complete visible copy. | Do not copy reference hex colours, alpha text or paid Gilroy weights: they bypass the current theme/type contract. |

## 11. Implementation

**Observed API:** `OverflowMenu({actions,label='More actions',className='',mobileActions=[],showLabel=false})`, using shared Action fields. Empty action arrays render null. Disabled/pending items expose aria-disabled/aria-busy, remain focusable during menu traversal, and guard click. Menu closes before action/confirmation.

**App source, reference only:** [frontend/src/components/ui/OverflowMenu.tsx](https://github.com/SpaceWorks-Labs/SpaceWorks/blob/main/frontend/src/components/ui/OverflowMenu.tsx). Inspected in the supplied `int-stage-r2final` worktree; uncommitted content may differ from upstream main. [Implementation snapshot](implementation-snapshot.json) records exact file hashes. Neighbours: useRovingFocus.ts.

```tsx
<OverflowMenu label='More actions for Drill press' actions={[
  { label: 'View history', href: '/items/1/history' },
  { label: 'Archive', onClick: archive }
]} />
```

The snippet assumes the source app’s imports/state handlers. It is **not a standalone install**. Observed app dependencies include React 19.2, React Router 7.18, Tailwind 4.3, Lingui 6.10.1 and local motion/session modules. The [separate React starter](../adoption/react-tailwind.md) avoids these app dependencies. Preserve controlled values separately from fetched data. Only validated public/member brand roles take tenant overrides; staff chrome remains Space Works.

**Known limitations:** Source type-ahead is one character, not buffered search. aria-disabled items are included by rovingItems and announce the reason; do not describe them as native-disabled. The standalone details demo deliberately uses ordinary links/buttons and does not claim role=menu keyboard semantics.

The standalone gallery uses local sample data/simulated outcomes. Without JS, ordinary content/controls and inline explanations remain; async/modal enhancements require JS. Native source is starter-only, not compiled here.

## 12. Related and maintenance

[Button](button.md) · [Dialog](dialog.md) · [Select](select.md). [Named patterns/layouts](../patterns/README.md) retain P1–P30/L1–L10 and screen backlinks. [Fonts/licences](../../fonts/README.md), [portable logo master](../../brand/logo-masters.svg) and [design-resource availability](../adoption/README.md#design-and-asset-resources) connect the assets; no public editable library or native component download is asserted.

Evidence: source inspection/captured hashes, not an app/site AT certificate. History: first dedicated contract for planned v2.1.0; no API removal introduced here. [Release policy](../releases/versioning.md), [migrations](../releases/migration.md) and [contribution route](../contributing-design-system.md) govern maintenance.

