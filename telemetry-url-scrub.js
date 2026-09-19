(function () {
  // Scrub URL query strings and fragments out of Mintlify's client telemetry
  // before it leaves the browser.
  //
  // Mintlify's bundle records `window.location.href` (and the raw search /
  // hash) on every analytics event and posts batches to
  // `/docs/_mintlify/api/v1/e`. A docs URL that carries a token
  // (`?access_token=…`, `#access_token=…`) would therefore be copied into
  // analytics. The landing proxy sanitises the same batches server-side
  // (node/apps/landing/src/lib/docsTelemetry.ts); this script applies the
  // same rules in the browser so the raw URL is never sent at all. Both layers
  // are intentional: this one closes the leak at the source, the server one
  // is the backstop if this script has not run yet when a batch flushes.
  //
  // Batches are flushed on a 5s timer, so wrapping `fetch` / `sendBeacon` here
  // reliably precedes the first flush of a page view.

  var TELEMETRY_PATH_SUFFIX = "/_mintlify/api/v1/e";
  var DROPPED_KEYS = { $current_url_search: true, $current_url_hash: true };
  var ABSOLUTE_URL = /https?:\/\/[^\s"'<>\\]+/gi;

  function stripUrlQueryAndFragment(value) {
    return value.replace(ABSOLUTE_URL, function (url) {
      var q = url.indexOf("?");
      var h = url.indexOf("#");
      var cut = q === -1 ? h : h === -1 ? q : Math.min(q, h);
      return cut === -1 ? url : url.slice(0, cut);
    });
  }

  function sanitizeValue(value) {
    if (typeof value === "string") return stripUrlQueryAndFragment(value);
    if (Array.isArray(value)) return value.map(sanitizeValue);
    if (value && typeof value === "object") {
      var out = {};
      for (var key in value) {
        if (!Object.prototype.hasOwnProperty.call(value, key)) continue;
        if (DROPPED_KEYS[key]) continue;
        out[key] = sanitizeValue(value[key]);
      }
      return out;
    }
    return value;
  }

  function isTelemetryUrl(input) {
    var href;
    if (typeof input === "string") href = input;
    else if (input && typeof input.url === "string") href = input.url;
    else if (input && typeof input.href === "string") href = input.href;
    else return false;
    var pathname;
    try {
      pathname = new URL(href, window.location.href).pathname;
    } catch (e) {
      return false;
    }
    return pathname.slice(-TELEMETRY_PATH_SUFFIX.length) === TELEMETRY_PATH_SUFFIX;
  }

  // Only string bodies are rewritten; the bundle serialises batches with
  // JSON.stringify. Anything else (Blob, FormData, malformed JSON) is passed
  // through untouched and left to the server-side sanitiser.
  function sanitizeBody(body) {
    if (typeof body !== "string") return body;
    var parsed;
    try {
      parsed = JSON.parse(body);
    } catch (e) {
      return body;
    }
    return JSON.stringify(sanitizeValue(parsed));
  }

  if (typeof window.fetch === "function") {
    var originalFetch = window.fetch;
    window.fetch = function (input, init) {
      if (!isTelemetryUrl(input)) return originalFetch.call(this, input, init);
      var self = this;
      if (init && init.body !== undefined) {
        var patched = {};
        for (var key in init) {
          if (Object.prototype.hasOwnProperty.call(init, key)) patched[key] = init[key];
        }
        patched.body = sanitizeBody(init.body);
        return originalFetch.call(self, input, patched);
      }
      // Body carried on a Request object: read it, then send a copy with the
      // sanitised body. The clone keeps the original Request readable.
      if (typeof Request === "function" && input instanceof Request && input.body !== null) {
        return input
          .clone()
          .text()
          .then(function (text) {
            return originalFetch.call(self, new Request(input, { body: sanitizeBody(text) }), init);
          });
      }
      return originalFetch.call(self, input, init);
    };
  }

  if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
    var originalSendBeacon = navigator.sendBeacon;
    navigator.sendBeacon = function (url, data) {
      if (isTelemetryUrl(url)) {
        return originalSendBeacon.call(this, url, sanitizeBody(data));
      }
      return originalSendBeacon.call(this, url, data);
    };
  }
})();
