"use client";

import { useMemo, useState } from "react";
import { site } from "@/lib/site";
import { track } from "@/lib/analytics";

export interface WidgetTool {
  slug: string;
  title: string;
  category: string;
}

/**
 * Picks a calculator and builds the paste-ready snippet for it.
 *
 * The snippet is generated rather than shown as a static example because the
 * attribution anchor has to name the specific tool — a generic one would be
 * both less useful to the reader and worse for us.
 */
export function WidgetBuilder({ tools }: { tools: WidgetTool[] }) {
  const [slug, setSlug] = useState(tools[0]?.slug ?? "profit-calculator");
  const [height, setHeight] = useState(620);
  const [autoHeight, setAutoHeight] = useState(true);
  const [theme, setTheme] = useState<"auto" | "light" | "dark">("auto");
  const [copied, setCopied] = useState<"snippet" | "script" | null>(null);

  const tool = tools.find((t) => t.slug === slug) ?? tools[0];
  const src = `/embed/${tool.slug}/${theme === "auto" ? "" : `?theme=${theme}`}`;

  const snippet = useMemo(
    () =>
      [
        `<iframe src="${site.url}${src}"`,
        `        title="${tool.title}"`,
        `        style="width:100%;max-width:760px;height:${height}px;border:0;border-radius:14px"`,
        `        loading="lazy"></iframe>`,
        `<p style="font-size:12px;margin:6px 0 0">`,
        `  <a href="${site.url}/tools/${tool.slug}/">${tool.title}</a> by ${site.name}`,
        `</p>`,
      ].join("\n"),
    [tool, height, src],
  );

  const script = useMemo(
    () =>
      [
        `<script>`,
        `window.addEventListener("message", function (e) {`,
        `  if (e.origin !== "${site.url}") return;`,
        `  if (!e.data || e.data.type !== "tct-embed-height") return;`,
        `  document.querySelectorAll('iframe[src^="${site.url}/embed/"]').forEach(function (f) {`,
        `    if (f.contentWindow === e.source) f.style.height = e.data.height + "px";`,
        `  });`,
        `});`,
        `<\/script>`,
      ].join("\n"),
    [],
  );

  async function copy(what: "snippet" | "script") {
    try {
      await navigator.clipboard.writeText(what === "snippet" ? snippet : script);
      setCopied(what);
      track("embed_copy", { tool_slug: tool.slug, part: what, theme });
      setTimeout(() => setCopied(null), 1800);
    } catch {
      /* clipboard blocked — the code is selectable on screen either way */
    }
  }

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)] lg:gap-8">
      <div className="card h-max p-6">
        <h2 className="eyebrow mb-5">Build your embed</h2>

        <label className="mb-5 block">
          <span className="mb-1 block text-sm font-medium">Calculator</span>
          <select className="input-field" value={slug} onChange={(e) => setSlug(e.target.value)}>
            {tools.map((t) => (
              <option key={t.slug} value={t.slug}>
                {t.title}
              </option>
            ))}
          </select>
        </label>

        <div className="mb-5">
          <span className="mb-1 block text-sm font-medium">Theme</span>
          <div className="flex gap-2">
            {(
              [
                ["auto", "Match visitor"],
                ["light", "Light"],
                ["dark", "Dark"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setTheme(id)}
                aria-pressed={theme === id}
                className={`flex-1 rounded-xl border px-2 py-2 text-xs font-semibold transition ${
                  theme === id
                    ? "border-brand-500 bg-brand-500/10 text-brand-ink"
                    : "border-[var(--border)] hover:border-brand-500/50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <span className="muted mt-1.5 block text-xs leading-relaxed">
            Pick the one that matches your page. &ldquo;Match visitor&rdquo; follows their system
            setting, which can leave a dark widget on a light page.
          </span>
        </div>

        <label className="mb-5 block">
          <span className="mb-1 flex items-center justify-between text-sm font-medium">
            <span>Starting height</span>
            <span className="muted text-xs">{height}px</span>
          </span>
          <input
            type="range"
            min={380}
            max={900}
            step={20}
            value={height}
            onChange={(e) => setHeight(Number(e.target.value))}
            className="w-full accent-brand-500"
          />
        </label>

        <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-[var(--bg-subtle)] px-4 py-3">
          <input
            type="checkbox"
            checked={autoHeight}
            onChange={(e) => setAutoHeight(e.target.checked)}
            className="mt-0.5 accent-brand-500"
          />
          <span className="text-sm">
            <span className="font-semibold">Add the auto-height script</span>
            <span className="muted mt-0.5 block text-xs leading-relaxed">
              The widget tells your page how tall it needs to be, so there is no scrollbar inside
              the frame. Optional — without it the frame stays at the height above.
            </span>
          </span>
        </label>
      </div>

      <div>
        <div className="card p-6">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="eyebrow">Paste this</h2>
            <button type="button" className="btn-primary px-3 py-1.5 text-xs" onClick={() => copy("snippet")}>
              {copied === "snippet" ? "✓ Copied" : "Copy snippet"}
            </button>
          </div>
          <pre className="overflow-x-auto rounded-lg bg-[var(--bg)] p-3 text-xs leading-relaxed" tabIndex={0}>{snippet}</pre>

          {autoHeight && (
            <>
              <div className="mb-3 mt-6 flex items-center justify-between gap-3">
                <h2 className="eyebrow">…and this, once per page</h2>
                <button type="button" className="btn-ghost px-3 py-1.5 text-xs" onClick={() => copy("script")}>
                  {copied === "script" ? "✓ Copied" : "Copy script"}
                </button>
              </div>
              <pre className="overflow-x-auto rounded-lg bg-[var(--bg)] p-3 text-xs leading-relaxed" tabIndex={0}>{script}</pre>
            </>
          )}
        </div>

        <div className="mt-6">
          <h2 className="eyebrow mb-3">Live preview</h2>
          <iframe
            key={`${tool.slug}-${height}-${theme}`}
            src={src}
            title={`${tool.title} preview`}
            style={{ width: "100%", maxWidth: 760, height, border: 0, borderRadius: 14 }}
            className="bg-[var(--bg-elevated)]"
          />
          <p className="muted mt-2 text-xs">
            <a href={`/tools/${tool.slug}/`} className="font-semibold text-brand-ink hover:underline">
              {tool.title}
            </a>{" "}
            by {site.name} — this credit line is part of the snippet.
          </p>
        </div>
      </div>
    </div>
  );
}
