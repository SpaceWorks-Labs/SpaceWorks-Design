// Every animated logo mark on the built site shows exactly one artwork, and the right one for its surface:
// coloured on light, black-and-white (dk) on dark — in both page themes. Catches marks inside themed demo cards
// that follow the page theme instead of the card (blank cream-on-cream, or colour on a dark card).
// The theme demos (Theming page) are also switched through each of their modes and re-checked, so a card that
// changes theme at runtime keeps its marks in step.
// Usage: cd site && npm run build; cd .. && node scripts/check-box-grounds.mjs
// Uses the site's own Edge/CDP harness (site/scripts/integration-browser.mjs); DS_BROWSER_HELPER overrides it.
import { pathToFileURL } from 'node:url';
import { readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
const ROOT = resolve(import.meta.dirname, '..');
const helper = process.env.DS_BROWSER_HELPER || join(ROOT, 'site/scripts/integration-browser.mjs');
const { browser, BASE, delay } = await import(pathToFileURL(helper).href);
const dist = join(ROOT, 'site/dist');
const pages = [];
(function walk(dir) { for (const n of readdirSync(dir)) { const p = join(dir, n); if (statSync(p).isDirectory()) walk(p); else if (n === 'index.html') pages.push(dir); } })(dist);
const failures = []; let marks = 0, toggles = 0;
const inspect = `[...document.querySelectorAll('.sw-box:not(.mono)')].filter(b => b.getClientRects().length).map(b => {
  const shown = [...b.querySelectorAll(':scope > svg')].filter(s => getComputedStyle(s).display !== 'none').map(s => s.getAttribute('class'));
  const scope = b.closest('.sw-scope'); const surfaceDark = scope ? scope.classList.contains('dark') : document.documentElement.classList.contains('dark');
  return { shown, surfaceDark, where: scope ? (scope.getAttribute('aria-label') || 'demo card') : 'page' };
})`;
const record = (found, label) => {
  for (const f of found) {
    marks++;
    const want = f.surfaceDark ? 'dk' : 'colour';
    if (f.shown.length !== 1 || f.shown[0] !== want) failures.push(`${label} ${f.where} surface=${f.surfaceDark ? 'dark' : 'light'} shown=[${f.shown.join(',')}] want=${want}`);
  }
};
await browser(async ({ navigate, evaluate }) => {
  for (const dir of pages) {
    const path = BASE + dir.slice(dist.length).replace(/\\/g, '/') + '/';
    for (const theme of ['light', 'dark']) {
      await navigate(path, 1280, theme); await delay(150);
      record(await evaluate(inspect), `${path} page=${theme}`);
      // Runtime theme switches inside demo cards: every mode radio (ThemeDemo) and the reveal toggle (ThemeRevealDemo).
      const controls = await evaluate(`[...document.querySelectorAll('sw-theme-demo [data-mode], sw-theme-reveal-demo [data-toggle]')].length`);
      for (let i = 0; i < controls; i++) {
        await evaluate(`document.querySelectorAll('sw-theme-demo [data-mode], sw-theme-reveal-demo [data-toggle]')[${i}].click()`);
        await delay(900); toggles++;
        record(await evaluate(inspect), `${path} page=${theme} after-control-${i}`);
      }
    }
  }
});
console.log(`check-box-grounds: ${pages.length} pages, ${marks} mark checks, ${toggles} demo theme switches, ${failures.length} failures`);
failures.slice(0, 30).forEach(f => console.log('  ' + f));
process.exit(failures.length ? 1 : 0);
