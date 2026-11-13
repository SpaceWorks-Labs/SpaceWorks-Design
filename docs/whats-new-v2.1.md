# What's new in v2.1

Design System **v2.1.0**, publication target dated **2026-11-13** (decision 397). This document and a local build do not establish that a GitHub tag or release has been published. The design-system version is independent of SpaceWorks 0.12.0 and the brand-book edition.

## Find the right reference

- [Current rules](current-rules.md) links the binding guidance beside retained historical statements.
- [Components](components/README.md) names all 19 controls, with categories, source IDs, states, accessibility and runnable examples.
- [Patterns and layouts](patterns/README.md) maps P1–P30 and L1–L10 by task; all original spec routes and anchors remain canonical.
- [Voice and content](voice-and-content.md), [Accessibility](accessibility.md), [Contributing](contributing-design-system.md) and [Releases](releases/README.md) add practical implementation and maintenance guidance.

## Adopt across platforms

[Choose a platform](adoption/README.md): plain HTML/CSS and React/Tailwind starters, plus Android Compose and iOS SwiftUI source mappings. Native starters and generated exports are source-only here, not compiled or certified native components.

[Token architecture](../tokens/ARCHITECTURE.md), [usage reference](../tokens/USAGE.md) and [contrast matrix](../tokens/contrast-matrix.md) accompany 425 paired tokens and 111 generated exports. Portable full-colour CSS sits beside the unchanged legacy RGB-triplet CSS. DTCG light/dark JSON, Tailwind preset, Android XML/Compose and Swift/asset catalogues retain their units, aliases and checksum manifest. Required-pair validation covers 204 pairs; diagnostic failures remain documented with restrictions and replacements.

## Motion and media

[Motion flow](motion-flow.md) documents choreography, token timing, reversal, focus and reduced motion. The site publishes complete family READMEs, including box-open Files, Source of truth, Previews and SW-412. Coloured light box motion follows SW-412; black-and-white/reversed behaviour and later source notes remain visible in the [box-open README](../motion/box-open/README.md).

Motion images start with static derivatives and explicit Play/Pause controls. Thumbnails are generated before site synchronization, leaving original files intact. Standalone demos and raw downloads have an explicit indexing policy; documentation remains the search entry point. Demo controls have minimum CSS target sizes, and easing previews use the duration their label states.

## Install and upgrade deliberately

The site's Downloads and Using the kit pages derive the target tag from `VERSION`. Adopt a published release tag or reviewed immutable commit, record the submodule SHA, and review [migration guidance](releases/migration.md) before changing it. The moving main download remains available as development material. This integration creates no tags, commits, releases or delivery policy.

## Verification scope

Static build, links, source publication inventory, token guards and motion-flow checks accompany integration. Preview regeneration and browser compositing, scenario parity and geometry checks belong to the release orchestrator. Preview freshness alone does not prove behaviour or visual fidelity. The command `node site/scripts/check-integration-browser.mjs` runs the additional integrated browser checks when Playwright and a browser are available.
