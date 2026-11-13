import { readFileSync } from 'node:fs';

// One source-to-route map for publication, navigation and preservation checks.
export const PUBLICATIONS = [
  ...JSON.parse(readFileSync(new URL('../../docs/adoption/sidebar-map.json', import.meta.url), 'utf8')).pages.map(p => ({ file: p.source, route: p.route.replace(/\/$/, ''), sidebar: p.sidebar })),
  { file: 'docs/current-rules.md', route: 'current-rules', sidebar: 'Start here > Current rules' },
  { file: 'docs/voice-and-content.md', route: 'voice-and-content', sidebar: 'Content > Voice and content' },
  { file: 'docs/motion-flow.md', route: 'motion/flow', sidebar: 'Motion > Motion flow' },
  { file: 'tokens/ARCHITECTURE.md', route: 'tokens/architecture', sidebar: 'Foundations > Token architecture' },
  { file: 'tokens/USAGE.md', route: 'tokens/usage', sidebar: 'Foundations > Token usage' },
  { file: 'tokens/contrast-matrix.md', route: 'tokens/contrast-matrix', sidebar: 'Foundations > Contrast matrix' },
  { file: 'docs/whats-new-v2.1.md', route: 'whats-new-v2-1', sidebar: "Start here > What's new in v2.1" },
];

export function publicationItems(prefix) {
  const entries = PUBLICATIONS.filter(p => p.sidebar.startsWith(prefix + ' > '));
  const items = [];
  for (const p of entries) {
    const parts = p.sidebar.slice(prefix.length + 3).split(' > ');
    let level = items;
    while (parts.length > 1) {
      const label = parts.shift();
      let group = level.find(item => item.label === label && item.items);
      if (!group) { group = { label, collapsed: true, items: [] }; level.push(group); }
      level = group.items;
    }
    level.push({ slug: p.route, label: parts[0] });
  }
  return items;
}
