"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { track } from "@/lib/analytics";
import { recordToolUse } from "@/lib/tool-prefs";
import {
  THEMES,
  type Theme,
  type DeviceKind,
  render,
  loadLogos,
  generateWallet,
  generatePortfolio,
  walletJson,
  portfolioJson,
  logoSlugsForWallet,
  logoSlugsForPortfolio,
  type ChainKey,
  type WalletVM,
  type PortfolioVM,
  type RenderOpts,
  type Size,
} from "./fake-studio-core";

const DEVICES: { id: DeviceKind; label: string; icon: string }[] = [
  { id: "iphone", label: "iPhone", icon: "􀟜" },
  { id: "android", label: "Android", icon: "🤖" },
  { id: "none", label: "No frame", icon: "▢" },
];

/* ------------------------------------------------------ shared canvas --- */

function useStudioCanvas(opts: RenderOpts | null, logoSlugs: string[]) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const [cssSize, setCssSize] = useState<Size>({ w: 464, h: 792 });

  useEffect(() => {
    let alive = true;
    loadLogos(logoSlugs).then(() => { if (alive) setReady(true); });
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!opts || !canvasRef.current) return;
    const size = render(canvasRef.current, opts);
    setCssSize(size);
  }, [opts, ready]);

  return { canvasRef, cssSize };
}

/* --------------------------------------------------------- UI helpers --- */

function SegGroup<T extends string>({
  value,
  onChange,
  options,
  label,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { id: T; label: string }[];
  label: string;
}) {
  return (
    <div>
      <div className="mb-1.5 text-xs font-semibold muted">{label}</div>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            aria-pressed={value === o.id}
            className={`chip !px-3 !py-1.5 text-xs transition ${
              value === o.id ? "border-brand-500 bg-brand-500/10 text-brand-ink" : "hover:border-brand-500/50"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function ThemeRow({ value, onChange }: { value: string; onChange: (t: Theme) => void }) {
  return (
    <div>
      <div className="mb-1.5 text-xs font-semibold muted">Style</div>
      <div className="flex flex-wrap gap-2">
        {THEMES.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t)}
            aria-pressed={value === t.id}
            title={t.name}
            className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition ${
              value === t.id ? "border-brand-500 bg-brand-500/10 text-brand-ink" : "border-[var(--border)] hover:border-brand-500/50"
            }`}
          >
            <span
              className="h-4 w-4 rounded-full border border-black/10"
              style={{ background: `linear-gradient(135deg, ${t.screen[0]}, ${t.accent})` }}
              aria-hidden
            />
            {t.name}
          </button>
        ))}
      </div>
    </div>
  );
}

function Actions({
  onDownload,
  onCopy,
  copied,
}: {
  onDownload: () => void;
  onCopy: () => void;
  copied: boolean;
}) {
  return (
    <div className="mt-5 flex flex-wrap gap-3">
      <button type="button" onClick={onDownload} className="btn-primary px-5">
        ⬇ Download PNG
      </button>
      <button type="button" onClick={onCopy} className="btn-ghost px-5">
        {copied ? "✓ Copied JSON" : "Copy JSON"}
      </button>
    </div>
  );
}

function downloadCanvas(canvas: HTMLCanvasElement | null, filename: string) {
  if (!canvas) return;
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, "image/png");
}

/* ---------------------------------------------------- analytics hooks --- */

function useToolView(slug: string) {
  const interacted = useRef(false);
  const computed = useRef(false);
  useEffect(() => {
    recordToolUse(slug);
    track("tool_used", { action: "view", tool_slug: slug, tool_category: "dev" });
  }, [slug]);
  const markCompute = () => {
    interacted.current = true;
    if (computed.current) return;
    computed.current = true;
    track("tool_used", { action: "compute", tool_slug: slug, tool_category: "dev" });
  };
  return { markCompute };
}

/* ------------------------------------------------------- wallet studio --- */

const CHAINS: { id: ChainKey; label: string }[] = [
  { id: "eth", label: "Ethereum" },
  { id: "btc", label: "Bitcoin" },
  { id: "sol", label: "Solana" },
  { id: "tron", label: "Tron" },
];

