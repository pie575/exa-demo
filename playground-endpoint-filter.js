(function () {
  // Scope the API playground's "Try it" endpoint selector to the API family of
  // the page you're on, while the sidebar keeps listing every family.
  //
  // Mintlify populates the endpoint switcher with every operation reachable in
  // the current navigation container, and that scope is coupled to what the
  // sidebar shows. To keep the full sidebar (all families) but still show only
  // the relevant endpoints in the switcher, we hide the switcher rows that
  // belong to a different family. Rows are matched by their anchor's href, so
  // identical operation labels across families (e.g. "Update a Monitor" in both
  // Websets and Monitors) are disambiguated by path, not by label.

  function familyOf(path) {
    if (!path) return null;
    var p = path.split("?")[0].split("#")[0];
    if (/\/reference\/agent-api(\/|$)/.test(p)) return "agent";
    if (/\/reference\/monitors(\/|$)/.test(p)) return "monitors";
    if (/\/reference\/team-management(\/|$)/.test(p)) return "team";
    if (/\/websets\/api(\/|$)/.test(p)) return "websets";
    if (/\/reference\/(search|get-contents|answer)(\/|$)/.test(p)) return "search";
    return null;
  }

  // The switcher popover is the ancestor of the "Search for endpoint..." input
  // that also contains the option rows (anchors with a method pill).
  function findPopover() {
    var input = document.querySelector('input[placeholder*="endpoint" i]');
    if (!input) return null;
    var el = input;
    for (var i = 0; i < 12 && el; i++) {
      if (el.querySelector && el.querySelector("a .method-pill")) return el;
      el = el.parentElement;
    }
    return null;
  }

  function applyFilter() {
    var current = familyOf(window.location.pathname);
    if (!current) return; // not on a scoped API family page; leave switcher as-is
    var popover = findPopover();
    if (!popover) return;

    var anchors = popover.querySelectorAll("a[href]");
    for (var i = 0; i < anchors.length; i++) {
      var a = anchors[i];
      if (!a.querySelector(".method-pill")) continue;
      var fam = familyOf(a.getAttribute("href"));
      // hide only rows we can confidently attribute to a *different* family
      var hide = fam && fam !== current;
      var row = a.parentElement && a.parentElement.children.length === 1 ? a.parentElement : a;
      var next = hide ? "none" : "";
      if (row.style.display !== next) row.style.display = next;
    }
  }

  var scheduled = false;
  function schedule() {
    // Most documentation pages have no API playground. Avoid a document-wide
    // query on every hydration mutation when filtering cannot apply.
    if (!familyOf(window.location.pathname)) return;
    if (scheduled) return;
    scheduled = true;
    (window.requestAnimationFrame || window.setTimeout)(function () {
      scheduled = false;
      applyFilter();
    });
  }

  if (window.MutationObserver) {
    var observer = new MutationObserver(schedule);
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  }
  document.addEventListener("click", schedule, true);
  document.addEventListener("keyup", schedule, true);
  schedule();
})();
