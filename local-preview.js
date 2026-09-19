// Mintlify's hosted AI assistant is unavailable in the local CLI. This launcher
// preserves its placement while opening the local documentation search.
(function () {
  if (!['localhost', '127.0.0.1'].includes(location.hostname)) return;
  const ID = 'docs-local-search-launcher';
  const BUTTON_HTML = {"assistant-entry-mobile": "<button id=\"assistant-entry-mobile\" aria-label=\"Toggle assistant panel\"><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"18\" height=\"18\" viewBox=\"0 0 18 18\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" focusable=\"false\" class=\"size-4.5 text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300\"><path d=\"M5.65799 2.99L4.39499 2.569L3.97399 1.306C3.83699 0.898 3.16199 0.898 3.02499 1.306L2.60399 2.569L1.34099 2.99C1.13699 3.058 0.998993 3.249 0.998993 3.464C0.998993 3.679 1.13699 3.87 1.34099 3.938L2.60399 4.359L3.02499 5.622C3.09299 5.826 3.28499 5.964 3.49999 5.964C3.71499 5.964 3.90599 5.826 3.97499 5.622L4.39599 4.359L5.65899 3.938C5.86299 3.87 6.00099 3.679 6.00099 3.464C6.00099 3.249 5.86199 3.058 5.65799 2.99Z\" fill=\"currentColor\" stroke=\"none\"></path><path d=\"M9.5 2.75L11.412 7.587L16.25 9.5L11.412 11.413L9.5 16.25L7.587 11.413L2.75 9.5L7.587 7.587L9.5 2.75Z\" stroke=\"currentColor\" width=\"1.5\" linecap=\"round\" linejoin=\"round\"></path></svg></button>", "ask-assistant-code-block-button": "<button class=\"size-6.5 flex items-center justify-center rounded-md group/ask-assistant-button [.code-block:not(:has([data-fade-overlay]))_[data-floating-buttons]_&]:bg-gray-100 dark:[.code-block:not(:has([data-fade-overlay]))_[data-floating-buttons]_&]:bg-gray-800\" id=\"ask-assistant-code-block-button\" aria-label=\"Ask Assistant\" data-chat-payload-element-id=\"lang-python-code-from_exa_py_import_E\"><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"18\" height=\"18\" viewBox=\"0 0 18 18\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" class=\"size-4 shrink-0 text-gray-400 group-hover/ask-assistant-button:text-gray-500 dark:text-white/40 dark:group-hover/ask-assistant-button:text-white/60\"><path d=\"M5.65799 2.99L4.39499 2.569L3.97399 1.306C3.83699 0.898 3.16199 0.898 3.02499 1.306L2.60399 2.569L1.34099 2.99C1.13699 3.058 0.998993 3.249 0.998993 3.464C0.998993 3.679 1.13699 3.87 1.34099 3.938L2.60399 4.359L3.02499 5.622C3.09299 5.826 3.28499 5.964 3.49999 5.964C3.71499 5.964 3.90599 5.826 3.97499 5.622L4.39599 4.359L5.65899 3.938C5.86299 3.87 6.00099 3.679 6.00099 3.464C6.00099 3.249 5.86199 3.058 5.65799 2.99Z\" fill=\"currentColor\" stroke=\"none\"></path><path d=\"M9.5 2.75L11.412 7.587L16.25 9.5L11.412 11.413L9.5 16.25L7.587 11.413L2.75 9.5L7.587 7.587L9.5 2.75Z\" stroke=\"currentColor\" width=\"1.5\" linecap=\"round\" linejoin=\"round\"></path></svg></button>"};
  function createSearchButton(kind) {
    const template = document.createElement('template');
    template.innerHTML = BUTTON_HTML[kind];
    const button = template.content.firstElementChild;
    button.removeAttribute('id');
    button.removeAttribute('data-chat-payload-element-id');
    button.setAttribute('aria-label', 'Search documentation');
    button.title = 'Search documentation';
    button.type = 'button';
    button.dataset.localSearchAction = kind;
    button.addEventListener('click', function () {
      document.dispatchEvent(new CustomEvent('exa:open-search'));
    });
    return button;
  }
  function restoreSearchActions() {
    const mobileSearch = document.querySelector('#search-bar-entry-mobile');
    if (mobileSearch && !mobileSearch.parentElement.querySelector('[data-local-search-action]') && !document.querySelector('#assistant-entry-mobile')) {
      mobileSearch.after(createSearchButton('assistant-entry-mobile'));
    }
    document.querySelectorAll('.code-block-copy-button').forEach(function (copy) {
      const actions = copy.parentElement;
      if (!actions.querySelector('[data-local-search-action], #ask-assistant-code-block-button')) {
        if (!['flex', 'inline-flex'].includes(getComputedStyle(actions).display)) {
          actions.classList.add('docs-local-code-actions');
        }
        const wrap = document.createElement('div');
        wrap.className = 'z-10 select-none';
        wrap.append(createSearchButton('ask-assistant-code-block-button'));
        copy.after(wrap);
      }
    });
  }

  let pageDates;
  fetch('/docs/page-dates.txt').then(function (response) {
    if (!response.ok) return null;
    return response.json();
  }).then(function (data) { pageDates = data; schedule(); }).catch(function () {});
  function restoreModifiedDate() {
    if (!pageDates) return;
    const path = location.pathname.replace(/\/$/, '');
    const record = pageDates[path];
    const label = typeof record === 'string' ? record : record && (record.text || record.label);
    const content = document.querySelector('#content');
    const existing = document.querySelector('[data-local-modified-date]');
    if (!label || !content) { if (existing) existing.remove(); return; }
    const block = existing || document.createElement('div');
    block.dataset.localModifiedDate = '';
    block.className = 'pt-4 pb-16 text-sm text-gray-500 dark:text-gray-400';
    if (block.textContent !== label) block.textContent = label;
    if (content.nextElementSibling !== block) content.after(block);
  }
  function update() {
    restoreModifiedDate();
    restoreSearchActions();
    document.documentElement.dataset.exaLocalPreview = '';
    const bar = document.querySelector('[data-assistant-bar]');
    if (!bar) return;
    bar.removeAttribute('inert');
    bar.removeAttribute('aria-hidden');
    const launcher = bar.querySelector('.chat-assistant-input')?.parentElement?.parentElement;
    if (!launcher || launcher.hasAttribute('data-local-search-bound')) return;
    launcher.dataset.localSearchBound = '';
    launcher.id = ID;
    launcher.setAttribute('role', 'button');
    launcher.setAttribute('tabindex', '0');
    launcher.setAttribute('aria-label', 'Search documentation');
    launcher.title = 'Search the local documentation';
    const input = launcher.querySelector('input');
    if (input) { input.tabIndex = -1; input.setAttribute('aria-label', 'Search documentation'); }
    function openSearch(event) {
      if (event.type === 'keydown' && event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      event.stopImmediatePropagation();
      document.dispatchEvent(new CustomEvent('exa:open-search'));
    }
    launcher.addEventListener('click', openSearch, true);
    launcher.addEventListener('keydown', openSearch, true);
  }
  let frame;
  function schedule() { if (frame) return; frame = requestAnimationFrame(function () { frame = null; update(); }); }
  new MutationObserver(schedule).observe(document.body, {childList: true, subtree: true});
  window.addEventListener('resize', schedule);
  update();
})();
