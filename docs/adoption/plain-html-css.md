---
title: Plain HTML and CSS first screen
description: Open an accessible local inventory screen with no framework or package dependency.
---
# Plain HTML and CSS first screen

Start with [release pinning](README.md#pin-the-kit-before-building). Required tools: Node 22.12+ for the supplied local server and a modern browser supporting native dialog for the layer demos. The first-screen page has no build step or npm dependency.

From a reviewed source snapshot containing the starters:

```powershell
node examples/web/server.mjs
```

Open http://localhost:4174/examples/web/ and the [component gallery](../../examples/web/component-gallery.html). The server binds loopback and serves only examples/web, tokens, fonts and logo, not the site's build or app source. Stop with Ctrl+C.

For a new product, copy index.html, styles.css, theme.mjs and first-screen.mjs into its public page directory. Keep the same token/fonts/logo hierarchy or update every relative import to your pinned vendor path. CSS's @font-face font URLs are relative to tokens.css, so retain the fonts sibling directory and its licences.

```html
<!doctype html>
<html lang="en"><head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Inventory · My product</title>
  <script>
    try { document.documentElement.classList.toggle('dark',
      localStorage.getItem('sw-starter-theme') === 'dark'); } catch {}
  </script>
  <link rel="stylesheet" href="/vendor/spaceworks-design/tokens/tokens.css">
</head><body>
  <a href="#main-content">Skip to content</a>
  <main id="main-content" tabindex="-1"><h1>Inventory</h1></main>
</body></html>
```

The complete starter adds the branded page styles and real labelled search. Adapt inline bootstrap to your product's CSP nonce/hash; do not remove early theme application and create a flash. theme.mjs persists explicit Light/Dark safely when storage is unavailable and listens for cross-tab changes. Default remains Light even with an OS dark preference (SW-204).

Use rgb(var(--color-ink)) on rgb(var(--color-bg)); use on-accent for filled actions and accent-ink for standalone links. Outfit 400–700 is body/control type, Gilroy 800 display only; tokens.css imports shipped font faces. Use light and reversed lockups as separate assets with descriptive alt text, preserving proportions and clear space. Never request Gilroy 600 or alpha text.

Search submits local sample data; Clear filters preserves focus on its button. Zero matches produces a distinct empty sentence and a count announcement. No-JS keeps sample inventory readable; theme/search enhancements require JavaScript. Real persistence needs product-owned field errors, network/offline recovery and pending feedback.

Acceptance: load fonts/logo with no 404; inspect both themes; search “saw” and clear it; Tab through all controls; test 320 px/400% zoom, forced colours and reduced motion. [Recorded results](verification.md) apply only to this starter, not every product.
