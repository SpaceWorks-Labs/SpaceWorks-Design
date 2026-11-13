// Theme reveal with one reversible snapshot pair; public API retained.
(function () {
  const KEY = 'makerspace.theme';
  let active = null, sessionPreference;
  function preference() { if(sessionPreference)return sessionPreference;try{return localStorage.getItem(KEY)||'light';}catch{return 'light';} }
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const darkFor = next => next === 'dark' || (next === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
  function applyTheme(next, { storageKey = KEY, onApply } = {}) {
    sessionPreference = next;
    try { localStorage.setItem(storageKey, next); } catch {}
    const dark = darkFor(next);
    document.documentElement.classList.toggle('dark', dark);
    const chrome = document.querySelector('meta[name="theme-color"]');
    if (chrome) chrome.content = dark ? '#000000' : '#FFF4E8';
    onApply?.(dark);
    document.dispatchEvent(new CustomEvent('sw-theme-change', { detail: next }));
  }
  function timing() {
    const probe = document.createElement('span');
    probe.style.transitionDuration = 'var(--sw-theme-duration)';
    document.documentElement.appendChild(probe);
    const time = getComputedStyle(probe).transitionDuration; probe.remove();
    return { duration: parseFloat(time) * (time.endsWith('ms') ? 1 : 1000) || 0,
      easing: getComputedStyle(document.documentElement).getPropertyValue('--sw-ease-standard').trim() };
  }
  function switchTheme(next, originEl, options = {}) {
    const root = document.documentElement;
    const paint = value => { if (options.apply) options.apply(value); else applyTheme(value, options); };
    const dark = darkFor(next);
    if (active) {
      // Both snapshots stay alive: reverse the existing mask from its current radius.
      active.desiredDark = dark; active.next = next; active.paint = paint;
      if (active.applied) paint(next);
      if (reduced()) { active.transition.skipTransition(); return active.done; }
      if (active.animation) {
        active.animation.updatePlaybackRate(dark === active.targetDark ? 1 : -1);
        active.animation.play();
      }
      return active.done;
    }
    if (reduced() || !document.startViewTransition || dark === root.classList.contains('dark')) { paint(next); return Promise.resolve(); }
    const rect = originEl?.getBoundingClientRect();
    const x = rect ? rect.left + rect.width / 2 : innerWidth - 40;
    const y = rect ? rect.top + rect.height / 2 : 32;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    root.removeAttribute('data-sw-vt'); root.classList.add('sw-theme-reveal');
    const state = { targetDark: dark, desiredDark: dark, next, paint, applied: false, animation: null, transition: null, done: null };
    active = state;
    let applied = false;
    const clean = () => { if (active !== state) return; root.classList.remove('sw-theme-reveal', 'sw-theme-reveal-soft'); active = null; };
    try {
      state.transition = document.startViewTransition(() => { if (!applied) { applied = state.applied = true; state.targetDark = darkFor(state.next); state.paint(state.next); } });
      state.transition.ready.then(() => {
        if (active !== state || reduced()) { state.transition.skipTransition(); return; }
        // clip-path is a documented page-snapshot exception; no individual surface repaints.
        state.animation = root.animate({ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { ...timing(), fill: 'both', pseudoElement: '::view-transition-new(root)' });
        if (state.desiredDark !== state.targetDark) { state.animation.updatePlaybackRate(-1); state.animation.play(); }
      }).catch(() => { if (!applied) { applied = state.applied = true; state.paint(state.next); } clean(); });
      state.done = state.transition.finished.then(clean, clean);
      return state.done;
    } catch { if (!applied) state.paint(state.next); clean(); return Promise.resolve(); }
  }
  matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', event => { if (event.matches) active?.transition?.skipTransition(); });
  const api = { switchTheme, applyTheme, preference };
  globalThis.SwThemeReveal = api;
  if (typeof module !== 'undefined') module.exports = api;
})();
