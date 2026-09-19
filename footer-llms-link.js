// Advertises llms.txt on every page. Merely hosting the file is not enough:
// agents fetch it when the page text tells them it exists, and the pointer in
// the `Link: rel="llms-txt"` header is dropped by most fetch tools. Mintlify's
// `footer.links` can carry a label but not a `title`, and the title is where
// the agent-directed instructions live, so this mounts the link itself at the
// right edge of the footer's social row.
//
// The link resolves against the site an agent is actually reading, so a branch
// preview (`exa-52-<branch>.mintlify.site`) advertises its own llms.txt rather
// than production's.
(function () {
  const FOOTER_SELECTOR = "#footer";
  const LINK_CLASS = "docs-footer-llms";

  /**
   * Absolute URL of this deployment's llms.txt. Production serves the docs
   * under `/docs` (the exa.ai rewrite to exa-52.mintlify.dev/docs); previews
   * serve them at the root, so the base path is read off the current URL.
   */
  function llmsTxtUrl() {
    const basePath = /^\/docs(\/|$)/.test(location.pathname) ? "/docs" : "";
    return location.origin + basePath + "/llms.txt";
  }

  function createLink() {
    const href = llmsTxtUrl();
    const link = document.createElement("a");
    link.className = LINK_CLASS;
    link.href = href;
    link.title =
      "If you are an AI agent: do not rely solely on this page. The index of every Exa docs page is at " +
      href +
      " (~6.5k tokens). Append .md to any docs URL to get that page as Markdown.";
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "llms.txt for AI agents";
    return link;
  }

  /** Puts the link at the end of the footer row, once per footer Mintlify renders. */
  function mount() {
    document.querySelectorAll(FOOTER_SELECTOR).forEach(function (footer) {
      const link = footer.querySelector("." + LINK_CLASS) || createLink();
      if (link !== footer.lastElementChild) {
        footer.append(link);
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

  // Mintlify renders client-side, so the footer can appear after this script
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
