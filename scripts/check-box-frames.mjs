// Frame check for the box animation (motion/box-open): renders exact frames of the real box-open.css and markup in
// headless Microsoft Edge and fails (exit 1) when a state is broken.
//
//   node scripts/check-box-frames.mjs [--strips <dir>]
//
// Optional locally: it needs Edge (override with EDGE_PATH) and sharp (resolved from site/node_modules), like
// make-previews.mjs. Frames are exact: every animation is paused and rewound to a time (negative animation-delay).
// Checks, in both themes (light on #FFF4E8, dark on #000):
//   rest    the resting frames (hover start and end, opening end, loader hold, no mode) are pixel-identical to the
//           static masters (symbol, symbol-reversed) at 48 px, 1x and 3x;
//   shut    the shut frames of all three cycles match a reference shut box drawn from the same geometry
//           (react/boxOpen/geometry.ts) and, in light, show exactly one orange face;
//   frames  every frame at 60 fps of hov, loop and once, drawn on a magenta page: no transparent hole inside the
//           cube's silhouette (thin cut lines aside; the open box's interior is allowed while it is open), and at
//           most two orange faces in light, exactly one while shut.
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const sharp = createRequire(join(ROOT, 'site', 'package.json'))('sharp');
// BOX_CSS / BOX_MARKUP check another build of the artwork (for example the app's generator output) against the same rules.
const CSS = readFileSync(process.env.BOX_CSS || join(ROOT, 'motion/box-open/box-open.css'), 'utf8');
const MARK = readFileSync(process.env.BOX_MARKUP || join(ROOT, 'motion/box-open/box-open-markup.html'), 'utf8').trim();
const { logoMasters } = await import(pathToFileURL(join(ROOT, 'motion/box-open/react/spaceWorksLogoPaths.ts')));
const G = await import(pathToFileURL(join(ROOT, 'motion/box-open/react/boxOpen/geometry.ts')));
const stripsDir = process.argv.includes('--strips') ? process.argv[process.argv.indexOf('--strips') + 1] : undefined;

const ms = (mode) => Number(new RegExp(`\\.sw-box\\.${mode} \\.f-tl\\{animation:\\S+ (\\d+)ms`).exec(CSS)[1]);
const DUR = { hov: ms('hov'), loop: ms('loop'), once: ms('once') };
const FOLD = 600 / DUR.hov; // FOLD_MS / HOVER_MS in react/boxOpen/css.ts
const ANGLE = { once: G.openAngle, loop: G.loopAngle, hov: (key, t) => G.hoverAngle(key, t, FOLD) };
const OUTLINE = Number(/--sw-ramp-w:([\d.]+)px/.exec(CSS)?.[1] ?? 0);
const GROUND = { light: '#FFF4E8', dark: '#000000' };
const MAGENTA = '#FF00FF';

