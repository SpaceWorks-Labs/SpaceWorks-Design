# React copies

> **Current rule (v2.0.1, 2026-11-13):** These reference copies now include decision-399 motion fixes and token-derived timing; the retained ?unmodified copies? description below is historical. App-only dependencies still need host adapters. Use the [family flow contract](../README.md#flow-contract-decision-399); see [current rules](../../../docs/current-rules.md#cr-motion-01).

Unmodified copies of the app files for this family (Design System v2.0, taken from the SpaceWorks 0.12.0 app; paths are relative to `frontend/src/`). They are reference code: they import app modules, Lingui (`t`), `lucide-react` and Tailwind utility classes, so swap those for your own, or use the framework-free CSS one folder up, which is all the motion needs.

| File | App path | Imports to provide or replace |
|---|---|---|
| `SearchField.tsx` | `components/ui/SearchField.tsx` | `@lingui/core/macro`, `lucide-react`, `../BoxSpinner` (the box-open spinner), `./SearchField.css` |
| `SearchField.css` | `components/ui/SearchField.css` | none (tokens from `tokens/tokens.css`) |

> **Note, 2026-11-13 (v2.1.0): import `SearchField.css` from your root stylesheet.** `SearchField.tsx` no longer imports `./SearchField.css` (it opens `@layer components`, and loading it from a component can order `components` below `base`, so buttons lose padding and colour). Consumers must import it from the root stylesheet, after `@import "tailwindcss"`.
