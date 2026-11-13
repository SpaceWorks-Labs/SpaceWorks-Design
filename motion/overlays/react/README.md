# React copies

> **Current rule (v2.0.1, 2026-11-13):** These reference copies now include decision-399 motion fixes and token-derived timing; the retained “unmodified copies” description below is historical. App-only dependencies still need host adapters. Use the [family flow contract](../README.md#flow-contract-decision-399); see [current rules](../../../docs/current-rules.md#cr-motion-01).

`OverlaysDemo.tsx` is the kit's standalone React adapter. It shares `../overlays.js` and `../overlays.css` with the HTML demo: one active layer, exit before replacement, a pending request that follows the latest click, frame-scoped scrims, token skins, focus handling and instant reduced-motion end states. Load `../../demo.css` and the design tokens once in your host application. The component cleans up listeners and pending animation waits when unmounted.

The files in the table below remain app reference copies; their imports and viewport portals are specific to the app. Use the kit adapter when embedding a demo in a documentation frame.

Unmodified copies of the app files for this family (SpaceWorks 0.12.0; paths are relative to `frontend/src/`). They are reference code: they import app modules, Lingui (`t`) and Tailwind utility classes, so swap those for your own, or use the framework-free CSS one folder up, which is all the motion needs.

| File | App path | Imports to provide or replace |
|---|---|---|
| `usePresence.ts` | `lib/motion/usePresence.ts` | `./motion` |
| `motion.ts` | `lib/motion/motion.ts` | none |
| `Modal.tsx` | `components/ui/Modal.tsx` | `@lingui/core/macro`, `./dialogFocus`, `../../lib/motion`, `./keyboardSafe`, `./OverlayPortal`, `lucide-react` |
| `DetailDrawer.tsx` | `components/ui/DetailDrawer.tsx` | `@lingui/core/macro`, `./dialogFocus`, `../../lib/motion`, `./keyboardSafe`, `./OverlayPortal` |
| `OverflowMenu.tsx` | `components/ui/OverflowMenu.tsx` | `@lingui/core/macro`, `../../lib/motion`, `./ConfirmDialog`, `./RouteLink`, `./icon`, `./types`, `./useRovingFocus` |
| `OverlayPortal.tsx` | `components/ui/OverlayPortal.tsx` | none |
| `motionOverlay.css` | `styles/motionOverlay.css` | none |
