# React copies

> **Current rule (v2.0.1, 2026-11-13):** These reference copies now include decision-399 motion fixes and token-derived timing; the retained ?unmodified copies? description below is historical. App-only dependencies still need host adapters. Use the [family flow contract](../README.md#flow-contract-decision-399); see [current rules](../../../docs/current-rules.md#cr-motion-01).

Unmodified copies of the app files for this family (SpaceWorks 0.12.0; paths are relative to `frontend/src/`). They are reference code: they import app modules, Lingui (`t`) and Tailwind utility classes, so swap those for your own, or use the framework-free CSS one folder up, which is all the motion needs.

| File | App path | Imports to provide or replace |
|---|---|---|
| `display.css` | `features/spaceDisplay/display.css` | none |
| `KioskLayout.tsx` | `components/layouts/KioskLayout.tsx` | `@lingui/core/macro`, `../brand/AnimatedLogoMark`, `../ui`, `./KioskPin`, `./LayoutFrame`, `./types` |
| `PublicStatsTvPage.tsx` | `features/stats/PublicStatsTvPage.tsx` | `../../lib/format`, `@lingui/core/macro`, `../../components/PageMetadata`, `../../components/brand/AnimatedLogoMark`, `../../components/layouts/LayoutFrame`, `../../lib/useTenantBranding`, `../../lib/tenant`, `../inventory/PublicInventoryParts`, `../inventory/usePublicInventory`, `../inventory/publicErrorState`, `./api`, `./StatsMetrics`, `./StatsParts` |
