/**
 * Shared, framework-free core for the "fake" mockup studios (wallet + portfolio).
 *
 * It holds the sample-data generators, the visual themes, a small image cache
 * for coin logos and all the <canvas> drawing. The live on-page preview IS the
 * canvas, so what the visitor sees is exactly what "Download PNG" saves — one
 * layout, no DOM-to-image divergence.
 *
 * Designs are deliberately brand-neutral: generic wallet/portfolio app chrome,
 * never a replica of a specific product's branding. Only the coin logos (which
 * identify the asset, not an app) are real marks, loaded from /logos/coins.
 */

const SANS = '-apple-system, "Segoe UI", Roboto, system-ui, "Helvetica Neue", sans-serif';
const MONO = 'ui-monospace, "SF Mono", Menlo, Consolas, monospace';

/* ------------------------------------------------------------------ data --- */

export type ChainKey = "eth" | "btc" | "sol" | "tron";

interface NetworkDef {
  key: ChainKey;
  name: string;
  symbol: string;
  slug: string; // logo at /logos/coins/<slug>.png
  color: string;
  sample: number; // illustrative fixed price, not a quote
  min: number;
  max: number;
  decimals: number;
  address: () => string;
}

const HEX = "0123456789abcdef";
const BASE58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
const BECH32 = "qpzry9x8gf2tvdw0s3jn54khce6mua7l";
const pick = (set: string, n: number): string =>
  Array.from({ length: n }, () => set[Math.floor(Math.random() * set.length)]).join("");

export const NETWORKS: Record<ChainKey, NetworkDef> = {
  eth: { key: "eth", name: "Ethereum", symbol: "ETH", slug: "ethereum", color: "#627eea", sample: 3000, min: 0.05, max: 25, decimals: 6, address: () => "0x" + pick(HEX, 40) },
  btc: { key: "btc", name: "Bitcoin", symbol: "BTC", slug: "bitcoin", color: "#f7931a", sample: 60000, min: 0.005, max: 2.5, decimals: 6, address: () => "bc1q" + pick(BECH32, 38) },
  sol: { key: "sol", name: "Solana", symbol: "SOL", slug: "solana", color: "#14f195", sample: 150, min: 1, max: 400, decimals: 4, address: () => pick(BASE58, 44) },
  tron: { key: "tron", name: "Tron", symbol: "TRX", slug: "tron", color: "#eb0029", sample: 0.12, min: 200, max: 50000, decimals: 0, address: () => "T" + pick(BASE58, 33) },
};

export interface WalletVM {
  network: string;
  symbol: string;
  slug: string;
  color: string;
  address: string;
  balance: number;
  valueUsdSample: number;
  transactions: number;
  firstSeen: string;
  lastActive: string;
  activity: { kind: "in" | "out"; amount: number; date: string }[];
  simulated: true;
}

function daysAgoISO(days: number): string {
  return new Date(Date.now() - days * 86_400_000).toISOString().slice(0, 10);
}

export function generateWallet(chain: ChainKey): WalletVM {
  const net = NETWORKS[chain] ?? NETWORKS.eth;
  const balance = Number((net.min + Math.random() * (net.max - net.min)).toFixed(net.decimals));
  const firstDays = Math.floor(200 + Math.random() * 2200);
  const activity = Array.from({ length: 3 }, (_, i) => {
    const amt = Number((balance * (0.03 + Math.random() * 0.22)).toFixed(net.decimals));
    return { kind: (Math.random() < 0.55 ? "in" : "out") as "in" | "out", amount: amt, date: daysAgoISO(Math.floor(i * 9 + Math.random() * 18)) };
  });
  return {
    network: net.name,
    symbol: net.symbol,
    slug: net.slug,
    color: net.color,
    address: net.address(),
    balance,
    valueUsdSample: Number((balance * net.sample).toFixed(2)),
    transactions: Math.floor(1 + Math.random() * 500),
    firstSeen: daysAgoISO(firstDays),
    lastActive: daysAgoISO(Math.floor(Math.random() * 120)),
    activity,
    simulated: true,
  };
}

