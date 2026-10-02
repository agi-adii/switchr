import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get("title") || "Universal In-Browser File Converter";
    const subtitle =
      searchParams.get("subtitle") ||
      "100% Client-Side WebAssembly. Zero File Uploads. Complete Privacy.";

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "space-between",
            backgroundColor: "#070712",
            backgroundImage:
              "radial-gradient(circle at 25% 25%, rgba(99, 102, 241, 0.25) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(168, 85, 247, 0.2) 0%, transparent 50%)",
            padding: "80px",
            fontFamily: "sans-serif",
            color: "#ffffff",
          }}
        >
          {/* Header Brand */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "14px",
                background: "linear-gradient(135deg, #6366f1, #a855f7)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
                fontWeight: "bold",
              }}
            >
              ⚡
            </div>
            <span style={{ fontSize: "32px", fontWeight: "900", letterSpacing: "-0.5px" }}>
              Switchr
            </span>
            <span
              style={{
                fontSize: "14px",
                fontWeight: "700",
                padding: "6px 12px",
                borderRadius: "999px",
                background: "rgba(99, 102, 241, 0.2)",
                border: "1px solid rgba(99, 102, 241, 0.4)",
                color: "#a5b4fc",
                marginLeft: "8px",
              }}
            >
              100% PRIVATE &amp; FREE
            </span>
          </div>

          {/* Main Title & Subtitle */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "960px" }}>
            <h1
              style={{
                fontSize: "60px",
                fontWeight: "900",
                lineHeight: "1.1",
                letterSpacing: "-1.5px",
                color: "#ffffff",
                margin: 0,
              }}
            >
              {title}
            </h1>
            <p
              style={{
                fontSize: "24px",
                color: "#94a3b8",
                lineHeight: "1.4",
                margin: 0,
              }}
            >
              {subtitle}
            </p>
          </div>

          {/* Footer Badges */}
          <div style={{ display: "flex", gap: "24px", fontSize: "16px", color: "#cbd5e1" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span>🔒 Zero Cloud Uploads</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span>⚡ WebAssembly Hardware Accelerated</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span>🌐 Works Offline in Browser</span>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    return new Response(`Failed to generate OG image: ${e.message}`, { status: 500 });
  }
}
