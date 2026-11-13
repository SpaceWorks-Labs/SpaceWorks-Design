// Second half of the build-time sync: design tokens as CSS for the site theme, the box-open loader, and the
// pages that are rendered from repository docs (motion catalogue, box-open README, theming, lessons learned).
// Everything written here is generated and git-ignored. Edit the sources at the repository root.
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { syncThemeReveal } from './sync-theme-reveal.mjs';
import { KIT_FAMILIES, syncMotionKit } from './sync-motion-kit.mjs';
import { rewriteMovedAnchors, syncSplits } from './sync-split.mjs';
import { PUBLICATIONS } from './publication-map.mjs';
import { syncPublications, applyIndexingPolicy, appendPublicationLinks } from './sync-publications.mjs';

export function syncExtra({ root, site, kit, assets }) {
  const generated = join(site, 'src', 'styles', 'generated');
  const docsDir = join(site, 'src', 'content', 'docs');
  rmSync(generated, { recursive: true, force: true });
  mkdirSync(generated, { recursive: true });
  mkdirSync(join(docsDir, 'motion'), { recursive: true });
  const repo = 'https://github.com/SpaceWorks-Labs/SpaceWorks-Design-System';

  // tokens.css without its @font-face blocks (the site's fonts.css owns those; the relative urls differ).
  const tokensCss = readFileSync(join(root, 'tokens', 'tokens.css'), 'utf8').replace(/@font-face\s*\{[^}]*\}/g, '');
  writeFileSync(join(generated, 'tokens.css'), tokensCss);

  // The same tokens re-scoped to a container (.sw-scope, .sw-scope.dark) so live demos can show either theme
  // without touching the page theme. Reduced-motion media blocks are dropped: they must not apply unconditionally.
  const flat = tokensCss.replace(/\/\*[\s\S]*?\*\//g, '').replace(/@media[^{]*\{[^{}]*\{[^}]*\}\s*\}/g, '');
  const bodies = (re) => [...flat.matchAll(re)].map((m) => m[1]).join('\n');
  writeFileSync(
    join(generated, 'tokens-scope.css'),
    `.sw-scope{${bodies(/:root\s*\{([^}]*)\}/g)}\ncolor-scheme:light;background:rgb(var(--color-bg));color:rgb(var(--color-ink))}\n` +
      `.sw-scope.dark{${bodies(/:root\.dark\s*\{([^}]*)\}/g)}\ncolor-scheme:dark}\n`,
  );

  // Box-open loader: the repo's own copy. The kit keys dark off `html.dark`; the site uses a plain `.dark`
  // ancestor so the same keyframes work in the page theme and in a scoped demo. Keyframes are not touched.
  const box = join(root, 'motion', 'box-open');
  cpSync(box, join(kit, 'motion', 'box-open'), { recursive: true });
  const boxCss = readFileSync(join(box, 'box-open.css'), 'utf8');
  // A light demo inside a dark page would match `.dark .sw-box` through <html>, so the kit's own light rules (the
  // first `.sw-box{...}` colour rule, the `.w` fill and the lt/dk visibility pair) are repeated for `.sw-scope:not(.dark)`.
  const lightColours = boxCss.match(/\.sw-box\{position:relative;([^}]*)\}/)?.[1] ?? '';
  const lightWall = boxCss.match(/\.sw-box \.w\{([^}]*)\}/)?.[1] ?? '';
  const scopeLight =
    `\n.sw-scope:not(.dark) .sw-box{${lightColours}}\n.sw-scope:not(.dark) .sw-box .w{${lightWall}}\n` +
    `.sw-scope:not(.dark) .sw-box .lt{display:block}\n.sw-scope:not(.dark) .sw-box .dk{display:none}\n`;
  writeFileSync(join(generated, 'box-open.css'), boxCss.replaceAll('html.dark', '.dark') + scopeLight);
  cpSync(join(box, 'box-open-markup.html'), join(assets, 'box-open-markup.html'));

  // Markdown from the repo becomes MDX: braces and bare angle brackets are neutralised, autolinks become links,
  // and relative links point at the file on GitHub (they are not site pages).
  // Repo docs that are also site pages link to the page, not to GitHub.
  const pageRoutes = {
    ...Object.fromEntries(PUBLICATIONS.map(p => [p.file, `/${p.route}/`])),
    "docs/motion.md": "/motion/principles/",
    "docs/theming.md": "/theming/",
    "docs/lessons-learned.md": "/lessons-learned/",
    "docs/design-changes-0.12.0.md": "/whats-new-v2/",
    "docs/whats-new-v2.0.md": "/whats-new-v2/",
    "docs/product-rules.md": "/rules/",
    "docs/delivery.md": "/delivery/",
    "docs/ui-brand-spec.md": "/specs/ui-brand-spec/",
    "docs/ux-spec.md": "/specs/ux-patterns/",
    "docs/ux-screens-longtail.md": "/specs/ux-long-tail-screens/",
    "motion/box-open/README.md": "/motion/box-open/",
    "motion/theme-reveal/README.md": "/motion/theme-reveal/",
    "motion/README.md": "/motion/kit/",
    "docs/decisions.md": "/decisions/",
    ...Object.fromEntries(KIT_FAMILIES.map(([slug]) => [`motion/${slug}/README.md`, `/motion/${slug}/`])),
  };
  const prepare = (source, baseDir) => {
    let fence = false;
    return source
      .split(/\r?\n/)
      .map((line) => {
        if (/^\s*(```|~~~)/.test(line)) {
          fence = !fence;
          return line;
        }
        if (fence) return line;
        if (baseDir.startsWith('motion')) line = line.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (all, alt, path) => {
          const resolved = join(baseDir, path).replaceAll('\\', '/');
          return /\.(webp|gif)$/.test(resolved) ? `<MotionPreview path="${resolved}" alt="${alt.replaceAll('"', '&quot;')}" />` : all;
        });
        return line
          .split(/(`[^`]*`)/)
          .map((seg, i) => {
            if (i % 2) return seg;
            seg = seg.replace(/http:\/\/localhost:\d+[^\s)]+/g, '`$&`');
            seg = seg.replace(/<(https?:\/\/[^>\s]+)>/g, '[$1]($1)').replace(/\{/g, '&#123;').replace(/\}/g, '&#125;');
            seg = seg.replace(/<(?![A-Za-z\/!])/g, '&lt;');
            return seg.replace(/\]\(([^)\s]+)\)/g, (all, href) => {
              if (/^(https?:|mailto:|#|\/)/.test(href)) return all;
              const [path, hash = ''] = href.split('#');
              const resolved = join(baseDir, path).replace(/\\/g, '/');
              if (pageRoutes[resolved]) return `](${pageRoutes[resolved]}${hash ? "#" + hash : ""})`;
              if (resolved.startsWith('examples/web/') && /\.(html|css|mjs)$/.test(resolved) && !resolved.startsWith('examples/web/react/')) return `](/${resolved}${hash ? '#' + hash : ''})`;
              const asset = resolved === 'scripts/tokens/schema.json' ? 'tokens/schema.json'
                : resolved.startsWith('docs/components/') && resolved.endsWith('.json') ? resolved.replace('docs/', '')
                : resolved.startsWith('docs/adoption/') && resolved.endsWith('.json') ? resolved.replace('docs/', '')
                : /^(tokens|fonts|logo|icons|mascot|examples|motion)\//.test(resolved) && existsSync(join(root, resolved)) ? resolved : null;
              if (asset && !baseDir.startsWith('motion')) return `](/kit/${asset}${hash ? '#' + hash : ''})`;
              return `](${repo}/blob/main/${resolved}${hash ? '#' + hash : ''})`;
            });
          })
          .join('');
      })
      .join('\n');
  };
  const readDoc = (rel) => (existsSync(join(root, rel)) ? readFileSync(join(root, rel), 'utf8').replace(/^﻿/, '') : null);
  const splitTitle = (source, fallback) => {
    const m = source.match(/^\s*#\s+(.+)\r?\n/);
    return m ? { title: m[1].trim().replace(/"/g, '\\"'), body: source.slice(m[0].length) } : { title: fallback, body: source };
  };
  const sourceNote = (file) =>
    `:::note[Source]\nThis page is published from [\`${file}\`](${repo}/blob/main/${file}). Edit it there.\n:::\n`;
  const pendingNote = (file) =>
    `:::caution[Not written yet]\nThis page is published from \`${file}\`, which does not exist in the repository yet. It appears automatically on the next build once the file lands.\n:::\n`;

  // A page rendered from a repo doc, with an optional MDX component block in front of the body.
  const docPage = ({ file, out, fallbackTitle, frontmatter, intro = '', mdx = false, title: forcedTitle }) => {
    const raw = readDoc(file);
    const { title, body } = raw ? splitTitle(raw, fallbackTitle) : { title: fallbackTitle, body: '' };
    const note = raw ? sourceNote(file) : pendingNote(file);
    writeFileSync(
      join(docsDir, out),
      `---\ntitle: "${forcedTitle ?? title}"\n${frontmatter}\neditUrl: ${repo}/edit/main/${file}\n---\n\n${intro}${note}\n${prepare(body, 'docs')}`,
    );
    return mdx;
  };

  // Long docs (motion, product rules, delivery, lessons, decisions, the three specs) become an overview plus one page
  // per part: see split-docs.mjs. Their Markdown sources stay single files.
  const moved = syncSplits({ root, docsDir, repo, prepare });
  docPage({
    file: 'docs/theming.md',
    out: 'theming.mdx',
    fallbackTitle: 'Theming',
    frontmatter: 'description: How to switch Space Works between light, dark and system themes with the real tokens, with a live demo.',
    intro:
      "import ThemeDemo from '../../components/ThemeDemo.astro';\n\nPick a theme and the sample UI re-themes with the real tokens. It is scoped to the demo, so the page around it keeps your own theme.\n\n<ThemeDemo />\n\n",
  });
  docPage({
    file: 'docs/whats-new-v2.0.md',
    out: 'whats-new-v2.mdx',
    fallbackTitle: "What's new in v2.0",
    frontmatter: 'description: "Space Works Design System v2.0, which ships alongside SpaceWorks 0.12.0: the dark-mode shift, the logo animation, every animation and the UX improvements."\nsidebar: { label: "What\'s new in v2.0" }',
    intro:
      "import DarkShift from '../../components/DarkShift.astro';\n\n## Dark mode, before and after\n\nEvery swatch below is generated from the token files, so it cannot drift.\n\n<DarkShift />\n\n",
  });

  // Box-open loader: live demos, then the README's usage, sizes, timing and accessibility.
  {
    const raw = readFileSync(join(box, 'README.md'), 'utf8').replace(/^﻿/, '');
    const { body } = splitTitle(raw, 'Box-open loader');
    const rest = body;
    writeFileSync(
      join(docsDir, 'motion', 'box-open.mdx'),
      `---\ntitle: Box-open loader\ndescription: "The Space Works loading animation, where the logo box opens flap by flap, in both themes and every size."\nsidebar: { order: 2 }\neditUrl: ${repo}/edit/main/motion/box-open/README.md\n---\n\nimport BoxOpenDemos from '../../../components/BoxOpenDemos.astro';\nimport MotionPreview from '../../../components/MotionPreview.astro';\n\nThe box from the logo opens flap by flap, holds open, folds shut and repeats. It is drawn from the logo's own paths, so it is on-brand in both themes. Use it everywhere something loads; never a generic spinner.\n\n<BoxOpenDemos />\n\n${prepare(rest, 'motion/box-open')}\n## Source\n\nThe loader files are copied from [\`motion/box-open/\`](${repo}/tree/main/motion/box-open) on every build: [\`box-open.css\`](${repo}/blob/main/motion/box-open/box-open.css), [\`box-open-markup.html\`](${repo}/blob/main/motion/box-open/box-open-markup.html) and a standalone [\`demo.html\`](${repo}/blob/main/motion/box-open/demo.html).\n`,
    );
  }

  syncThemeReveal({ root, kit, generated, docsDir, repo, prepare, splitTitle });
  syncMotionKit({ root, kit, docsDir, repo, prepare, splitTitle });
  syncPublications({ root, site, kit, docsDir, repo, prepare, splitTitle });
  applyIndexingPolicy({ site, pageRoutes });
  rewriteMovedAnchors(docsDir, moved, repo);
  appendPublicationLinks(docsDir);
}
