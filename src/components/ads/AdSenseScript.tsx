import { site } from "@/lib/site";

/**
 * The Google AdSense loader. Must sit in <head> on every page — Google reads it
 * to verify site ownership and it is what serves Auto ads.
 *
 * ORDER MATTERS: this has to render AFTER <ConsentModeScript /> in the layout
 * head, so the denied-by-default consent state is already on the dataLayer when
 * the tag boots. Rendered as a plain <script async> rather than next/script
 * because the static export has no runtime to hydrate a script strategy, and
 * Google's own snippet is exactly this.
 */
export function AdSenseScript() {
  if (!site.adsenseClient) return null;
  return (
    <script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${site.adsenseClient}`}
      crossOrigin="anonymous"
    />
  );
}
