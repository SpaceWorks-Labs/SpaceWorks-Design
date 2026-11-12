# React copies

Unmodified copies of the app files for this family (SpaceWorks 0.12.0; paths are relative to `frontend/src/`). They are reference code: they import app modules, Lingui (`t`) and Tailwind utility classes, so swap those for your own, or use the framework-free CSS one folder up, which is all the motion needs.

| File | App path | Imports to provide or replace |
|---|---|---|
| `motion.css` | `styles/motion.css` | none |
| `SidebarItem.tsx` | `components/shell/SidebarItem.tsx` | `@lingui/core/macro`, `../../lib/motion`, `./types` |
| `SpaceCard.tsx` | `features/landing/SpaceCard.tsx` | `@lingui/core/macro`, `../../components/BrandFacets`, `../../components/MakerspaceBrand`, `../../components/MakerspaceMapLink`, `../../components/ui`, `../../components/ui/tones`, `../../types/inventory`, `../../components/LogoLoader` |
