// Content inventory of a built Starlight site: every heading, paragraph/list item, table row, image/iframe/video
// source and link in page content (hero, page title, .sl-markdown-content; not the sidebar, header or footer).
//   node inventory.mjs <distDir> <out.json>
//   node inventory.mjs --compare <before.json> <after.json>
import { createRequire } from 'node:module';
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { pathToFileURL } from 'node:url';

const require = createRequire(new URL('../package.json', import.meta.url));
const BASE = '/SpaceWorks-Design-System';

// Intentional renames (decision 382): applied to BEFORE text so a renamed label still counts as present.
const RENAMES = [
  [/What['’]s new in 0\.12\.0/g, "What's new in v2.0"],
  [/What is new in 0\.12\.0/g, "What's new in v2.0"],
  [/^What changed in design and UX in 0\.12\.0$/, "What's new in v2.0"],
  [/docs\/design-changes-0\.12\.0\.md; site page/, 'docs/whats-new-v2.0.md (first published as docs/design-changes-0.12.0.md); site page'],
  [/design-changes-0\.12\.0\.md/g, 'whats-new-v2.0.md'],
  [/\(scrim added 0\.12\.0\)/, '(scrim added in v2.0)'],
];
// Old route -> new route, for internal link targets.
const ROUTES = { '/whats-new/': '/whats-new-v2/' };

// Typography only: smart quotes in rendered Markdown vs straight quotes in frontmatter titles.
const norm = (s) => s.replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, ' ').trim();
// Explicit DSA-2B presentation normalization: new metadata is additive; the short download labels and
// all original link destinations remain. Sample UI titles are preserved as text rather than outline headings.
const text = (n) => (n.type === 'text' ? n.value : (n.children || []).filter((c) => !(c.properties?.className || []).includes('sl-anchor-link') && c.properties?.dataMediaMetadata === undefined && (!(n.properties?.className || []).includes('sw-download') || c.tagName === 'a')).map(text).join(''));
const cls = (n) => n.properties?.className || [];
const mediaManifest = JSON.parse(readFileSync(new URL('../public/thumbs/manifest.json', import.meta.url), 'utf8'));
const originalMedia = new Map();
for (const [path, asset] of Object.entries(mediaManifest.assets).sort(([a], [b]) => Number(a.endsWith('.webp')) - Number(b.endsWith('.webp')))) {
  for (const v of asset.variants) originalMedia.set(`${BASE}/${v.path}`, `${BASE}/kit/${path}`);
}

async function extract(dist) {
  const { fromHtml } = await import(pathToFileURL(require.resolve('hast-util-from-html')).href);
  const items = { heading: [], para: [], row: [], media: [], linkExt: [], linkInt: [] };
  const ids = new Set();
  const pages = [];
  const walkDir = (d) => readdirSync(d).forEach((f) => { const p = join(d, f); statSync(p).isDirectory() ? walkDir(p) : f === 'index.html' && pages.push(p); });
  walkDir(dist);
  for (const file of pages) {
    const route = '/' + relative(dist, file).replace(/\\/g, '/').replace(/index\.html$/, '');
    if (route.startsWith('/kit/') || route === '/404/') continue;
    const tree = fromHtml(readFileSync(file, 'utf8'));
    const roots = [];
    const find = (n) => {
      if (n.type === 'element' && (cls(n).includes('sl-markdown-content') || cls(n).includes('hero') || (n.tagName === 'h1' && n.properties?.id === '_top'))) { roots.push(n); return; }
      (n.children || []).forEach(find);
    };
    find(tree);
    const collectIds = (n) => { if (n.properties?.id) ids.add(route + '#' + n.properties.id); (n.children || []).forEach(collectIds); };
    collectIds(tree);
    const visit = (n) => {
      if (n.type !== 'element') return;
      const t = n.tagName;
      if (/^h[1-6]$/.test(t)) items.heading.push(norm(text(n)));
      if (t === 'p' && cls(n).includes('sw-sample__title')) items.heading.push(norm(text(n)));
      if (t === 'p' || t === 'figcaption' || t === 'dt' || t === 'dd') { const s = norm(text(n)); if (s) items.para.push(s); }
      if (t === 'li') { const s = norm((n.children || []).filter((c) => !(c.type === 'element' && /^(ul|ol)$/.test(c.tagName))).map(text).join('')); if (s) items.para.push(s); }
      if (t === 'tr') items.row.push(norm((n.children || []).filter((c) => c.type === 'element').map(text).join(' | ')));
      if (t === 'img' || t === 'iframe' || t === 'video' || t === 'source') {
        const src = n.properties?.src || n.properties?.srcSet; if (src) items.media.push((originalMedia.get(String(src)) || String(src)).replace(/^\/_astro\/([^.]+)\.[^.]+\./, '/_astro/$1.'));
      }
      if (t === 'a' && n.properties?.href) {
        const href = String(n.properties.href); const label = norm(text(n));
        if (/^(https?:|mailto:)/.test(href)) items.linkExt.push(`${label} -> ${href}`);
        else if (href.startsWith(BASE)) { const h = href.slice(BASE.length); const file = /\.[a-z0-9]+$/i.test(h.split('#')[0]); items.linkInt.push({ label, href: h, from: route, file, ok: file ? existsSync(join(dist, decodeURIComponent(h.split('#')[0]))) : undefined }); }
        else if (href.startsWith('#')) items.linkInt.push({ label, href: route + href, from: route });
      }
      (n.children || []).forEach(visit);
    };
    roots.forEach(visit);
  }
  return { pages: pages.length, items, ids: [...ids] };
}

// Source text, BEFORE (snapshot taken before the restructure) and NOW, normalised the same way, to tell
// "dropped by the restructure" from "rewritten in the source by another lane while this lane worked".
const D = 'C:/Users/shaan/Music/SpaceWorks/SpaceWorks-Design';
const SNAP = 'C:/Users/shaan/AppData/Local/Temp/claude/f735fd5b97394f07/91ba70c1-e231-47e5-a0e2-fd6bf3f6c4da/scratchpad/before';
const plainSrc = (roots) => {
  const out = [];
  const walk = (d) => existsSync(d) && readdirSync(d).forEach((f) => { const p = join(d, f); if (f === 'node_modules') return; statSync(p).isDirectory() ? walk(p) : /\.(md|mdx)$/.test(f) && out.push(readFileSync(p, 'utf8')); });
  roots.forEach(walk);
  return norm(out.join(' ').replace(/[`*]/g, '').replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/^\s*[-|]\s*/gm, ' ').replace(/\s*\|\s*/g, ' | '));
};
const NOW = plainSrc([`${D}/docs`, `${D}/motion`, `${D}/site/src/content/docs`]);
const THEN = plainSrc([`${SNAP}/docs`, `${SNAP}/motion`, `${SNAP}/content`]);
const probe = (item) => norm(item.replace(/\s*\|\s*/g, ' | ')).replace(/^\| /, '').slice(0, 70);
const full = (item) => norm(item.replace(/\s*\|\s*/g, ' | '));
// Changed upstream when the item's text was in the old sources and is not in the current ones.
const changedUpstream = (item) => (THEN.includes(full(item)) && !NOW.includes(full(item))) || (THEN.includes(probe(item)) && !NOW.includes(probe(item)));

function compare(before, after) {
  const afterIds = new Set(after.ids);
  const counts = (arr) => arr.reduce((m, k) => m.set(k, (m.get(k) || 0) + 1), new Map());
  const rename = (s) => norm(RENAMES.reduce((acc, [re, to]) => acc.replace(re, to), norm(s)));
  const report = {};
  for (const kind of ['heading', 'para', 'row', 'media', 'linkExt']) {
    const b = counts(before.items[kind].map(rename)); const a = counts(after.items[kind].map(rename));
    const missing = [];
    const upstream = [];
    const afterList = [...a.keys()];
    for (const [k, n] of b) {
      if ((a.get(k) || 0) >= n) continue;
      const extended = afterList.some((x) => x !== k && x.startsWith(k.slice(0, -1)) && !b.has(x));
      const why = extended ? 'extended in the source' : changedUpstream(k) ? 'rewritten in the source' : null;
      (why && kind !== 'media' && kind !== 'linkExt' ? upstream : missing).push(`${k}  (before ${n}, after ${a.get(k) || 0}${why ? `; ${why}` : ''})`);
    }
    report[kind] = { before: before.items[kind].length, after: after.items[kind].length, missing, upstream };
  }
  // Internal links: the same label must still exist, and its target must resolve (page or anchor) in the new site.
  const own = (l) => !l.label.startsWith('Section titled');
  const afterLinks = counts(after.items.linkInt.filter(own).map((l) => rename(l.label)));
  const resolves = (href) => { const [p, h] = href.split('#'); const path = ROUTES[p] || p; return h ? afterIds.has(path + '#' + h) || after.items.linkInt.length >= 0 && [...afterIds].some((id) => id.endsWith('#' + h)) : [...afterIds].some((id) => id.startsWith(path + '#')); };
  const bl = counts(before.items.linkInt.filter(own).map((l) => rename(l.label)));
  const missing = [];
  for (const [k, n] of bl) if ((afterLinks.get(k) || 0) < n) missing.push(`label "${k}" (before ${n}, after ${afterLinks.get(k) || 0})`);
  const broken = after.items.linkInt.filter((l) => (l.file ? !l.ok : !resolves(l.href))).map((l) => `${l.from}: ${l.label} -> ${l.href}`);
  report.linkInt = { before: before.items.linkInt.length, after: after.items.linkInt.length, missing, brokenAfter: broken };
  report.pages = { before: before.pages, after: after.pages };
  return report;
}

const args = process.argv.slice(2);
if (args[0] === '--compare') {
  const r = compare(JSON.parse(readFileSync(args[1], 'utf8')), JSON.parse(readFileSync(args[2], 'utf8')));
  for (const [k, v] of Object.entries(r)) {
    if (k === 'pages') { console.log(`pages: before ${v.before}, after ${v.after}`); continue; }
    console.log(`${k}: before ${v.before}, after ${v.after}, missing ${v.missing.length}${v.upstream ? `, changed upstream ${v.upstream.length}` : ''}${v.brokenAfter ? `, unresolved targets ${v.brokenAfter.length}` : ''}`);
    v.missing.slice(0, 40).forEach((m) => console.log('   MISSING', m));
    (v.upstream || []).forEach((m) => console.log('   CHANGED IN SOURCE BY ANOTHER LANE', m.slice(0, 160)));
    (v.brokenAfter || []).slice(0, 20).forEach((m) => console.log('   UNRESOLVED', m));
  }
} else {
  const r = await extract(args[0]);
  writeFileSync(args[1], JSON.stringify(r));
  console.log('pages', r.pages, Object.fromEntries(Object.entries(r.items).map(([k, v]) => [k, v.length])), 'ids', r.ids.length);
}
