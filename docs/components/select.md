---
title: Select
description: Choose one value from a compact list of known options.
---

# Select

## 1. Title and support strip

Choose one value from a compact list of known options. Stable ID: `SWC-select`; source IDs: P15, P18, S9, L5, B. Maturity: **proposed**; availability: **documented reference**, not a published component package. Owner: Space Works design-system owner (SpaceWorks Labs); product maintainers own app integration. Documentation introduced/updated for **v2.1.0, planned** under decision 397. Last source verification: **2026-11-13**. Web implementation is described below; Compose/SwiftUI are starter mappings with **no verified component parity**.

## 2. Use it for / choose something else

Use native select for a known list. Radio exposes a short choice set; TextField accepts arbitrary text. A searchable remote picker needs a separately reviewed combobox contract.

**Extracted source contract:** [P15 — P15. Settings rows (R5, R16, R17)](../ux-spec.md#p15-settings-rows-r5-r16-r17) · [P18 — P18. Create form with live preview (R3)](../ux-spec.md#p18-create-form-with-live-preview-r3) · [S9 — S9. Makerspace settings (`settings`) ← R5 + R6 + R17](../ux-spec.md#s9-makerspace-settings-settings--r5--r6--r17) · [L5 — L5. `SettingsLayout` — sub-nav + sections of rows + sticky Discard/Save + DangerZone (R5, R6, R16, R17)](../ux-spec.md#l5-settingslayout--sub-nav--sections-of-rows--sticky-discardsave--dangerzone-r5-r6-r16-r17) · [B — B. Interaction states](../ui-brand-spec.md#b-interaction-states). The purpose, anatomy, variants and dimensions below condense those sections without moving their IDs or anchors. Source P rules describe observed reference boards; B/C and later decisions resolve brand adaptations.

[Authority and implementation status](README.md#authority-and-implementation-status) gives precedence. [Source inventory](source-inventory.json) preserves headings, table cells, code and links for publication checks.

## 3. Live example and complete code

[Full-page runnable example](../../examples/web/component-gallery.html#select): start `node examples/web/server.mjs` from the repository root, then open `http://localhost:4174/examples/web/component-gallery.html#select`. Choose Light/Dark, preview width and an applicable state; exercise hover, pressed and focus-visible with real input. Complete source: [HTML](../../examples/web/component-gallery.html), [behaviour](../../examples/web/gallery.mjs), [styles](../../examples/web/styles.css). No app module, network API or build step is required. These are portable reference compositions, not replicas of app exports.

```html
<label for="density">Density</label><select id="density"><option value="comfortable">Comfortable</option><option value="compact">Compact</option></select>
```

The linked shell supplies CSS/tokens and any `data-*` behaviour. Static text/native controls remain without JavaScript; modal content has an inline fallback. Copy the complete source for enhancements, not this fragment alone. [First-screen setup](../adoption/plain-html-css.md) shows the whole document.

## 4. Anatomy

Numbered reading-order diagram: `[1] → [2] → [3] → [4]`. Slots and name ownership:

1. Visible label: required and associated.
2. Native select and option children.
3. Optional empty prompt and group labels.
4. Hint/error text connected to the control.

## 5. Variants

Required or optional single selection; native optgroup for categories. ListColumns uses Comfortable/Compact density; LanguageSwitcher variant='select' supports explicit language and an optional space default. No generic Select export exists.

| Variant | Choose it for |
| --- | --- |
| Native single | Known closed set of options. |
| Prompt / optional | Explicit blank prompt or allowed no-selection value. |
| Language select | Task-specific LanguageSwitcher; local preference can outlive account-save failure. |

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
| Filtered-empty | N/A — this primitive does not filter results; the affected result region owns this state. | Preserve query and scope, offer Clear filters and announce the result once. |
| Error / retry | “Couldn’t save/load. Try again.” plus persistent explanation and specific recovery. | Keep the user’s value/context, relate field errors by ID and retry only the failed operation. |
| Offline | Keep clearly labelled last-known values and unsent drafts; explain network-only limitations. | Local navigation/editing/Close can remain available. Product owns safe retry/idempotency; queued is not completed. |
| Success | Show the completed effect and truthful updated value; use precise confirmation. | Announce once without taking focus; visible in-place changes need no redundant toast or invented success prop. |
| Interrupted work | Retain safe drafts/context and say whether completion is known or still unresolved. | Reconcile server/session state before repeating a mutation; never automatically replay irreversible work. |

## 7. Specifications and tokens

44 px minimum control, panel fill and outline boundary, ink value. Width follows its slot; long labels must not widen the page. The operating system owns the opened native option popup. Preserve platform high-contrast and touch behaviour.

Load [tokens CSS](../../tokens/tokens.css) once. Theme pairs: `bg/surface/panel` with `ink` or `muted`; fills use matching `on-*`; standalone links/essential accent marks use `accent-ink` or `brand-boundary`. `line` is decorative. No alpha text or opacity-based disabled state. `outline` on hover and raw dark `accent` on panel need special contrast care; use the tested functional boundary role. Geometry described here is a source contract, not a claim that new CSS variables exist. Wrap translation and enlarged text; use min-inline-size:0 and 320 CSS px reflow rather than clipping.

## 8. Interaction / accessibility

Tab enters/leaves. Native arrows/type-ahead choose options; opening/commit shortcuts follow the OS and browser. Escape dismisses the native popup where supported. Do not intercept its keys with Menu handlers.

| Key / input | Behaviour |
| --- | --- |
| Tab / OS picker keys | Native select focus, arrows/type-ahead and platform open/commit/dismiss keys. |

Test name/role/value and reading order with a screen reader. The name contains the visible label. Associate errors with unique description IDs and announce status once without moving focus. Test both themes, 400% zoom, forced colours and reduced motion. Use system colours/visible borders in forced colours; do not suppress adaptation by default. Keep focus clear of sticky chrome. The house target is 44 px; WCAG minimum is 24×24 CSS px with exceptions. Provide click/tap alternatives to dragging. Native integrations test TalkBack/VoiceOver, large type and platform focus. These are required checks, **not claims of completed AT tests**. [Accessibility](../accessibility.md) maps criteria, system contracts and product responsibilities.

## 9. Content

Use a task label and meaningful options. An empty prompt says “Choose a makerspace”; it is not a real value for a required selection. Distinguish “No options available” from “Couldn’t load options. Retry.”

Sentence case; translated labels and locale-aware plurals/numbers/dates/currency. Never expose raw error codes or invent a count. Money/evidence outcomes require actual confirmed completion and precise auditable consequences.

## 10. Do / don’t

| Do | Don’t / why |
| --- | --- |
| Keep a still-valid choice when reloading options and explain locked choices as static values. | Do not add role=menu to a select or assume readOnly prevents selection. |
| Use semantic role tokens and complete visible copy. | Do not copy reference hex colours, alpha text or paid Gilroy weights: they bypass the current theme/type contract. |

## 11. Implementation

**Observed API:** Native `value/defaultValue`, `onChange(event.target.value)`, name, required and disabled. LanguageSwitcher takes variant ('menu'|'select') and optional onPersist(code|null):Promise; it persists browser language first and reports account-persistence failure. Native select has no readOnly.

**App source, reference only:** [frontend/src/components/shell/LanguageSwitcher.tsx](https://github.com/SpaceWorks-Labs/SpaceWorks/blob/main/frontend/src/components/shell/LanguageSwitcher.tsx). Inspected in the supplied `int-stage-r2final` worktree; uncommitted content may differ from upstream main. [Implementation snapshot](implementation-snapshot.json) records exact file hashes. Neighbours: ListColumns.tsx.

```tsx
<Field label='Density'><select className='desk-input' value={density}
  onChange={e => setDensity(e.target.value)}>
  <option value='comfortable'>Comfortable</option><option value='compact'>Compact</option>
</select></Field>
```

The snippet assumes the source app’s imports/state handlers. It is **not a standalone install**. Observed app dependencies include React 19.2, React Router 7.18, Tailwind 4.3, Lingui 6.10.1 and local motion/session modules. The [separate React starter](../adoption/react-tailwind.md) avoids these app dependencies. Preserve controlled values separately from fetched data. Only validated public/member brand roles take tenant overrides; staff chrome remains Space Works.

**Known limitations:** The system does not ship an asynchronous Select/combobox. Loading options, stale-value handling and errors belong to the product. Select-only language changes apply locally even if account persistence fails; report that precisely.

The standalone gallery uses local sample data/simulated outcomes. Without JS, ordinary content/controls and inline explanations remain; async/modal enhancements require JS. Native source is starter-only, not compiled here.

## 12. Related and maintenance

[Radio](radio.md) · [TextField and SearchField](text-field.md) · [Menu](menu.md). [Named patterns/layouts](../patterns/README.md) retain P1–P30/L1–L10 and screen backlinks. [Fonts/licences](../../fonts/README.md), [portable logo master](../../brand/logo-masters.svg) and [design-resource availability](../adoption/README.md#design-and-asset-resources) connect the assets; no public editable library or native component download is asserted.

Evidence: source inspection/captured hashes, not an app/site AT certificate. History: first dedicated contract for planned v2.1.0; no API removal introduced here. [Release policy](../releases/versioning.md), [migrations](../releases/migration.md) and [contribution route](../contributing-design-system.md) govern maintenance.

