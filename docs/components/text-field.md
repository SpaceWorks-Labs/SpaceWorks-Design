---
title: TextField and SearchField
description: Collect editable text or a search query with a persistent label.
---

# TextField and SearchField

## 1. Title and support strip

Collect editable text or a search query with a persistent label. Stable ID: `SWC-text-field`; source IDs: P15, P18, S9, L5, B. Maturity: **proposed**; availability: **documented reference**, not a published component package. Owner: Space Works design-system owner (SpaceWorks Labs); product maintainers own app integration. Documentation introduced/updated for **v2.1.0, planned** under decision 397. Last source verification: **2026-11-13**. Web implementation is described below; Compose/SwiftUI are starter mappings with **no verified component parity**.

## 2. Use it for / choose something else

Use a text input for a short value, textarea for long text, and SearchField for filtering/search. Use Select or Radio for a closed set. Keep read-only values selectable and explain why editing is unavailable.

**Extracted source contract:** [P15 — P15. Settings rows (R5, R16, R17)](../ux-spec.md#p15-settings-rows-r5-r16-r17) · [P18 — P18. Create form with live preview (R3)](../ux-spec.md#p18-create-form-with-live-preview-r3) · [S9 — S9. Makerspace settings (`settings`) ← R5 + R6 + R17](../ux-spec.md#s9-makerspace-settings-settings--r5--r6--r17) · [L5 — L5. `SettingsLayout` — sub-nav + sections of rows + sticky Discard/Save + DangerZone (R5, R6, R16, R17)](../ux-spec.md#l5-settingslayout--sub-nav--sections-of-rows--sticky-discardsave--dangerzone-r5-r6-r16-r17) · [B — B. Interaction states](../ui-brand-spec.md#b-interaction-states). The purpose, anatomy, variants and dimensions below condense those sections without moving their IDs or anchors. Source P rules describe observed reference boards; B/C and later decisions resolve brand adaptations.

[Authority and implementation status](README.md#authority-and-implementation-status) gives precedence. [Source inventory](source-inventory.json) preserves headings, table cells, code and links for publication checks.

## 3. Live example and complete code

[Full-page runnable example](../../examples/web/component-gallery.html#text-field): start `node examples/web/server.mjs` from the repository root, then open `http://localhost:4174/examples/web/component-gallery.html#text-field`. Choose Light/Dark, preview width and an applicable state; exercise hover, pressed and focus-visible with real input. Complete source: [HTML](../../examples/web/component-gallery.html), [behaviour](../../examples/web/gallery.mjs), [styles](../../examples/web/styles.css). No app module, network API or build step is required. These are portable reference compositions, not replicas of app exports.

```html
<label for="query">Search inventory</label><input id="query" type="search" aria-describedby="query-hint"><p id="query-hint">Search by name or code.</p>
```

The linked shell supplies CSS/tokens and any `data-*` behaviour. Static text/native controls remain without JavaScript; modal content has an inline fallback. Copy the complete source for enhancements, not this fragment alone. [First-screen setup](../adoption/plain-html-css.md) shows the whole document.

## 4. Anatomy

Numbered reading-order diagram: `[1] → [2] → [3] → [4] → [5]`. Slots and name ownership:

1. Field label: required, visible, associated with one control.
2. Input: value, appropriate type and autocomplete.
3. Optional hint and prefix: read before acting; prefix is not the name.
4. Error text: connected by aria-describedby with aria-invalid.
5. Search only: magnifier, optional loading status, clear button and shortcut hint.

## 5. Variants

Native input/textarea inside Field; native readOnly value; SearchField controlled or defaultValue. Search options: expand, bare, shortcut, fixedIcon, adornmentClassName, loading/loadingLabel, clearLabel, clearOnEscape. A shortcut hint does not register a shortcut.

| Variant | Choose it for |
| --- | --- |
| Native input / textarea | Short / long editable values, wrapped by Field. |
| SearchField | Query with clear/loading artwork; not a combobox. |
| Read-only | Selectable locked value with explanation. |
| Bare / expand | Framed parent supplies boundary / fixed-width slot grows on focus. |

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
| Read-only | Preserve selectable text with readOnly and explain the lock. | Checkbox, radio and select have no native readOnly lock; show a labelled static value instead. Search hides clear and does not clear on Escape. |
| Loading / pending | Keep context; use task-specific pending copy such as “Saving…”. | Disable only the mutation in progress, announce once and preserve drafts. Fetch state is product-owned unless §11 says otherwise. |
| Empty | Show absence only after a successful load, with a useful next step. | Never confuse no records with pending, denied access or failure. |
| Filtered-empty | “No items match your filters. Clear filters above.” | Preserve query and scope, offer Clear filters and announce the result once. |
| Error / retry | “Couldn’t save/load. Try again.” plus persistent explanation and specific recovery. | Keep the user’s value/context, relate field errors by ID and retry only the failed operation. |
| Offline | Keep clearly labelled last-known values and unsent drafts; explain network-only limitations. | Local navigation/editing/Close can remain available. Product owns safe retry/idempotency; queued is not completed. |
| Success | Show the completed effect and truthful updated value; use precise confirmation. | Announce once without taking focus; visible in-place changes need no redundant toast or invented success prop. |
| Interrupted work | Retain safe drafts/context and say whether completion is known or still unresolved. | Reconcile server/session state before repeating a mutation; never automatically replay irreversible work. |

## 7. Specifications and tokens

44 px minimum input height, outline boundary on panel, muted placeholder, ink value; invalid boundary/message use danger. Search can sit on the Citron sidebar in light and neutral surface in dark. Field is grid gap-2. Use min-inline-size:0 and full-width wrapping at narrow sizes; never use a placeholder instead of a label.

Load [tokens CSS](../../tokens/tokens.css) once. Theme pairs: `bg/surface/panel` with `ink` or `muted`; fills use matching `on-*`; standalone links/essential accent marks use `accent-ink` or `brand-boundary`. `line` is decorative. No alpha text or opacity-based disabled state. `outline` on hover and raw dark `accent` on panel need special contrast care; use the tested functional boundary role. Geometry described here is a source contract, not a claim that new CSS variables exist. Wrap translation and enlarged text; use min-inline-size:0 and 320 CSS px reflow rather than clipping.

## 8. Interaction / accessibility

Tab: input; normal text editing is native. Search Escape clears nonempty editable text, prevents propagation and keeps input focus. Set clearOnEscape=false when Escape closes an enclosing popup. The clear button has tabIndex=-1; keyboard users clear with Escape or text editing. Shortcut registration belongs to the product.

| Key / input | Behaviour |
| --- | --- |
| Tab / text editing | Native input traversal and editing. |
| Escape in SearchField | Clear nonempty editable query when clearOnEscape; otherwise enclosing popup can handle it. |

Test name/role/value and reading order with a screen reader. The name contains the visible label. Associate errors with unique description IDs and announce status once without moving focus. Test both themes, 400% zoom, forced colours and reduced motion. Use system colours/visible borders in forced colours; do not suppress adaptation by default. Keep focus clear of sticky chrome. The house target is 44 px; WCAG minimum is 24×24 CSS px with exceptions. Provide click/tap alternatives to dragging. Native integrations test TalkBack/VoiceOver, large type and platform focus. These are required checks, **not claims of completed AT tests**. [Accessibility](../accessibility.md) maps criteria, system contracts and product responsibilities.

## 9. Content

Use visible labels, optional markers and consequence-first helpers. “Search by name or code”, “Searching…”, “No items match ‘saw’. Clear filters.” and “Couldn’t search. Try again.” Preserve the query after errors and label read-only reasons explicitly.

Sentence case; translated labels and locale-aware plurals/numbers/dates/currency. Never expose raw error codes or invent a count. Money/evidence outcomes require actual confirmed completion and precise auditable consequences.

## 10. Do / don’t

| Do | Don’t / why |
| --- | --- |
| Keep the last query and results during a refresh and announce the new count once. | Do not clear a user’s draft after a request failure or disable all fields while one save is pending. |
| Use semantic role tokens and complete visible copy. | Do not copy reference hex colours, alpha text or paid Gilroy weights: they bypass the current theme/type contract. |

## 11. Implementation

**Observed API:** `Field({label,hint?,error?,className?,children})` clones one valid non-Fragment child to supply label/error/hint relationships; custom children must forward them to the input. `SearchField` forwards a ref and native input attributes except type/size, fixes type='search', supports value/defaultValue/onChange, disabled/readOnly and the variants above. No standalone TextField export exists.

**App source, reference only:** [frontend/src/components/ui/Field.tsx](https://github.com/SpaceWorks-Labs/SpaceWorks/blob/main/frontend/src/components/ui/Field.tsx). Inspected in the supplied `int-stage-r2final` worktree; uncommitted content may differ from upstream main. [Implementation snapshot](implementation-snapshot.json) records exact file hashes. Neighbours: SearchField.tsx, SearchField.css.

```tsx
<Field label='Search inventory' hint='Search by name or code' error={error}>
  <SearchField value={query} onChange={e => setQuery(e.target.value)} loading={loading} />
</Field>
```

The snippet assumes the source app’s imports/state handlers. It is **not a standalone install**. Observed app dependencies include React 19.2, React Router 7.18, Tailwind 4.3, Lingui 6.10.1 and local motion/session modules. The [separate React starter](../adoption/react-tailwind.md) avoids these app dependencies. Preserve controlled values separately from fetched data. Only validated public/member brand roles take tenant overrides; staff chrome remains Space Works.

**Known limitations:** SearchField is not a combobox and does not supply suggestions, debounce, API cancellation, results announcements or autocomplete semantics. Field cannot associate a Fragment of multiple controls. Use a fieldset for a group.

The standalone gallery uses local sample data/simulated outcomes. Without JS, ordinary content/controls and inline explanations remain; async/modal enhancements require JS. Native source is starter-only, not compiled here.

## 12. Related and maintenance

[Select](select.md) · [Checkbox](checkbox.md) · [EmptyState](empty-state.md) · [Skeleton / Loader](skeleton-loader.md). [Named patterns/layouts](../patterns/README.md) retain P1–P30/L1–L10 and screen backlinks. [Fonts/licences](../../fonts/README.md), [portable logo master](../../brand/logo-masters.svg) and [design-resource availability](../adoption/README.md#design-and-asset-resources) connect the assets; no public editable library or native component download is asserted.

Evidence: source inspection/captured hashes, not an app/site AT certificate. History: first dedicated contract for planned v2.1.0; no API removal introduced here. [Release policy](../releases/versioning.md), [migrations](../releases/migration.md) and [contribution route](../contributing-design-system.md) govern maintenance.

