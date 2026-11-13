import { createHash } from 'node:crypto';
import { json } from './model.mjs';
import { webExports } from './web-exports.mjs';
import { nativeExports } from './native-exports.mjs';
import { usageExports } from './usage.mjs';
import { contrastExports } from './contrast.mjs';
import { tenantKeys } from './tenant.mjs';
export function artifacts(model) {
  const contrast = contrastExports(model);
  if (contrast.summary.requiredFailures) throw Error(`Required contrast failures: ${JSON.stringify(contrast.allowed.filter(p => !p.pass))}`);
  const files = { ...webExports(model), ...nativeExports(model), ...usageExports(model), ...contrast.files };
  files['tokens/tenant.default.json'] = json(Object.fromEntries(model.config.modes.map(mode => [mode, Object.fromEntries(tenantKeys.map(key => [key, model.legacy[mode][key]]))])));
  files['tokens/exports-manifest.json'] = json({ generator: 'scripts/tokens/generate.mjs', version: model.config.version, checksumEncoding: 'UTF-8 with LF; validator permits only checkout CRLF-to-LF normalisation',
    tokens: Object.keys(model.tokens).length, contrast: contrast.summary,
    sha256: Object.fromEntries(Object.entries(files).map(([path, value]) => [path, createHash('sha256').update(value).digest('hex')])) });
  return files;
}
