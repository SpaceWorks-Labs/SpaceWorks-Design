// Theme reveal template -> site. The repo's own copy is used, never a hand-copied one:
//   motion/theme-reveal/        -> public/kit/motion/theme-reveal/   (theme-reveal.js is loaded by ThemeProvider)
//   theme-reveal.css            -> src/styles/generated/theme-reveal.css (listed in astro.config.mjs customCss)
//   README.md                   -> src/content/docs/motion/theme-reveal.mdx (live demo + usage)
import { cpSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

export function syncThemeReveal({ root, kit, generated, docsDir, repo, prepare, splitTitle }) {
  const reveal = join(root, 'motion', 'theme-reveal');
  cpSync(reveal, join(kit, 'motion', 'theme-reveal'), { recursive: true });
  cpSync(join(reveal, 'theme-reveal.css'), join(generated, 'theme-reveal.css'));

  const raw = readFileSync(join(reveal, 'README.md'), 'utf8').replace(/^﻿/, '');
  const { body } = splitTitle(raw, 'Theme switch');
  const rest = body;
  const blob = `${repo}/blob/main/motion/theme-reveal`;
  writeFileSync(
    join(docsDir, 'motion', 'theme-reveal.mdx'),
    `---
title: Theme switch
description: "The Space Works light/dark switch animation: the new theme grows from the toggle as a circle, with a live demo and copy-paste code."
sidebar: { order: 3 }
editUrl: ${repo}/edit/main/motion/theme-reveal/README.md
---

import ThemeRevealDemo from '../../../components/ThemeRevealDemo.astro';
import MotionPreview from '../../../components/MotionPreview.astro';

When someone presses the theme toggle, the new theme grows from the toggle as a circle and covers the page in 720 ms, so the change reads as chosen, not as a flash. Where the browser cannot do that it cross-fades; under reduced motion it switches instantly. The header toggle of this site uses the same template.

<ThemeRevealDemo />

${prepare(rest, 'motion/theme-reveal')}
## Source

The template is copied from [\`motion/theme-reveal/\`](${repo}/tree/main/motion/theme-reveal) on every build: [\`theme-reveal.css\`](${blob}/theme-reveal.css), [\`theme-reveal.js\`](${blob}/theme-reveal.js) and a standalone [\`demo.html\`](${blob}/demo.html).
`,
  );
}
