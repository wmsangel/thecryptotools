/**
 * ============================================================================
 * TheCryptoTools service worker.
 * ============================================================================
 * The homepage has claimed "Instant & offline" since the first build, and it
 * was half true: every calculator runs in the browser, but reaching one still
 * needed the network. This closes that gap — once a page has been visited, it
 * opens again with no connection at all.
 *
 * Three deliberate rules:
 *
 *  1. NAVIGATIONS ARE NETWORK-FIRST. The site deploys as a zip of static HTML;
 *     a cache-first page would keep serving the previous build after an upload,
 *     with no way for a visitor to know. Network wins whenever it answers, and
 *     the cache is the fallback, not the source of truth.
 *
 *  2. HASHED ASSETS ARE CACHE-FIRST, FOREVER. /_next/static/* filenames contain
 *     a content hash, so a given URL's bytes can never change. Revalidating
 *     them is pure latency.
 *
 *  3. NOTHING WITH A QUERY STRING, AND NOTHING CROSS-ORIGIN, IS EVER STORED.
 *     Tool inputs are carried in the query string for shareable links — caching
 *     those would write somebody's numbers to disk. CoinGecko and Binance
 *     responses are prices: a stale price is worse than no price.
 *
 * Bump CACHE_VERSION to evict everything on the next visit.
 */
const CACHE_VERSION = "tct-v1";
const PAGES = `${CACHE_VERSION}-pages`;
const ASSETS = `${CACHE_VERSION}-assets`;

/** Enough to render something useful on a cold offline start. */
const PRECACHE = ["/", "/tools/", "/offline/"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(PAGES)
      .then((c) => c.addAll(PRECACHE))
      .catch(() => {
        /* A precache miss must never block installation. */
      })
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => !k.startsWith(CACHE_VERSION)).map((k) => caches.delete(k))),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // live prices: always the network
  if (url.search) return; // shared tool inputs — never written to disk

  // Hashed build output: immutable, so cache-first with no revalidation.
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(
      caches.match(request).then(
        (hit) =>
          hit ||
          fetch(request).then((res) => {
            if (res.ok) {
              const copy = res.clone();
              caches.open(ASSETS).then((c) => c.put(request, copy));
            }
            return res;
          }),
      ),
    );
    return;
  }

  // Pages: network first, cache as the fallback, /offline/ as the last resort.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(PAGES).then((c) => c.put(request, copy));
          }
          return res;
        })
        .catch(() =>
          caches
            .match(request)
            .then((hit) => hit || caches.match("/offline/") || caches.match("/")),
        ),
    );
    return;
  }

  // Same-origin images, icons and generated data: serve from cache, refresh behind.
  if (/\.(png|svg|ico|webp|json|txt|md)$/.test(url.pathname)) {
    event.respondWith(
      caches.match(request).then((hit) => {
        const network = fetch(request)
          .then((res) => {
            if (res.ok) {
              const copy = res.clone();
              caches.open(ASSETS).then((c) => c.put(request, copy));
            }
            return res;
          })
          .catch(() => hit);
        return hit || network;
      }),
    );
  }
});
