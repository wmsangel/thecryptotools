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
 * Plain <script async> rather than next/script: the static export has no
 * runtime to hydrate a script strategy with.
 *
 * Client-side navigation (next/link) does not re-fire `config`. GA4's Enhanced
 * measurement → "Page changes based on browser history events" — on by default
 * — covers those, so we do NOT send manual page_view events; doing both would
 * double-count every in-app navigation.
 */
export function GoogleAnalytics() {
  if (!site.gaMeasurementId) return null;
  const code = `gtag('js',new Date());gtag('config','${site.gaMeasurementId}');`;
  return (
    <>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${site.gaMeasurementId}`}
      />
      <script dangerouslySetInnerHTML={{ __html: code }} />
    </>
  );
}
