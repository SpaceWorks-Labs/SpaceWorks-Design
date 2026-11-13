---
title: Batch 1C sidebar placement
description: Exact page routes, sidebar hierarchy and asset handoff for publication batch 3.
---
# Batch 1C sidebar placement

This is the **exact integration request** for all 35 new documentation pages, in sidebar order. These are requested routes, **not routes already wired by this batch**. Prefix each route with the existing site base `/SpaceWorks-Design-System/`. Source frontmatter supplies title/description; the publication owner must resolve Markdown source links to site routes without changing any old source/route/anchor.

| New source page | New route below base | Sidebar path |
| --- | --- | --- |
| [docs/adoption/README.md](../../docs/adoption/README.md) | `adoption/` | Start here > Adopt the system > Choose a platform |
| [docs/adoption/plain-html-css.md](../../docs/adoption/plain-html-css.md) | `adoption/plain-html-css/` | Start here > Adopt the system > Plain HTML and CSS |
| [docs/adoption/react-tailwind.md](../../docs/adoption/react-tailwind.md) | `adoption/react-tailwind/` | Start here > Adopt the system > React and Tailwind |
| [docs/adoption/android-compose.md](../../docs/adoption/android-compose.md) | `adoption/android-compose/` | Start here > Adopt the system > Android Compose |
| [docs/adoption/ios-swiftui.md](../../docs/adoption/ios-swiftui.md) | `adoption/ios-swiftui/` | Start here > Adopt the system > iOS SwiftUI |
| [docs/accessibility.md](../../docs/accessibility.md) | `foundations/accessibility/` | Foundations > Accessibility |
| [docs/components/README.md](../../docs/components/README.md) | `components/` | Components > All components |
| [docs/components/button.md](../../docs/components/button.md) | `components/button/` | Components > Actions > Button |
| [docs/components/link.md](../../docs/components/link.md) | `components/link/` | Components > Actions > Link |
| [docs/components/icon-button.md](../../docs/components/icon-button.md) | `components/icon-button/` | Components > Actions > IconButton |
| [docs/components/text-field.md](../../docs/components/text-field.md) | `components/text-field/` | Components > Forms > TextField and SearchField |
| [docs/components/checkbox.md](../../docs/components/checkbox.md) | `components/checkbox/` | Components > Forms > Checkbox |
| [docs/components/radio.md](../../docs/components/radio.md) | `components/radio/` | Components > Forms > Radio |
| [docs/components/switch.md](../../docs/components/switch.md) | `components/switch/` | Components > Forms > Switch |
| [docs/components/select.md](../../docs/components/select.md) | `components/select/` | Components > Forms > Select |
| [docs/components/tabs.md](../../docs/components/tabs.md) | `components/tabs/` | Components > Navigation > Tabs |
| [docs/components/segmented-control.md](../../docs/components/segmented-control.md) | `components/segmented-control/` | Components > Navigation > SegmentedControl |
| [docs/components/pagination.md](../../docs/components/pagination.md) | `components/pagination/` | Components > Navigation > Pagination |
| [docs/components/table.md](../../docs/components/table.md) | `components/table/` | Components > Data and display > Table |
| [docs/components/status-pill.md](../../docs/components/status-pill.md) | `components/status-pill/` | Components > Data and display > StatusPill |
| [docs/components/empty-state.md](../../docs/components/empty-state.md) | `components/empty-state/` | Components > Feedback > EmptyState |
| [docs/components/toast.md](../../docs/components/toast.md) | `components/toast/` | Components > Feedback > Toast |
| [docs/components/skeleton-loader.md](../../docs/components/skeleton-loader.md) | `components/skeleton-loader/` | Components > Feedback > Skeleton / Loader |
| [docs/components/dialog.md](../../docs/components/dialog.md) | `components/dialog/` | Components > Layers > Dialog |
| [docs/components/drawer-sheet.md](../../docs/components/drawer-sheet.md) | `components/drawer-sheet/` | Components > Layers > Drawer / Sheet |
| [docs/components/menu.md](../../docs/components/menu.md) | `components/menu/` | Components > Layers > Menu |
| [docs/patterns/README.md](../../docs/patterns/README.md) | `patterns/` | Patterns and layouts > Named patterns and layouts (P1–P30 / L1–L10) |
| [docs/contributing-design-system.md](../../docs/contributing-design-system.md) | `contributing-design-system/` | Resources and governance > Contribute |
| [docs/releases/README.md](../../docs/releases/README.md) | `releases/` | Resources and governance > Releases > Overview |
| [docs/releases/versioning.md](../../docs/releases/versioning.md) | `releases/versioning/` | Resources and governance > Releases > Versioning and support |
| [docs/releases/deprecation.md](../../docs/releases/deprecation.md) | `releases/deprecation/` | Resources and governance > Releases > Deprecation |
| [docs/releases/migration.md](../../docs/releases/migration.md) | `releases/migration/` | Resources and governance > Releases > Migrate v1 / v2.0 / v2.0.1 |
| [docs/releases/changelog.md](../../docs/releases/changelog.md) | `releases/changelog/` | Resources and governance > Releases > Changelog format |
| [docs/adoption/verification.md](../../docs/adoption/verification.md) | `adoption/verification/` | Resources and governance > Maintainer reference > Starter verification |
| [docs/adoption/sidebar-placement.md](../../docs/adoption/sidebar-placement.md) | `adoption/sidebar-placement/` | Resources and governance > Maintainer reference > Batch 1C sidebar handoff |

