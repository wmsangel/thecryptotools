import type { CorrelationMatrix } from "@/lib/portfolio/types";

/**
 * A correlation matrix as a coloured grid.
 *
 * Deliberately a real `<table>` with proper header cells rather than a canvas
 * or a grid of divs: the numbers are the content, they need to be selectable,
 * readable by a screen reader and present in the HTML for anything that reads
 * the page without running scripts.
 *
 * Colour is a redundant channel, never the only one — every cell also carries
 * its number, because a heatmap where the meaning lives only in the shade is
 * unreadable to a good share of visitors and prints as grey mush.
 */
export function CorrelationHeatmap({
  matrix,
  caption,
}: {
  matrix: CorrelationMatrix;
  caption?: string;
}) {
  return (
    <figure className="mt-5">
      <div
        className="card overflow-x-auto p-1"
        tabIndex={0}
        role="group"
        aria-label="Correlation matrix, scrolls horizontally"
      >
        <table className="w-full min-w-[420px] border-collapse text-center text-xs">
          <caption className="sr-only">
            Pairwise correlation of daily returns, {matrix.from} to {matrix.to}
          </caption>
          <thead>
            <tr>
              <th scope="col" className="p-2 text-left font-semibold">
                <span className="sr-only">Asset</span>
              </th>
              {matrix.symbols.map((s) => (
                <th key={s} scope="col" className="p-2 font-semibold">
                  {s}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.symbols.map((row, i) => (
              <tr key={row}>
                <th scope="row" className="whitespace-nowrap p-2 text-left font-semibold">
                  {row}
                </th>
                {matrix.values[i].map((value, j) => (
                  <td
                    key={j}
                    className="p-0"
                    // The pair is only obvious from the axes when you can see
                    // both at once, which a screen reader cannot.
                    aria-label={`${row} and ${matrix.symbols[j]}: ${value.toFixed(2)}`}
                  >
                    <span
                      className="flex h-9 items-center justify-center font-mono tabular-nums"
                      // No explicit colour: the tints are light enough for the
                      // theme's own text to stay above 4.5:1 in both modes.
                      style={{ background: shade(value) }}
                    >
                      {i === j ? "—" : value.toFixed(2)}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <figcaption className="muted mt-2 text-xs leading-relaxed">
        {caption ??
          `Correlation of daily returns, ${matrix.from} to ${matrix.to} (${matrix.days.toLocaleString("en-US")} days).`}{" "}
        1.00 means the two moved together every day; 0 means one told you nothing
        about the other; below 0 means they moved apart.
      </figcaption>
    </figure>
  );
}

/**
 * Background for a correlation value.
 *
 * A single hue with varying strength, not a red-to-green ramp: high correlation
 * is not "bad" and low is not "good" — it depends entirely on what the reader
 * wanted — and a traffic-light scale would assert otherwise. Fixed rgba over a
 * theme-neutral base so the same cell reads the same in light and dark.
 */
function shade(value: number): string {
  if (value >= 0) return `rgba(16, 185, 129, ${(0.06 + value * 0.34).toFixed(3)})`;
  return `rgba(99, 102, 241, ${(0.06 + Math.abs(value) * 0.34).toFixed(3)})`;
}
