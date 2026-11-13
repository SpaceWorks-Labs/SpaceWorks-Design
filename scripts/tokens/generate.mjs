import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { ROOT, buildModel } from './model.mjs';
import { validateModel } from './validate-model.mjs';
import { artifacts } from './artifacts.mjs';
const model = buildModel();
validateModel(model);
const files = artifacts(model);
for (const [path, content] of Object.entries(files)) {
  const target = join(ROOT, path);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, content, 'utf8');
}
console.log(`Generated ${Object.keys(files).length} files from ${Object.keys(model.tokens).length} paired tokens. Legacy exports unchanged.`);
