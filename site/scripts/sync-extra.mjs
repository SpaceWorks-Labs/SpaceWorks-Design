// Second half of the build-time sync: design tokens as CSS for the site theme, the box-open loader, and the
// pages that are rendered from repository docs (motion catalogue, box-open README, theming, lessons learned).
// Everything written here is generated and git-ignored. Edit the sources at the repository root.
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { syncThemeReveal } from './sync-theme-reveal.mjs';

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
    "docs/motion.md": "/motion/principles/",
    "docs/theming.md": "/theming/",
    "docs/lessons-learned.md": "/lessons-learned/",
    "docs/design-changes-0.12.0.md": "/whats-new/",
    "docs/product-rules.md": "/rules/",
    "docs/ui-brand-spec.md": "/specs/ui-brand-spec/",
    "docs/ux-spec.md": "/specs/ux-patterns/",
    "docs/ux-screens-longtail.md": "/specs/ux-long-tail-screens/",
    "motion/box-open/README.md": "/motion/box-open/",
    "motion/theme-reveal/README.md": "/motion/theme-reveal/",
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
        return line
          .split(/(`[^`]*`)/)
          .map((seg, i) => {
            if (i % 2) return seg;
            seg = seg.replace(/<(https?:\/\/[^>\s]+)>/g, '[$1]($1)').replace(/\{/g, '&#123;').replace(/\}/g, '&#125;');
            seg = seg.replace(/<(?![A-Za-z\/!])/g, '&lt;');
            return seg.replace(/\]\(([^)\s]+)\)/g, (all, href) => {
              if (/^(https?:|mailto:|#|\/)/.test(href)) return all;
              const [path, hash = ''] = href.split('#');
              const resolved = join(baseDir, path).replace(/\\/g, '/');
              if (pageRoutes[resolved]) return `](${pageRoutes[resolved]}${hash ? "#" + hash : ""})`;
              return `](${repo}/blob/main/${resolved}${hash ? '#' + hash : ''})`;
            });
          })
          .join('');
      })
      .join('\n');
  };
  const readDoc = (rel) => (existsSync(join(root, rel)) ? readFileSync(join(root, rel), 'utf8').replace(/^﻿/, '') : null);
  const splitTitle = (source, fallback) => {
    const m = source.match(/^#\s+(.+)\r?\n/);
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

  docPage({
    file: 'docs/motion.md',
    out: 'motion/principles.md',
    fallbackTitle: 'Motion principles and catalogue',
    frontmatter: 'sidebar: { order: 1, label: "Principles and catalogue" }',
  });
  docPage({
    file: 'docs/theming.md',
    out: 'theming.mdx',
    fallbackTitle: 'Theming',
    frontmatter: 'description: How to switch Space Works between light, dark and system themes with the real tokens, with a live demo.',
    intro:
      "import ThemeDemo from '../../components/ThemeDemo.astro';\n\nPick a theme and the sample UI re-themes with the real tokens. It is scoped to the demo, so the page around it keeps your own theme.\n\n<ThemeDemo />\n\n",
  });
  docPage({
    file: 'docs/design-changes-0.12.0.md',
    out: 'whats-new.mdx',
    fallbackTitle: 'What changed in design and UX in 0.12.0',
    frontmatter: 'description: The dark-mode shift, the logo animation, every animation and the UX improvements in SpaceWorks 0.12.0.\nsidebar: { label: "What is new in 0.12.0" }',
    intro:
      "import DarkShift from '../../components/DarkShift.astro';\n\n## Dark mode, before and after\n\nEvery swatch below is generated from the token files, so it cannot drift.\n\n<DarkShift />\n\n",
  });
  docPage({
    file: 'docs/product-rules.md',
    out: 'rules.md',
    fallbackTitle: 'Space Works product rules',
    title: 'Space Works product rules',
    frontmatter: 'description: The rules every Space Works product follows, from modularity and tenancy to money, accessibility and testing.',
  });
  docPage({
    file: 'docs/lessons-learned.md',
    out: 'lessons-learned.md',
    fallbackTitle: 'Lessons learned',
    frontmatter: 'description: Colour matching in light and dark, and the other design lessons behind the Space Works palette.',
  });

  // Box-open loader: live demos, then the README's usage, sizes, timing and accessibility.
  {
    const raw = readFileSync(join(box, 'README.md'), 'utf8').replace(/^﻿/, '');
    const { body } = splitTitle(raw, 'Box-open loader');
    const rest = body.replace(/^[\s\S]*?(?=^## Usage)/m, '').replace(/^## Source of truth[\s\S]*$/m, '');
    writeFileSync(
      join(docsDir, 'motion', 'box-open.mdx'),
      `---\ntitle: Box-open loader\ndescription: "The Space Works loading animation, where the logo box opens flap by flap, in both themes and every size."\nsidebar: { order: 2 }\neditUrl: ${repo}/edit/main/motion/box-open/README.md\n---\n\nimport BoxOpenDemos from '../../../components/BoxOpenDemos.astro';\n\nThe box from the logo opens flap by flap, holds open, folds shut and repeats. It is drawn from the logo's own paths, so it is on-brand in both themes. Use it everywhere something loads; never a generic spinner.\n\n<BoxOpenDemos />\n\n${prepare(rest, 'motion/box-open')}\n## Source\n\nThe loader files are copied from [\`motion/box-open/\`](${repo}/tree/main/motion/box-open) on every build: [\`box-open.css\`](${repo}/blob/main/motion/box-open/box-open.css), [\`box-open-markup.html\`](${repo}/blob/main/motion/box-open/box-open-markup.html) and a standalone [\`demo.html\`](${repo}/blob/main/motion/box-open/demo.html).\n`,
    );
  }

  syncThemeReveal({ root, kit, generated, docsDir, repo, prepare, splitTitle });
}
