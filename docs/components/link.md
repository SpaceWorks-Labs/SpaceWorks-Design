---
title: Link
description: Navigate to a named destination or resource.
---

# Link

## 1. Title and support strip

Navigate to a named destination or resource. Stable ID: `SWC-link`; source IDs: P11, P3, S6, L4, B. Maturity: **proposed**; availability: **documented reference**, not a published component package. Owner: Space Works design-system owner, Shaan Shoukath; product maintainers own app integration. Documentation introduced/updated for **v2.1.0, planned** under decision 397. Last source verification: **2026-11-13**. Web implementation is described below; Compose/SwiftUI are starter mappings with **no verified component parity**.

## 2. Use it for / choose something else

Use for a route, Back link, download or in-page destination. Use Button for save, reveal or mutation; a visual text action can still be a button.

**Extracted source contract:** [P11 — P11. Buttons](../ux-spec.md#p11-buttons) · [P3 — P3. Detail header with back link, identity chip and underline tabs (R7–R10)](../ux-spec.md#p3-detail-header-with-back-link-identity-chip-and-underline-tabs-r7r10) · [S6 — S6. Inventory item detail ← R7 (detail header + tabs) + R5 (settings rows, danger zone)](../ux-spec.md#s6-inventory-item-detail--r7-detail-header--tabs--r5-settings-rows-danger-zone) · [L4 — L4. `DetailLayout` — back + identity + title/status/meta + actions + underline tabs + main/aside (R7–R10)](../ux-spec.md#l4-detaillayout--back--identity--titlestatusmeta--actions--underline-tabs--mainaside-r7r10) · [B — B. Interaction states](../ui-brand-spec.md#b-interaction-states). The purpose, anatomy, variants and dimensions below condense those sections without moving their IDs or anchors. Source P rules describe observed reference boards; B/C and later decisions resolve brand adaptations.

[Authority and implementation status](README.md#authority-and-implementation-status) gives precedence. [Source inventory](source-inventory.json) preserves headings, table cells, code and links for publication checks.

## 3. Live example and complete code

[Full-page runnable example](../../examples/web/component-gallery.html#link): start `node examples/web/server.mjs` from the repository root, then open `http://localhost:4174/examples/web/component-gallery.html#link`. Choose Light/Dark, preview width and an applicable state; exercise hover, pressed and focus-visible with real input. Complete source: [HTML](../../examples/web/component-gallery.html), [behaviour](../../examples/web/gallery.mjs), [styles](../../examples/web/styles.css). No app module, network API or build step is required. These are portable reference compositions, not replicas of app exports.

```html
<a href="#main-content">View the first-screen example</a>
```

The linked shell supplies CSS/tokens and any `data-*` behaviour. Static text/native controls remain without JavaScript; modal content has an inline fallback. Copy the complete source for enhancements, not this fragment alone. [First-screen setup](../adoption/plain-html-css.md) shows the whole document.

## 4. Anatomy

Numbered reading-order diagram: `[1] → [2] → [3] → [4]`. Slots and name ownership:

1. Anchor with real href: required destination.
2. Visible descriptive text: owns its name.
3. Optional external indicator: supplementary to a clear destination.
4. Current-page marker: aria-current when used in navigation.

## 5. Variants

Inline text link; detail Back link; navigation current link; external/new-tab link; download. RouteLink chooses router navigation only for eligible internal URLs. It is not a disabled-link widget.

| Variant | Choose it for |
| --- | --- |
| Inline / back | A text destination or return to list context. |
| Route / external | Client route when eligible / ordinary browser link for external, hash or new-tab destinations. |

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
| Loading / pending | The destination region owns route loading; href remains meaningful. | RouteLink has no loading prop. Product supplies title and route focus. |
| Empty | N/A — an action/destination is not a result collection; an empty label is invalid. | Never confuse no records with pending, denied access or failure. |
| Filtered-empty | N/A — this primitive does not filter results; the affected result region owns this state. | Preserve query and scope, offer Clear filters and announce the result once. |
| Error / retry | Destination errors belong to the destination error region. | Retain a working Back/retry route; Link itself does not fetch. |
| Offline | Keep clearly labelled last-known values and unsent drafts; explain network-only limitations. | Local navigation/editing/Close can remain available. Product owns safe retry/idempotency; queued is not completed. |
| Success | Show the completed effect and truthful updated value; use precise confirmation. | Announce once without taking focus; visible in-place changes need no redundant toast or invented success prop. |
| Interrupted work | Retain safe drafts/context and say whether completion is known or still unresolved. | Reconcile server/session state before repeating a mutation; never automatically replay irreversible work. |

## 7. Specifications and tokens

Use accent-ink for text, an underline in prose, and a focus ring with offset. Inline links can use the inline target-size exception; standalone navigation targets follow the 44 px house rule. Allow long labels and URLs to wrap.

Load [tokens CSS](../../tokens/tokens.css) once. Theme pairs: `bg/surface/panel` with `ink` or `muted`; fills use matching `on-*`; standalone links/essential accent marks use `accent-ink` or `brand-boundary`. `line` is decorative. No alpha text or opacity-based disabled state. `outline` on hover and raw dark `accent` on panel need special contrast care; use the tested functional boundary role. Geometry described here is a source contract, not a claim that new CSS variables exist. Wrap translation and enlarged text; use min-inline-size:0 and 320 CSS px reflow rather than clipping.

## 8. Interaction / accessibility

Tab / Shift+Tab: visit href anchors. Enter: follow. Space scrolls, as for a native link. Preserve open-in-new-tab, copy-link and modified-click behaviour. Route changes require product title and focus handling.

| Key / input | Behaviour |
| --- | --- |
| Tab / Enter | Visit href link / follow destination. |
| Space / modified clicks | Native scroll / browser navigation behaviours, not button activation. |

Test name/role/value and reading order with a screen reader. The name contains the visible label. Associate errors with unique description IDs and announce status once without moving focus. Test both themes, 400% zoom, forced colours and reduced motion. Use system colours/visible borders in forced colours; do not suppress adaptation by default. Keep focus clear of sticky chrome. The house target is 44 px; WCAG minimum is 24×24 CSS px with exceptions. Provide click/tap alternatives to dragging. Native integrations test TalkBack/VoiceOver, large type and platform focus. These are required checks, **not claims of completed AT tests**. [Accessibility](../accessibility.md) maps criteria, system contracts and product responsibilities.

## 9. Content

Name the destination (“Member account”), rather than “Click here”. Explain a new tab when it matters, with an external indicator as required by the UX quality bar. Downloads identify format and size when known.

Sentence case; translated labels and locale-aware plurals/numbers/dates/currency. Never expose raw error codes or invent a count. Money/evidence outcomes require actual confirmed completion and precise auditable consequences.

## 10. Do / don’t

| Do | Don’t / why |
| --- | --- |
| Use a real href and retain the browser context menu. | Do not put a save mutation in href='#' or treat aria-disabled alone as click prevention. |
| Use semantic role tokens and complete visible copy. | Do not copy reference hex colours, alpha text or paid Gilroy weights: they bypass the current theme/type contract. |

## 11. Implementation

**Observed API:** `RouteLink` accepts `AnchorHTMLAttributes<HTMLAnchorElement>`. Inside a router, a single-leading-slash href without target='_blank' uses TransitionLink; other hrefs use an anchor. React Router and the app motion module are dependencies. No loading, disabled or readOnly prop is defined.

**App source, reference only:** [frontend/src/components/ui/RouteLink.tsx](https://github.com/SpaceWorks-Labs/SpaceWorks/blob/main/frontend/src/components/ui/RouteLink.tsx). Inspected in the supplied `int-stage-r2final` worktree; uncommitted content may differ from upstream main. [Implementation snapshot](implementation-snapshot.json) records exact file hashes. Neighbours: shared types, desk CSS and motion modules.

```tsx
<RouteLink href='/member/account' aria-current='page'>Account</RouteLink>
```

The snippet assumes the source app’s imports/state handlers. It is **not a standalone install**. Observed app dependencies include React 19.2, React Router 7.18, Tailwind 4.3, Lingui 6.10.1 and local motion/session modules. The [separate React starter](../adoption/react-tailwind.md) avoids these app dependencies. Preserve controlled values separately from fetched data. Only validated public/member brand roles take tenant overrides; staff chrome remains Space Works.

**Known limitations:** RouteLink does not implement route titles, focus restoration or status feedback. An anchor without href is not a functional link. ActionControl deliberately removes href for blocked actions; products must explain the reason and expose an accessible alternative.

The standalone gallery uses local sample data/simulated outcomes. Without JS, ordinary content/controls and inline explanations remain; async/modal enhancements require JS. Native source is starter-only, not compiled here.

## 12. Related and maintenance

[Button](button.md) · [Tabs](tabs.md) · [Menu](menu.md). [Named patterns/layouts](../patterns/README.md) retain P1–P30/L1–L10 and screen backlinks. [Fonts/licences](../../fonts/README.md), [portable logo master](../../brand/logo-masters.svg) and [design-resource availability](../adoption/README.md#design-and-asset-resources) connect the assets; no public editable library or native component download is asserted.

Evidence: source inspection/captured hashes, not an app/site AT certificate. History: first dedicated contract for planned v2.1.0; no API removal introduced here. [Release policy](../releases/versioning.md), [migrations](../releases/migration.md) and [contribution route](../contributing-design-system.md) govern maintenance.

