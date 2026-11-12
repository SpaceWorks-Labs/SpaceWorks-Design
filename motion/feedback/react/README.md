# React copies

Unmodified copies of the app files for this family (SpaceWorks 0.12.0; paths are relative to `frontend/src/`). They are reference code: they import app modules, Lingui (`t`) and Tailwind utility classes, so swap those for your own, or use the framework-free CSS one folder up, which is all the motion needs.

| File | App path | Imports to provide or replace |
|---|---|---|
| `ReturnConfetti.tsx` | `components/delight/ReturnConfetti.tsx` | `./DelightProvider` |
| `confetti.css` | `components/delight/confetti.css` | none |
| `delight.css` | `components/delight/delight.css` | none |
| `cardVerify.css` | `features/cards/cardVerify.css` | none |
| `SuccessCard.tsx` | `components/delight/SuccessCard.tsx` | `@lingui/core/macro`, `lucide-react`, `./DelightProvider`, `./doorSounds`, `./Artwork` |
| `PassState.tsx` | `components/delight/PassState.tsx` | `../../lib/format`, `lucide-react`, `./DelightProvider` |
| `WorkshopLogbook.tsx` | `components/delight/WorkshopLogbook.tsx` | `@lingui/core/macro`, `./DelightProvider` |
