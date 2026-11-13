/* Search field behaviour, framework-free. Wire every `.sw-search` (see demo.html for the markup):
   SwSearch.init(root)         adds the clear button, Escape-to-clear and the shortcut-chip state
   SwSearch.setLoading(root,b) crossfades the magnifier to the spinner markup you pass to init({spinner}) and back */
(function () {
  var X = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>';
  function sync(root, input) {
    var has = input.value.length > 0, btn = root.querySelector('.sw-search-clear'), kbd = root.querySelector('.sw-search-kbd');
    if (kbd) { if (has) kbd.setAttribute('data-text', ''); else kbd.removeAttribute('data-text'); }
    if (has && !btn && !input.disabled) {
      btn = document.createElement('button'); btn.type = 'button'; btn.tabIndex = 0; btn.className = 'sw-search-clear';
      btn.setAttribute('aria-label', root.getAttribute('data-clear-label') || 'Clear search'); btn.innerHTML = X;
      btn.addEventListener('mousedown', function (e) { e.preventDefault(); });
      btn.addEventListener('click', function () { clear(root, input); });
      root.appendChild(btn);
    } else if (!has && btn) btn.remove();
  }
  function clear(root, input) { input.value = ''; input.dispatchEvent(new Event('input', { bubbles: true })); input.focus(); }
  window.SwSearch = {
    init: function (root, opts) {
      var input = root.querySelector('input'); root.__spinner = (opts && opts.spinner) || ''; if(root.__initialized)return;root.__initialized=true;
      input.addEventListener('input', function () { sync(root, input); });
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && input.value && !e.defaultPrevented) { e.preventDefault(); e.stopPropagation(); clear(root, input); }
      });
      sync(root, input);
    },
    setLoading: function (root, on) {
      var icon = root.querySelector('.sw-search-icon'), spin = icon.querySelector('.sw-search-spin');
      if (on && !spin) { spin = document.createElement('span'); spin.className = 'sw-search-spin'; spin.setAttribute('role', 'status'); spin.setAttribute('aria-label', 'Searching'); spin.innerHTML = root.__spinner; icon.appendChild(spin); icon.setAttribute('data-loading', ''); }
      if (!on) { if (spin) spin.remove(); icon.removeAttribute('data-loading'); }
      root.querySelector('input').setAttribute('aria-busy',String(on));
    }
  };
})();
