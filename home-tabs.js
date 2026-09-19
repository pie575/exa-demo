// Sliding selection indicators for the landing page's language tabs and its
// Examples API selector, mirroring `useSlidingIndicator` in `@exa/design`: one
// pill element per surface is measured against the selected label and moved,
// instead of each label painting its own background. Both surfaces are
// label/radio pairs, so selection still works without this script (the
// checked-label fallbacks in styles.css cover that).
(function () {
  const SURFACES = [
    // The language row keeps its pill's vertical geometry in CSS (top/bottom
    // insets); only horizontal position comes from the label.
    {
      list: ".docs-home-langs",
      radio: "docs-home-lang",
      pill: "docs-home-langs-pill",
      vertical: false,
    },
    // The API selector is a vertical stack, so its pill is driven in both axes.
    {
      list: ".docs-home-apis",
      radio: "docs-home-api",
      pill: "docs-home-apis-pill",
      vertical: true,
    },
  ];

  /** The pill for `list`, created on first use. */
  function pillFor(list, pillClass) {
    let pill = list.querySelector("." + pillClass);
    if (!pill) {
      pill = document.createElement("span");
      pill.className = pillClass;
      pill.setAttribute("aria-hidden", "true");
      pill.setAttribute("data-initial", "");
      list.prepend(pill);
      list.setAttribute("data-sliding", "");
    }
    return pill;
  }

  /** The label inside `list` bound to the checked radio, if any. */
  function selectedLabel(list, radioName) {
    const checked = document.querySelector('input[name="' + radioName + '"]:checked');
    if (!checked) return null;
    return list.querySelector('label[for="' + checked.id + '"]');
  }

  function position(surface, list) {
    const label = selectedLabel(list, surface.radio);
    if (!label) return;
    const pill = pillFor(list, surface.pill);
    pill.style.left = label.offsetLeft + "px";
    pill.style.width = label.offsetWidth + "px";
    if (surface.vertical) {
      pill.style.top = label.offsetTop + "px";
      pill.style.height = label.offsetHeight + "px";
    }
    if (pill.hasAttribute("data-initial")) {
      // Let the first placement paint before transitions apply, so the pill
      // does not slide in from the edge on load.
      requestAnimationFrame(function () {
        pill.removeAttribute("data-initial");
      });
    }
  }

  function positionAll() {
    SURFACES.forEach(function (surface) {
      document.querySelectorAll(surface.list).forEach(function (list) {
        position(surface, list);
      });
    });
  }

  let scheduled = false;

  /** Coalesce the bursts of mutations Mintlify emits while rendering. */
  function schedulePositionAll() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(function () {
      scheduled = false;
      positionAll();
    });
  }

  const SWITCHING = "data-switching";
  const SAFETY_MS = 400; // > --motion-duration-slow; clears if animationend never fires

  document.addEventListener("change", function (event) {
    if (
      event.target instanceof HTMLInputElement &&
      SURFACES.some(function (surface) {
        return event.target.name === surface.radio;
      })
    ) {
      // Flag the panes for this switch only, so the crossfade in styles.css
      // gates on the interaction rather than on the pane being mounted.
      document.querySelectorAll(".docs-home-pane").forEach(function (pane) {
        pane.setAttribute(SWITCHING, "");
        setTimeout(function () {
          pane.removeAttribute(SWITCHING);
        }, SAFETY_MS);
      });
      positionAll();
    }
  });

  document.addEventListener("animationend", function (event) {
    const pane = event.target instanceof Element && event.target.closest(".docs-home-pane");
    if (pane && event.target.hasAttribute("data-pane")) {
      pane.removeAttribute(SWITCHING);
    }
  });

  window.addEventListener("resize", schedulePositionAll);

  // Label geometry shifts when the webfont swaps in without any DOM change,
  // which matters most for the vertically stacked API pill.
  if (document.fonts) {
    document.fonts.ready.then(schedulePositionAll);
    document.fonts.addEventListener("loadingdone", schedulePositionAll);
  }

  // Mintlify renders client-side, so a list can appear after this script runs
  // and again on every soft navigation back to the page.
  new MutationObserver(schedulePositionAll).observe(document.body, {
    childList: true,
    subtree: true,
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", positionAll);
  } else {
    positionAll();
  }
})();
