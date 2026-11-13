---
title: Tabs
description: Switch between related sections while exposing which section is current.
---

# Tabs

## 1. Title and support strip

Switch between related sections while exposing which section is current. Stable ID: `SWC-tabs`; source IDs: P8, P3, S6, L4, B. Maturity: **proposed**; availability: **documented reference**, not a published component package. Owner: Space Works design-system owner, Shaan Shoukath; product maintainers own app integration. Documentation introduced/updated for **v2.1.0, planned** under decision 397. Last source verification: **2026-11-13**. Web implementation is described below; Compose/SwiftUI are starter mappings with **no verified component parity**.

## 2. Use it for / choose something else

Use route tabs for URL-addressable detail sections and list-filter views. Use panel tabs for immediate local content; SegmentedControl is for two or three views of the same object. Omit gated tabs rather than disable them.

**Extracted source contract:** [P8 — P8. Underline tabs with inline counts (R2, R7, R16)](../ux-spec.md#p8-underline-tabs-with-inline-counts-r2-r7-r16) · [P3 — P3. Detail header with back link, identity chip and underline tabs (R7–R10)](../ux-spec.md#p3-detail-header-with-back-link-identity-chip-and-underline-tabs-r7r10) · [S6 — S6. Inventory item detail ← R7 (detail header + tabs) + R5 (settings rows, danger zone)](../ux-spec.md#s6-inventory-item-detail--r7-detail-header--tabs--r5-settings-rows-danger-zone) · [L4 — L4. `DetailLayout` — back + identity + title/status/meta + actions + underline tabs + main/aside (R7–R10)](../ux-spec.md#l4-detaillayout--back--identity--titlestatusmeta--actions--underline-tabs--mainaside-r7r10) · [B — B. Interaction states](../ui-brand-spec.md#b-interaction-states). The purpose, anatomy, variants and dimensions below condense those sections without moving their IDs or anchors. Source P rules describe observed reference boards; B/C and later decisions resolve brand adaptations.

[Authority and implementation status](README.md#authority-and-implementation-status) gives precedence. [Source inventory](source-inventory.json) preserves headings, table cells, code and links for publication checks.

## 3. Live example and complete code

[Full-page runnable example](../../examples/web/component-gallery.html#tabs): start `node examples/web/server.mjs` from the repository root, then open `http://localhost:4174/examples/web/component-gallery.html#tabs`. Choose Light/Dark, preview width and an applicable state; exercise hover, pressed and focus-visible with real input. Complete source: [HTML](../../examples/web/component-gallery.html), [behaviour](../../examples/web/gallery.mjs), [styles](../../examples/web/styles.css). No app module, network API or build step is required. These are portable reference compositions, not replicas of app exports.

```html
<nav aria-label="Item sections"><a href="#tabs" aria-current="page">Details</a> <a href="#table">History</a></nav>
```

The linked shell supplies CSS/tokens and any `data-*` behaviour. Static text/native controls remain without JavaScript; modal content has an inline fallback. Copy the complete source for enhancements, not this fragment alone. [First-screen setup](../adoption/plain-html-css.md) shows the whole document.

## 4. Anatomy

Numbered reading-order diagram: `[1] → [2] → [3] → [4]`. Slots and name ownership:

1. Named nav or tablist: required.
2. Labels with optional inline counts: accessible names include counts.
3. Current underline and font weight: supplementary to semantics.
4. Route content or one labelled panel: owned by the active key.

## 5. Variants

Without onChange: RouteLink children in nav with aria-current='page'. With onChange: buttons role=tab, roving tabIndex and one tabpanel containing children. One active key; invalid key falls back to first tab. Counts are plain muted text, never badges.

| Variant | Choose it for |
| --- | --- |
| Route links | URL-addressable section; use nav and aria-current. |
| Local panels | onChange renders tab buttons and a labelled panel; immediate activation. |

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

44 px targets, 2 px underline, normal/semibold labels, border-line baseline. Narrow bars scroll internally and keep the active tab visible; do not widen the page. Necessary dark-panel underline uses accent-ink/brand-boundary; raw accent is 2.99:1 there.

Load [tokens CSS](../../tokens/tokens.css) once. Theme pairs: `bg/surface/panel` with `ink` or `muted`; fills use matching `on-*`; standalone links/essential accent marks use `accent-ink` or `brand-boundary`. `line` is decorative. No alpha text or opacity-based disabled state. `outline` on hover and raw dark `accent` on panel need special contrast care; use the tested functional boundary role. Geometry described here is a source contract, not a claim that new CSS variables exist. Wrap translation and enlarged text; use min-inline-size:0 and 320 CSS px reflow rather than clipping.

## 8. Interaction / accessibility

Panel mode: Tab enters selected tab, arrows wrap and activate, Home/End select first/last; Tab goes to the focusable panel. Route mode: native link activation with Enter; the app also adds arrow/Home/End roving without activation. Do not describe route links as ARIA tabs.

| Key / input | Behaviour |
| --- | --- |
| Tab / arrows / Home / End | Use the mode-specific route-versus-panel/radio model described above. |
| Enter / Space | Route links use Enter; button-backed panel/radio choices activate natively. |

Test name/role/value and reading order with a screen reader. The name contains the visible label. Associate errors with unique description IDs and announce status once without moving focus. Test both themes, 400% zoom, forced colours and reduced motion. Use system colours/visible borders in forced colours; do not suppress adaptation by default. Keep focus clear of sticky chrome. The house target is 44 px; WCAG minimum is 24×24 CSS px with exceptions. Provide click/tap alternatives to dragging. Native integrations test TalkBack/VoiceOver, large type and platform focus. These are required checks, **not claims of completed AT tests**. [Accessibility](../accessibility.md) maps criteria, system contracts and product responsibilities.

## 9. Content

Use short parallel section labels, actionable inline counts and no badge fill. Keep the route in the URL for detail tabs. Announce loading within the panel without moving keyboard focus back to the bar.

Sentence case; translated labels and locale-aware plurals/numbers/dates/currency. Never expose raw error codes or invent a count. Money/evidence outcomes require actual confirmed completion and precise auditable consequences.

## 10. Do / don’t

| Do | Don’t / why |
| --- | --- |
| Keep stable keys and explicit route hrefs; omit unavailable sections before passing tabs. | Do not apply role=tab to navigation anchors without implementing panel semantics. |
| Use semantic role tokens and complete visible copy. | Do not copy reference hex colours, alpha text or paid Gilroy weights: they bypass the current theme/type contract. |

## 11. Implementation

**Observed API:** `Tabs({tabs,activeKey,label='Page sections',onChange?,children?})`. Tab = {key,label,href?,count?}; no disabled prop. Panel mode creates IDs/controls/label relationships. The onChange callback must update activeKey and children; route mode needs a valid href for every tab.

**App source, reference only:** [frontend/src/components/ui/Tabs.tsx](https://github.com/SpaceWorks-Labs/SpaceWorks/blob/main/frontend/src/components/ui/Tabs.tsx). Inspected in the supplied `int-stage-r2final` worktree; uncommitted content may differ from upstream main. [Implementation snapshot](implementation-snapshot.json) records exact file hashes. Neighbours: useRovingFocus.ts.

```tsx
<Tabs tabs={[{ key: 'details', label: 'Details', href: '/items/1/details' },
  { key: 'history', label: 'History', href: '/items/1/history' }]} activeKey='details' />
```

The snippet assumes the source app’s imports/state handlers. It is **not a standalone install**. Observed app dependencies include React 19.2, React Router 7.18, Tailwind 4.3, Lingui 6.10.1 and local motion/session modules. The [separate React starter](../adoption/react-tailwind.md) avoids these app dependencies. Preserve controlled values separately from fetched data. Only validated public/member brand roles take tenant overrides; staff chrome remains Space Works.

**Known limitations:** Panel mode auto-activates and renders one shared panel; it is unsuitable for slow remote switching without a product loading strategy. The component does not fetch data or own title/focus after navigation. Dark underline contrast needs consumption-time verification.

The standalone gallery uses local sample data/simulated outcomes. Without JS, ordinary content/controls and inline explanations remain; async/modal enhancements require JS. Native source is starter-only, not compiled here.

## 12. Related and maintenance

[SegmentedControl](segmented-control.md) · [Link](link.md) · [Table](table.md). [Named patterns/layouts](../patterns/README.md) retain P1–P30/L1–L10 and screen backlinks. [Fonts/licences](../../fonts/README.md), [portable logo master](../../brand/logo-masters.svg) and [design-resource availability](../adoption/README.md#design-and-asset-resources) connect the assets; no public editable library or native component download is asserted.

Evidence: source inspection/captured hashes, not an app/site AT certificate. History: first dedicated contract for planned v2.1.0; no API removal introduced here. [Release policy](../releases/versioning.md), [migrations](../releases/migration.md) and [contribution route](../contributing-design-system.md) govern maintenance.

