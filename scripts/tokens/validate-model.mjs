import { createHash } from 'node:crypto';
import { read, resolve, cssName, nativeName } from './model.mjs';

// Dependency-free evaluator for the JSON Schema vocabulary used by schema.json.
// Fail on unsupported keywords so extending the schema cannot silently weaken validation.
export function validateSchema(value, schema, root = schema, path = '$') {
  const supported = ['$schema', '$id', '$defs', 'title', '$ref', 'type', 'additionalProperties', 'required', 'properties', 'const', 'enum', 'minLength', 'minimum', 'maximum', 'exclusiveMinimum', 'minItems', 'maxItems', 'uniqueItems', 'prefixItems', 'items', 'minProperties', 'oneOf', 'anyOf', 'not'];
  if (schema === false) throw Error(path + ': value is forbidden');
  if (schema === true) return;
  for (const key of Object.keys(schema)) if (!supported.includes(key)) throw Error('Unsupported schema keyword: ' + key);
  if (schema.$ref) {
    if (!schema.$ref.startsWith('#/')) throw Error('Only local schema references are supported');
    return validateSchema(value, schema.$ref.slice(2).split('/').reduce((s, k) => s[k], root), root, path);
  }
  const passes = sub => { try { validateSchema(value, sub, root, path); return true; } catch { return false; } };
  if (schema.oneOf && schema.oneOf.filter(passes).length !== 1) throw Error(path + ': expected exactly one schema branch (check light/dark pair or ref)');
  if (schema.anyOf && !schema.anyOf.some(passes)) throw Error(path + ': no matching schema branch');
  if (schema.not && passes(schema.not)) throw Error(path + ': forbidden schema branch');
  const actual = Array.isArray(value) ? 'array' : value === null ? 'null' : typeof value;
  if (schema.type && actual !== schema.type) throw Error(`${path}: expected ${schema.type}, got ${actual}`);
  if ('const' in schema && JSON.stringify(value) !== JSON.stringify(schema.const)) throw Error(path + ': invalid constant');
  if (schema.enum && !schema.enum.some(v => JSON.stringify(v) === JSON.stringify(value))) throw Error(path + ': value outside enum');
  if (typeof value === 'number' && (!Number.isFinite(value) || ('minimum' in schema && value < schema.minimum) || ('maximum' in schema && value > schema.maximum) || ('exclusiveMinimum' in schema && value <= schema.exclusiveMinimum))) throw Error(path + ': number outside range');
  if (typeof value === 'string' && value.length < (schema.minLength ?? 0)) throw Error(path + ': empty description');
  if (Array.isArray(value)) {
    if (value.length < (schema.minItems ?? 0) || value.length > (schema.maxItems ?? Infinity)) throw Error(path + ': invalid tuple/array length');
    if (schema.uniqueItems && new Set(value.map(JSON.stringify)).size !== value.length) throw Error(path + ': duplicate entries');
    value.forEach((v, i) => { const sub = schema.prefixItems?.[i] ?? schema.items; if (sub !== undefined) validateSchema(v, sub, root, `${path}[${i}]`); });
  } else if (value && typeof value === 'object') {
    if (Object.keys(value).length < (schema.minProperties ?? 0)) throw Error(path + ': empty scale');
    for (const key of schema.required ?? []) if (!(key in value)) throw Error(`${path}: missing ${key}`);
    for (const [key, v] of Object.entries(value)) {
      const sub = schema.properties?.[key] ?? schema.additionalProperties;
      if (sub !== undefined) validateSchema(v, sub, root, path + '.' + key);
    }
  }
}
function assert(ok, message) { if (!ok) throw Error(message); }
function validType(type, v, path) {
  const num = n => typeof n === 'number' && Number.isFinite(n);
  const unit = (value, units) => value && num(value.value) && units.includes(value.unit);
  let ok = false;
  if (type === 'number') ok = num(v);
  if (type === 'fontWeight') ok = num(v) && v >= 1 && v <= 1000;
  if (type === 'dimension') ok = unit(v, ['px', 'rem']);
  if (type === 'duration') ok = unit(v, ['ms', 's']) && v.value >= 0;
  if (type === 'fontFamily') ok = Array.isArray(v) && v.length > 0 && v.every(s => typeof s === 'string' && s.length);
  if (type === 'cubicBezier') ok = Array.isArray(v) && v.length === 4 && v.every(num) && v[0] >= 0 && v[0] <= 1 && v[2] >= 0 && v[2] <= 1;
  if (type === 'color') ok = v?.colorSpace === 'srgb' && Array.isArray(v.components) && v.components.length === 3 && v.components.every(n => num(n) && n >= 0 && n <= 1) && num(v.alpha) && v.alpha >= 0 && v.alpha <= 1 && /^#[\da-f]{6}$/i.test(v.hex) && v.hex.toUpperCase() === '#' + v.components.map(n => Math.round(n * 255).toString(16).padStart(2, '0')).join('').toUpperCase();
  if (type === 'typography') { validType('fontFamily', v.fontFamily, path); validType('fontWeight', v.fontWeight, path); validType('dimension', v.fontSize, path); validType('dimension', v.letterSpacing, path); ok = num(v.lineHeight) && v.lineHeight > 0; }
  if (type === 'shadow') { ok = Array.isArray(v) && v.length > 0; for (const layer of v ?? []) { validType('color', layer.color, path); for (const key of ['offsetX', 'offsetY', 'blur', 'spread']) validType('dimension', layer[key], path); assert(layer.blur.value >= 0, path + ': negative blur'); } }
  assert(ok, `${path}: invalid ${type} value ${JSON.stringify(v)}`);
}
export function validateModel(model, { frozen = true } = {}) {
  validateSchema(model.config, JSON.parse(read('scripts/tokens/schema.json')));
  assert(Object.keys(model.legacy.light).sort().join() === Object.keys(model.legacy.dark).sort().join(), 'Legacy light/dark keys differ');
  for (const group of ['chart', 'loader']) assert(Object.keys(model.legacy[group].light).sort().join() === Object.keys(model.legacy[group].dark).sort().join(), `Legacy ${group} light/dark keys differ`);
  assert(Object.keys(model.legacy.cards.aurora.light).sort().join() === Object.keys(model.legacy.cards.aurora.dark).sort().join(), 'Aurora light/dark keys differ');
  for (const name of [cssName, nativeName]) assert(new Set(Object.keys(model.tokens).map(name)).size === Object.keys(model.tokens).length, 'Export identifier collision');
  for (const [path, token] of Object.entries(model.tokens)) {
    assert(/^(primitive|semantic|component)(\.[a-z0-9-]+)+$/.test(path), 'Invalid token name: ' + path);
    assert(Object.keys(token.values).sort().join() === 'dark,light', 'Missing or unknown mode: ' + path);
    if (path.startsWith('primitive.')) assert(JSON.stringify(token.values.light) === JSON.stringify(token.values.dark), 'Primitive must be mode-independent: ' + path);
    for (const field of ['purpose', 'use', 'avoid', 'partner', 'scope', 'override']) assert(typeof token[field] === 'string' && token[field].length, `${path}: missing ${field}`);
    for (const mode of model.config.modes) {
      const raw = token.values[mode];
      if (typeof raw === 'string' && raw.startsWith('{')) {
        const target = raw.slice(1, -1);
        assert(model.tokens[target], `Unknown reference: ${target} from ${path}`);
        assert(model.tokens[target].type === token.type, `Alias type mismatch: ${path} -> ${target}`);
        if (path.startsWith('primitive.')) assert(target.startsWith('primitive.'), 'Primitive cannot depend on semantic/component: ' + path);
        if (path.startsWith('semantic.')) assert(!target.startsWith('component.'), 'Semantic cannot depend on component: ' + path);
      }
      validType(token.type, resolve(model, path, mode), path + ' ' + mode);
    }
  }
  // A reviewed immutable compatibility baseline catches name, value, formatting and whitespace changes.
  const baseline = JSON.parse(read('tokens/legacy-lock.json'));
  if (frozen) for (const [path, expected] of Object.entries(baseline.sha256)) {
    const digest = createHash('sha256').update(Buffer.from(read(path), 'utf8')).digest('hex');
    const normalized = createHash('sha256').update(read(path).replaceAll('\r\n', '\n')).digest('hex');
    assert(digest === expected || normalized === baseline.sha256LF?.[path], 'Frozen legacy export changed (beyond checkout line endings): ' + path);
  }
  // Retain every public legacy group, not just the colours consumed by the site guard.
  const represented = Object.values(model.tokens).filter(t => t.legacy);
  const count = Object.keys(model.legacy.light).length + Object.keys(model.legacy.chart.light).length + Object.keys(model.legacy.loader.light).length + Object.keys(model.legacy.cards.aurora.light).length;
  assert(represented.length === count, 'Missing or duplicate legacy colour/chart/loader/card mapping');
}
