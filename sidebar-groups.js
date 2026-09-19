// Expand-only reveal for sidebar groups. Mintlify remounts #navigation-items
// on every soft navigation, so a mount-triggered animation would replay when an
// already-expanded group re-renders. The `data-expanding` flag marks the one
// group the user just expanded so styles.css can gate the reveal on it instead
// of on mounting. React's root-delegated click handler flips aria-expanded and
// flushes it synchronously during bubble, so the flag must be set at document
// capture to still see `false`.
(function () {
  const GROUP_BUTTON = '#navigation-items button[aria-expanded="false"]';
  const EXPANDING = "data-expanding";
  const SAFETY_MS = 400; // > --motion-duration-slow; clears if animationend never fires

  document.addEventListener(
    "click",
    function (event) {
      const button = event.target instanceof Element && event.target.closest(GROUP_BUTTON);
      if (!button || !button.parentElement) return;
      const group = button.parentElement;
      group.setAttribute(EXPANDING, "");
      setTimeout(function () {
        group.removeAttribute(EXPANDING);
      }, SAFETY_MS);
    },
    true,
  );

  document.addEventListener("animationend", function (event) {
    const ul = event.target;
    // A nested group's animation bubbles too; only the flagged group clears.
    if (ul instanceof Element && ul.parentElement && ul.parentElement.hasAttribute(EXPANDING)) {
      ul.parentElement.removeAttribute(EXPANDING);
    }
  });
})();
