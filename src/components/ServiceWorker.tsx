"use client";

import { useEffect } from "react";

/**
 * Registers the service worker that makes the site work offline.
 *
 * Registration is deferred to the `load` event: a service worker install
 * competes for bandwidth with the page that is still rendering, and offline
 * support is worth nothing to a first-time visitor who is currently online.
 *
 * There is no update prompt and no `skipWaiting` message channel on purpose.
 * The worker treats navigations as network-first, so a new deploy is picked up
 * on the next page load regardless of which worker version is in control — the
 * usual "a new version is available, reload?" toast would be noise.
 */
export function ServiceWorker() {
  useEffect(() => {
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
    const register = () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        /* Private mode, an unsupported browser, or the file is missing —
           the site works exactly as before without it. */
      });
    };
    if (document.readyState === "complete") register();
    else {
      window.addEventListener("load", register);
      return () => window.removeEventListener("load", register);
    }
  }, []);

  return null;
}
