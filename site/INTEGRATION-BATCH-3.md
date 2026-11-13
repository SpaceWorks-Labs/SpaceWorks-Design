# DS-AUDIT phase 2, batch 3 — 2026-11-13

VERSION is 2.1.0; this is a publication target pending the tag, not a claim a release exists. No git writes or make-previews runs.

- DSA-003 DONE: complete box-open README (including SW-412), 13/13 omitted introductions restored; `scripts/sync-extra.mjs`, `sync-motion-kit.mjs`, `sync-theme-reveal.mjs`, `check-publication.mjs` (all paths in this report are below site/ unless stated).
- DSA-006 DONE: VERSION-derived tag/archive/install component; `src/components/release.ts`, `ReleaseInstall.astro`, home, Using the kit and generated Downloads; development main remains labelled separately.
- DSA-018 PARTLY: actual-demo capture/interaction scenarios share all 22 existing MOTION_SCENES IDs in `scripts/check-integration-browser.mjs`; execution and visual parity review remain for the orchestrator. Preview regeneration is intentionally deferred.
- DSA-020 DONE: named alphabetical/category/source-ID discovery, 19 pages and canonical route preservation; `astro.config.mjs`, `scripts/publication-map.mjs`, `sync-publications.mjs`, `src/components/ComponentFinder.astro`.
- DSA-031 DONE: download index explicitly index,follow; raw HTML noindex,follow with documentation canonicals; raw kit/examples/thumbs excluded in robots.txt; `scripts/sync-publications.mjs`.
- DSA-033 DONE: easing previews use the 240ms slow token; rows support keyboard focus playback; `src/components/MotionTokens.astro`.
- 1A/1B/1C/2B/2M handoffs DONE in publication: 42 new source pages + Downloads, all export/checksum/source trees, searchable token usage and companion links; full examples and shared motion scripts packaged. `scripts/sync-*`, `src/components/TokenUsage.astro`, relevant content pages.
- Media DONE: `package.json` runs root make-thumbs before sync/build; `MotionPreview.astro` emits poster src/srcset/dimensions + data-animation + original downloads; `MediaEnhancements.astro` keeps Play/Pause. Originals are read only.
- Demo sizing IMPLEMENTED, browser measurement PENDING: 15 root `motion/*/demo.html` files only gain target CSS (44px house actions; 24px native checkbox/radio); 2M controllers and motion styles untouched.
- Version/history DONE: root VERSION, additive root README changelog/current-target note, additive root docs/whats-new-v2.0.md link + new docs/whats-new-v2.1.md.

Shipped sidebar (all existing routes stay canonical; repeated entries are shortcuts to the same pages):
```text
Start here: Overview; Adopt the system [Choose a platform, Plain HTML/CSS, React/Tailwind, Android Compose, iOS SwiftUI]; Current rules; What's new v2.1; Using the kit; What's new v2.0
Foundations: Overview; Token reference/architecture/usage/contrast; Token values/contrast; Paste-ready CSS; Theming; Type; Shape/spacing; Icons; Accessibility
Motion: Principles + parts; Tokens; Flow; Every animation; Brand moments; Navigation; Layers; Feedback/state; Displays (all 15 family pages)
Components: All components
  Actions: Button, Link, IconButton
  Forms: TextField/SearchField, Checkbox, Radio, Switch, Select
  Navigation: Tabs, SegmentedControl, Pagination
  Data and display: Table, StatusPill
  Feedback: EmptyState, Toast, Skeleton/Loader
  Layers: Dialog, Drawer/Sheet, Menu
Patterns and layouts: Named P1–P30/L1–L10 map; existing pattern/layout spec parts; Quality bar; Adaptations
Product implementations: UX introduction/patterns/gallery; UX spec/core screens; every long-tail screen/batch/appendix/coverage page
Content: Voice and content; Brand voice; Interaction/microcopy
Product engineering rules: every Rules part; Pipelines and releases (all Delivery parts)
Brand: Introduction; Logo; Logo in product; Colour; Typography; Graphics; Patch; Guidelines
Resources and governance: Downloads; Contribute; Releases [Overview, Versioning/support, Deprecation, Migration, Changelog]; Maintainer reference [Verification, Sidebar handoff]; Decisions; Lessons; UI brand reference; Inspiration; Credits
```

- Build PASS with NODE_OPTIONS=--max-old-space-size=2048: 152 pages built; Markdown validator green; integrated artifact checks: 172 HTML documents, 30,055 links, 2,317 asset references, 56 posters, 360 thumbnails, 0 failures.
- Specified design-v2/content-inventory.mjs comparator PASS against v2.0.0 baseline and 2B baseline: all six categories missing 0, unresolved 0; after counts heading 1,227 / paragraph 4,329 / row 14,979 / media 278 / external link 322 / internal link 3,305; inventory pages 43→157 and 109→157 (includes raw example index files).
- Presentation normalization is explicit in scripts/content-inventory.mjs: preserved sample titles represented as text, derivative URLs mapped to originals, additive download metadata separated. No paragraph is ignored. The legacy comparator separately reports 9 historical source paragraph changes/extensions and 3 rows; one paragraph extension is this batch's additive upgrade note. Current-source inventory below has no exceptions for those items.
- Current-source inventory PASS: 68 sources, 42 new pages, 985 headings, 54 explicit anchors, 3,500 paragraphs, 93,564 table cells, 166 code blocks, 9 images, 1,538 links; 0 missing; 365 moved-anchor mappings and item canonical pages recorded in verification/publication-inventory.json.
- Static motion PASS: 14 families / 137 sources / 86 styles / 78 keyframes / 57 JS / 59 TS/TSX; 0 failures. Token validator PASS: 425 paired tokens, 111 exact exports, 204 required contrast pairs. site/scripts/check-tokens.mjs PASS.
- Frame raster PASS: 1,955 emitted frames, 0 hole pixels, 15 static-rest rasters, baseline hashes exact. Required default node scripts/check-box-frames.mjs FAILED here: Edge stopped responding to Page.enable (sandbox CDP unavailable). This is not a browser/compositor pass.
- Orchestrator commands: node scripts/check-box-frames.mjs; node scripts/check-motion-flow.mjs --browser --require-browser; node site/scripts/check-integration-browser.mjs (syntax checked, not browser-run here). Inspect its actual-demo captures alongside previews; rerun after orchestrator preview regeneration. Reports: site/verification/ and site/verification/browser/.
- Added correction notes for ledger: 3-N01 root README (VERSION target supersedes retained v2.0.1 line); 3-N02 Using the kit (pin before import); 3-N03 Using the kit (remote update is development; reviewed-tag upgrade PR). All dated 2026-11-13 and linked to current release guidance. No existing correction note was removed.
- Auto decisions: URL-safe new release route /whats-new-v2-1/; metadata/link/fragment repair occurs only in packaged raw HTML; existing reviewed React dist is copied when present without claiming a new compilation; no native compilation claim. git diff --check PASS.
