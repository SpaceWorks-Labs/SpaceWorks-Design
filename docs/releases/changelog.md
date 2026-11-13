---
title: Changelog format
description: Record design-system changes with consumer impact, evidence and migration links.
---
# Changelog format

Keep the existing [README changelog](../../README.md) and [v2.0 history](../whats-new-v2.0.md). New release entries are additive; a correction is a dated note, not a rewritten historical claim. The release owner fills factual dates/tags/commits/checksums after verification. This batch creates no release or fabricated historical entry.

Use this format:

```markdown
## [2.x.y] — YYYY-MM-DD
Status: draft | released. Tag: actual tag. Commit: full immutable SHA.
Kit version: 2.x.y. Ships alongside: optional product version. Artwork edition: v2.
Support: start / earliest end and scope. Owner: named maintainer.

### Added
- Component/token/motion/docs ID, why it exists, supported platforms and maturity.
### Fixed
- Trigger → old failure → corrected outcome; affected themes/states.
### Changed
- Consumer-visible impact, including numeric/visual token effects.
### Deprecated
- Replacement, notice date, earliest removal date/version, migration link.
### Removed (major only)
- Previous notice and compatibility window; retained historical resource link.
### Accessibility and verification
- Actual commands, browser/AT/platform versions, viewports/themes and results.
- Known limitations; distinguish source checks, rendered tests and manual AT.
### Migration
- Steps, aliases/adapters, before/after example and rollback.
### Assets
- Published paths, format/size/licence, hashes when generated; no placeholders marked released.
```

Omit empty headings in a real entry. Separate changed contract from repaired implementation. “A11y improved” or “tokens updated” alone is insufficient; name the control, state, before/after behaviour and test evidence. Release notes must not inherit SpaceWorks app 0.12.0 as the kit version. A draft v2.1.0 entry may link this audit batch, but must not say “released” before owner publication.