/* ---------------- Edge over CDP (same machinery as make-previews.mjs) ---------------- */
async function withBrowser(fn) {
  const edge = process.env.EDGE_PATH || 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const port = 9300 + Math.floor(Math.random() * 500);
  const dir = mkdtempSync(join(tmpdir(), 'sw-box-frames-'));
  const proc = spawn(edge, ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${dir}`,
    '--disable-extensions', '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' });
  try {
    let list;
    for (let i = 0; i < 60 && !list; i++) {
      try { list = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); } catch { await new Promise((r) => setTimeout(r, 250)); }
    }
    const ws = new WebSocket(list.find((t) => t.type === 'page').webSocketDebuggerUrl);
    await new Promise((r) => (ws.onopen = r));
    let id = 0; const pending = new Map();
    ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } };
    const send = (method, params = {}) => new Promise((res, rej) => {
      const n = ++id; pending.set(n, (d) => (d.error ? rej(new Error(JSON.stringify(d.error))) : res(d.result)));
      ws.send(JSON.stringify({ id: n, method, params }));
    });
    await send('Page.enable');
    return await fn(send);
  } finally { proc.kill(); await new Promise((r) => setTimeout(r, 800)); try { rmSync(dir, { recursive: true, force: true }); } catch {} }
}

/** One page per scene: `body` at (PAD, PAD), size w x h, captured as raw RGBA. */
function stage(send) {
  let frameId;
  return {
    async open(theme, bg, w, h, scale, body) {
      await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: scale, mobile: false });
      frameId ??= (await send('Page.getFrameTree')).frameTree.frame.id;
      await send('Page.setDocumentContent', { frameId, html: `<!doctype html><html class="${theme === 'dark' ? 'dark' : ''}"><head><meta charset="utf-8"><style>${CSS}
        body{margin:0;background:${bg};width:${w}px;height:${h}px;overflow:hidden;position:relative}</style><style id="t"></style></head><body>${body}</body></html>` });
    },
    async at(time) {
      await send('Runtime.evaluate', { expression: `document.getElementById('t').textContent='.sw-box *,.sw-box{animation-play-state:paused!important;animation-delay:-${time}ms!important}';document.body.offsetHeight;new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))`, awaitPromise: true });
    },
    async shot(w, h, scale) {
      const png = Buffer.from((await send('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: 0, width: w, height: h, scale: 1 } })).data, 'base64');
      const { data, info } = await sharp(png).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
      return { png, data, w: info.width, h: info.height, scale };
    },
  };
}
const box = (cls, x, y, w, h, ground) => `<div class="sw-box ${cls}" style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px${ground ? `;--sw-ground:${ground}` : ''}">${MARK}</div>`;
const svgAt = (x, y, w, h, inner) => `<svg viewBox="0 0 136 126" style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;overflow:visible">${inner}</svg>`;
const paths = (list, attrs = (p) => `fill="${p.fill}"`) => list.map((p) => `<path ${attrs(p)} d="${p.d}"/>`).join('');
const diff = (a, b) => { let n = 0; for (let i = 0; i < a.data.length; i += 4) if (a.data[i] !== b.data[i] || a.data[i + 1] !== b.data[i + 1] || a.data[i + 2] !== b.data[i + 2]) n++; return n; };

/**
 * The shut box drawn statically from the geometry: body, cap (reversed), and the flaps folded at 180 degrees. The
 * animated parts carry will-change so they take the same compositing path as in the running cycle (see rest).
 */
function shutReference(theme) {
  const lt = theme === 'light', master = logoMasters[lt ? 'symbol' : 'symbol-reversed'].paths, flaps = master.slice(-4);
  const fillOf = (key) => flaps[G.FLAP_KEYS.indexOf(key)].fill;
  const outer = (key) => (!lt || key === 'tr' ? fillOf(key) : fillOf('tl'));
  const cap = lt ? '' : `<g style="will-change:opacity">${paths(logoMasters.symbol.paths.slice(0, 2), () => `fill="${flaps[0].fill}"`)}</g>`;
  const lid = G.FLAP_SLOTS.filter((s) => s.layer === undefined || s.layer === G.flapLayer(180)).map(({ key }) =>
    `<path fill="${outer(key)}" stroke="${GROUND[theme]}" stroke-width="${OUTLINE}" stroke-linejoin="round" paint-order="stroke" style="will-change:transform" transform="${G.flapTransform(key, 180)}" d="${flaps[G.FLAP_KEYS.indexOf(key)].d}"/>`).join('');
  return paths(master.slice(0, -4)) + cap + lid;
}

const problems = [], report = {};
const fail = (msg) => { problems.push(msg); };

