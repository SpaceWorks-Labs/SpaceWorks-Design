// Raster-only checks complement the default Edge cascade/compositor verification.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
export const FRAME_TIMES = {
  once: [0, 208, 668, 816, 1284, 1360, 1472, 1605],
  hov: [600, 808, 1268, 1416, 1884, 1960, 2072, 2205],
  loop: [0, 206, 661, 808, 1266, 1346, 1458, 2200],
};
export const FRAME_LABELS = ['Closed', 'Orange A lifting', 'Orange pair open', 'Green rising', 'Green out', 'Settle', 'Settle', 'Rest'];
const sha = s => createHash('sha256').update(s.replace(/\r\n/g, '\n')).digest('hex');
const attr = (p, name) => new RegExp('\\b' + name + '="([^"]*)"').exec(p)?.[1];
const paths = text => [...text.matchAll(/<path\b[^>]*\/>/g)].map(([p]) => ({ d: attr(p, 'd'), fill: attr(p, 'fill'), cls: attr(p, 'class'), alt: /--alt:([^";]+)/.exec(p)?.[1] }));
const tag = (p, fill, attrs = '') => '<path fill="' + fill + '" d="' + p.d + '" ' + attrs + '/>';
export async function rasterTools(root, css, markup) {
  const sharp = createRequire(join(root, 'site/package.json'))('sharp');
  const { logoMasters } = await import(pathToFileURL(join(root, 'motion/box-open/react/spaceWorksLogoPaths.ts')));
  const G = await import(pathToFileURL(join(root, 'motion/box-open/react/boxOpen/geometry.ts')));
  const V = await import(pathToFileURL(join(root, 'motion/box-open/react/boxOpen/v200Geometry.ts')));
  const frames = new Map([...css.matchAll(/@keyframes ([\w-]+)\{((?:[\d.]+%\{[^}]*\})+)\}/g)]
    .map(([, name, block]) => [name, [...block.matchAll(/([\d.]+)%\{([^}]*)\}/g)].map(([, t, body]) => ({ t: +t, body }))]));
  const row = (name, t) => {
    assert(frames.has(name), 'Missing emitted keyframes ' + name);
    return frames.get(name).filter(r => r.t <= t * 100 + .005001).at(-1).body;
  };
  const dur = { once: 1600, hov: 2200, loop: 4400 }, ns = { once: 96, hov: 132, loop: 160 };
  const svgs = [...markup.matchAll(/<svg[\s\S]*?<\/svg>/g)].map(([svg]) => svg);
  function scene(mode, time, art, ground = '#ff00ff') {
    const dark = art === 'dark' || art === 'forced-dark', mono = art === 'mono', forced = art.startsWith('forced');
    const geom = art === 'light' ? G : V;
    const name = (art === 'light' ? 'sw-box412' : 'sw-box') + ({ once: '', hov: 'h', loop: 'l' }[mode]);
    const t = Math.min(1, time / dur[mode]);
    const grid = Math.min(ns[mode], Math.floor(t * ns[mode] + 1e-5)) / ns[mode];
    const angle = mode === 'once' ? geom.openAngle : mode === 'loop' ? geom.loopAngle : (k, p) => geom.hoverAngle(k, p, 600 / 2200);
    const angles = Object.fromEntries(G.FLAP_KEYS.map(k => [k, angle(k, grid)]));
    const svg = svgs[art === 'light' ? 2 : dark ? 1 : 0];
    const cap = /<g class="p">([\s\S]*?)<\/g>/.exec(svg)?.[1] ?? '';
    const body = paths(svg.replace(/<g[\s\S]*?<\/g>/g, '').split('<polygon')[0]);
    let content = body.map((p, i) => tag(p, mono || forced ? '#142c2a' : p.fill,
      mono && i < 2 ? 'opacity="' + (i === 0 ? .45 : .7) + '"' : '')).join('');
    if (cap && row(name + '-p', t) === 'opacity:1') content += paths(cap).map(p => tag(p, forced ? '#142c2a' : p.fill)).join('');
    content += '<polygon points="67.5,17.2 111.5,47.8 67.5,78.9" fill="' + (dark ? '#fff4e8' : '#354845') + '" opacity="' + (+row(name + '-w', t).split(':')[1] * (dark ? .14 : mono ? .25 : 1)) + '"/>';
    for (const p of paths(svg).filter(p => p.cls?.startsWith('f '))) {
      const key = /f-(\w+)/.exec(p.cls)[1], layer = / z([01])/.exec(p.cls)?.[1];
      if (layer !== undefined && row(name + '-tr-z' + layer, t) === 'opacity:0') continue;
      const state = row(name + '-' + key, t);
      if (art === 'light') assert(state.includes(';fill:var(--c);'), 'Coloured flap changes fill: ' + state);
      const matrix = /transform:([^;]+)/.exec(state)[1];
      assert.equal(matrix, geom.flapTransform(key, angles[key]), mode + ' ' + art + ' ' + key + ' at ' + time + ' emitted matrix');
      let fill = p.fill;
      if (mono || forced) fill = '#142c2a';
      else if (dark) {
        const face = V.flapFace(key, angles[key]);
        const shade = face.shade;
        if (shade) {
          const cream = [255, 244, 232], under = [102, 98, 93];
          fill = '#' + cream.map((v, i) => Math.round(v * (1 - shade) + under[i] * shade).toString(16).padStart(2, '0')).join('');
        }
      }
      const factors = [...state.matchAll(/([\d.]+) \* var/g)].map(m => +m[1]);
      const width = mono ? 0 : 3.8 * (dark ? factors[0] ?? 0 : factors[1] ?? 0);
      const attrs = matrix === 'none' ? '' : 'transform="' + matrix + '"';
      if (width) content += tag(p, 'none', attrs + ' stroke="' + (dark ? '#000' : '#fff4e8') + '" stroke-width="' + width + '" stroke-linejoin="round"');
      content += tag(p, fill, attrs);
    }
    return { angles, svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-20 -30 176 186" width="352" height="372"><rect x="-20" y="-30" width="176" height="186" fill="' + ground + '"/>' + content + '</svg>' };
  }
  const render = svg => sharp(Buffer.from(svg)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return { sharp, G, V, row, scene, render, dur, ns, svgs, logoMasters };
}
export function checkBaseline(css, markup, G) {
  const svgs = [...markup.matchAll(/<svg[\s\S]*?<\/svg>/g)].map(([svg]) => svg);
  const prefix = css.slice(0, css.indexOf('.sw-box.once .colour .f-tl')).trimEnd();
  const suffix = css.slice(css.indexOf('.sw-box.mono{')).replace(/\r\n/g, '\n');
  assert.equal(sha(prefix + '\n' + suffix), '1c746ec8c1892f2b7748b1de8e4dd4d8fc2f69c11c95b82751b68b71537d2a57');
  assert.equal(sha(svgs[1]), '3b4621988a5cb3db25e6ddb488caacd623f27ec48259a644a5232c2d01d78a34');
  assert(!svgs[1].match(/#FF7447|#006E63/i)); assert(!svgs[2].match(/class="[akr]"|class="x"/));
  for (const [t, key] of [[.13, 'tr'], [.32, 'bl'], [.51, 'tl'], [.7, 'br']]) {
    assert(G.openAngle(key, t) > 0 && G.openAngle(key, t) < 180);
    for (const k of ['tr', 'bl', 'tl', 'br'].slice(['tr', 'bl', 'tl', 'br'].indexOf(key) + 1)) assert.equal(G.openAngle(k, t), 180);
  }
  assert.equal(sha(svgs.slice(0, 2).join('')), '2f9a0590d907b6849f46188ae5e9d7829983a8fd820294a37bd8eb499204ecf4');
}
export async function checkRaster(root, css, markup) {
  const T = await rasterTools(root, css, markup);
  checkBaseline(css, markup, T.G);
  const near = (d, p, rgb) => rgb.every((v, c) => Math.abs(d[p * 4 + c] - v) < 12);
  const white = paths => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-20 -30 176 186" width="352" height="372"><rect x="-20" y="-30" width="176" height="186" fill="#000"/>' + paths.map(p => tag(p, '#fff')).join('') + '</svg>';
  const cube = (await T.render(white(T.logoMasters.symbol.paths.slice(0, 3)))).data;
  const rim = (await T.render(white(T.logoMasters.symbol.paths.slice(2, 3)))).data;
  let count = 0;
  for (const art of ['light', 'dark', 'mono', 'forced-light', 'forced-dark']) for (const mode of ['once', 'hov', 'loop']) {
    for (let i = 0; i <= T.ns[mode]; i++) {
      const current = T.scene(mode, i / T.ns[mode] * T.dur[mode], art), { data, info } = await T.render(current.svg);
      const shut = Object.values(current.angles).every(a => a === 180);
      let brand = 0, lidGreen = 0, holes = 0;
      for (let p = 0; p < info.width * info.height; p++) {
        if (near(data, p, [255, 116, 71]) || near(data, p, [0, 110, 99])) brand++;
        if (rim[p * 4] && near(data, p, [0, 110, 99])) lidGreen++;
        if (!cube[p * 4] || (!shut && rim[p * 4]) || !near(data, p, [255, 0, 255])) continue;
        const x = p % info.width, y = Math.floor(p / info.width), r = 4;
        if (x < r || y < r || x >= info.width - r || y >= info.height - r) continue;
        let all = true;
        for (let dy = -r; dy <= r && all; dy++) for (let dx = -r; dx <= r; dx++) if (!near(data, p + dy * info.width + dx, [255, 0, 255])) { all = false; break; }
        if (all) holes++;
      }
      assert.equal(holes, 0, art + ' ' + mode + ' frame ' + i + ': body holes');
      if (art !== 'light') assert.equal(brand, 0, art + ' ' + mode + ' frame ' + i + ': forbidden colour');
      if (art === 'light' && shut) {
        assert.equal(lidGreen, 0, mode + ': green on closed lid');
        for (const [x, y] of [[85, 36], [50, 58]]) assert(near(data, (y + 30) * 2 * info.width + (x + 20) * 2, [255, 116, 71]));
      }
      count++;
    }
    const dark = art === 'dark' || art === 'forced-dark', mono = art === 'mono', forced = art.startsWith('forced');
    const master = T.logoMasters[dark ? 'symbol-reversed' : 'symbol'].paths;
    const rest = await T.render(T.scene(mode, mode === 'loop' ? 2200 : T.dur[mode], art, '#000').svg);
    const reference = white([]).replace('</svg>', master.map((p, i) => tag(p, mono || forced ? '#142c2a' : p.fill,
      mono && i < 2 ? 'opacity="' + (i === 0 ? .45 : .7) + '"' : '')).join('') + '</svg>');
    assert.deepEqual(rest.data, (await T.render(reference)).data, art + ' ' + mode + ': rest differs from static logo');
  }
  console.log('Raster PASS: ' + count + ' emitted step frames; 0 body-hole pixels; 15 exact static-rest rasters; v2.0.0 CSS and reversed SVG SHA-256 exact.');
  console.log('Raster mode checks paths and emitted matrices; the default Edge run additionally checks the CSS cascade and compositor.');
}

