// Sliding selection indicator for the Tabs in page content, mirroring
// `useSlidingIndicator` in `@exa/design`: one pill element is measured against
// the selected tab and moved as a transform-only FLIP, instead of each tab
// painting its own background. Without this script the selected tab paints its
// own background (the `:not([data-sliding])` fallbacks in styles.css) and
// selection still reads. Large opt-in client tab sets (`.docs-tabs`) use a
// custom listbox whenever the row cannot fit — zoom, a narrow content column,
// or a small viewport — following `@exa/design/ui/select`. Code groups are
// styled by CSS alone (styles.css).
(function () {
  const LIST_SELECTOR = '.tab-container > [data-component-part="tabs-list"]';
  const SELECTED_SELECTOR = '[data-component-part="tab-button"][data-active="true"]';
  const PILL_CLASS = "docs-tabs-pill";
  const MENU_CLASS = "docs-tabs-menu";
  // `--motion-duration-slow` and `--motion-easing-out`.
  const DURATION_MS = 220;
  const EASING = "cubic-bezier(0.23, 1, 0.32, 1)";
  let nextMenuId = 0;

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  /** Scroll `tab` into the overflowing row without moving the page. */
  function scrollTabIntoRow(list, tab) {
    const listRect = list.getBoundingClientRect();
    const tabRect = tab.getBoundingClientRect();
    if (tabRect.left < listRect.left) {
      list.scrollLeft += tabRect.left - listRect.left;
    } else if (tabRect.right > listRect.right) {
      list.scrollLeft += tabRect.right - listRect.right;
    }
  }

  function tabLabel(tab) {
    const button = tab.querySelector('[data-component-part="tab-button"]');
    return button.textContent.replace(/\s+/g, " ").trim();
  }

  function tabIcon(tab) {
    const icon = tab.querySelector(
      '[data-component-part="tab-button"] img, [data-component-part="tab-button"] svg',
    );
    if (!icon) return null;
    const clone = icon.cloneNode(true);
    clone.removeAttribute("class");
    clone.classList.add("docs-tabs-menu-icon");
    clone.setAttribute("width", "16");
    clone.setAttribute("height", "16");
    return clone;
  }

  function selectedTab(tabs) {
    return (
      tabs.find(function (tab) {
        return tab.getAttribute("aria-selected") === "true";
      }) || tabs[0]
    );
  }

  /** One menu row: a real button, so focus and activation come for free. */
  function createMenuItem(tab) {
    const item = document.createElement("button");
    item.type = "button";
    item.className = "docs-tabs-menu-item";
    item.setAttribute("role", "option");
    item.innerHTML =
      '<span class="docs-tabs-menu-value">' +
      '<span class="docs-tabs-menu-icon-slot" aria-hidden="true"></span><span class="docs-tabs-menu-label"></span>' +
      "</span>" +
      '<svg class="docs-tabs-menu-check" viewBox="0 0 24 24" width="14" height="14" fill="none"' +
      ' stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"' +
      ' aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';
    const icon = tabIcon(tab);
    if (icon) item.querySelector(".docs-tabs-menu-icon-slot").append(icon);
    item.querySelector(".docs-tabs-menu-label").textContent = tabLabel(tab);
    return item;
  }

  function createClientMenu() {
    const wrapper = document.createElement("div");
    wrapper.className = MENU_CLASS;
    const contentId = "docs-tabs-menu-" + nextMenuId++;
    wrapper.innerHTML =
      '<button type="button" class="docs-tabs-menu-trigger" aria-label="Choose a client"' +
      ' aria-haspopup="listbox" aria-expanded="false" aria-controls="' +
      contentId +
      '">' +
      '<span class="docs-tabs-menu-value">' +
      '<span class="docs-tabs-menu-icon-slot" aria-hidden="true"></span><span class="docs-tabs-menu-label"></span>' +
      "</span>" +
      '<span class="docs-tabs-menu-chevron" aria-hidden="true"></span>' +
      "</button>" +
      '<div class="docs-tabs-menu-content" role="listbox" aria-label="Choose a client" id="' +
      contentId +
      '" hidden></div>';
    const trigger = wrapper.firstElementChild;
    const content = wrapper.lastElementChild;

    function setOpen(open, focusTarget) {
      wrapper.toggleAttribute("data-open", open);
      trigger.setAttribute("aria-expanded", String(open));
      content.hidden = !open;
      if (focusTarget) focusTarget.focus({ preventScroll: true });
    }
    wrapper.docsTabsClose = function () {
      setOpen(false);
    };

    trigger.addEventListener("click", function () {
      const open = content.hidden;
      setOpen(open, open ? content.querySelector('[aria-selected="true"]') : null);
    });

    content.addEventListener("click", function (event) {
      const item = event.target.closest('[role="option"]');
      if (!item) return;
      const tab = (wrapper.docsTabs || [])[Array.from(content.children).indexOf(item)];
      if (tab) (tab.querySelector('[data-component-part="tab-button"]') || tab).click();
      setOpen(false, trigger);
    });

    // Escape closes; arrows open the menu and walk it. The rows are buttons,
    // but activation is still explicit so it is one click everywhere,
    // including synthetic keyboards.
    wrapper.addEventListener("keydown", function (event) {
      const items = Array.from(content.children);
      if (!items.length) return;
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false, trigger);
        return;
      }
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        document.activeElement.click();
        return;
      }
      const index = items.indexOf(document.activeElement);
      let target;
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        const step = event.key === "ArrowDown" ? 1 : -1;
        target =
          index < 0
            ? content.querySelector('[aria-selected="true"]') || items[0]
            : items[(index + step + items.length) % items.length];
      } else if (event.key === "Home") {
        target = items[0];
      } else if (event.key === "End") {
        target = items[items.length - 1];
      }
      if (!target) return;
      event.preventDefault();
      setOpen(true, target);
    });

    wrapper.addEventListener("focusout", function (event) {
      if (!wrapper.contains(event.relatedTarget)) setOpen(false);
    });

    return wrapper;
  }

  /**
   * Mirror a `.docs-tabs` client tab row into the listbox. The menu lives in
   * the DOM whenever the row is present; CSS shows it when `[data-menu]` is
   * set because the tabs no longer fit.
   */
  function syncClientMenu(list) {
    if (!list.closest(".docs-tabs")) return;
    const tabs = Array.from(list.children).filter(function (item) {
      return item.getAttribute("role") === "tab";
    });
    if (!tabs.length) return;

    let wrapper = list.previousElementSibling;
    if (!wrapper || !wrapper.classList.contains(MENU_CLASS)) {
      wrapper = createClientMenu();
      list.before(wrapper);
    }
    wrapper.docsTabs = tabs;

    const content = wrapper.lastElementChild;
    const signature = tabs.map(tabLabel).join("|");
    if (content.dataset.tabs !== signature) {
      content.replaceChildren(...tabs.map(createMenuItem));
      content.dataset.tabs = signature;
    }

    const selected = selectedTab(tabs);
    Array.from(content.children).forEach(function (item, index) {
      item.setAttribute("aria-selected", String(tabs[index] === selected));
    });
    wrapper.querySelector(".docs-tabs-menu-label").textContent = tabLabel(selected);
    const slot = wrapper.querySelector(".docs-tabs-menu-icon-slot");
    const icon = tabIcon(selected);
    if (icon) slot.replaceChildren(icon);
    else slot.replaceChildren();
  }

  /** The pill inside `parent`, created on first use. */
  function pillFor(parent) {
    let pill = parent.querySelector(":scope > ." + PILL_CLASS);
    if (!pill) {
      pill = document.createElement("span");
      pill.className = PILL_CLASS;
      pill.setAttribute("aria-hidden", "true");
      pill.setAttribute("data-initial", "");
      // Appended rather than prepended: React owns this element's children, and a
      // trailing foreign node is the position least likely to disturb how it
      // inserts and removes the tabs. The pill is positioned, so order is only
      // a paint concern, and z-index settles that.
      parent.append(pill);
      parent.setAttribute("data-sliding", "");
    }
    return pill;
  }

  /**
   * Move `pill` from the rect it occupied to the one it now occupies, as a
   * transform the browser can run off the main thread.
   */
  function animateFrom(pill, from, animate) {
    if (pill.hasAttribute("data-initial")) {
      // Let the first placement paint before anything can animate, so the pill
      // does not fly in from the track's corner on load.
      requestAnimationFrame(function () {
        pill.removeAttribute("data-initial");
      });
      return;
    }

    if (!animate || prefersReducedMotion() || from.width === 0) return;

    const to = pill.getBoundingClientRect();
    if (to.width === 0) return;

    pill.animate(
      [
        {
          transform:
            "translate(" +
            (from.left - to.left) +
            "px, " +
            (from.top - to.top) +
            "px) scaleX(" +
            from.width / to.width +
            ")",
        },
        { transform: "none" },
      ],
      { duration: DURATION_MS, easing: EASING },
    );
  }

  /**
   * Show the listbox when the tab row would otherwise scroll sideways.
   * The hidden list stays laid out at the column width so this can be
   * rechecked without flashing the row.
   */
  function docsTabsUseMenu(list) {
    const root = list.closest(".docs-tabs");
    if (!root) return false;
    const overflows = list.scrollWidth - list.clientWidth > 1;
    root.toggleAttribute("data-menu", overflows);
    return overflows;
  }

  function position(list, animate) {
    syncClientMenu(list);
    observeList(list);
    if (docsTabsUseMenu(list)) return;

    // The `underline` variant marks the selected tab with a rule of its own and
    // has no indicator to place.
    if (list.closest(".docs-tabs-underline")) return;

    const tab = list.querySelector(SELECTED_SELECTOR);
    if (!tab) return;

    // Horizontal only: `scrollIntoView` also walks ancestor scrollers, so a
    // `block: "nearest"` call here yanks the page back whenever this tab is
    // off-screen. The page TOC shares `data-active` with these buttons, and
    // that used to fire this path on every section change.
    scrollTabIntoRow(list, tab);

    const pill = pillFor(list);
    const from = pill.getBoundingClientRect();

    pill.style.left = tab.offsetLeft + "px";
    pill.style.top = tab.offsetTop + "px";
    pill.style.width = tab.offsetWidth + "px";
    pill.style.height = tab.offsetHeight + "px";

    animateFrom(pill, from, animate);
  }

  function positionAll(animate) {
    document.querySelectorAll(LIST_SELECTOR).forEach(function (list) {
      position(list, animate);
    });
  }

  let scheduled = false;
  let scheduledAnimate = false;

  /**
   * Coalesce the bursts of mutations Mintlify emits while rendering. The
   * timeout backstops requestAnimationFrame for views that pause frame
   * production while idle, such as embedded webviews.
   */
  function schedulePositionAll(animate) {
    scheduledAnimate = scheduledAnimate || animate;
    if (scheduled) return;
    scheduled = true;
    function run() {
      if (!scheduled) return;
      scheduled = false;
      const shouldAnimate = scheduledAnimate;
      scheduledAnimate = false;
      positionAll(shouldAnimate);
    }
    requestAnimationFrame(run);
    window.setTimeout(run, 50);
  }

  const listResizeObserver =
    typeof ResizeObserver === "undefined"
      ? null
      : new ResizeObserver(function () {
          schedulePositionAll(false);
        });

  function observeList(list) {
    if (!listResizeObserver || list.docsTabsObserved) return;
    list.docsTabsObserved = true;
    listResizeObserver.observe(list);
    if (list.parentElement) listResizeObserver.observe(list.parentElement);
  }

  window.addEventListener("resize", function () {
    document.querySelectorAll("." + MENU_CLASS + "[data-open]").forEach(function (wrapper) {
      wrapper.docsTabsClose();
    });
    schedulePositionAll(false);
  });

  // Focusout covers most dismissal; this catches taps that never move focus,
  // which iOS is prone to.
  document.addEventListener("pointerdown", function (event) {
    document.querySelectorAll("." + MENU_CLASS + "[data-open]").forEach(function (wrapper) {
      if (!wrapper.contains(event.target)) wrapper.docsTabsClose();
    });
  });

  function isTabButton(node) {
    if (!node || node.nodeType !== 1) return false;
    return node.getAttribute("data-component-part") === "tab-button";
  }

  function addedTabList(node) {
    if (!node || node.nodeType !== 1) return false;
    return node.matches(LIST_SELECTOR) || Boolean(node.querySelector(LIST_SELECTOR));
  }

  // Mintlify renders client-side, so a list can appear after this script runs
  // and again on every soft navigation. Selection arrives as a `data-active`
  // flip on the tab button; it animates, other additions do not. Ignore the
  // same attribute on the page TOC.
  new MutationObserver(function (mutations) {
    let foundList = false;
    let selectionChanged = false;
    for (let i = 0; i < mutations.length; i++) {
      const mutation = mutations[i];
      if (mutation.type === "attributes") {
        if (isTabButton(mutation.target)) {
          foundList = true;
          selectionChanged = true;
        }
        continue;
      }
      for (let j = 0; j < mutation.addedNodes.length; j++) {
        if (addedTabList(mutation.addedNodes[j])) {
          foundList = true;
          break;
        }
      }
    }
    if (foundList) schedulePositionAll(selectionChanged);
  }).observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["data-active"],
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      positionAll(false);
    });
  } else {
    positionAll(false);
  }
})();
