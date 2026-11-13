---
title: React and Tailwind first screen
description: Build a standalone React inventory example without importing SpaceWorks application modules.
---
# React and Tailwind first screen

First [pin the kit](README.md#pin-the-kit-before-building). There is no npm Space Works component library to install. This example composes native HTML in React and imports the compatibility tokens/fonts/logo directly. App snippets in component pages remain reference-only.

The source [package.json](../../examples/web/react/package.json) pins React/react-dom 19.2.7, Vite 8.1.6, Tailwind/@tailwindcss/postcss 4.3.2 and PostCSS 8.5.23, matching the installed dependencies used for local validation. Node 22.12+ is the starter baseline (verification used Node 24). Install inside the new product and commit the generated lockfile:

```powershell
cd examples/web/react
npm install
npm run build
cd ../../..
node examples/web/server.mjs
```

Open http://localhost:4174/examples/web/react/dist/. The source index.html needs Vite transformation and is not directly runnable through a plain static server. For development use npm run dev from the React directory. The build entry defines Tailwind's PostCSS plugin; the dev script needs the same configuration, supplied in vite.config.mjs.

Files: [src.jsx](../../examples/web/react/src.jsx), [Tailwind mapping](../../examples/web/react/tailwind.css), [build](../../examples/web/react/build.mjs). CSS imports the shared starter styles, which import tokens.css and its self-hosted font files. Logo SVG imports are bundled assets. The inline pre-paint script restores explicit Light/Dark; the React select updates class and saved preference. No System option. Replace the prototype's local state with your product's storage/context as needed, including cross-tab sync.

Tailwind 4's @theme inline maps canvas/content/body to semantic roles rather than hardcoded colours; the source uses layout utilities and shared control CSS. Map additional fill/on-fill pairs deliberately. Keep tokens.css and font relative paths together. Do not copy a Tailwind 3 configuration recipe into this Tailwind 4 starter. [Official Tailwind Vite guidance](https://tailwindcss.com/docs/installation/using-vite) explains the build integration; this starter uses the equivalent PostCSS plugin rather than @tailwindcss/vite.

The first screen has a labelled controlled input, form submit, result count status, true filtered-empty text, Clear filters, one h1 and correct logo variants. It makes no API calls. Loading/error/offline and backend permission gates remain product responsibilities.

Local audit validation can set SW_STARTER_MODULES to an existing reviewed frontend node_modules directory to avoid a second dependency installation; this is a build-harness option only, not a consumer dependency. The ordinary npm install/build path resolves the pinned local dependencies. [Verification](verification.md) states which path actually ran; it does not claim a clean network install.
