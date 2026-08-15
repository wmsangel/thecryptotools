/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fully static export → produces an `out/` folder you can upload to ANY host
  // (shared hosting/FTP, Netlify, Cloudflare Pages, GitHub Pages). No Node,
  // no database, no API keys. Every tool runs in the browser.
  output: "export",
  reactStrictMode: true,
  poweredByHeader: false,
  // next/image can't optimize on a static host — serve images as-is.
  images: { unoptimized: true },
  // Emit /tools/foo as /tools/foo/index.html so plain file hosts serve it.
  trailingSlash: true,
};

export default nextConfig;
