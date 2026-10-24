/**
 * Social slide generator — TheCryptoTools.
 *
 * Renders branded Instagram slides from ../posts.js the same way the site
 * renders OG cards: @vercel/og (Satori) → PNG. Run it from the PROJECT ROOT
 * (it resolves `next` from the project's node_modules) and fonts from the TTFs
 * installed on this Mac. Output: social/out/<id>-en-NN-(square|story).png
 * (+ manifest.json). square = 1080×1080 (carousel/post), story = 1080×1920.
 *
 * Usage (from project root):
 *   node social/scripts/social-slides.mjs            # 1080px (IG native)
 *   node social/scripts/social-slides.mjs --scale 2  # 2160px (retina)
 */
import { ImageResponse } from "next/dist/compiled/@vercel/og/index.node.js";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { homedir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { POSTS, BRAND, SITE } from "../posts.js";

const SCALE = Math.max(1, Number((process.argv.find((a, i) => process.argv[i - 1] === "--scale")) || 1));
const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "out");

// --- brand tokens (site identity) ------------------------------------------
const BG = "#070b14";
const BRAND_C = "#16b378";
const BRAND_LIGHT = "#2dd4bf";
const TEXT = "#eef2f8";
const MUTED = "#93a4bd";
const BORDER = "#1c2740";
const RED = "#f26d6d";

// --- fonts ------------------------------------------------------------------
async function loadFonts() {
  const dir = path.join(homedir(), "Library", "Fonts");
  const weights = [
    ["IBMPlexSans-Regular.ttf", 400],
    ["IBMPlexSans-Medium.ttf", 500],
    ["IBMPlexSans-SemiBold.ttf", 600],
    ["IBMPlexSans-Bold.ttf", 700],
  ];
  const fonts = [];
  for (const [file, weight] of weights) {
    try {
      fonts.push({ name: "IBM Plex Sans", data: await readFile(path.join(dir, file)), weight, style: "normal" });
    } catch {
      /* skip a missing weight — Satori falls back to the nearest */
    }
  }
  if (!fonts.length) throw new Error("No IBM Plex Sans TTF found in ~/Library/Fonts");
  return fonts;
}

const el = (style, children) => ({ type: "div", props: { style: { display: "flex", ...style }, children } });

/** A ✓ / ✗ badge drawn as a vector path (never an emoji). */
const mark = (ok) =>
  el(
    { width: 56, height: 56, minWidth: 56, borderRadius: 999, backgroundColor: ok ? "rgba(22,179,120,0.16)" : "rgba(242,109,109,0.16)", alignItems: "center", justifyContent: "center" },
    [
      {
        type: "svg",
        props: {
          width: 30, height: 30, viewBox: "0 0 24 24", fill: "none",
          children: [{ type: "path", props: { d: ok ? "M5 12.5l4 4 10-10.5" : "M6 6l12 12M18 6L6 18", stroke: ok ? BRAND_C : RED, strokeWidth: 2.6, strokeLinecap: "round", strokeLinejoin: "round" } }],
        },
      },
    ],
  );

/** Brand header rule + wordmark, shared by every slide. */
const brandHeader = (onAccent = false) =>
  el({ flexDirection: "column", gap: 20 }, [
    el({ height: 8, width: 120, borderRadius: 999, backgroundImage: `linear-gradient(90deg, ${BRAND_C}, ${BRAND_LIGHT})` }),
    el({ alignItems: "baseline", gap: 12 }, [
      el({ fontSize: 34, fontWeight: 700, color: onAccent ? "#04211d" : TEXT, letterSpacing: -0.5 }, BRAND),
      el({ fontSize: 24, fontWeight: 500, color: onAccent ? "rgba(4,33,29,0.7)" : MUTED }, SITE),
    ]),
  ]);

const coverTitleSize = (t) => (t.length > 46 ? 76 : t.length > 32 ? 88 : 100);

