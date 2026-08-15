"use client";

import { useEffect, useRef } from "react";

/**
 * Reports the widget's rendered height to the embedding page.
 *
 * An iframe cannot size itself to its content — the host has to be told. So the
 * widget posts its height on every change and the optional one-line script in
 * the embed snippet applies it. Sites that skip the script still get a working
 * widget at the snippet's fixed height; this only removes the inner scrollbar.
 *
 * `postMessage` targets "*" because we cannot know which origin embedded us,
 * and the message carries nothing but a number. The receiving side is the one
 * that must check the origin — and the snippet we hand out does exactly that,
 * so a page running our script only ever resizes for messages from us.
 */
export function EmbedFrame({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || window.parent === window) return;

    let last = 0;
    const report = () => {
      // Round up: a fractional height leaves a one-pixel scrollbar.
      const height = Math.ceil(node.getBoundingClientRect().height);
      if (height === last || height === 0) return;
      last = height;
      window.parent.postMessage({ type: "tct-embed-height", height }, "*");
    };

    report();
    const observer = new ResizeObserver(report);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return <div ref={ref}>{children}</div>;
}
