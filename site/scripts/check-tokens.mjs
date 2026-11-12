// Build-time drift guard: the site theme reads tokens.css (synced from the repo root), so this only has to prove
// that tokens.css and tokens.json still agree, value for value, in both themes. Fails the build otherwise.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const json = JSON.parse(readFileSync(join(root, 'tokens', 'tokens.json'), 'utf8'));
const css = readFileSync(join(root, 'tokens', 'tokens.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
const block = (re) => [...css.matchAll(re)].map((m) => m[1]).join('\n');
const parse = (text) => Object.fromEntries([...text.matchAll(/--color-([a-z-]+):\s*(\d+) (\d+) (\d+)\s*;/g)].map((m) => [m[1], [m[2], m[3], m[4]].map(Number)]));
const sets = {
  light: parse(block(/:root\s*\{([^}]*)\}/g)),
  dark: parse(block(/:root\.dark\s*\{([^}]*)\}/g)),
};
const hex = (rgb) => '#' + rgb.map((n) => n.toString(16).padStart(2, '0')).join('').toUpperCase();

let bad = 0;
for (const [theme, tokens] of Object.entries(json).filter(([k]) => k === 'light' || k === 'dark')) {
  for (const [name, value] of Object.entries(tokens)) {
    const got = sets[theme][name];
    if (!got) { console.error(`check-tokens: ${theme}.${name} is in tokens.json but not tokens.css`); bad++; }
    else if (hex(got) !== value.toUpperCase()) { console.error(`check-tokens: ${theme}.${name} json ${value} != css ${hex(got)}`); bad++; }
  }
}
if (bad) { console.error(`check-tokens: ${bad} mismatch(es)`); process.exit(1); }
console.log('check-tokens: tokens.css and tokens.json agree in light and dark');
