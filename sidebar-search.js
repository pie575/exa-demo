// Search belongs at the top of the page tree it filters, not in the navbar.
// Mintlify renders its search entry inside the navbar and exposes no option to
// move it, and that button is React-owned — reparenting it breaks reconciliation
// on the next soft navigation — so this mounts an independent trigger in the
// sidebar and forwards activation to the real entry, which `styles.css` hides
// where it stands.
(function () {
  const SIDEBAR_SELECTOR = "#sidebar-content";
  const TRIGGER_CLASS = "docs-sidebar-search";
  const ENTRY_SELECTOR = "#search-bar-entry, #search-bar-entry-mobile";

  const MAGNIFIER =
    '<svg class="docs-sidebar-search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" fill="none"' +
    ' stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"' +
    ' focusable="false"><path d="M15.25 15.25L11.285 11.285"/>' +
    '<path d="M7.75 12.75C10.5114 12.75 12.75 10.5114 12.75 7.75C12.75 4.98858 10.5114 2.75 7.75 2.75C4.98858 2.75' +
    ' 2.75 4.98858 2.75 7.75C2.75 10.5114 4.98858 12.75 7.75 12.75Z"/></svg>';

  const APPLE = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

  function openSearch() {
    const entry = document.querySelector(ENTRY_SELECTOR);
    if (entry) {
      entry.click();
      return;
    }
    // Page modes that drop the navbar have no entry to forward to, but the
    // dialog's own shortcut listener sits on the document.
    document.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "k",
        metaKey: APPLE,
        ctrlKey: !APPLE,
        bubbles: true,
      }),
    );
  }

  /** A trigger that reads as the search input the sidebar looks like it wants. */
  function createTrigger() {
    const button = document.createElement("button");
    button.type = "button";
    button.className = TRIGGER_CLASS;
    button.setAttribute("aria-label", "Open search");
    button.innerHTML =
      MAGNIFIER +
      '<span class="docs-sidebar-search-label">Search</span>' +
      '<span class="docs-sidebar-search-keys" aria-hidden="true"><kbd>' +
      (APPLE ? "⌘" : "Ctrl") +
      "</kbd><kbd>K</kbd></span>";
    button.addEventListener("click", openSearch);
    return button;
  }

  /** Puts the trigger above the page tree, once per sidebar Mintlify renders. */
  function mount() {
    document.querySelectorAll(SIDEBAR_SELECTOR).forEach(function (sidebar) {
      const trigger = sidebar.querySelector("." + TRIGGER_CLASS) || createTrigger();
      // Re-prepending is also the repair for a soft navigation that rebuilt the
      // sidebar around the trigger; the position check keeps it from feeding the
      // observer below a mutation of its own on every pass.
      if (trigger !== sidebar.firstElementChild) {
        sidebar.prepend(trigger);
      }
    });
  }

  let scheduled = false;

  /** Coalesce the bursts of mutations Mintlify emits while rendering. */
  function scheduleMount() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(function () {
      scheduled = false;
      mount();
    });
  }

  // Mintlify renders client-side, so the sidebar can appear after this script
  // runs and again on every soft navigation.
  new MutationObserver(scheduleMount).observe(document.body, {
    childList: true,
    subtree: true,
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();
