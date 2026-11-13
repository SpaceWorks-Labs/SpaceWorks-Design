// Animated image timelines cannot be paused by CSS: swap back to an actual still image.
(function () {
  function init(root = document) {
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    root.querySelectorAll('[data-motion-preview]').forEach(figure => {
      const image = figure.querySelector('img'), button = figure.querySelector('button');
      function stop() { image.src = image.dataset.poster; button.setAttribute('aria-pressed', 'false'); button.textContent = 'Play preview'; }
      button.addEventListener('click', () => {
        if (button.getAttribute('aria-pressed') === 'true') stop();
        else if (!preference.matches) { image.src = image.dataset.animated; button.setAttribute('aria-pressed', 'true'); button.textContent = 'Pause preview'; }
      });
      function changed() { stop(); button.disabled = preference.matches; }
      preference.addEventListener('change', changed); changed();
    });
  }
  globalThis.SwMotionPreviews = { init };
})();
