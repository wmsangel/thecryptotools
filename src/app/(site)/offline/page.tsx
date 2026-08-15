import type { Metadata } from "next";
import Link from "next/link";
import { getPopularTools } from "@/lib/tools/registry";

/**
 * Shown by the service worker when a page is requested with no connection and
 * nothing cached for it. Deliberately static and dependency-free: it has to
 * render from the cache with no network at all.
 */
export const metadata: Metadata = {
  // The layout template already appends " | TheCryptoTools".
  title: "Offline",
  robots: { index: false, follow: false },
};

export default function Page() {
  const popular = getPopularTools(6);
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <div className="text-5xl" aria-hidden>
        📴
      </div>
      <h1 className="mt-5 text-4xl font-extrabold tracking-tight">You are offline</h1>
      <p className="muted mt-4 text-lg leading-relaxed">
        This page has not been opened on this device before, so there is no copy saved. Every
        calculator you <em>have</em> opened still works with no connection — the maths runs in your
        browser, not on a server.
      </p>

      <div className="mt-10 text-left">
        <h2 className="mb-4 text-lg font-bold">Try one of these</h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {popular.map((t) => (
            <li key={t.slug}>
              <Link href={`/tools/${t.slug}`} className="card card-hover block p-4 text-sm font-semibold">
                {t.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
