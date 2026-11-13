import { cssName, json, resolve } from './model.mjs';
import { cssValue } from './web-exports.mjs';
const cell = s => String(s).replaceAll('|', '\\|').replaceAll('\n', ' ');
export function usageExports(model) {
  const rows = Object.entries(model.tokens).filter(([p]) => !p.startsWith('primitive.')).map(([path, token]) => ({ path, css: cssName(path), legacy: token.legacy ?? null, type: token.type, purpose: token.purpose, use: token.use, avoid: token.avoid, scope: token.scope, override: token.override, aliases: token.values, light: resolve(model, path, 'light'), dark: resolve(model, path, 'dark'), partner: token.partner, deprecated: false }));
  const lines = ['# Token usage reference', '', 'Generated from the legacy palette plus `contract.json` by `node scripts/tokens/generate.mjs`. All semantic and component roles are listed; primitive values are in the DTCG exports. No legacy name is deprecated or removed.', '',
    'Use browser Find or search `usage.json` by `path`, `purpose`, `scope`, `override`, `legacy` or `css`. Copy the exact path/CSS name from each row. This machine-readable file lets batch 3 add search/copy controls without maintaining another value table.', '',
    'Read [architecture, units and tenant boundaries](ARCHITECTURE.md) first. Every colour pairing, including failed state/boundary combinations and computed replacements, is in the [contrast matrix](contrast-matrix.md); the partner column is role guidance, not a blanket contrast guarantee. Only the matrix’s required-pair table lists asserted combinations.', '',
    'CSS: import `portable.css` (it imports the original `tokens.css`). New colours are complete CSS colours: `color: var(--sw-semantic-color-ink)`. Legacy colours remain RGB triplets: `color: rgb(var(--color-ink))`. Component aliases inherit semantic changes. DTCG paths are identical to the first column. Native names replace dots/hyphens with underscores and begin `sw_`.', '',
    '> **Current rule (v2.1.0, 2026-11-13; DSA-014):** `line` and `danger-line` are decorative. `outline` has restricted backgrounds; use `boundary-strong` for essential neutral boundaries across hover/pressed surfaces. Use `state-indicator` (accent-ink), or tenant brand-boundary, for essential thin selected marks. Preserve the legacy colours.', ''];
  for (const tier of ['semantic', 'component']) {
    lines.push(`## ${tier} roles`, '', '| Path / CSS / legacy | Purpose / scope / override | Use | Do not use | Light | Dark | Contrast partner | Aliases light / dark |', '|---|---|---|---|---|---|---|---|');
    for (const row of rows.filter(r => r.path.startsWith(tier + '.'))) {
      const token = model.tokens[row.path];
      lines.push('| ' + [`\`${row.path}\` / \`${row.css}\`${row.legacy ? ' / ' + (row.legacy.css ?? `${row.legacy.group}.${row.legacy.path}`) : ''}`, `${row.purpose}; ${row.scope}; override: ${row.override}`, row.use, row.avoid, cssValue(row.type, row.light, token), cssValue(row.type, row.dark, token), row.partner, `${JSON.stringify(row.aliases.light)} / ${JSON.stringify(row.aliases.dark)}`].map(cell).join(' | ') + ' |');
    }
  }
  return { 'tokens/USAGE.md': lines.join('\n') + '\n', 'tokens/usage.json': json({ version: model.config.version, tokens: rows }) };
}
