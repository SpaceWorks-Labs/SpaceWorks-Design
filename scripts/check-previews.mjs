// Fails (exit 1) when the preview images are stale or missing.
// Run: node scripts/check-previews.mjs   (regenerate with: node scripts/make-previews.mjs)
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { LOCK, OUTPUTS, ROOT, hashSources } from './lib-previews.mjs';

const problems = [];
if (!existsSync(LOCK)) problems.push('scripts/previews.lock.json is missing');
else {
  const lock = JSON.parse(readFileSync(LOCK, 'utf8'));
  const now = hashSources();
  for (const [rel, sha] of Object.entries(now)) {
    if (lock.sources?.[rel] !== sha) problems.push(`${rel} changed since the previews were generated`);
  }
}
for (const rel of OUTPUTS) if (!existsSync(join(ROOT, rel))) problems.push(`missing preview ${rel}`);

if (problems.length) {
  console.error('Previews are stale:\n - ' + problems.join('\n - '));
  console.error('\nFix: node scripts/make-previews.mjs   (needs Microsoft Edge; see tokens/README.md)');
  process.exit(1);
}
console.log('Previews are up to date.');
