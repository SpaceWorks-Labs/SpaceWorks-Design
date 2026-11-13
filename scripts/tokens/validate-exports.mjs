import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from './model.mjs';
export function exportProblems(expected, actual) {
  const problems = [];
  for (const [path, content] of Object.entries(expected)) {
    if (!(path in actual)) problems.push('Missing export: ' + path);
    else if (String(actual[path]).replaceAll('\r\n', '\n') !== content.replaceAll('\r\n', '\n')) problems.push('Export drift: ' + path);
  }
  for (const path of Object.keys(actual)) if (!(path in expected)) problems.push('Unknown generated export: ' + path);
  return problems;
}
export function readExports(expected) {
  const actual = {};
  for (const path of Object.keys(expected)) if (existsSync(join(ROOT, path))) actual[path] = readFileSync(join(ROOT, path));
  function scan(path) {
    if (!existsSync(join(ROOT, path))) return;
    for (const item of readdirSync(join(ROOT, path), { withFileTypes: true })) {
      const child = path + '/' + item.name;
      if (item.isDirectory()) scan(child);
      else actual[child] = readFileSync(join(ROOT, child));
    }
  }
  for (const path of ['tokens/dtcg', 'tokens/android', 'tokens/ios']) scan(path);
  return actual;
}