interface CoinDef { symbol: string; name: string; slug: string; color: string; price: number }
const COINS: CoinDef[] = [
  { symbol: "BTC", name: "Bitcoin", slug: "bitcoin", color: "#f7931a", price: 60000 },
  { symbol: "ETH", name: "Ethereum", slug: "ethereum", color: "#627eea", price: 3000 },
  { symbol: "SOL", name: "Solana", slug: "solana", color: "#14f195", price: 150 },
  { symbol: "BNB", name: "BNB", slug: "bnb", color: "#f3ba2f", price: 600 },
  { symbol: "XRP", name: "XRP", slug: "xrp", color: "#23292f", price: 0.6 },
  { symbol: "ADA", name: "Cardano", slug: "cardano", color: "#0033ad", price: 0.45 },
  { symbol: "DOGE", name: "Dogecoin", slug: "dogecoin", color: "#c2a633", price: 0.12 },
  { symbol: "AVAX", name: "Avalanche", slug: "avalanche", color: "#e84142", price: 30 },
  { symbol: "LINK", name: "Chainlink", slug: "chainlink", color: "#2a5ada", price: 15 },
  { symbol: "DOT", name: "Polkadot", slug: "polkadot", color: "#e6007a", price: 6 },
  { symbol: "POL", name: "Polygon", slug: "polygon", color: "#8247e5", price: 0.5 },
  { symbol: "LTC", name: "Litecoin", slug: "litecoin", color: "#345d9d", price: 80 },
];

export interface Holding {
  symbol: string;
  name: string;
  slug: string;
  color: string;
  amount: number;
  priceUsdSample: number;
  valueUsd: number;
  allocationPct: number;
  change24hPct: number;
}

export interface PortfolioVM {
  totalUsd: number;
  change24hPct: number;
  holdings: Holding[];
  simulated: true;
}

export function generatePortfolio(assets: number, total: number): PortfolioVM {
  const n = Math.min(COINS.length, Math.max(1, Math.floor(assets || 1)));
  const picks = [...COINS].sort(() => Math.random() - 0.5).slice(0, n);
  const weights = picks.map(() => Math.random() + 0.1);
  const sum = weights.reduce((a, b) => a + b, 0);
  const holdings: Holding[] = picks
    .map((coin, idx) => {
      const valueUsd = Number(((weights[idx] / sum) * total).toFixed(2));
      return {
        symbol: coin.symbol,
        name: coin.name,
        slug: coin.slug,
        color: coin.color,
        amount: Number((valueUsd / coin.price).toFixed(coin.price >= 1000 ? 6 : coin.price >= 1 ? 4 : 2)),
        priceUsdSample: coin.price,
        valueUsd,
        allocationPct: Number(((weights[idx] / sum) * 100).toFixed(2)),
        change24hPct: Number((Math.random() * 24 - 12).toFixed(2)),
      };
    })
    .sort((a, b) => b.valueUsd - a.valueUsd);
  const change = total > 0 ? holdings.reduce((acc, h) => acc + h.valueUsd * h.change24hPct, 0) / total : 0;
  return { totalUsd: total, change24hPct: Number(change.toFixed(2)), holdings, simulated: true };
}

export function walletJson(vm: WalletVM): string {
  const { color, slug, activity, ...rest } = vm;
  void color; void slug; void activity;
  return JSON.stringify(rest, null, 2);
}
export function portfolioJson(vm: PortfolioVM): string {
  return JSON.stringify(
    {
      totalUsd: vm.totalUsd,
      change24hPct: vm.change24hPct,
      assets: vm.holdings.length,
      simulated: true,
      holdings: vm.holdings.map(({ slug, color, ...h }) => { void slug; void color; return h; }),
    },
    null,
    2,
  );
}

/* ---------------------------------------------------------------- themes --- */

export interface Theme {
  id: string;
  name: string;
  mode: "dark" | "light";
  back: [string, string]; // outer backdrop gradient (behind the phone / card)
  screen: [string, string]; // app screen gradient
  text: string;
  sub: string;
  accent: string;
  panel: string; // inner card / pill fill
  pos: string;
  neg: string;
  frame: string; // phone bezel colour
}