## Preserve the existing map

Add the new adoption group directly after Start here > Overview. Add Foundations > Accessibility after typography/shape/icon foundations and before Motion. Add a new top-level Components group and Patterns and layouts shortcut adjacent to the existing Components and patterns group; retain every current UX/spec/gallery entry and URL. Keep Product implementations/source references accessible rather than moving or collapsing them destructively. Add Resources and governance for the contribution/release/maintainer entries, retaining all existing Reference and product-engineering routes as current aliases/shortcuts.

The component categories above are ordinary user names; the alphabetical index remains first. Patterns have 40 stable explicit IDs in their README, so links such as `patterns/#confirmation-undo` and `patterns/#list-layout` must remain. Existing P/S/L source anchors stay in place; there are no source moves to redirect.

## Examples and evidence assets

| Source resource | Publication target / discovery |
| --- | --- |
| examples/web/index.html | Full-page demo `examples/web/`, linked by Plain HTML guide |
| examples/web/component-gallery.html and its 19 section anchors | `examples/web/component-gallery.html#<component-slug>`, linked from every component page; no redundant 19 sidebar entries |
| examples/web/*.mjs, styles.css, scenarios.json | Downloadable/servable complete example source at the corresponding `examples/web/` path; do not drop code imports |
| examples/web/react/README-equivalent setup (guide), package.json, src.jsx, build/config/CSS | Source download tree `kit/examples/web/react/`, linked from React adoption; build the reviewed source for optional `examples/web/react/dist/` runnable output |
| examples/android/README.md and app/src/main | Download tree `kit/examples/android/`, linked from Android guide; no claim of APK/compiled artifact |
| examples/ios/README.md, Swift, Assets and Fonts | Download tree `kit/examples/ios/`, linked from iOS guide; no claim of IPA/compiled artifact |
| examples/web/README.md | Linked source README/download from the web guides, not a second canonical docs page |
| examples/web/verification/results.json and first-screen-390.png | `kit/examples/web/verification/`, linked from Starter verification; generated evidence, not a release certificate |
| docs/components/manifest.json, source-inventory.json, implementation-snapshot.json | `kit/components/` downloads linked from Components; machine-readable evidence gets no sidebar entry |
| docs/adoption/sidebar-map.json | `kit/adoption/sidebar-map.json` linked from this maintainer handoff; not a second page |

**Asset packaging dependency:** source examples use repository-relative `../../tokens/`, `../../fonts/` and `../../logo/`. For site-hosted examples, either preserve that complete relative asset layout below the base or rewrite **example asset URLs at packaging time** to the existing `kit/tokens`, `kit/fonts` and `kit/logo` snapshot. Font URLs are relative to tokens.css. Copy all required styles/modules/scenarios/assets together; a copied HTML file alone is not a published demo. Do not route raw JSX as an already executable static page. Build outputs are generated, not the authoritative source.

The original GitHub app pointers in component pages are explicitly read-only reference links and may differ from the inspected uncommitted worktree. The snapshot hashes define what was inspected; do not turn them into install instructions.

## Batch 3 acceptance

- Publish full new pages with all 12 component sections, tables and code; retain every old source item/ID/route. Compare [source inventory](../components/source-inventory.json), including code and asset links, before/after sync.
- Resolve all source Markdown/HTML/data links using this map; check rendered fragment IDs and demo asset requests beneath the real base path.
- Keep the new full-page demos accessible without iframe clipping; label native sources as uncompiled.
- Add titles/descriptions/breadcrumbs and search entries, then run rendered link and old-hash checks. No generator, sidebar, source-spec, README, token or motion file was edited by batch 1C.
- Preserve reported caveats: release target is planned v2.1.0 (397); v2.0.1 is the corrective migration stage. Publication/release approval belongs to the integration owner.

