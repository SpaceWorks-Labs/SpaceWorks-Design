# React copies

Unmodified copies of the app files for this family (SpaceWorks 0.12.0; paths are relative to `frontend/src/`). They are reference code: they import app modules, Lingui (`t`) and Tailwind utility classes, so swap those for your own, or use the framework-free CSS one folder up, which is all the motion needs.

| File | App path | Imports to provide or replace |
|---|---|---|
| `TransitionLink.tsx` | `lib/motion/TransitionLink.tsx` | `./routeTransition` |
| `useTransitionNavigate.ts` | `lib/motion/useTransitionNavigate.ts` | `./routeTransition` |
| `routeTransition.ts` | `lib/motion/routeTransition.ts` | `./motion` |
| `RouteTransitionGate.tsx` | `lib/motion/RouteTransitionGate.tsx` | `./routeTransition` |
| `ScrollManager.tsx` | `lib/motion/ScrollManager.tsx` | none |
| `motion.ts` | `lib/motion/motion.ts` | none |
| `index.ts` | `lib/motion/index.ts` | `./motion`, `./usePresence`, `./routeTransition`, `./RouteTransitionGate`, `./ScrollManager`, `./TransitionLink`, `./useTransitionNavigate`, `./useSlideIndicator` |
| `motionRoute.css` | `styles/motionRoute.css` | none |
