---
title: Contribute to the design system
description: Propose, review, build, document and release shared components with clear ownership and evidence.
---
# Contribute to the design system

This workflow is prepared for owner approval with planned v2.1.0. It supplements [product contribution rules](product-rules.md) and [decision recording](decisions.md); it does not override owner authority. Decisions 386/395 prohibit adding delivery automation/protection configuration in this phase and require additive content preservation.

## Ownership and review

| Role | Accountability |
| --- | --- |
| Design-system owner: Shaan Shoukath / Shaan-Shoukath | Approves shared contracts, exceptions, maturity, release scope and publication; owner-only commit/merge authority stays as recorded |
| Proposing product maintainer | Supplies problem/evidence, implementation, consumer compatibility and migration owner |
| Design reviewer assigned by owner | Checks task fit, brand/tokens, anatomy, responsive states and content |
| Engineering reviewer assigned by owner | Checks API/controlled state, dependencies, performance, platform behaviour and adoption |
| Accessibility reviewer assigned by owner | Checks criterion coverage and actual keyboard/AT/zoom/settings evidence |
| Consuming maintainer | Verifies the change in at least one independent consumer context and records regressions |

These are review roles, not a claim that a new staffed team, CODEOWNERS file or SLA exists. The owner can fill multiple roles for a small change; record that limitation and seek an independent consumer check before declaring broad stability.

## Request or contribute

Open a [design-system issue](https://github.com/SpaceWorks-Labs/SpaceWorks-Design-System/issues) or a PR through the existing repository process. If issue creation/access is unavailable, give the same proposal to the design-system owner through the team's existing channel; no new email address or support service is invented. Products must not fork tokens/components silently when a shared solution is plausible. No tool in this batch sends a message or opens an issue.

Include: product and pinned kit/app version; user task and affected people; screenshot/minimal reproduction in both themes where relevant; existing component/pattern search; why composition fails; frequency/reuse evidence; platform/locale/permission conditions; accessibility barriers; proposed API/token/state change; consuming owners and migration impact. Do not include secrets or private member data in examples.

## Proposal → review → build → document → release

1. **Propose:** name the task and exclusion cases. Search the [component index](components/README.md) and [P/L patterns](patterns/README.md). Prefer composition over a new variant with a conflicting purpose. New shared components need evidence in two product contexts, or an explicit owner-approved single-product rationale with an experimental status.
2. **Review:** agree ownership, design/API/state/token contract, native versus reference availability and success criteria before broad adoption. Check the latest ledger/public decision. A mismatch between code and rule is an issue to resolve explicitly, not permission to replace the rule silently.
3. **Build:** isolate reusable behaviour from product APIs; define controlled values, fetched state, events and dependencies. Preserve compatibility names/paths and existing tests. Supply a self-contained default and a static accessible fallback. Real app copies with missing modules must be labelled reference-only.
4. **Document:** use the audit's 12-part template: support strip; use/exclusions; runnable example/full code; numbered anatomy; variants; every applicable state and reasoned N/A; measurements/tokens; keyboard/a11y; content; do/don't; API/dependencies/limitations; related/maintenance. Retain every P/S/L/B/C identifier and exact source backlink. New pattern pages name the task and components they compose.
5. **Verify:** record actual results against the checklist below, independent consumer evidence and any remaining gap. Re-test affected behaviour after changes. A passing build or automated accessibility scan alone does not prove usability or WCAG conformance.
6. **Release:** owner chooses [semver](releases/versioning.md), updates maturity/manifest and dated changelog, publishes migration/deprecation details and pins the reviewed immutable release. Integration owner wires routes/sidebar and proves zero content loss. This batch changes no existing site wiring, CI/CD, CODEOWNERS or protection.

## Maturity

| Level | Entry/exit bar and support |
| --- | --- |
| Proposed | Problem/reuse evidence and an accountable owner; no supported implementation promise |
| Experimental | Opt-in coded/spec prototype, pinned version, known limitations; APIs can change with explicit notice |
| Candidate | Full 12-part contract and platform-specific evidence; ready for independent consumer validation |
| Stable | Owner approval, independent consumer use, complete applicable state/a11y evidence and documented support window; platform scope explicit |
| Deprecated | Stable replacement and migration, notice date/version, removal-not-before date/version and owner |
| Retired | Removed from current supported API only through the major/versioned process; historical docs/assets remain accessible |

**Documented reference** is an implementation availability label, not a lifecycle claim of stable code. The new component pages use it because source evidence/portable examples exist but no distributable multi-platform package is asserted. An Android colour export does not make a web component stable on Android.

## Quality bar

- [ ] Task/use/exclusion and reuse evidence; owner, status, introduced/updated version and supported platforms.
- [ ] All 12 template sections and exact original ID/backlink inventory; no deleted/reworded source material.
- [ ] Default/hover/pressed/focus/selected/disabled/read-only/loading/empty/filtered-empty/error/Retry/offline/success/interrupted states, or a concrete N/A reason.
- [ ] Measured geometry/spacing/type/targets; functional contrast pairs in both themes, tenant limits, long translation and 320 px reflow.
- [ ] Native semantics/name/description/error/status relationships, keyboard entry/movement/restore, no hidden focused controls.
- [ ] 200% text/400% zoom, forced colours, reduced motion, drag alternative and native accessibility settings.
- [ ] Runnable default plus full-page/static example, complete import/dependency contract and no-API/no-JS limitations.
- [ ] API/controlled versus fetched state, safe pending/retry, no duplicate mutation, explicit data ownership and meaningful content.
- [ ] Relevant tests actually run; browser/AT/device/version evidence and honest gaps; product consumer review.
- [ ] Semver, support/deprecation/migration/changelog and site placement; owner release approval, no unapproved delivery configuration.

## Exceptions and mismatches

Record the rule/criterion, user/task reason, affected product/version/platform, alternatives considered, impact, compensating behaviour, accountable owner and a review expiry **within 90 days or the next product release, whichever comes first**. The owner approves the scoped design exception; it is not a blanket WCAG waiver or a new default. Re-review before expiry, migrate to the shared contract when possible and keep the historical decision.

When sources disagree, use the latest applicable ledger/docs decision and add a dated note beside the old statement through its owning batch. Never delete or reword the original. File a regression with exact pinned version and reproduction if the implementation violates the contract. Changes to a shared rule need the same proposal/review path; local forks do not settle shared policy.
