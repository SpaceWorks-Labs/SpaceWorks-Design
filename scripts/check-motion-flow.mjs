// Run: node scripts/check-motion-flow.mjs [--browser] [--require-browser]
// Static checks need the site's existing PostCSS dependency (npm install --prefix site).
import { createRequire } from 'node:module';
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(join(root, 'site/package.json'));
const postcss = require('postcss');
const esbuild = require('esbuild');
const errors = [];
let styles = 0, sources = 0, frames = 0, javascript = 0, typescript = 0;
const read = path => readFileSync(path, 'utf8').replace(/^\uFEFF/, '');
const files = dir => readdirSync(dir, { withFileTypes: true }).flatMap(item => item.isDirectory() ? files(join(dir, item.name)) : [join(dir, item.name)]);
const families = readdirSync(join(root, 'motion'), { withFileTypes: true }).filter(item => item.isDirectory() && item.name !== 'box-open');
const allowed = new Set(['transform', 'translate', 'rotate', 'scale', 'opacity', 'clip-path', 'filter']);
const tokenCSS = read(join(root, 'tokens/tokens.css'));
const tokens = new Set([...tokenCSS.matchAll(/(--sw-(?:dur|ease)-[\w-]+)\s*:/g)].map(match => match[1]));
function fail(file, text) { errors.push(`${relative(root, file)}: ${text}`); }
function cssCheck(file, text) {
  styles++;
  let ast;
  try { ast = postcss.parse(text, { from: file }); } catch (error) { fail(file, error.reason); return; }
  const locals = new Map();
  ast.walkDecls(/^--/, decl => locals.set(decl.prop, decl.value));
  function linked(name, chain = []) {
    if (tokens.has(name)) return true;
    if (chain.includes(name) || !locals.has(name)) return false;
    const value = locals.get(name), refs = [...value.matchAll(/var\((--[\w-]+)/g)].map(match => match[1]);
    return refs.length > 0 && !/\d\s*(?:ms|s)\b|cubic-bezier\(/.test(value) && refs.every(ref => linked(ref, [...chain, name]));
  }
  ast.walkDecls(decl => {
    const { prop, value } = decl;
    if (/^(animation|transition)(?:-(?:duration|delay|timing-function))?$/.test(prop)) {
      if (/(?:\d|\.)\s*(?:ms|s)\b|cubic-bezier\(|\b(?:ease-in-out|ease-out|ease-in|linear|steps)\b/.test(value.replace(/var\([^)]*\)/g, ''))) fail(file, `literal timing: ${prop}: ${value}`);
      for (const match of value.matchAll(/var\((--[\w-]+)/g)) {
        // --sw-i is the unitless row index, bounded to 0..5 by the search renderer.
        if (match[1] === '--sw-i' && /var\(--sw-local-duration-/.test(value)) continue;
        if (!linked(match[1])) fail(file, `unresolved timing alias ${match[1]}`);
      }
      if (/--sw-var|var\([^)]*var\(/.test(value)) fail(file, `invalid timing token ${value}`);
    }
    if (prop === 'transition' || prop === 'transition-property') {
      const plain = value.replace(/(?:var|calc|cubic-bezier)\([^;]*?\)/g, '').replace(/!important/g, '');
      for (const item of plain.split(',')) {
        const property = item.trim().split(/\s+/)[0];
        if (property && property !== 'none' && !allowed.has(property)) fail(file, `non-compositor transition ${property}`);
      }
    }
    if (prop === 'will-change' && value !== 'auto') fail(file, 'persistent will-change (use transient JS ownership)');
    let parent = decl.parent;
    while (parent && !(parent.type === 'atrule' && /keyframes$/.test(parent.name))) parent = parent.parent;
    if (parent && !allowed.has(prop)) fail(file, `non-compositor keyframe ${prop} in ${parent.params}`);
  });
  ast.walkAtRules(/keyframes$/, () => frames++);
}
for (const family of families) {
  const dir = join(root, 'motion', family.name), paths = files(dir), css = paths.filter(path => path.endsWith('.css'));
  if (!css.length || !css.some(path => /prefers-reduced-motion:\s*reduce/.test(read(path)))) fail(dir, 'missing reduced-motion end-state block');
  for (const file of paths) {
    if (/\.(?:css|html|js|ts|tsx|md)$/.test(file)) sources++;
    if (file.endsWith('.css')) cssCheck(file, read(file));
    if (file.endsWith('.html')) {
      const text = read(file);
      for (const script of text.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)) {
        try { new vm.Script(script[1], { filename: file }); javascript++; } catch (error) { fail(file, error.message); }
      }
      for (const block of text.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)) cssCheck(file, block[1]);
      const markup = text.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '');
      for (const attribute of markup.matchAll(/\bstyle="([^"]*)"/g)) cssCheck(file, `.inline { ${attribute[1]} }`);
      if (/<a\b(?![^>]*\bhref=)[^>]*>/.test(text)) fail(file, 'anchor without href');
      if (/<(?:div|span)\b[^>]*\bonclick=/i.test(text)) fail(file, 'non-native click target');
      if (/role="progressbar"/.test(text) && !/role="progressbar"[^>]*(?:aria-label|aria-labelledby)=/.test(text)) fail(file, 'unnamed progress');
    }
    if (/\.(js|ts|tsx)$/.test(file)) {
      const code = read(file).replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
      try {
        if (file.endsWith('.js')) { new vm.Script(read(file), { filename: file }); javascript++; }
        else if (!file.endsWith('.d.ts')) { esbuild.transformSync(read(file), { loader: file.endsWith('.tsx') ? 'tsx' : 'ts', sourcefile: file }); typescript++; }
      } catch (error) { fail(file, error.message); }
      if (/\bduration\s*:\s*\d|\beasing\s*:\s*['"](?:ease|linear|cubic)/.test(code)) fail(file, 'literal Web Animations timing');
      if (/(?:animation|transition)(?:Delay)?\s*:\s*['"`][^'"`]*\dms|transition-\[width\]|\bduration-\d/.test(code)) fail(file, 'literal inline timing or width transition');
      if (/MOTION_MS\s*=\s*\{\s*fast:\s*\d/.test(code)) fail(file, 'numeric JS motion token mirror');
    }
  }
}
// Historical Markdown content is retained exactly, with additive correction notes.
const inventory = JSON.parse(read(join(root, 'motion/flow-content-inventory.json')));
for (const [path, before] of Object.entries(inventory)) {
  const after = read(join(root, path));
  let position = 0;
  for (const line of before.split(/\r?\n/)) {
    const next = after.indexOf(line, position);
    if (next < 0) { fail(path, `lost historical content: ${line.slice(0, 70)}`); break; }
    position = next + line.length;
  }
}
console.log(`Motion flow: ${families.length} families, ${sources} sources, ${styles} style blocks, ${frames} keyframes, ${javascript} JS blocks, ${typescript} TS/TSX files; ${errors.length} failures.`);
if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
else if (process.argv.includes('--browser') || process.argv.includes('--require-browser')) {
  const { checkBrowser } = await import('../motion/check-browser.mjs');
  const result = await checkBrowser(root);
  console.log(result.message);
  if (result.failed || (!result.ran && process.argv.includes('--require-browser'))) process.exitCode = 1;
}
