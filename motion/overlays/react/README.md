# React copies

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
