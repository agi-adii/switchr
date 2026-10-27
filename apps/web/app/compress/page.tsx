"use client";

import { useState } from "react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { GlassPillTabs } from "@/components/ui/glass-pill-tabs";
import { convertImage } from "@/lib/converters/image-converter";
import { compressPdf } from "@/lib/converters/pdf-tools";
import { formatFileSize } from "@/lib/registry";
import {
  Minimize2,
  Image as ImageIcon,
  FileText,
  Download,
  Sliders,
  CheckCircle2,
  UploadCloud,
  Music,
  Video,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { saveHistoryItem } from "@/lib/history-store";

export default function CompressPage() {
  const [activeType, setActiveType] = useState<"image" | "pdf">("image");
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(70);
  const [isCompressing, setIsCompressing] = useState(false);
  const [result, setResult] = useState<{ url: string; newSize: number; saved: number } | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  const handleCompress = async () => {
    if (!file) return;
    setIsCompressing(true);
    const toastId = toast.loading("Compressing file in browser...");

    try {
      if (activeType === "image") {
        const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
        const res = await convertImage(file, {
          toFormat: ext === "png" ? "webp" : ext,
          quality: quality / 100,
        });

        const saved = Math.max(0, Math.round(((file.size - res.newSize) / file.size) * 100));
        setResult({
          url: res.url,
          newSize: res.newSize,
          saved,
        });

        saveHistoryItem({
          fileName: `compressed-${file.name}`,
          fromFormat: ext,
          toFormat: ext === "png" ? "webp" : ext,
          originalSize: file.size,
          convertedSize: res.newSize,
          downloadUrl: res.url,
          category: "compress",
        });

        toast.success(
          saved > 0 ? `Compressed! Saved ${saved}%` : "Processed! Image is already at maximum efficiency.",
          { id: toastId }
        );
      } else {
        // Genuine Client-Side PDF Compression
        const compressedPdfBlob = await compressPdf(file, quality / 100);
        const url = URL.createObjectURL(compressedPdfBlob);
        const newSize = compressedPdfBlob.size;
        const saved = Math.max(0, Math.round(((file.size - newSize) / file.size) * 100));

        setResult({
          url,
          newSize,
          saved,
        });

        saveHistoryItem({
          fileName: `compressed-${file.name}`,
          fromFormat: "pdf",
          toFormat: "pdf",
          originalSize: file.size,
          convertedSize: newSize,
          downloadUrl: url,
          category: "compress",
        });

        toast.success(
          saved > 0 ? `Compressed! Saved ${saved}%` : "Processed! PDF is already at optimal size.",
          { id: toastId }
        );
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to compress file", { id: toastId });
    } finally {
      setIsCompressing(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-8 px-4 sm:px-6">
      <Breadcrumbs items={[{ label: "Compress" }]} />

      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold mb-2">
          <Minimize2 className="w-3.5 h-3.5" />
          Compression Lab
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Reduce File Size
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
          Compress photos and PDF documents directly in your browser without sacrificing essential visual clarity.
        </p>

        {/* Glassmorphic Pill Tab Switcher */}
        <div className="mt-6 flex justify-center">
          <GlassPillTabs
            activeTab={activeType}
            onChange={(tabId) => {
              setActiveType(tabId as "image" | "pdf");
              setFile(null);
              setResult(null);
            }}
            layoutId="compressPageTab"
            tabs={[
              { id: "image", label: "Photos & Images", icon: <ImageIcon className="w-4 h-4 text-blue-500" /> },
              { id: "pdf", label: "PDF Document", icon: <FileText className="w-4 h-4 text-red-500" /> },
            ]}
          />
        </div>
      </div>

      <div className="glass-surface relative rounded-3xl p-6 sm:p-8 space-y-6 overflow-hidden">
        <div className="glass-specular" />
        {/* File Select Area */}
        {!file ? (
          <label className="glass-dropzone rounded-2xl w-full aspect-[2.6/1] sm:aspect-[3.2/1] flex flex-col items-center justify-center p-6 cursor-pointer group">
            <div className="glass-specular" />
            <input
              type="file"
              accept={activeType === "image" ? "image/*" : ".pdf,application/pdf"}
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 text-primary flex items-center justify-center mb-3 backdrop-blur-sm shadow-sm group-hover:scale-105 transition-transform">
              <UploadCloud className="w-7 h-7" />
            </div>
            <p className="text-sm sm:text-base font-bold text-white">
              Drop your {activeType === "image" ? "IMAGE" : "PDF"} file here
            </p>
            <p className="text-xs text-white/70 mt-1">
              or <span className="text-primary font-semibold underline underline-offset-2">browse</span> to compress
            </p>
          </label>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-xs text-white">
              <div>
                <p className="font-bold text-white truncate max-w-xs">{file.name}</p>
                <p className="text-white/70 font-mono mt-0.5">
                  Original: {formatFileSize(file.size)}
                </p>
              </div>
              <button
                onClick={() => {
                  setFile(null);
                  setResult(null);
                }}
                className="text-xs font-semibold text-white/70 hover:text-white cursor-pointer transition-colors"
              >
                Change File
              </button>
            </div>

            {/* Quality Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-white/80 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5" /> Compression Level:
                </span>
                <span className="font-mono text-primary font-bold">{100 - quality}% Target Reduction</span>
              </div>
              <input
                type="range"
                min="30"
                max="90"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full accent-primary cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-white/60">
                <span>Maximum Compression</span>
                <span>Balanced</span>
                <span>Best Quality</span>
              </div>
            </div>

            <button
              onClick={handleCompress}
              disabled={isCompressing}
              className="w-full py-3 px-4 bg-primary text-primary-foreground font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-primary/90 transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Minimize2 className="w-4 h-4" />
              {isCompressing ? "Compressing File..." : "Start Compression"}
            </button>

            {/* Results Comparison */}
            {result && (
              <div className="p-6 rounded-2xl bg-green-500/15 border border-green-500/30 text-center space-y-4 backdrop-blur-md">
                <div className="flex items-center justify-center gap-2 text-green-300 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Compression Finished!</span>
                </div>

                <div className="grid grid-cols-3 gap-2 py-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-xs text-white">
                  <div>
                    <span className="text-[10px] text-white/60 block">Original</span>
                    <span className="font-mono font-bold text-white">
                      {formatFileSize(file.size)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-white/60 block">Compressed</span>
                    <span className="font-mono font-bold text-primary">
                      {formatFileSize(result.newSize)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-white/60 block">Saved</span>
                    <span className="font-mono font-bold text-green-400">
                      {result.saved}%
                    </span>
                  </div>
                </div>

                <a
                  href={result.url}
                  download={`compressed-${file.name}`}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  Download Compressed File
                </a>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Media Transcoding Info Cards */}
      <div className="mt-8 space-y-3">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          Looking to optimize Audio or Video?
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <Link
            href="/convert/audio"
            className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/25 hover:bg-white/10 transition-all flex items-center justify-between group block"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Music className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                  Audio Bitrate Optimizer
                </h4>
                <p className="text-[11px] text-muted-foreground">
                  Transcode MP3, WAV, AAC with custom bitrates
                </p>
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-transform" />
          </Link>

          <Link
            href="/convert/video"
            className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/25 hover:bg-white/10 transition-all flex items-center justify-between group block"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center">
                <Video className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                  Video Converter &amp; WebM
                </h4>
                <p className="text-[11px] text-muted-foreground">
                  Re-encode heavy clips to lightweight web formats
                </p>
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
