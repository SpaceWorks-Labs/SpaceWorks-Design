import { bindTheme } from './theme.mjs';
bindTheme();
const form = document.querySelector('#filter-form');
const input = document.querySelector('#inventory-query');
const results = document.querySelector('#results');
const status = document.querySelector('#results-status');
function search() {
  const found = 'drill press'.includes(input.value.trim().toLocaleLowerCase());
  results.replaceChildren();
  if (found) {
    const title = document.createElement('h2'); title.textContent = 'Drill press';
    const pill = document.createElement('span'); pill.className = 'pill'; pill.textContent = 'Available';
    const hint = document.createElement('p'); hint.textContent = 'Ask a staff member before use.';
    results.append(title, pill, hint);
  } else {
    const empty = document.createElement('p');
    empty.textContent = 'No items match your search. Clear filters above to see all inventory.';
    results.append(empty);
  }
  status.textContent = found ? '1 item available.' : '0 items match your search.';
}
form.addEventListener('submit', event => { event.preventDefault(); search(); });
form.addEventListener('reset', () => { queueMicrotask(search); });
