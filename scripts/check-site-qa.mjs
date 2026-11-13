// Site QA sweep over every built page (decision 432, lane DS-QA). Run after `cd site && npm run build`:
//   node scripts/check-site-qa.mjs [--out <dir>] [--widths 390,768,1280,1680] [--only <path-substring>]
// Uses the site's Edge/CDP harness (site/scripts/integration-browser.mjs). Exit 1 on any finding.
// Classes checked (each one a bug class found in the v2.1.1 QA; see docs/site-qa.md):
//   fixed     — anything on a fixed surface (a themed demo card .sw-scope, a swatch, a page image) renders the same in
//               both page themes; marks keyed to the card, never to <html>.
//   contrast  — text vs its real background >= 4.5:1 (3:1 at 24px / 18.66px bold), focus indicators >= 3:1.
//   overflow  — no horizontal page scroll; nothing sticks out of the viewport unless inside a scroll container.
//   images    — no broken image, every <img> has alt, no upscaled raster, no squashed aspect ratio.
//   targets   — interactive targets >= 24x24 CSS px (inline text links and spaced targets excepted, WCAG 2.5.8).
//   names     — every button/link/form control has an accessible name; no duplicate ids; aria refs resolve.
//   outline   — one <main>, one <h1>, no skipped heading levels, header + nav landmarks.
//   focus     — every keyboard-focusable visible control shows a focus indicator.
//   motion    — under prefers-reduced-motion nothing loops (CSS/WAAPI), no autoplaying video.
import { mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
const ROOT = resolve(import.meta.dirname, '..');
const arg = (name, fallback) => { const i = process.argv.indexOf(name); return i > 0 ? process.argv[i + 1] : fallback; };
const out = resolve(arg('--out', join(ROOT, 'site/verification/qa')));
const widths = arg('--widths', '390,768,1280,1680').split(',').map(Number);
const only = arg('--only', '');
const { browser, BASE, delay } = await import(pathToFileURL(process.env.DS_BROWSER_HELPER || join(ROOT, 'site/scripts/integration-browser.mjs')).href);
const dist = join(ROOT, 'site/dist');
const pages = [];
// Site pages (…/index.html) and the standalone demo pages the site embeds (kit/motion/*/demo.html, the component gallery).
(function walk(dir) { for (const n of readdirSync(dir)) { const p = join(dir, n); const rel = BASE + p.slice(dist.length).replace(/\\/g, '/');
  if (statSync(p).isDirectory()) { if (n !== '_astro' && n !== 'pagefind') walk(p); }
  else if (n === 'index.html' && !rel.includes('/kit/examples/')) pages.push(rel.slice(0, -'index.html'.length));
  else if (/(^|\/)(demo|component-gallery)\.html$/.test(rel) && !rel.includes('/kit/examples/')) pages.push(rel); } })(dist);
const targets = pages.filter(p => only.split('|').some(o => p.includes(o)));
mkdirSync(out, { recursive: true });

// ---- in-page probes (serialised into the page) ----
function probe(opts) {
  const W = innerWidth, flags = [];
  // Freeze every animation at its start so both page themes are compared at the same frame.
  if (opts.fixed) document.getAnimations().forEach(a => { try { a.pause(); a.currentTime = 0; } catch {} });
  const add = (cls, el, text) => flags.push({ cls, text, at: el ? where(el) : '' });
  function where(el) {
    const parts = []; for (let e = el; e && e !== document.body && parts.length < 4; e = e.parentElement) {
      parts.unshift(e.tagName.toLowerCase() + (e.id ? '#' + e.id : '') + (typeof e.className === 'string' && e.className.trim() ? '.' + e.className.trim().split(/\s+/).slice(0, 2).join('.') : ''));
    } return parts.join('>');
  }
  const visible = el => { if (!el.getClientRects().length) return false; const s = getComputedStyle(el); return s.visibility !== 'hidden' && s.display !== 'none' && !el.closest('[hidden],[inert],[aria-hidden="true"]'); };
  const srOnly = el => { for (let e = el; e; e = e.parentElement) { const s = getComputedStyle(e); if ((s.position === 'absolute' || s.position === 'fixed') && (s.clip.startsWith('rect(0') || s.clipPath === 'inset(50%)' || (parseFloat(s.width) <= 1 && parseFloat(s.height) <= 1))) return true; } return false; };
  const parse = c => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number); return [p[0], p[1], p[2], p.length > 3 ? p[3] : 1]; };
  const lum = ([r, g, b]) => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
  const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  const over = (top, under) => { const a = top[3]; return [top[0] * a + under[0] * (1 - a), top[1] * a + under[1] * (1 - a), top[2] * a + under[2] * (1 - a), 1]; };
  // Effective background: composite every ancestor's background colour; unknown when an image/gradient/media sits behind.
  const bgCache = new Map();
  function background(el) {
    if (!el || el === document.documentElement.parentNode) return [255, 255, 255, 1];
    if (bgCache.has(el)) return bgCache.get(el);
    const s = getComputedStyle(el); let res;
    if (s.backgroundImage !== 'none' && !/^linear-gradient\(rgba?\([^)]*\) ?0?%?,? ?rgba?\([^)]*\)\)$/.test(s.backgroundImage)) res = 'unknown';
    else {
      const under = background(el.parentElement || (el === document.body ? document.documentElement : null));
      const c = parse(s.backgroundColor);
      res = under === 'unknown' ? (c && c[3] >= 0.99 ? c : 'unknown') : (c && c[3] > 0 ? over(c, under) : under);
    }
    bgCache.set(el, res); return res;
  }
  if (opts.contrast) {
    const seen = new Set(); let checked = 0;
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let n; (n = walker.nextNode());) {
      const el = n.parentElement; if (!n.textContent.trim() || seen.has(el)) continue; seen.add(el);
      if (el.closest('svg,script,style,noscript,template,.sr-only,[aria-hidden="true"],:disabled,[aria-disabled="true"]') || !visible(el) || srOnly(el)) continue;
      const s = getComputedStyle(el); const fg = parse(s.color); const bg = background(el);
      if (!fg || bg === 'unknown') continue;
      let alpha = fg[3]; for (let e = el; e; e = e.parentElement) alpha *= parseFloat(getComputedStyle(e).opacity);
      if (alpha < 0.05) continue; // fully transparent text is an intentional hide (animation start states)
      const r = ratio(over([fg[0], fg[1], fg[2], alpha], bg), bg); checked++;
      const size = parseFloat(s.fontSize), bold = parseInt(s.fontWeight) >= 700;
      const need = size >= 24 || (bold && size >= 18.66) ? 3 : 4.5;
      if (r < need - 0.02) add('contrast', el, `${r.toFixed(2)}:1 < ${need} "${n.textContent.trim().slice(0, 50)}" ${s.color} on rgb(${bg.slice(0, 3).map(Math.round)})`);
    }
    flags.push({ cls: '_stat', text: 'contrast-checked ' + checked });
  }
  if (opts.fixed) {
    // Signatures of every element on a fixed surface, compared across page themes by the runner.
    // Two kinds of fixed surface:
    //  - a themed card (.sw-scope, light or dark by its own class): everything inside it, borders included.
    //  - a fixed-colour surface (logo stage .sw-surface--*, mascot frame .sw-frame, colour card or chip with an inline
    //    background): its fill, its text, artwork and focus ring; its hairline frame may follow the page.
    const sig = {};
    const scopes = [...document.querySelectorAll('.sw-scope, [data-fixed-surface]')];
    const surfaces = [...document.querySelectorAll('.sw-frame, [class*="sw-surface--"], .sw-chip, .sw-swatch, [style*="background"]')].filter(el => !el.closest('.sw-scope'));
    for (const [roots, full] of [[scopes, true], [surfaces, false]]) for (const root of roots) {
      const scopeDark = root.classList.contains('dark');
      for (const el of [root, ...root.querySelectorAll('*')]) {
        if (!el.getClientRects().length) { sig[path(el)] = scopeDark + '|hidden'; continue; }
        const s = getComputedStyle(el);
        const ownText = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
        sig[path(el)] = (full
          ? [scopeDark, s.color, s.backgroundColor, s.borderTopColor, s.fill, s.stroke, s.display, s.visibility, s.opacity, el.currentSrc || '', s.getPropertyValue('--sw-focus')]
          : [scopeDark, ownText ? s.color : '', s.backgroundColor, el.closest('svg') ? s.fill : '', s.display, s.visibility, el.currentSrc || '', el.matches('a,button') ? s.getPropertyValue('--sw-focus') : '']).join('|');
      }
    }
    flags.push({ cls: '_fixed', text: JSON.stringify(sig) });
  }
  function path(el) { const parts = []; for (let e = el; e && e !== document.body; e = e.parentElement) { let i = 1; for (let s = e.previousElementSibling; s; s = s.previousElementSibling) i++; parts.unshift(e.tagName + ':' + i); } return parts.join('/'); }
  if (opts.layout) {
    if (document.documentElement.scrollWidth > W + 1) add('overflow', document.documentElement, `page scrolls sideways: ${document.documentElement.scrollWidth} > ${W}`);
    const inScroller = el => { for (let e = el.parentElement; e && e !== document.body; e = e.parentElement) { const s = getComputedStyle(e); if (/auto|scroll|hidden|clip/.test(s.overflowX)) return true; } return false; };
    let reported = 0;
    for (const el of document.body.querySelectorAll('*')) {
      if (reported > 5) break;
      const b = el.getBoundingClientRect(); if (!b.width || (b.right <= W + 1 && b.left >= -1)) continue;
      const s = getComputedStyle(el); if (s.position === 'fixed' || !visible(el) || srOnly(el) || inScroller(el)) continue;
      add('overflow', el, `sticks out of the ${W}px viewport: ${Math.round(b.left)}..${Math.round(b.right)}`); reported++;
    }
    for (const img of document.images) {
      if (!visible(img) && !img.closest('picture')) continue;
      if (!img.hasAttribute('alt')) add('images', img, `img without alt: ${img.currentSrc.split('/').pop()}`);
      if (img.complete && img.naturalWidth === 0 && img.getClientRects().length) add('images', img, `broken: ${img.getAttribute('src')}`);
      const b = img.getBoundingClientRect(); if (!img.naturalWidth || !b.width || !visible(img)) continue;
      const raster = !/\.svg(\?|$)/i.test(img.currentSrc);
      if (raster && b.width > img.naturalWidth * 1.1 && b.width - img.naturalWidth > 24) add('images', img, `upscaled ${img.naturalWidth}px -> ${Math.round(b.width)}px: ${img.currentSrc.split('/').pop()}`);
      const is = getComputedStyle(img), fit = is.objectFit;
      // Content box: borders and padding are not part of the picture.
      const cw = b.width - parseFloat(is.borderLeftWidth) - parseFloat(is.borderRightWidth) - parseFloat(is.paddingLeft) - parseFloat(is.paddingRight);
      const ch = b.height - parseFloat(is.borderTopWidth) - parseFloat(is.borderBottomWidth) - parseFloat(is.paddingTop) - parseFloat(is.paddingBottom);
      if (fit === 'fill' && ch > 8) { const want = img.naturalWidth / img.naturalHeight, got = cw / ch; if (Math.abs(got / want - 1) > 0.04) add('images', img, `aspect squashed ${want.toFixed(2)} -> ${got.toFixed(2)}: ${img.currentSrc.split('/').pop()}`); }
    }
    // A region that scrolls sideways must be reachable by keyboard (itself focusable, or holding a focusable control).
    for (const el of document.body.querySelectorAll('*')) {
      if (el.scrollWidth <= el.clientWidth + 1 || !el.clientWidth) continue;
      const s = getComputedStyle(el); if (!/auto|scroll/.test(s.overflowX) || !visible(el)) continue;
      if (el.tabIndex >= 0 || el.querySelector('a[href],button,input,select,textarea,[tabindex]:not([tabindex="-1"])')) continue;
      add('scroll', el, `scrolls sideways (${el.scrollWidth} > ${el.clientWidth}) but cannot be reached by keyboard`);
    }
    // Icons drawn in the text colour inside controls: >= 3:1 against what is behind them (WCAG 1.4.11).
    if (opts.contrast) for (const svg of document.querySelectorAll('a svg, button svg, summary svg')) {
      if (!visible(svg) || svg.getBoundingClientRect().width < 8) continue;
      const usesCurrent = /currentColor/i.test((svg.getAttribute('fill') || '') + (svg.getAttribute('stroke') || '')) || svg.classList.contains('sl-icon') || svg.classList.contains('icon');
      if (!usesCurrent) continue;
      const fg = parse(getComputedStyle(svg).color), bg = background(svg.parentElement);
      if (!fg || bg === 'unknown') continue;
      const r = ratio(over(fg, bg), bg); if (r < 2.98) add('contrast', svg, `icon ${r.toFixed(2)}:1 < 3 in "${(svg.closest('a,button,summary').textContent || svg.closest('a,button,summary').getAttribute('aria-label') || '').trim().slice(0, 40)}"`);
    }
    const inter = [...document.querySelectorAll('a[href],button,input:not([type=hidden]),select,textarea,summary,[role=button],[role=tab],[role=radio],[role=checkbox],[role=switch],[role=menuitem],[tabindex]:not([tabindex="-1"])')].filter(el => visible(el) && !srOnly(el));
    const boxes = inter.map(el => el.getBoundingClientRect());
    inter.forEach((el, i) => {
      const b = boxes[i]; if (b.width >= 24 && b.height >= 24) return;
      // Inline exception: a link inside running text.
      if (el.tagName === 'A') { const p = el.parentElement; const disp = getComputedStyle(el).display; if (disp === 'inline' && p && p.textContent.trim().length > el.textContent.trim().length + 2) return; }
      if (el.closest('.sl-markdown-content') && el.tagName === 'A' && getComputedStyle(el).display === 'inline') return;
      // Spacing exception: a 24px circle on the target's centre touches no other target.
      const cx = b.left + b.width / 2, cy = b.top + b.height / 2;
      const crowded = boxes.some((o, j) => j !== i && !(inter[j].contains(el) || el.contains(inter[j])) && Math.max(o.left - cx, 0, cx - o.right) ** 2 + Math.max(o.top - cy, 0, cy - o.bottom) ** 2 < 144);
      if (crowded) add('targets', el, `${Math.round(b.width)}x${Math.round(b.height)} target "${(el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 40)}"`);
    });
  }
  if (opts.semantics) {
    const name = el => (el.getAttribute('aria-label') || '').trim() || (el.getAttribute('aria-labelledby') || '').split(/\s+/).map(id => document.getElementById(id)?.textContent || '').join('').trim() || el.textContent.trim() || [...el.querySelectorAll('img[alt],svg[aria-label]')].map(i => i.getAttribute('alt') || i.getAttribute('aria-label')).join('').trim() || (el.getAttribute('title') || '').trim() || (el.labels && [...el.labels].map(l => l.textContent).join('').trim()) || (el.getAttribute('placeholder') || '').trim() || (el.type === 'submit' || el.type === 'button' ? el.value : '');
    for (const el of document.querySelectorAll('a[href],button,input:not([type=hidden]),select,textarea,[role=button],[role=tab],[role=radio],[role=switch],[role=checkbox]')) {
      if (!el.getClientRects().length || el.closest('[hidden]')) continue;
      if (!name(el)) add('names', el, `${el.tagName.toLowerCase()} without an accessible name`);
    }
    const ids = {}; for (const el of document.querySelectorAll('[id]')) ids[el.id] = (ids[el.id] || 0) + 1;
    for (const [id, n] of Object.entries(ids)) if (n > 1) add('names', document.getElementById(id), `duplicate id "${id}" x${n}`);
    for (const el of document.querySelectorAll('[aria-labelledby],[aria-describedby],[aria-controls]')) for (const attr of ['aria-labelledby', 'aria-describedby', 'aria-controls'])
      for (const id of (el.getAttribute(attr) || '').split(/\s+/).filter(Boolean)) if (!document.getElementById(id)) add('names', el, `${attr} -> missing #${id}`);
    const site = !!document.querySelector('.sl-markdown-content, [data-has-sidebar]');
    const mains = document.querySelectorAll('main, [role=main]'); if (mains.length !== 1) add('outline', null, `${mains.length} <main> landmarks`);
    if (site && !document.querySelector('header, [role=banner]')) add('outline', null, 'no header/banner landmark');
    // Pages with a sidebar must expose it as navigation (the splash home has none; its cards are the navigation).
    if (document.documentElement.hasAttribute('data-has-sidebar') && !document.querySelector('nav, [role=navigation]')) add('outline', null, 'no navigation landmark');
    // Composite widgets: a radio group or tab list has exactly one tab stop (roving tabindex).
    for (const group of document.querySelectorAll('[role=radiogroup], [role=tablist]')) {
      if (!group.getClientRects().length) continue;
      const items = [...group.querySelectorAll('[role=radio], [role=tab]')];
      const stops = items.filter(el => el.tabIndex >= 0 && !el.disabled);
      if (items.length && stops.length !== 1) add('widgets', group, `${group.getAttribute('role')} "${group.getAttribute('aria-label') || ''}" has ${stops.length} tab stops (want 1)`);
    }
    const hs = [...document.querySelectorAll('main h1, main h2, main h3, main h4, main h5, main h6, [role=main] :is(h1,h2,h3,h4,h5,h6)')].filter(h => h.getClientRects().length || h.closest('details'));
    const h1 = document.querySelectorAll('h1').length; if (h1 !== 1) add('outline', null, `${h1} <h1> elements`);
    let last = 1; for (const h of hs) { const l = +h.tagName[1]; if (l > last + 1) add('outline', h, `heading jumps h${last} -> h${l}: "${h.textContent.trim().slice(0, 50)}"`); last = l; }
  }
  if (opts.motion) {
    const loops = document.getAnimations().filter(a => a.playState === 'running' && a.effect?.getTiming().iterations === Infinity);
    for (const a of loops.slice(0, 5)) add('motion', a.effect.target, `loops under reduced motion: ${a.animationName || a.id || 'animation'}`);
    for (const v of document.querySelectorAll('video')) if (!v.paused) add('motion', v, 'video plays under reduced motion');
  }
  return flags;
}

