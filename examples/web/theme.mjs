// Light is the default (SW-204), even when the operating system prefers dark.
export function setTheme(value) {
  const dark = value === 'dark';
  document.documentElement.classList.toggle('dark', dark);
  try { localStorage.setItem('sw-starter-theme', dark ? 'dark' : 'light'); } catch {}
  for (const control of document.querySelectorAll('[data-theme]')) control.value = dark ? 'dark' : 'light';
}
export function bindTheme() {
  let saved = 'light';
  try { saved = localStorage.getItem('sw-starter-theme') || 'light'; } catch {}
  setTheme(saved);
  document.querySelectorAll('[data-theme]').forEach(control => control.addEventListener('change', () => setTheme(control.value)));
  window.addEventListener('storage', event => { if (event.key === 'sw-starter-theme') setTheme(event.newValue); });
}
