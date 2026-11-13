// Shared by demo.html and react/OverlaysDemo.tsx. Layers stay within the supplied frame.
function initOverlays(root) {
  const doc = root.ownerDocument, win = doc.defaultView;
  const reduced = win.matchMedia('(prefers-reduced-motion: reduce)');
  const frame = root.querySelector('.sw-ov-frame');
  const menu = root.querySelector('[role=menu]');
  const actions = root.querySelector('[data-actions]');
  const status = root.querySelector('[role=status]');
  const layerOf = id => id === 'menu' ? menu : root.querySelector(`[data-layer="${id}"]`);
  const panelOf = id => id === 'menu' ? menu : layerOf(id).querySelector('[role=dialog]');
  let current = null, opener = null, closing = false, pending = null, restore = true;
  let timer, cancelAnimation = () => {};
  const focusables = panel => [...panel.querySelectorAll('button,[href],input,select,textarea,[tabindex]')]
    .filter(n => !n.disabled && n.tabIndex >= 0 && n.getClientRects().length && !n.closest('[hidden],[inert]'));

  function positionMenu() {
    const f = frame.getBoundingClientRect(), a = actions.getBoundingClientRect();
    // Coordinates belong to the frame, including when the trigger wraps on a narrow screen.
    menu.style.maxWidth = `${Math.max(0, frame.clientWidth - 24)}px`;
    const width = menu.getBoundingClientRect().width;
    menu.style.left = `${Math.max(12, Math.min(a.right - f.left - frame.clientLeft - width, frame.clientWidth - width - 12))}px`;
    const top = a.bottom - f.top - frame.clientTop + 8;
    menu.style.top = `${top}px`;
    menu.style.maxHeight = `${Math.max(0, frame.clientHeight - top - 12)}px`;
  }
  const background = new Map();
  let oldOverflow = '';
  function unlock() {
    background.forEach((inert, node) => { node.inert = inert; }); background.clear();
    if (scrollLocked) { doc.documentElement.style.overflow = oldOverflow; scrollLocked = false; }
  }
  let scrollLocked = false;
  function lock(layer) {
    unlock();
    // Inert every sibling on the path to body, never an ancestor of the dialog itself.
    for (let node = layer; node && node !== doc.body; node = node.parentElement) {
      for (const sibling of node.parentElement.children) {
        if (sibling === node || /^(SCRIPT|STYLE|LINK)$/.test(sibling.tagName)) continue;
        background.set(sibling, sibling.inert); sibling.inert = true;
      }
    }
    oldOverflow = doc.documentElement.style.overflow;
    doc.documentElement.style.overflow = 'hidden'; scrollLocked = true;
  }
  function show({ id, from }) {
    const layer = layerOf(id), panel = panelOf(id);
    current = id; opener = from; layer.hidden = false; layer.inert = false;
    layer.dataset.state = panel.dataset.state = 'closed';
    void panel.getBoundingClientRect(); // One state-commit read on mount, never in an animation loop.
    layer.dataset.state = panel.dataset.state = 'open';
    if (id !== 'menu') lock(layer);
    actions.setAttribute('aria-expanded', String(id === 'menu'));
    if (id === 'menu') { positionMenu(); menu.querySelector('[role=menuitem]').focus({ preventScroll: true }); }
    else panel.focus({ preventScroll: true });
    status.textContent = `${panel.getAttribute('aria-label') || panel.querySelector('h2')?.textContent || 'Menu'} open.`;
  }
  function finish() {
    clearTimeout(timer); cancelAnimation();
    if (!current) return;
    layerOf(current).hidden = true;
    unlock(); current = null; closing = false; status.textContent = 'No layer open.';
    if (pending) { const next = pending; pending = null; show(next); }
    else if (restore && opener?.isConnected) opener.focus({ preventScroll: true });
  }
  function close(returnFocus = true) {
    restore = returnFocus;
    if (!current || closing) return;
    closing = true;
    const layer = layerOf(current), panel = panelOf(current);
    layer.inert = true; layer.dataset.state = panel.dataset.state = 'closed';
    actions.setAttribute('aria-expanded', 'false');
    void panel.getBoundingClientRect();
    const animations = [...new Set([layer, panel].flatMap(n => n.getAnimations()))];
    if (reduced.matches || !animations.length) { finish(); return; }
    let cancelled = false; cancelAnimation = () => { cancelled = true; };
    Promise.allSettled(animations.map(a => a.finished)).then(() => { if (!cancelled) finish(); });
    // Fallback for paused/unsupported animation events; derive the wait from the actual token durations.
    const duration = Math.max(...animations.map(a => Number(a.effect?.getComputedTiming().endTime) || 0));
    timer = win.setTimeout(finish, duration + 80);
  }
  function request(id, from) {
    if (current === id && closing) {
      clearTimeout(timer); cancelAnimation(); closing = false; pending = null;
      const layer = layerOf(id), panel = panelOf(id);
      layer.inert = false; layer.dataset.state = panel.dataset.state = 'open';
      actions.setAttribute('aria-expanded', String(id === 'menu'));
      panel.focus({ preventScroll: true }); return;
    }
    if (current === id && !closing) { pending = null; close(); return; }
    pending = { id, from };
    if (current) close(false);
    else { const next = pending; pending = null; show(next); }
  }
  function click(e) {
    const trigger = e.target.closest('[data-open],[data-actions]');
    if (trigger && root.contains(trigger)) { request(trigger.dataset.open || 'menu', trigger); return; }
    if (e.target.closest('[data-close],[role=menuitem]')) { pending = null; close(); return; }
    if (current && e.target === layerOf(current)) { pending = null; close(); }
    else if (current === 'menu' && !menu.contains(e.target)) { pending = null; close(false); }
  }
  function keydown(e) {
    // Inert closing content loses focus to the body. Escape must still cancel its queued replacement.
    if (!current || (!closing && !root.contains(doc.activeElement))) return;
    if (e.key === 'Escape') { e.preventDefault(); pending = null; close(); return; }
    if (closing) return;
    if (current === 'menu') {
      const items = [...menu.querySelectorAll('[role=menuitem]')], i = items.indexOf(doc.activeElement);
      const keys = { ArrowDown: (i + 1) % items.length, ArrowUp: (i - 1 + items.length) % items.length, Home: 0, End: items.length - 1 };
      if (e.key in keys) { e.preventDefault(); items[keys[e.key]].focus({ preventScroll: true }); }
      else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); close(); }
      else if (e.key === 'Tab') close();
      return;
    }
    if (e.key !== 'Tab') return;
    const panel = panelOf(current), f = focusables(panel), a = doc.activeElement;
    if (!f.length) { e.preventDefault(); panel.focus({ preventScroll: true }); }
    else if (e.shiftKey && (a === f[0] || !f.includes(a))) { e.preventDefault(); f.at(-1).focus({ preventScroll: true }); }
    else if (!e.shiftKey && (a === f.at(-1) || !f.includes(a))) { e.preventDefault(); f[0].focus({ preventScroll: true }); }
  }
  function motionChanged() { if (reduced.matches && closing) finish(); }
  function containFocus(event) {
    if (current && current !== 'menu' && !closing && !panelOf(current).contains(event.target)) panelOf(current).focus({ preventScroll: true });
  }
  doc.addEventListener('focusin', containFocus);
  const observer = new ResizeObserver(() => { if (current === 'menu' && !closing) positionMenu(); });
  observer.observe(frame);
  root.addEventListener('click', click); doc.addEventListener('keydown', keydown); reduced.addEventListener('change', motionChanged);
  return () => {
    clearTimeout(timer); cancelAnimation(); observer.disconnect(); unlock();
    doc.removeEventListener('focusin', containFocus);
    if (current) { layerOf(current).hidden = true; if (opener?.isConnected) opener.focus({ preventScroll: true }); }
    root.removeEventListener('click', click); doc.removeEventListener('keydown', keydown); reduced.removeEventListener('change', motionChanged);
  };
}

// Classic scripts also work when demo.html is opened directly from disk.
globalThis.SwOverlays = { initOverlays };