// Focus: after one real Tab press (so :focus-visible applies), focus each visible focusable and compare its styles.
function focusProbe() {
  const flags = [];
  const parse = c => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number); return [p[0], p[1], p[2], p.length > 3 ? p[3] : 1]; };
  const lum = ([r, g, b]) => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
  const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  const pageBg = () => { for (let e = document.activeElement?.parentElement; e; e = e.parentElement) { const c = parse(getComputedStyle(e).backgroundColor); if (c && c[3] > 0.9) return c; } return parse(getComputedStyle(document.body).backgroundColor) || [255, 255, 255, 1]; };
  const els = [...document.querySelectorAll('a[href],button,input:not([type=hidden]),select,textarea,summary,[tabindex]:not([tabindex="-1"])')]
    .filter(el => el.getClientRects().length && !el.disabled && !el.closest('[hidden],[inert]') && getComputedStyle(el).visibility !== 'hidden');
  const look = el => { const s = getComputedStyle(el); return [s.outlineStyle, s.outlineWidth, s.outlineColor, s.boxShadow, s.borderColor, s.backgroundColor, s.textDecorationLine, s.color].join('|'); };
  let checked = 0;
  for (const el of els) {
    if (el.getBoundingClientRect().width < 1) continue;
    document.activeElement?.blur?.(); const before = look(el);
    el.focus({ preventScroll: true }); if (document.activeElement !== el) continue; checked++;
    const s = getComputedStyle(el), after = look(el);
    const outline = s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) >= 1;
    if (!outline && !/rgb/.test(s.boxShadow) && before === after) {
      flags.push({ cls: 'focus', at: el.tagName.toLowerCase() + '.' + String(el.className).split(' ')[0], text: `no visible focus: "${(el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 40)}"` });
    } else if (outline) {
      const bgc = pageBg(); const rings = [s.outlineColor, ...(s.boxShadow.match(/rgba?\([^)]+\)/g) || [])].map(parse).filter(Boolean); const r = rings.length ? Math.max(...rings.map(c => ratio(c, bgc))) : 99;
      if (r < 3) flags.push({ cls: 'focus', at: el.tagName.toLowerCase() + '.' + String(el.className).split(' ')[0], text: `focus outline ${r.toFixed(2)}:1 < 3 (${s.outlineColor})` });
    }
  }
  document.activeElement?.blur?.();
  flags.push({ cls: '_stat', text: 'focus-checked ' + checked });
  return flags;
}

