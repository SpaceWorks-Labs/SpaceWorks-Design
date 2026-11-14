---
title: StatusPill
description: Name a record’s status with a compact, supplementary colour cue.
---

# StatusPill

## 1. Title and support strip

Name a record’s status with a compact, supplementary colour cue. Stable ID: `SWC-status-pill`; source IDs: P10, S1, S5, L4, C. Maturity: **proposed**; availability: **documented reference**, not a published component package. Owner: Space Works design-system owner (SpaceWorks Labs); product maintainers own app integration. Documentation introduced/updated for **v2.1.0, planned** under decision 397. Last source verification: **2026-11-13**. Web implementation is described below; Compose/SwiftUI are starter mappings with **no verified component parity**.

## 2. Use it for / choose something else

Use for status metadata such as Available, Unpaid or Returned. Use Checkbox/choice chips for selection and Button for an action. A status word is mandatory; colour alone never carries the meaning.

**Extracted source contract:** [P10 — P10. Pills and chips](../ux-spec.md#p10-pills-and-chips) · [S1 — S1. Staff Home / Dashboard (`dashboard`) ← R1 + R2](../ux-spec.md#s1-staff-home--dashboard-dashboard--r1--r2) · [S5 — S5. Inventory list (`inventory`) ← R2 header/stat cards + adapted dense table (§5)](../ux-spec.md#s5-inventory-list-inventory--r2-headerstat-cards--adapted-dense-table-5) · [L4 — L4. `DetailLayout` — back + identity + title/status/meta + actions + underline tabs + main/aside (R7–R10)](../ux-spec.md#l4-detaillayout--back--identity--titlestatusmeta--actions--underline-tabs--mainaside-r7r10) · [C — C. Status pills](../ui-brand-spec.md#c-status-pills). The purpose, anatomy, variants and dimensions below condense those sections without moving their IDs or anchors. Source P rules describe observed reference boards; B/C and later decisions resolve brand adaptations.

> **Authority note (2026-11-13):** C/D6’s soft dark success/warn/info marks disagree with later lesson 9 and inspected `tones.ts`. Follow solid small marks in both themes, with big tinted blocks retaining their distinct dark-soft contract. This is a recorded discrepancy; no original sentence was edited.

[Authority and implementation status](README.md#authority-and-implementation-status) gives precedence. [Source inventory](source-inventory.json) preserves headings, table cells, code and links for publication checks.

## 3. Live example and complete code

[Full-page runnable example](../../examples/web/component-gallery.html#status-pill): start `node examples/web/server.mjs` from the repository root, then open `http://localhost:4174/examples/web/component-gallery.html#status-pill`. Choose Light/Dark, preview width and an applicable state; exercise hover, pressed and focus-visible with real input. Complete source: [HTML](../../examples/web/component-gallery.html), [behaviour](../../examples/web/gallery.mjs), [styles](../../examples/web/styles.css). No app module, network API or build step is required. These are portable reference compositions, not replicas of app exports.

```html
<span class="pill">Available</span>
```

The linked shell supplies CSS/tokens and any `data-*` behaviour. Static text/native controls remain without JavaScript; modal content has an inline fallback. Copy the complete source for enhancements, not this fragment alone. [First-screen setup](../adoption/plain-html-css.md) shows the whole document.

## 4. Anatomy

Numbered reading-order diagram: `[1] → [2] → [3] → [4]`. Slots and name ownership:

1. Noninteractive span container.
2. Optional/default decorative tone icon.
3. Mandatory visible status word.
4. Optional children override: must still contain a meaningful word.

## 5. Variants

Tone: success, warn, danger, accent, emphasis, info, neutral. Success/warn/info use solid brand fills in both themes; emphasis is solid orange, accent is soft with accent-ink, danger is panel with danger text/line, neutral is surface/ink. Domain labels and backend mappings remain in C.

| Variant | Choose it for |
| --- | --- |
| Success / warn / info | Solid small marks with corresponding on-fill labels in both modes. |
| Accent / emphasis | Soft accent-ink / solid orange for appropriate domain status. |
| Danger / neutral | Panel with danger text / surface with ink; words remain mandatory. |

Native products use platform controls with mapped roles/settings. A web keyboard model does not establish native parity. Gallery variants/states are reference compositions, not undocumented app props.

## 6. States

State handling belongs either to this primitive or the containing task explicitly named below. N/A records a semantic or API limitation, not an omitted requirement.

| State | Presentation / copy | Action, focus, announcement and data |
| --- | --- | --- |
| Default | Required visible name, correct role and truthful current value/context. | Enabled actions follow §8; no automatic announcement for static content. |
| Hover | N/A — this container/artwork is not interactive. | No hover-exclusive instructions; child controls retain their own contracts. |
| Pressed | N/A — this primitive has no activation. | Native click/release activates once; optional child actions use Button. |
| Focus-visible | N/A — content/artwork is not a Tab stop. | Keep focused actions visible above sticky chrome and the software keyboard. |
| Selected | N/A — this primitive is not a choice; IconButton can accept aria-pressed for a genuine toggle. | Caller controls selection; keep values stable through failed persistence. |
| Disabled | N/A — noninteractive information remains readable. | Use native disabled where supported; aria-disabled requires event guards. Consult §11 for unsupported props. |
| Read-only | N/A — no read-only component mode; noneditable information already reads as text. | No read-only API is claimed. For a locked choice, present a labelled static value; native checkbox/radio/select do not honour readOnly. |
| Loading / pending | N/A as an interaction state — the span names only a supplied status. | Product can supply Pending/Unknown/Failed/Offline/Available when truthful. The pill never fetches, retries or announces automatically. |
| Empty | N/A as an interaction state — the span names only a supplied status. | Product can supply Pending/Unknown/Failed/Offline/Available when truthful. The pill never fetches, retries or announces automatically. |
| Filtered-empty | N/A as an interaction state — the span names only a supplied status. | Product can supply Pending/Unknown/Failed/Offline/Available when truthful. The pill never fetches, retries or announces automatically. |
| Error / retry | N/A as an interaction state — the span names only a supplied status. | Product can supply Pending/Unknown/Failed/Offline/Available when truthful. The pill never fetches, retries or announces automatically. |
| Offline | N/A as an interaction state — the span names only a supplied status. | Product can supply Pending/Unknown/Failed/Offline/Available when truthful. The pill never fetches, retries or announces automatically. |
| Success | N/A as an interaction state — the span names only a supplied status. | Product can supply Pending/Unknown/Failed/Offline/Available when truthful. The pill never fetches, retries or announces automatically. |
| Interrupted work | N/A as an interaction state — the span names only a supplied status. | Product can supply Pending/Unknown/Failed/Offline/Available when truthful. The pill never fetches, retries or announces automatically. |

## 7. Specifications and tokens

Actual min-height 24 px, 12 px semibold, full radius, gap-1, px-2 and py-0.5; public spec allows 32 px. Noninteractive pills do not need a 44 px target. Long labels may wrap without splitting individual letters; keep max-width bounded.

Load [tokens CSS](../../tokens/tokens.css) once. Theme pairs: `bg/surface/panel` with `ink` or `muted`; fills use matching `on-*`; standalone links/essential accent marks use `accent-ink` or `brand-boundary`. `line` is decorative. No alpha text or opacity-based disabled state. `outline` on hover and raw dark `accent` on panel need special contrast care; use the tested functional boundary role. Geometry described here is a source contract, not a claim that new CSS variables exist. Wrap translation and enlarged text; use min-inline-size:0 and 320 CSS px reflow rather than clipping.

## 8. Interaction / accessibility

Not focusable and has no activation keys. Reading order follows the related object. For a live status change, announce a meaningful sentence in a separate status region; do not turn every static pill into a live region.

| Key / input | Behaviour |
| --- | --- |
| Reading order | Not a Tab stop; no keyboard activation. Product announces meaningful live changes separately. |

Test name/role/value and reading order with a screen reader. The name contains the visible label. Associate errors with unique description IDs and announce status once without moving focus. Test both themes, 400% zoom, forced colours and reduced motion. Use system colours/visible borders in forced colours; do not suppress adaptation by default. Keep focus clear of sticky chrome. The house target is 44 px; WCAG minimum is 24×24 CSS px with exceptions. Provide click/tap alternatives to dragging. Native integrations test TalkBack/VoiceOver, large type and platform focus. These are required checks, **not claims of completed AT tests**. [Accessibility](../accessibility.md) maps criteria, system contracts and product responsibilities.

## 9. Content

Use the vocabulary from C and the backend’s actual state. Overdue includes duration (“Overdue 3 days”). Do not present a stale cached value as current availability while offline.

Sentence case; translated labels and locale-aware plurals/numbers/dates/currency. Never expose raw error codes or invent a count. Money/evidence outcomes require actual confirmed completion and precise auditable consequences.

## 10. Do / don’t

| Do | Don’t / why |
| --- | --- |
| Show a readable word and keep the same tone meaning across products. | Do not turn a status pill into a filter control or reuse pastel fill tokens for standalone text. |
| Use semantic role tokens and complete visible copy. | Do not copy reference hex colours, alpha text or paid Gilroy weights: they bypass the current theme/type contract. |

## 11. Implementation

**Observed API:** `StatusPill({label,tone='neutral',icon?,children?})`. Icon defaults by tone and is always rendered through Icon; blank trimmed label falls back to translated Unknown, unless truthy children override. No onClick, selected, disabled or pending props exist.

**App source, reference only:** [frontend/src/components/ui/StatusPill.tsx](https://github.com/SpaceWorks-Labs/SpaceWorks/blob/main/frontend/src/components/ui/StatusPill.tsx). Inspected in the supplied `int-stage-r2final` worktree; uncommitted content may differ from upstream main. [Implementation snapshot](implementation-snapshot.json) records exact file hashes. Neighbours: tones.ts.

```tsx
<StatusPill label='Available' tone='success' />
```

The snippet assumes the source app’s imports/state handlers. It is **not a standalone install**. Observed app dependencies include React 19.2, React Router 7.18, Tailwind 4.3, Lingui 6.10.1 and local motion/session modules. The [separate React starter](../adoption/react-tailwind.md) avoids these app dependencies. Preserve controlled values separately from fetched data. Only validated public/member brand roles take tenant overrides; staff chrome remains Space Works.

**Known limitations:** C still describes soft dark success/warn/info while later lessons and real tones.ts use solid marks in both themes. This page follows the later rule; a dated authority note below records the discrepancy. The legacy label/children combination can bypass the fallback, so callers must supply a real word.

The standalone gallery uses local sample data/simulated outcomes. Without JS, ordinary content/controls and inline explanations remain; async/modal enhancements require JS. Native source is starter-only, not compiled here.

## 12. Related and maintenance

[Table](table.md) · [EmptyState](empty-state.md) · [Toast](toast.md). [Named patterns/layouts](../patterns/README.md) retain P1–P30/L1–L10 and screen backlinks. [Fonts/licences](../../fonts/README.md), [portable logo master](../../brand/logo-masters.svg) and [design-resource availability](../adoption/README.md#design-and-asset-resources) connect the assets; no public editable library or native component download is asserted.

Evidence: source inspection/captured hashes, not an app/site AT certificate. History: first dedicated contract for planned v2.1.0; no API removal introduced here. [Release policy](../releases/versioning.md), [migrations](../releases/migration.md) and [contribution route](../contributing-design-system.md) govern maintenance.

