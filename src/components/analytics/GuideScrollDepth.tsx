"use client";

import { useEffect, useRef } from "react";
import { track } from "@/lib/analytics";

/**
 * Fires `guide_scroll` once when the reader reaches ~90% of the page — a
 * "read to the end" signal for a guide, which pairs with pageviews to show
 * which guides actually hold attention vs bounce. One event per load, then the
 * listener detaches; short guides that fit on screen fire on first scroll.
 */
export function GuideScrollDepth({ slug }: { slug: string }) {
  const fired = useRef(false);
  useEffect(() => {
    const onScroll = () => {
      if (fired.current) return;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const ratio = max <= 0 ? 1 : (doc.scrollTop + window.innerHeight) / doc.scrollHeight;
      if (ratio >= 0.9) {
        fired.current = true;
        track("guide_scroll", { item: slug, depth: 90 });
        window.removeEventListener("scroll", onScroll);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [slug]);
  return null;
}
