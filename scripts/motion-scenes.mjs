// Pure data (no browser, no sharp) for the motion-kit previews. make-previews.mjs renders it; lib-previews.mjs reads
// it so check-previews.mjs hashes every family's CSS and expects every output. One entry = one preview pair per theme.
//   css:   family CSS (relative to the repo root) loaded into the scene page, after tokens.css
//   body:  markup. setup: JS run once after load (state changes start transitions). at: optional JS name called per frame
//          with the time in ms (scroll-driven scenes); otherwise every CSS animation and transition is paused and seeked.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const MARK = readFileSync(join(ROOT, 'motion/box-open/box-open-markup.html'), 'utf8').trim();
const M = (n) => `motion/${n}/${n}.css`;

const card = 'background:rgb(var(--color-panel));border:1px solid rgb(var(--color-line));border-radius:12px;padding:12px';
const btn = 'font:500 15px Outfit;padding:8px 16px;border-radius:999px;border:0;background:rgb(var(--color-accent));color:rgb(var(--color-on-accent))';
const stage = (inner, extra = '') => `<div style="position:relative;width:100%;height:100%;overflow:hidden;background:rgb(var(--color-surface));${extra}">${inner}</div>`;

export const MOTION_SCENES = [
  { family: 'route-transition', name: 'page-swap', css: [M('route-transition')], w: 360, h: 170, dur: 420, hold: 500,
    body: stage(`<div style="position:absolute;inset:0;display:grid;grid-template-columns:96px 1fr"><div style="padding:10px;border-right:1px solid rgb(var(--color-line));display:grid;gap:6px;align-content:start"><div style="padding:6px 8px;border-radius:8px;background:rgb(var(--color-accent-soft))">Requests</div><div style="padding:6px 8px">Inventory</div></div>
      <div style="position:relative"><div style="position:absolute;inset:0;padding:14px;animation:sw-vt-out 90ms var(--sw-ease-exit) both"><b>Requests</b><div style="margin-top:8px;height:10px;border-radius:5px;background:rgb(var(--color-line))"></div></div>
      <div class="sw-route-enter" data-sw-enter="forward" style="position:absolute;inset:0;padding:14px"><b>Inventory</b><div style="margin-top:8px;height:10px;border-radius:5px;background:rgb(var(--color-line))"></div><div style="margin-top:8px;height:10px;width:60%;border-radius:5px;background:rgb(var(--color-line))"></div></div></div></div>`) },
  { family: 'page-enter', name: 'stagger', css: [M('page-enter')], w: 360, h: 140, dur: 480, hold: 500,
    body: stage(`<div class="sw-stagger" style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;padding:14px">${[1, 2, 3, 4, 5, 6, 7, 8].map((i) => `<div style="${card};height:48px">${i}</div>`).join('')}</div>`) },
  { family: 'page-enter', name: 'showcase', css: [M('page-enter')], w: 360, h: 140, dur: 760, hold: 500,
    body: stage(`<div class="sw-auth-showcase" style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;padding:14px">${['One', 'Two', 'Three'].map((t) => `<div style="${card};height:100px">${t}</div>`).join('')}</div>`) },
  { family: 'overlays', name: 'dialog', css: [M('overlays')], w: 360, h: 170, dur: 220, hold: 700,
    body: stage(`<div class="sw-fx-fade" data-state="open" style="position:absolute;inset:0;background:rgb(var(--color-scrim)/.5);display:grid;place-items:center"><div class="sw-fx-pop" data-state="open" style="${card};width:230px;display:grid;gap:10px"><b>Hand over this tool?</b><button style="${btn}">Confirm</button></div></div>`) },
  { family: 'overlays', name: 'drawer', css: [M('overlays')], w: 360, h: 170, dur: 280, hold: 700,
    body: stage(`<div class="sw-fx-fade" data-state="open" style="position:absolute;inset:0;background:rgb(var(--color-scrim)/.5)"></div><aside class="sw-fx-drawer" data-state="open" style="position:absolute;right:0;top:0;bottom:0;width:190px;${card};border-radius:0;display:grid;align-content:start;gap:8px"><b>Detail drawer</b><span>Slides from its edge</span></aside>`) },
  { family: 'overlays', name: 'menu', css: [M('overlays')], w: 360, h: 150, dur: 160, hold: 700,
    body: stage(`<button style="${btn};position:absolute;left:16px;top:16px">Actions</button><ul class="sw-fx-menu" data-state="open" style="position:absolute;left:16px;top:60px;margin:0;padding:6px;list-style:none;${card};width:170px"><li style="padding:6px 8px">Edit</li><li style="padding:6px 8px">Duplicate</li><li style="padding:6px 8px">Archive</li></ul>`) },
  { family: 'toast', name: 'toast', css: [M('toast')], w: 360, h: 130, dur: 220, hold: 800,
    body: stage(`<div class="sw-fx-toast" data-state="open" style="position:absolute;right:12px;bottom:12px;width:250px;background:rgb(var(--color-panel));border:1px solid rgb(var(--color-outline));border-radius:14px;padding:14px;font-size:14px">Saved the loan record.<div style="margin-top:8px"><span style="padding:4px 10px;border-radius:999px;border:1px solid rgb(var(--color-outline))">Dismiss</span></div></div>`) },
  { family: 'sidebar', name: 'indicator', css: [M('sidebar')], w: 260, h: 170, dur: 220, hold: 800,
    body: stage(`<div id="nav" style="position:absolute;left:14px;top:12px;width:200px;display:grid;gap:4px"><div class="sw-indicator" id="bar" style="background:rgb(var(--color-accent-soft));border-radius:8px"></div>${['Requests', 'Inventory', 'Members', 'Settings'].map((t, i) => `<a class="sw-slide-item" ${i === 0 ? 'aria-current="page"' : ''} style="position:relative;z-index:1;display:block;padding:8px 12px;border-radius:8px;border:1px solid transparent">${t}</a>`).join('')}</div>`),
    setup: `var nav=document.getElementById('nav'),bar=document.getElementById('bar');function place(sel,anim){var t=nav.querySelector(sel),b=t.getBoundingClientRect(),f=nav.getBoundingClientRect();bar.style.transition=anim?'':'none';bar.style.width=b.width+'px';bar.style.height=b.height+'px';bar.style.transform='translate('+(b.left-f.left)+'px,'+(b.top-f.top)+'px)';bar.style.opacity=1;nav.setAttribute('data-slide','')}
place('a[aria-current="page"]',false);nav.offsetHeight;var a=nav.querySelectorAll('a');a[0].removeAttribute('aria-current');a[3].setAttribute('aria-current','page');place('a[aria-current="page"]',true);` },
  { family: 'collapse', name: 'collapse', css: [M('collapse')], w: 300, h: 150, dur: 220, hold: 800,
    body: stage(`<div style="padding:14px"><div id="b" aria-expanded="false" style="display:flex;gap:8px;align-items:center;${card}"><svg class="sw-chevron sw-chevron-flip" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>More (3)</div><div id="c" class="sw-collapse" data-state="closed" hidden><div class="sw-collapse-inner"><div style="padding:10px 4px;display:grid;gap:6px"><span>Reports</span><span>Audit log</span><span>Integrations</span></div></div></div></div>`),
    setup: `var b=document.getElementById('b'),c=document.getElementById('c');c.hidden=false;b.offsetHeight;b.setAttribute('aria-expanded','true');c.dataset.state='open';` },
  { family: 'skeleton', name: 'skeleton', css: ['motion/box-open/box-open.css', 'motion/skeleton/skeleton.css'], w: 300, h: 150, dur: 1400, hold: 0,
    body: stage(`<div style="padding:14px;display:grid;gap:8px">${[0, 1, 2].map(() => `<div class="sw-skeleton" style="height:34px"><div class="sw-box loop" style="width:22px;height:20px">${MARK}</div></div>`).join('')}<div class="sw-progress" style="margin-top:6px"><div class="sw-progress-fill" id="f" style="width:15%"></div></div></div>`),
    setup: `document.body.offsetHeight;document.getElementById('f').style.width='85%'` },
  { family: 'hover-press', name: 'hover-press', css: [M('hover-press')], w: 360, h: 130, dur: 220, hold: 800,
    body: stage(`<div style="padding:14px;display:grid;gap:12px"><div style="display:flex;gap:12px"><button class="desk-button-primary" id="h">Hover</button><button class="desk-button-primary" id="p">Press</button><a class="sw-link-hover sw-hover" id="l" style="color:rgb(var(--color-ink))">Link</a></div><div class="sw-card-hover sw-hover" id="c" style="padding:10px 12px">Card: border colour only</div></div>`),
    setup: `document.body.offsetHeight;['h','c','l'].forEach(function(i){document.getElementById(i).classList.add('is-hover')});document.getElementById('p').classList.add('is-active')` },
  { family: 'scroll-reveal', name: 'reveal', css: [M('scroll-reveal')], js: ['motion/scroll-reveal/scroll-reveal.js'], w: 360, h: 150, dur: 700, hold: 800,
    body: stage(`<div id="rv" data-reveal-ready style="padding:14px;display:grid;gap:10px">${['Block one', 'Block two', 'Block three'].map((t) => `<div data-reveal style="${card}">${t}</div>`).join('')}</div>`),
    setup: `var r=document.getElementById('rv');r.offsetHeight;r.querySelectorAll('[data-reveal]').forEach(function(n){n.setAttribute('data-revealed','')})` },
  { family: 'scroll-reveal', name: 'pinned-hero', css: [M('scroll-reveal')], js: ['motion/scroll-reveal/scroll-reveal.js'], w: 400, h: 225, dur: 3000, hold: 600, fps: 15,
    body: `<style>body{margin:0}.sw-hub-seq{--sw-hub-header-h:0px}.sw-hub-seq-copy{text-align:center;padding:0!important}.sw-hub-seq-copy h2{font-size:22px;margin:0}.sw-hub-seq-stage{display:grid;place-items:start center}.sw-hub-seq-frame{width:300px;height:130px;border-radius:12px;border:1px solid rgb(var(--color-line));background:rgb(var(--color-panel));display:grid;place-items:center}.sw-hub-seq-reveal{text-align:center}.sw-hub-seq-reveal h2{font-size:22px;margin:0}</style>
      <div class="sw-hub-seq" id="seq"><div class="sw-hub-seq-scene" data-seq="scene"><div class="sw-hub-seq-backdrop" data-seq="backdrop"></div><div class="sw-hub-seq-copy" data-seq="copy"><h2>Know where every tool is.</h2></div><div class="sw-hub-seq-stage" data-seq="stage"><div class="sw-hub-seq-frame" data-seq="frame"><div data-seq="figure"><div data-seq="content">The console</div></div></div></div><div class="sw-hub-seq-reveal" data-seq="reveal"><h2>The whole overview</h2></div></div></div>`,
    setup: `SwScroll.initSequence(document.getElementById('seq'),{minWidth:0,scale:1.5});window.__at=function(ms){var s=document.getElementById('seq'),sc=s.querySelector('[data-seq=scene]');scrollTo(0,Math.min(1,ms/2700)*(s.offsetHeight-sc.offsetHeight));window.__swPaint()}`, at: '__at' },
  { family: 'feedback', name: 'stamp', css: [M('feedback')], w: 220, h: 110, dur: 430, hold: 900,
    body: stage(`<div style="display:grid;place-items:center;height:100%"><span class="sw-verify-stamp" style="display:inline-block;padding:8px 18px;border:2px solid rgb(var(--color-success));border-radius:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase">Verified</span></div>`) },
  { family: 'feedback', name: 'confetti', css: [M('feedback')], w: 300, h: 150, dur: 1300, hold: 0,
    body: stage(`<div style="display:grid;place-items:end center;height:100%;padding-bottom:14px"><button style="${btn}">Return recorded</button><span id="cf" class="sw-confetti" style="left:150px;top:112px"></span></div>`),
    setup: `var FULL=['--color-accent','--color-emphasis','--color-success','--color-warn','--color-info'],SH=['square','circle','box'],c=document.getElementById('cf');for(var i=0;i<16;i++){var a=(-165+150*i/15)*Math.PI/180,reach=64+(i%3)*22,p=document.createElement('span');p.className='sw-confetti-piece sw-confetti-'+SH[i%3];p.style.setProperty('--dx',Math.round(Math.cos(a)*reach)+'px');p.style.setProperty('--dy',Math.round(Math.sin(a)*reach)+'px');p.style.setProperty('--spin',((i%2?1:-1)*(120+i*15))+'deg');p.style.setProperty('--piece','rgb(var('+FULL[i%5]+'))');p.style.animationDelay=((i%4)*30)+'ms';c.appendChild(p)}` },
  { family: 'delight', name: 'logo-flaps', css: [M('delight')], w: 200, h: 120, dur: 560, hold: 700,
    body: stage(`<a data-logo data-logo-pop style="position:absolute;left:68px;top:20px;width:64px;height:64px;color:rgb(var(--color-accent))"><svg viewBox="0 0 64 64" width="64" height="64" fill="currentColor"><rect class="sw-logo-flap sw-logo-flap-tl" x="6" y="6" width="26" height="26" rx="3"/><rect class="sw-logo-flap sw-logo-flap-tr" x="34" y="6" width="26" height="26" rx="3"/><rect class="sw-logo-flap sw-logo-flap-bl" x="6" y="34" width="26" height="26" rx="3"/><rect class="sw-logo-flap sw-logo-flap-br" x="34" y="34" width="26" height="26" rx="3"/></svg></a>`),
    setup: `document.documentElement.setAttribute('data-sw-delight','')` },
  { family: 'delight', name: 'card-tilt', css: [M('delight')], w: 300, h: 150, dur: 650, hold: 700,
    body: stage(`<div style="display:grid;place-items:center;height:100%"><div id="hc" class="sw-holo" style="width:200px;height:110px;border-radius:14px;display:grid;place-items:center;background:rgb(var(--color-accent));color:rgb(var(--color-on-accent));font-weight:700">Member card</div></div>`),
    setup: `document.body.offsetHeight;document.getElementById('hc').style.transform='perspective(1200px) rotateX(-6deg) rotateY(9deg)'` },
  { family: 'kiosk-display', name: 'slide-fade', css: [M('kiosk-display')], w: 300, h: 110, dur: 400, hold: 800,
    body: stage(`<div class="sw-display-fade" style="display:grid;place-items:center;height:100%;font-size:26px;font-weight:700;background:rgb(var(--color-accent-soft))">Slide 2</div>`) },
  { family: 'kiosk-display', name: 'kiosk-vs-normal', css: ['motion/overlays/overlays.css', M('kiosk-display')], w: 360, h: 130, dur: 220, hold: 800,
    body: stage(`<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:10px;height:100%;box-sizing:border-box"><div style="position:relative"><small>Normal: pop</small><div class="sw-fx-pop" data-state="open" style="${card};margin-top:6px">Scale .98 + 4 px</div></div><div class="sw-kiosk" style="position:relative"><small>.sw-kiosk: fade</small><div class="sw-fx-pop" data-state="open" style="${card};margin-top:6px">Fade only</div></div></div>`) },
  { family: 'search', name: 'search-field', css: ['motion/box-open/box-open.css', M('search')], w: 340, h: 250, dur: 4600, hold: 700, fps: 12, at: '__at',
    body: stage(`<style>.sw-search.is-focus .sw-search-icon:not([data-fixed]){color:rgb(var(--color-accent-ink))}.sw-search.is-focus .sw-search-glyph{transform:translateX(2px)}.sw-search.is-focus .sw-search-kbd{opacity:0}.sw-search.is-focus .sw-search-input{border-color:rgb(var(--color-focus));outline:2px solid rgb(var(--color-focus));outline-offset:2px}.l{list-style:none;margin:8px 0 0;padding:6px;${card}}.l li{padding:8px 10px;border-radius:8px}</style>
      <div style="padding:20px 18px"><div class="sw-search" id="sf"><span class="sw-search-icon" id="ic"><svg class="sw-search-glyph" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg></span><input class="sw-search-input" id="in" type="search" placeholder="Search tools" aria-label="Search tools"><kbd class="sw-search-kbd" id="kb">Ctrl K</kbd></div><div id="res"></div></div>`),
    setup: `window.MARK=${JSON.stringify(MARK)};var sf=document.getElementById('sf'),inp=document.getElementById('in'),ic=document.getElementById('ic'),res=document.getElementById('res'),kb=document.getElementById('kb');
function typ(v){inp.value=v;var b=sf.querySelector('.sw-search-clear');if(v&&!b){b=document.createElement('button');b.className='sw-search-clear';b.innerHTML='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>';sf.appendChild(b)}else if(!v&&b)b.remove();if(v)kb.setAttribute('data-text','');else kb.removeAttribute('data-text')}
function load(on){var s=ic.querySelector('.sw-search-spin');if(on&&!s){s=document.createElement('span');s.className='sw-search-spin';s.innerHTML='<span class="sw-box loop mono" style="width:17px;height:16px;display:inline-block">'+window.MARK+'</span>';ic.appendChild(s);ic.setAttribute('data-loading','')}if(!on){if(s)s.remove();ic.removeAttribute('data-loading')}}
function list(){res.innerHTML='<ul class="l sw-search-pop">'+['Cordless drill','Drill bit set','Drill press','Hand drill'].map(function(t,i){return '<li class="sw-search-item" style="--sw-i:'+i+'">'+t+'</li>'}).join('')+'</ul>'}
var PH=[[400,function(){sf.classList.add('is-focus')}],[1000,function(){typ('d')}],[1130,function(){typ('dr')}],[1260,function(){typ('dri')}],[1390,function(){typ('dril')}],[1520,function(){typ('drill')}],[2000,function(){load(true)}],[3000,function(){load(false);list()}],[4000,function(){typ('');res.innerHTML=''}]];
var done=0,t0=0,own=new WeakMap();
window.__at=function(ms){while(done<PH.length&&PH[done][0]<=ms){PH[done][1]();t0=PH[done][0];done++;document.body.offsetHeight}
document.getAnimations().forEach(function(a){if(!own.has(a))own.set(a,t0);a.pause();a.currentTime=Math.max(0,ms-own.get(a))})}`,
  },
];

export const FAMILIES = [...new Set(MOTION_SCENES.map((s) => s.family))];
export const sceneBase = (s) => `motion/${s.family}/previews/${s.name}`;
export const MOTION_KIT_SOURCES = (() => {
  const set = new Set();
  for (const s of MOTION_SCENES) for (const f of [...s.css, ...(s.js || [])]) set.add(f);
  for (const f of FAMILIES) set.add(`motion/${f}/demo.html`);
  return [...set];
})();
export const MOTION_KIT_OUTPUTS = MOTION_SCENES.flatMap((s) => ['light', 'dark'].flatMap((th) => ['webp', 'gif'].map((fmt) => `${sceneBase(s)}-${th}.${fmt}`)));