// --- slide templates (1080×1080 square, 1080×1920 story) --------------------
function slideNode(slide, format) {
  const story = format === "story";
  const pad = story ? 96 : 84;
  const base = { width: "100%", height: "100%", flexDirection: "column", backgroundColor: BG, padding: pad, justifyContent: "space-between" };

  switch (slide.type) {
    case "cover":
      return el(base, [
        brandHeader(),
        el({ flexDirection: "column", gap: 26 }, [
          el({ fontSize: 30, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", color: BRAND_LIGHT }, slide.eyebrow),
          el({ fontSize: coverTitleSize(slide.title), fontWeight: 700, color: TEXT, lineHeight: 1.05, letterSpacing: -1 }, slide.title),
        ]),
      ]);
    case "text":
      return el(base, [
        brandHeader(),
        el({ flexDirection: "column", gap: 26 }, [
          el({ fontSize: 120, fontWeight: 700, color: BRAND_C, lineHeight: 1 }, String(slide.n)),
          el({ fontSize: 60, fontWeight: 700, color: TEXT, lineHeight: 1.1, letterSpacing: -0.5 }, slide.title),
          el({ fontSize: 40, fontWeight: 400, color: MUTED, lineHeight: 1.4 }, slide.body),
        ]),
        el({}, ""),
      ]);
    case "checklist":
      return el(base, [
        brandHeader(),
        el({ flexDirection: "column", gap: 30 }, [
          el({ fontSize: 56, fontWeight: 700, color: TEXT, letterSpacing: -0.5 }, slide.title),
          el({ flexDirection: "column", gap: 22 }, slide.items.map((it) =>
            el({ alignItems: "center", gap: 24 }, [mark(it.ok), el({ fontSize: 38, fontWeight: 500, color: TEXT, lineHeight: 1.25, flex: 1 }, it.text)]),
          )),
        ]),
        el({}, ""),
      ]);
    case "cta": {
      const ctaBase = { width: "100%", height: "100%", flexDirection: "column", padding: pad, justifyContent: "space-between", backgroundImage: `linear-gradient(145deg, ${BRAND_C}, ${BRAND_LIGHT})` };
      return el(ctaBase, [
        brandHeader(true),
        el({ flexDirection: "column", gap: 28 }, [
          el({ fontSize: 76, fontWeight: 700, color: "#04211d", lineHeight: 1.05, letterSpacing: -1 }, slide.title),
          el({ fontSize: 40, fontWeight: 500, color: "rgba(4,33,29,0.82)", lineHeight: 1.35 }, slide.sub),
          el({ marginTop: 10, alignSelf: "flex-start", backgroundColor: "#04211d", color: "#dffaf1", fontSize: 32, fontWeight: 600, paddingTop: 20, paddingBottom: 20, paddingLeft: 34, paddingRight: 34, borderRadius: 18 }, slide.action),
        ]),
      ]);
    }
    case "mythfact":
      return el(base, [
        el({ flexDirection: "column", gap: 44 }, [
          brandHeader(),
          el({ alignSelf: "flex-start", backgroundColor: "rgba(242,109,109,0.16)", color: RED, fontSize: 28, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", paddingTop: 12, paddingBottom: 12, paddingLeft: 22, paddingRight: 22, borderRadius: 999 }, slide.tag),
        ]),
        el({ flexDirection: "column", gap: 30 }, [
          el({ fontSize: 40, fontWeight: 500, color: MUTED }, "Myth"),
          el({ fontSize: 64, fontWeight: 700, color: TEXT, lineHeight: 1.1, letterSpacing: -0.5 }, slide.claim),
          el({ height: 2, width: "100%", backgroundColor: BORDER }),
          el({ fontSize: 40, fontWeight: 500, color: BRAND_LIGHT }, "Fact"),
          el({ fontSize: 42, fontWeight: 400, color: TEXT, lineHeight: 1.35 }, slide.answer),
        ]),
        el({ fontSize: 32, fontWeight: 600, color: BRAND_C }, slide.cta),
      ]);
    case "story":
      return el({ ...base, justifyContent: "flex-start", gap: 70 }, [
        brandHeader(),
        el({ flex: 1, flexDirection: "column", justifyContent: "center" }, [
          el({ fontSize: 92, fontWeight: 700, color: TEXT, lineHeight: 1.1, letterSpacing: -1, whiteSpace: "pre-wrap" }, slide.question),
        ]),
        el({ flexDirection: "column", gap: 10, paddingBottom: 40 }, [
          el({ fontSize: 30, fontWeight: 600, color: BRAND_LIGHT, letterSpacing: 1, textTransform: "uppercase" }, "Tap the poll ↓"),
          el({ fontSize: 30, fontWeight: 400, color: MUTED }, "Then reveal today's real reading"),
        ]),
      ]);
    default:
      return el(base, [el({ fontSize: 48, color: TEXT }, `?${slide.type}`)]);
  }
}

async function render(node, w, h, fonts) {
  const res = new ImageResponse(node, { width: w * SCALE, height: h * SCALE, fonts });
  return Buffer.from(await res.arrayBuffer());
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const fonts = await loadFonts();
  const manifest = [];
  let total = 0;

  for (const post of POSTS) {
    const story = post.format === "story";
    const w = 1080;
    const h = story ? 1920 : 1080;
    const shape = story ? "story" : "square";
    const files = [];
    for (let i = 0; i < post.slides.length; i++) {
      const name = `${post.id}-en-${String(i + 1).padStart(2, "0")}-${shape}.png`;
      const buf = await render(slideNode(post.slides[i], post.format), w, h, fonts);
      await writeFile(path.join(OUT, name), buf);
      files.push(name);
      total++;
    }
    manifest.push({ id: post.id, day: post.day, rubric: post.rubric, format: post.format, page: post.page, files });
  }

  await writeFile(path.join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
  console.log(`social: wrote ${total} slides (×${SCALE}) to social/out/ + manifest.json`);
}

main().catch((e) => {
  console.error("social slide generator failed:", e);
  process.exit(1);
});
