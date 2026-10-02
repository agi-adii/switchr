import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Switchr - Free Universal File Converter & PDF Suite";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
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
            "radial-gradient(circle at 20% 20%, rgba(99, 102, 241, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(168, 85, 247, 0.25) 0%, transparent 50%)",
          padding: "80px",
          fontFamily: "sans-serif",
          color: "#ffffff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #6366f1, #a855f7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "28px",
            }}
          >
            ⚡
          </div>
          <span style={{ fontSize: "36px", fontWeight: "900", letterSpacing: "-0.5px" }}>
            Switchr
          </span>
          <span
            style={{
              fontSize: "14px",
              fontWeight: "700",
              padding: "6px 14px",
              borderRadius: "999px",
              background: "rgba(99, 102, 241, 0.2)",
              border: "1px solid rgba(99, 102, 241, 0.4)",
              color: "#a5b4fc",
              marginLeft: "12px",
            }}
          >
            FREE &amp; 100% PRIVATE
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "18px", maxWidth: "980px" }}>
          <h1
            style={{
              fontSize: "64px",
              fontWeight: "900",
              lineHeight: "1.1",
              letterSpacing: "-2px",
              color: "#ffffff",
              margin: 0,
            }}
          >
            Universal In-Browser File Converter &amp; PDF Suite
          </h1>
          <p
            style={{
              fontSize: "24px",
              color: "#94a3b8",
              lineHeight: "1.4",
              margin: 0,
            }}
          >
            Convert images, videos, audio, documents, and PDFs locally with WebAssembly. Zero uploads. Total privacy.
          </p>
        </div>

        <div style={{ display: "flex", gap: "32px", fontSize: "16px", color: "#cbd5e1" }}>
          <span>🔒 0 Server Bytes</span>
          <span>⚡ WebAssembly Fast</span>
          <span>📄 200+ Formats Supported</span>
          <span>🌐 Offline Capable</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
