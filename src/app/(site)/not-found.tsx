import type { Metadata } from "next";
import Link from "next/link";
import { getPopularTools } from "@/lib/tools/registry";
import { ToolCard } from "@/components/ToolCard";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  const popular = getPopularTools(6);
  return (
    <div className="mx-auto max-w-content px-4 py-16 text-center">
      <h1 className="text-5xl font-extrabold">404</h1>
      <p className="muted mt-3">This page or tool doesn&apos;t exist.</p>
      <Link href="/" className="btn-primary mt-6">Back to home</Link>

      <div className="mt-12 text-left">
        <h2 className="mb-4 text-xl font-bold">Popular tools</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {popular.map((t) => (
            <ToolCard key={t.slug} tool={t} />
          ))}
        </div>
      </div>
    </div>
  );
}
