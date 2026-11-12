# React copies

Unmodified copies of the app files for this family (SpaceWorks 0.12.0; paths are relative to `frontend/src/`). They are reference code: they import app modules, Lingui (`t`) and Tailwind utility classes, so swap those for your own, or use the framework-free CSS one folder up, which is all the motion needs.

| File | App path | Imports to provide or replace |
|---|---|---|
| `Skeleton.tsx` | `components/ui/Skeleton.tsx` | `../BoxSpinner` |
| `ProgressBar.tsx` | `components/ui/ProgressBar.tsx` | none |
| `cardJobs.tsx` | `features/cards/cardJobs.tsx` | `../../lib/format`, `@lingui/core/macro`, `../../lib/api` |
