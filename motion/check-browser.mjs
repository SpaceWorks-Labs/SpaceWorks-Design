// Optional dependency-free headless Edge/CDP click-through for check-motion-flow.mjs.
import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, sep } from 'node:path';
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
export async function checkBrowser(root) {
  const executable = process.env.EDGE_PATH || 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  if (!existsSync(executable)) return { ran: false, message: 'Browser SKIP: Edge missing; set EDGE_PATH and run --require-browser.' };
  const profile = mkdtempSync(join(tmpdir(), 'sw-motion-flow-'));
  let proc, socket, server, connected = false, checks = 0;
  try {
    server = createServer((request, response) => {
      const path = resolve(root, '.' + decodeURIComponent(request.url.split('?')[0]));
      if (!path.startsWith(resolve(root) + sep)) { response.writeHead(403).end(); return; }
      try { response.setHeader('Content-Type', path.endsWith('.css') ? 'text/css' : path.endsWith('.js') ? 'text/javascript' : path.endsWith('.png') ? 'image/png' : 'text/html'); response.end(readFileSync(path)); }
      catch { response.writeHead(404).end(); }
    });
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const origin = `http://127.0.0.1:${server.address().port}`;
    proc = spawn(executable, ['--headless=new', '--remote-debugging-port=0', `--user-data-dir=${profile}`, '--disable-extensions', '--no-first-run', 'about:blank'], { windowsHide: true, stdio: 'ignore' });
    let launchError; proc.on('error', error => { launchError = error; });
    let port;
    for (let i = 0; i < 40; i++) {
      if (launchError) throw launchError;
      try { port = readFileSync(join(profile, 'DevToolsActivePort'), 'utf8').split('\n')[0]; break; } catch { await wait(250); }
    }
    if (!port) throw new Error('Edge did not expose DevToolsActivePort within 10 seconds (sandbox launch restriction).');
    const targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
    socket = new WebSocket(targets.find(target => target.type === 'page').webSocketDebuggerUrl);
    await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
    let id = 0; const pending = new Map();
    socket.onmessage = event => { const message = JSON.parse(event.data); if (message.id) { pending.get(message.id)?.(message); pending.delete(message.id); } };
    const send = (method, params = {}) => new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error(`CDP timeout: ${method}`)), 10000);
      const key = ++id; pending.set(key, message => { clearTimeout(timer); message.error ? reject(new Error(JSON.stringify(message.error))) : resolve(message.result); });
      socket.send(JSON.stringify({ id: key, method, params }));
    });
    const evaluate = async expression => {
      const result = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
      if (result.exceptionDetails) throw new Error(result.exceptionDetails.text + ': ' + result.exceptionDetails.exception?.description);
      return result.result.value;
    };
    const load = async family => {
      await send('Page.navigate', { url: `${origin}/motion/${family}/demo.html` });
      for (let i = 0; i < 40; i++) { if (await evaluate(`document.readyState==='complete' && !!document.querySelector('main')`)) break; await wait(50); }
      await evaluate('document.fonts.ready');
    };
    await send('Page.enable'); connected = true;
    for (const width of [390, 880]) for (const dark of [false, true]) for (const reduce of [false, true]) {
      await send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: false });
      await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: reduce ? 'reduce' : 'no-preference' }] });
      await load('overlays');
      const result = await evaluate(`(async()=>{
        document.documentElement.classList.toggle('dark',${dark});
        const sleep=ms=>new Promise(r=>setTimeout(r,ms));
        const count=()=>[...document.querySelectorAll('[data-layer], [role=menu]')].filter(n=>!n.hidden).length;
        let max=0;const observer=new MutationObserver(()=>max=Math.max(max,count()));observer.observe(document.body,{subtree:true,attributes:true});
        for(const id of ['dialog','sheet','right','left','menu','dialog']) {document.querySelector('[data-open='+id+']').click();await sleep(25);max=Math.max(max,count());}
        await sleep(450);
        if(max>1)throw Error('two overlays visible');
        if(!document.querySelector('[data-layer=dialog]').contains(document.activeElement))throw Error('dialog focus missing');
        if(!document.querySelector('.sw-ov-controls').inert)throw Error('background not inert');
        document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));await sleep(300);
        if(count()!==0||document.documentElement.style.overflow==='hidden')throw Error('Escape/scroll unlock failed');
        observer.disconnect();return max;
      })()`);
      if (result > 1) throw new Error('Overlay exclusivity failed'); checks++;
      await load('collapse');
      await evaluate(`(async()=>{
        const sleep=ms=>new Promise(r=>setTimeout(r,ms)),button=document.getElementById('b1'),panel=document.querySelector('#c1 .sw-collapse-inner');
        button.click();await sleep(45);const before=parseFloat(getComputedStyle(panel).opacity);button.click();const after=parseFloat(getComputedStyle(panel).opacity);
        if(!${reduce}&&Math.abs(before-after)>.08)throw Error('collapse reversal snapped');await sleep(25);const closing=parseFloat(getComputedStyle(panel).opacity);
        if(closing>after+.05)throw Error('collapse reversed in wrong direction');button.click();await sleep(300);
        if(getComputedStyle(panel).opacity!=='1'||button.getAttribute('aria-expanded')!=='true')throw Error('collapse lost latest click');
      })()`); checks++;
    }
    return { ran: true, message: `Browser PASS: ${checks} flow scenarios (phone/desktop, light/dark, reduced/full motion).` };
  } catch (error) { return { ran: connected, failed: connected, message: `Browser ${connected ? 'FAIL' : 'SKIP'}: ${error.message}` }; }
  finally {
    socket?.close(); proc?.kill(); server?.close();
    await wait(300);
    // Delete only the exact profile generated by mkdtemp inside the OS temporary directory.
    if (resolve(profile).startsWith(resolve(tmpdir()) + sep) && profile.includes('sw-motion-flow-')) try { rmSync(profile, { recursive: true, force: true }); } catch {}
  }
}
