/* Complete portable toast lifecycle. SUCCESS_TIMEOUT is reading time, not motion duration. */
(function (global) {
  const SUCCESS_TIMEOUT = 8000;
  function initToasts(root, { undo = async () => {} } = {}) {
    const stack = root.querySelector('[data-toast-stack]');
    const status = root.querySelector('[data-toast-status]');
    const alert = root.querySelector('[data-toast-alert]');
    const rows = new Set();
    function announce(text, error) { (error ? alert : status).textContent = text; }
    function add(error, opener) {
      const node = document.createElement('div');
      node.className = `t sw-fx-toast${error ? ' err' : ''}`;
      node.dataset.state = 'open';
      node.innerHTML = `<p></p><div class="row">${error ? '' : '<button type="button" class="btn ghost" data-undo>Undo</button>'}<button type="button" class="btn ghost" data-dismiss>Dismiss</button></div>`;
      const message = node.querySelector('p');
      message.textContent = error ? 'Could not save. Try again.' : 'Saved the loan record.';
      let timer, remaining = SUCCESS_TIMEOUT, deadline = 0, gone = false, busy = false;
      const row = { node, dispose: () => clearTimeout(timer) }; rows.add(row);
      function paused() { return busy || node.matches(':hover') || node.contains(document.activeElement); }
      function pause() { clearTimeout(timer); if (deadline) remaining = Math.max(0, deadline - performance.now()); deadline = 0; }
      function resume() {
        if (error || gone || paused()) return;
        clearTimeout(timer); deadline = performance.now() + remaining;
        timer = setTimeout(dismiss, remaining);
      }
      async function dismiss() {
        if (gone || busy) return;
        gone = true; clearTimeout(timer);
        if (node.contains(document.activeElement)) {
          const next = [...rows].find(item => item !== row && item.node.isConnected && !item.node.inert);
          (next?.node.querySelector('button') || opener)?.focus({ preventScroll: true });
        }
        node.inert = true; node.dataset.state = 'closed';
        void node.getBoundingClientRect();
        await global.SwMotionFlow.settled([node]);
        node.remove(); rows.delete(row);
      }
      node.querySelector('[data-dismiss]').onclick = dismiss;
      node.querySelector('[data-undo]')?.addEventListener('click', async () => {
        if (busy || gone) return;
        pause(); busy = true; node.setAttribute('aria-busy', 'true');
        node.querySelectorAll('button').forEach(button => { button.setAttribute('aria-disabled', 'true'); });
        message.textContent = 'Undoing…'; announce(message.textContent, false);
        try {
          await undo();
          error = false; node.classList.remove('err'); message.textContent = 'Change undone.'; remaining = SUCCESS_TIMEOUT;
          announce(message.textContent, false);
        } catch {
          error = true; node.classList.add('err');
          message.textContent = 'Could not undo. Your saved record is unchanged. Try again.';
          announce(message.textContent, true);
        } finally {
          busy = false; node.removeAttribute('aria-busy');
          node.querySelectorAll('button').forEach(button => button.removeAttribute('aria-disabled'));
          resume();
        }
      });
      node.addEventListener('pointerenter', pause); node.addEventListener('pointerleave', resume);
      node.addEventListener('focusin', pause);
      node.addEventListener('focusout', () => queueMicrotask(resume));
      stack.appendChild(node); announce(message.textContent, error); resume();
      return dismiss;
    }
    function click(event) { const button = event.target.closest('[data-t]'); if (button) add(button.dataset.t === 'err', button); }
    root.addEventListener('click', click);
    return { add, destroy() { root.removeEventListener('click', click); rows.forEach(row => { row.dispose(); row.node.remove(); }); rows.clear(); } };
  }
  global.SwToasts = { initToasts, SUCCESS_TIMEOUT };
})(globalThis);
