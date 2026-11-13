import test from 'node:test';
import assert from 'node:assert/strict';
import { buildModel, color, cssName, nativeName, read, resolve } from './model.mjs';
import { validateModel, validateSchema } from './validate-model.mjs';
import { exportProblems } from './validate-exports.mjs';
import { artifacts } from './artifacts.mjs';
import { ratio } from './contrast.mjs';
import { validateTenant, tenantKeys } from './tenant.mjs';

const model = buildModel(), files = artifacts(model);
const matrix = JSON.parse(files['tokens/contrast-matrix.json']);
test('complete source and paired legacy mappings validate', () => validateModel(model));
test('missing mode is rejected before export', () => {
  const changed = structuredClone(model);
  delete changed.tokens['semantic.color.ink'].values.dark;
  assert.throws(() => validateModel(changed), /Missing or unknown mode/);
});
test('unknown alias, cycles, alias type drift and inverted tier dependencies fail', () => {
  for (const [mutate, pattern] of [
    [m => m.tokens['semantic.color.ink'].values.light = '{semantic.color.absent}', /Unknown reference/],
    [m => m.tokens['semantic.color.ink'].values.light = '{semantic.color.ink}', /Alias cycle/],
    [m => m.tokens['semantic.color.ink'].values.light = '{primitive.spacing.4}', /Alias type mismatch/],
    [m => m.tokens['semantic.color.ink'].values.light = '{component.button.label}', /Semantic cannot depend on component/]
  ]) {
    const changed = structuredClone(model); mutate(changed);
    assert.throws(() => validateModel(changed), pattern);
  }
});
test('input schema rejects partial pairs, misspelled fields and malformed scales', () => {
  for (const mutate of [
    c => delete c.aliases['semantic.color.boundary-strong'].dark,
    c => c.aliases['component.focus.width'].unknownField = true,
    c => c.radius.sm = '6px',
    c => c.opacity.solid = 2,
    c => c.type.body[2] = 'monospace'
  ]) {
    const changed = structuredClone(model.config); mutate(changed);
    assert.throws(() => validateSchema(changed, JSON.parse(read('scripts/tokens/schema.json'))));
  }
});
test('forward aliases resolve independently of JSON property order', () => {
  const config = structuredClone(model.config);
  config.aliases = { 'component.forward.color': { ref: 'semantic.forward.color', purpose: 'Forward component slot' }, 'semantic.forward.color': { ref: 'semantic.color.ink', purpose: 'Forward semantic alias' }, ...config.aliases };
  const forward = buildModel(config);
  validateModel(forward);
  assert.deepEqual(resolve(forward, 'component.forward.color', 'dark'), resolve(model, 'semantic.color.ink', 'dark'));
});
test('DTCG exports retain full identical inventories and typed alias targets in each mode', () => {
  for (const mode of ['light', 'dark']) {
    const tree = JSON.parse(files[`tokens/dtcg/${mode}.tokens.json`]), paths = [];
    const walk = (node, prefix = '') => {
      for (const [key, value] of Object.entries(node)) {
        if (key.startsWith('$')) continue;
        const path = prefix ? prefix + '.' + key : key;
        if ('$value' in value) { paths.push(path); assert.equal(value.$type, model.tokens[path].type); assert.deepEqual(value.$value, model.tokens[path].values[mode]); }
        else walk(value, path);
      }
    };
    walk(tree);
    assert.deepEqual(paths.sort(), Object.keys(model.tokens).sort());
  }
});
test('CSS has complete declarations with no undefined composites, and legacy names stay triplets', () => {
  const css = files['tokens/portable.css'];
  assert.doesNotMatch(css, /undefined|NaN/);
  assert.match(css, /--sw-component-button-type-font-size: var\(--sw-semantic-type-button-font-size\)/);
  assert.match(css, /--sw-component-button-brand-label: var\(--sw-semantic-color-on-brand\)/);
  assert.match(css, /:root\.dark \[data-sw-tenant\]/);
  assert.match(css, /\.sw-kiosk, \.sw-tv \{\n  --sw-semantic-motion-enter-y: var\(--sw-enter-y\)/);
  assert.match(css, /--sw-semantic-motion-duration-logo-box-open: 0ms/);
  for (const path of Object.keys(model.tokens)) assert.ok(css.includes(cssName(path) + ':'), path);
  assert.doesNotMatch(css, /\n\s+--color-/);
  assert.match(read('tokens/tokens.css'), /--color-accent: 0 110 99;/);
});
test('all native entries are present in both modes and type/motion units map correctly', () => {
  for (const mode of ['light', 'dark']) {
    const xml = files[`tokens/android/${mode === 'light' ? 'values' : 'values-night'}/tokens.xml`];
    const names = [...xml.matchAll(/name="([a-z0-9_]+)"/g)].map(m => m[1]);
    assert.deepEqual(names.sort(), Object.keys(model.tokens).map(nativeName).sort());
    for (const path of Object.keys(model.tokens)) {
      assert.ok(files['tokens/android/SpaceWorksTokens.kt'].includes('val ' + nativeName(path) + ' = '));
      assert.ok(files['tokens/ios/SpaceWorksTokens.swift'].includes('let ' + nativeName(path) + ' = '));
    }
  }
  assert.match(files['tokens/android/SpaceWorksTokens.kt'], /16\.0\.sp, 400, 24\.0\.sp/);
  assert.match(files['tokens/android/SpaceWorksTokens.kt'], /alpha = 0\.06f/);
  assert.match(files['tokens/ios/SpaceWorksTokens.swift'], /sw_semantic_motion_duration_fast = 0\.12/);
  assert.match(files['tokens/android/values/tokens.xml'], /<integer name="sw_semantic_motion_duration_fast">120<\/integer>/);
});
test('asset catalogue provides exact light/dark pairs for every public colour', () => {
  for (const [path, token] of Object.entries(model.tokens)) if (token.type === 'color' && !path.startsWith('primitive.')) {
    const asset = JSON.parse(files[`tokens/ios/SpaceWorks.xcassets/${nativeName(path)}.colorset/Contents.json`]);
    assert.equal(asset.colors.length, 2);
    assert.equal(asset.colors[1].appearances[0].value, 'dark');
    for (const [i, mode] of ['light', 'dark'].entries()) {
      const expected = resolve(model, path, mode), got = asset.colors[i].color.components;
      assert.deepEqual([got.red, got.green, got.blue].map(Number), expected.components);
    }
  }
});
test('known failures are not rounded up; added role aliases pass', () => {
  const find = (theme, fg, bg) => matrix.pairs.find(p => p.theme === theme && p.foreground === 'semantic.color.' + fg && p.background === 'semantic.color.' + bg);
  assert.equal(find('light', 'outline', 'hover').boundary, false);
  const dark = find('dark', 'accent', 'panel');
  assert.ok(dark.ratio > 2.98 && dark.ratio < 3);
  assert.equal(dark.state, false);
  assert.equal(dark.uiReplacement.token, 'semantic.color.state-indicator');
  assert.equal(find('light', 'boundary-strong', 'hover').boundary, true);
  assert.equal(find('dark', 'state-indicator', 'panel').state, true);
  assert.equal(ratio(color('#000000'), color('#FFFFFF')), 21);
});
test('every failed pair has a passing computed replacement and scrims are covered', () => {
  assert.ok(matrix.pairs.some(p => p.background.startsWith('composite.scrim-')));
  assert.equal(matrix.required.filter(p => !p.pass).length, 0);
  for (const row of matrix.pairs) {
    if (!row.normalText) assert.ok(row.textReplacement.ratio >= 4.5, JSON.stringify(row));
    if (!row.icon) assert.ok(row.uiReplacement.ratio >= 3, JSON.stringify(row));
    for (const key of ['largeText', 'boundary', 'focus', 'state']) assert.equal(row[key], row.icon);
  }
});
test('missing, altered and unknown exports are rejected bidirectionally', () => {
  const expected = { 'tokens/dtcg/light.tokens.json': 'correct', 'tokens/android/values/tokens.xml': 'xml' };
  assert.deepEqual(exportProblems(expected, { 'tokens/dtcg/light.tokens.json': 'drift', 'tokens/android/values/obsolete.xml': 'old' }), [
    'Export drift: tokens/dtcg/light.tokens.json', 'Missing export: tokens/android/values/tokens.xml', 'Unknown generated export: tokens/android/values/obsolete.xml'
  ]);
  assert.deepEqual(exportProblems({ 'tokens/a.css': 'x\ny\n' }, { 'tokens/a.css': 'x\r\ny\r\n' }), []);
});
test('tenant overrides require full pairs, forbid fixed roles and enforce all contrast contexts', () => {
  const input = Object.fromEntries(['light', 'dark'].map(mode => [mode, Object.fromEntries(tenantKeys.map(k => [k, model.legacy[mode][k]]))]));
  assert.equal(validateTenant(model, input), 50);
  const missing = structuredClone(input); delete missing.dark;
  assert.throws(() => validateTenant(model, missing), /light and dark pairs/);
  const forbidden = structuredClone(input); forbidden.light.focus = '#FFFFFF';
  assert.throws(() => validateTenant(model, forbidden), /no fixed role overrides/);
  const unreadable = structuredClone(input); unreadable.light['on-brand'] = unreadable.light.brand;
  assert.throws(() => validateTenant(model, unreadable), /Tenant contrast failure/);
});
