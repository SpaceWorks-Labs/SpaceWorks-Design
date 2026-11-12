// Renders every family preview in motion-scenes.mjs (WebP + GIF, light and dark) in headless Edge. Called by make-previews.mjs.
// Technique: load the scene, run its setup (a state change starts the transitions), pause every CSS animation and
// transition with document.getAnimations(), then seek them all to an exact time per frame and screenshot. Scroll-driven
// scenes (pinned hero) instead call their `at(ms)` function per frame.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { MOTION_SCENES, sceneBase } from './motion-scenes.mjs';
import { ROOT } from './lib-previews.mjs';

const THEME = { light: { bg: '#FFF4E8', ink: '#142C2A' }, dark: { bg: '#000000', ink: '#FFF4E8' } };
const LIMIT = 390 * 1024;

export async function motionKit({ withBrowser, setPage, shot, sharp, out, FONT_CSS, only }) {
  const rd = (rel) => readFileSync(join(ROOT, rel), 'utf8').replace(/^﻿/, '');
  const tokens = rd('tokens/tokens.css').replace(/@font-face\s*\{[^}]*\}/g, '');
  const sizes = [];
  await withBrowser(async (send) => {
    await send('Page.enable');
    for (const sc of MOTION_SCENES) {
      if (only && sc.family !== only) continue;
      const css = sc.css.map(rd).join('\n'), js = (sc.js || []).map(rd).join('\n');
      for (const th of ['light', 'dark']) {
        const encode = async (frames, fmt, delay) => {
          const n = frames.length, d = Array(n).fill(delay);
          const meta = await sharp(frames[0]).metadata(), W = meta.width, H = meta.height;
          const raws = await Promise.all(frames.map((f) => sharp(f).ensureAlpha().raw().toBuffer()));
          const opts = fmt === 'webp' ? { quality: 72, effort: 6, delay: d, loop: 0 } : { delay: d, loop: 0, effort: 10, colours: 48, dither: 0 };
          return sharp(Buffer.concat(raws), { raw: { width: W, height: H * n, channels: 4, pageHeight: H } })[fmt](opts).toBuffer();
        };
        let fps = sc.fps || 24, scale = 2, result;
        for (let attempt = 0; attempt < 4; attempt++) {
          await send('Emulation.setDeviceMetricsOverride', { width: sc.w, height: sc.h, deviceScaleFactor: scale, mobile: false });
          await setPage(send, `<!doctype html><html lang="en" class="${th === 'dark' ? 'dark' : ''}"><head><meta charset="utf-8"><style>${FONT_CSS}${tokens}${css}
            html,body{margin:0;${sc.at ? '' : `height:${sc.h}px;`}overflow:hidden;background:${THEME[th].bg};color:${THEME[th].ink};font:15px/1.4 Outfit,sans-serif}</style></head><body>${sc.body}</body></html>`);
          if (js) await send('Runtime.evaluate', { expression: js });
          if (sc.setup) { const r = await send('Runtime.evaluate', { expression: sc.setup }); if (r.exceptionDetails) throw new Error(`${sc.family}/${sc.name} setup: ${JSON.stringify(r.exceptionDetails)}`); }
          const cnt = await send('Runtime.evaluate', { expression: 'document.body.offsetHeight;document.getAnimations().forEach(function(a){a.pause()});document.getAnimations().length', returnByValue: true });
          if (!sc.at && !cnt.result.value) console.warn(`  warning: ${sc.family}/${sc.name} has no running animation`);
          const total = sc.dur + (sc.hold || 0), n = Math.max(2, Math.round((total / 1000) * fps)), frames = [];
          for (let i = 0; i < n; i++) {
            const ms = Math.min(sc.dur, (i * total) / n);
            const expr = sc.at ? `${sc.at}(${ms})` : `document.getAnimations().forEach(function(a){a.currentTime=${ms}});document.body.offsetHeight`;
            await send('Runtime.evaluate', { expression: expr });
            frames.push(await shot(send, sc.w, sc.h));
          }
          const delay = Math.round(total / n);
          const webp = await encode(frames, 'webp', delay), gif = await encode(frames, 'gif', delay);
          result = { webp, gif, n, scale, fps };
          if (webp.length <= LIMIT && gif.length <= LIMIT) break;
          if (attempt % 2 === 0) scale = 1; else fps = Math.max(8, Math.round(fps * 0.7));
        }
        out(`${sceneBase(sc)}-${th}.webp`, result.webp);
        out(`${sceneBase(sc)}-${th}.gif`, result.gif);
        sizes.push(`${sc.family}/${sc.name}-${th}: ${result.n}f @${result.scale}x ${Math.round(result.webp.length / 1024)}K webp, ${Math.round(result.gif.length / 1024)}K gif`);
        console.log('motion-kit', sizes.at(-1));
      }
    }
  });
}
