# Brand guidelines v2 (Space Works Design System v2.0): source

`../space-works-brand-guidelines-v2.pdf` (50 pages, 1440 × 1000 px pages, the same 1080 × 750 pt size as v1) is
built from the HTML and CSS in this folder. Brand guidelines v1 (`../space-works-brand-guidelines-v1.pdf`,
`../guidelines/`) is kept unchanged; v2 supersedes it wherever the two differ. The book ships alongside SpaceWorks 0.12.0.

## Rebuild

From the repository root, on Windows with Microsoft Edge installed:

```bash
node brand/guidelines-v2/build.mjs          # src/index.html, the PDF and png/NN.png
node brand/guidelines-v2/build.mjs --html   # src/index.html only (open it in a browser to preview)
```

The script starts headless Edge with a throwaway profile, prints the PDF through the DevTools protocol
(`Page.printToPDF`, `@page` size from `src/styles.css`), screenshots each page into `png/`, then closes Edge
and deletes the profile. It also prints a font check (Gilroy 300 and 800, Outfit, Unbounded must all say
`true`) and lists any element that crosses the page margins. Edge's path is set in `build.mjs` (`EDGE`).

## Files

| Path | What it is |
|---|---|
| `build.mjs` | Assembles the pages, resolves placeholders, renders the PDF and PNGs |
| `src/shell.html` | Document shell: links `tokens/tokens.css` (fonts and tokens), `motion/box-open/box-open.css`, `generated.css`, `styles.css` |
| `src/styles.css` | Page grid (header, footer, margins), page types (`cream`, `citron`, `ink`, `black`, `split`) and the mock components |
| `src/pages/NN-*.html` | One file per section; each `<section class="pg …" data-sec="…">` is one page. `data-toc` puts a section in the contents |
| `src/qr/*.svg` | Pre-generated QR codes for the hosted site pages (Deep Ink on transparent) |
| `src/generated.css`, `src/index.html` | Written by the build; do not edit |
| `png/NN.png` | Page renders at 1440 × 1000 |

## Placeholders resolved by the build

- `{{cr:light.ink/light.bg}}`: WCAG contrast ratio of two colours from `tokens/tokens.json` (or `#hex`), two decimals.
- `{{hex:dark.accent-ink}}`: a token's hex value.
- `{{box}}`: the box-open SVG markup from `motion/box-open/box-open-markup.html`.
- `{{strip:once|loop|hov:light|dark:0|Label,200,…}}`: a row of box-open frames frozen from the shipped CSS
  (a negative `animation-delay` with the animation paused), at the listed times in ms.
- `{{ladder:light|dark}}`, `{{fam:light|dark}}`: the neutral ladder and the accent and status families.
- `{{svg:path}}`, `{{qr:name}}`, `{{toc}}`.

Colours only come from `tokens/tokens.json`: `generated.css` turns it into `.th-light` / `.th-dark` blocks and
the brand, chart, loader and card variables. The only literal colours are the old teal-lit dark values on the
"From green-black to solid black" page, which document the palette that was replaced. After a token change,
rebuild: every swatch and ratio follows.

## QR codes

The QR SVGs are committed so the build needs no packages. To regenerate one (for example after a URL change):

```bash
npx qrcode@1.5.4 -t svg -e M -q 0 -d 142C2AFF -l 00000000 -o brand/guidelines-v2/src/qr/site.svg "https://spaceworks-labs.github.io/SpaceWorks-Design-System/"
```
