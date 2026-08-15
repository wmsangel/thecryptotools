/**
 * Tiny inline SVG price line — no chart library, no external request.
 *
 * The series is normalised to its own min/max, so the shape shows the coin's
 * own 7-day path rather than an absolute scale it shares with nothing else.
 * Colour follows the net direction over the window (first point vs last).
 */
export function Sparkline({
  data,
  width = 80,
  height = 26,
  label,
}: {
  data: number[];
  width?: number;
  height?: number;
  label?: string;
}) {
  if (data.length < 2) {
    return <span className="muted text-xs">—</span>;
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min;
  // A dead-flat series (stablecoins) would divide by zero — draw it mid-height.
  const y = (v: number) => (range === 0 ? height / 2 : height - ((v - min) / range) * height);
  const stepX = width / (data.length - 1);

  const d = data.map((v, i) => `${i === 0 ? "M" : "L"}${(i * stepX).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");
  const up = data[data.length - 1] >= data[0];
  const stroke = up ? "#10b981" : "#ef4444";

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      role="img"
      aria-label={label ?? "7 day price trend"}
      className="overflow-visible"
      preserveAspectRatio="none"
    >
      <path d={d} fill="none" stroke={stroke} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}
