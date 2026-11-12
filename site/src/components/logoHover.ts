// Plain-JS port of motion/box-open/react/brand/LogoBoxOverlay.tsx. The `hov` class (from the synced box-open.css)
// folds the resting open logo shut and opens it again (2200 ms) with no snap. It starts on pointer-enter (mouse or
// pen, never touch) or keyboard :focus-visible, always finishes once started, and never starts under reduced motion.
const HOVER_MS = 2200;
const reduced = () => {
  try {
    return matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
};
const focusVisible = (target: EventTarget | null) => {
  try {
    return target instanceof Element && target.matches(':focus-visible');
  } catch {
    return false;
  }
};

export function bindLogoHover(host: HTMLElement, mark: HTMLElement) {
  let running = false;
  let timer = 0;
  const finish = () => {
    running = false;
    clearTimeout(timer);
    mark.classList.remove('hov');
    host.removeAttribute('data-logo-playing');
  };
  const start = () => {
    if (running || reduced()) return;
    running = true;
    host.setAttribute('data-logo-playing', '');
    mark.classList.add('hov');
    timer = window.setTimeout(finish, HOVER_MS + 250); // safety net if no animationend arrives
  };
  host.addEventListener('pointerenter', (e) => {
    if ((e as PointerEvent).pointerType !== 'touch') start();
  });
  host.addEventListener('focusin', (e) => {
    if (focusVisible(e.target)) start();
  });
  mark.addEventListener('animationend', (e) => {
    if ((e as AnimationEvent).animationName === 'sw-boxh-w') finish();
  });
}
