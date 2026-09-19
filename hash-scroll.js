(function () {
  var TIMEOUT = 10000;
  var pendingObserver = null;
  var pendingTimeout = null;

  function stopWaiting() {
    if (pendingObserver) {
      pendingObserver.disconnect();
      pendingObserver = null;
    }
    if (pendingTimeout) {
      clearTimeout(pendingTimeout);
      pendingTimeout = null;
    }
  }

  function scrollToHash() {
    var hash = window.location.hash;
    if (!hash) return false;

    var id = hash.substring(1);
    var el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      return true;
    }
    return false;
  }

  function waitAndScroll() {
    stopWaiting();

    // Next calls replaceState during hydration even when the URL has no hash.
    // Do not observe every DOM mutation for ten seconds in that common case.
    if (!window.location.hash || scrollToHash()) return;

    pendingObserver = new MutationObserver(function () {
      if (scrollToHash()) {
        stopWaiting();
      }
    });

    pendingObserver.observe(document.body, { childList: true, subtree: true });
    pendingTimeout = setTimeout(function () {
      stopWaiting();
    }, TIMEOUT);
  }

  waitAndScroll();

  window.addEventListener("hashchange", function () {
    waitAndScroll();
  });

  var _pushState = history.pushState;
  var _replaceState = history.replaceState;
  history.pushState = function () {
    _pushState.apply(this, arguments);
    waitAndScroll();
  };
  history.replaceState = function () {
    _replaceState.apply(this, arguments);
    waitAndScroll();
  };
})();
