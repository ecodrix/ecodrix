import withBundleAnalyzer from "@next/bundle-analyzer";
import type { NextConfig } from "next";

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

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
   * ERIX Help lives on doc.ecodrix.com (files in app/(help)/help): the host
   * serves those pages at its root. `doc.localhost` works the same in dev.
   * Files (images, _next, anything with an extension) pass through.
   * status.ecodrix.com (and status.localhost) serves app/(statushost)/status-host at its root.
   */
  async rewrites() {
    const docHost = [{ type: "host" as const, value: "doc\\.(ecodrix\\.com|localhost)" }];
    const statusHost = [{ type: "host" as const, value: "status\\.(ecodrix\\.com|localhost)" }];
    return {
      beforeFiles: [
        // status.ecodrix.com: its root is the status page (app/(statushost)/status-host).
        { source: "/", has: statusHost, destination: "/status-host" },
        { source: "/", has: docHost, destination: "/help" },
        { source: "/:path((?!help(?:/|$)|_next/|api/|.*\\.[a-z0-9]+$).*)", has: docHost, destination: "/help/:path" },
      ],
    };
  },

  async redirects() {
    const docHost = [{ type: "host" as const, value: "doc\\.(ecodrix\\.com|localhost)" }];
    const brandHost = [{ type: "host" as const, value: "(www\\.)?ecodrix\\.com" }];
    const help = [
      // Clean addresses on the help host: /help/x → /x (files excluded).
      { source: "/help", has: docHost, destination: "/", permanent: false },
      { source: "/help/:path((?!.*\\.[a-z0-9]+$).*)", has: docHost, destination: "/:path", permanent: false },
      // The brand site sends help readers to the help host.
      { source: "/help", has: brandHost, destination: "https://doc.ecodrix.com", permanent: false },
      {
        source: "/help/:path((?!.*\\.[a-z0-9]+$).*)",
        has: brandHost,
        destination: "https://doc.ecodrix.com/:path",
        permanent: false,
      },
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
      // The status page moved to its own host; old links and the SLA redirects land there.
      { source: "/status", has: brandHost, destination: "https://status.ecodrix.com", permanent: false },
      ...legal.map((slug) => ({
        source: `/${slug}`,
        destination: `/legal/${slug}`,
        permanent: true,
      })),
      // No SLA until paid plans (founder, 28 Oct 2026): the status page shows real uptime.
      { source: "/sla", destination: "/status", permanent: false },
      { source: "/legal/sla", destination: "/status", permanent: false },
      // LAIE stays private until it solves a real problem (founder, 3 Nov 2026).
      // Temporary redirects, so its pages can come back when it goes public.
      { source: "/laie/:path*", destination: "/platform", permanent: false },
      { source: "/platform/erix-laie", destination: "/platform", permanent: false },
      { source: "/platform/erix-laie/:path*", destination: "/platform", permanent: false },
      // The waitlist invite email (server waitlist-email-templates.ts) links here.
      { source: "/get-started", destination: "/#contact", permanent: false },
      // Internal engines aren't marketed (founder, 27 Oct 2026): their old pages land on what customers get.
      { source: "/platform/erix-store", destination: "/platform", permanent: true },
      { source: "/platform/erix-store/:path*", destination: "/platform", permanent: true },
    ];
  },

  // Turbopack configuration (Next.js 16+ default)
  // Empty config to acknowledge Turbopack usage and silence webpack warning
  turbopack: {},

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
