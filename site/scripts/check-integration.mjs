// Built-artifact checks supplement the Markdown link validator with component and demo URLs.
// Run: node site/scripts/check-integration.mjs
import { base } from './site-base.mjs';
import { existsSync, readdirSync, readFileSync, statSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { fromHtml } from 'hast-util-from-html';
import sharp from 'sharp';
import { PUBLICATIONS } from './publication-map.mjs';
const root = fileURLToPath(new URL('../../', import.meta.url));
const dist = join(root, 'site/dist');
const walk = dir => readdirSync(dir).flatMap(f => statSync(join(dir, f)).isDirectory() ? walk(join(dir, f)) : [join(dir, f)]);
const htmlFiles = walk(dist).filter(f => f.endsWith('.html') && !relative(dist, f).replaceAll('\\', '/').startsWith('kit/examples/'));
const report = { htmlPages: htmlFiles.length, checkedLinks: 0, checkedAssets: 0, animatedPosters: 0, thumbnails: 0, newPages: PUBLICATIONS.length, failures: [] };
const parsed = new Map();
const visit = (n, fn) => { fn(n); (n.children || []).forEach(c => visit(c, fn)); };
function parse(file) {
  if (parsed.has(file)) return parsed.get(file);
  const ast = fromHtml(readFileSync(file, 'utf8')), ids = new Set();
  visit(ast, n => { if (n.properties?.id) ids.add(n.properties.id); });
  const value = { ast, ids }; parsed.set(file, value); return value;
}
function checkUrl(value, source, type) {
  if (!value || /^(data:|mailto:|tel:|javascript:)/.test(value)) return;
  const local = relative(dist, source).replaceAll('\\', '/');
  const url = new URL(value, 'https://publication.invalid' + base + '/' + local);
  if (url.origin !== 'https://publication.invalid') return;
  if (url.pathname !== base && !url.pathname.startsWith(base + '/')) { report.failures.push(`${local}: outside deployment base: ${value}`); return; }
  let target = join(dist, decodeURIComponent(url.pathname.slice(base.length)));
  if (existsSync(target) && statSync(target).isDirectory()) target = join(target, 'index.html');
  if (!existsSync(target)) { report.failures.push(`${local}: missing ${type}: ${value}`); return; }
  if (type === 'link') report.checkedLinks++; else report.checkedAssets++;
  if (url.hash && target.endsWith('.html') && !parse(target).ids.has(decodeURIComponent(url.hash.slice(1)))) {
    // Historical overview hashes are deliberately redirected using the preserved map.
    const moved = JSON.parse(readFileSync(join(dist, 'kit/moved-anchors.json')));
    const key = url.pathname.slice(base.length) + url.hash;
    if (!moved[key]) report.failures.push(`${local}: missing fragment: ${value}`);
  }
}
for (const file of htmlFiles) {
  const local = relative(dist, file).replaceAll('\\', '/');
  const rawDemo = local.startsWith('kit/') || local.startsWith('examples/');
  let noindex = false;
  visit(parse(file).ast, n => {
    if (n.type !== 'element') return;
    if (n.tagName === 'meta' && n.properties.name === 'robots' && n.properties.content === 'noindex,follow') noindex = true;
    if (n.properties?.href) checkUrl(n.properties.href, file, n.tagName === 'a' ? 'link' : 'asset');
    if (n.properties?.src) checkUrl(n.properties.src, file, 'asset');
    if (n.properties?.srcSet) for (const candidate of n.properties.srcSet.split(',')) checkUrl(candidate.trim().split(/\s+/)[0], file, 'asset');
    if (n.tagName === 'img' && n.properties?.dataAnimation) {
      report.animatedPosters++;
      if (n.properties.src === n.properties.dataAnimation || !n.properties.width || !n.properties.height) report.failures.push(`${local}: incomplete poster contract`);
      checkUrl(n.properties.dataAnimation, file, 'asset');
    }
  });
  if (rawDemo !== noindex && /<head(?:\s|>)/i.test(readFileSync(file, 'utf8'))) report.failures.push(`${local}: wrong robots meta policy`);
}
for (const p of PUBLICATIONS) if (!existsSync(join(dist, p.route, 'index.html'))) report.failures.push(`Unpublished ${p.file}`);
const manifest = JSON.parse(readFileSync(join(dist, 'thumbs/manifest.json')));
for (const [source, asset] of Object.entries(manifest.assets)) for (const variant of asset.variants) {
  const file = join(dist, variant.path);
  const meta = await sharp(file).metadata(); report.thumbnails++;
  if ((meta.pages || 1) !== 1 || meta.width !== variant.width) report.failures.push(`Invalid static derivative for ${source}`);
}
const robots = readFileSync(join(dist, 'robots.txt'), 'utf8');
for (const path of ['kit', 'examples', 'thumbs']) if (!robots.includes(`Disallow: ${base}/${path}/`)) report.failures.push(`Missing robots policy for ${path}`);
const version = readFileSync(join(root, 'VERSION'), 'utf8').trim();
for (const path of ['index.html', 'downloads/index.html', 'tokens/using-the-kit/index.html']) {
  const html = readFileSync(join(dist, path), 'utf8');
  if (!html.includes(`/archive/refs/tags/v${version}.zip`)) report.failures.push(`${path}: missing VERSION-derived archive`);
}
mkdirSync(join(root, 'site/verification'), { recursive: true });
writeFileSync(join(root, 'site/verification/integration.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ ...report, failures: report.failures.length }));
report.failures.slice(0, 30).forEach(f => console.error(f));
if (report.failures.length) process.exitCode = 1;
