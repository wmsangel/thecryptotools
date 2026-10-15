/**
 * ============================================================================
 * Daily social reminder → Telegram ops channel.
 * ============================================================================
 * Sends a one-line "today's post" nudge so the owner never forgets to post.
 * Honest + minimal: it does NOT auto-publish to Instagram (IG has no open
 * posting API for this; posting stays manual from the content hub). It just
 * pings a private Telegram ops channel with today's plan + the hub link.
 *
 * SETUP (owner, one-time — I can't create a Telegram channel/bot for you):
 *   1. In Telegram, create a private channel (or a "Saved Messages"-style
 *      group). For a PUBLIC brand channel, pick an ASO-friendly @handle and
 *      description (e.g. @thecryptotools — "Free crypto calculators, tax tools,
 *      backtests & honest guides. New tool drops + market reads.").
 *   2. Talk to @BotFather → /newbot → get the BOT TOKEN.
 *   3. Add the bot to the channel as an admin (so it can post).
 *   4. Get the channel's chat id (e.g. @yourchannel for public, or the numeric
 *      -100… id for private — @userinfobot / getUpdates will show it).
 *   5. Save them (git-ignored):
 *        ~/.config/seo-stats/telegram-bot-token.txt
 *        ~/.config/seo-stats/telegram-ops-chat.txt
 *      or pass env TG_BOT_TOKEN / TG_CHAT_ID.
 *   6. Schedule it (launchd/cron) once a day, e.g. 09:00.
 *
 * Until creds exist it prints the setup note and exits 0 (cron-safe).
 */

import { readFile } from "node:fs/promises";
import { homedir } from "node:os";
import path from "node:path";
import { POSTS } from "./content-plan.mjs";

const HUB_URL = "https://claude.ai/artifact/GG5ZAEN2QpELC2MrexmrJP";
const DOW = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

async function cred(envName, file) {
  if (process.env[envName]) return process.env[envName].trim();
  try {
    return (await readFile(path.join(homedir(), ".config", "seo-stats", file), "utf8")).trim();
  } catch {
    return "";
  }
}

async function main() {
  const token = await cred("TG_BOT_TOKEN", "telegram-bot-token.txt");
  const chat = await cred("TG_CHAT_ID", "telegram-ops-chat.txt");
  if (!token || !chat) {
    console.log("tg-daily: no Telegram creds yet — see the SETUP note at the top of this file. Skipping (not an error).");
    return;
  }

  const todayLabel = DOW[(new Date().getDay() + 6) % 7];
  const post = POSTS.find((p) => p.day === todayLabel);
  if (!post) {
    console.log(`tg-daily: no post planned for ${todayLabel}. Skipping.`);
    return;
  }

  const text =
    `📅 *Today's post — ${post.day}*\n` +
    `*${post.rubric}:* ${post.title}\n` +
    `Links to: ${post.link}\n` +
    `${post.format === "story" ? "Story (1080×1920) — add the poll + link sticker natively." : `Carousel/post (${post.slides.length} slide${post.slides.length > 1 ? "s" : ""}).`}\n\n` +
    `Grab the slides, caption & hashtags in the hub:\n${HUB_URL}`;

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chat, text, parse_mode: "Markdown", disable_web_page_preview: true }),
  });
  const j = await res.json().catch(() => ({}));
  if (!res.ok || !j.ok) {
    console.error("tg-daily: send failed —", res.status, JSON.stringify(j).slice(0, 200));
    process.exit(1);
  }
  console.log(`tg-daily: pinged Telegram with ${post.day}'s plan.`);
}

main().catch((e) => {
  console.error("tg-daily failed:", e.message);
  process.exit(1);
});
