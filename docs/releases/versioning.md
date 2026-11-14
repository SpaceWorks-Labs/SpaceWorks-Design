---
title: Versioning and support
description: Define breaking and compatible design-system changes across tokens, components, motion and guidance.
---
# Versioning and support

**Policy for owner approval with planned v2.1.0; effective for releases adopting this policy.** Documentation date: 2026-11-13. Owner: Space Works design-system owner (SpaceWorks Labs). This does not retroactively claim earlier release practices or an already staffed support service.

The design system uses MAJOR.MINOR.PATCH. Public contracts include token names/types/units/roles and allowed theme pairs, component API and behaviour, accessibility requirements, import paths, motion triggers/fallbacks, artwork identity and normative guidance. Evaluate the effect on consumers, not only file extensions. A stricter compatible bug correction can be a patch; a changed supported contract requiring consumer work is major even if made only in Markdown.

| Surface | Major | Minor | Patch |
| --- | --- | --- | --- |
| Tokens | Remove/rename a public token without compatibility alias; change units/type or semantic role; invalidate supported overrides/pairs | Add a role/scale/export while keeping compatibility names and allowed pairs; add deprecation aliases | Correct wrong generated value/parity or a documented accessible pair without changing role/name/type; disclose visual impact |
| Components | Remove/rename prop or import; require a new prop; change keyboard, persistence or semantic contract incompatibly | Add optional prop/variant or a reviewed component; extend supported platform with evidence | Fix rendering, focus, naming, clipping or error handling to the existing contract; compatible type/doc correction |
| Motion | Change required trigger/API, remove fallback, change navigation/focus contract or remove an asset path | Add optional family/adapter or a supported scenario | Repair overlap/clipping/timing to the documented contract, restore reduced-motion behaviour, fix generated preview |
| Fonts/logo/artwork | Change identity/proportions, remove supported format or licensed face/weight without a supported migration | Add an edition/format/size or opt-in asset while retaining old downloads | Correct incorrect export/colour regions to the existing approved master; repair metadata/licence inclusion |
| Documentation | Change a normative supported rule incompatibly, even without code changes | Add independently usable component/adoption/governance contracts or new supported guidance | Fix links, spelling, examples or factual discrepancies without adding/changing the public contract |

Colour/value changes require a visual and contrast impact note. Never label a palette redesign a patch just because CSS names stayed the same. A serious accessibility repair may need an accelerated patch, but preserve aliases and supply migration notes; do not use accessibility as a reason to hide a breaking contract change.

## Version axes and compatibility

- **Kit:** VERSION/tag/release, e.g. v2.0.0. New phase-2 surface targets v2.1.0 under decision 397.
- **Product:** e.g. SpaceWorks 0.12.0. It can consume a particular kit commit independently of the app's semver.
- **Artwork:** brand guidelines v1/v2 are editions; the kit release says which edition/assets it contains. A PDF edition is not an npm/component version.

Each release record includes the actual tag, immutable commit, release date, file checksums when produced, platform/toolchain evidence, component maturity, known limitations and migration links. A CSS export or starter does not prove native component support. Preserve compatibility aliases in the token manifest until the announced removal.

## Support window

Adopt these explicit minimums when the owner approves this policy:

| Line/status | Support commitment |
| --- | --- |
| Current stable major | Compatible fixes while current, and at least 12 months from its first stable release |
| Immediately preceding stable major | Critical accessibility/security/consumption fixes for at least 6 months after the successor major is released, and never shorter than its original 12-month minimum |
| Older major | Archived and downloadable; no routine fix promise. Do not remove historic docs/assets. |
| Experimental | Best effort, no compatibility guarantee; exact release pin and clear opt-in required |
| Documented reference / platform starter | Documentation/example maintenance only; no claim of production package or native parity |

Support end is the later applicable date. Publish actual start/end dates in release notes; if the historic first-release date is unverified, the owner must set a conservative explicit date before announcing end of support. Do not infer it from a file timestamp. This document does not announce end-of-support dates for v1/v2.

Report broken accessible behaviour with version/theme/platform and a minimal reproduction through the [contribution route](../contributing-design-system.md#request-or-contribute). The design owner triages shared-contract defects; product maintainers own local implementation and deployment. A confirmed blocking regression gets a named owner and a public status/update date in the issue; no unagreed response-time SLA is promised.

[Deprecation timelines](deprecation.md) apply within these support windows. Decision 386 means this policy does not add CI workflows, CODEOWNERS, protection settings or release automation.
