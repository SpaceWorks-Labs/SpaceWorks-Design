# Batch 1B → batch 3 publication handoff

Add links/sections; preserve every existing route, heading, anchor, value table and download (owner395).
No site, docs, motion or brand file was edited by batch1B. New contract version is v2.1.0 per decision397.

| Existing site page | Add links / integration |
|---|---|
| `/tokens/reference/` (`site/src/content/docs/tokens/reference.mdx`) | Publish ARCHITECTURE.md, USAGE.md and contrast-matrix.md; consume usage.json for searchable purpose/scope/partner rows and copy exact CSS/DTCG names. Keep current TokenTable. Include chart-danger, Aurora and loader-local roles. |
| `/tokens/using-the-kit/` | Link portable.css, both DTCG modes, tailwind.preset.cjs, Android XML/Compose, Swift/asset catalogue; clarify old RGB vs new full-colour CSS formats and explicit native units. Link platform starters from batch1C. |
| `/foundations/` | Add token architecture, usage lookup, full contrast matrix and platform exports to its existing index. |
| `/specs/ui-brand-spec/tokens/` | Link generated required-pair/diagnostic matrix and source provenance. |
| `/specs/ui-brand-spec/interaction-states/` | Link boundary-strong/state-indicator restrictions and default/hover/active/selected pairings; coordinate original-line correction notes with batch1A. |
| `/specs/ui-brand-spec/shape-and-spacing/` | Link spacing/radius/size/border/elevation/layer/breakpoint roles and source decisions, including spec256 vs app264 sidebar distinction. |
| `/specs/ui-brand-spec/typography/`, `/brand/typography/` | Link full machine-readable type metrics and mobile roles; Gilroy only300/800, Outfit UI400–700, Unbounded short phrase. Native scaling remains host-owned. |
| `/motion/tokens/`, motion principles | Link duration/easing/distance roles, scoped long-duration exceptions, reduced-motion and kiosk/TV mapping. |
| `/theming/`, `/brand/colour/` | Link exact theme pairs, seven-member public tenant brand family, all fixed exclusions and contrast validation. |
| `/` and future downloads/adoption/accessibility pages | Add versioned export links, manifest checksum reference, usage/matrix links. Preserve existing downloads. |

New files need the existing site sync/download pipeline in batch3; source-relative links here are repository paths,
not a request to invent routes or edit generated split pages. Prefer one canonical copy of each generated table.
Publish paired DTCG files, portable.css **beside original tokens.css** (and fonts at the original relative location),
native dirs, contract.json, schema, usage JSON, contrast JSON and exports-manifest together. Keep `portable.css` import
order intact. Add `node scripts/tokens/validate.mjs` to the manual integration checks; this batch adds no CI policy.

Correction notes for the orchestrator's ledger: the dated DSA-014 note in ARCHITECTURE.md, the generated USAGE.md
note and contrast-matrix.md note all state the same role restriction. No historical line was changed. Suggested
shared current-rule anchor for batch1A: `docs/current-rules.md#token-contrast-pairings` (not assumed to exist here).
Default palette checks do not certify arbitrary tenant overrides or native component behaviour.
