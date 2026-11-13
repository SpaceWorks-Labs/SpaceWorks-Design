// Authoritative inputs: frozen legacy tokens.json + additive tokens/contract.json.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
export const ROOT = fileURLToPath(new URL('../../', import.meta.url));
export const read = path => readFileSync(new URL('../../' + path, import.meta.url), 'utf8');
export const json = value => JSON.stringify(value, null, 2) + '\n';
export const ref = path => `{${path}}`;
export const cssName = path => '--sw-' + path.replaceAll('.', '-');
export const nativeName = path => 'sw_' + path.replaceAll(/[.-]/g, '_');
export const color = hex => ({ colorSpace: 'srgb', components: hex.match(/[a-f\d]{2}/gi).map(n => parseInt(n, 16) / 255), alpha: 1, hex: hex.toUpperCase() });
export const dim = value => ({ value, unit: 'px' });

export function buildModel(config = JSON.parse(read('tokens/contract.json')), legacy = JSON.parse(read('tokens/tokens.json'))) {
  const tokens = {};
  const add = (path, type, value, meta = {}) => {
    if (tokens[path]) throw Error(`Duplicate token: ${path}`);
    tokens[path] = { type, values: { light: value, dark: value }, purpose: path.split('.').slice(1).join(' '),
      use: 'Use the named role in its stated scope; see ARCHITECTURE.md for units and constraints.',
      avoid: 'Do not substitute an unrelated role or override a primitive.', partner: 'N/A: geometry or behaviour, not a contrast foreground.',
      scope: path.startsWith('component.') ? path.split('.')[1] : 'system', override: 'none', ...meta };
  };
  const primitiveColor = hex => {
    const path = 'primitive.color.hex' + hex.slice(1).toLowerCase();
    if (!tokens[path]) add(path, 'color', color(hex), { purpose: 'Immutable sRGB palette sample ' + hex });
    return ref(path);
  };
  for (const hex of Object.values(legacy.brand)) primitiveColor(hex);
  // Include the black shadow pigment even if an imported palette changes in a future release.
  primitiveColor('#000000');
  for (const theme of config.modes) {
    for (const [name, hex] of Object.entries(legacy[theme])) {
      const path = 'semantic.color.' + name;
      if (!tokens[path]) add(path, 'color', null, colorMetadata(name));
      tokens[path].values[theme] = primitiveColor(hex);
      tokens[path].legacy = { path: name, css: '--color-' + name, group: 'color' };
    }
    for (const group of ['chart', 'loader', 'cards']) {
      const entries = group === 'cards' ? legacy.cards.aurora[theme] : legacy[group][theme];
      for (const [key, hex] of Object.entries(entries)) {
        const name = group === 'chart' && /^\d$/.test(key) ? 'series' + key : key;
        const path = group === 'cards' ? 'component.aurora.' + name : `${group === 'chart' ? 'semantic' : 'component'}.${group}.${name}`;
        if (!tokens[path]) add(path, 'color', null, localMetadata(group, name));
        tokens[path].values[theme] = primitiveColor(hex);
        tokens[path].legacy = { group, path: key, css: group === 'chart' ? '--chart-' + key : null };
      }
    }
  }
  for (const [name, hex] of Object.entries(legacy.brand)) add('primitive.brand.' + name, 'color', primitiveColor(hex));
  const scales = [['spacing', config.spacing.map(n => [String(n), n])], ['radius', Object.entries(config.radius)],
    ['border-width', Object.entries(config.borderWidth)], ['breakpoint', Object.entries(config.breakpoint)],
    ['size', Object.entries(config.size)], ['layer', Object.entries(config.layer)], ['opacity', Object.entries(config.opacity)]];
  for (const [group, entries] of scales) for (const [key, value] of entries) {
    const type = ['layer', 'opacity'].includes(group) ? 'number' : 'dimension';
    add(`primitive.${group}.${key}`, type, type === 'dimension' ? dim(value) : value);
    add(`semantic.${group}.${key}`, type, ref(`primitive.${group}.${key}`), scaleMetadata(group, key));
  }
  for (const [key, value] of Object.entries({ none: '0ms', ...legacy.motion.duration, 'display-fade': '400ms', 'scroll-reveal': '640ms', 'logo-box-open': '2200ms' })) {
    add('primitive.duration.' + key, 'duration', { value: parseFloat(value), unit: 'ms' });
    add('semantic.motion.duration-' + key, 'duration', ref('primitive.duration.' + key), {
      purpose: `${key} motion duration`, use: { none: 'Reduced motion and immediate state changes', fast: 'Press, hover, exit', base: 'Overlay and indicator', slow: 'Route settle', 'display-fade': 'Passive kiosk/display slide fade only (docs/motion.md)', 'scroll-reveal': 'Once-only marketing scroll reveal (docs/motion.md)', 'logo-box-open': 'Space Works mark box-open exception only; never general UI' }[key],
      avoid: 'Do not delay input or announcements; reduced motion sets durations to zero.', legacyCss: ['fast', 'base', 'slow'].includes(key) ? '--sw-dur-' + key : null });
  }
  for (const [key, value] of Object.entries({ ...legacy.motion.easing, 'out-soft': 'cubic-bezier(0.32, 0.72, 0, 1)' })) {
    add('primitive.easing.' + key, 'cubicBezier', value.match(/[\d.]+/g).map(Number));
    add('semantic.motion.easing-' + key, 'cubicBezier', ref('primitive.easing.' + key), { purpose: `${key} motion curve`, use: 'Standard for movement; enter for arrival; exit for departure; out-soft is the app Tailwind curve.', avoid: 'Do not animate layout or add hover translation.', legacyCss: key === 'out-soft' ? null : '--sw-ease-' + key });
  }
  for (const [key, value] of Object.entries(legacy.motion.distance)) {
    const type = value.endsWith('px') ? 'dimension' : 'number';
    add('primitive.distance.' + key, type, type === 'dimension' ? dim(parseFloat(value)) : parseFloat(value) / (value.endsWith('%') ? 100 : 1));
    add('semantic.motion.' + key, type, ref('primitive.distance.' + key), { purpose: 'Motion ' + key, use: 'Arrival motion only; kiosk/TV zero translations and keep scale at one.', avoid: 'Hover transforms; reduced-motion movement.', legacyCss: '--sw-' + key, percent: value.endsWith('%') });
  }
  for (const [key, value] of Object.entries({ display: ['Gilroy', 'Outfit', 'sans-serif'], sans: ['Outfit', 'sans-serif'], accent: ['Unbounded', 'Outfit', 'sans-serif'] })) add('primitive.font-family.' + key, 'fontFamily', value);
  for (const weight of [300, 400, 500, 600, 700, 800]) add('primitive.font-weight.w' + weight, 'fontWeight', weight);
  for (const [key, [size, line, family, weight, tracking]] of Object.entries(config.type)) {
    add(`primitive.type-size.${key}`, 'dimension', dim(size), { nativeUnit: 'sp' });
    add(`primitive.type-tracking.${key}`, 'dimension', dim(size * tracking));
    add(`primitive.type-line.${key}`, 'number', line / size);
    add(`semantic.type.${key}`, 'typography', { fontFamily: ref('primitive.font-family.' + family), fontSize: ref(`primitive.type-size.${key}`), fontWeight: ref('primitive.font-weight.w' + weight), letterSpacing: ref(`primitive.type-tracking.${key}`), lineHeight: ref(`primitive.type-line.${key}`) }, {
      purpose: key + ' typography', use: typeUse(key), avoid: family === 'display' ? 'Do not request unshipped Gilroy 400–700; use Outfit for UI text.' : family === 'accent' ? 'No long copy: one short phrase per layout.' : 'No monospace substitution; IDs use Outfit tabular numerals.', nativeUnit: 'sp' });
  }
  const shadow = (hex, alpha, y, blur) => ({ color: { ...color(hex), alpha }, offsetX: dim(0), offsetY: dim(y), blur: dim(blur), spread: dim(0) });
  add('primitive.shadow.flat', 'shadow', [shadow('#000000', 0, 0, 0)]);
  for (const mode of config.modes) add('primitive.shadow.overlay-' + mode, 'shadow', [[0.06, 2, 6], [0.1, 12, 32]].map(([a, y, b]) => shadow(mode === 'light' ? '#142C2A' : '#000000', a, y, b)));
  for (const key of ['flat', 'overlay']) {
    add('semantic.elevation.' + key, 'shadow', ref('primitive.shadow.' + key), { purpose: key + ' elevation', use: key === 'flat' ? 'Cards and panels (no shadow)' : 'Floating menus, popovers, dialogs, drawers and toasts only', avoid: key === 'flat' ? 'Use overlay only for floating content.' : 'No shadow on flat cards; no invented elevation ladder.' });
    if (key === 'overlay') for (const mode of config.modes) tokens['semantic.elevation.overlay'].values[mode] = ref('primitive.shadow.overlay-' + mode);
  }
  // Aliases have explicit pairs even when their values happen to match across themes.
  for (const [path, spec] of Object.entries(config.aliases)) {
    const source = spec.ref ?? spec.light;
    add(path, 'PENDING', null, { purpose: spec.purpose, use: spec.use ?? spec.purpose, avoid: spec.avoid ?? 'Use only for the named component or role; do not replace unrelated system roles.', partner: spec.partner ?? tokens[source]?.partner ?? 'N/A', override: spec.override ?? 'none' });
    for (const mode of config.modes) tokens[path].values[mode] = ref(spec.ref ?? spec[mode]);
  }
  const infer = (path, trail = []) => {
    if (trail.includes(path)) throw Error('Alias cycle: ' + [...trail, path].join(' -> '));
    if (!tokens[path]) throw Error('Unknown reference: ' + path);
    if (tokens[path].type === 'PENDING') tokens[path].type = infer(tokens[path].values.light.slice(1, -1), [...trail, path]);
    return tokens[path].type;
  };
  for (const path of Object.keys(config.aliases)) infer(path);
  return { config, legacy, tokens };
}

