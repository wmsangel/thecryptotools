"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

/**
 * Site-wide click tracking for affiliate links.
 *
 * A DELEGATED listener rather than an onClick per link, for two reasons: the
 * pages that render those links (/exchanges, guides, tool pages) are server
 * components, and converting them to client components just to attach a
 * handler would ship the whole platform registry to the browser. And a
 * delegated listener cannot drift — any <a data-affiliate="slug"> added later,
 * anywhere, is tracked with no extra wiring.
 *
 * `auxclick` is included because opening a referral link in a new tab with the
 * middle button is exactly what an interested visitor does, and it does not
 * fire `click`.
 */
export function OutboundTracker() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      // Left and middle button only — a right-click is a context menu, not a visit.
      if (event.button > 1) return;
      const target = event.target as Element | null;
      const link = target?.closest?.("a") as HTMLAnchorElement | null;
      if (!link) return;
      // Internal spotlight promo (home-page rotating slot): its own event, so
      // we can see which featured page the rotation actually sends people to.
      if (link.dataset.spotlight) {
        track("spotlight_click", { target: link.dataset.spotlight, page_path: window.location.pathname });
        return;
      }
      // Platform from the explicit attribute, else from a /go/<slug> href — so
      // markdown-rendered /go links in guides (no data-affiliate) are tracked too.
      let platform = link.dataset.affiliate;
      if (!platform) {
        const m = (link.getAttribute("href") || "").match(/\/go\/([a-z0-9-]+)\/?/i);
        if (m) platform = m[1];
      }
      if (!platform) return; // not an affiliate link
      track("affiliate_click", {
        platform,
        placement: link.dataset.affiliatePlacement ?? "link",
        page_path: window.location.pathname,
      });
    }
    document.addEventListener("click", onClick);
    document.addEventListener("auxclick", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("auxclick", onClick);
    };
  }, []);

  return null;
}
