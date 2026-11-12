# React copies

Unmodified copies of the app files for this family (SpaceWorks 0.12.0; paths are relative to `frontend/src/`). They are reference code: they import app modules, Lingui (`t`) and Tailwind utility classes, so swap those for your own, or use the framework-free CSS one folder up, which is all the motion needs.

| File | App path | Imports to provide or replace |
|---|---|---|
| `LogoDelight.tsx` | `components/delight/LogoDelight.tsx` | `./DelightProvider` |
| `logoUnfold.css` | `components/delight/logoUnfold.css` | none |
| `NotFoundPatch.tsx` | `components/delight/NotFoundPatch.tsx` | `lucide-react`, `../../lib/theme`, `./DelightProvider` |
| `PatchMoment.tsx` | `components/delight/PatchMoment.tsx` | `../../lib/theme`, `./NotFoundPatch`, `./DelightProvider` |
| `patch.css` | `components/delight/patch.css` | none |
| `Companion.tsx` | `components/delight/Companion.tsx` | `@lingui/core/macro`, `./Artwork`, `./DelightProvider` |
| `HolographicCard.tsx` | `features/members/wallet/HolographicCard.tsx` | `@lingui/core/macro`, `../../../components/delight/DelightProvider`, `./api`, `./CardFaces` |
