/* Space Works scroll story, framework-free. A plain-JS port of useRevealOnScroll (useInView.ts) and
   useScrollSequence.ts (SpaceWorks 0.12.0). Transform and opacity only; no layout reads while scrolling. */
(function (global) {
  var RANGES = { lift: [0, 0.25], rise: [0, 0.38], zoom: [0.55, 0.84], fade: [0.68, 0.84], reveal: [0.86, 1] };
  var COPY_LIFT = 72;
  var clamp = function (v) { return Math.max(0, Math.min(1, v)); };
  var smoothstep = function (v) { var x = clamp(v); return x * x * (3 - 2 * x); };
  var span = function (p, r) { return (p - r[0]) / (r[1] - r[0]); };
  var reduced = function () { return !!(global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches); };

  /** Marks every [data-reveal] inside root data-revealed the first time its top crosses the lower eighth, once. */
  function initReveal(root) {
    if (!root || typeof IntersectionObserver !== 'function' || reduced()) return function () {};
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (!e.isIntersecting) return; e.target.setAttribute('data-revealed', ''); io.unobserve(e.target); });
    }, { rootMargin: '0px 0px -12% 0px' });
    root.querySelectorAll('[data-reveal]').forEach(function (n) { io.observe(n); });
    root.setAttribute('data-reveal-ready', '');
    return function () { io.disconnect(); root.removeAttribute('data-reveal-ready'); };
  }

  /** Pure: one scroll position in, every transform and opacity out (same math as sequenceFrame). */
  function sequenceFrame(progress, g) {
    var lift = clamp(span(progress, RANGES.lift)), rise = smoothstep(span(progress, RANGES.rise)), zoom = smoothstep(span(progress, RANGES.zoom));
    var fig = 1 - smoothstep(span(progress, RANGES.fade)), reveal = smoothstep(span(progress, RANGES.reveal));
    return { copyY: -COPY_LIFT * lift, copyOpacity: 1 - lift, stageY: g.start + (g.rest - g.start) * rise, frameScale: 1 + (g.scale - 1) * zoom,
      figureOpacity: fig, revealOpacity: reveal, revealY: 32 * (1 - reveal), revealScale: 0.94 + 0.06 * reveal, backdropOpacity: rise };
  }

  /** Pins the scene (data-animated) and writes the frame on scroll, one paint per animation frame. Off on phones and under reduced motion. */
  function initSequence(root, options) {
    options = options || {};
    var min = options.minWidth == null ? 768 : options.minWidth;
    if (!root || reduced() || !global.matchMedia('(min-width: ' + min + 'px)').matches) return null;
    var p = {};
    ['scene', 'copy', 'stage', 'frame', 'figure', 'content', 'reveal', 'backdrop'].forEach(function (k) { p[k] = root.querySelector('[data-seq="' + k + '"]'); });
    root.setAttribute('data-animated', '');
    var g, pending = false, moving;
    function measure() {
      var h = p.scene.offsetHeight, offset = parseFloat(getComputedStyle(root).getPropertyValue('--sw-hub-header-h')) || 0;
      g = { start: h * 0.92, rest: h * 0.3, scale: options.scale || 1.5, distance: root.offsetHeight - h, offset: offset };
      p.copy.style.setProperty('--sw-seq-copy-top', Math.round(h * 0.12) + 'px');
    }
    function paint() {
      pending = false;
      var progress = g.distance > 0 ? clamp((g.offset - root.getBoundingClientRect().top) / g.distance) : 0;
      var f = sequenceFrame(progress, g);
      p.copy.style.transform = 'translate3d(0,' + f.copyY + 'px,0)'; p.copy.style.opacity = f.copyOpacity;
      p.stage.style.transform = 'translate3d(0,' + f.stageY + 'px,0)'; p.frame.style.transform = 'scale(' + f.frameScale + ')';
      p.figure.style.opacity = f.figureOpacity; p.backdrop.style.opacity = f.backdropOpacity;
      p.reveal.style.opacity = f.revealOpacity; p.reveal.style.transform = 'translate3d(0,' + f.revealY + 'px,0) scale(' + f.revealScale + ')';
      root.setAttribute('data-moving', ''); clearTimeout(moving); moving = setTimeout(function () { root.removeAttribute('data-moving'); }, 120);
    }
    function onScroll() { if (!pending) { pending = true; requestAnimationFrame(paint); } }
    measure(); paint();
    addEventListener('scroll', onScroll, { passive: true }); addEventListener('resize', function () { measure(); paint(); });
    global.__swPaint = function () { measure(); paint(); };
    return paint;
  }

  global.SwScroll = { initReveal: initReveal, initSequence: initSequence, sequenceFrame: sequenceFrame, RANGES: RANGES };
})(window);
