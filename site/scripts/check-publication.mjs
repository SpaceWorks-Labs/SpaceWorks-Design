// Source-to-rendered inventory, including full new pages and explicit moved-section accounting.
// Run after npm run build: node site/scripts/check-publication.mjs
import { base } from './site-base.mjs';
import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join, posix } from 'node:path';
import { fileURLToPath } from 'node:url';
import { markdownToMdast } from 'satteri';
import { fromHtml } from 'hast-util-from-html';
import GithubSlugger from 'github-slugger';
import { PUBLICATIONS } from './publication-map.mjs';
import { SPLITS, presentParts } from './split-docs.mjs';
import { KIT_FAMILIES } from './sync-motion-kit.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const dist = join(root, 'site/dist');
const repo = 'https://github.com/SpaceWorks-Labs/SpaceWorks-Design-System';
const moved = JSON.parse(readFileSync(join(dist, 'kit/moved-anchors.json'), 'utf8'));
const sources = [
  ...PUBLICATIONS.map(p => ({ ...p, routes: [p.route] })),
  ...SPLITS.map(p => ({ file: p.file, route: p.route, routes: [p.route, ...presentParts(p, root).map(part => p.route + '/' + part.slug)] })),
  ...[['box-open', 'Box-open loader'], ['theme-reveal', 'Theme switch'], ...KIT_FAMILIES].map(([slug]) => ({ file: `motion/${slug}/README.md`, route: `motion/${slug}`, routes: [`motion/${slug}`] })),
  { file: 'motion/README.md', route: 'motion/kit', routes: ['motion/kit'] },
  { file: 'docs/theming.md', route: 'theming', routes: ['theming'] },
  { file: 'docs/whats-new-v2.0.md', route: 'whats-new-v2', routes: ['whats-new-v2'] },
];
const routeMap = Object.fromEntries(sources.map(s => [s.file, `/${s.route}/`]));
routeMap['docs/design-changes-0.12.0.md'] = '/whats-new-v2/';
const norm = s => s.replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/[–—]|--+/g, '-').replace(/…/g, '...').replace(/\s+/g, ' ').trim();
function plain(n) {
  if (n.value !== undefined && !['html', 'yaml'].includes(n.type)) return n.value;
  const value = (n.children || []).map(plain).join('');
  return value + (n.properties?.className?.includes('ec-line') && !value.endsWith('\n') ? '\n' : '');
}
const walk = (n, visit) => { visit(n); (n.children || []).forEach(c => walk(c, visit)); };
const missing = [], records = [];
const totals = { heading: 0, anchor: 0, paragraph: 0, tableCell: 0, code: 0, image: 0, link: 0 };
function destination(url, source) {
  if (/^(https?:|mailto:|\/)/.test(url)) return url.startsWith('/') ? base + url : url;
  const [path, hash] = url.split('#');
  const resolved = path ? posix.normalize(posix.join(posix.dirname(source.file), path)) : source.file;
  if (routeMap[resolved]) {
    const href = routeMap[resolved] + (hash ? '#' + hash : '');
    return base + (moved[href] || href);
  }
  if (resolved.startsWith('examples/web/') && /\.(html|css|mjs)$/.test(resolved) && !resolved.startsWith('examples/web/react/')) return base + '/' + resolved + (hash ? '#' + hash : '');
  const asset = resolved === 'scripts/tokens/schema.json' ? 'tokens/schema.json'
    : /^docs\/(components|adoption)\/.*\.json$/.test(resolved) ? resolved.replace('docs/', '')
    : /^(tokens|fonts|logo|icons|mascot|examples|motion)\//.test(resolved) && existsSync(join(root, resolved)) ? resolved : null;
  return (asset && !source.file.startsWith('motion/') ? base + '/kit/' + asset : repo + '/blob/main/' + resolved) + (hash ? '#' + hash : '');
}
for (const source of sources) {
  const raw = readFileSync(join(root, source.file), 'utf8').replace(/^\uFEFF/, '');
  const body = raw.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '');
  const ast = markdownToMdast(body);
  const pages = source.routes.map(route => {
    const file = join(dist, route, 'index.html');
    if (!existsSync(file)) throw new Error(`Unpublished source: ${source.file} -> ${route}`);
    return { route, ast: fromHtml(readFileSync(file, 'utf8')), texts: [], codes: new Set(), hrefs: new Set(), ids: new Set() };
  });
  const texts = [], hrefs = new Set(), media = new Set(), codes = [];
  for (const page of pages) {
    const content = [];
    walk(page.ast, n => { if (n.properties?.className?.includes('sl-markdown-content') || n.properties?.id === '_top') content.push(n); });
    for (const body of content) walk(body, n => {
    if (n.type !== 'element') return;
    if (n.properties?.id) page.ids.add(n.properties.id);
    if (n.properties?.href) {
      const url = new URL(n.properties.href, `https://publication.invalid${base}/${page.route}/`);
      const target = /^(https?:|mailto:)/.test(n.properties.href) ? n.properties.href : url.pathname + url.hash;
      hrefs.add(target); page.hrefs.add(target);
    }
    if (n.properties?.src) media.add(n.properties.src);
    if (n.properties?.dataAnimation) media.add(n.properties.dataAnimation);
    if (n.tagName === 'code') { const code = plain(n).replace(/\r\n/g, '\n').trimEnd(); codes.push(code); page.codes.add(code); }
    if (/^(h[1-6]|p|li|td|th)$/.test(n.tagName) || n.properties?.className?.includes('title')) { const text = norm(plain(n)); texts.push(text); page.texts.push(text); }
  });
  }
  const visible = texts.join(' ');
  const textSet = new Set(texts);
  const inventory = [];
  const slugger = new GithubSlugger();
  walk(ast, n => {
    if (n.type === 'html') for (const match of n.value.matchAll(/\bid=["']([^"']+)["']/g)) {
      totals.anchor++;
      const location = pages.find(p => p.ids.has(match[1]))?.route;
      const item = { type: 'anchor', line: n.position?.start.line, expected: match[1], canonicalPage: location, status: location ? 'accounted' : 'missing' };
      inventory.push(item); if (!location) missing.push({ source: source.file, ...item });
    }
    if (!Object.hasOwn(totals, n.type)) return;
    totals[n.type]++;
    const value = norm(plain(n));
    let expected = value, ok;
    if (n.type === 'heading' && n.depth === 1) {
      // Duplicate source H1 is represented by the page title; legacy display-title aliases are explicit.
      ok = Boolean(pages[0].texts[0]); expected = { sourceTitle: value, promotedToPageTitle: source.route, renderedTitle: pages[0].texts[0] };
    } else if (n.type === 'code') {
      expected = n.value;
      const code = n.value.replace(/\r\n/g, '\n').trimEnd();
      const title = code.match(/^\/\/ ([\w.-]+)\n/);
      ok = codes.includes(code) || Boolean(title && textSet.has(title[1]) && codes.includes(code.slice(title[0].length)));
      if (title && ok) expected = { code, filenameCommentPromotedToFrameTitle: title[1] };
    }
    else if (n.type === 'link') {
      expected = destination(n.url, source);
      // Local-server instructions are displayed as code, never a production navigation target.
      ok = n.url.startsWith('http://localhost:') ? visible.includes(value) : hrefs.has(expected);
    } else if (n.type === 'image') {
      const path = posix.normalize(posix.join(posix.dirname(source.file), n.url));
      expected = base + '/kit/' + path;
      ok = media.has(expected) || media.has(destination(n.url, source));
    } else ok = !value || textSet.has(value) || visible.includes(value);
    if (n.type === 'heading' && n.depth > 1) {
      const id = slugger.slug(plain(n));
      const original = `/${source.route}/#${id}`, target = moved[original] || original;
      const [route, hash] = target.split('#');
      const page = pages.find(p => `/${p.route}/` === route);
      if (!page || (hash && !page.ids.has(hash))) { ok = false; expected = { heading: value, oldAnchor: original, target }; }
    }
    const location = n.type === 'heading' && n.depth === 1 ? source.route
      : n.type === 'link' ? n.url.startsWith('http://localhost:') ? source.route : pages.find(p => p.hrefs.has(expected))?.route
      : n.type === 'code' ? pages.find(p => p.codes.has(n.value.replace(/\r\n/g, '\n').trimEnd()) || (typeof expected === 'object' && p.texts.includes(expected.filenameCommentPromotedToFrameTitle)))?.route
      : n.type === 'image' ? source.route
      : pages.find(p => p.texts.includes(value) || p.texts.join(' ').includes(value))?.route;
    const item = { type: n.type, line: n.position?.start.line, expected, canonicalPage: location, status: ok ? 'accounted' : 'missing' };
    inventory.push(item);
    if (!ok) missing.push({ source: source.file, ...item, ...(n.type === 'code' ? { actual: codes.find(c => c.startsWith(n.value.slice(0, 24))) } : {}) });
  });
  records.push({ source: source.file, sha256: createHash('sha256').update(raw).digest('hex'), canonicalPages: source.routes, inventory });
}
const report = {
  sources: sources.length, newPages: PUBLICATIONS.length, totals, missing,
  transformations: [
    'Source frontmatter becomes page metadata; duplicate H1 becomes the page title (legacy box-open/theme-reveal display aliases retained).',
    'Complete new-source and motion README bodies are published, with additive live-example slots.',
    'Long source sections stay contiguous on canonical split pages; headings promoted to titles and all old hashes are accounted in movedAnchors.',
    'Relative source links resolve to canonical documentation or the copied asset tree; original motion download URLs remain.',
    'Animated image identity is data-animation; src/srcset are derivative posters. The original is downloadable.',
    'Localhost instructions retain their exact address as code rather than a production link.',
    'Expressive Code may promote a filename comment to its visible frame title; both that title and the exact remaining code are checked.',
  ],
  movedAnchors: moved, records,
};
mkdirSync(join(root, 'site/verification'), { recursive: true });
writeFileSync(join(root, 'site/verification/publication-inventory.json'), JSON.stringify(report, null, 2) + '\n');
console.log(`Publication inventory: ${sources.length} sources, ${PUBLICATIONS.length} new pages; ${JSON.stringify(totals)}; ${missing.length} missing.`);
missing.slice(0, 35).forEach(m => console.error(JSON.stringify(m)));
if (missing.length) process.exitCode = 1;
