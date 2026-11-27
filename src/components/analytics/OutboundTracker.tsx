"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";
import { goUrl } from "@/lib/go-token";

/**
 * Site-wide click handling for affiliate and outbound links.
 *
 * Two jobs, one DELEGATED listener (the pages that render these links are server
 * components; a handler per link would mean shipping the platform registry to the
 * browser, and a delegated listener cannot drift):
 *
 * 1. ARM affiliate links. They are rendered as `<a href="#" data-go="<id>">` —
 *    the HTML carries no /go URL and no partner URL. On a TRUSTED press
 *    (pointer/touch/Enter/context-menu/click) we write the signed, 15-minute
 *    /go URL into the href just before the browser follows it, so the navigation
 *    is still a plain user-activated link click (Sec-Fetch-User: ?1, same-origin)
 *    and middle-click / "open in new tab" keep working. A scripted (untrusted)
 *    click leaves href="#" and is cancelled. Why: src/lib/go-token.ts.
 * 2. ANALYTICS. affiliate_click for affiliate links; outbound_click{host} for
 *    other external links (host only, no path/query — no personal data).
 *
 * `auxclick` is included because opening a referral link in a new tab with the
 * middle button is exactly what an interested visitor does, and it does not fire
 * `click`.
 */

function goAnchor(e: Event): HTMLAnchorElement | null {
  const el = e.target as Element | null;
  return (el?.closest?.("a[data-go]") as HTMLAnchorElement | null) ?? null;
}

/** Placement for the sub-id: the link's own, else derived from the page path. */
function placementOf(a: HTMLAnchorElement): string {
  if (a.dataset.goS) return a.dataset.goS;
  const last = window.location.pathname.split("/").filter(Boolean).pop() || "home";
  return `inline-${last.replace(/[^a-z0-9-]/gi, "").toLowerCase().slice(0, 36)}`;
}

/** Write a fresh signed /go URL into the anchor. Trusted events only. */
function arm(e: Event): HTMLAnchorElement | null {
  const a = goAnchor(e);
  if (!a) return null;
  const id = a.dataset.go;
  if (!e.isTrusted || !id) return a;
  a.setAttribute("href", goUrl(id, placementOf(a), a.dataset.goQ));
  return a;
}

export function OutboundTracker() {
  useEffect(() => {
    // Arm early (press, touch, Enter, context menu) so every way of following the
    // link — click, middle-click, "open in new tab" — gets a live URL.
    function onArm(e: Event) {
      if (e instanceof KeyboardEvent && e.key !== "Enter") return;
      arm(e);
    }

    function onClick(event: MouseEvent) {
      // Left and middle button only — a right-click is a context menu, not a visit.
      if (event.button > 1) return;

      const go = arm(event);
      if (go) {
        // Never follow the placeholder: no token means no destination.
        if ((go.getAttribute("href") || "#") === "#") {
          event.preventDefault();
          return;
        }
        const platform = go.dataset.affiliate || go.dataset.go || "unknown";
        track("affiliate_click", {
          platform,
          placement: go.dataset.affiliatePlacement ?? "link",
          page_path: window.location.pathname,
        });
        return;
      }

      const target = event.target as Element | null;
      const link = target?.closest?.("a") as HTMLAnchorElement | null;
      if (!link) return;
      // Internal spotlight promo (home-page rotating slot): its own event, so
      // we can see which featured page the rotation actually sends people to.
      if (link.dataset.spotlight) {
        track("spotlight_click", { target: link.dataset.spotlight, page_path: window.location.pathname });
        return;
      }
      // Any other external link — a generic outbound_click{host} (network event
      // standard). Host only, no path or query, so no personal data.
      try {
        const u = new URL(link.getAttribute("href") || "", window.location.href);
        if (u.host && u.host !== window.location.host && /^https?:$/.test(u.protocol)) {
          track("outbound_click", { host: u.host, page_path: window.location.pathname });
        }
      } catch {
        // A malformed href must never break the page.
      }
    }

    const opts = { capture: true } as const;
    const armEvents = ["pointerdown", "mousedown", "touchstart", "keydown", "contextmenu"];
    for (const t of armEvents) document.addEventListener(t, onArm, opts);
    document.addEventListener("click", onClick, opts);
    document.addEventListener("auxclick", onClick, opts);

    // cta_view: the funnel step BEFORE affiliate_click — an affiliate link actually
    // scrolled into view. Once per placement+platform per page load, so the
    // view→click rate per placement is measurable (a CTA that is never seen cannot
    // convert). Links are rendered both server-side and later by client components,
    // so new anchors are picked up by a MutationObserver.
    let io: IntersectionObserver | null = null;
    let mo: MutationObserver | null = null;
    if ("IntersectionObserver" in window) {
      const seen = new Set<string>();
      io = new IntersectionObserver(
        (entries) => {
          for (const en of entries) {
            if (!en.isIntersecting) continue;
            const a = en.target as HTMLAnchorElement;
            io?.unobserve(a);
            const platform = a.dataset.affiliate || a.dataset.go || "unknown";
            const placement = a.dataset.affiliatePlacement ?? "link";
            const key = `${placement}|${platform}`;
            if (seen.has(key)) continue;
            seen.add(key);
            track("cta_view", { platform, placement, page_path: window.location.pathname });
          }
        },
        { threshold: 0.6 },
      );
      const watch = (root: ParentNode) =>
        root.querySelectorAll?.("a[data-go]").forEach((a) => io?.observe(a));
      watch(document);
      mo = new MutationObserver((muts) => {
        for (const m of muts) {
          m.addedNodes.forEach((n) => {
            if (n.nodeType !== 1) return;
            const el = n as Element;
            if (el.matches?.("a[data-go]")) io?.observe(el);
            watch(el);
          });
        }
      });
      mo.observe(document.body, { childList: true, subtree: true });
    }

    return () => {
      for (const t of armEvents) document.removeEventListener(t, onArm, opts);
      document.removeEventListener("click", onClick, opts);
      document.removeEventListener("auxclick", onClick, opts);
      io?.disconnect();
      mo?.disconnect();
    };
  }, []);

  return null;
}
