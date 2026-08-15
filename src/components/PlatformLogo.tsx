"use client";

import { useState } from "react";

/**
 * Renders a platform's brand logo from /public/logos/<slug>.png.
 * If the image is missing or fails to load, we gracefully fall back to the
 * platform's emoji token so a card never renders an empty badge.
 */
export function PlatformLogo({
  slug,
  name,
  emoji,
  className = "",
}: {
  slug: string;
  name: string;
  emoji: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <span className={className}>{emoji}</span>;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/logos/${slug}.png`}
      alt={`${name} logo`}
      width={28}
      height={28}
      loading="lazy"
      className="h-7 w-7 rounded-md object-contain"
      onError={() => setFailed(true)}
    />
  );
}
