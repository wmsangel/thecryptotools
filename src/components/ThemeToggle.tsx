"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !dark;
    const root = document.documentElement;
    // Suppress colour transitions for this one flip so no element renders an
    // intermediate low-contrast state (see `.theme-switching` in globals.css).
    root.classList.add("theme-switching");
    setDark(next);
    root.classList.toggle("dark", next);
    // Force a style flush so the colour swap commits with transitions disabled,
    // then re-enable them next frame for normal hover/focus animation.
    void root.offsetHeight;
    requestAnimationFrame(() => root.classList.remove("theme-switching"));
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      /* ignore */
    }
  }

  // Render a stable placeholder until mounted to avoid hydration mismatch.
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="rounded-lg border border-[var(--border)] p-2 text-lg leading-none transition hover:bg-[var(--bg)]"
    >
      {mounted ? (dark ? "☀️" : "🌙") : "🌗"}
    </button>
  );
}
