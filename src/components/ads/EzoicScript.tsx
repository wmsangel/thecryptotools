/**
 * Ezoic standalone (JavaScript integration) loader — the same snippet used on
 * our other sites (e.g. calclumen). Must sit in <head> on every page so Ezoic
 * can verify the connection ("Check Connection" / Incubator Program) and place
 * ads via its own script.
 *
 * Plain <script> tags for the same reason as AdSenseScript: the static export
 * has no runtime to hydrate a next/script strategy, and this is Ezoic's own
 * snippet verbatim. Ezoic runs its own consent CMP, so it manages consent itself.
 *
 * Only rendered in the (site) layout — never on embeddable widgets, which are
 * guests on third-party pages and must not carry our ad stack.
 */
export function EzoicScript() {
  return (
    <>
      <script async src="https://www.ezojs.com/ezoic/sa.min.js" />
      <script
        dangerouslySetInnerHTML={{
          __html:
            "window.ezstandalone = window.ezstandalone || {}; ezstandalone.cmd = ezstandalone.cmd || [];",
        }}
      />
    </>
  );
}
