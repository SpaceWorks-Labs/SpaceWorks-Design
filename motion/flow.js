/* Portable motion helpers. Load tokens/tokens.css first. No numeric motion fallbacks. */
(function (global) {
  const reduced = () => global.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function milliseconds(name, element = document.documentElement) {
    // A probe resolves calc() aliases as well as direct tokens through the CSS engine.
    const probe = document.createElement('span');
    probe.style.cssText = `position:absolute;visibility:hidden;transition-duration:var(${name});`;
    element.appendChild(probe);
    const value = getComputedStyle(probe).transitionDuration;
    probe.remove();
    return parseFloat(value) * (value.endsWith('ms') ? 1 : 1000) || 0;
  }
  async function settled(nodes) {
    const animations = nodes.flatMap(node => node.getAnimations());
    if (reduced()) { animations.forEach(animation => animation.finish()); return; }
    await Promise.allSettled(animations.map(animation => animation.finished));
  }
  // CSS transitions retarget from their interpolated value; callers never remove/re-add classes.
  function disclosure(button, region) {
    region.hidden = false;
    region.inert = button.getAttribute('aria-expanded') !== 'true';
    region.setAttribute('aria-hidden', String(region.inert));
    button.addEventListener('click', () => {
      const open = button.getAttribute('aria-expanded') !== 'true';
      if (!open && region.contains(document.activeElement)) button.focus({ preventScroll: true });
      button.setAttribute('aria-expanded', String(open));
      region.inert = !open;
      region.setAttribute('aria-hidden', String(!open));
      region.dataset.state = open ? 'open' : 'closed';
    });
  }
  global.SwMotionFlow = { reduced, milliseconds, settled, disclosure };
})(globalThis);
