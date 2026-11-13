---
title: Components
description: Find Space Works controls by name, category and implementation status.
---
# Components

## By name

| Component | Category | Source IDs |
| --- | --- | --- |
| [Button](button.md) | Actions | P11, P30, S9, L5, B |
| [Checkbox](checkbox.md) | Forms | P19, P14, S8, L6, B |
| [Dialog](dialog.md) | Layers | P16, P30, S9, L5, B |
| [Drawer / Sheet](drawer-sheet.md) | Layers | P3, P30, S6, L4, B |
| [EmptyState](empty-state.md) | Feedback | P17, S2, S5, L3, B |
| [IconButton](icon-button.md) | Actions | P11, P14, S5, L3, B |
| [Link](link.md) | Actions | P11, P3, S6, L4, B |
| [Menu](menu.md) | Layers | P14, P16, S5, L3, B |
| [Pagination](pagination.md) | Navigation | P14, S5, L3, B |
| [Radio](radio.md) | Forms | P19, P22, S20, L8, B |
| [SegmentedControl](segmented-control.md) | Navigation | P9, P22, S20, L8, B |
| [Select](select.md) | Forms | P15, P18, S9, L5, B |
| [Skeleton / Loader](skeleton-loader.md) | Feedback | P14, P17, S5, L3, B |
| [StatusPill](status-pill.md) | Data and display | P10, S1, S5, L4, C |
| [Switch](switch.md) | Forms | P15, S9, L5, B |
| [Table](table.md) | Data and display | P14, S5, S15, L3, B |
| [Tabs](tabs.md) | Navigation | P8, P3, S6, L4, B |
| [TextField and SearchField](text-field.md) | Forms | P15, P18, S9, L5, B |
| [Toast](toast.md) | Feedback | P30, S5, L3, B |

## By category

- **Actions:** [Button](button.md), [Link](link.md), [IconButton](icon-button.md).
- **Forms:** [TextField and SearchField](text-field.md), [Checkbox](checkbox.md), [Radio](radio.md), [Switch](switch.md), [Select](select.md).
- **Navigation:** [Tabs](tabs.md), [SegmentedControl](segmented-control.md), [Pagination](pagination.md).
- **Data and display:** [Table](table.md), [StatusPill](status-pill.md).
- **Feedback:** [EmptyState](empty-state.md), [Toast](toast.md), [Skeleton / Loader](skeleton-loader.md).
- **Layers:** [Dialog](dialog.md), [Drawer / Sheet](drawer-sheet.md), [Menu](menu.md).

## Authority and implementation status

These pages are additive extractions of P/S/L in [UX spec](../ux-spec.md), B/C and dimensions in [UI brand spec](../ui-brand-spec.md), with read-only app evidence. Existing specifications remain available at their original anchors. Page sections follow the audit’s 12-part template, including all applicable states and explicit N/A reasons. The machine-readable [manifest](manifest.json) records the page contract; [source inventory](source-inventory.json) records source headings, table cells, links/images and code blocks; [implementation snapshot](implementation-snapshot.json) records 28 inspected app files and hashes.

Precedence is the latest applicable owner ledger decision, then the corresponding public decision, current implementation evidence and preserved reference observations. Implementation evidence can reveal a gap; it does not automatically override a rule.

| Subject | Current reading / source |
| --- | --- |
| Release target | Ledger decision 397 (2026-11-13): phase-2 additions target **v2.1.0**; v2.0.1 remains the corrective migration stage. This is planned documentation, not a claim the tag exists. |
| Theme | [SW-204](../decisions.md#sw-204--light-mode-is-the-default): default light, persist explicit light/dark even when OS prefers dark. D11/B retain Light/Dark only. Theming’s historical System recipe does not add a third choice. |
| Neutral dark surfaces | [SW-316](../decisions.md#sw-316--dark-theme-is-one-solid-black-family) plus 2026-11-13 line correction: black neutral family; dark line #2C2C2C. Brand accents are not page surfaces. |
| Typography | [SW-299](../decisions.md#sw-299--only-the-free-gilroy-weights-ship): Gilroy 300/800 only, Outfit 400–700, Unbounded 500–600 for one short accent phrase. |
| Geometry and actions | Brand B/E adapt the P reference boards: control radius 10, panels 16, no card shadows, 44 px minimum controls. Filled danger is for final confirmation; P11’s observed “never filled” is not a blanket ban on the final-confirm variant in B. |
| Status marks | Later [lesson 9](../lessons-learned.md) and inspected tones.ts: solid success/warn/info small marks in both modes. C/D6 still contain the historical dark-soft variant; big callout surfaces remain a separate contract. |
| Logo | Ledger decision 389, recorded in [design decisions](../decisions.md): closed state retains two orange and two green flap regions; use supplied assets. |
| Publication and automation | Decisions 395/397 preserve all source content; decision 386 defers workflow/CODEOWNERS/branch-protection implementation. This batch adds no automation or site wiring. |

**Authority notes added here:** Button, SegmentedControl, Table and EmptyState explain observed P geometry versus current B/D/E. StatusPill explains C/D6 versus later solid-mark guidance. These notes are in new pages only; batch 1A owns any dated correction beside a contradictory original sentence. The integration owner must log the original-source correction, not reword the old sentence.

**Observed implementation gaps, not new policy:** toast placement differs from P30 and lacks focus/hover expiry pausing; DataTable uses a logo loader and titled legacy EmptyState; Skeleton is box artwork rather than final-geometry bars; DetailDrawer has no generic sheet API. Each page names its source and consequence. Checkbox, Radio, Switch, Select and text input are native compositions, not invented exports.

The new reference contracts have lifecycle **proposed** for owner review and availability **documented reference**. Availability means source/API evidence and a portable example are present; it does not mean the existing app implementation or platform starter passed a browser/AT certification. Standalone gallery behaviour is scoped to [its verification report](../adoption/verification.md). Native starters are not compiled here. No release package, editable public Figma library or native component parity is asserted.

[Choose a platform](../adoption/README.md) · [Patterns and layouts](../patterns/README.md) · [Accessibility](../accessibility.md) · [Contribute](../contributing-design-system.md) · [Sidebar handoff](../adoption/sidebar-placement.md).

