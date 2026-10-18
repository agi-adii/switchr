"use client";

import { useState, useEffect, useRef } from "react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import QRCode from "qrcode";
import { QrCode, Download, Copy, Check, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function QrGeneratorPage() {
  const [text, setText] = useState("https://switchrx.vercel.app");
  const [dataUrl, setDataUrl] = useState<string>("");
  const [colorDark, setColorDark] = useState("#000000");
  const [colorLight, setColorLight] = useState("#ffffff");
  const [errorCorrection, setErrorCorrection] = useState<"L" | "M" | "Q" | "H">("M");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!text.trim()) {
      setDataUrl("");
      return;
    }

    QRCode.toDataURL(text, {
      width: 400,
      margin: 2,
      color: {
        dark: colorDark,
        light: colorLight,
      },
      errorCorrectionLevel: errorCorrection,
    })
      .then((url) => setDataUrl(url))
      .catch((err) => console.error(err));
  }, [text, colorDark, colorLight, errorCorrection]);

  const handleDownload = () => {
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = "switchr-qr-code.png";
    a.click();
    toast.success("QR code downloaded as PNG");
  };

  const handleCopy = () => {
    if (!dataUrl) return;
    navigator.clipboard.writeText(dataUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("QR code Data URL copied");
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <Breadcrumbs items={[{ label: "Tools", href: "/tools" }, { label: "QR Code Generator" }]} />

      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR Code Generator
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
          Create high-resolution, custom-styled QR codes for websites, WiFi networks, and plain text instantly.
        </p>
      </div>

      <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Settings & Text Input */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">Text or URL Content</label>
            <textarea
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter URL or text..."
              className="w-full bg-muted/30 border border-border rounded-xl p-3 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-muted-foreground mb-1">Foreground Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={colorDark}
                  onChange={(e) => setColorDark(e.target.value)}
                  className="w-8 h-8 rounded-lg border border-border cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={colorDark}
                  onChange={(e) => setColorDark(e.target.value)}
                  className="w-24 text-xs font-mono px-2 py-1 bg-background border border-border rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-muted-foreground mb-1">Background Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={colorLight}
                  onChange={(e) => setColorLight(e.target.value)}
                  className="w-8 h-8 rounded-lg border border-border cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={colorLight}
                  onChange={(e) => setColorLight(e.target.value)}
                  className="w-24 text-xs font-mono px-2 py-1 bg-background border border-border rounded-lg"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
              Error Correction Level
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(["L", "M", "Q", "H"] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setErrorCorrection(lvl)}
                  className={`py-1.5 text-xs font-bold rounded-lg border transition-colors ${
                    errorCorrection === lvl
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background border-border text-foreground hover:bg-muted"
                  }`}
                >
                  {lvl} ({lvl === "L" ? "7%" : lvl === "M" ? "15%" : lvl === "Q" ? "25%" : "30%"})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* QR Code Preview */}
        <div className="flex flex-col items-center justify-center p-6 bg-muted/20 border border-border rounded-2xl space-y-4">
          {dataUrl ? (
            <>
              <div className="p-4 bg-white rounded-2xl shadow-sm border border-border/50">
                <img src={dataUrl} alt="Generated QR code" className="w-52 h-52 object-contain" />
              </div>

              <div className="flex items-center gap-2 w-full justify-center">
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download PNG
                </button>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-2 bg-background hover:bg-muted text-foreground text-xs font-semibold rounded-xl border border-border transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <QrCode className="w-12 h-12 mx-auto mb-2 opacity-40" />
              <p className="text-xs">Enter content to generate QR code</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
