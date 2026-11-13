import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import lightLogo from '../../../logo/lockup-horizontal.svg';
import darkLogo from '../../../logo/lockup-horizontal-reversed.svg';
import '../styles.css';
import './tailwind.css';
function FirstScreen() {
  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState('');
  const [theme, setTheme] = useState(() => document.documentElement.classList.contains('dark') ? 'dark' : 'light');
  const found = 'drill press'.includes(submitted.trim().toLocaleLowerCase());
  function changeTheme(value) {
    setTheme(value); document.documentElement.classList.toggle('dark', value === 'dark');
    try { localStorage.setItem('sw-starter-theme', value); } catch {}
  }
  return <>
    <a className="skip" href="#main-content">Skip to content</a>
    <header className="page-header"><img className="logo" src={theme === 'dark' ? darkLogo : lightLogo} alt="Space Works" />
      <label>Theme<select value={theme} onChange={event => changeTheme(event.target.value)}><option value="light">Light</option><option value="dark">Dark</option></select></label></header>
    <main id="main-content" tabIndex={-1} className="grid gap-4 font-body text-content">
      <div><h1>Inventory</h1><p>Find equipment available in your makerspace.</p></div>
      <form className="card grid gap-4" onSubmit={event => { event.preventDefault(); setSubmitted(query); }}>
        <label htmlFor="react-query">Search inventory</label>
        <input id="react-query" type="search" value={query} onChange={event => setQuery(event.target.value)} aria-describedby="react-hint" />
        <p id="react-hint" className="muted">Search by name. Local sample data only.</p>
        <div className="actions"><button className="primary" type="submit">Search</button><button type="button" onClick={() => { setQuery(''); setSubmitted(''); }}>Clear filters</button></div>
      </form>
      <p role="status">{found ? '1 item available.' : '0 items match your search.'}</p>
      <section aria-label="Inventory results" className="card">{found ? <><h2>Drill press</h2><span className="pill">Available</span><p>Ask a staff member before use.</p></> : <p>No items match your search. Clear filters above to see all inventory.</p>}</section>
    </main>
  </>;
}
createRoot(document.getElementById('root')).render(<FirstScreen />);
