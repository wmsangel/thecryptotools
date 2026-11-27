/**
 * Attributes for an affiliate anchor that goes through our own /go gate.
 *
 * The markup deliberately carries NO /go URL and no partner URL: `href="#"` plus
 * `data-go="<id>"`. OutboundTracker writes the signed, short-lived /go URL into
 * the href at the moment of a trusted press (see src/lib/go-token.ts), so a bot
 * that scrapes the HTML — or replays a stored list of /go URLs — gets nothing
 * that works. `data-go-s` is the placement (page/slot), which becomes the
 * network sub-id server-side: `thecryptotools-<placement>`.
 *
 * `rel` has no `noreferrer` on purpose: the soft path for browsers too old to
 * send Sec-Fetch-User relies on a same-origin Referer.
 */
export function goProps(id: string, placement: string, q?: string) {
  return {
    href: "#",
    target: "_blank",
    rel: "sponsored nofollow noopener",
    "data-go": id,
    "data-go-s": placement,
    ...(q ? { "data-go-q": q } : {}),
    // Kept for the GA4 affiliate_click event (OutboundTracker reads these).
    "data-affiliate": id,
    "data-affiliate-placement": placement,
  } as const;
}
