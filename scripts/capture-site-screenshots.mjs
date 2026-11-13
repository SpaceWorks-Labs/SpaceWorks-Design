// Captures the README gallery of the built design site (decision 403): key pages, light and dark, phone and desktop.
// Usage: cd site && npm run build; cd .. && node scripts/capture-site-screenshots.mjs [handover-copy-dir]
// Uses the site's Edge/CDP harness (site/scripts/integration-browser.mjs; DS_BROWSER_HELPER=<path> overrides it).
import { createRequire } from 'node:module';
import { mkdirSync, copyFileSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = resolve(import.meta.dirname, '..');
const helper = process.env.DS_BROWSER_HELPER || join(ROOT, 'site/scripts/integration-browser.mjs');
const { browser, BASE, delay } = await import(pathToFileURL(helper).href);
const sharp = createRequire(join(ROOT, 'site/package.json'))('sharp');

export const PAGES = [
  ['home', '/'], ['components', '/components/'], ['button', '/components/button/'],
  ['tokens', '/tokens/reference/'], ['colour', '/brand/colour/'], ['logo', '/brand/logo/'],
  ['motion', '/motion/principles/'], ['overlays', '/motion/overlays/'], ['accessibility', '/foundations/accessibility/'],
  ['adoption', '/adoption/'], ['current-rules', '/current-rules/'], ['decisions', '/decisions/'],
];
const SIZES = [['desktop', 1440], ['phone', 390]];
const out = join(ROOT, 'screenshots/site');
const copy = process.argv[2];
mkdirSync(out, { recursive: true });
if (copy) mkdirSync(copy, { recursive: true });

await browser(async ({ navigate, screenshot, evaluate }) => {
  for (const [name, path] of PAGES) {
    for (const theme of ['light', 'dark']) {
      for (const [size, width] of SIZES) {
        await navigate(BASE + path, width, theme);
        await evaluate('window.scrollTo(0, 0)');
        await delay(900);
        const png = join(out, `${name}-${size}-${theme}.png`);
        await screenshot(png);
        const webp = png.replace(/\.png$/, '.webp');
        await sharp(png).resize({ width: Math.min(width, 1440) }).webp({ quality: 82 }).toFile(webp);
        if (copy) copyFileSync(webp, join(copy, `${name}-${size}-${theme}.webp`));
        rmSync(png);
        console.log(webp.slice(ROOT.length + 1));
      }
    }
  }
});
