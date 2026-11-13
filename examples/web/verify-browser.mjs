// Local CDP smoke/axe checks. No site sync, remote service or product API is used.
import { spawn } from 'node:child_process';
import { mkdtemp, readFile, writeFile, mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
const chrome = process.env.SW_STARTER_CHROME;
if (!chrome) throw new Error('Set SW_STARTER_CHROME to a local Chromium executable.');
const profile = await mkdtemp(join(tmpdir(), 'ds-audit-1c-'));
const browser = spawn(chrome, ['--headless=new','--disable-gpu','--no-sandbox','--no-first-run','--no-default-browser-check',
  '--remote-debugging-pipe', '--user-data-dir=' + profile, 'about:blank'], { windowsHide:true, stdio:['ignore','ignore','ignore','pipe','pipe'] });
let pageSession;
const keepAlive = setInterval(() => {}, 1000);
try {
  let sequence=0; const pending = new Map(), exceptions=[], badResponses=[];
  const receive = data => {
    if (data.id) { const p=pending.get(data.id); pending.delete(data.id); if(data.error)p.reject(data.error);else p.resolve(data.result); }
    if (data.method==='Runtime.exceptionThrown') exceptions.push(data.params.exceptionDetails.text);
    if (data.method==='Network.responseReceived' && data.params.response.status>=400 && !data.params.response.url.endsWith('/favicon.ico')) badResponses.push(data.params.response.url);
  };
  let buffered='';
  browser.stdio[4].on('data', chunk => {
    buffered+=chunk.toString('utf8');
    let end; while((end=buffered.indexOf('\0'))>=0) { const message=buffered.slice(0,end); buffered=buffered.slice(end+1); if(message)receive(JSON.parse(message)); }
  });
  function call(method, params={}, root=false) { return new Promise((resolve,reject) => {
    const id=++sequence;
    const timeout=setTimeout(()=>{pending.delete(id);reject(new Error('CDP timeout: '+method));},15000);
    pending.set(id,{resolve:value=>{clearTimeout(timeout);resolve(value);},reject:error=>{clearTimeout(timeout);reject(error);}});
    browser.stdio[3].write(JSON.stringify({id,method,params,...(pageSession&&!root?{sessionId:pageSession}:{})})+'\0');
  }); }
  async function evaluate(expression) {
    const r=await call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});
    if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails));
    return r.result.value;
  }
  const target=await call('Target.createTarget',{url:'about:blank'});
  pageSession=(await call('Target.attachToTarget',{targetId:target.targetId,flatten:true})).sessionId;
  await call('Page.enable'); await call('Runtime.enable'); await call('Network.enable');
  const records=[]; let assertions=0;
  const assert=(value,message) => { assertions++; if(!value)throw new Error(message); };
  async function navigate(path) {
    await call('Page.navigate',{url:'http://localhost:4174'+path});
    for(let i=0;i<100;i++) {
      try { if(await evaluate('document.readyState==="complete"'))break; } catch {}
      await new Promise(done=>setTimeout(done,50));
    }
    await evaluate('document.fonts.ready.then(()=>true)');
    await new Promise(done=>setTimeout(done,80));
  }
  const urls=['/examples/web/','/examples/web/component-gallery.html','/examples/web/react/dist/'];
  for (const url of urls) for(const width of [320,390,768,1280]) for(const theme of ['light','dark']) {
    await call('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:false});
    await navigate(url);
    await evaluate(`(()=>{ const s=document.querySelector('[data-theme]')||document.querySelector('header select'); s.value='${theme}'; s.dispatchEvent(new Event('change',{bubbles:true})); return true; })()`);
    await evaluate(`(async()=>{await new Promise(ok=>requestAnimationFrame(()=>requestAnimationFrame(ok)));await Promise.all([...document.images].map(image=>image.decode().catch(()=>{})));return true;})()`);
    const check=await evaluate(`({width:innerWidth,scroll:document.documentElement.scrollWidth,h1:document.querySelectorAll('h1').length,dark:document.documentElement.classList.contains('dark'),images:[...document.images].filter(x=>getComputedStyle(x).display!=='none').every(x=>x.complete&&x.naturalWidth>0),font:document.fonts.check('400 16px Outfit')})`);
    assert(check.scroll<=check.width+1, url+' overflow '+width+' '+theme+' '+JSON.stringify(check));
    assert(check.h1===1 && check.images && check.font, 'Heading/assets/fonts failed '+url+' '+JSON.stringify(check));
    assert(check.dark===(theme==='dark'),'Theme switch failed '+url);
    records.push({url,width,theme,...check});
  }
  await navigate('/examples/web/');
  assert(await evaluate(`(()=>{document.querySelector('input').value='saw'; document.querySelector('form').requestSubmit(); return document.querySelector('#results-status').textContent.startsWith('0');})()`),'HTML search empty state');
  await evaluate(`document.querySelector('[type=reset]').click()`);
  assert(await evaluate(`document.querySelector('#results-status').textContent.startsWith('1')`),'HTML clear filters');
  await navigate('/examples/web/react/dist/');
  await evaluate(`(()=>{const input=document.querySelector('input');Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(input,'saw');input.dispatchEvent(new Event('input',{bubbles:true}));})()`);
  await new Promise(done=>setTimeout(done,50));
  await evaluate(`document.querySelector('form').requestSubmit()`);
  await new Promise(done=>setTimeout(done,50));
  assert(await evaluate(`document.querySelector('[role=status]').textContent.startsWith('0')`),'React controlled search');
  await navigate('/examples/web/component-gallery.html');
  const scenarioCount=await evaluate(`document.querySelectorAll('.example').length`);
  assert(scenarioCount===19,'19 gallery examples');
  const stateCount=await evaluate(`(()=>{let count=0;document.querySelectorAll('.example').forEach(section=>{for(const attr of ['data-variant','data-state']){const select=section.querySelector('['+attr+']');for(const option of select.options){select.value=option.value;select.dispatchEvent(new Event('change',{bubbles:true}));count++;}select.selectedIndex=0;select.dispatchEvent(new Event('change',{bubbles:true}));}});return count;})()`);
  assert(stateCount>100,'State and variant scenarios exercised');
  await evaluate(`(()=>{document.querySelector('#dialog details').open=true;const b=document.querySelector('#dialog [data-open]');b.focus();b.click();})()`);
  assert(await evaluate(`document.querySelector('#dialog-demo').open&&document.querySelector('#dialog-demo').contains(document.activeElement)`),'Dialog initial focus');
  await call('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27,nativeVirtualKeyCode:27});
  await call('Input.dispatchKeyEvent',{type:'keyUp',key:'Escape',code:'Escape',windowsVirtualKeyCode:27,nativeVirtualKeyCode:27});
  await evaluate('new Promise(ok=>requestAnimationFrame(()=>requestAnimationFrame(ok)))');
  assert(await evaluate(`!document.querySelector('#dialog-demo').open&&document.activeElement.hasAttribute('data-open')`),'Dialog escape/return focus');
  await evaluate(`(()=>{const s=document.querySelector('#tabs [data-variant]');s.value='Local panels';s.dispatchEvent(new Event('change',{bubbles:true}));document.querySelector('#gallery-tab-details').focus();})()`);
  await call('Input.dispatchKeyEvent',{type:'keyDown',key:'ArrowRight',code:'ArrowRight'});
  assert(await evaluate(`document.activeElement.id==='gallery-tab-history'&&document.activeElement.getAttribute('aria-selected')==='true'`),'Panel arrow navigation');
  await navigate('/examples/web/component-gallery.html');
  await evaluate(`(()=>{document.querySelector('[data-toast]').click();document.querySelector('.toast-row button').focus();})()`);
  await new Promise(done=>setTimeout(done,8200));
  assert(await evaluate(`document.querySelectorAll('.toast-row').length===1`),'Toast pauses while focused beyond 8s');
  await evaluate(`document.querySelector('.toast-row button').click()`);
  assert(await evaluate(`!document.querySelector('.toast-row')&&document.activeElement.hasAttribute('data-toast')`),'Undo completion returns focus');
  const axePath = process.env.SW_STARTER_AXE;
  const axeResults=[];
  if (axePath) {
    const axe=await readFile(axePath,'utf8');
    for(const url of urls){
      await navigate(url); await evaluate(axe);
      const result=await evaluate(`axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']}}).then(r=>({url:location.pathname,violations:r.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.target)})),passes:r.passes.length,incomplete:r.incomplete.length}))`);
      axeResults.push(result); assert(result.violations.length===0,'axe violations '+JSON.stringify(result));
    }
  }
  await navigate('/examples/web/');
  await call('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'},{name:'forced-colors',value:'active'}]});
  assert(await evaluate(`matchMedia('(forced-colors:active)').matches&&matchMedia('(prefers-reduced-motion:reduce)').matches`),'Assistive media emulation');
  const targetSizes=await evaluate(`[...document.querySelectorAll('button,input,select')].map(x=>({tag:x.tagName,width:x.getBoundingClientRect().width,height:x.getBoundingClientRect().height}))`);
  assert(targetSizes.every(x=>x.width>=44&&x.height>=44),'House target sizes');
  await call('Emulation.setEmulatedMedia',{features:[]});
  await call('Emulation.setDeviceMetricsOverride',{width:390,height:900,deviceScaleFactor:1,mobile:false});
  await navigate('/examples/web/');
  await mkdir('examples/web/verification',{recursive:true});
  const shot=await call('Page.captureScreenshot',{format:'png'});
  await writeFile('examples/web/verification/first-screen-390.png',Buffer.from(shot.data,'base64'));
  assert(exceptions.length===0,'Runtime exceptions: '+exceptions.join(','));
  assert(badResponses.length===0,'Asset responses: '+badResponses.join(','));
  const result={date:'2026-11-13',browser:(await call('Browser.getVersion',{},true)).product,assertions,scenarioCount,stateCount,matrix:records,axe:axeResults,targetSizes,runtimeExceptions:exceptions,badResponses,limits:'No manual screen reader, real zoom/device or Android/iOS compilation.'};
  await writeFile('examples/web/verification/results.json',JSON.stringify(result,null,2));
  console.log(JSON.stringify({assertions,scenarioCount,stateCount,matrix:records.length,axe:axeResults.map(x=>({url:x.url,violations:x.violations.length,passes:x.passes})),runtimeExceptions:exceptions.length,badResponses:badResponses.length}));
} finally { clearInterval(keepAlive); browser.kill(); }
