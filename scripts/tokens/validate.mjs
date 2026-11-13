import { readFileSync } from 'node:fs';
import { buildModel } from './model.mjs';
import { validateModel } from './validate-model.mjs';
import { artifacts } from './artifacts.mjs';
import { exportProblems, readExports } from './validate-exports.mjs';
import { validateTenant } from './tenant.mjs';
const model = buildModel();
validateModel(model);
const expected = artifacts(model), problems = exportProblems(expected, readExports(expected));
if (problems.length) throw Error(problems.join('\n'));
const summary = JSON.parse(expected['tokens/exports-manifest.json']);
console.log(`Validated ${summary.tokens} typed light/dark tokens and ${Object.keys(expected).length} exact exports; aliases, legacy bytes and inventory agree.`);
console.log(`Contrast: ${summary.contrast.requiredPairs} required pairs pass; ${summary.contrast.diagnosticPairs} diagnostic pairs; ${summary.contrast.failingText} text / ${summary.contrast.failingUI} UI failures documented with passing replacements.`);
if (process.argv.length > 2) {
  if (process.argv.length !== 4 || process.argv[2] !== '--tenant') throw Error('Usage: node scripts/tokens/validate.mjs [--tenant path/to/paired-brand.json]');
  console.log(`Tenant override: ${validateTenant(model, JSON.parse(readFileSync(process.argv[3], 'utf8')))} contrast checks pass.`);
}
