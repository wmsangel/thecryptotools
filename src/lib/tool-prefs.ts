"use client";

/**
 * ============================================================================
 * Per-visitor tool preferences — favorites and recently-used.
 * ============================================================================
 * Stored in localStorage only. There is no server and no account, so this is
 * deliberately device-local: nothing is uploaded, nothing identifies anyone.
 *
 * HYDRATION: the static export renders these lists as empty on the server, so
 * every consumer must gate on `ready` and render nothing until after mount.
 * Reading localStorage during render would produce a hydration mismatch.
 *
 * Components stay in sync through a window event rather than a store, because
 * the only writers are a star button and the tool engine — two call sites.
 */

import { useCallback, useEffect, useState } from "react";

const FAVORITES_KEY = "tct-favorites";
const RECENT_KEY = "tct-recent";
const CHANGE_EVENT = "tct-prefs-change";

/** Keeping the recent list short makes it a shortcut rather than a history. */
const MAX_RECENT = 8;

function read(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === "string") : [];
  } catch {
    // Private mode, quota, or corrupted value — degrade to "no preferences".
    return [];
  }
}

function write(key: string, value: string[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable — the UI still works, it just won't persist */
  }
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: key }));
}

/** Subscribes to a stored list and re-reads it on change (including other tabs). */
function useStoredList(key: string): [string[], boolean] {
  const [value, setValue] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => setValue(read(key));
    sync();
    setReady(true);
    const onStorage = (e: StorageEvent) => {
      if (e.key === key) sync();
    };
    window.addEventListener(CHANGE_EVENT, sync);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(CHANGE_EVENT, sync);
      window.removeEventListener("storage", onStorage);
    };
  }, [key]);

  return [value, ready];
}

export function useFavorites() {
  const [favorites, ready] = useStoredList(FAVORITES_KEY);

  const toggle = useCallback((slug: string) => {
    const current = read(FAVORITES_KEY);
    write(
      FAVORITES_KEY,
      current.includes(slug) ? current.filter((s) => s !== slug) : [slug, ...current],
    );
  }, []);

  const isFavorite = useCallback((slug: string) => favorites.includes(slug), [favorites]);

  return { favorites, isFavorite, toggle, ready };
}

export function useRecentTools() {
  const [recent, ready] = useStoredList(RECENT_KEY);
  return { recent, ready };
}

/** Called by the tool engine when a tool page is opened. */
export function recordToolUse(slug: string): void {
  const current = read(RECENT_KEY);
  // Move-to-front: re-opening a tool should refresh its position, not duplicate it.
  const next = [slug, ...current.filter((s) => s !== slug)].slice(0, MAX_RECENT);
  if (next.length === current.length && next.every((s, i) => s === current[i])) return;
  write(RECENT_KEY, next);
}

export function clearRecentTools(): void {
  write(RECENT_KEY, []);
}
