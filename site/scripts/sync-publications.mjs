import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { PUBLICATIONS } from './publication-map.mjs';

export function syncPublications({ root, site, kit, docsDir, repo, prepare, splitTitle }) {
  for (const p of PUBLICATIONS) {
    const raw = readFileSync(join(root, p.file), 'utf8').replace(/^\uFEFF/, '');
    const fm = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
    const { title, body } = splitTitle(fm ? raw.slice(fm[0].length) : raw, p.route);
    const description = fm?.[1].match(/^description:\s*(.+)$/m)?.[1]?.replace(/^["']|["']$/g, '') || `${title}: Space Works guidance, sources and implementation reference.`;
    const file = join(docsDir, p.route + (p.route === 'components' ? '.mdx' : '.md'));
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, `---\ntitle: ${JSON.stringify(title)}\ndescription: ${JSON.stringify(description)}\neditUrl: ${repo}/edit/main/${p.file}\n---\n\n:::note[Source]\nThis page is published from [\`${p.file}\`](${repo}/blob/main/${p.file}). Edit it there.\n:::\n\n${p.route === 'components' ? "import ComponentFinder from '../../components/ComponentFinder.astro';\n\n<ComponentFinder />\n\n" : ''}${prepare(body, dirname(p.file))}\n`);
  }
  // All source examples stay downloadable. Only the runnable hosted copy adapts asset paths.
  cpSync(join(root, 'examples'), join(kit, 'examples'), { recursive: true, filter: src => !/(?:^|[\\/])(?:node_modules|\.git)(?:[\\/]|$)/.test(src) });
  for (const [from, to] of [['docs/components', 'components'], ['docs/adoption', 'adoption']]) {
    mkdirSync(join(kit, to), { recursive: true });
    for (const f of readdirSync(join(root, from)).filter(f => f.endsWith('.json'))) cpSync(join(root, from, f), join(kit, to, f));
  }
  cpSync(join(root, 'scripts/tokens/schema.json'), join(kit, 'tokens/schema.json'));
  const web = join(site, 'public/examples/web');
  cpSync(join(root, 'examples/web'), web, { recursive: true, filter: src => !/(?:^|[\\/])(?:node_modules|react)(?:[\\/]|$)/.test(src) });
  // Batch 1C's reviewed runnable React build is optional; its complete source remains in kit/examples.
  if (existsSync(join(root, 'examples/web/react/dist/index.html'))) cpSync(join(root, 'examples/web/react/dist'), join(web, 'react/dist'), { recursive: true });
  const walk = dir => readdirSync(dir).flatMap(f => statSync(join(dir, f)).isDirectory() ? walk(join(dir, f)) : [join(dir, f)]);
  for (const file of walk(web).filter(f => /\.(html|css|mjs)$/.test(f))) {
    const text = readFileSync(file, 'utf8');
    writeFileSync(file, text.replace(/\.\.\/\.\.\/(tokens|fonts|logo)\//g, '../../kit/$1/'));
  }
  const manifest = JSON.parse(readFileSync(join(root, 'tokens/exports-manifest.json'), 'utf8'));
  const downloads = Object.keys(manifest.sha256).map(path => `| [\`${path}\`](/kit/${path}) | \`${manifest.sha256[path]}\` |`).join('\n');
  writeFileSync(join(docsDir, 'downloads.mdx'), `---\ntitle: Downloads\ndescription: Versioned design kit, portable and native token exports, source examples and checksums.\nhead:\n  - tag: meta\n    attrs: { name: robots, content: "index,follow" }\n---\n\nimport ReleaseInstall from '../../components/ReleaseInstall.astro';\n\n## Install a reviewed release\n\n<ReleaseInstall />\n\n## Token exports\n\nKeep [legacy RGB tokens](/kit/tokens/tokens.css), [portable full-colour CSS](/kit/tokens/portable.css) and [fonts](/kit/fonts/README.md) in their original relative layout. Native dimensions and type scaling are explained in [Token architecture](/tokens/architecture/). Native sources are uncompiled here.\n\n[Export manifest and SHA-256 checksums](/kit/tokens/exports-manifest.json) · [Contract](/kit/tokens/contract.json) · [Input schema](/kit/tokens/schema.json) · [Usage JSON](/kit/tokens/usage.json) · [Contrast JSON](/kit/tokens/contrast-matrix.json)\n\n| File | SHA-256 (UTF-8/LF) |\n| --- | --- |\n${downloads}\n\n## Starters and artwork\n\n[Choose a platform](/adoption/) · [Web first screen](/examples/web/index.html) · [Component examples](/examples/web/component-gallery.html) · [Android source](/kit/examples/android/README.md) · [iOS source](/kit/examples/ios/README.md) · [Logo masters](/brand/logo/) · [Both brand books](/brand/guidelines/) · [Motion sources and demos](/motion/kit/)\n\n## Development snapshot\n\nThe moving main archive is a development download: [Download the kit](${repo}/archive/refs/heads/main.zip). Use the versioned archive above for adoption.\n\n## Indexing policy\n\nDocumentation, including this downloads index, is indexable. Raw kit downloads, source trees, thumbnail derivatives and standalone runnable HTML use robots exclusions; standalone HTML also emits \`noindex,follow\`. Documentation remains the canonical search entry point.\n`);
  console.log(`sync-publications: ${PUBLICATIONS.length} complete source pages; ${Object.keys(manifest.sha256).length} checksum export links; full web/native source trees`);
}

export function applyIndexingPolicy({ site, pageRoutes }) {
  const pub = join(site, 'public');
  const origin = process.env.DESIGN_SITE_URL || 'https://spaceworks-labs.github.io';
  const base = '/SpaceWorks-Design-System';
  writeFileSync(join(pub, 'robots.txt'), `User-agent: *\nAllow: ${base}/\nDisallow: ${base}/kit/\nDisallow: ${base}/examples/\nDisallow: ${base}/thumbs/\nSitemap: ${origin}${base}/sitemap-index.xml\n`);
  const walk = dir => existsSync(dir) ? readdirSync(dir).flatMap(f => statSync(join(dir, f)).isDirectory() ? walk(join(dir, f)) : [join(dir, f)]) : [];
  for (const file of [...walk(join(pub, 'kit')), ...walk(join(pub, 'examples'))].filter(f => f.endsWith('.html'))) {
    let html = readFileSync(file, 'utf8');
    if (!/<head(?:\s|>)/i.test(html)) continue; // source fragments are downloads, not documents
    html = html.replace(/<meta\s+name=["']robots["'][^>]*>\s*/gi, '');
    const rel = relative(pub, file).replaceAll('\\', '/');
    // Resolve repository-relative guidance links in copied runnable demos.
    html = html.replace(/href="([^"#]+\.md)(#[^"]*)?"/g, (all, path, hash = '') => {
      const resolved = join(dirname(rel.replace(/^kit\//, '')), path).replaceAll('\\', '/');
      return pageRoutes[resolved] ? `href="${base}${pageRoutes[resolved]}${hash}"` : all;
    });
    // Local route/tab demo destinations remain real fragment targets without JavaScript too.
    if (/^kit\/motion\/(route-transition|sidebar)\/demo.html$/.test(rel)) html = html.replace(/<a\s+href="#([\w-]+)"/g, (all, id) => html.includes(`id="${id}"`) ? all : `<a id="${id}" href="#${id}"`);
    const family = rel.match(/^kit\/motion\/([^/]+)\/demo.html$/)?.[1];
    const canonical = family ? `${origin}${base}/motion/${family}/` : `${origin}${base}/adoption/`;
    html = html.replace(/<\/head>/i, `<meta name="robots" content="noindex,follow">\n<link rel="canonical" href="${canonical}">\n</head>`);
    writeFileSync(file, html);
  }
}

export function appendPublicationLinks(docsDir) {
  const links = {
    'specs/ui-brand-spec/tokens.md': '[Required and diagnostic contrast pairs](/tokens/contrast-matrix/) · [Sources, aliases and provenance](/tokens/architecture/)',
    'specs/ui-brand-spec/interaction-states.md': '[Boundary-strong and state-indicator restrictions, with default/hover/active/selected pairings](/tokens/contrast-matrix/) · [Role usage](/tokens/usage/)',
    'specs/ui-brand-spec/shape-and-spacing.md': '[Spacing, radius, size, border, elevation, layer and breakpoint roles](/tokens/usage/) · [Source decisions, including spec 256px versus app 264px sidebar width](/tokens/architecture/)',
    'specs/ui-brand-spec/typography.md': '[Machine-readable type metrics and mobile roles](/tokens/usage/) · [Native units and host-owned scaling](/tokens/architecture/)',
    'theming.mdx': '[Paired modes, the public seven-member tenant family and fixed exclusions](/tokens/architecture/) · [Contrast validation](/tokens/contrast-matrix/)',
    'motion/principles.md': '[Motion flow](/motion/flow/) · [Duration/easing/distance roles, exceptions, reduced motion and kiosk/TV](/tokens/architecture/)',
    'foundations/accessibility.md': '[Required and diagnostic contrast pairs](/tokens/contrast-matrix/) · [Portable exports and checksums](/downloads/)',
  };
  for (const [path, linksText] of Object.entries(links)) {
    const file = join(docsDir, path);
    writeFileSync(file, readFileSync(file, 'utf8') + `\n## Related v2.1 references\n\n${linksText}\n`);
  }
}
