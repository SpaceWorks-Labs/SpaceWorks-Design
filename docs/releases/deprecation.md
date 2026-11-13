---
title: Deprecation and removal
description: Give consumers a replacement, a minimum notice period and a reviewable migration.
---
# Deprecation and removal

Policy prepared for planned v2.1.0 approval; no component/token is newly deprecated by this page. The design owner approves the change; each affected product names a migration owner.

1. **Proposal:** explain why the existing contract is insufficient, list consumers and demonstrate the replacement with both themes, all states and accessibility evidence. Keep the original content/download available.
2. **Notice in a minor release:** mark deprecated in the manifest, component support strip and changelog. Include introduced version, deprecated-in version/date, replacement, migration steps, compatibility alias/adapter, owner, earliest removal date and earliest major version.
3. **Migration window:** retain working compatibility for **at least 180 days and two subsequent minor releases**, and through the applicable supported major. “Whichever is later” governs. If no subsequent minors ship, the two-minor condition remains unsatisfied; do not silently shorten it.
4. **Consumer review:** notify affected maintainers through their normal issue/PR route, track their versioned migration evidence and blockers, and publish an update before the planned cutoff. This page does not send messages or create issues.
5. **Removal in a major only:** after the minimum conditions, the owner explicitly approves the compatibility break. Preserve historic docs, assets and old aliases in labelled versioned archives; do not delete the historical record. Publish exact replacements and a rollback plan.

Example timeline, **illustrative and not a release announcement**: notice in v2.2 on 1 January; v2.3 and v2.4 retain compatibility; earliest proposed removal in v3 on/after 30 June, subject to the full 180-day calculation, support windows and consumer review. The first two subsequent minors are v2.3/v2.4; the notice release does not count.

```json
{
  "id": "illustrative-only",
  "status": "deprecated",
  "introduced": "2.0.0",
  "deprecatedIn": "2.2.0",
  "noticeDate": "YYYY-MM-DD",
  "replacement": "documented replacement ID",
  "removeNotBeforeDate": "YYYY-MM-DD (at least 180 days)",
  "removeNotBeforeVersion": "3.0.0",
  "owner": "named design owner and consuming product owner",
  "migration": "link to tested instructions"
}
```

Urgent safety/accessibility/security defects can require an immediate compatible fix or temporary restriction. Record the reason, affected users and safe alternative, maintain historical content, and let the owner approve any shorter exceptional transition explicitly. An exception does not quietly remove the public contract or reset other deprecation clocks.

Verify replacements with old/new token exports, type/API usage, keyboard/screen reader flows, both themes, 320 px/zoom, reduced motion and forced colours. A search returning no source imports is insufficient: consumers can refer to tokens/assets dynamically.
