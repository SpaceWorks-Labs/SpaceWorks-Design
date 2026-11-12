// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightLinksValidator from 'starlight-links-validator';
import { satteri } from '@astrojs/markdown-satteri';
import { readFileSync } from 'node:fs';
import { baseLinksPlugin } from './src/plugins/base-links.mjs';
import { splitItems } from './scripts/split-docs.mjs';

// GitHub Pages serves the site at https://spaceworks-labs.github.io/SpaceWorks-Design-System/. Set
// DESIGN_SITE_URL to override the origin used for the sitemap and canonical links.
const site = process.env.DESIGN_SITE_URL || 'https://spaceworks-labs.github.io';
const base = '/SpaceWorks-Design-System';
const tokens = JSON.parse(readFileSync(new URL('../tokens/tokens.json', import.meta.url), 'utf8'));
const repo = 'https://github.com/SpaceWorks-Labs/SpaceWorks-Design-System';

export default defineConfig({
  site,
  base,
  markdown: { processor: satteri({ hastPlugins: [baseLinksPlugin(base)] }) },
  // "What's new in 0.12.0" became "What's new in v2.0" (decision 382); old links land on the new page.
  // Astro does not prefix the base onto a redirect destination, so it is written out.
  redirects: { '/whats-new': `${base}/whats-new-v2/` },
  integrations: [
    starlight({
      title: 'Space Works Design System',
      description:
        'The Space Works design system: logo, colour, type, voice, design tokens, UI specs and Space Works UX.',
      logo: {
        light: './src/assets/kit/lockup-horizontal.svg',
        dark: './src/assets/kit/lockup-horizontal-reversed.svg',
        replacesTitle: true,
      },
      favicon: '/kit/icons/favicon.svg',
      head: [
        { tag: 'meta', attrs: { property: 'og:image', content: `${site}${base}/kit/icons/og-1200x630.png` } },
      ],
      social: [{ icon: 'github', label: 'GitHub', href: repo }],
      editLink: { baseUrl: `${repo}/edit/main/site/` },
      lastUpdated: true,
      customCss: [
        './src/styles/fonts.css',
        './src/styles/generated/tokens.css',
        './src/styles/generated/tokens-scope.css',
        './src/styles/generated/box-open.css',
        './src/styles/generated/theme-reveal.css',
        './src/styles/custom.css',
        './src/styles/kit.css',
      ],
      components: {
        ThemeProvider: './src/components/ThemeProvider.astro',
        ThemeSelect: './src/components/ThemeSelect.astro',
        SiteTitle: './src/components/SiteTitle.astro',
      },
      expressiveCode: {
        themes: ['github-light', 'github-dark'],
        styleOverrides: {
          borderRadius: '10px',
          borderColor: 'var(--sl-color-hairline)',
          codeBackground: ({ theme }) => (theme.type === 'dark' ? tokens.dark.panel : tokens.light.panel),
          frames: { shadowColor: 'transparent' },
        },
      },
      plugins: [starlightLinksValidator()],
      // Design System v2.0 information architecture (decision 385): start, brand, foundations, motion, components,
      // content, rules, reference. Long docs are split into an overview plus parts (scripts/split-docs.mjs). Groups
      // start collapsed (the one holding the current page opens), so the whole map fits on one screen.
      sidebar: [
        {
          label: 'Start here',
          items: [{ label: 'Overview', link: '/' }, 'whats-new-v2', 'tokens/using-the-kit'],
        },
        {
          label: 'Brand',
          collapsed: true,
          items: [
            'brand/introduction',
            'brand/logo',
            ...splitItems('specs/ui-brand-spec', ['logo-in-product']),
            'brand/colour',
            'brand/typography',
            'brand/graphics',
            'brand/mascot',
            'brand/guidelines',
          ],
        },
        {
          label: 'Foundations',
          collapsed: true,
          items: [
            'foundations',
            'tokens/reference',
            ...splitItems('specs/ui-brand-spec', ['tokens', 'index-css']),
            'theming',
            ...splitItems('specs/ui-brand-spec', ['typography', 'shape-and-spacing', 'icons']),
          ],
        },
        {
          label: 'Motion',
          collapsed: true,
          items: [
            ...splitItems('motion/principles'),
            'motion/tokens',
            'motion/kit',
            { label: 'Brand moments', items: ['motion/box-open', 'motion/theme-reveal', 'motion/delight'] },
            { label: 'Navigation', items: ['motion/route-transition', 'motion/page-enter', 'motion/scroll-reveal', 'motion/sidebar'] },
            { label: 'Layers', items: ['motion/overlays', 'motion/toast'] },
            { label: 'Feedback and state', items: ['motion/feedback', 'motion/skeleton', 'motion/collapse', 'motion/hover-press', 'motion/search'] },
            { label: 'Displays', items: ['motion/kiosk-display'] },
          ],
        },
        {
          label: 'Components and patterns',
          collapsed: true,
          items: [
            'ux/introduction',
            'ux/patterns',
            ...splitItems('specs/ui-brand-spec', ['interaction-states', 'status-pills']),
            'ux/gallery',
            {
              label: 'UX spec',
              collapsed: true,
              items: splitItems('specs/ux-patterns').filter((i) => !i.slug.endsWith('/interaction-and-microcopy')),
            },
            { label: 'Long-tail screens', collapsed: true, items: splitItems('specs/ux-long-tail-screens') },
          ],
        },
        {
          label: 'Content',
          collapsed: true,
          items: ['brand/voice', ...splitItems('specs/ux-patterns', ['interaction-and-microcopy'])],
        },
        {
          label: 'Rules',
          collapsed: true,
          items: [
            ...splitItems('rules'),
            { label: 'Pipelines and releases', items: splitItems('delivery') },
          ],
        },
        {
          label: 'Reference',
          collapsed: true,
          items: [
            { label: 'Design decisions', collapsed: true, items: splitItems('decisions') },
            { label: 'Lessons learned', collapsed: true, items: splitItems('lessons-learned') },
            {
              label: 'UI brand spec',
              collapsed: true,
              items: [splitItems('specs/ui-brand-spec')[0], ...splitItems('specs/ui-brand-spec', ['migration', 'enforcement'])],
            },
            'ux/inspiration',
            'about/credits',
          ],
        },
      ],
    }),
  ],
});
