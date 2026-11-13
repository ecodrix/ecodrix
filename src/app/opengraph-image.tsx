import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "ECODrIx: every WhatsApp message and call answered, booked and followed up";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Literal colours: CSS variables don't resolve inside ImageResponse.
const NAVY = "#0b1b64"; // nav / --mk-navy
const SWOOSH = "#b251d3"; // hero-swoosh (purple-500)
const DOT = "#cc5a57"; // hero-dot (red-500)
const LINK = "#9db2ff";

/**
 * Social share card: the DS navy `OGCard` (the ERIX mark, logo swoosh + red dot,
 * one blue bloom). Used for Open Graph and Twitter, and named by every page-level
 * `openGraph.images`.
 */
// ponytail: the title uses the default sans because next/og can't read our woff2 Bricolage; add a Bricolage TTF/OTF to load it here.
export default async function Image() {
  // The canonical mark (public/logo.svg), cropped to the mark's box (x 90-410, y 146-330) of its 500x500 canvas.
  const svg = await fetch(new URL("../../public/logo.svg", import.meta.url)).then((r) => r.text());
  const logo = `data:image/svg+xml;base64,${btoa(svg.replace('width="100%" viewBox="0 0 500 500"', 'viewBox="90 146 320 184"'))}`;
  return new ImageResponse(
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        padding: "72px",
        backgroundColor: NAVY,
        backgroundImage: "radial-gradient(60% 80% at 90% 0%, rgba(43, 77, 203, 0.55), transparent 70%)",
        color: "#ffffff",
        fontFamily: "sans-serif",
      }}
    >
      <svg width="1200" height="630" viewBox="0 0 1200 630" style={{ position: "absolute", left: 0, top: 0 }}>
        <path
          d="M260 900 C 600 380 900 300 1320 330"
          fill="none"
          stroke={SWOOSH}
          strokeWidth="80"
          strokeLinecap="round"
          opacity="0.5"
        />
        <circle cx="1166" cy="330" r="18" fill={DOT} />
      </svg>
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          {/* The mark alone on the card's own navy: no plate behind it. next/og renders a plain <img>. */}
          <img src={logo} width={90} height={52} alt="" />
          <div style={{ fontSize: "34px", fontWeight: 800, letterSpacing: "-0.02em" }}>ECODrIx</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", maxWidth: "820px" }}>
          <div style={{ fontSize: "24px", fontWeight: 700, color: LINK }}>ERIX for Indian businesses</div>
          <div
            style={{
              marginTop: "18px",
              fontSize: "70px",
              fontWeight: 800,
              lineHeight: 1.04,
              letterSpacing: "-0.035em",
            }}
          >
            Every message and call answered, booked and followed up.
          </div>
          <div style={{ marginTop: "24px", fontSize: "26px", lineHeight: 1.45, color: "rgba(255,255,255,0.8)" }}>
            WhatsApp and phone calls in one inbox, an AI agent, a pipeline and automatic follow-ups.
          </div>
        </div>
        <div style={{ fontSize: "22px", fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>ecodrix.com</div>
      </div>
    </div>,
    { ...size },
  );
}
