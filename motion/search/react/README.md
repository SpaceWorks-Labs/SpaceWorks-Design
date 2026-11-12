# React copies

Unmodified copies of the app files for this family (Design System v2.0, taken from the SpaceWorks 0.12.0 app; paths are relative to `frontend/src/`). They are reference code: they import app modules, Lingui (`t`), `lucide-react` and Tailwind utility classes, so swap those for your own, or use the framework-free CSS one folder up, which is all the motion needs.

| File | App path | Imports to provide or replace |
|---|---|---|
| `SearchField.tsx` | `components/ui/SearchField.tsx` | `@lingui/core/macro`, `lucide-react`, `../BoxSpinner` (the box-open spinner), `./SearchField.css` |
| `SearchField.css` | `components/ui/SearchField.css` | none (tokens from `tokens/tokens.css`) |
