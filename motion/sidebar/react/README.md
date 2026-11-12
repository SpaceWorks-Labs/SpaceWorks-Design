# React copies

Unmodified copies of the app files for this family (SpaceWorks 0.12.0; paths are relative to `frontend/src/`). They are reference code: they import app modules, Lingui (`t`) and Tailwind utility classes, so swap those for your own, or use the framework-free CSS one folder up, which is all the motion needs.

| File | App path | Imports to provide or replace |
|---|---|---|
| `useSlideIndicator.ts` | `lib/motion/useSlideIndicator.ts` | none |
| `motion.ts` | `lib/motion/motion.ts` | none |
| `Sidebar.tsx` | `components/shell/Sidebar.tsx` | `@lingui/core/macro`, `lucide-react`, `../../lib/motion`, `../brand/AnimatedLogoMark`, `../ui`, `./SidebarSection`, `./WorkspaceSwitcher`, `./UserMenu`, `./navKeys`, `./types` |
| `SidebarItem.tsx` | `components/shell/SidebarItem.tsx` | `@lingui/core/macro`, `../../lib/motion`, `./types` |
| `SidebarSection.tsx` | `components/shell/SidebarSection.tsx` | `@lingui/core/macro`, `lucide-react`, `../ui/Collapse`, `../../lib/safeStorage`, `./SidebarItem`, `./types` |
| `Disclosure.tsx` | `components/shell/Disclosure.tsx` | `../../lib/motion`, `./types` |
| `motion.css` | `styles/motion.css` | none |