export const THEMES: Theme[] = [
  { id: "midnight", name: "Midnight", mode: "dark", back: ["#0a0f1d", "#060912"], screen: ["#101a30", "#0a1120"], text: "#f4f7fb", sub: "#93a1bb", accent: "#4f8cff", panel: "#18233b", pos: "#2ebd85", neg: "#f6465d", frame: "#05070d" },
  { id: "daylight", name: "Daylight", mode: "light", back: ["#eef2f8", "#dde4ef"], screen: ["#ffffff", "#f3f6fb"], text: "#0d1526", sub: "#5c6882", accent: "#2f6bff", panel: "#eef2f9", pos: "#12a86a", neg: "#e23a4e", frame: "#c9d2e0" },
  { id: "mint", name: "Mint", mode: "dark", back: ["#04170f", "#02100a"], screen: ["#08261b", "#041710"], text: "#eafff6", sub: "#86c6ad", accent: "#19e39a", panel: "#0d3527", pos: "#19e39a", neg: "#ff6b6b", frame: "#021009" },
  { id: "sunset", name: "Sunset", mode: "dark", back: ["#26090e", "#160407"], screen: ["#2c0e13", "#18060a"], text: "#fff1f2", sub: "#e0a2a8", accent: "#ff5c7a", panel: "#3b141c", pos: "#4ad991", neg: "#ff5c7a", frame: "#130305" },
  { id: "violet", name: "Violet", mode: "dark", back: ["#160d2e", "#0d0720"], screen: ["#1d1340", "#120a28"], text: "#f3eefe", sub: "#b0a1dd", accent: "#9b6bff", panel: "#271a4d", pos: "#38d39f", neg: "#ff6b9a", frame: "#0b0618" },
];

export type DeviceKind = "iphone" | "android" | "none";

/* ------------------------------------------------------------ image cache --- */

const imgCache = new Map<string, HTMLImageElement | null>();

export function logoFor(slug: string): HTMLImageElement | null {
  return imgCache.get(slug) ?? null;
}

/** Load the given logo slugs; resolves once each has loaded or failed. */
export function loadLogos(slugs: string[]): Promise<void> {
  const pending = slugs
    .filter((s, i) => slugs.indexOf(s) === i && !imgCache.has(s))
    .map(
      (slug) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => { imgCache.set(slug, img); resolve(); };
          img.onerror = () => { imgCache.set(slug, null); resolve(); };
          img.src = `/logos/coins/${slug}.png`;
        }),
    );
  return Promise.all(pending).then(() => undefined);
}

/* --------------------------------------------------------- draw helpers --- */

function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const rad = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rad, y);
  ctx.arcTo(x + w, y, x + w, y + h, rad);
  ctx.arcTo(x + w, y + h, x, y + h, rad);
  ctx.arcTo(x, y + h, x, y, rad);
  ctx.arcTo(x, y, x + w, y, rad);
  ctx.closePath();
}

function vgrad(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, c: [string, string]) {
  const g = ctx.createLinearGradient(x, y, x, y + h);
  g.addColorStop(0, c[0]);
  g.addColorStop(1, c[1]);
  return g;
}

