import { bindTheme } from './theme.mjs';
bindTheme();
const scenarios = await (await fetch('./scenarios.json')).json();
const byId = new Map(scenarios.map(row => [row.slug, row]));
const status = document.querySelector('#gallery-status');
const say = message => { status.textContent = message; };
const toastTimers = new Map();
function dismissToast(row, opener) {
  const focused = row.contains(document.activeElement);
  clearTimeout(toastTimers.get(row)); toastTimers.delete(row); row.remove();
  if (focused) opener?.focus();
}
function addToast(section, tone = 'success') {
  const target = section.querySelector('.toast-list');
  const opener = section.querySelector('[data-toast]');
  const row = document.createElement('div'); row.className = 'toast-row'; row.dataset.tone = tone;
  const message = document.createElement('p');
  message.textContent = tone === 'error' ? 'Couldn’t archive. Try again.' : 'Sample item archived.';
  row.append(message);
  let remaining = 8000, started = 0, busy = false;
  const pause = () => {
    if (toastTimers.has(row)) { clearTimeout(toastTimers.get(row)); toastTimers.delete(row); remaining -= performance.now() - started; }
  };
  const resume = () => {
    if (tone === 'error' || busy || row.matches(':hover') || row.contains(document.activeElement)) return;
    started = performance.now();
    toastTimers.set(row, setTimeout(() => dismissToast(row, opener), Math.max(0, remaining)));
  };
  if (tone !== 'error') {
    const undo = document.createElement('button'); undo.type = 'button'; undo.textContent = 'Undo';
    undo.addEventListener('click', async () => {
      pause(); busy = true; undo.disabled = true; undo.textContent = 'Undoing…';
      // Local async compensation only. Products must await the real server call.
      await Promise.resolve();
      say('Action undone.'); dismissToast(row, opener);
    }); row.append(undo);
  }
  const dismiss = document.createElement('button'); dismiss.type = 'button'; dismiss.textContent = 'Dismiss';
  dismiss.addEventListener('click', () => { if (!busy) dismissToast(row, opener); }); row.append(dismiss);
  row.addEventListener('pointerenter', pause); row.addEventListener('pointerleave', resume);
  row.addEventListener('focusin', pause); row.addEventListener('focusout', () => queueMicrotask(resume));
  target.append(row); say(message.textContent); resume();
}
function variant(section, name) {
  const preview = section.querySelector('.preview'), slug = section.id;
  const input = preview.querySelector('input'), button = preview.querySelector('button');
  if (slug === 'button') {
    button.className = name === 'Primary' ? 'primary' : name === 'Final danger' ? 'danger-filled' : name === 'Danger outline' ? 'danger-outline' : name === 'Ghost' ? 'ghost' : '';
  } else if (slug === 'link' && name === 'External') {
    const link = preview.querySelector('a'); link.href = 'https://spaceworks-labs.github.io/SpaceWorks-Design-System/'; link.target = '_blank'; link.rel = 'noopener noreferrer'; link.textContent = 'Design system ↗ (new tab)';
  } else if (slug === 'icon-button' && name === 'Toggle') { button.setAttribute('aria-pressed', 'false'); button.setAttribute('aria-label', 'Pin item'); button.textContent = '☆';
  } else if (slug === 'text-field') { input.type = name === 'Text' ? 'text' : 'search'; input.readOnly = name === 'Read-only'; if (input.readOnly) input.value = 'Drill press';
  } else if (slug === 'checkbox') { input.checked = name === 'Checked'; input.indeterminate = name === 'Mixed';
  } else if (slug === 'radio' || slug === 'segmented-control') {
    if (slug === 'radio') preview.querySelectorAll('input').forEach(x => { x.checked = x.value.toLowerCase() === name.toLowerCase(); });
    else preview.querySelector('fieldset').style.inlineSize = name === 'Full width' ? '100%' : 'fit-content';
  } else if (slug === 'switch') { input.checked = name === 'On';
  } else if (slug === 'select') {
    const select = preview.querySelector('select');
    if (name === 'Prompt') { const prompt = new Option('Choose density', '', true, true); select.prepend(prompt); select.required = true; }
    else select.value = name.toLowerCase();
  } else if (slug === 'tabs' && name === 'Local panels') {
    preview.innerHTML = '<div role="tablist" aria-label="Item sections"><button id="gallery-tab-details" role="tab" aria-selected="true" aria-controls="gallery-tabpanel">Details</button><button id="gallery-tab-history" role="tab" aria-selected="false" aria-controls="gallery-tabpanel" tabindex="-1">History</button></div><div id="gallery-tabpanel" role="tabpanel" tabindex="0" aria-labelledby="gallery-tab-details">Item details.</div>';
    const select = tab => {
      preview.querySelectorAll('[role=tab]').forEach(x => { x.setAttribute('aria-selected', String(x === tab)); x.tabIndex = x === tab ? 0 : -1; });
      const panel = preview.querySelector('[role=tabpanel]'); panel.setAttribute('aria-labelledby', tab.id); panel.textContent = tab.textContent === 'History' ? 'No history yet.' : 'Item details.';
    };
    preview.querySelectorAll('[role=tab]').forEach(tab => tab.addEventListener('click', () => select(tab)));
    preview.querySelector('[role=tablist]').addEventListener('keydown', event => {
      const keys = ['ArrowLeft','ArrowRight','Home','End']; if (!keys.includes(event.key)) return;
      event.preventDefault(); const tabs = [...preview.querySelectorAll('[role=tab]')], index = tabs.indexOf(document.activeElement);
      const target = event.key === 'Home' ? tabs[0] : event.key === 'End' ? tabs.at(-1) : tabs[(index + (event.key === 'ArrowLeft' ? -1 : 1) + tabs.length) % tabs.length];
      target.focus(); select(target);
    });
  } else if (slug === 'dialog') { preview.querySelector('dialog').style.inlineSize = name === 'Wide' ? '50rem' : '30rem';
  } else if (slug === 'drawer-sheet' && name === 'Bottom sheet') { const panel = preview.querySelector('dialog'); panel.className = 'sheet';
  } else if (slug === 'menu' && name === 'Labelled actions') { preview.querySelector('summary').textContent = 'Item actions';
  } else if (slug === 'table') { preview.querySelector('table').classList.toggle('compact', name === 'Compact');
  } else if (slug === 'pagination' && name === 'Page only') { preview.querySelector('nav > span').remove();
  } else if (slug === 'status-pill') {
    const pill = preview.querySelector('.pill'); pill.dataset.tone = name.toLowerCase(); pill.textContent = ({ Success:'Available',Warn:'Pending',Info:'Reserved',Emphasis:'2 left',Accent:'Issued',Danger:'Failed',Neutral:'Unknown' })[name];
  } else if (slug === 'empty-state' && name === 'Truly empty') { preview.querySelector('p').textContent = 'No items yet. Use Add item on the inventory screen to start.';
  } else if (slug === 'skeleton-loader' && name === 'Indeterminate') { preview.querySelector('progress').removeAttribute('value'); }
}
function state(section, value) {
  const preview = section.querySelector('.preview');
  section.querySelector('[data-note]').textContent = byId.get(section.id).stateCopy[value];
  const input = preview.querySelector('input,select'), button = preview.querySelector('button');
  if (value === 'Disabled') {
    for (const x of preview.querySelectorAll('button,input,select')) x.disabled = true;
    for (const link of preview.querySelectorAll('a')) { link.removeAttribute('href'); link.setAttribute('role','link'); link.setAttribute('aria-disabled','true'); link.tabIndex=-1; }
  }
  if (value === 'Read-only' && input) { input.readOnly = true; input.value = 'Drill press'; }
  if (value === 'Selected') {
    if (input?.matches('[type=checkbox],[type=radio]')) input.checked = true;
  }
  if (value === 'Loading / pending') { preview.setAttribute('aria-busy', 'true'); if (button) { button.disabled = true; button.textContent = 'Working…'; } else if(input && section.id!=='text-field') input.disabled=true; }
  if(value==='Empty'&&section.id==='select') {
    input.replaceChildren(new Option('No options available','')); input.disabled=true;
  }
  if(section.id==='skeleton-loader'&&['Success','Error / retry'].includes(value)) {
    preview.querySelector('section').setAttribute('aria-busy','false');
    preview.querySelector('.placeholder')?.remove(); preview.querySelector('progress')?.remove();
    const message=preview.querySelector('[role=status]');
    message.textContent=value==='Success'?'Inventory loaded.':'Inventory could not be loaded.';
  }
  if (['Empty','Filtered-empty'].includes(value) && ['table','pagination'].includes(section.id)) {
    preview.replaceChildren(); const p = document.createElement('p'); p.textContent = value === 'Filtered-empty' ? 'No items match your filters. Clear filters above.' : 'No items yet. Use Add item on the inventory screen.'; preview.append(p);
  }
  if (value === 'Error / retry') {
    const error = document.createElement('p'); error.className = 'error'; error.textContent = 'Couldn’t complete this request. Try again.';
    const retry = document.createElement('button'); retry.type = 'button'; retry.textContent = 'Retry'; retry.addEventListener('click', () => { error.remove(); retry.remove(); say('Sample request completed.'); section.querySelector('[data-state]').focus(); });
    (preview.querySelector('dialog')||preview).append(error, retry);
    if (input && section.id === 'text-field') { error.id = 'query-error'; input.setAttribute('aria-invalid','true'); input.setAttribute('aria-describedby','query-hint query-error'); }
  }
}
function render(section) {
  section.querySelector('.preview').innerHTML = byId.get(section.id).html;
  variant(section, section.querySelector('[data-variant]').value);
  state(section, section.querySelector('[data-state]').value);
  section.querySelector('pre code').textContent = section.querySelector('.preview').innerHTML;
}
document.querySelectorAll('.example').forEach(section => {
  section.querySelectorAll('[data-state],[data-variant]').forEach(select => select.addEventListener('change', () => render(section)));
});
document.querySelector('#preview-width').addEventListener('change', event => {
  document.querySelectorAll('.preview').forEach(x => { x.style.inlineSize = event.target.value; });
});
document.addEventListener('click', event => {
  const trigger = event.target.closest('[data-open]');
  if (trigger) { const dialog = document.getElementById(trigger.dataset.open); dialog.showModal(); dialog.addEventListener('close', () => { if (trigger.isConnected) trigger.focus(); }, { once:true }); }
  const action = event.target.closest('[data-action]');
  if (action) { say(action.dataset.action === 'save' ? 'Sample changes saved.' : 'Sample item archived.'); }
  const toggle = event.target.closest('button[aria-pressed]');
  if (toggle) toggle.setAttribute('aria-pressed', String(toggle.getAttribute('aria-pressed') !== 'true'));
  const clear = event.target.closest('[data-clear-filters]');
  if (clear) say('Filters cleared. All inventory is visible.');
  const toast = event.target.closest('[data-toast]');
  if (toast) { const section = toast.closest('.example'); addToast(section, section.querySelector('[data-variant]').value.toLowerCase()); }
  const pagerButton = event.target.closest('#pagination nav button');
  if (pagerButton) {
    const nav=pagerButton.closest('nav'), buttons=nav.querySelectorAll('button');
    const page=Math.max(1,Math.min(11,Number(nav.dataset.page||1)+(pagerButton===buttons[0]?-1:1)));
    nav.dataset.page=String(page);
    const spans=nav.querySelectorAll('span'), range=Math.min((page-1)*24+1,248)+'–'+Math.min(page*24,248)+' of 248';
    spans[spans.length-1].textContent='Page '+page+' of 11'; if(spans.length>1)spans[0].textContent=range;
    buttons[0].disabled=page<=1; buttons[1].disabled=page>=11; say(range+' sample items loaded.');
  }
});