await withBrowser(async (send) => {
  const s = stage(send);
  /* rest: pixel-identical to the static masters */
  for (const scale of [1, 3]) for (const theme of ['light', 'dark']) {
    const H = 48, W = H * 136 / 126, PAD = 12, VW = Math.ceil(W + 2 * PAD), VH = H + 2 * PAD;
    const master = logoMasters[theme === 'light' ? 'symbol' : 'symbol-reversed'].paths;
    await s.open(theme, GROUND[theme], VW, VH, scale, svgAt(PAD, PAD, W, H, paths(master)));
    const ref = await s.shot(VW, VH, scale);
    // While a transform animation is in effect, Edge rasterises the flaps on its compositing path, which anti-aliases
    // their edges a little differently from a still SVG. The same master with will-change on its flaps takes that
    // path too: a resting frame inside a running cycle must match it exactly; frames after the cycle, the plain one.
    const flapsLast = (p, i) => `fill="${p.fill}"${i >= master.length - 4 ? ' style="will-change:transform"' : ''}`;
    await s.open(theme, GROUND[theme], VW, VH, scale, svgAt(PAD, PAD, W, H, master.map((p, i) => `<path ${flapsLast(p, i)} d="${p.d}"/>`).join('')));
    const refLive = await s.shot(VW, VH, scale);
    const cases = [['hov', 0, true], ['hov', DUR.hov + 5], ['once', DUR.once + 5], ['loop', DUR.loop / 2, true], ['', 0]];
    for (const [mode, time, live] of cases) {
      await s.open(theme, GROUND[theme], VW, VH, scale, box(mode, PAD, PAD, W, H));
      await s.at(time);
      const shot = await s.shot(VW, VH, scale), n = diff(live ? refLive : ref, shot);
      if (n && process.env.BOX_DEBUG) { writeFileSync(join(process.env.BOX_DEBUG, `rest-${theme}-${scale}x-${mode}-${time}.png`), shot.png); writeFileSync(join(process.env.BOX_DEBUG, `rest-${theme}-${scale}x-ref.png`), (live ? refLive : ref).png); }
      report[`rest ${theme} ${scale}x ${mode || 'static'}@${time}ms`] = `${n} px differ${live ? ` (vs the composited master; ${diff(ref, shot)} px vs the still one, edge anti-aliasing only)` : ''}`;
      if (n) fail(`rest ${theme} ${scale}x: ${mode || 'no mode'} at ${time} ms differs from the static master in ${n} px`);
    }
  }
  /* shut: matches the reference drawn from the geometry; one orange face in light */
  const H = 200, W = Math.round(H * 136 / 126), PAD = 30, VW = W + 2 * PAD, VH = H + 2 * PAD, SC = H / 126;
  for (const theme of ['light', 'dark']) {
    await s.open(theme, GROUND[theme], VW, VH, 1, svgAt(PAD, PAD, W, H, shutReference(theme)));
    const ref = await s.shot(VW, VH, 1);
    for (const [mode, time] of [['once', 0], ['loop', DUR.loop * 0.9], ['hov', DUR.hov * FOLD + 40]]) {
      await s.open(theme, GROUND[theme], VW, VH, 1, box(mode, PAD, PAD, W, H));
      await s.at(time);
      const frame = await s.shot(VW, VH, 1), n = diff(ref, frame);
      if (n && process.env.BOX_DEBUG) { writeFileSync(join(process.env.BOX_DEBUG, `shut-${theme}-${mode}.png`), frame.png); writeFileSync(join(process.env.BOX_DEBUG, `shut-${theme}-ref.png`), ref.png); }
      // A CSS-animated matrix and the same matrix as an attribute can still differ by a few anti-aliased edge
      // pixels; allow that noise and nothing more (0.05% of the box, about 20 px).
      report[`shut ${theme} ${mode}`] = `${n} px differ from the reference`;
      if (n > 0.0005 * W * H) fail(`shut ${theme} ${mode}: ${n} px differ from the reference shut box`);
    }
  }
  /* frames: holes and orange faces, every frame at 60 fps */
  const mask = async (list) => {
    await s.open('light', '#000', VW, VH, 1, svgAt(PAD, PAD, W, H, paths(list, () => 'fill="#fff"')));
    const m = await s.shot(VW, VH, 1); const out = new Uint8Array(VW * VH);
    for (let i = 0; i < out.length; i++) out[i] = m.data[i * 4] > 127 ? 1 : 0;
    return out;
  };
  const cube = await mask(logoMasters.symbol.paths.slice(0, 3)), rim = await mask(logoMasters.symbol.paths.slice(2, 3));
  const R = Math.ceil(1.6 * SC); // cut lines up to 2 * R px wide (about 3.2 box units) are design, not holes
  const strip = [];
  // [theme, mode, extra class, ground, artwork shown]: both themes, the forced grounds, and the one-colour layer.
  const runs = [...['light', 'dark'].flatMap((theme) => ['hov', 'loop', 'once'].map((mode) => [theme, mode, '', GROUND[theme], theme])),
    ['light', 'hov', 'g-dark', GROUND.dark, 'dark'], ['dark', 'hov', 'g-light', GROUND.light, 'light'],
    ['light', 'loop', 'mono', GROUND.light, 'mono'], ['dark', 'hov', 'mono', GROUND.dark, 'mono']];
  for (const [theme, mode, extra, ground, art] of runs) {
    const label = `${theme} ${mode}${extra ? ` ${extra}` : ''}`;
    await s.open(theme, MAGENTA, VW, VH, 1, box(`${mode} ${extra}`, PAD, PAD, W, H, ground) + (extra === 'mono' ? '<style>.sw-box{color:#142C2A}</style>' : ''));
    const n = Math.round(DUR[mode] / 1000 * 60);
    let worstHole = 0, maxOrange = 0;
    for (let i = 0; i <= n; i++) {
      const t = i / n, time = i === n ? DUR[mode] + 5 : t * DUR[mode];
      await s.at(time);
      const f = await s.shot(VW, VH, 1);
      if (stripsDir && i % 3 === 0) strip.push({ name: label.replaceAll(' ', '-'), png: f.png, time });
      const shut = G.FLAP_KEYS.every((key) => ANGLE[mode](key, Math.min(t, 1)) === 180);
      // Transparent (magenta) pixels inside the cube silhouette, eroded so thin cut lines drop out.
      const hole = new Uint8Array(VW * VH);
      for (let p = 0; p < hole.length; p++) {
        const [r, g, b] = [f.data[p * 4], f.data[p * 4 + 1], f.data[p * 4 + 2]];
        hole[p] = cube[p] && (shut || !rim[p]) && r > 200 && g < 70 && b > 200 ? 1 : 0;
      }
      let holes = 0;
      for (let y = R; y < VH - R; y++) for (let x = R; x < VW - R; x++) {
        if (!hole[y * VW + x]) continue;
        let all = true;
        for (let dy = -R; dy <= R && all; dy++) for (let dx = -R; dx <= R; dx++) if (!hole[(y + dy) * VW + x + dx]) { all = false; break; }
        if (all) holes++;
      }
      worstHole = Math.max(worstHole, holes);
      if (holes) fail(`frames ${label} at ${Math.round(time)} ms: ${holes} px of hole inside the box`);
      if (art === 'light') {
        const faces = orangeFaces(f.data, VW, VH, 0.002 * W * H);
        maxOrange = Math.max(maxOrange, faces);
        if (shut && faces !== 1) fail(`frames ${label} at ${Math.round(time)} ms: shut with ${faces} orange faces (want 1)`);
        if (faces > 2) fail(`frames ${label} at ${Math.round(time)} ms: ${faces} orange faces`);
      }
    }
    report[`frames ${label}`] = `${n + 1} frames, worst hole ${worstHole} px${art === 'light' ? `, at most ${maxOrange} orange faces` : ''}`;
  }
  if (stripsDir) await writeStrips(strip, VW, VH);
});