/** Coin logo on a rounded plate (several marks are near-black). */
function drawLogo(ctx: CanvasRenderingContext2D, slug: string, color: string, symbol: string, x: number, y: number, size: number, t: Theme) {
  ctx.save();
  rr(ctx, x, y, size, size, size / 2);
  ctx.fillStyle = t.mode === "dark" ? "#ffffff" : "#eef1f6";
  ctx.fill();
  const img = logoFor(slug);
  const pad = Math.round(size * 0.1);
  if (img) {
    rr(ctx, x, y, size, size, size / 2);
    ctx.clip();
    ctx.drawImage(img, x + pad, y + pad, size - 2 * pad, size - 2 * pad);
  } else {
    // fallback: coloured disc + ticker
    rr(ctx, x, y, size, size, size / 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = `700 ${Math.round(size * 0.34)}px ${SANS}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(symbol.slice(0, 4), x + size / 2, y + size / 2 + 1);
  }
  ctx.restore();
}

function fmtUsd(n: number): string {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function fmtUsd0(n: number): string {
  return "$" + n.toLocaleString("en-US", { maximumFractionDigits: n >= 1000 ? 0 : 2 });
}
function fmtAmt(n: number): string {
  return n.toLocaleString("en-US", { maximumFractionDigits: n >= 1000 ? 2 : n >= 1 ? 4 : 6 });
}
function truncAddr(a: string): string {
  return a.length > 14 ? `${a.slice(0, 6)}…${a.slice(-5)}` : a;
}
function ago(iso: string): string {
  const d = Math.round((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (d <= 0) return "today";
  if (d === 1) return "1d ago";
  if (d < 30) return `${d}d ago`;
  const m = Math.round(d / 30);
  return m < 12 ? `${m}mo ago` : `${Math.round(d / 365)}y ago`;
}

/* ---------------------------------------------------- screen geometry --- */

export interface Size { w: number; h: number }

// Portrait app-screen size shared by every device; the frame wraps around it.
const SCREEN = { w: 412, h: 740 };
const OUTER_PAD = 26;

function deviceCanvasSize(device: DeviceKind): Size {
  if (device === "none") return { w: SCREEN.w + 2 * OUTER_PAD, h: SCREEN.h + 2 * OUTER_PAD };
  const bezel = device === "iphone" ? 16 : 13;
  return { w: SCREEN.w + 2 * bezel + 2 * OUTER_PAD, h: SCREEN.h + 2 * bezel + 2 * OUTER_PAD };
}

interface ScreenArea { sx: number; sy: number; sw: number; sh: number; radius: number; contentTop: number; contentBottom: number }

/** Draw the backdrop + device frame, return the screen rect + content insets. */
function drawFrame(ctx: CanvasRenderingContext2D, size: Size, device: DeviceKind, t: Theme): ScreenArea {
  // outer backdrop
  ctx.fillStyle = vgrad(ctx, 0, 0, size.h, t.back);
  ctx.fillRect(0, 0, size.w, size.h);

  if (device === "none") {
    const sx = OUTER_PAD, sy = OUTER_PAD, sw = SCREEN.w, sh = SCREEN.h, radius = 30;
    // soft shadow
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.35)";
    ctx.shadowBlur = 40;
    ctx.shadowOffsetY = 18;
    rr(ctx, sx, sy, sw, sh, radius);
    ctx.fillStyle = vgrad(ctx, sx, sy, sh, t.screen);
    ctx.fill();
    ctx.restore();
    // hairline border
    rr(ctx, sx + 0.5, sy + 0.5, sw - 1, sh - 1, radius);
    ctx.strokeStyle = t.mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
    ctx.lineWidth = 1;
    ctx.stroke();
    return { sx, sy, sw, sh, radius, contentTop: sy + 24, contentBottom: sy + sh - 20 };
  }

  const iphone = device === "iphone";
  const bezel = iphone ? 16 : 13;
  const fx = OUTER_PAD, fy = OUTER_PAD;
  const fw = SCREEN.w + 2 * bezel, fh = SCREEN.h + 2 * bezel;
  const frameRadius = iphone ? 62 : 46;
  const sx = fx + bezel, sy = fy + bezel, sw = SCREEN.w, sh = SCREEN.h;
  const radius = iphone ? 48 : 34;

  // body shadow
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.45)";
  ctx.shadowBlur = 48;
  ctx.shadowOffsetY = 22;
  rr(ctx, fx, fy, fw, fh, frameRadius);
  ctx.fillStyle = t.frame;
  ctx.fill();
  ctx.restore();
  // subtle rim
  rr(ctx, fx + 1, fy + 1, fw - 2, fh - 2, frameRadius - 1);
  ctx.strokeStyle = "rgba(255,255,255,0.10)";
  ctx.lineWidth = 2;
  ctx.stroke();

  // screen
  rr(ctx, sx, sy, sw, sh, radius);
  ctx.save();
  ctx.clip();
  ctx.fillStyle = vgrad(ctx, sy, sy, sh, t.screen);
  ctx.fillRect(sx, sy, sw, sh);
  ctx.restore();

  // status bar
  const barY = sy + 14;
  ctx.fillStyle = t.text;
  ctx.textBaseline = "middle";
  ctx.font = `600 15px ${SANS}`;
  ctx.textAlign = "left";
  ctx.fillText("9:41", sx + 26, barY + 9);
  // right side: signal / wifi / battery glyphs (simple)
  const rxEnd = sx + sw - 24;
  // battery
  ctx.strokeStyle = t.text;
  ctx.globalAlpha = 0.9;
  ctx.lineWidth = 1.4;
  rr(ctx, rxEnd - 24, barY + 2, 22, 12, 3);
  ctx.stroke();
  ctx.fillStyle = t.text;
  ctx.fillRect(rxEnd - 21, barY + 4, 16, 8);
  ctx.fillRect(rxEnd, barY + 5, 2, 6);
  ctx.globalAlpha = 1;

  let contentTop = sy + 44;
  if (iphone) {
    // Dynamic Island
    const iw = 118, ih = 32;
    rr(ctx, sx + sw / 2 - iw / 2, sy + 12, iw, ih, ih / 2);
    ctx.fillStyle = "#000";
    ctx.fill();
    contentTop = sy + 60;
  } else {
    // hole-punch camera (centered)
    ctx.beginPath();
    ctx.arc(sx + sw / 2, barY + 8, 6, 0, Math.PI * 2);
    ctx.fillStyle = "#000";
    ctx.fill();
    contentTop = sy + 48;
  }

  // home indicator / nav pill
  let contentBottom = sy + sh - 28;
  ctx.fillStyle = t.mode === "dark" ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.35)";
  if (iphone) {
    rr(ctx, sx + sw / 2 - 65, sy + sh - 18, 130, 5, 2.5);
    ctx.fill();
    contentBottom = sy + sh - 30;
  } else {
    rr(ctx, sx + sw / 2 - 55, sy + sh - 16, 110, 4, 2);
    ctx.fill();
    contentBottom = sy + sh - 28;
  }

  return { sx, sy, sw, sh, radius, contentTop, contentBottom };
}

function pill(ctx: CanvasRenderingContext2D, label: string, cx: number, cy: number, t: Theme) {
  ctx.font = `600 13px ${SANS}`;
  const w = ctx.measureText(label).width + 26;
  rr(ctx, cx - w / 2, cy - 15, w, 30, 15);
  ctx.fillStyle = t.mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)";
  ctx.fill();
  ctx.fillStyle = t.text;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, cx, cy + 1);
  return w;
}

function changeBadge(ctx: CanvasRenderingContext2D, pct: number, x: number, y: number, t: Theme, align: "left" | "right" = "left") {
  const up = pct >= 0;
  const label = `${up ? "▲" : "▼"} ${Math.abs(pct).toFixed(2)}%`;
  ctx.font = `700 13px ${SANS}`;
  const w = ctx.measureText(label).width + 20;
  const bx = align === "right" ? x - w : x;
  rr(ctx, bx, y - 13, w, 26, 13);
  ctx.fillStyle = up ? (t.pos + "22") : (t.neg + "22");
  ctx.fill();
  ctx.fillStyle = up ? t.pos : t.neg;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, bx + w / 2, y + 1);
  return w;
}

/* --------------------------------------------------------- wallet draw --- */

export function drawWallet(ctx: CanvasRenderingContext2D, size: Size, vm: WalletVM, t: Theme, device: DeviceKind) {
  const A = drawFrame(ctx, size, device, t);
  const px = A.sx + 24;
  const pw = A.sw - 48;
  let y = A.contentTop + 8;

  // header: title + network chip
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = t.text;
  ctx.font = `700 20px ${SANS}`;
  ctx.fillText("Wallet", px, y + 8);
  // network chip (right)
  const chipLabel = vm.network;
  ctx.font = `600 13px ${SANS}`;
  const chipTextW = ctx.measureText(chipLabel).width;
  const chipW = chipTextW + 44;
  const chipX = px + pw - chipW;
  rr(ctx, chipX, y - 9, chipW, 30, 15);
  ctx.fillStyle = t.panel;
  ctx.fill();
  drawLogo(ctx, vm.slug, vm.color, vm.symbol, chipX + 5, y - 4, 20, t);
  ctx.fillStyle = t.text;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText(chipLabel, chipX + 31, y + 6);

  // balance block
  y += 60;
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = t.sub;
  ctx.font = `500 14px ${SANS}`;
  ctx.fillText("Total balance", px, y);
  y += 44;
  ctx.fillStyle = t.text;
  ctx.font = `700 40px ${SANS}`;
  ctx.fillText(fmtUsd(vm.valueUsdSample), px, y);
  y += 26;
  ctx.fillStyle = t.sub;
  ctx.font = `600 16px ${SANS}`;
  ctx.fillText(`${fmtAmt(vm.balance)} ${vm.symbol}`, px, y);

  // action buttons
  y += 40;
  const actions = ["Send", "Receive", "Swap", "Buy"];
  const gap = 10;
  const bw = (pw - gap * (actions.length - 1)) / actions.length;
  actions.forEach((label, i) => {
    const bx = px + i * (bw + gap);
    rr(ctx, bx, y, bw, 44, 12);
    ctx.fillStyle = i === 0 ? t.accent : t.panel;
    ctx.fill();
    ctx.fillStyle = i === 0 ? "#fff" : t.text;
    ctx.font = `600 13px ${SANS}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, bx + bw / 2, y + 23);
  });

  // token panel
  y += 44 + 24;
  const panelH = 64;
  rr(ctx, px, y, pw, panelH, 14);
  ctx.fillStyle = t.panel;
  ctx.fill();
  drawLogo(ctx, vm.slug, vm.color, vm.symbol, px + 14, y + 14, 36, t);
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = t.text;
  ctx.font = `600 15px ${SANS}`;
  ctx.fillText(vm.symbol, px + 62, y + 28);
  ctx.fillStyle = t.sub;
  ctx.font = `500 13px ${SANS}`;
  ctx.fillText(vm.network, px + 62, y + 47);
  ctx.textAlign = "right";
  ctx.fillStyle = t.text;
  ctx.font = `600 15px ${SANS}`;
  ctx.fillText(fmtUsd(vm.valueUsdSample), px + pw - 16, y + 28);
  ctx.fillStyle = t.sub;
  ctx.font = `500 13px ${SANS}`;
  ctx.fillText(`${fmtAmt(vm.balance)} ${vm.symbol}`, px + pw - 16, y + 47);

  // recent activity
  y += panelH + 24;
  ctx.textAlign = "left";
  ctx.fillStyle = t.text;
  ctx.font = `700 15px ${SANS}`;
  ctx.fillText("Recent activity", px, y);
  y += 16;
  vm.activity.forEach((a) => {
    y += 44;
    // icon disc
    ctx.beginPath();
    ctx.arc(px + 18, y - 6, 16, 0, Math.PI * 2);
    ctx.fillStyle = (a.kind === "in" ? t.pos : t.neg) + "22";
    ctx.fill();
    ctx.fillStyle = a.kind === "in" ? t.pos : t.neg;
    ctx.font = `700 16px ${SANS}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(a.kind === "in" ? "↓" : "↑", px + 18, y - 5);
    // label
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = t.text;
    ctx.font = `600 14px ${SANS}`;
    ctx.fillText(a.kind === "in" ? "Received" : "Sent", px + 44, y - 10);
    ctx.fillStyle = t.sub;
    ctx.font = `500 12px ${SANS}`;
    ctx.fillText(ago(a.date), px + 44, y + 7);
    // amount
    ctx.textAlign = "right";
    ctx.fillStyle = a.kind === "in" ? t.pos : t.text;
    ctx.font = `600 14px ${SANS}`;
    ctx.fillText(`${a.kind === "in" ? "+" : "−"}${fmtAmt(a.amount)} ${vm.symbol}`, px + pw - 2, y - 2);
  });

  // address pill (bottom)
  const ay = A.contentBottom - 20;
  rr(ctx, px, ay - 20, pw, 40, 12);
  ctx.fillStyle = t.panel;
  ctx.fill();
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillStyle = t.sub;
  ctx.font = `500 13px ${MONO}`;
  ctx.fillText(truncAddr(vm.address), px + 16, ay + 1);
  ctx.textAlign = "right";
  ctx.fillStyle = t.accent;
  ctx.font = `600 12px ${SANS}`;
  ctx.fillText("Copy", px + pw - 16, ay + 1);
}

/* ------------------------------------------------------- portfolio draw --- */

export function drawPortfolio(ctx: CanvasRenderingContext2D, size: Size, vm: PortfolioVM, t: Theme, device: DeviceKind) {
  const A = drawFrame(ctx, size, device, t);
  const px = A.sx + 24;
  const pw = A.sw - 48;
  let y = A.contentTop + 8;

  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = t.text;
  ctx.font = `700 20px ${SANS}`;
  ctx.fillText("Portfolio", px, y + 8);
  ctx.textAlign = "right";
  changeBadge(ctx, vm.change24hPct, px + pw, y + 7, t, "right");

  y += 54;
  ctx.textAlign = "left";
  ctx.fillStyle = t.sub;
  ctx.font = `500 14px ${SANS}`;
  ctx.fillText("Total value", px, y);
  y += 42;
  ctx.fillStyle = t.text;
  ctx.font = `700 38px ${SANS}`;
  ctx.fillText(fmtUsd0(vm.totalUsd), px, y);

  // donut
  y += 34;
  const cx = A.sx + A.sw / 2;
  const cy = y + 92;
  const R = 78;
  const lw = 26;
  let a0 = -Math.PI / 2;
  ctx.lineWidth = lw;
  ctx.lineCap = "butt";
  vm.holdings.forEach((h) => {
    const sweep = (h.allocationPct / 100) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(cx, cy, R, a0 + 0.012, a0 + sweep - 0.012);
    ctx.strokeStyle = h.color;
    ctx.stroke();
    a0 += sweep;
  });
  // donut centre labels
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = t.text;
  ctx.font = `700 24px ${SANS}`;
  ctx.fillText(String(vm.holdings.length), cx, cy + 2);
  ctx.fillStyle = t.sub;
  ctx.font = `500 12px ${SANS}`;
  ctx.fillText("assets", cx, cy + 20);

  // holdings list
  y = cy + R + 40;
  const rows = vm.holdings.slice(0, device === "none" ? 5 : 5);
  rows.forEach((h) => {
    drawLogo(ctx, h.slug, h.color, h.symbol, px, y - 18, 30, t);
    // alloc colour dot
    ctx.beginPath();
    ctx.arc(px + 42, y - 3, 4, 0, Math.PI * 2);
    ctx.fillStyle = h.color;
    ctx.fill();
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = t.text;
    ctx.font = `600 14px ${SANS}`;
    ctx.fillText(h.symbol, px + 52, y - 8);
    ctx.fillStyle = t.sub;
    ctx.font = `500 12px ${SANS}`;
    ctx.fillText(`${h.allocationPct.toFixed(1)}%`, px + 52, y + 8);
    // value + change
    ctx.textAlign = "right";
    ctx.fillStyle = t.text;
    ctx.font = `600 14px ${SANS}`;
    ctx.fillText(fmtUsd0(h.valueUsd), px + pw, y - 8);
    const up = h.change24hPct >= 0;
    ctx.fillStyle = up ? t.pos : t.neg;
    ctx.font = `500 12px ${SANS}`;
    ctx.fillText(`${up ? "+" : ""}${h.change24hPct.toFixed(2)}%`, px + pw, y + 8);
    y += 46;
  });
  if (vm.holdings.length > rows.length) {
    ctx.textAlign = "center";
    ctx.fillStyle = t.sub;
    ctx.font = `500 12px ${SANS}`;
    ctx.fillText(`+${vm.holdings.length - rows.length} more`, A.sx + A.sw / 2, y - 6);
  }
}

/* ------------------------------------------------------------- render --- */

export interface RenderOpts {
  kind: "wallet" | "portfolio";
  vm: WalletVM | PortfolioVM;
  theme: Theme;
  device: DeviceKind;
}

/** Size the canvas (retina) and draw. Returns the CSS size for display. */
export function render(canvas: HTMLCanvasElement, opts: RenderOpts, scale = 2): Size {
  const size = deviceCanvasSize(opts.device);
  canvas.width = Math.round(size.w * scale);
  canvas.height = Math.round(size.h * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) return size;
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  ctx.clearRect(0, 0, size.w, size.h);
  ctx.textBaseline = "alphabetic";
  if (opts.kind === "wallet") drawWallet(ctx, size, opts.vm as WalletVM, opts.theme, opts.device);
  else drawPortfolio(ctx, size, opts.vm as PortfolioVM, opts.theme, opts.device);
  return size;
}

export function logoSlugsForPortfolio(): string[] {
  return COINS.map((c) => c.slug);
}
export function logoSlugsForWallet(): string[] {
  return Object.values(NETWORKS).map((n) => n.slug);
}
