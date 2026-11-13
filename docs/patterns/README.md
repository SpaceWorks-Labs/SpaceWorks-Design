---
title: Patterns and layouts
description: Stable names for every P1–P30 pattern and L1–L10 layout.
---
# Patterns and layouts

Every original ID remains intact. The names below are stable entry names alongside the IDs, not renumbering or replacements. Entries link to the exact original heading and the components they compose. Product screens remain [S1–S24 in the source](../ux-spec.md#3-screen-by-screen-spec) and [long-tail screens](../ux-screens-longtail.md). These are an index and condensed entry cards, not claims that new pattern code is shipped.

## Pattern index

| ID | Stable named entry | Layout |
| --- | --- | --- |
| P1 | [App shell and sidebar](#app-shell-sidebar) | [L1](#app-shell) |
| P2 | [Page header](#page-header) | [L3](#list-layout) |
| P3 | [Detail header and section navigation](#detail-header) | [L4](#detail-layout) |
| P4 | [Stat-card row](#stat-card-row) | [L2](#dashboard-layout) |
| P5 | [Contextual callout](#contextual-callout) | [L3](#list-layout) |
| P6 | [Bordered list rows](#bordered-list-rows) | [L3](#list-layout) |
| P7 | [Identity and date tile](#identity-date-tile) | [L4](#detail-layout) |
| P8 | [Underline tabs and inline counts](#underline-tabs) | [L3](#list-layout) |
| P9 | [Same-object view switch](#same-object-view-switch) | [L8](#authentication-layouts) |
| P10 | [Status, metadata and choice chips](#status-meta-choice-chips) | [L4](#detail-layout) |
| P11 | [Action hierarchy](#action-hierarchy) | [L5](#settings-layout) |
| P12 | [Recent-activity rail](#recent-activity) | [L2](#dashboard-layout) |
| P13 | [At-a-glance key–value card](#at-a-glance) | [L4](#detail-layout) |
| P14 | [Tabular records in a card](#tabular-records) | [L3](#list-layout) |
| P15 | [Settings rows and page save](#settings-rows) | [L5](#settings-layout) |
| P16 | [Danger zone and consequence](#danger-zone) | [L5](#settings-layout) |
| P17 | [Empty and filtered-empty results](#empty-results) | [L3](#list-layout) |
| P18 | [Create form with live preview](#create-live-preview) | [L6](#form-page-layout) |
| P19 | [Checkbox-card form and developer reference](#checkbox-form-reference) | [L6](#form-page-layout) |
| P20 | [Session and track board](#session-track-board) | [L4](#detail-layout) |
| P21 | [Check-in workspace](#check-in-workspace) | [L7](#flow-layout) |
| P22 | [Split authentication screen](#split-authentication) | [L8](#authentication-layouts) |
| P23 | [Centred task card](#centred-task) | [L8](#authentication-layouts) |
| P24 | [Account sections](#account-sections) | [L5](#settings-layout) |
| P25 | [Public event detail](#public-event) | [L9](#public-layouts) |
| P26 | [Live status and feedback](#live-status-feedback) | [L9](#public-layouts) |
| P27 | [Mobile ticket](#mobile-ticket) | [L9](#public-layouts) |
| P28 | [Kiosk PIN unlock](#kiosk-pin) | [L10](#kiosk-layout) |
| P29 | [Kiosk station work](#kiosk-station) | [L10](#kiosk-layout) |
| P30 | [Confirmation and awaited Undo](#confirmation-undo) | [L7](#flow-layout) |

## Layout index

| ID | Stable named entry |
| --- | --- |
| L1 | [AppShell](#app-shell) |
| L2 | [DashboardLayout](#dashboard-layout) |
| L3 | [ListLayout](#list-layout) |
| L4 | [DetailLayout](#detail-layout) |
| L5 | [SettingsLayout](#settings-layout) |
| L6 | [FormPageLayout](#form-page-layout) |
| L7 | [FlowLayout](#flow-layout) |
| L8 | [AuthLayout and CenteredCardLayout](#authentication-layouts) |
| L9 | [PublicLayout and PublicDetailLayout](#public-layouts) |
| L10 | [KioskLayout](#kiosk-layout) |

## Entry contract

Owner: Space Works design-system owner; maturity: source-reference index. Added for planned v2.1.0; verified 2026-11-13. A new detailed pattern page must use the same 12 sections as [component contracts](../components/README.md). The canonical P/L paragraphs, tables, typed slots, breakpoints, code, S mappings and wireframes remain at the links below. This index does not extract them away or substitute for their full contract.

Compose exactly one layout per screen and fill its slots with already-gated actions/data. Inherited states: initial loading, ready, empty, filtered-empty, error/Retry, offline last-known/queued, pending mutation, success and interrupted work. These belong to the task; individual primitive N/A states remain explicit in component pages. Preserve draft/query/URL state after errors, never infer empty from a failed fetch and announce completion once. See [UX quality bar](../ux-spec.md#4-ux-quality-bar-every-screen-app-wide-implementation-must-pass-every-applicable-item) and [accessibility test scripts](../accessibility.md#test-scripts).

## Named entries

<a id="app-shell-sidebar"></a>

### P1 — App shell and sidebar

[Canonical P1 contract](../ux-spec.md#p1-app-shell-and-sidebar-r1r10-r16-r17). User task: app shell and sidebar. Compose inside [L1](#app-shell).

Composition: use the canonical source’s named slots, plus [actions](../components/button.md), [field controls](../components/text-field.md), [status](../components/status-pill.md) and [feedback](../components/empty-state.md) where the task calls for them. Inherit [the entry state contract](#entry-contract); keep the exact source’s task-specific data, safety, keyboard and responsive constraints.

<a id="page-header"></a>

### P2 — Page header

[Canonical P2 contract](../ux-spec.md#p2-page-header-r1-r2-r4r6-r16). User task: page header. Compose inside [L3](#list-layout).

Composition: use the canonical source’s named slots, plus [actions](../components/button.md), [field controls](../components/text-field.md), [status](../components/status-pill.md) and [feedback](../components/empty-state.md) where the task calls for them. Inherit [the entry state contract](#entry-contract); keep the exact source’s task-specific data, safety, keyboard and responsive constraints.

<a id="detail-header"></a>

### P3 — Detail header and section navigation

[Canonical P3 contract](../ux-spec.md#p3-detail-header-with-back-link-identity-chip-and-underline-tabs-r7r10). User task: detail header and section navigation. Compose inside [L4](#detail-layout).

Components: [Link](../components/link.md) · [Tabs](../components/tabs.md) · [Drawer / Sheet](../components/drawer-sheet.md). Inherit [the entry state contract](#entry-contract); keep the exact source’s task-specific data, safety, keyboard and responsive constraints.

<a id="stat-card-row"></a>

### P4 — Stat-card row

[Canonical P4 contract](../ux-spec.md#p4-stat-card-row-r2-r7-r8). User task: stat-card row. Compose inside [L2](#dashboard-layout).

Composition: use the canonical source’s named slots, plus [actions](../components/button.md), [field controls](../components/text-field.md), [status](../components/status-pill.md) and [feedback](../components/empty-state.md) where the task calls for them. Inherit [the entry state contract](#entry-contract); keep the exact source’s task-specific data, safety, keyboard and responsive constraints.

<a id="contextual-callout"></a>

### P5 — Contextual callout

[Canonical P5 contract](../ux-spec.md#p5-contextual-callout-r2-r6-r8-r17-r7-cta-card). User task: contextual callout. Compose inside [L3](#list-layout).

Composition: use the canonical source’s named slots, plus [actions](../components/button.md), [field controls](../components/text-field.md), [status](../components/status-pill.md) and [feedback](../components/empty-state.md) where the task calls for them. Inherit [the entry state contract](#entry-contract); keep the exact source’s task-specific data, safety, keyboard and responsive constraints.

<a id="bordered-list-rows"></a>

### P6 — Bordered list rows

[Canonical P6 contract](../ux-spec.md#p6-list-rows-as-bordered-cards-r1-r2). User task: bordered list rows. Compose inside [L3](#list-layout).

Composition: use the canonical source’s named slots, plus [actions](../components/button.md), [field controls](../components/text-field.md), [status](../components/status-pill.md) and [feedback](../components/empty-state.md) where the task calls for them. Inherit [the entry state contract](#entry-contract); keep the exact source’s task-specific data, safety, keyboard and responsive constraints.

<a id="identity-date-tile"></a>

### P7 — Identity and date tile

[Canonical P7 contract](../ux-spec.md#p7-date-chip--identity-tile). User task: identity and date tile. Compose inside [L4](#detail-layout).

Composition: use the canonical source’s named slots, plus [actions](../components/button.md), [field controls](../components/text-field.md), [status](../components/status-pill.md) and [feedback](../components/empty-state.md) where the task calls for them. Inherit [the entry state contract](#entry-contract); keep the exact source’s task-specific data, safety, keyboard and responsive constraints.

<a id="underline-tabs"></a>

### P8 — Underline tabs and inline counts

[Canonical P8 contract](../ux-spec.md#p8-underline-tabs-with-inline-counts-r2-r7-r16). User task: underline tabs and inline counts. Compose inside [L3](#list-layout).

Components: [Tabs](../components/tabs.md). Inherit [the entry state contract](#entry-contract); keep the exact source’s task-specific data, safety, keyboard and responsive constraints.

<a id="same-object-view-switch"></a>

### P9 — Same-object view switch

[Canonical P9 contract](../ux-spec.md#p9-segmented-control-r9-r11). User task: same-object view switch. Compose inside [L8](#authentication-layouts).

Components: [SegmentedControl](../components/segmented-control.md). Inherit [the entry state contract](#entry-contract); keep the exact source’s task-specific data, safety, keyboard and responsive constraints.

<a id="status-meta-choice-chips"></a>

### P10 — Status, metadata and choice chips

[Canonical P10 contract](../ux-spec.md#p10-pills-and-chips). User task: status, metadata and choice chips. Compose inside [L4](#detail-layout).

Components: [StatusPill](../components/status-pill.md). Inherit [the entry state contract](#entry-contract); keep the exact source’s task-specific data, safety, keyboard and responsive constraints.

<a id="action-hierarchy"></a>

### P11 — Action hierarchy

[Canonical P11 contract](../ux-spec.md#p11-buttons). User task: action hierarchy. Compose inside [L5](#settings-layout).

Components: [Button](../components/button.md) · [Link](../components/link.md) · [IconButton](../components/icon-button.md). Inherit [the entry state contract](#entry-contract); keep the exact source’s task-specific data, safety, keyboard and responsive constraints.

<a id="recent-activity"></a>

### P12 — Recent-activity rail

[Canonical P12 contract](../ux-spec.md#p12-recent-activity-rail-r1-r2). User task: recent-activity rail. Compose inside [L2](#dashboard-layout).

Composition: use the canonical source’s named slots, plus [actions](../components/button.md), [field controls](../components/text-field.md), [status](../components/status-pill.md) and [feedback](../components/empty-state.md) where the task calls for them. Inherit [the entry state contract](#entry-contract); keep the exact source’s task-specific data, safety, keyboard and responsive constraints.

<a id="at-a-glance"></a>

### P13 — At-a-glance key–value card

[Canonical P13 contract](../ux-spec.md#p13-keyvalue-at-a-glance-card-r7). User task: at-a-glance key–value card. Compose inside [L4](#detail-layout).

Composition: use the canonical source’s named slots, plus [actions](../components/button.md), [field controls](../components/text-field.md), [status](../components/status-pill.md) and [feedback](../components/empty-state.md) where the task calls for them. Inherit [the entry state contract](#entry-contract); keep the exact source’s task-specific data, safety, keyboard and responsive constraints.

<a id="tabular-records"></a>

### P14 — Tabular records in a card

[Canonical P14 contract](../ux-spec.md#p14-tables-inside-a-card-r4-r8-r10). User task: tabular records in a card. Compose inside [L3](#list-layout).

Components: [IconButton](../components/icon-button.md) · [Checkbox](../components/checkbox.md) · [Menu](../components/menu.md) · [Table](../components/table.md) · [Pagination](../components/pagination.md) · [Skeleton / Loader](../components/skeleton-loader.md). Inherit [the entry state contract](#entry-contract); keep the exact source’s task-specific data, safety, keyboard and responsive constraints.

<a id="settings-rows"></a>

### P15 — Settings rows and page save

[Canonical P15 contract](../ux-spec.md#p15-settings-rows-r5-r16-r17). User task: settings rows and page save. Compose inside [L5](#settings-layout).

Components: [TextField and SearchField](../components/text-field.md) · [Switch](../components/switch.md) · [Select](../components/select.md). Inherit [the entry state contract](#entry-contract); keep the exact source’s task-specific data, safety, keyboard and responsive constraints.

<a id="danger-zone"></a>

### P16 — Danger zone and consequence

[Canonical P16 contract](../ux-spec.md#p16-danger-zone-r5-r10). User task: danger zone and consequence. Compose inside [L5](#settings-layout).

Components: [Dialog](../components/dialog.md) · [Menu](../components/menu.md). Inherit [the entry state contract](#entry-contract); keep the exact source’s task-specific data, safety, keyboard and responsive constraints.

<a id="empty-results"></a>

### P17 — Empty and filtered-empty results

[Canonical P17 contract](../ux-spec.md#p17-empty-states-r4-r6-r3-preview). User task: empty and filtered-empty results. Compose inside [L3](#list-layout).

Components: [EmptyState](../components/empty-state.md) · [Skeleton / Loader](../components/skeleton-loader.md). Inherit [the entry state contract](#entry-contract); keep the exact source’s task-specific data, safety, keyboard and responsive constraints.

<a id="create-live-preview"></a>

### P18 — Create form with live preview

[Canonical P18 contract](../ux-spec.md#p18-create-form-with-live-preview-r3). User task: create form with live preview. Compose inside [L6](#form-page-layout).

Components: [TextField and SearchField](../components/text-field.md) · [Select](../components/select.md). Inherit [the entry state contract](#entry-contract); keep the exact source’s task-specific data, safety, keyboard and responsive constraints.

<a id="checkbox-form-reference"></a>

### P19 — Checkbox-card form and developer reference

[Canonical P19 contract](../ux-spec.md#p19-form-card-with-checkbox-cards-and-developer-reference-r6). User task: checkbox-card form and developer reference. Compose inside [L6](#form-page-layout).

Components: [Checkbox](../components/checkbox.md) · [Radio](../components/radio.md). Inherit [the entry state contract](#entry-contract); keep the exact source’s task-specific data, safety, keyboard and responsive constraints.

<a id="session-track-board"></a>

### P20 — Session and track board

[Canonical P20 contract](../ux-spec.md#p20-sessiontrack-board-r9). User task: session and track board. Compose inside [L4](#detail-layout).

Composition: use the canonical source’s named slots, plus [actions](../components/button.md), [field controls](../components/text-field.md), [status](../components/status-pill.md) and [feedback](../components/empty-state.md) where the task calls for them. Inherit [the entry state contract](#entry-contract); keep the exact source’s task-specific data, safety, keyboard and responsive constraints.

<a id="check-in-workspace"></a>

### P21 — Check-in workspace

[Canonical P21 contract](../ux-spec.md#p21-check-in-workspace-r8). User task: check-in workspace. Compose inside [L7](#flow-layout).

Composition: use the canonical source’s named slots, plus [actions](../components/button.md), [field controls](../components/text-field.md), [status](../components/status-pill.md) and [feedback](../components/empty-state.md) where the task calls for them. Inherit [the entry state contract](#entry-contract); keep the exact source’s task-specific data, safety, keyboard and responsive constraints.

<a id="split-authentication"></a>

### P22 — Split authentication screen

[Canonical P22 contract](../ux-spec.md#p22-auth-split-screen-r11). User task: split authentication screen. Compose inside [L8](#authentication-layouts).

Components: [Radio](../components/radio.md) · [SegmentedControl](../components/segmented-control.md). Inherit [the entry state contract](#entry-contract); keep the exact source’s task-specific data, safety, keyboard and responsive constraints.

<a id="centred-task"></a>

### P23 — Centred task card

[Canonical P23 contract](../ux-spec.md#p23-centred-task-card-r12r15). User task: centred task card. Compose inside [L8](#authentication-layouts).

Composition: use the canonical source’s named slots, plus [actions](../components/button.md), [field controls](../components/text-field.md), [status](../components/status-pill.md) and [feedback](../components/empty-state.md) where the task calls for them. Inherit [the entry state contract](#entry-contract); keep the exact source’s task-specific data, safety, keyboard and responsive constraints.

<a id="account-sections"></a>

### P24 — Account sections

[Canonical P24 contract](../ux-spec.md#p24-account-tabs-r16-r17). User task: account sections. Compose inside [L5](#settings-layout).

Composition: use the canonical source’s named slots, plus [actions](../components/button.md), [field controls](../components/text-field.md), [status](../components/status-pill.md) and [feedback](../components/empty-state.md) where the task calls for them. Inherit [the entry state contract](#entry-contract); keep the exact source’s task-specific data, safety, keyboard and responsive constraints.

<a id="public-event"></a>

### P25 — Public event detail

[Canonical P25 contract](../ux-spec.md#p25-public-event-page-r18-r19-r23). User task: public event detail. Compose inside [L9](#public-layouts).

Composition: use the canonical source’s named slots, plus [actions](../components/button.md), [field controls](../components/text-field.md), [status](../components/status-pill.md) and [feedback](../components/empty-state.md) where the task calls for them. Inherit [the entry state contract](#entry-contract); keep the exact source’s task-specific data, safety, keyboard and responsive constraints.

<a id="live-status-feedback"></a>

### P26 — Live status and feedback

[Canonical P26 contract](../ux-spec.md#p26-live-and-status-pages-r24-and-feedback-r25). User task: live status and feedback. Compose inside [L9](#public-layouts).

Composition: use the canonical source’s named slots, plus [actions](../components/button.md), [field controls](../components/text-field.md), [status](../components/status-pill.md) and [feedback](../components/empty-state.md) where the task calls for them. Inherit [the entry state contract](#entry-contract); keep the exact source’s task-specific data, safety, keyboard and responsive constraints.

<a id="mobile-ticket"></a>

### P27 — Mobile ticket

[Canonical P27 contract](../ux-spec.md#p27-mobile-ticket-r26-390-px). User task: mobile ticket. Compose inside [L9](#public-layouts).

Composition: use the canonical source’s named slots, plus [actions](../components/button.md), [field controls](../components/text-field.md), [status](../components/status-pill.md) and [feedback](../components/empty-state.md) where the task calls for them. Inherit [the entry state contract](#entry-contract); keep the exact source’s task-specific data, safety, keyboard and responsive constraints.

<a id="kiosk-pin"></a>

### P28 — Kiosk PIN unlock

[Canonical P28 contract](../ux-spec.md#p28-kiosk-pin-r27). User task: kiosk pin unlock. Compose inside [L10](#kiosk-layout).

Composition: use the canonical source’s named slots, plus [actions](../components/button.md), [field controls](../components/text-field.md), [status](../components/status-pill.md) and [feedback](../components/empty-state.md) where the task calls for them. Inherit [the entry state contract](#entry-contract); keep the exact source’s task-specific data, safety, keyboard and responsive constraints.

<a id="kiosk-station"></a>

### P29 — Kiosk station work

[Canonical P29 contract](../ux-spec.md#p29-kiosk-station-r28). User task: kiosk station work. Compose inside [L10](#kiosk-layout).

Composition: use the canonical source’s named slots, plus [actions](../components/button.md), [field controls](../components/text-field.md), [status](../components/status-pill.md) and [feedback](../components/empty-state.md) where the task calls for them. Inherit [the entry state contract](#entry-contract); keep the exact source’s task-specific data, safety, keyboard and responsive constraints.

<a id="confirmation-undo"></a>

### P30 — Confirmation and awaited Undo

[Canonical P30 contract](../ux-spec.md#p30-undo-and-confirmation-behaviour-r8-r28). User task: confirmation and awaited undo. Compose inside [L7](#flow-layout).

Components: [Button](../components/button.md) · [Dialog](../components/dialog.md) · [Drawer / Sheet](../components/drawer-sheet.md) · [Toast](../components/toast.md). Inherit [the entry state contract](#entry-contract); keep the exact source’s task-specific data, safety, keyboard and responsive constraints.

<a id="app-shell"></a>

### L1 — AppShell

[Canonical L1 contract](../ux-spec.md#l1-appshell--sidebar--content-r1r10-r16r17). User task: appshell. Use the original typed slot API and breakpoint table; this entry does not invent a second layout implementation.

Composition: use the canonical source’s named slots, plus [actions](../components/button.md), [field controls](../components/text-field.md), [status](../components/status-pill.md) and [feedback](../components/empty-state.md) where the task calls for them. Inherit [the entry state contract](#entry-contract); keep the exact source’s task-specific data, safety, keyboard and responsive constraints.

<a id="dashboard-layout"></a>

### L2 — DashboardLayout

[Canonical L2 contract](../ux-spec.md#l2-dashboardlayout--greeting-header--stat-row--main--right-rail-r1-r2). User task: dashboard layout. Use the original typed slot API and breakpoint table; this entry does not invent a second layout implementation.

Composition: use the canonical source’s named slots, plus [actions](../components/button.md), [field controls](../components/text-field.md), [status](../components/status-pill.md) and [feedback](../components/empty-state.md) where the task calls for them. Inherit [the entry state contract](#entry-contract); keep the exact source’s task-specific data, safety, keyboard and responsive constraints.

<a id="list-layout"></a>

### L3 — ListLayout

[Canonical L3 contract](../ux-spec.md#l3-listlayout--header--callout--statstabs--filters--listtable--pagination-r2-r4). User task: list layout. Use the original typed slot API and breakpoint table; this entry does not invent a second layout implementation.

Components: [IconButton](../components/icon-button.md) · [Menu](../components/menu.md) · [Table](../components/table.md) · [Pagination](../components/pagination.md) · [EmptyState](../components/empty-state.md) · [Toast](../components/toast.md) · [Skeleton / Loader](../components/skeleton-loader.md). Inherit [the entry state contract](#entry-contract); keep the exact source’s task-specific data, safety, keyboard and responsive constraints.

<a id="detail-layout"></a>

### L4 — DetailLayout

[Canonical L4 contract](../ux-spec.md#l4-detaillayout--back--identity--titlestatusmeta--actions--underline-tabs--mainaside-r7r10). User task: detail layout. Use the original typed slot API and breakpoint table; this entry does not invent a second layout implementation.

Components: [Link](../components/link.md) · [Tabs](../components/tabs.md) · [Drawer / Sheet](../components/drawer-sheet.md) · [StatusPill](../components/status-pill.md). Inherit [the entry state contract](#entry-contract); keep the exact source’s task-specific data, safety, keyboard and responsive constraints.

<a id="settings-layout"></a>

### L5 — SettingsLayout

[Canonical L5 contract](../ux-spec.md#l5-settingslayout--sub-nav--sections-of-rows--sticky-discardsave--dangerzone-r5-r6-r16-r17). User task: settings layout. Use the original typed slot API and breakpoint table; this entry does not invent a second layout implementation.

Components: [Button](../components/button.md) · [TextField and SearchField](../components/text-field.md) · [Switch](../components/switch.md) · [Select](../components/select.md) · [Dialog](../components/dialog.md). Inherit [the entry state contract](#entry-contract); keep the exact source’s task-specific data, safety, keyboard and responsive constraints.

<a id="form-page-layout"></a>

### L6 — FormPageLayout

[Canonical L6 contract](../ux-spec.md#l6-formpagelayout--createedit-form--optional-live-preview-r3-r6-form-card). User task: formpage layout. Use the original typed slot API and breakpoint table; this entry does not invent a second layout implementation.

Components: [Checkbox](../components/checkbox.md). Inherit [the entry state contract](#entry-contract); keep the exact source’s task-specific data, safety, keyboard and responsive constraints.

<a id="flow-layout"></a>

### L7 — FlowLayout

[Canonical L7 contract](../ux-spec.md#l7-flowlayout--step-rail--work-panel--guarded-footer-r8r28-visual-spaceworks-wizards). User task: flow layout. Use the original typed slot API and breakpoint table; this entry does not invent a second layout implementation.

Composition: use the canonical source’s named slots, plus [actions](../components/button.md), [field controls](../components/text-field.md), [status](../components/status-pill.md) and [feedback](../components/empty-state.md) where the task calls for them. Inherit [the entry state contract](#entry-contract); keep the exact source’s task-specific data, safety, keyboard and responsive constraints.

<a id="authentication-layouts"></a>

### L8 — AuthLayout and CenteredCardLayout

[Canonical L8 contract](../ux-spec.md#l8-authlayout-r11-and-centeredcardlayout-r12r15). User task: auth layout and centeredcard layout. Use the original typed slot API and breakpoint table; this entry does not invent a second layout implementation.

Components: [Radio](../components/radio.md) · [SegmentedControl](../components/segmented-control.md). Inherit [the entry state contract](#entry-contract); keep the exact source’s task-specific data, safety, keyboard and responsive constraints.

<a id="public-layouts"></a>

### L9 — PublicLayout and PublicDetailLayout

[Canonical L9 contract](../ux-spec.md#l9-publiclayout-r18r25-chrome-and-publicdetaillayout-r18-r19-r21-r23). User task: public layout and publicdetail layout. Use the original typed slot API and breakpoint table; this entry does not invent a second layout implementation.

Composition: use the canonical source’s named slots, plus [actions](../components/button.md), [field controls](../components/text-field.md), [status](../components/status-pill.md) and [feedback](../components/empty-state.md) where the task calls for them. Inherit [the entry state contract](#entry-contract); keep the exact source’s task-specific data, safety, keyboard and responsive constraints.

<a id="kiosk-layout"></a>

### L10 — KioskLayout

[Canonical L10 contract](../ux-spec.md#l10-kiosklayout--full-screen-large-targets-r27-r28). User task: kiosk layout. Use the original typed slot API and breakpoint table; this entry does not invent a second layout implementation.

Composition: use the canonical source’s named slots, plus [actions](../components/button.md), [field controls](../components/text-field.md), [status](../components/status-pill.md) and [feedback](../components/empty-state.md) where the task calls for them. Inherit [the entry state contract](#entry-contract); keep the exact source’s task-specific data, safety, keyboard and responsive constraints.


