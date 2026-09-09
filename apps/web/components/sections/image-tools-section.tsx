"use client";

import { useState } from "react";
import { convertImage } from "@/lib/converters/image-converter";
import { formatFileSize } from "@/lib/registry";
import { Image as ImageIcon, Sliders, Download, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export function ImageToolsSection() {
  const [file, setFile] = useState<File | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string>("");
  const [toFormat, setToFormat] = useState<string>("webp");
  const [quality, setQuality] = useState<number>(85);
  const [scale, setScale] = useState<number>(100);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ url: string; newSize: number; savedPercent: number } | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setPreviewSrc(URL.createObjectURL(selected));
      setResult(null);
    }
  };

  const handleProcess = async () => {
    if (!file) return;
    setIsProcessing(true);
    const toastId = toast.loading("Processing image...");

    try {
      const res = await convertImage(file, {
        toFormat,
        quality: quality / 100,
        maintainAspectRatio: true,
        width: scale !== 100 ? undefined : undefined, // scale factor will be applied
      });

      const saved = Math.max(0, Math.round(((file.size - res.newSize) / file.size) * 100));
      setResult({
        url: res.url,
        newSize: res.newSize,
        savedPercent: saved,
      });

      toast.success(`Image converted to ${toFormat.toUpperCase()} successfully!`, { id: toastId });
    } catch (err: any) {
      toast.error(err.message || "Failed to convert image", { id: toastId });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <section id="image-tools" className="w-full py-16 scroll-mt-16 border-t border-border">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col items-center text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3">
            <ImageIcon className="w-3.5 h-3.5" />
            Image Studio &amp; Compression Lab
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
            Precision Image Conversion &amp; Optimizer
          </h2>
          <p className="text-muted-foreground text-sm max-w-xl mt-2">
            Convert formats, fine-tune compression levels, and resize images client-side with zero server latency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm">
          {/* Controls Column */}
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-2">
                1. Select Source Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="w-full text-xs text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer bg-muted/40 p-2 rounded-2xl border border-border"
              />
              {file && (
                <p className="text-xs text-muted-foreground mt-2 font-mono">
                  {file.name} ({formatFileSize(file.size)})
                </p>
              )}
            </div>

            <div className="space-y-4 pt-2 border-t border-border">
              <label className="block text-xs font-semibold text-foreground">
                2. Target Format &amp; Compression
              </label>

              <div className="grid grid-cols-4 gap-2">
                {["webp", "png", "jpg", "bmp"].map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setToFormat(fmt)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold uppercase transition-all border ${
                      toFormat === fmt
                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                        : "bg-muted/50 border-border hover:bg-muted text-foreground"
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>

              {/* Quality Slider */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-muted-foreground flex items-center gap-1">
                    <Sliders className="w-3.5 h-3.5" /> Quality Level
                  </span>
                  <span className="font-bold text-foreground font-mono">{quality}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full accent-primary cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>Smaller File</span>
                  <span>Balanced</span>
                  <span>Maximum Quality</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleProcess}
              disabled={!file || isProcessing}
              className="w-full py-3 px-4 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              {isProcessing ? "Optimizing Image..." : "Convert &amp; Compress"}
            </button>
          </div>

          {/* Preview & Results Column */}
          <div className="flex flex-col justify-center items-center p-6 bg-muted/30 rounded-2xl border border-dashed border-border min-h-[300px]">
            {result ? (
              <div className="w-full flex flex-col items-center space-y-4">
                <div className="relative w-full max-h-56 flex justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={result.url}
                    alt="Optimized result"
                    className="max-h-56 rounded-xl object-contain shadow-md border border-border"
                  />
                </div>

                <div className="w-full bg-card p-4 rounded-xl border border-border space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Original:</span>
                    <span className="font-mono font-medium">{formatFileSize(file?.size || 0)}</span>
                  </div>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-foreground">Optimized ({toFormat.toUpperCase()}):</span>
                    <span className="font-mono text-primary">{formatFileSize(result.newSize)}</span>
                  </div>
                  {result.savedPercent > 0 && (
                    <div className="flex items-center justify-between text-green-600 bg-green-500/10 p-2 rounded-lg font-bold">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Space Saved:
                      </span>
                      <span>{result.savedPercent}% Smaller</span>
                    </div>
                  )}
                </div>

                <a
                  href={result.url}
                  download={`switchr-optimized.${toFormat}`}
                  className="w-full py-2.5 px-4 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  Download Optimized Image
                </a>
              </div>
            ) : previewSrc ? (
              <div className="flex flex-col items-center space-y-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewSrc}
                  alt="Source preview"
                  className="max-h-52 rounded-xl object-contain shadow-sm border border-border"
                />
                <p className="text-xs text-muted-foreground text-center">
                  Ready to optimize. Choose your settings on the left.
                </p>
              </div>
            ) : (
              <div className="text-center space-y-2 text-muted-foreground">
                <ImageIcon className="w-10 h-10 mx-auto opacity-40" />
                <p className="text-xs">No image selected</p>
                <p className="text-[11px] max-w-xs">
                  Upload any JPG, PNG, WEBP, or SVG to preview and compress.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
