import { realpathSync } from "node:fs";
import path from "node:path";
import withBundleAnalyzer from "@next/bundle-analyzer";
import type { NextConfig } from "next";

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

// In the local pnpm workspace `next` is installed in the workspace root's store, outside this
// repo, and Turbopack resolves packages only inside its root. A standalone clone (Vercel, the
// VM image) has it inside the project, so the default root stays.
const nextDir = realpathSync(path.join(__dirname, "node_modules/next"));
const workspaceRoot = nextDir.startsWith(`${__dirname}${path.sep}`)
  ? undefined
  : nextDir.slice(0, nextDir.indexOf(`${path.sep}node_modules${path.sep}`));

const nextConfig: NextConfig = {
  // A self-contained server in `.next/standalone` (server.js + only the
  // node_modules it traces): what the image on the web VM runs. Vercel ignores it.
  output: "standalone",
  reactCompiler: true,

  // Brotli/Gzip compression at the Node server level
  compress: true,

  // Remove the X-Powered-By: Next.js fingerprinting header
  poweredByHeader: false,

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "cdn.ecodrix.com" },
      { protocol: "https", hostname: "ecodrix.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
    // Modern formats improve LCP — Next.js serves WebP/AVIF automatically
    formats: ["image/avif", "image/webp"],
  },

  // Security response headers applied to every route. No Cache-Control for
  // /_next/static: Next already serves it `immutable` in production, and a
  // custom one made browsers keep stale dev chunks (dev file names aren't
  // hashed), which showed up as hydration errors after code changes.
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Enables DNS prefetching for third-party origins (GA4, fonts)
          { key: "X-DNS-Prefetch-Control", value: "on" },
          // Prevents MIME-type sniffing attacks
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Only send origin in the Referer header for cross-origin requests
          { key: "Referrer-Policy", value: "origin-when-cross-origin" },
          // Prevent clickjacking
          { key: "X-Frame-Options", value: "DENY" },
          // Disable browser features that aren't needed
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },

  // Old root-level policy URLs (and the sitemap's old /laie/audit) live under
  // /legal and /platform now. Permanent redirects keep links in app stores,
  // Meta / Google OAuth consent screens and old search results working.
  /**
   * doc.ecodrix.com (and doc.localhost in dev) serves app/(docs)/doc-host at its root: ERIX Help
   * at `/`, the API reference at `/api`, the changelog at `/changelog`. Files (images, _next,
   * anything with an extension) pass through; its own sitemap is served here too (robots.txt reads the host in app/robots.ts).
   * status.ecodrix.com (and status.localhost) serves app/(statushost)/status-host at its root.
   */
  async rewrites() {
    const docHost = [{ type: "host" as const, value: "doc\\.(ecodrix\\.com|localhost)" }];
    const statusHost = [{ type: "host" as const, value: "status\\.(ecodrix\\.com|localhost)" }];
    return {
      beforeFiles: [
        { source: "/", has: statusHost, destination: "/status-host" },
        { source: "/", has: docHost, destination: "/doc-host" },
        { source: "/sitemap.xml", has: docHost, destination: "/doc-host/sitemap.xml" },
        {
          source: "/:path((?!doc-host(?:/|$)|_next/|.*\\.[a-z0-9]+$).*)",
          has: docHost,
          destination: "/doc-host/:path",
        },
      ],
    };
  },

  async redirects() {
    const docHost = [{ type: "host" as const, value: "doc\\.(ecodrix\\.com|localhost)" }];
    // The brand site is every host except doc. and status.: the moved pages redirect only here, so
    // the doc and status hosts never loop, and localhost:3100 in dev follows the same rules.
    const brandOnly = [{ type: "host" as const, value: "(doc|status)\\.(ecodrix\\.com|localhost)" }];
    const noFile = "(?!.*\\.[a-z0-9]+$).*";
    const DOCS = "https://doc.ecodrix.com";
    const moved = [
      // Help, the API docs and the changelog moved to doc.ecodrix.com (founder, 24 Nov 2026).
      { source: "/docs", destination: `${DOCS}/api` },
      { source: "/docs/:path*", destination: `${DOCS}/api/:path*` },
      { source: "/help", destination: DOCS },
      { source: `/help/:path(${noFile})`, destination: `${DOCS}/:path` },
      { source: "/changelog", destination: `${DOCS}/changelog` },
      // What's new is merged into the changelog.
      { source: "/whats-new", destination: `${DOCS}/changelog` },
      // The status page lives only on its own host.
      { source: "/status", destination: "https://status.ecodrix.com" },
    ].map((r) => ({ ...r, missing: brandOnly, permanent: true }));
    const help = [
      // Clean addresses on the doc host: /help/x → /x (files excluded), the old /docs → /api.
      { source: "/help", has: docHost, destination: "/", permanent: false },
      { source: `/help/:path(${noFile})`, has: docHost, destination: "/:path", permanent: false },
      { source: "/docs", has: docHost, destination: "/api", permanent: true },
    ];
    const legal = [
      "privacy",
      "terms",
      "cookie-policy",
      "acceptable-use",
      "dpa",
      "pricing-policy",
      "refund-policy",
      "security",
      "subprocessors",
      "whatsapp-policy",
    ];
    return [
      ...help,
      ...moved,
      ...legal.map((slug) => ({
        source: `/${slug}`,
        destination: `/legal/${slug}`,
        permanent: true,
      })),
      // No SLA until paid plans (founder, 28 Oct 2026): the status page shows real uptime.
      { source: "/sla", destination: "https://status.ecodrix.com", permanent: false },
      { source: "/legal/sla", destination: "https://status.ecodrix.com", permanent: false },
      // LAIE stays private until it solves a real problem (founder, 3 Nov 2026).
      // Temporary redirects, so its pages can come back when it goes public.
      { source: "/laie/:path*", destination: "/platform", permanent: false },
      { source: "/platform/erix-laie", destination: "/platform", permanent: false },
      { source: "/platform/erix-laie/:path*", destination: "/platform", permanent: false },
      // The waitlist invite email (server waitlist-email-templates.ts) links here.
      { source: "/get-started", destination: "/#contact", permanent: false },
      // Internal engines aren't marketed (founder, 27 Oct 2026): their old pages land on what customers get.
      { source: "/platform/erix-store", destination: "/platform", permanent: true },
      // ERIX Storage is off the site until it returns (founder, 24 Nov 2026): old links and search results land on the platform page.
      { source: "/platform/erix-storage", destination: "/platform", permanent: true },
      { source: "/platform/erix-storage/:slug*", destination: "/platform", permanent: true },
      { source: "/platform/erix-store/:path*", destination: "/platform", permanent: true },
    ];
  },

  // Turbopack configuration (Next.js 16+ default)
  // Empty config to acknowledge Turbopack usage and silence webpack warning
  // File tracing must use the same root as Turbopack, or `.next/standalone` misses packages.
  ...(workspaceRoot && { outputFileTracingRoot: workspaceRoot }),
  turbopack: workspaceRoot ? { root: workspaceRoot } : {},

  // Webpack configuration for advanced bundle optimization
  // Only used when explicitly running with --webpack flag
  webpack: (config, { isServer }) => {
    // Configure code splitting and chunk optimization
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: "all",
        cacheGroups: {
          // Framework chunk (React, React-DOM) - shared across all pages
          framework: {
            test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
            name: "framework",
            priority: 40,
            reuseExistingChunk: true,
          },
          // Heavy libraries chunk - lazy-loaded only when needed
          heavyLibs: {
            test: /[\\/]node_modules[\\/](framer-motion|gsap|lenis)[\\/]/,
            name: "heavy-libs",
            priority: 30,
            reuseExistingChunk: true,
          },
          // Common utilities and components
          commons: {
            name: "commons",
            minChunks: 2,
            priority: 20,
            reuseExistingChunk: true,
          },
          // Other vendor dependencies
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendor",
            priority: 10,
            reuseExistingChunk: true,
          },
        },
      };
      // Single runtime chunk for better caching
      config.optimization.runtimeChunk = "single";
    }

    return config;
  },
};

// Cast to the analyzer's expected config type. `@next/bundle-analyzer` can
// resolve a different hoisted Next.js version's `NextConfig` in the pnpm
// monorepo, so we align the argument type to whatever version it expects.
export default bundleAnalyzer(nextConfig as Parameters<typeof bundleAnalyzer>[0]);
