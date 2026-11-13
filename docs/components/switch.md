---
title: Switch
description: Represent a setting that is on or off.
---

# Switch

## 1. Title and support strip

Represent a setting that is on or off. Stable ID: `SWC-switch`; source IDs: P15, S9, L5, B. Maturity: **proposed**; availability: **documented reference**, not a published component package. Owner: Space Works design-system owner, Shaan Shoukath; product maintainers own app integration. Documentation introduced/updated for **v2.1.0, planned** under decision 397. Last source verification: **2026-11-13**. Web implementation is described below; Compose/SwiftUI are starter mappings with **no verified component parity**.

## 2. Use it for / choose something else

Use for a binary setting with a stable name. Checkbox is clearer for consent or an item in a multi-choice list. Choose one persistence model for the section: explicit group Save or clearly immediate per-control save.

**Extracted source contract:** [P15 — P15. Settings rows (R5, R16, R17)](../ux-spec.md#p15-settings-rows-r5-r16-r17) · [S9 — S9. Makerspace settings (`settings`) ← R5 + R6 + R17](../ux-spec.md#s9-makerspace-settings-settings--r5--r6--r17) · [L5 — L5. `SettingsLayout` — sub-nav + sections of rows + sticky Discard/Save + DangerZone (R5, R6, R16, R17)](../ux-spec.md#l5-settingslayout--sub-nav--sections-of-rows--sticky-discardsave--dangerzone-r5-r6-r16-r17) · [B — B. Interaction states](../ui-brand-spec.md#b-interaction-states). The purpose, anatomy, variants and dimensions below condense those sections without moving their IDs or anchors. Source P rules describe observed reference boards; B/C and later decisions resolve brand adaptations.

[Authority and implementation status](README.md#authority-and-implementation-status) gives precedence. [Source inventory](source-inventory.json) preserves headings, table cells, code and links for publication checks.

## 3. Live example and complete code

[Full-page runnable example](../../examples/web/component-gallery.html#switch): start `node examples/web/server.mjs` from the repository root, then open `http://localhost:4174/examples/web/component-gallery.html#switch`. Choose Light/Dark, preview width and an applicable state; exercise hover, pressed and focus-visible with real input. Complete source: [HTML](../../examples/web/component-gallery.html), [behaviour](../../examples/web/gallery.mjs), [styles](../../examples/web/styles.css). No app module, network API or build step is required. These are portable reference compositions, not replicas of app exports.

```html
<label class="choice"><input type="checkbox" role="switch">Send the follow-up</label>
```

The linked shell supplies CSS/tokens and any `data-*` behaviour. Static text/native controls remain without JavaScript; modal content has an inline fallback. Copy the complete source for enhancements, not this fragment alone. [First-screen setup](../adoption/plain-html-css.md) shows the whole document.

## 4. Anatomy

Numbered reading-order diagram: `[1] → [2] → [3] → [4]`. Slots and name ownership:

1. Native checkbox with role=switch: checked exposes on/off.
2. Stable visible label in its activation area.
3. Optional helper describing the effect.
4. Save/outcome region owned by the surrounding settings form.

## 5. Variants

On and off; a draft switch in CommunityPolicySettings is saved with the group. An immediate switch must handle pending, rollback and outcome at the product layer. No standalone Switch component is exported.

| Variant | Choose it for |
| --- | --- |
| Draft setting | Changes with the section Save/Discard model, as the inspected app does. |
| Immediate setting composition | Product supplies awaited save, pending and rollback; no separate shared API. |

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

Reference uses a native 20 px checkbox visual with role=switch inside a min-h-11 labelled row. A custom track must preserve 44 px target and a non-colour state cue. Do not imply a sliding track exists in the source.

Load [tokens CSS](../../tokens/tokens.css) once. Theme pairs: `bg/surface/panel` with `ink` or `muted`; fills use matching `on-*`; standalone links/essential accent marks use `accent-ink` or `brand-boundary`. `line` is decorative. No alpha text or opacity-based disabled state. `outline` on hover and raw dark `accent` on panel need special contrast care; use the tested functional boundary role. Geometry described here is a source contract, not a claim that new CSS variables exist. Wrap translation and enlarged text; use min-inline-size:0 and 320 CSS px reflow rather than clipping.

## 8. Interaction / accessibility

Tab visits enabled switches. Space toggles. Keep the name unchanged between on and off. For an immediate server save, prevent duplicate requests and announce completion or rollback without moving focus.

| Key / input | Behaviour |
| --- | --- |
| Tab / Space | Native checkbox or switch traversal / toggle; native radio group enters at chosen option. |
| Arrows for radio only | Move/select within a same-name native radio group; not checkbox/switch navigation. |

Test name/role/value and reading order with a screen reader. The name contains the visible label. Associate errors with unique description IDs and announce status once without moving focus. Test both themes, 400% zoom, forced colours and reduced motion. Use system colours/visible borders in forced colours; do not suppress adaptation by default. Keep focus clear of sticky chrome. The house target is 44 px; WCAG minimum is 24×24 CSS px with exceptions. Provide click/tap alternatives to dragging. Native integrations test TalkBack/VoiceOver, large type and platform focus. These are required checks, **not claims of completed AT tests**. [Accessibility](../accessibility.md) maps criteria, system contracts and product responsibilities.

## 9. Content

Use “Send the follow-up” with a helper explaining who receives it and when. Say “Saving…” and “Couldn’t save. The previous setting is restored.” only when that matches actual data handling.

Sentence case; translated labels and locale-aware plurals/numbers/dates/currency. Never expose raw error codes or invent a count. Money/evidence outcomes require actual confirmed completion and precise auditable consequences.

## 10. Do / don’t

| Do | Don’t / why |
| --- | --- |
| Explain the setting’s consequence and show one Save/Discard model per section. | Do not combine an instant save and a page-level Save for the same setting. |
| Use semantic role tokens and complete visible copy. | Do not copy reference hex colours, alpha text or paid Gilroy weights: they bypass the current theme/type contract. |

## 11. Implementation

**Observed API:** Native `checked`, `onChange(event.target.checked)`, disabled, id and aria-describedby; role='switch'. CommunityPolicySettings holds a draft, derives changed fields and submits them through a mutation. Native readOnly has no effect. No indeterminate state belongs on a switch.

**App source, reference only:** [frontend/src/features/community/settings/CommunityPolicySettings.tsx](https://github.com/SpaceWorks-Labs/SpaceWorks/blob/main/frontend/src/features/community/settings/CommunityPolicySettings.tsx). Inspected in the supplied `int-stage-r2final` worktree; uncommitted content may differ from upstream main. [Implementation snapshot](implementation-snapshot.json) records exact file hashes. Neighbours: shared types, desk CSS and motion modules.

```tsx
<label className='flex min-h-11 items-center gap-3'>
  <input type='checkbox' role='switch' checked={enabled}
    onChange={e => setEnabled(e.target.checked)} />Send the follow-up
</label>
```

The snippet assumes the source app’s imports/state handlers. It is **not a standalone install**. Observed app dependencies include React 19.2, React Router 7.18, Tailwind 4.3, Lingui 6.10.1 and local motion/session modules. The [separate React starter](../adoption/react-tailwind.md) avoids these app dependencies. Preserve controlled values separately from fetched data. Only validated public/member brand roles take tenant overrides; staff chrome remains Space Works.

**Known limitations:** The app example is a group-save draft, not proof of instant persistence. Do not claim a shared Switch API or read-only HTML switch. Source does not supply a visible custom sliding track.

The standalone gallery uses local sample data/simulated outcomes. Without JS, ordinary content/controls and inline explanations remain; async/modal enhancements require JS. Native source is starter-only, not compiled here.

## 12. Related and maintenance

[Checkbox](checkbox.md) · [Button](button.md) · [Toast](toast.md). [Named patterns/layouts](../patterns/README.md) retain P1–P30/L1–L10 and screen backlinks. [Fonts/licences](../../fonts/README.md), [portable logo master](../../brand/logo-masters.svg) and [design-resource availability](../adoption/README.md#design-and-asset-resources) connect the assets; no public editable library or native component download is asserted.

Evidence: source inspection/captured hashes, not an app/site AT certificate. History: first dedicated contract for planned v2.1.0; no API removal introduced here. [Release policy](../releases/versioning.md), [migrations](../releases/migration.md) and [contribution route](../contributing-design-system.md) govern maintenance.