export function FakeWalletStudio() {
  const { markCompute } = useToolView("fake-wallet-generator");
  const [chain, setChain] = useState<ChainKey>("eth");
  const [theme, setTheme] = useState<Theme>(THEMES[0]);
  const [device, setDevice] = useState<DeviceKind>("iphone");
  const [vm, setVm] = useState<WalletVM | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => { setVm(generateWallet("eth")); }, []);

  const opts: RenderOpts | null = vm ? { kind: "wallet", vm, theme, device } : null;
  const { canvasRef, cssSize } = useStudioCanvas(opts, logoSlugsForWallet());

  const regen = (c: ChainKey = chain) => { setVm(generateWallet(c)); markCompute(); };

  return (
    <StudioLayout
      canvasRef={canvasRef}
      cssSize={cssSize}
      ariaLabel="Simulated wallet preview"
      controls={
        <>
          <SegGroup label="Network" value={chain} onChange={(c) => { setChain(c); regen(c); }} options={CHAINS} />
          <ThemeRow value={theme.id} onChange={setTheme} />
          <SegGroup label="Device frame" value={device} onChange={setDevice} options={DEVICES.map((d) => ({ id: d.id, label: d.label }))} />
          <button type="button" onClick={() => regen()} className="btn-ghost w-fit px-4 text-sm">
            🎲 Regenerate
          </button>
        </>
      }
      actions={
        <Actions
          copied={copied}
          onDownload={() => {
            downloadCanvas(canvasRef.current, `fake-wallet-${chain}-${theme.id}-${device}.png`);
            track("tool_used", { action: "download", tool_slug: "fake-wallet-generator", tool_category: "dev" });
          }}
          onCopy={async () => {
            if (!vm) return;
            try {
              await navigator.clipboard.writeText(walletJson(vm));
              setCopied(true);
              track("tool_used", { action: "copy_result", tool_slug: "fake-wallet-generator", tool_category: "dev" });
              setTimeout(() => setCopied(false), 1500);
            } catch { /* clipboard unavailable */ }
          }}
        />
      }
    />
  );
}

/* ---------------------------------------------------- portfolio studio --- */

export function FakePortfolioStudio() {
  const { markCompute } = useToolView("fake-portfolio-generator");
  const [assets, setAssets] = useState(5);
  const [total, setTotal] = useState(10000);
  const [theme, setTheme] = useState<Theme>(THEMES[0]);
  const [device, setDevice] = useState<DeviceKind>("iphone");
  const [vm, setVm] = useState<PortfolioVM | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => { setVm(generatePortfolio(5, 10000)); }, []);

  const opts: RenderOpts | null = vm ? { kind: "portfolio", vm, theme, device } : null;
  const { canvasRef, cssSize } = useStudioCanvas(opts, logoSlugsForPortfolio());

  const regen = (a = assets, tot = total) => { setVm(generatePortfolio(a, tot)); markCompute(); };

  return (
    <StudioLayout
      canvasRef={canvasRef}
      cssSize={cssSize}
      ariaLabel="Simulated portfolio preview"
      controls={
        <>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-1 block text-xs font-semibold muted">Number of assets</span>
              <input
                type="number" min={1} max={12} step={1} value={assets}
                onChange={(e) => { const a = Math.max(1, Math.min(12, Number(e.target.value) || 1)); setAssets(a); regen(a, total); }}
                className="input-field"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold muted">Total value (USD)</span>
              <input
                type="number" min={0} step={100} value={total}
                onChange={(e) => { const tot = Math.max(0, Number(e.target.value) || 0); setTotal(tot); regen(assets, tot); }}
                className="input-field"
              />
            </label>
          </div>
          <ThemeRow value={theme.id} onChange={setTheme} />
          <SegGroup label="Device frame" value={device} onChange={setDevice} options={DEVICES.map((d) => ({ id: d.id, label: d.label }))} />
          <button type="button" onClick={() => regen()} className="btn-ghost w-fit px-4 text-sm">
            🎲 Regenerate
          </button>
        </>
      }
      actions={
        <Actions
          copied={copied}
          onDownload={() => {
            downloadCanvas(canvasRef.current, `fake-portfolio-${assets}-${theme.id}-${device}.png`);
            track("tool_used", { action: "download", tool_slug: "fake-portfolio-generator", tool_category: "dev" });
          }}
          onCopy={async () => {
            if (!vm) return;
            try {
              await navigator.clipboard.writeText(portfolioJson(vm));
              setCopied(true);
              track("tool_used", { action: "copy_result", tool_slug: "fake-portfolio-generator", tool_category: "dev" });
              setTimeout(() => setCopied(false), 1500);
            } catch { /* clipboard unavailable */ }
          }}
        />
      }
    />
  );
}

/* ----------------------------------------------------------- layout --- */

function StudioLayout({
  canvasRef,
  cssSize,
  controls,
  actions,
  ariaLabel,
}: {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  cssSize: Size;
  controls: ReactNode;
  actions: ReactNode;
  ariaLabel: string;
}) {
  return (
    <div className="grid gap-6 md:grid-cols-[1fr_minmax(300px,380px)] md:gap-8">
      {/* Controls */}
      <div className="order-2 md:order-1">
        <form className="card space-y-5 p-6 sm:p-7" onSubmit={(e) => e.preventDefault()}>
          <h2 className="eyebrow">Design</h2>
          {controls}
          {actions}
          <p className="muted text-xs leading-relaxed">
            Everything is generated at random in your browser — nothing is saved or sent anywhere, and no
            private key exists. Sample data for mockups, screenshots and demos only.
          </p>
        </form>
      </div>

      {/* Preview */}
      <div className="order-1 flex justify-center md:order-2 md:sticky md:top-28 md:self-start">
        <canvas
          ref={canvasRef}
          role="img"
          aria-label={ariaLabel}
          className="h-auto max-w-full rounded-[28px]"
          style={{ width: cssSize.w, maxWidth: "100%" }}
        />
      </div>
    </div>
  );
}
