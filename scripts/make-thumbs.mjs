// Additive media derivatives; originals are read only. Run from any directory: node scripts/make-thumbs.mjs
import { createRequire } from 'node:module';
import { readdirSync, readFileSync, writeFileSync, mkdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(join(root, 'site/package.json'));
const sharp = require('sharp');
const { fromHtml } = await import(pathToFileURL(require.resolve('hast-util-from-html')).href);
const output = join(root, 'site/public/thumbs');
const assets = {}, books = {};
const walk = dir => readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)]);
const text = n => n.type === 'text' ? n.value : (n.children || []).map(text).join(' ');
const plain = n => text(n).replace(/\{\{[^}]+\}\}/g, '').replace(/\s+/g, ' ').trim();
const descendants = (n, test) => [...(test(n) ? [n] : []), ...(n.children || []).flatMap(c => descendants(c, test))];
async function thumb(file, key, widths) {
  const m = await sharp(file).metadata();
  const height = m.pageHeight || m.height;
  // Enter animations often start completely invisible. The held frame shows the reduced-motion end state.
  const posterFrame = key.startsWith('motion/') ? Math.floor(((m.pages || 1) - 1) * 0.75) : 0;
  // GIF and WebP versions can have different first frames; keep their poster paths distinct.
  const stem = key.replace(/\.gif$/, '-gif').replace(/\.(png|webp)$/, '');
  const variants = [];
  for (const width of widths.filter(w => w <= m.width)) {
    const name = `${stem}-${width}.webp`;
    const target = join(output, name);
    mkdirSync(dirname(target), { recursive: true });
    await sharp(file, { page: posterFrame, pages: 1 }).resize({ width, withoutEnlargement: true }).webp({ quality: 78, effort: 5 }).toFile(target);
    variants.push({ path: `thumbs/${name}`, width, bytes: statSync(target).size });
  }
  if (!variants.length) {
    const name = `${stem}-${m.width}.webp`;
    mkdirSync(dirname(join(output, name)), { recursive: true });
    await sharp(file, { page: posterFrame, pages: 1 }).webp({ quality: 78 }).toFile(join(output, name));
    variants.push({ path: `thumbs/${name}`, width: m.width, bytes: statSync(join(output, name)).size });
  }
  assets[key] = { width: m.width, height, bytes: statSync(file).size, animated: (m.pages || 1) > 1, posterFrame, variants };
}
// All gallery raster originals, including the still frame strips. No SVG download is rasterised or replaced.
for (const file of walk(join(root, 'mascot')).filter(f => /\.(png|webp)$/.test(f) && !/[\\/]original[\\/]/.test(f))) {
  await thumb(file, relative(root, file).replaceAll('\\', '/'), [256, 512]);
}
for (const edition of ['guidelines', 'guidelines-v2']) {
  for (const file of walk(join(root, 'brand', edition, 'png')).filter(f => f.endsWith('.png'))) {
    await thumb(file, `brand/${edition}/${relative(join(root, 'brand', edition, 'png'), file).replaceAll('\\', '/')}`, [320, 640]);
  }
}
// Poster coverage includes every existing motion image, without running the reserved preview generator.
for (const file of walk(join(root, 'motion')).filter(f => /[\\/]previews[\\/].*\.(webp|gif)$/.test(f))) {
  const m = await sharp(file).metadata();
  if ((m.pages || 1) > 1) await thumb(file, relative(root, file).replaceAll('\\', '/'), [m.width]);
}
// Read the actual source of each v2 page: title, chapter and complete searchable text equivalent.
let page = 0;
for (const file of walk(join(root, 'brand/guidelines-v2/src/pages')).filter(f => f.endsWith('.html')).sort()) {
  const tree = fromHtml(readFileSync(file, 'utf8'), { fragment: true });
  for (const section of descendants(tree, n => n.tagName === 'section' && n.properties?.className?.includes('pg'))) {
    const headings = descendants(section, n => n.tagName === 'h1');
    const title = headings.length ? plain(headings[0]) : page === 0 ? 'Less searching. More making.' : 'Colophon';
    const paragraphs = descendants(section, n => n.tagName === 'p' && n.properties?.className?.includes('sub'));
    books[`brand/guidelines-v2/${String(++page).padStart(2, '0')}.png`] = {
      title, chapter: section.properties.dataSec, summary: paragraphs.length ? plain(paragraphs[0]) : title,
      transcript: plain(section), source: relative(root, file).replaceAll('\\', '/'),
    };
  }
}
mkdirSync(output, { recursive: true });
writeFileSync(join(output, 'manifest.json'), JSON.stringify({ assets, books }, null, 2) + '\n');
console.log(`Added derivatives for ${Object.keys(assets).length} assets; ${page} book page equivalents. Originals untouched.`);
