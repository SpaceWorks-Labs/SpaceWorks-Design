// Dependency-free Edge/CDP harness. Node 22+; EDGE_PATH and DS_REPO may override host defaults.
import { spawn, spawnSync } from 'node:child_process';
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync, mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join, resolve, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
export const ROOT = resolve(process.env.DS_REPO || fileURLToPath(new URL('../../', import.meta.url)));
export const BASE = '/SpaceWorks-Design-System';
export const delay = ms => new Promise(r => setTimeout(r, ms));
export async function browser(run) {
  const server = createServer((req, res) => {
    try {
      const url = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      const artifact = url.startsWith('/__audit__/');
      const root = artifact ? dirname(fileURLToPath(import.meta.url)) : url.startsWith(BASE) ? join(ROOT, 'site/dist') : ROOT;
      let file = resolve(root, '.' + (artifact ? url.slice('/__audit__'.length) : url.startsWith(BASE) ? url.slice(BASE.length) : url));
      if (!file.startsWith(root)) { res.writeHead(404).end(); return; }
      if (process.env.DS_SNAPSHOT && !artifact) {
        const saved = join(process.env.DS_SNAPSHOT, file.slice(ROOT.length));
        if (existsSync(saved)) file = saved;
      }
      if (!existsSync(file)) { res.writeHead(404).end(); return; }
      if (statSync(file).isDirectory()) file = join(file, 'index.html');
      const type = {'.html':'text/html','.css':'text/css','.js':'text/javascript','.mjs':'text/javascript','.svg':'image/svg+xml','.json':'application/json','.woff2':'font/woff2','.png':'image/png','.webp':'image/webp'}[extname(file)] || 'application/octet-stream';
      res.setHeader('Content-Type', type); res.end(readFileSync(file));
    } catch { res.writeHead(404).end(); }
  });
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const origin = `http://127.0.0.1:${server.address().port}`;
  const profile = mkdtempSync(join(tmpdir(), 'ds-fix-cdp-'));
  const proc = spawn(process.env.EDGE_PATH || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    ['--headless=new','--no-sandbox','--disable-gpu','--remote-debugging-port=0',`--user-data-dir=${profile}`,'--disable-extensions','--no-first-run','about:blank'], {stdio:'ignore', windowsHide:true});
  let ws;
  try {
    let port;
    for (let i=0;i<60;i++) { const p=join(profile,'DevToolsActivePort'); if(existsSync(p)){port=readFileSync(p,'utf8').split('\n')[0];break;} await delay(250); }
    if (!port) throw new Error('Headless Edge did not start in 15 seconds (sandbox/process restriction).');
    const targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
    ws = new WebSocket(targets.find(t=>t.type==='page').webSocketDebuggerUrl);
    await new Promise((r,j)=>{ws.onopen=r;ws.onerror=j;});
    let id=0; const pending=new Map();
    ws.onmessage = e => {const d=JSON.parse(e.data);if(d.id&&pending.has(d.id)){pending.get(d.id)(d);pending.delete(d.id);}};
    const send = (method,params={}) => new Promise((r,j)=>{const n=++id; const timer=setTimeout(()=>j(new Error(`CDP timeout: ${method}`)),20000);pending.set(n,d=>{clearTimeout(timer);d.error?j(new Error(JSON.stringify(d.error))):r(d.result);});ws.send(JSON.stringify({id:n,method,params}));});
    const evaluate = async expression => {const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw new Error(JSON.stringify(r.exceptionDetails));return r.result.value;};
    const navigate = async (path,width,theme,motion='no-preference',dpr=1) => {
      const finalPath = path === BASE+'/whats-new/' ? BASE+'/whats-new-v2/' : path;
      await send('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:dpr,mobile:false});
      await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-color-scheme',value:theme},{name:'prefers-reduced-motion',value:motion}]});
      let loaded = false;
      for (let attempt=0; attempt<3 && !loaded; attempt++) {
        await send('Page.navigate',{url:origin+path});
        for(let i=0;i<120;i++) {
          await delay(50);
          if(await evaluate(`document.readyState==='complete' && location.origin===${JSON.stringify(origin)} && location.pathname===${JSON.stringify(finalPath)}`)) { loaded=true; break; }
        }
      }
      if (!loaded) throw new Error(`Navigation failed: ${path}; actual ${await evaluate('location.href')}`);
      await evaluate(`localStorage.setItem('starlight-theme',${JSON.stringify(theme)});localStorage.setItem('makerspace.theme',${JSON.stringify(theme)});document.documentElement.dataset.theme=${JSON.stringify(theme)};document.documentElement.classList.toggle('dark',${theme==='dark'});document.fonts.ready`);
    };
    const screenshot = async file => {mkdirSync(resolve(file,'..'),{recursive:true});const r=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});writeFileSync(file,Buffer.from(r.data,'base64'));};
    await send('Page.enable'); await send('Runtime.enable');
    return await run({send,evaluate,navigate,screenshot,origin});
  } finally {
    // Kill the whole Edge tree (renderers and GPU helpers too) and drop the throwaway profile: a bare proc.kill() on
    // Windows left headless Edge processes behind across many runs (DS-QA, v2.1.1).
    ws?.close(); server.close();
    if (process.platform === 'win32' && proc.pid) spawnSync('taskkill', ['/PID', String(proc.pid), '/T', '/F'], { stdio: 'ignore' }); else proc.kill();
    await delay(300); try { rmSync(profile, { recursive: true, force: true }); } catch {}
  }
}
