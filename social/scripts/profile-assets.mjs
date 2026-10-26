/**
 * Instagram profile images — TheCryptoTools.
 * Avatar (1080×1080, brand mark in the central ~46% so the circle crop is safe)
 * + highlight covers (1080×1920, a single centred teal icon, NO text — the
 * circle crops it). @vercel/og → PNG into social/profile/. Run from project root.
 *   node social/scripts/profile-assets.mjs
 */
import { ImageResponse } from "next/dist/compiled/@vercel/og/index.node.js";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PROFILE } from "../profile/profile.js";

const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "profile");
const BG = "#070b14";
const TEAL = "#2dd4bf";
const TEAL_D = "#0f9e68";

const el = (style, children) => ({ type: "div", props: { style: { display: "flex", ...style }, children } });
const svg = (children, size = 460) => ({
  type: "svg",
  props: { width: size, height: size, viewBox: "0 0 100 100", fill: "none", children },
});
const P = (d, { stroke = TEAL, w = 7, fill = "none" } = {}) =>
  ({ type: "path", props: { d, stroke, strokeWidth: w, strokeLinecap: "round", strokeLinejoin: "round", fill } });
const C = (cx, cy, r, { stroke = TEAL, w = 7, fill = "none" } = {}) =>
  ({ type: "circle", props: { cx, cy, r, stroke: fill === "none" ? stroke : "none", strokeWidth: w, fill } });
const RECT = (x, y, width, height, { stroke = TEAL, w = 7, rx = 0, fill = "none" } = {}) =>
  ({ type: "rect", props: { x, y, width, height, rx, stroke, strokeWidth: w, fill } });
const LINE = (x1, y1, x2, y2, { stroke = TEAL, w = 7 } = {}) =>
  ({ type: "line", props: { x1, y1, x2, y2, stroke, strokeWidth: w, strokeLinecap: "round" } });
const ELL = (cx, cy, rx, ry, { stroke = TEAL, w = 7 } = {}) =>
  ({ type: "ellipse", props: { cx, cy, rx, ry, stroke, strokeWidth: w, fill: "none" } });

// --- icons (viewBox 0 0 100 100) --------------------------------------------
function iconFor(id) {
  switch (id) {
    case "calculators":
      return [
        RECT(20, 12, 60, 76, { rx: 8, w: 6 }),
        RECT(30, 22, 40, 14, { rx: 3, w: 6 }),
        ...[48, 62, 76].flatMap((y) => [30, 50, 70].map((x) => C(x, y, 3.2, { fill: TEAL, w: 0 }))),
      ];
    case "tax": // percent
      return [C(33, 33, 11, { w: 7 }), C(67, 67, 11, { w: 7 }), LINE(73, 24, 27, 76, { w: 7 })];
    case "dca": // coin stack
      return [ELL(50, 34, 30, 9), ELL(50, 50, 30, 9), ELL(50, 66, 30, 9),
        LINE(20, 34, 20, 66, { w: 7 }), LINE(80, 34, 80, 66, { w: 7 })];
    case "market": // candlesticks
      return [
        LINE(30, 22, 30, 82, { w: 5 }), RECT(23, 40, 14, 24, { w: 6, rx: 2 }),
        LINE(50, 14, 50, 88, { w: 5 }), RECT(43, 34, 14, 34, { w: 6, rx: 2 }),
        LINE(70, 28, 70, 78, { w: 5 }), RECT(63, 46, 14, 20, { w: 6, rx: 2 }),
      ];
    case "guides": // open book
      return [
        P("M50 30 C 38 24 22 24 14 30 L14 74 C 22 68 38 68 50 74 Z", { w: 6 }),
        P("M50 30 C 62 24 78 24 86 30 L86 74 C 78 68 62 68 50 74 Z", { w: 6 }),
      ];
    default:
      return [C(50, 50, 30, { w: 7 })];
  }
}

function avatarNode() {
  return el(
    { width: "100%", height: "100%", backgroundImage: `linear-gradient(135deg, #16b378, #2dd4bf)`, alignItems: "center", justifyContent: "center" },
    [svg([C(50, 50, 40, { fill: "#ffffff", w: 0 }), P("M30 62 L44 48 L56 55 L72 36", { stroke: TEAL_D, w: 6 })], 640)],
  );
}

function highlightNode(id) {
  return el(
    { width: "100%", height: "100%", backgroundColor: BG, alignItems: "center", justifyContent: "center" },
    [el({ width: 560, height: 560, alignItems: "center", justifyContent: "center" }, [svg(iconFor(id), 460)])],
  );
}

async function render(node, w, h) {
  const res = new ImageResponse(node, { width: w, height: h });
  return Buffer.from(await res.arrayBuffer());
}

async function main() {
  await mkdir(OUT, { recursive: true });
  await writeFile(path.join(OUT, "avatar.png"), await render(avatarNode(), 1080, 1080));
  for (const h of PROFILE.highlights) {
    await writeFile(path.join(OUT, `highlight-${h.id}.png`), await render(highlightNode(h.id), 1080, 1920));
  }
  console.log(`profile: wrote avatar.png + ${PROFILE.highlights.length} highlight covers to social/profile/`);
}

main().catch((e) => { console.error("profile assets failed:", e); process.exit(1); });
