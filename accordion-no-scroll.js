(function () {
  var SEARCH_QUICKSTART_PATH = "/search/quickstart";

  function shouldPreventAccordionHashScroll() {
    var pathname = window.location && window.location.pathname;
    var normalizedPath = pathname ? pathname.replace(/\/+$/, "") : "";

    return normalizedPath === SEARCH_QUICKSTART_PATH;
  }

  function preventAccordionHashScroll(event) {
    if (!shouldPreventAccordionHashScroll()) {
      return;
    }

    const summary = event.target && event.target.closest && event.target.closest("summary");

    if (!summary || !summary.closest(".accordion")) {
      return;
    }

    event.stopImmediatePropagation();
  }

  document.addEventListener("click", preventAccordionHashScroll, true);
})();
