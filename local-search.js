// Mintlify disables hosted search in `mint dev`. Keep the local preview useful
// with an offline index while leaving hosted production search untouched.
(() => {
  if (!['localhost', '127.0.0.1', '[::1]'].includes(location.hostname)) return;
  let dialog, input, results, status, previousFocus, pages, active = -1;
  let request = null;
  const make = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text) element.textContent = text;
    return element;
  };
  function close() {
    if (!dialog?.open) return;
    dialog.close();
    document.documentElement.classList.remove('local-search-open');
    previousFocus?.focus();
  }
  function select(index) {
    const links = [...results.querySelectorAll('a')];
    if (!links.length) return;
    active = (index + links.length) % links.length;
    links.forEach((link, i) => {
      link.classList.toggle('is-selected', i === active);
      link.setAttribute('aria-selected', String(i === active));
    });
    input.setAttribute('aria-activedescendant', links[active].id);
    links[active].scrollIntoView({block: 'nearest'});
  }
  function render() {
    if (!pages) return;
    const query = input.value.trim().toLocaleLowerCase();
    dialog.dataset.empty = String(!query);
    if (!query) {
      results.replaceChildren();
      status.textContent = '';
      active = -1;
      input.removeAttribute('aria-activedescendant');
      return;
    }
    const words = query.split(/\s+/).filter(Boolean);
    const ranked = pages.map(page => {
      const title = page.title.toLocaleLowerCase();
      const description = page.description.toLocaleLowerCase();
      const text = page.text.toLocaleLowerCase();
      let score = 0;
      for (const word of words) {
        if (!(title.includes(word) || description.includes(word) || text.includes(word))) return null;
        score += (title.includes(word) ? 30 : 0) + (description.includes(word) ? 10 : 0) + (text.includes(word) ? 1 : 0);
      }
      if (query && title === query) score += 100;
      else if (query && title.startsWith(query)) score += 40;
      return {page, score};
    }).filter(Boolean).sort((a, b) => b.score - a.score).slice(0, 12);
    results.replaceChildren();
    active = -1;
    input.removeAttribute('aria-activedescendant');
    status.textContent = query ? `${ranked.length}${ranked.length === 12 ? '+' : ''} results` : 'Documentation';
    if (!ranked.length) {
      results.append(make('p', 'local-search-empty', `No results for “${input.value.trim()}”`));
      return;
    }
    ranked.forEach(({page}, i) => {
      const link = make('a', 'local-search-result');
      link.href = page.url;
      link.id = `local-search-result-${i}`;
      link.setAttribute('role', 'option');
      link.setAttribute('aria-selected', 'false');
      link.append(make('span', 'local-search-result-title', page.title));
      let summary = page.description || page.text;
      if (query && !summary.toLocaleLowerCase().includes(words[0])) {
        const at = page.text.toLocaleLowerCase().indexOf(words[0]);
        if (at >= 0) summary = (at > 55 ? '…' : '') + page.text.slice(Math.max(0, at - 55));
      }
      link.append(make('span', 'local-search-result-description', summary.slice(0, 190)));
      link.append(make('span', 'local-search-result-path', page.url.replace('/docs/', '').replaceAll('/', ' › ')));
      link.addEventListener('mousemove', () => select(i));
      results.append(link);
    });
    select(0);
  }
  function create() {
    dialog = make('dialog', 'local-search-dialog');
    dialog.dataset.empty = 'true';
    dialog.setAttribute('aria-label', 'Search documentation');
    const top = make('div', 'local-search-top');
    const icon = make('span', 'local-search-magnifier');
    icon.setAttribute('aria-hidden', 'true');
    icon.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="10.7" cy="10.7" r="6.7"/><path d="m16 16 4.5 4.5"/></svg>';
    input = make('input', 'local-search-input');
    input.type = 'search';
    input.placeholder = 'Search documentation...';
    input.autocomplete = 'off';
    input.spellcheck = false;
    input.setAttribute('aria-label', 'Search documentation');
    input.setAttribute('role', 'combobox');
    input.setAttribute('aria-controls', 'local-search-results');
    input.setAttribute('aria-expanded', 'true');
    input.setAttribute('aria-autocomplete', 'list');
    const escape = make('button', 'local-search-escape', 'Esc');
    escape.type = 'button';
    escape.setAttribute('aria-label', 'Close search');
    escape.addEventListener('click', close);
    top.append(icon, input, escape);
    status = make('div', 'local-search-status', 'Loading documentation…');
    status.setAttribute('role', 'status');
    results = make('div', 'local-search-results');
    results.id = 'local-search-results';
    results.setAttribute('role', 'listbox');
    const footer = make('div', 'local-search-footer', '↑ ↓ Navigate    ↵ Open    Esc Close');
    dialog.append(top, status, results, footer);
    document.body.append(dialog);
    input.addEventListener('input', render);
    input.addEventListener('keydown', event => {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        select(active + (event.key === 'ArrowDown' ? 1 : -1));
      } else if (event.key === 'Enter' && active >= 0) {
        event.preventDefault();
        results.querySelectorAll('a')[active]?.click();
      }
    });
    dialog.addEventListener('cancel', event => { event.preventDefault(); close(); });
    dialog.addEventListener('click', event => {
      const box = dialog.getBoundingClientRect();
      if (event.target === dialog && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) close();
    });
  }
  async function open() {
    if (!dialog) create();
    if (dialog.open) return;
    previousFocus = document.activeElement;
    dialog.showModal();
    document.documentElement.classList.add('local-search-open');
    input.focus();
    if (!request) request = fetch('/docs/search-index.txt').then(response => {
      if (!response.ok) throw new Error('Index unavailable');
      return response.json();
    });
    try { pages = await request; render(); }
    catch { status.textContent = 'Search is unavailable. Please reload and try again.'; request = null; }
  }
  document.addEventListener('click', event => {
    if (!event.target.closest?.('.docs-sidebar-search, #search-bar-entry, #search-bar-entry-mobile')) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    open();
  }, true);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && dialog?.open) {
      event.preventDefault();
      event.stopImmediatePropagation();
      close();
      return;
    }
    if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      event.stopImmediatePropagation();
      dialog?.open ? close() : open();
    }
  }, true);
  document.addEventListener('exa:open-search', open);
})();
