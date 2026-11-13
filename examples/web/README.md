# Web starters and component gallery

Node 22.12+; no dependency install for the HTML starter:

```powershell
node examples/web/server.mjs
```

Open http://localhost:4174/examples/web/ or /examples/web/component-gallery.html. The HTML first screen and 19 default gallery samples are static/native HTML. JavaScript adds local search, theme, state/variant previews, dialog enhancement and a toast timing/focus example; it makes no product API call.

The React directory is a separate pinned React/Tailwind/Vite starter: npm install then npm run build there; open /examples/web/react/dist/ through the same server. Source JSX does not run through a plain static server.

export-native.py generates native starter role maps/TTF/logo assets only. It requires fonttools[brotli] and performs no Android/iOS compilation. [Adoption guides](../../docs/adoption/README.md) and [actual verification](../../docs/adoption/verification.md) distinguish requirements from results.