function colorMetadata(name) {
  const base = { scope: 'system', partner: 'bg, surface, panel, hover', override: /^(brand(?:-|$)|on-brand$)/.test(name) ? 'tenant-public' : 'none' };
  if (['bg', 'surface', 'panel', 'hover', 'sidebar', 'sidebar-hover'].includes(name)) return { ...base, purpose: name + ' background', use: name.startsWith('sidebar') ? 'Sidebar ground or row hover' : ({ bg: 'Page canvas', surface: 'Inset or secondary surface', panel: 'Cards and floating panels', hover: 'Neutral hover state' })[name], avoid: 'Do not use as text or an essential boundary.', partner: name.startsWith('sidebar') ? 'sidebar-ink (selected rows use on-accent)' : 'ink, muted' };
  if (name === 'ink' || name === 'muted') return { ...base, purpose: name === 'ink' ? 'Primary text and icons' : 'Secondary text, labels and placeholders', use: name === 'ink' ? 'Content, labels and icons on neutral surfaces' : 'Supporting text and placeholders with a visible label', avoid: 'No alpha text; no use on filled teal or bright status fills.' };
  if (name === 'focus') return { ...base, purpose: 'Visible keyboard focus pigment', use: '2px external outline with 2px gap on neutral surroundings', avoid: 'Do not rely on hue alone or place directly on a matching fill; check both adjacent colours.' };
  if (['line', 'outline', 'danger-line'].includes(name)) return { ...base, purpose: name === 'line' ? 'Decorative divider' : name === 'danger-line' ? 'Decorative danger-card border' : 'Legacy neutral control outline', use: name === 'outline' ? 'Only pairings marked PASS; use boundary-strong across hover and pressed surfaces' : 'Nonessential card separators; accompany danger with text/icon', avoid: 'Never the only necessary control, focus or error cue; see contrast matrix.' };
  if (name === 'scrim') return { ...base, purpose: 'Modal backdrop pigment', use: 'Composite over page at named scrim opacity; isolate from dialog content', avoid: 'Text colour or a translucent parent of content.', partner: 'Composite over bg, surface, panel; not a label foreground' };
  if (name.startsWith('on-')) { const fill = name.slice(3); return { ...base, purpose: 'Label on ' + fill + ' fill', use: 'Opaque text/icons on ' + fill + ' default, hover and active fills', avoid: 'Neutral backgrounds, soft fills or another status fill without checking contrast.', partner: `${fill}, ${fill}-hover, ${fill}-active` }; }
  if (name.endsWith('-soft')) return { ...base, purpose: name + ' opaque tint', use: 'Badges, pills and contextual panels', avoid: 'No alpha tints; no danger-soft token exists.', partner: name.replace('-soft', '-ink') + ', ink, muted (verify matrix)' };
  if (name.endsWith('-ink') || name.endsWith('-boundary')) return { ...base, purpose: name.endsWith('-ink') ? 'Readable ' + name + ' foreground' : 'Essential tenant-brand boundary', use: 'Links, icons, thin selected marks on neutral/soft grounds; check exact pairing', avoid: 'Filled-button labels; use on-* instead.', partner: 'bg, surface, panel, hover, corresponding soft fill' };
  const fill = name.replace(/-(hover|active)$/, '');
  return { ...base, purpose: name + ' fill', use: 'Opaque named action/status fill in its stated interaction state', avoid: 'Not a text ink or essential thin state mark; use *-ink, brand-boundary or state-indicator.', partner: 'on-' + (fill === 'sidebar' ? 'accent' : fill) };
}
function localMetadata(group, name) {
  if (group === 'chart') return { purpose: name === 'danger' ? 'Explicit negative chart data' : name === 'edge' ? 'Chart mark edge and line casing' : 'Stable categorical chart fill ' + name, use: name === 'danger' ? 'Bad/negative values only; never categorical order' : name === 'edge' ? '1px filled-mark edge, 4px casing under a 2px line' : 'Hash series identity into series1–5; add dash/shape cues', avoid: 'Never use fill alone as a low-contrast necessary line; never convey data by colour alone.', partner: name === 'edge' ? 'Chart fills and panel' : 'chart.edge; labels use ink on panel', scope: 'chart' };
  if (group === 'loader') return { purpose: 'Box-open loader local ' + name, use: 'Only box-open loader: ' + ({ under: 'underside face', spark: 'spark strokes', seam: 'fold seam' })[name], avoid: 'Not a global text, boundary, status or focus role; logo face colours remain their masters.', partner: 'Local logo face colours; diagnostic matrix is not permission to recolour logo', scope: 'loader-local' };
  return { purpose: 'Aurora badge-card ' + name, use: 'Aurora ID/badge card ' + name + ' slot only (decision 317a)', avoid: 'Not a global surface or status role; header label uses on-accent, ribbon/tail labels use deep ink.', partner: ({ background: 'aurora.text, aurora.label', text: 'aurora.background', label: 'aurora.background', header: 'on-accent', ribbon: 'on-success', tail: 'on-emphasis' })[name], scope: 'aurora-local' };
}
function scaleMetadata(group, key) {
  const use = { spacing: '4px layout grid; choose the smallest step that preserves grouping', radius: 'Shape scale; controls use semantic.radius.control and cards use semantic.radius.card', 'border-width': '1px borders, 2px focus/selected underline, 4px chart casing', breakpoint: 'Minimum viewport widths; 2xl is the inherited Tailwind default, wide is the app 1680px adaptation', size: 'Minimum geometry; allow text growth and safe-area padding', layer: 'Stacking within a common context; nested overlays still require a stack manager', opacity: 'Decoration, shadow or scrim only; text and button disabled states stay opaque' }[group];
  return { purpose: `${group} ${key}`, use, avoid: group === 'opacity' ? 'No alpha text, faded button labels or translucent soft fills.' : 'No arbitrary replacement of the named semantic/component role.' };
}
function typeUse(key) {
  return ({ display: 'Public landing hero', 'display-sub': 'Public/auth display supporting line', heading: 'Public section heading', page: 'One page h1', panel: 'Card/panel title', section: 'Section/list-row title', stat: 'Stat number with tabular numerals', date: 'Date chip numeral with tabular numerals', body: 'Body copy and input text', label: 'Form labels, navigation and meta', button: 'Button label', caption: 'Pills, timestamps and helper text', eyebrow: 'Short uppercase category kicker', accent: 'One short brand phrase' })[key.replace('-mobile', '')] + (key.endsWith('-mobile') ? '; below 640px' : '');
}

export function resolve(model, path, mode, trail = []) {
  if (trail.includes(path)) throw Error('Alias cycle: ' + [...trail, path].join(' -> '));
  const token = model.tokens[path];
  if (!token) throw Error('Unknown reference: ' + path);
  if (!(mode in token.values)) throw Error(`Missing ${mode} pair: ${path}`);
  const walk = value => {
    if (typeof value === 'string' && /^\{[^{}]+\}$/.test(value)) return resolve(model, value.slice(1, -1), mode, [...trail, path]);
    if (Array.isArray(value)) return value.map(walk);
    if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, v]) => [key, walk(v)]));
    return value;
  };
  return walk(token.values[mode]);
}
