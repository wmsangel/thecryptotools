import { site } from "@/lib/site";

/**
 * Google Analytics 4 (gtag.js).
 *
 * ORDER MATTERS: must render AFTER <ConsentModeScript /> in the layout head so
 * `analytics_storage: 'denied'` is already on the dataLayer when the tag boots.
 * With consent denied GA4 still runs, but in cookieless ping mode — no _ga
 * cookie is written until the visitor accepts analytics in the banner, at which
 * point src/lib/consent.ts → syncGoogleConsent sends the update.
 *
 * The usual snippet redefines gtag/dataLayer; we deliberately do NOT, because
 * ConsentModeScript already created them and re-running the definition would
 * drop the consent defaults sitting in the queue. The inline part here is only
 * the `js` + `config` pair.
 *
 * Plain <script> rather than next/script: the static export has no runtime to
 * hydrate a script strategy with.
 *
 * HOST-GATED: GA only loads on the production host. The Pages project is also
 * served on *.pages.dev mirrors (and the page runs on localhost in dev); the
 * _middleware 301s the mirrors, but this is the belt-and-suspenders backstop so
 * analytics never fires anywhere but the real domain even if that redirect is
 * bypassed. gtag/dataLayer and the consent defaults are set unconditionally by
 * ConsentModeScript (they set no cookies and make no requests), so a guarded
 * no-op here is safe.
 *
 * Client-side navigation (next/link) does not re-fire `config`. GA4's Enhanced
 * measurement → "Page changes based on browser history events" — on by default
 * — covers those, so we do NOT send manual page_view events; doing both would
 * double-count every in-app navigation.
 */
export function GoogleAnalytics() {
  if (!site.gaMeasurementId) return null;
  const host = new URL(site.url).hostname;
  const id = site.gaMeasurementId;
  const code =
    `(function(){if(location.hostname!==${JSON.stringify(host)})return;` +
    `var s=document.createElement('script');s.async=true;` +
    `s.src='https://www.googletagmanager.com/gtag/js?id=${id}';` +
    `document.head.appendChild(s);` +
    `gtag('js',new Date());gtag('config','${id}');})();`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
