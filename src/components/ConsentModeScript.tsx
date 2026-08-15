/**
 * Google Consent Mode v2 defaults. Must run in <head> BEFORE any Google tag, so
 * ads/analytics start in a denied state and only relax after the visitor opts
 * in through the cookie banner (see src/lib/consent.ts → syncGoogleConsent).
 *
 * Kept INLINE deliberately. Next hoists async <script src> tags to the top of
 * <head>, so the AdSense loader appears above this in the source — but that tag
 * is async and cannot execute until a cross-origin fetch completes, whereas
 * this runs the moment the parser reaches it, from HTML already in the buffer.
 * `wait_for_update: 500` covers the remaining margin, which is exactly what
 * Google documents it for. Do NOT move this to an external file: a blocking
 * same-origin request would be slower AND could lose the race to a cached
 * adsbygoogle.js.
 *
 * Safe to ship even while ads are off: it only defines gtag/dataLayer.
 */
export function ConsentModeScript() {
  const code = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=window.gtag||gtag;
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500});
try{var r=localStorage.getItem('tct-consent');if(r){var c=JSON.parse(r);if(c&&c.v===1){gtag('consent','update',{ad_storage:c.ads?'granted':'denied',ad_user_data:c.ads?'granted':'denied',ad_personalization:c.ads?'granted':'denied',analytics_storage:c.analytics?'granted':'denied'});}}}catch(e){}`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
