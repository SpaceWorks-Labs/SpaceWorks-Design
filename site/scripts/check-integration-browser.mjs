// Orchestrator: node site/scripts/check-integration-browser.mjs
// Requires Edge (EDGE_PATH overrides the executable), Node 22+, and a completed site build.
// Captures ACTUAL demos keyed by the existing preview-scene IDs; does not regenerate previews.
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { browser, BASE, ROOT, delay } from './integration-browser.mjs';
import { KIT_FAMILIES } from './sync-motion-kit.mjs';
import { MOTION_SCENES } from '../../scripts/motion-scenes.mjs';
const out = join(ROOT, 'site/verification/browser'); mkdirSync(out, { recursive: true });
const report = { visits: 0, targets: 0, sceneCaptures: 0, assertions: 0, failures: [], scenarios: [], scope: 'Geometry, runnable-demo interactions and actual-demo screenshots. Generated preview freshness is separate; visual fidelity still requires inspection of the captures alongside the retained preview images.' };
const assert = (condition, message) => { report.assertions++; if (!condition) report.failures.push(message); };
const actions = {
  'route-transition/page-swap': { selector: '.side a[href]', index: 1 },
  'page-enter/stagger': { selector: 'button', text: 'Replay', index: 0 },
  'page-enter/showcase': { selector: 'button', text: 'Replay', index: 1 },
  'overlays/dialog': { selector: '[data-open="dialog"]' },
  'overlays/sheet': { selector: '[data-open="sheet"]' },
  'overlays/drawer': { selector: '[data-open="right"]' },
  'overlays/drawer-left': { selector: '[data-open="left"]' },
  'overlays/menu': { selector: '[data-open="menu"]' },
  'toast/toast': { selector: 'button', text: 'Saved' },
  'sidebar/indicator': { selector: '.nav a[href]', index: 1 },
  'collapse/collapse': { selector: '#b1' },
  'skeleton/skeleton': { selector: 'button', text: '60 %' },
  'hover-press/hover-press': { selector: 'button', text: 'Save', action: 'focus' },
  'scroll-reveal/reveal': { selector: '[data-reveal]', action: 'scroll' },
  'scroll-reveal/pinned-hero': { selector: '.sw-hub-seq, .sw-hub-seq-reveal', action: 'scroll' },
  'feedback/stamp': { selector: 'button', text: 'Stamp' },
  'feedback/confetti': { selector: '#cf' },
  'delight/logo-flaps': { selector: '#pause-delight' },
  'delight/card-tilt': { selector: '#holo', action: 'focus' },
  'kiosk-display/slide-fade': { selector: '#nx' },
  'kiosk-display/kiosk-vs-normal': { selector: 'button', text: 'Open dialog' },
  'search/search-field': { selector: 'input', action: 'focus' },
};
try {
  await browser(async b => {
    // Measure the same iframe controls as 2B, with the additional box-open page.
    for (const width of [390, 768, 1280]) for (const theme of ['light', 'dark']) for (const family of ['box-open', 'theme-reveal', ...KIT_FAMILIES.map(([f]) => f)]) {
      const path = `${BASE}/motion/${family}/`;
      await b.navigate(path, width, theme); report.visits++;
      await b.evaluate(`document.querySelectorAll('iframe').forEach(f=>{f.loading='eager';f.scrollIntoView()})`);
      await delay(180);
      const result = await b.evaluate(`(() => {
        const flags=[];let targets=0;
        const frames=[...document.querySelectorAll('iframe')];
        const docs=frames.length?frames.map(f=>f.contentDocument):[document];
        for(const d of docs){if(!d?.body){flags.push('iframe did not load');continue;}
          for(const e of d.querySelectorAll('a[href],button,input:not([type=hidden]),select,textarea,summary,[role=button]')){
            const r=e.getBoundingClientRect(),s=d.defaultView.getComputedStyle(e);
            if(!r.width||!r.height||s.visibility==='hidden'||e.closest('[hidden],[inert]')||e.matches(':disabled'))continue;
            targets++;const inline=e.tagName==='A'&&s.display==='inline'&&e.closest('p,li,td');
            if(!inline&&(r.width<24||r.height<24))flags.push((e.id||e.textContent.trim())+': '+r.width+' x '+r.height);
            if(e.matches('.btn,.sw-ov-btn,.sw-preview-btn')&&(r.width<44||r.height<44))flags.push('house action below 44px: '+e.textContent.trim());
          }
        }return {flags,targets};
      })()`);
      report.targets += result.targets;
      assert(!result.flags.length, `${path} ${width} ${theme}: ${result.flags.join('; ')}`);
    }
    // All existing preview scenario IDs map to controls in the actual runnable demo.
    for (const scene of MOTION_SCENES) for (const theme of ['light', 'dark']) for (const motion of ['no-preference', 'reduce']) {
      const id = `${scene.family}/${scene.name}`, action = actions[id];
      assert(Boolean(action), `${id}: no actual-demo action mapping`); if (!action) continue;
      await b.navigate(`${BASE}/kit/motion/${scene.family}/demo.html`, 768, theme, motion); report.visits++;
      const triggered = await b.evaluate(`(() => {
        const a=${JSON.stringify(action)}; const choices=[...document.querySelectorAll(a.selector)].filter(e=>!a.text||e.textContent.trim()===a.text);
        const e=choices[a.index||0]; if(!e)return false;
        e.scrollIntoView({block:'center'});e.focus?.();
        if(a.action==='scroll') e.scrollIntoView({block:'center'}); else if(a.action!=='focus')e.click();
        return true;
      })()`);
      assert(triggered, `${id}: actual demo trigger missing`);
      await delay(motion === 'reduce' ? 80 : Math.min(scene.dur + 80, 1500));
      if (scene.family === 'overlays') {
        const opened = await b.evaluate(`Boolean(document.querySelector('[data-state="open"]'))`);
        assert(opened, `${id}: no open layer`);
        // Exit and reopen mid-flight: actual controller, not synthetic scene markup.
        await b.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
        await b.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
        await b.evaluate(`document.querySelector(${JSON.stringify(action.selector)})?.click()`);
        await delay(300);
      }
      const file = `${scene.family}-${scene.name}-${theme}-${motion}.png`;
      await b.screenshot(join(out, file)); report.sceneCaptures++;
      report.scenarios.push({ id, theme, motion, actualDemoCapture: file, preview: `kit/motion/${scene.family}/previews/${scene.name}-${theme}.webp`, triggerFound: triggered });
    }
    await b.navigate(`${BASE}/components/`, 390, 'light');
    const filter = await b.evaluate(`(() => {const q=document.querySelector('sw-component-finder input');q.value='Button';q.dispatchEvent(new Event('input',{bubbles:true}));return [...document.querySelectorAll('.sl-markdown-content table:first-of-type tbody tr')].filter(r=>!r.hidden).map(r=>r.children[0].textContent)})()`);
    assert(filter.includes('Button'), 'Named component filter cannot find Button');
    await b.navigate(`${BASE}/motion/tokens/`, 768, 'light');
    const durations = await b.evaluate(`(() => {document.querySelector('[data-play]').click();const h=document.querySelector('#motion-easings');return [...h.nextElementSibling.querySelectorAll('.sw-dot')].map(e=>getComputedStyle(e).animationDuration)})()`);
    assert(durations.length > 0 && durations.every(d => d === '0.24s'), 'Easing preview does not run at the labelled 240ms');
    for (const motion of ['no-preference', 'reduce']) {
      await b.navigate(`${BASE}/motion/overlays/`, 390, 'dark', motion);
      const poster = await b.evaluate(`(() => {const img=document.querySelector('img[data-animation]');return img&&img.src!==new URL(img.dataset.animation,location.href).href})()`);
      assert(poster, `Motion poster did not remain static by default (${motion})`);
    }
  });
} catch (error) { report.failures.push(error.stack || String(error)); }
finally {
  writeFileSync(join(out, 'report.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({ ...report, scenarios: report.scenarios.length, failures: report.failures.length }));
  report.failures.forEach(f => console.error(f));
  if (report.failures.length) process.exitCode = 1;
}