const findings = []; const stats = { visits: 0, contrast: 0, focus: 0, fixedCompared: 0 };
const shots = new Set();
const t0 = Date.now();
await browser(async ({ navigate, evaluate, screenshot, send }) => {
  for (const path of targets) {
    const fixedSig = {};
    for (const width of widths) for (const theme of ['light', 'dark']) {
      await navigate(path, width, theme); await delay(250); stats.visits++;
      const main = width === 1280;
      const opts = { layout: true, contrast: main, fixed: main, semantics: main && theme === 'light' };
      const flags = await evaluate(`(${probe})(${JSON.stringify(opts)})`);
      // Scroll regions are made focusable by resize observers (Expressive Code, MediaEnhancements) shortly after load:
      // re-measure once after they settle before reporting.
      if (flags.some(f => f.cls === 'scroll')) {
        await delay(1500);
        const again = (await evaluate(`(${probe})({ layout: true })`)).filter(f => f.cls === 'scroll');
        for (let i = flags.length - 1; i >= 0; i--) if (flags[i].cls === 'scroll') flags.splice(i, 1);
        flags.push(...again);
      }
      if (main && theme === 'light') {
        // Composite widgets: ArrowRight from the tab stop moves focus to the next radio/tab and selects it.
        const groups = await evaluate(`[...document.querySelectorAll('[role=radiogroup], [role=tablist]')].filter(g => g.getClientRects().length).length`);
        for (let g = 0; g < groups; g++) {
          const ready = await evaluate(`(() => { const group = [...document.querySelectorAll('[role=radiogroup], [role=tablist]')].filter(g => g.getClientRects().length)[${g}];
            const items = [...group.querySelectorAll('[role=radio], [role=tab]')]; const start = items.find(el => el.tabIndex >= 0) || items[0];
            if (!start || items.length < 2) return false; start.focus(); window.__swStart = start; window.__swItems = items; return true; })()`);
          if (!ready) continue;
          await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'ArrowRight', code: 'ArrowRight', windowsVirtualKeyCode: 39 });
          await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'ArrowRight', code: 'ArrowRight', windowsVirtualKeyCode: 39 });
          await delay(100);
          const result = await evaluate(`(() => { const a = document.activeElement; const ok = window.__swItems.includes(a) && a !== window.__swStart && (a.getAttribute('aria-checked') === 'true' || a.getAttribute('aria-selected') === 'true');
            return ok ? '' : (window.__swStart.closest('[role=radiogroup],[role=tablist]').getAttribute('aria-label') || 'group'); })()`);
          if (result) flags.push({ cls: 'widgets', at: result, text: `ArrowRight does not move to and select the next item in "${result}"` });
        }
        if (groups) await navigate(path, width, theme), await delay(250);
      }
      if (main) {
        await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
        await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
        flags.push(...await evaluate(`(${focusProbe})()`));
      }
      for (const f of flags) {
        if (f.cls === '_stat') { const [k, n] = f.text.split(' '); stats[k.split('-')[0]] += +n; continue; }
        if (f.cls === '_fixed') { fixedSig[theme] = JSON.parse(f.text); continue; }
        findings.push({ path, width, theme, ...f });
        const key = `${path}|${f.cls}|${width}|${theme}`;
        if (!shots.has(key) && shots.size < 400) { shots.add(key); await screenshot(join(out, `${f.cls}-${path.slice(BASE.length + 1).replace(/[^a-z0-9]+/gi, '_') || 'home'}-${width}-${theme}.png`)); }
      }
    }
    // Fixed surfaces: the same element, in the same card state, must look the same on a light and a dark page.
    if (fixedSig.light && fixedSig.dark) {
      let diffs = 0;
      for (const [k, a] of Object.entries(fixedSig.light)) {
        const b = fixedSig.dark[k]; if (b === undefined || a === b) continue;
        if (a.split('|')[0] !== b.split('|')[0]) continue; // the card itself changed state (follows the system theme)
        stats.fixedCompared++;
        if (diffs++ < 6) findings.push({ path, width: 1280, theme: 'both', cls: 'fixed', at: k.split('/').slice(-3).join('/'), text: `changes with the page theme: ${a} => ${b}` });
      }
    }
    // Reduced motion: nothing loops.
    await navigate(path, 1280, 'light', 'reduce'); await delay(250); stats.visits++;
    for (const f of await evaluate(`(${probe})({motion:true})`)) findings.push({ path, width: 1280, theme: 'light+reduce', ...f });
    process.stdout.write(`.`);
  }
});
const byClass = {}; for (const f of findings) byClass[f.cls] = (byClass[f.cls] || 0) + 1;
const report = { pages: targets.length, widths, ...stats, minutes: +((Date.now() - t0) / 60000).toFixed(1), byClass, findings };
writeFileSync(join(out, 'site-qa.json'), JSON.stringify(report, null, 2));
console.log(`\ncheck-site-qa: ${targets.length} pages, ${stats.visits} visits, ${stats.contrast} text contrast checks, ${stats.focus} focus checks; findings ${findings.length} ${JSON.stringify(byClass)}`);
for (const f of findings.slice(0, 40)) console.log(`  [${f.cls}] ${f.path} ${f.width} ${f.theme} ${f.at} :: ${f.text}`);
process.exit(findings.length ? 1 : 0);
