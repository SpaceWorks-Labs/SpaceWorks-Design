---
title: Migrate v1 to v2.0 and v2.0.1
description: Preserve the design-system history while upgrading tokens, typography, motion and accessibility.
---
# Migrate v1 → v2.0 → v2.0.1

This is a consumer checklist, not a claim that every named release is locally tagged. v2.0.0 is the released baseline stated by decision 382/lane brief; v2.0.1 is corrective work described by 389/390. Later decision 397 makes the additive audit release **v2.1.0**. Confirm actual published tag/commit before changing a dependency.

## v1 → v2.0

1. Record the current pinned commit and take before screenshots of affected screens in both themes. Keep v1's assets/book available as historical references.
2. Pin the actual v2.0.0 release; copy tokens/font/logo directories as one snapshot. Existing CSS compatibility names remain the import surface. Review [what changed](../whats-new-v2.0.md) for the complete original per-token and motion inventory, including before/after dark values.
3. Dark mode uses SW-316's black-neutral family: bg #000000, surface #0B0B0B, panel #141414, hover #1C1C1C and line #2C2C2C. Remove product-local green-tinted neutral overrides. Never promote accent fills to a universal text or boundary role.
4. Replace unlicensed/unsupported Gilroy 400–700 with Outfit 400–700. Keep only free Gilroy 300/800 display roles and Unbounded 500–600 accent; ship font licences. Replace synthetic Gilroy 600 headings with Gilroy 800 or the appropriate Outfit role.
5. Small status marks use solid success/warn/info in both themes; big tinted callouts have their separate dark-soft treatment. Keep words mandatory and correct on-fill roles. Original C/D6 dark-soft statements remain historical and need the current-rule note.
6. Adopt current B/E control states: 44 px minimum controls, radius 10 controls/16 panels, no card shadow, explicit disabled colours. Keep paid-font and opacity examples only as labelled history.
7. Use Light default and persist explicit Light/Dark before first paint. The historical System example is not a third theme option. Confirm staff versus public/member tenant override boundaries.
8. Adopt the motion family appropriate to each trigger, but retain accessible semantics/focus in the product. Reduced motion shows a still/quick fade; do not replay startup motion on every route. Run the full component/task state matrix.

## v2.0 → v2.0.1 corrective stage

Decisions 389/390 govern: the closed box must retain all four flap regions (two orange/two green, positions matching the open master), overlays must not open competing layers or clip content, and pills/buttons must not squeeze letters at narrow widths. Re-copy corrected assets/markup/CSS together rather than recolouring an obsolete export. Preserve the old downloads with historical labelling.

Verify light/dark, 390/768/1280 and 320 px reflow; open/close dialog, sheet, left/right drawer and menu; test Escape/focus return, typography and long translated labels. Use the actual corrected release's changelog and checksums. This batch did not publish or regenerate that release's motion previews.

## Planned v2.1.0 additions

Phase 2 adds component/adoption/governance contracts and portable token coverage; under semver these are minor additions, per ledger 397. Existing names/paths/source anchors remain. Read the new component pages for previously implicit states and known app gaps. New native exports are starter mappings; they do not turn v2.0.1 into a compiled native library.

## Upgrade acceptance and rollback

- Pin one immutable release commit and record kit version separately from app version/book edition.
- Compare public token keys/types/units and all consumed component props/imports; retain aliases and intentional tenant overrides.
- Exercise empty, filtered-empty, loading, pending, error/Retry, offline and interrupted work with realistic permission-gated data.
- Test keyboard, screen reader, both themes, 200% text, 400% zoom/320 px, reduced motion, forced colours and actual target rectangles.
- Record browser/platform/toolchain results and known limitations; route shared defects to the design owner.
- Roll back the kit dependency to the recorded prior SHA if the consumer cannot complete a critical task. Reconcile any in-flight product mutation independently; asset rollback does not undo server writes.

Do not regenerate release assets, add workflows or alter branch protections from this migration guide. [Version/support policy](versioning.md) and [deprecation](deprecation.md) define compatibility timelines.
