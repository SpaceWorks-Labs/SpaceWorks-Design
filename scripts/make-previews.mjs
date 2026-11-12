// Regenerates every preview image from the CURRENT sources, then writes scripts/previews.lock.json.
//   node scripts/make-previews.mjs [palette|motion|theme-reveal]
// Needs: sharp (resolved from site/node_modules), Microsoft Edge (override with EDGE_PATH).
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { LOCK, ROOT, SOURCES, hashSources } from './lib-previews.mjs';

const sharp = createRequire(join(ROOT, 'site', 'package.json'))('sharp');
const rd = (rel) => readFileSync(join(ROOT, rel), 'utf8');
const tokens = JSON.parse(rd('tokens/tokens.json'));
const only = process.argv[2];
const FONT = readFileSync(join(ROOT, 'fonts', 'Outfit-Variable.woff2')).toString('base64');
const FONT_CSS = `@font-face{font-family:Outfit;font-weight:100 900;src:url(data:font/woff2;base64,${FONT}) format("woff2")}`;
const out = (rel, data) => { mkdirSync(join(ROOT, rel, '..'), { recursive: true }); writeFileSync(join(ROOT, rel), data); };

/* ---------------- Edge over CDP ---------------- */
async function withBrowser(fn) {
  const edge = process.env.EDGE_PATH || 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const port = 9300 + Math.floor(Math.random() * 500);
  const dir = mkdtempSync(join(tmpdir(), 'sw-previews-'));
  const proc = spawn(edge, ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${dir}`,
    '--disable-extensions', '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' });
  try {
    let list;
    for (let i = 0; i < 60 && !list; i++) {
      try { list = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); } catch { await new Promise((r) => setTimeout(r, 250)); }
    }
    const target = list.find((t) => t.type === 'page');
    const ws = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise((r) => (ws.onopen = r));
    let id = 0; const pending = new Map();
    ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } };
    const send = (method, params = {}) => new Promise((res, rej) => {
      const n = ++id; pending.set(n, (d) => (d.error ? rej(new Error(JSON.stringify(d.error))) : res(d.result)));
      ws.send(JSON.stringify({ id: n, method, params }));
    });
    return await fn(send);
  } finally { proc.kill(); await new Promise((r) => setTimeout(r, 800)); try { rmSync(dir, { recursive: true, force: true }); } catch {} }
}
async function setPage(send, html) {
  const { frameTree } = await send('Page.getFrameTree');
  await send('Page.setDocumentContent', { frameId: frameTree.frame.id, html });
  await send('Runtime.evaluate', { expression: 'document.fonts.ready', awaitPromise: true });
}
const shot = async (send, w, h) => Buffer.from((await send('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: 0, width: w, height: h, scale: 1 } })).data, 'base64');

/* ---------------- Palette ---------------- */
const GROUPS = [
  ['Surfaces and text', ['bg', 'surface', 'panel', 'hover', 'line', 'outline', 'ink', 'muted', 'focus']],
  ['Accent', ['accent', 'accent-hover', 'accent-active', 'on-accent', 'accent-soft', 'accent-ink']],
  ['Brand', ['brand', 'brand-hover', 'brand-active', 'on-brand', 'brand-soft', 'brand-ink', 'brand-boundary']],
  ['Emphasis', ['emphasis', 'emphasis-hover', 'emphasis-active', 'on-emphasis', 'emphasis-soft']],
  ['Success', ['success', 'success-hover', 'success-active', 'on-success', 'success-soft', 'success-ink']],
  ['Warn', ['warn', 'warn-hover', 'warn-active', 'on-warn', 'warn-soft', 'warn-ink']],
  ['Info', ['info', 'info-hover', 'info-active', 'on-info', 'info-soft', 'info-ink']],
  ['Danger', ['danger', 'danger-hover', 'danger-active', 'on-danger', 'danger-line']],
  ['Sidebar', ['sidebar', 'sidebar-hover', 'sidebar-active']],
  ['Scrim', ['scrim']],
  ['Chart series', tokens.chart.order.map((k) => `chart:${k}`)],
  ['Loader', ['under', 'spark', 'seam'].map((k) => `loader:${k}`)],
];
const COLS = 3, CW = 330, RH = 54, PAD = 36, W = PAD * 2 + COLS * CW;

function panel(theme, x0) {
  const t = tokens[theme], ink = t.ink;
  const val = (k) => (k.startsWith('chart:') ? tokens.chart[theme][k.slice(6)] : k.startsWith('loader:') ? tokens.loader[theme][k.slice(7)] : t[k]);
  let y = PAD, s = '';
  s += `<text x="${x0 + PAD}" y="${y + 26}" font-size="30" font-weight="700" fill="${ink}">Space Works palette, ${theme}</text>`;
  y += 56;
  for (const [title, keys] of GROUPS) {
    s += `<text x="${x0 + PAD}" y="${y + 14}" font-size="15" font-weight="600" fill="${t.muted}" letter-spacing="1.2">${title.toUpperCase()}</text>`;
    y += 26;
    keys.forEach((k, i) => {
      const cx = x0 + PAD + (i % COLS) * CW, cy = y + Math.floor(i / COLS) * RH;
      const hex = val(k).toUpperCase(), label = k.includes(':') ? k.split(':')[1] : k;
      s += `<rect x="${cx}" y="${cy}" width="64" height="40" rx="8" fill="${val(k)}" stroke="${t.outline}" stroke-opacity=".55"/>`;
      s += `<text x="${cx + 76}" y="${cy + 17}" font-size="15" font-weight="500" fill="${ink}">${label}</text>`;
      s += `<text x="${cx + 76}" y="${cy + 35}" font-size="14" fill="${t.muted}">${hex}</text>`;
    });
    y += Math.ceil(keys.length / COLS) * RH + 14;
  }
  return { s, h: y + PAD, bg: t.bg };
}
function paletteSvg(themes) {
  const ps = themes.map((th, i) => panel(th, i * W)), h = Math.max(...ps.map((p) => p.h));
  const bgs = ps.map((p, i) => `<rect x="${i * W}" y="0" width="${W}" height="${h}" fill="${p.bg}"/>`).join('');
  return { h, svg: `<svg xmlns="http://www.w3.org/2000/svg" width="${W * themes.length}" height="${h}" viewBox="0 0 ${W * themes.length} ${h}" font-family="Outfit, sans-serif"><defs><style>${FONT_CSS}</style></defs>${bgs}${ps.map((p) => p.s).join('')}</svg>` };
}
async function palettes() {
  // Edge rasterises the SVG so the real Outfit face (embedded as base64) is used; sharp encodes the PNG.
  const jobs = [['palette-light', ['light']], ['palette-dark', ['dark']], ['palette-light-vs-dark', ['light', 'dark']]];
  await withBrowser(async (send) => {
    await send('Page.enable');
    for (const [name, themes] of jobs) {
      const { svg, h } = paletteSvg(themes), w = W * themes.length;
      out(`tokens/previews/${name}.svg`, svg);
      await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 2, mobile: false });
      await setPage(send, `<!doctype html><body style="margin:0">${svg}</body>`);
      out(`tokens/previews/${name}.png`, await sharp(await shot(send, w, h)).png({ palette: true, quality: 90, effort: 10 }).toBuffer());
      console.log('palette', name);
    }
  });
}

/* ---------------- Motion ---------------- */
const CSS = rd('motion/box-open/box-open.css'), MARK = rd('motion/box-open/box-open-markup.html').trim();
const BOX = (cls, w, h) => `<div class="sw-box ${cls}" style="width:${w}px;height:${h}px">${MARK}</div>`;
const THEME = { light: { bg: '#FFF4E8', ink: '#142C2A', btn: '#006E63', onBtn: '#FFF4E8' }, dark: { bg: '#000000', ink: '#FFF4E8', btn: '#80B1A6', onBtn: '#000000' } };
const SCENES = (th) => ({
  loader: { dur: 4400, w: 130, h: 108, body: `<div style="display:grid;place-items:center;width:130px;height:108px">${BOX('loop', 78, 72)}</div>` },
  'inline-row': { dur: 4400, w: 230, h: 52, body: `<div style="display:flex;gap:10px;align-items:center;height:52px;padding:0 16px;font-size:16px">${BOX('loop', 22, 20)}<span>Loading members</span></div>` },
  'button-saving': { dur: 4400, w: 170, h: 64, body: `<div style="display:grid;place-items:center;width:170px;height:64px"><button style="font:500 16px Outfit;padding:9px 20px;border-radius:999px;border:0;background:${THEME[th].btn};color:${THEME[th].onBtn};display:inline-flex;gap:8px;align-items:center">${BOX('loop mono', 19, 18)}Saving</button></div>` },
  'logo-hover': { dur: 2200, w: 150, h: 130, body: `<div style="display:grid;place-items:center;width:150px;height:130px">${BOX('hov', 117, 108)}</div>` },
});
const FPS = 30;

async function encode(frames, dur, fmt) {
  const n = frames.length, delay = Array(n).fill(Math.round(dur / n));
  const meta = await sharp(frames[0]).metadata(), w = meta.width, h = meta.height;
  const raws = await Promise.all(frames.map((f) => sharp(f).ensureAlpha().raw().toBuffer()));
  const opts = fmt === 'webp' ? { quality: 82, effort: 6, delay, loop: 0 } : { delay, loop: 0, effort: 10, colours: 64, dither: 0 };
  return sharp(Buffer.concat(raws), { raw: { width: w, height: h * n, channels: 4, pageHeight: h } })[fmt](opts).toBuffer();
}

async function motion() {
  await withBrowser(async (send) => {
    await send('Page.enable');
    for (const th of ['light', 'dark']) {
      for (const [name, sc] of Object.entries(SCENES(th))) {
        await send('Emulation.setDeviceMetricsOverride', { width: sc.w, height: sc.h, deviceScaleFactor: 2, mobile: false });
        await setPage(send, `<!doctype html><html class="${th === 'dark' ? 'dark' : ''}"><head><meta charset="utf-8"><style>${FONT_CSS}${CSS}
          body{margin:0;background:${THEME[th].bg};color:${THEME[th].ink};font-family:Outfit,sans-serif}</style><style id="t"></style></head><body>${sc.body}</body></html>`);
        const n = Math.round((sc.dur / 1000) * FPS), frames = [];
        for (let i = 0; i < n; i++) {
          // Same trick as the app's boxOpen.sync.test.ts: pause, then rewind every animation to an exact time.
          const ms = (i * sc.dur) / n;
          await send('Runtime.evaluate', { expression: `document.getElementById('t').textContent='.sw-box *,.sw-box{animation-play-state:paused!important;animation-delay:-${ms}ms!important}';document.body.offsetHeight` });
          frames.push(await shot(send, sc.w, sc.h));
        }
        const base = `motion/box-open/previews/${name}-${th}`;
        out(`${base}.webp`, await encode(frames, sc.dur, 'webp'));
        out(`${base}.gif`, await encode(frames, sc.dur, 'gif'));
        console.log('motion', name, th, n, 'frames');
        if (name === 'logo-hover') { // hov starts and ends on the resting open logo
          out(`motion/box-open/previews/logo-open-${th}.png`, await sharp(frames[0]).png({ palette: true, quality: 90, effort: 10 }).toBuffer());
        }
      }
    }
  });
}

/* ---------------- Theme reveal ---------------- */
// The same light and dark pixels the real View Transition shows: screenshot motion/theme-reveal/demo.html in each
// theme, then composite the dark shot over the light one through the reveal's own circle (feathered, 160 px at the
// page's 1x scale), growing from the toggle with the app's 720 ms cubic-bezier(0.45, 0, 0.2, 1).
const bezier = (x1, y1, x2, y2) => (x) => { // CSS cubic-bezier solved by bisection
  const at = (t, a, b) => 3 * a * (1 - t) ** 2 * t + 3 * b * (1 - t) * t * t + t ** 3;
  let lo = 0, hi = 1;
  for (let i = 0; i < 40; i++) { const mid = (lo + hi) / 2; if (at(mid, x1, x2) < x) lo = mid; else hi = mid; }
  return at((lo + hi) / 2, y1, y2);
};
async function themeReveal() {
  const W = 480, H = 270, FEATHER = 160, REVEAL = 720, ease = bezier(0.45, 0, 0.2, 1);
  const tokensCss = rd('tokens/tokens.css').replace(/@font-face\s*\{[^}]*\}/g, '');
  const page = rd('motion/theme-reveal/demo.html')
    .replace(/<link rel="stylesheet"[^>]*>/g, '').replace(/<script[\s\S]*?<\/script>/g, '')
    .replace('</head>', `<style>${FONT_CSS}${tokensCss}</style></head>`);
  const shots = {};
  await withBrowser(async (send) => {
    await send('Page.enable');
    await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: false });
    await setPage(send, page);
    shots.light = await shot(send, W, H);
    await send('Runtime.evaluate', { expression: "document.documentElement.classList.add('dark');document.body.offsetHeight" });
    shots.dark = await shot(send, W, H);
    const box = (await send('Runtime.evaluate', { expression: 'JSON.stringify(document.getElementById("toggle").getBoundingClientRect())', returnByValue: true })).result.value;
    const r = JSON.parse(box); shots.origin = { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  });
  const { x, y } = shots.origin, FULL = Math.hypot(Math.max(x, W - x), Math.max(y, H - y)) + FEATHER;
  const frame = async (from, to, p) => {
    const d = ease(p) * FULL, inner = Math.max(0, d - FEATHER) / Math.max(d, 1);
    const mask = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><defs><radialGradient id="g" gradientUnits="userSpaceOnUse" cx="${x}" cy="${y}" r="${Math.max(d, 0.01)}"><stop offset="${inner}" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs><rect width="${W}" height="${H}" fill="url(#g)"/></svg>`;
    const top = await sharp(shots[to]).ensureAlpha().composite([{ input: Buffer.from(mask), blend: 'dest-in' }]).png().toBuffer();
    return sharp(shots[from]).composite([{ input: top }]).png().toBuffer();
  };
  const STEPS = 22, frames = [], delays = [];
  const hold = (name, ms) => { frames.push(shots[name]); delays.push(ms); };
  const reveal = async (from, to) => { for (let i = 1; i <= STEPS; i++) { frames.push(await frame(from, to, i / STEPS)); delays.push(Math.round(REVEAL / STEPS)); } };
  hold('light', 900); await reveal('light', 'dark'); hold('dark', 1100); await reveal('dark', 'light');
  const enc = async (fmt) => {
    const raws = await Promise.all(frames.map((f) => sharp(f).ensureAlpha().raw().toBuffer()));
    const opts = fmt === 'webp' ? { quality: 78, effort: 6, delay: delays, loop: 0 } : { delay: delays, loop: 0, effort: 10, colours: 64, dither: 0 };
    return sharp(Buffer.concat(raws), { raw: { width: W, height: H * frames.length, channels: 4, pageHeight: H } })[fmt](opts).toBuffer();
  };
  const base = 'motion/theme-reveal/previews/theme-reveal';
  for (const fmt of ['webp', 'gif']) { const buf = await enc(fmt); out(`${base}.${fmt}`, buf); console.log('theme-reveal', fmt, Math.round(buf.length / 1024), 'KB'); }
}

if (!only || only === 'palette') await palettes();
if (!only || only === 'motion') await motion();
if (!only || only === 'theme-reveal') await themeReveal();
if (only === 'theme-reveal') { // refresh only this group's hashes; the other previews were not regenerated
  const lock = JSON.parse(readFileSync(LOCK, 'utf8')), now = hashSources();
  for (const [k, g] of Object.entries(SOURCES)) if (g === 'theme-reveal') lock.sources[k] = now[k];
  writeFileSync(LOCK, JSON.stringify(lock, null, 2) + '\n');
  console.log('lock updated (theme-reveal)');
}
if (!only) {
  writeFileSync(LOCK, JSON.stringify({ note: 'Written by scripts/make-previews.mjs; verified by scripts/check-previews.mjs', sources: hashSources() }, null, 2) + '\n');
  console.log('lock written');
}
