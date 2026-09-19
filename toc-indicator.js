// Sliding indicator for Mintlify's in-page table of contents. The generated
// links already carry scrollspy state; this script only measures the active row
// and moves one indicator along the rail, including when a label wraps.
(function () {
  const LIST_SELECTOR = "#table-of-contents-content";
  const INDICATOR_CLASS = "docs-toc-indicator";

  /** Prefer the deepest active link; Mintlify also marks its parent rows. */
  function activeLinkFor(list) {
    const item =
      list.querySelector(".toc-item[data-active-deepest]") ||
      list.querySelector(".toc-item:has(> a[aria-current])") ||
      list.querySelector(".toc-item[data-active]:not(:has(.toc-item[data-active]))");

    return item && item.querySelector(":scope > a");
  }

  /** Return the rail indicator for a TOC list, creating it on first use. */
  function indicatorFor(list) {
    const container = list.parentElement;
    let indicator = container.querySelector(":scope > ." + INDICATOR_CLASS);

    if (!indicator) {
      indicator = document.createElement("span");
      indicator.className = INDICATOR_CLASS;
      indicator.setAttribute("aria-hidden", "true");
      indicator.setAttribute("data-initial", "");
      container.append(indicator);
    }

    return indicator;
  }

  /** Match the indicator to the active row without changing TOC layout. */
  function position(list) {
    const indicator = indicatorFor(list);
    const activeLink = activeLinkFor(list);

    if (!activeLink) {
      indicator.style.height = "0";
      return;
    }

    const containerTop = list.parentElement.getBoundingClientRect().top;
    const activeRect = activeLink.getBoundingClientRect();
    indicator.style.height = activeRect.height + "px";
    indicator.style.transform = "translateY(" + (activeRect.top - containerTop) + "px)";

    if (indicator.hasAttribute("data-initial")) {
      requestAnimationFrame(function () {
        indicator.removeAttribute("data-initial");
      });
    }
  }

  function positionAll() {
    document.querySelectorAll(LIST_SELECTOR).forEach(position);
  }

  let scheduled = false;

  /** Coalesce Mintlify's render and scrollspy mutation bursts. */
  function schedulePositionAll() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(function () {
      scheduled = false;
      positionAll();
    });
  }

  window.addEventListener("resize", schedulePositionAll);

  function isTocTarget(node) {
    return node && node.nodeType === 1 && Boolean(node.closest("#table-of-contents"));
  }

  // Mintlify renders client-side and replaces the TOC on soft navigation.
  // Scrollspy state arrives as attributes on the list item and active link.
  // Limit work to the TOC: `data-active` is also used by in-page tabs.
  new MutationObserver(function (mutations) {
    for (let i = 0; i < mutations.length; i++) {
      const mutation = mutations[i];
      if (isTocTarget(mutation.target)) {
        schedulePositionAll();
        return;
      }
      for (let j = 0; j < mutation.addedNodes.length; j++) {
        if (isTocTarget(mutation.addedNodes[j])) {
          schedulePositionAll();
          return;
        }
      }
    }
  }).observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["data-active", "data-active-deepest", "aria-current"],
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", positionAll);
  } else {
    positionAll();
  }
})();
