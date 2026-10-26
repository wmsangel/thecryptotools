/**
 * Daily social delivery to Telegram — sends the READY post for today: the media
 * (photo / carousel album / video) with a short header, then a SEPARATE message
 * with the full caption + hashtags to copy-paste into Instagram. No deps — just
 * fetch + FormData + Blob. Organic content; nothing is marked as an ad.
 *
 * Plan source — ../posts.js (picked by weekday). Slides come from ../out/
 * (generate: node social/scripts/social-slides.mjs). Video — optional `video`
 * field on a post (path relative to social/).
 *
 * ONE Telegram bot serves the whole network, so every message header names the
 * project ("TheCryptoTools").
 *
 * Config — social/.telegram.json (NOT committed; see .telegram.json.example):
 *   { "bot_token": "...", "chat_id": "...", "lang": "en" }
 * or env TG_BOT_TOKEN / TG_CHAT_ID / TG_LANG.
 *
 * Run:  node social/scripts/telegram-daily.mjs            # today's post
 *       node social/scripts/telegram-daily.mjs grid-loses # a specific post id (test)
 * Daily autorun — launchd (see social/README.md).
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { POSTS, BRAND } from "../posts.js";
import { PROFILE } from "../profile/profile.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "out");
const PROFILE_DIR = join(ROOT, "profile");
const HUB_URL = "https://claude.ai/artifact/GG5ZAEN2QpELC2MrexmrJP";
const SITE = "thecryptotools.com";
const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function config() {
  let c = {};
  try { c = JSON.parse(readFileSync(join(ROOT, ".telegram.json"), "utf8")); } catch {}
  const bot = process.env.TG_BOT_TOKEN || c.bot_token;
  const chat = process.env.TG_CHAT_ID || c.chat_id;
  const lang = (process.env.TG_LANG || c.lang || "en").toLowerCase();
  if (!bot || !chat) {
    console.error("No bot_token/chat_id. Fill social/.telegram.json (see .telegram.json.example) or set TG_BOT_TOKEN/TG_CHAT_ID.");
    process.exit(1);
  }
  return { bot, chat, lang };
}

// Slides for a post/lang: out/<id>-<lang>-NN-(square|story).png, in order.
function slidesFor(id, lang) {
  if (!existsSync(OUT)) return [];
  const re = new RegExp(`^${id}-${lang}-\\d+-(square|story)\\.png$`);
  return readdirSync(OUT).filter((f) => re.test(f)).sort().map((f) => join(OUT, f));
}

const fmtName = (f) => (f === "carousel" ? "carousel" : f === "story" ? "story" : f === "video" ? "video" : "post");

function captionBlock(post, lang) {
  const cap = post.caption?.[lang] ?? "";
  const tags = post.hashtags?.[lang] ?? "";
  const parts = [];
  parts.push(`📅 ${BRAND} · ${post.day} · ${post.rubric} · ${fmtName(post.format)}`);
  parts.push(`🔗 Links to: ${SITE}${post.page}`);
  if (post.sticker?.[lang]) parts.push(`🎯 Sticker (add in IG): ${post.sticker[lang]}`);
  parts.push("— — — CAPTION (copy) — — —");
  parts.push([cap, tags].filter(Boolean).join("\n\n") || "(story — no caption; use the sticker above)");
  parts.push(`All slides in the hub: ${HUB_URL}`);
  return parts.filter(Boolean).join("\n\n");
}

async function tg(bot, method, form) {
  const res = await fetch(`https://api.telegram.org/bot${bot}/${method}`, { method: "POST", body: form });
  const data = await res.json();
  if (!data.ok) throw new Error(`${method}: ${data.description}`);
  return data;
}

const fileBlob = (path) => new Blob([readFileSync(path)]);

async function sendPhoto(bot, chat, path, caption) {
  const form = new FormData();
  form.append("chat_id", chat);
  form.append("photo", fileBlob(path), basename(path));
  if (caption) form.append("caption", caption);
  await tg(bot, "sendPhoto", form);
}

async function sendVideo(bot, chat, path, caption) {
  const form = new FormData();
  form.append("chat_id", chat);
  form.append("video", fileBlob(path), basename(path));
  if (caption) form.append("caption", caption);
  await tg(bot, "sendVideo", form);
}

// Carousel → one album (up to 10 photos). Album caption is short (1024 limit) —
// the full text goes as a separate message.
async function sendAlbum(bot, chat, paths, caption) {
  const chunk = paths.slice(0, 10);
  const form = new FormData();
  form.append("chat_id", chat);
  const media = chunk.map((p, i) => ({ type: "photo", media: `attach://p${i}`, ...(i === 0 && caption ? { caption } : {}) }));
  form.append("media", JSON.stringify(media));
  chunk.forEach((p, i) => form.append(`p${i}`, fileBlob(p), basename(p)));
  await tg(bot, "sendMediaGroup", form);
}

async function sendText(bot, chat, text) {
  const form = new FormData();
  form.append("chat_id", chat);
  form.append("text", text);
  form.append("disable_web_page_preview", "true");
  await tg(bot, "sendMessage", form);
}

// Un-compressed file (avatar/covers must not be re-compressed by Telegram).
async function sendDocument(bot, chat, path, caption) {
  const form = new FormData();
  form.append("chat_id", chat);
  form.append("document", fileBlob(path), basename(path));
  if (caption) form.append("caption", caption);
  await tg(bot, "sendDocument", form);
}

// Full Instagram profile pack — each piece a separate message to copy/download.
async function sendProfile(bot, chat) {
  const P = PROFILE;
  const f = (name) => join(PROFILE_DIR, name);
  await sendDocument(bot, chat, f("avatar.png"), `${BRAND} — Instagram profile pack\n\n1) AVATAR 1080×1080 — set as the profile photo using THIS file (un-compressed).`);
  await sendPhoto(bot, chat, f("avatar.png"), "Avatar — preview (how it looks)");
  await sendText(bot, chat, `2) PROFILE NAME (≤30 chars):\n${P.name}\n\n@USERNAME (registered): @${P.usernames[0]}`);
  await sendText(bot, chat, `3) BIO (≤150 chars):\n${P.bio}`);
  await sendText(bot, chat, `4) LINK in profile (with UTM):\n${P.link}`);
  await sendText(bot, chat, `5) ACCOUNT TYPE: ${P.accountType}\n\nCATEGORY: ${P.category}`);
  await sendText(bot, chat, `6) HIGHLIGHT COVERS — upload each file below as a cover, then name it:\n${P.highlights.map((h) => `• ${h.name}`).join("\n")}`);
  for (const h of P.highlights) await sendDocument(bot, chat, f(`highlight-${h.id}.png`), `Highlight cover → name it: ${h.name}`);
  await sendText(bot, chat, `7) CONTACT: ${P.email}\n${P.emailNote}`);
  await sendText(bot, chat, `8) PIN THESE 3 POSTS (after they're published):\n${P.pins.map((p) => `• ${p.id} — ${p.why}`).join("\n")}`);
  await sendText(bot, chat, `9) WHAT TO TAP IN INSTAGRAM, in order:\n${P.checklist.map((s, i) => `${i + 1}. ${s}`).join("\n")}`);
  console.log("Profile pack sent to Telegram.");
}

// ─── main ───
const { bot, chat, lang } = config();

if (process.argv.includes("--profile")) {
  try {
    await sendProfile(bot, chat);
  } catch (e) {
    console.error("Telegram error (profile):", e.message);
    process.exit(1);
  }
  process.exit(0);
}

const arg = process.argv[2];
const today = DOW[new Date().getDay()];
const post = arg ? POSTS.find((p) => p.id === arg) : POSTS.find((p) => p.day === today);

if (!post) {
  console.log(arg ? `Post "${arg}" not found.` : `No post planned for ${today} — day off.`);
  process.exit(0);
}

const header = `📅 ${BRAND} · ${post.day} · ${post.rubric} · ${fmtName(post.format)}`;
const video = post.video ? join(ROOT, post.video) : null;

try {
  // 1) Media with a short header caption.
  if (video && existsSync(video)) {
    await sendVideo(bot, chat, video, header);
  }
  const slides = slidesFor(post.id, lang);
  if (slides.length > 1) await sendAlbum(bot, chat, slides, header);
  else if (slides.length === 1) await sendPhoto(bot, chat, slides[0], header);
  else if (!video) await sendText(bot, chat, `${header}\n\n(no slides in out/ — run: node social/scripts/social-slides.mjs)`);
  // 2) Full caption + hashtags as a separate message (copy-paste).
  await sendText(bot, chat, captionBlock(post, lang));
  console.log(`Sent to Telegram: ${today} · ${post.rubric} (${post.id})`);
} catch (e) {
  console.error("Telegram error:", e.message);
  process.exit(1);
}
