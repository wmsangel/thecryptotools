/**
 * TheCryptoTools brand mark — a coin with a rising chart cut out of it. Inline
 * SVG so it scales crisply and needs no image request. Size it with className.
 *
 * Kept in sync with `public/icon.svg` (the favicon), which carries the notes on
 * why the mark is shaped this way. If you change one, change both — the tab
 * icon and the header should read as the same thing.
 */
export function Logo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label="TheCryptoTools logo">
      <defs>
        <linearGradient id="tctLogoGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#16b378" />
          <stop offset="1" stopColor="#2dd4bf" />
        </linearGradient>
        <mask id="tctLogoChart">
          <rect width="64" height="64" fill="#fff" />
          <path
            d="M20 41 L28 32 L35 37 L45 24"
            stroke="#000"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </mask>
      </defs>
      <rect width="64" height="64" rx="15" fill="url(#tctLogoGradient)" />
      <circle cx="32" cy="33" r="19" fill="#fff" mask="url(#tctLogoChart)" />
    </svg>
  );
}
