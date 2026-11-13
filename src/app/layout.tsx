import type { Metadata } from "next";
import localFont from "next/font/local";
import { CONSENT_BOOT_SCRIPT, GA_LOADER_SCRIPT } from "@/lib/legal/consent";
import "./globals.css";
import Script from "next/script";
import { AutoEventTracker } from "@/components/analytics/AutoEventTracker";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { VisitorTracker } from "@/components/analytics/VisitorTracker";
import { WebVitals } from "@/components/analytics/WebVitals";
import { Check, Cookie, ShieldCheck, X } from "@/components/icons";
import { CookieConsent } from "@/components/legal/CookieConsent";
import { MotionRoot } from "@/components/motion/motion";
import { MotionProvider } from "@/components/motion/motion-provider";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { getOrganizationSchema, getPersonSchema, getSoftwareApplicationSchema, getWebSiteSchema } from "@/lib/jsonld";
import { cn } from "@/lib/utils";

// ERIX design system type, self-hosted (SIL OFL — licences in ./fonts):
// Bricolage Grotesque for headings, Manrope for text, JetBrains Mono for code.
// The files are Latin + ₹ subsets of the design system's fonts (pyftsubset,
// Google Fonts "latin" range plus U+20B9, all axes and layout features kept),
// ~45 KB lighter. Re-subset if a font file is replaced.
const bricolage = localFont({
  src: "./fonts/bricolage-grotesque.woff2",
  weight: "200 800",
  variable: "--font-bricolage",
  display: "swap",
});

const manrope = localFont({
  src: "./fonts/manrope.woff2",
  weight: "200 800",
  variable: "--font-manrope",
  display: "swap",
});

const jetbrains = localFont({
  src: "./fonts/jetbrains-mono.woff2",
  weight: "100 800",
  variable: "--font-jetbrains",
  display: "swap",
  // Only a few invoice numbers use it: don't spend first-load bandwidth on it.
  preload: false,
});

const BASE_URL = "https://ecodrix.com";

export const metadata: Metadata = {
  // Required for OG/Twitter absolute URLs to resolve correctly
  metadataBase: new URL(BASE_URL),

  title: {
    default: "ECODrIx | Unified Business Infrastructure Platform",
    // Page-level overrides use this template
    template: "%s | ECODrIx",
  },
  description:
    "ERIX by ECODrIx: one workspace for Indian businesses that sell on WhatsApp. Inbox, AI agents, CRM and automation.",
  keywords: [
    "CRM software",
    "business automation",
    "WhatsApp Business API",
    "lead management system",
    "sales pipeline software",
    "workflow automation",
    "cloud storage",
    "SaaS platform India",
    "ECODrIx",
    "Dhanesh M",
    "Dhanesh Mekalthuru",
    "ERIX CRM",
    "ERIX-FLOW",
    "Socket.io chat",
    "custom node marketplace",
  ],
  authors: [{ name: "ECODrIx", url: BASE_URL }],
  creator: "ECODrIx",
  publisher: "ECODrIx",
  category: "technology",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },

  // Open Graph
  openGraph: {
    title: "ECODrIx | Unified Business Infrastructure Platform",
    description:
      "ERIX by ECODrIx: one workspace for Indian businesses that sell on WhatsApp. Inbox, AI agents, CRM and automation.",
    siteName: "ECODrIx",
    type: "website",
    locale: "en_IN",
    alternateLocale: ["en_US", "en_GB"],
  },

  // Twitter / X card
  twitter: {
    card: "summary_large_image",
    title: "ECODrIx | Unified Business Infrastructure Platform",
    description: "One inbox, AI agents, CRM and automation for Indian businesses that sell on WhatsApp.",
    site: "@ecodrix",
    creator: "@ecodrix",
  },

  // Icons — wired to existing /public assets
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/favicon-16x16.png",
  },

  // Google Search Console verification - add your token when available
  verification: {
    google: "1G7-mS5pi6DXI5YRIvJABKDEKG1B80YgMaIUw8h2dNQ", // TODO: Replace with actual GSC verification token
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      // The consent boot script sets data-consent before hydration.
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={cn("font-sans", bricolage.variable, manrope.variable, jetbrains.variable)}
    >
      <head>
        <script
          id="consent-boot"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: static boot script
          dangerouslySetInnerHTML={{
            __html: `${CONSENT_BOOT_SCRIPT}gtag('js',new Date());gtag('config','G-DK8Q4TLZPM',{send_page_view:false,anonymize_ip:true});`,
          }}
        />
        {/* gtag.js loads only after the visitor allows analytics (see GA_LOADER_SCRIPT). */}
        <Script id="google-tags" strategy="afterInteractive">
          {GA_LOADER_SCRIPT}
        </Script>

        <script
          src="https://cdn.jsdelivr.net/npm/@ecodrix/chatbot@2/dist/index.global.js"
          data-erix="ECODRIX_OWN"
          async
        ></script>
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

        {/* JSON-LD structured data — must be in <head> for crawler visibility */}
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: controlled JSON-LD data
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getOrganizationSchema()),
          }}
        />
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: controlled JSON-LD data
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getWebSiteSchema()),
          }}
        />
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: controlled JSON-LD data
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getSoftwareApplicationSchema()),
          }}
        />
        {/* Person schema — anchors "who is Dhanesh M" knowledge-panel
            queries on Google, Bing, and AI answer engines. */}
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: controlled JSON-LD data
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getPersonSchema()),
          }}
        />
      </head>
      {/* Browser extensions (e.g. ColorZilla) add attributes to <body> before React loads. */}
      <body className="antialiased" suppressHydrationWarning>
        {/* SPA page view tracking — fires on every client-side navigation */}
        <GoogleAnalytics />
        <VisitorTracker />
        <AutoEventTracker />
        {/* Core Web Vitals reporting to GA4 */}
        <WebVitals />
        <MotionRoot />
        <SmoothScroll />
        <CookieConsent
          icons={{
            cookie: <Cookie size={18} className="text-accent" />,
            close: <X size={18} />,
            check: <Check size={15} />,
            shield: <ShieldCheck size={15} />,
          }}
        />
        <MotionProvider>
          <div className="bg-surface text-foreground overflow-clip min-h-screen flex flex-col">
            {/* Each area brings its own header and footer: (brand) and (docs) route groups. */}
            {children}
          </div>
        </MotionProvider>
      </body>
    </html>
  );
}
