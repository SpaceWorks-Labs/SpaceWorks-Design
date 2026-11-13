import { color, resolve } from './model.mjs';
import { ratio } from './contrast.mjs';
export const tenantKeys = ['brand', 'brand-hover', 'brand-active', 'on-brand', 'brand-soft', 'brand-ink', 'brand-boundary'];
export function validateTenant(model, input) {
  if (!input || Object.keys(input).sort().join() !== 'dark,light') throw Error('Tenant override needs exactly light and dark pairs');
  const custom = structuredClone(model), problems = [];
  for (const mode of model.config.modes) {
    if (!input[mode] || Object.keys(input[mode]).sort().join() !== [...tenantKeys].sort().join()) throw Error(`Tenant ${mode}: override exactly the seven brand-family keys; no fixed role overrides`);
    for (const key of tenantKeys) {
      const hex = input[mode][key];
      if (typeof hex !== 'string' || !/^#[\da-f]{6}$/i.test(hex)) throw Error(`Tenant ${mode}.${key}: expected opaque #RRGGBB`);
      custom.tokens['semantic.color.' + key].values[mode] = color(hex);
    }
  }
  let checked = 0;
  const check = (mode, fg, bg, min) => {
    const r = ratio(resolve(custom, 'semantic.color.' + fg, mode), resolve(custom, 'semantic.color.' + bg, mode));
    checked++;
    if (r < min) problems.push(`${mode}: ${fg} on ${bg} ${r.toFixed(6)} < ${min}`);
  };
  for (const mode of model.config.modes) {
    for (const bg of ['brand', 'brand-hover', 'brand-active']) check(mode, 'on-brand', bg, 4.5);
    const grounds = ['bg', 'surface', 'panel', 'hover', 'brand-soft', 'accent-soft', 'emphasis-soft', 'success-soft', 'warn-soft', 'info-soft'];
    for (const bg of grounds) check(mode, 'brand-ink', bg, 4.5);
    for (const fg of ['ink', 'muted', 'accent-ink', 'success-ink', 'warn-ink', 'info-ink', 'danger']) check(mode, fg, 'brand-soft', 4.55);
    for (const bg of ['bg', 'surface', 'panel', 'hover', 'brand-soft']) check(mode, 'brand-boundary', bg, 3);
  }
  if (problems.length) throw Error('Tenant contrast failure:\n' + problems.join('\n'));
  return checked;
}