/** Orange (#FF7447) connected regions of at least `min` px. */
function orangeFaces(data, w, h, min) {
  const on = new Uint8Array(w * h);
  for (let p = 0; p < on.length; p++) {
    const [r, g, b] = [data[p * 4], data[p * 4 + 1], data[p * 4 + 2]];
    on[p] = Math.abs(r - 255) < 30 && Math.abs(g - 116) < 35 && Math.abs(b - 71) < 35 ? 1 : 0;
  }
  let faces = 0;
  for (let p = 0; p < on.length; p++) {
    if (on[p] !== 1) continue;
    let size = 0; const stack = [p]; on[p] = 2;
    while (stack.length) {
      const q = stack.pop(); size++;
      for (const nb of [q - 1, q + 1, q - w, q + w]) if (nb >= 0 && nb < on.length && on[nb] === 1 && Math.abs((nb % w) - (q % w)) <= 1) { on[nb] = 2; stack.push(nb); }
    }
    if (size >= min) faces++;
  }
  return faces;
}

async function writeStrips(frames, w, h) {
  mkdirSync(stripsDir, { recursive: true });
  const groups = Map.groupBy(frames, (f) => f.name), cols = 12, cw = Math.round(w / 2), ch = Math.round(h / 2);
  for (const [name, list] of groups) {
    const comps = await Promise.all(list.map(async (f, i) => ({ input: await sharp(f.png).resize(cw, ch).png().toBuffer(), left: (i % cols) * cw, top: Math.floor(i / cols) * ch })));
    await sharp({ create: { width: cols * cw, height: Math.ceil(list.length / cols) * ch, channels: 3, background: '#808080' } }).composite(comps).png().toFile(join(stripsDir, `${name}.png`));
  }
}

for (const [k, v] of Object.entries(report)) console.log(`${k.padEnd(34)} ${v}`);
if (problems.length) {
  console.error(`\nBox frames are broken (${problems.length}):\n - ` + problems.slice(0, 40).join('\n - '));
  process.exit(1);
}
console.log('\nBox frames are correct: rest = static logo, shut = one solid box with one orange face, no holes.');
